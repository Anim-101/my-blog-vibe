import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, AlertTriangle, Activity, Terminal, Database, Trash2 } from 'lucide-react';
import './PipelineSimulator.css';

// Node configurations and positions (normalized 0 to 1)
const NODES_CONFIG = [
  // Ingestion (Stage 0)
  { id: 'iot', stage: 0, hPos: { x: 0.12, y: 0.25 }, vPos: { x: 0.2, y: 0.12 }, color: '#c084fc', category: 'ingestion' },
  { id: 'api', stage: 0, hPos: { x: 0.12, y: 0.50 }, vPos: { x: 0.5, y: 0.12 }, color: '#c084fc', category: 'ingestion' },
  { id: 'cdc', stage: 0, hPos: { x: 0.12, y: 0.75 }, vPos: { x: 0.8, y: 0.12 }, color: '#c084fc', category: 'ingestion' },
  
  // Validation (Stage 1)
  { id: 'schema', stage: 1, hPos: { x: 0.38, y: 0.25 }, vPos: { x: 0.2, y: 0.38 }, color: '#60a5fa', category: 'validation' },
  { id: 'dedup', stage: 1, hPos: { x: 0.38, y: 0.50 }, vPos: { x: 0.5, y: 0.38 }, color: '#60a5fa', category: 'validation' },
  { id: 'compliance', stage: 1, hPos: { x: 0.38, y: 0.75 }, vPos: { x: 0.8, y: 0.38 }, color: '#60a5fa', category: 'validation' },
  
  // Transformation (Stage 2)
  { id: 'joiner', stage: 2, hPos: { x: 0.64, y: 0.25 }, vPos: { x: 0.2, y: 0.64 }, color: '#34d399', category: 'transformation' },
  { id: 'aggregator', stage: 2, hPos: { x: 0.64, y: 0.50 }, vPos: { x: 0.5, y: 0.64 }, color: '#34d399', category: 'transformation' },
  { id: 'anomaly', stage: 2, hPos: { x: 0.64, y: 0.75 }, vPos: { x: 0.8, y: 0.64 }, color: '#34d399', category: 'transformation' },
  
  // Storage (Stage 3)
  { id: 'datalake', stage: 3, hPos: { x: 0.88, y: 0.20 }, vPos: { x: 0.15, y: 0.88 }, color: '#fb923c', category: 'storage' },
  { id: 'snowflake', stage: 3, hPos: { x: 0.88, y: 0.42 }, vPos: { x: 0.40, y: 0.88 }, color: '#fb923c', category: 'storage' },
  { id: 'cache', stage: 3, hPos: { x: 0.88, y: 0.64 }, vPos: { x: 0.65, y: 0.88 }, color: '#fb923c', category: 'storage' },
  { id: 'dlq', stage: 3, hPos: { x: 0.88, y: 0.86 }, vPos: { x: 0.88, y: 0.88 }, color: '#f87171', category: 'failure' }
];

// Helper to calculate cubic Bezier coordinates
const getCubicBezierPoint = (p0, cp1, cp2, p3, t) => {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  const x = mt3 * p0.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * p3.x;
  const y = mt3 * p0.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * p3.y;

  return { x, y };
};

// Generate deterministic message batch names for mock logs
const getLogMessage = (type, nodeName, isJa) => {
  const id = Math.floor(1000 + Math.random() * 9000);
  if (isJa) {
    switch (type) {
      case 'success':
        return `[SUCCESS] メッセージ ID ${id} が正常に ${nodeName} へ配信されました。`;
      case 'schema':
        return `[ERROR] ID ${id}: スキーマ検証エラー。バージョン不一致を検出、DLQへルーティングします。`;
      case 'timeout':
        return `[WARN] ID ${id}: 送信ゲートウェイ接続タイムアウト。パケットを破棄し、DLQに保存しました。`;
      case 'dedup':
        return `[WARN] ID ${id}: 重複メッセージを検出しました。Redisの冪等性チェックにより除外されました。`;
      default:
        return `[INFO] ID ${id} を処理中...`;
    }
  } else {
    switch (type) {
      case 'success':
        return `[SUCCESS] Message ID ${id} successfully delivered to ${nodeName}.`;
      case 'schema':
        return `[ERROR] ID ${id}: Schema validation failed. Struct mismatch detected, routing to DLQ.`;
      case 'timeout':
        return `[WARN] ID ${id}: Connection timeout on target gateway. Packet dropped and saved to DLQ.`;
      case 'dedup':
        return `[WARN] ID ${id}: Duplicate message ID found. Filtered out by Redis idempotency registry.`;
      default:
        return `[INFO] Processing message ID ${id}...`;
    }
  }
};

const PipelineSimulator = () => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  // React States for Interactive Controls & Inspecting
  const [isPlaying, setIsPlaying] = useState(true);
  const [throughput, setThroughput] = useState(300); // msg/sec
  const [errorRate, setErrorRate] = useState(2); // %
  const [selectedNode, setSelectedNode] = useState(null);

  // Stats State updated at throttled intervals
  const [stats, setStats] = useState({
    ingested: 0,
    processed: 0,
    dlq: 0,
    latency: 12,
    backpressure: 5
  });

  // scrolling console logs state
  const [logs, setLogs] = useState(() => {
    const time = new Date().toLocaleTimeString();
    const jaMsg1 = 'データパイプラインシミュレーターを開始しました。';
    const enMsg1 = 'Data pipeline simulation workspace initialized.';
    const jaMsg2 = '取引およびサプライチェーンのデータストリーム受信準備完了。';
    const enMsg2 = 'Listening on webhook and trading system endpoints for transaction events.';
    return [
      { id: 'log-init-1', text: `[${time}] ${isJa ? jaMsg1 : enMsg1}`, type: 'system' },
      { id: 'log-init-2', text: `[${time}] ${isJa ? jaMsg2 : enMsg2}`, type: 'info' }
    ];
  });

  // DOM Refs
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const terminalBodyRef = useRef(null);

  // Simulator Engine Refs (to read/write inside RAF loop at 60fps without causing React cascades)
  const isPlayingRef = useRef(isPlaying);
  const throughputRef = useRef(throughput);
  const errorRateRef = useRef(errorRate);
  const particlesRef = useRef([]);
  const countsRef = useRef({ ingested: 0, processed: 0, dlq: 0 });
  const manualFailureRef = useRef(null);
  const spawnAccumulatorRef = useRef(0);
  const frameCountRef = useRef(0);

  // Sync state variables with refs
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { throughputRef.current = throughput; }, [throughput]);
  useEffect(() => { errorRateRef.current = errorRate; }, [errorRate]);

  // Log auto-scroll (scrolls only the terminal body container internally)
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  // Push logger helper
  const addLog = useCallback((text, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => {
      const updated = [...prev, { id: `log-${Date.now()}-${Math.random()}`, text: `[${time}] ${text}`, type }];
      return updated.slice(-25); // Limit logs to prevent DOM overload
    });
  }, []);

  // Node details computed derived state
  const selectedNodeDetails = useMemo(() => {
    if (!selectedNode) return null;
    return {
      name: t(`experience.pipeline.nodes.${selectedNode.id}.name`),
      tech: t(`experience.pipeline.nodes.${selectedNode.id}.tech`),
      animExp: t(`experience.pipeline.nodes.${selectedNode.id}.animExp`),
      category: selectedNode.category,
      color: selectedNode.color
    };
  }, [selectedNode, t]);

  const selectedNodeRef = useRef(selectedNode);
  const tRef = useRef(t);
  const isJaRef = useRef(isJa);
  const addLogRef = useRef(addLog);

  // Sync refs inside effect to avoid render-phase writes
  useEffect(() => {
    selectedNodeRef.current = selectedNode;
    tRef.current = t;
    isJaRef.current = isJa;
    addLogRef.current = addLog;
  }, [selectedNode, t, isJa, addLog]);

  // Initialize Canvas simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isMobile = window.innerWidth < 768;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      isMobile = window.innerWidth < 768;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial logs on start

    // Canvas coordinate projections
    const getNodePixels = (node) => {
      const pos = isMobile ? node.vPos : node.hPos;
      return {
        x: pos.x * canvas.width,
        y: pos.y * canvas.height
      };
    };

    // Physics Update and Canvas Paint Loop
    const tick = () => {
      frameCountRef.current++;

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Grid Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = isMobile ? 30 : 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Stage Column Dividers
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1.5;
      if (!isMobile) {
        const columns = [width * 0.25, width * 0.51, width * 0.76];
        const stagesText = [
          tRef.current('experience.pipeline.stages.ingestion'),
          tRef.current('experience.pipeline.stages.validation'),
          tRef.current('experience.pipeline.stages.transformation'),
          tRef.current('experience.pipeline.stages.storage')
        ];

        columns.forEach((colX) => {
          ctx.beginPath();
          ctx.moveTo(colX, 0);
          ctx.lineTo(colX, height);
          ctx.stroke();
        });

        // Labels
        ctx.setLineDash([]);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.textAlign = 'center';
        
        ctx.fillText(stagesText[0], width * 0.125, 25);
        ctx.fillText(stagesText[1], width * 0.38, 25);
        ctx.fillText(stagesText[2], width * 0.635, 25);
        ctx.fillText(stagesText[3], width * 0.88, 25);
      } else {
        const rows = [height * 0.25, height * 0.51, height * 0.76];
        const stagesText = [
          tRef.current('experience.pipeline.stages.ingestion'),
          tRef.current('experience.pipeline.stages.validation'),
          tRef.current('experience.pipeline.stages.transformation'),
          tRef.current('experience.pipeline.stages.storage')
        ];

        rows.forEach((rowY) => {
          ctx.beginPath();
          ctx.moveTo(0, rowY);
          ctx.lineTo(width, rowY);
          ctx.stroke();
        });

        // Mobile Labels
        ctx.setLineDash([]);
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.textAlign = 'left';

        ctx.fillText(stagesText[0], 15, 20);
        ctx.fillText(stagesText[1], 15, height * 0.28);
        ctx.fillText(stagesText[2], 15, height * 0.54);
        ctx.fillText(stagesText[3], 15, height * 0.79);
      }
      ctx.setLineDash([]); // Reset dash

      // 3. Draw Connection Paths
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      
      // Ingestion (0) -> Validation (1)
      const ingNodes = NODES_CONFIG.filter(n => n.stage === 0);
      const valNodes = NODES_CONFIG.filter(n => n.stage === 1);
      const transNodes = NODES_CONFIG.filter(n => n.stage === 2);
      const storeNodes = NODES_CONFIG.filter(n => n.stage === 3 && n.id !== 'dlq');
      const dlqNode = NODES_CONFIG.find(n => n.id === 'dlq');

      ingNodes.forEach(fromNode => {
        valNodes.forEach(toNode => {
          const fromPix = getNodePixels(fromNode);
          const toPix = getNodePixels(toNode);
          ctx.beginPath();
          ctx.moveTo(fromPix.x, fromPix.y);
          if (isMobile) {
            ctx.bezierCurveTo(fromPix.x, fromPix.y + (toPix.y - fromPix.y) * 0.5, toPix.x, fromPix.y + (toPix.y - fromPix.y) * 0.5, toPix.x, toPix.y);
          } else {
            ctx.bezierCurveTo(fromPix.x + (toPix.x - fromPix.x) * 0.5, fromPix.y, fromPix.x + (toPix.x - fromPix.x) * 0.5, toPix.y, toPix.x, toPix.y);
          }
          ctx.stroke();
        });
      });

      // Validation (1) -> Transformation (2)
      valNodes.forEach(fromNode => {
        transNodes.forEach(toNode => {
          const fromPix = getNodePixels(fromNode);
          const toPix = getNodePixels(toNode);
          ctx.beginPath();
          ctx.moveTo(fromPix.x, fromPix.y);
          if (isMobile) {
            ctx.bezierCurveTo(fromPix.x, fromPix.y + (toPix.y - fromPix.y) * 0.5, toPix.x, fromPix.y + (toPix.y - fromPix.y) * 0.5, toPix.x, toPix.y);
          } else {
            ctx.bezierCurveTo(fromPix.x + (toPix.x - fromPix.x) * 0.5, fromPix.y, fromPix.x + (toPix.x - fromPix.x) * 0.5, toPix.y, toPix.x, toPix.y);
          }
          ctx.stroke();
        });
      });

      // Transformation (2) -> Storage (3)
      transNodes.forEach(fromNode => {
        storeNodes.forEach(toNode => {
          const fromPix = getNodePixels(fromNode);
          const toPix = getNodePixels(toNode);
          ctx.beginPath();
          ctx.moveTo(fromPix.x, fromPix.y);
          if (isMobile) {
            ctx.bezierCurveTo(fromPix.x, fromPix.y + (toPix.y - fromPix.y) * 0.5, toPix.x, fromPix.y + (toPix.y - fromPix.y) * 0.5, toPix.x, toPix.y);
          } else {
            ctx.bezierCurveTo(fromPix.x + (toPix.x - fromPix.x) * 0.5, fromPix.y, fromPix.x + (toPix.x - fromPix.x) * 0.5, toPix.y, toPix.x, toPix.y);
          }
          ctx.stroke();
        });
      });

      // Validation (1) -> DLQ (3)
      valNodes.forEach(fromNode => {
        const fromPix = getNodePixels(fromNode);
        const dlqPix = getNodePixels(dlqNode);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.beginPath();
        ctx.moveTo(fromPix.x, fromPix.y);
        if (isMobile) {
          ctx.bezierCurveTo(fromPix.x, fromPix.y + (dlqPix.y - fromPix.y) * 0.5, dlqPix.x, fromPix.y + (dlqPix.y - fromPix.y) * 0.5, dlqPix.x, dlqPix.y);
        } else {
          ctx.bezierCurveTo(fromPix.x + (dlqPix.x - fromPix.x) * 0.5, fromPix.y, fromPix.x + (dlqPix.x - fromPix.x) * 0.5, dlqPix.y, dlqPix.x, dlqPix.y);
        }
        ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; // Reset stroke

      // 4. Update and Draw Particles (if playing)
      if (isPlayingRef.current) {
        // Accumulate spawn rates based on throughput. 60 FPS baseline.
        // Scale throughput visually so the canvas doesn't become overcrowded.
        const spawnMultiplier = 0.005; 
        spawnAccumulatorRef.current += throughputRef.current * spawnMultiplier;

        while (spawnAccumulatorRef.current >= 1) {
          // Spawn new particle at a random Ingestion node
          const startNode = ingNodes[Math.floor(Math.random() * ingNodes.length)];
          
          // Determine failure condition
          let isFailed = Math.random() * 100 < errorRateRef.current;
          let failType = null;

          // Check manual override
          if (manualFailureRef.current) {
            isFailed = true;
            failType = manualFailureRef.current;
            manualFailureRef.current = null;
          }

          // Direct fails to their corresponding validation node if possible
          let targetValidationNode;
          if (failType === 'schema') {
            targetValidationNode = valNodes.find(n => n.id === 'schema') || valNodes[Math.floor(Math.random() * valNodes.length)];
          } else if (failType === 'dedup') {
            targetValidationNode = valNodes.find(n => n.id === 'dedup') || valNodes[Math.floor(Math.random() * valNodes.length)];
          } else {
            targetValidationNode = valNodes[Math.floor(Math.random() * valNodes.length)];
          }

          particlesRef.current.push({
            id: `p-${Date.now()}-${Math.random()}`,
            fromNode: startNode,
            toNode: targetValidationNode,
            progress: 0,
            speed: 0.012 + Math.random() * 0.008,
            isFailed,
            failureType: failType,
            phase: 0 // 0: ing->val, 1: val->trans/DLQ, 2: trans->store
          });

          countsRef.current.ingested++;
          spawnAccumulatorRef.current -= 1;
        }

        // Update particle physics
        particlesRef.current.forEach((p) => {
          p.progress += p.speed;

          if (p.progress >= 1) {
            p.progress = 0;

            if (p.phase === 0) {
              // Transition from Ingestion -> Validation node
              p.fromNode = p.toNode;
              p.phase = 1;

              if (p.isFailed) {
                const errorType = p.failureType || (Math.random() > 0.5 ? 'schema' : 'timeout');
                p.failureType = errorType;
                addLogRef.current(getLogMessage(errorType, tRef.current(`experience.pipeline.nodes.${p.fromNode.id}.name`), isJaRef.current), 'warn');

                if (errorType === 'dedup') {
                  // Duplicate packets are filtered out immediately at the validation node
                  p.progress = 2; // Flag for deletion
                } else {
                  p.toNode = dlqNode;
                }
              } else {
                p.toNode = transNodes[Math.floor(Math.random() * transNodes.length)];
              }
            } else if (p.phase === 1) {
              // Transition from Validation -> Transformation OR DLQ
              p.fromNode = p.toNode;

              if (p.isFailed) {
                // Arrived at DLQ
                countsRef.current.dlq++;
                addLogRef.current(isJaRef.current ? `[DLQ] パケットがデッドレターキューに隔離されました。` : `[DLQ] Quarantined corrupted packet in storage.`, 'error');
                p.progress = 2; // Flag for deletion
              } else {
                // Transition to Transformation -> Storage
                p.phase = 2;
                p.toNode = storeNodes[Math.floor(Math.random() * storeNodes.length)];
              }
            } else if (p.phase === 2) {
              // Arrived at Storage
              countsRef.current.processed++;
              if (Math.random() < 0.15) { // Log 15% of successes to prevent terminal flood
                addLogRef.current(getLogMessage('success', tRef.current(`experience.pipeline.nodes.${p.fromNode.id}.name`), isJaRef.current), 'success');
              }
              p.progress = 2; // Flag for deletion
            }
          }
        });

        // Filter out completed particles
        particlesRef.current = particlesRef.current.filter(p => p.progress <= 1);
      }

      // Draw Particles
      particlesRef.current.forEach((p) => {
        const fromPix = getNodePixels(p.fromNode);
        const toPix = getNodePixels(p.toNode);

        // Compute Bezier Curve points
        let cp1, cp2;
        if (isMobile) {
          cp1 = { x: fromPix.x, y: fromPix.y + (toPix.y - fromPix.y) * 0.5 };
          cp2 = { x: toPix.x, y: fromPix.y + (toPix.y - fromPix.y) * 0.5 };
        } else {
          cp1 = { x: fromPix.x + (toPix.x - fromPix.x) * 0.5, y: fromPix.y };
          cp2 = { x: fromPix.x + (toPix.x - fromPix.x) * 0.5, y: toPix.y };
        }

        const currentPos = getCubicBezierPoint(fromPix, cp1, cp2, toPix, p.progress);

        // Particle colors
        let pColor = p.isFailed && p.phase > 0 ? '#ef4444' : p.phase === 2 ? '#34d399' : '#a855f7';

        // Draw particle glow
        ctx.fillStyle = pColor + '44';
        ctx.beginPath();
        ctx.arc(currentPos.x, currentPos.y, isMobile ? 6 : 9, 0, Math.PI * 2);
        ctx.fill();

        // Draw core particle
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(currentPos.x, currentPos.y, isMobile ? 2.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw Pipeline Nodes
      NODES_CONFIG.forEach(node => {
        const pix = getNodePixels(node);
        const isClicked = selectedNodeRef.current && selectedNodeRef.current.id === node.id;

        // Node Glow Border
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isClicked ? 15 : 6;
        ctx.fillStyle = isClicked ? node.color : 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isClicked ? 3 : 1.5;

        // Draw node circle
        ctx.beginPath();
        const radius = isMobile ? 12 : 16;
        ctx.arc(pix.x, pix.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw node icon/dot inside
        ctx.shadowBlur = 0; // Reset shadow glow
        ctx.fillStyle = isClicked ? '#0f172a' : node.color;
        ctx.beginPath();
        ctx.arc(pix.x, pix.y, isMobile ? 4 : 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw Label Text
        ctx.font = isMobile ? '9px sans-serif' : '11px sans-serif';
        ctx.fillStyle = isClicked ? '#fff' : 'rgba(255, 255, 255, 0.75)';
        ctx.textAlign = 'center';
        
        const labelOffset = isMobile ? 20 : 25;
        // On vertical flow (mobile), shift text labels horizontally to avoid vertical overlaps
        if (isMobile) {
          ctx.fillText(tRef.current(`experience.pipeline.nodes.${node.id}.name`).split(' ')[0], pix.x, pix.y + labelOffset);
        } else {
          ctx.fillText(tRef.current(`experience.pipeline.nodes.${node.id}.name`), pix.x, pix.y + labelOffset);
        }
      });

      // 6. Throttled UI State Syncing (approx. 6 times per second to prevent React render locks)
      if (frameCountRef.current % 10 === 0) {
        // Latency simulation formula: based on throughput load and error rate anomalies
        const baseLatency = 8;
        const loadDelay = (throughputRef.current / 1500) * 12;
        const errorDelay = errorRateRef.current > 10 ? 8 : 0;
        const jitter = Math.random() * 3;
        const latencyVal = Math.round(baseLatency + loadDelay + errorDelay + jitter);

        // System backpressure representation
        const backpressureVal = Math.min(100, Math.floor((throughputRef.current / 3000) * 100));

        setStats({
          ingested: countsRef.current.ingested,
          processed: countsRef.current.processed,
          dlq: countsRef.current.dlq,
          latency: latencyVal,
          backpressure: backpressureVal
        });
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    // Begin Animation Loop
    tick();

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Click Handler for Node Inspections
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);
    const isMobile = window.innerWidth < 768;

    // Detect if we clicked near any node (within hit bounds)
    const hitRadius = isMobile ? 22 : 30;
    const clicked = NODES_CONFIG.find(node => {
      const pos = isMobile ? node.vPos : node.hPos;
      const pixelX = pos.x * canvas.width;
      const pixelY = pos.y * canvas.height;
      const dist = Math.sqrt((clickX - pixelX) ** 2 + (clickY - pixelY) ** 2);
      return dist <= hitRadius;
    });

    if (clicked) {
      setSelectedNode(clicked);
      addLog(isJa ? `[DIAGNOSTICS] ノード ${t(`experience.pipeline.nodes.${clicked.id}.name`)} を検証中...` : `[DIAGNOSTICS] Querying system registers for node: ${t(`experience.pipeline.nodes.${clicked.id}.name`)}`, 'info');
    }
  };

  // Failure Injection triggers
  const handleInjectFailure = (type) => {
    manualFailureRef.current = type;
    const errText = type === 'schema' ? 'SCHEMA' : type === 'timeout' ? 'TIMEOUT' : 'DEDUPLICATION SPIKE';
    addLog(isJa ? `[SYSTEM] 手動で ${errText} エラーをストリームに注入しました。` : `[SYSTEM] Manual ${errText} fault injected into active ingest payload.`, 'system');
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Success rate calculated derived state
  const totalCompleted = stats.processed + stats.dlq;
  const successRate = totalCompleted === 0 ? 100 : parseFloat(((stats.processed / totalCompleted) * 100).toFixed(2));

  return (
    <div className="pipeline-simulator-card glass-card animate-in">
      <div className="pipeline-title-area">
        <h2>{t('experience.pipeline.title')} <span className="text-gradient">{t('experience.pipeline.subtitle')}</span></h2>
        <p>{t('experience.pipeline.desc')}</p>
      </div>

      {/* 4-Column Live Metrics */}
      <div className="pipeline-metrics-grid">
        <div className="pipeline-metric-tile">
          <span className="metric-label">{t('experience.pipeline.metrics.ingested')}</span>
          <span className="metric-number text-gradient">{stats.ingested.toLocaleString()}</span>
        </div>
        <div className="pipeline-metric-tile metric-success">
          <span className="metric-label">{t('experience.pipeline.metrics.success')}</span>
          <span className="metric-number" style={{ color: successRate > 90 ? '#10b981' : '#f87171' }}>{successRate}%</span>
        </div>
        <div className="pipeline-metric-tile metric-latency">
          <span className="metric-label">{t('experience.pipeline.metrics.latency')}</span>
          <span className="metric-number text-gradient">{stats.latency} ms</span>
        </div>
        <div className="pipeline-metric-tile metric-dlq">
          <span className="metric-label">{t('experience.pipeline.metrics.dlq')}</span>
          <span className="metric-number" style={{ color: stats.dlq > 0 ? '#f87171' : '#cbd5e1' }}>{stats.dlq.toLocaleString()}</span>
        </div>
      </div>

      {/* Main interactive grid containing canvas and descriptions */}
      <div className="pipeline-main-layout">
        {/* Canvas container */}
        <div className="pipeline-canvas-container">
          <canvas 
            ref={canvasRef} 
            className="pipeline-canvas"
            onClick={handleCanvasClick}
          />
        </div>

        {/* Info detail card */}
        <div className={`pipeline-info-drawer ${selectedNode ? 'active-inspect' : ''}`}>
          <div className="drawer-header">
            <h3>{selectedNode ? selectedNodeDetails.name : t('experience.pipeline.nodeDetail.title')}</h3>
            {selectedNode && (
              <span className={`node-category-tag tag-${selectedNodeDetails.category}`}>
                {t(`experience.pipeline.stages.${selectedNodeDetails.category}`)}
              </span>
            )}
          </div>
          <div className="drawer-body">
            {selectedNode ? (
              <div>
                <span className="section-label">{t('experience.pipeline.nodeDetail.techSpecs')}</span>
                <p className="tech-diag-text">{selectedNodeDetails.tech}</p>

                <span className="section-label">{t('experience.pipeline.nodeDetail.animExp')}</span>
                <div className="experience-box">
                  {selectedNodeDetails.animExp}
                </div>
              </div>
            ) : (
              <p className="drawer-placeholder">
                {t('experience.pipeline.nodeDetail.selectNode')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Terminal Logs row */}
      <div className="pipeline-bottom-grid">
        {/* Controls Card */}
        <div className="pipeline-controls-card">
          <h3>{t('experience.pipeline.controls.title')}</h3>

          {/* Toggle Flow */}
          <div className="control-btn-row">
            <button 
              className={`btn-control ${isPlaying ? 'btn-danger-control' : 'btn-primary-control'}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? t('experience.pipeline.controls.pause') : t('experience.pipeline.controls.start')}
            </button>
          </div>

          {/* Rate speed Slider */}
          <div className="control-slider-group">
            <div className="control-slider-header">
              <span>{t('experience.pipeline.controls.speed')}</span>
              <span className="slider-val">{throughput} msg/s</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="2000" 
              step="50"
              value={throughput} 
              onChange={(e) => setThroughput(parseInt(e.target.value))}
              className="control-range-input"
            />
          </div>

          {/* Error Rate Slider */}
          <div className="control-slider-group">
            <div className="control-slider-header">
              <span>{t('experience.pipeline.controls.errorRate')}</span>
              <span className="slider-val">{errorRate}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="25" 
              step="1"
              value={errorRate} 
              onChange={(e) => setErrorRate(parseInt(e.target.value))}
              className="control-range-input"
            />
          </div>

          {/* Manual Injections */}
          <div className="control-slider-group">
            <span className="control-slider-header" style={{ marginBottom: '0.2rem' }}>Inject Fault Simulation</span>
            <div className="control-btn-row">
              <button className="btn-control" onClick={() => handleInjectFailure('schema')}>
                <AlertTriangle size={14} style={{ color: '#fbbf24' }} /> {t('experience.pipeline.controls.injectSchema')}
              </button>
              <button className="btn-control" onClick={() => handleInjectFailure('timeout')}>
                <AlertTriangle size={14} style={{ color: '#ef4444' }} /> {t('experience.pipeline.controls.injectTimeout')}
              </button>
              <button className="btn-control" onClick={() => handleInjectFailure('dedup')}>
                <AlertTriangle size={14} style={{ color: '#c084fc' }} /> {t('experience.pipeline.controls.injectDedup')}
              </button>
            </div>
          </div>
        </div>

        {/* Green Monospace System Terminal Logs */}
        <div className="pipeline-terminal-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot dot-red"></span>
              <span className="terminal-dot dot-yellow"></span>
              <span className="terminal-dot dot-green"></span>
            </div>
            <div className="terminal-title">
              <Terminal size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              syslog_daemon.sh
            </div>
            <button className="terminal-clear-btn" onClick={handleClearLogs}>
              <Trash2 size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
              {t('experience.pipeline.controls.clearTerminal')}
            </button>
          </div>
          <div className="terminal-body" ref={terminalBodyRef}>
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`log-line log-${log.type}`}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineSimulator;
