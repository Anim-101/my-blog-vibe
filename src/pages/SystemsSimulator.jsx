import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Network, 
  Database, 
  Server, 
  Cpu, 
  Globe, 
  Activity, 
  Play, 
  Square, 
  Trash2, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  BarChart2, 
  Settings, 
  X,
  ShieldAlert
} from 'lucide-react';
import './SystemsSimulator.css';

const SCENARIOS = {
  normal: {
    name: 'Normal Operations',
    desc: 'All systems are functional. Latency is minimal and cache hits are high.',
    rps: 120,
    latency: 35,
    successRate: 100,
    cacheHitRate: 85,
    status: 'healthy'
  },
  'db-crash': {
    name: 'Database Primary Crash',
    desc: 'Postgres Primary instance is unreachable. Read/Write queries fail, driving error spikes.',
    rps: 150,
    latency: 480,
    successRate: 45,
    cacheHitRate: 20,
    status: 'critical'
  },
  'cache-hotspot': {
    name: 'Cache Stampede / Hotspot',
    desc: 'Redis Cache experiences CPU saturation. Key invalidation forces all traffic to Postgres, causing server bottlenecks.',
    rps: 240,
    latency: 290,
    successRate: 92,
    cacheHitRate: 2,
    status: 'warning'
  },
  'cdn-hit': {
    name: 'High CDN Edge Cache Hit',
    desc: '98% of requests served directly from Cloudflare edge nodes. Backend server remains idle.',
    rps: 500,
    latency: 8,
    successRate: 100,
    cacheHitRate: 98,
    status: 'healthy'
  }
};

const SystemsSimulator = () => {
  const { t, i18n } = useTranslation();
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenario, setScenario] = useState('normal');
  const [telemetry, setTelemetry] = useState({ rps: 0, latency: 0, successRate: 0, cacheHitRate: 0 });
  const [logs, setLogs] = useState([]);
  
  const nodeIdCounter = useRef(0);
  const canvasRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const nodeStart = useRef({ x: 0, y: 0 });
  const draggingNodeId = useRef(null);
  const dragDistance = useRef(0);
  const [draggedNodeId, setDraggedNodeId] = useState(null);

  const lang = i18n.language?.startsWith('ja') ? 'ja' : 'en';

  // Tick telemetry jitter and logs when simulating
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      const targetStats = SCENARIOS[scenario];
      setTelemetry({
        rps: targetStats.rps,
        latency: targetStats.latency,
        successRate: targetStats.successRate,
        cacheHitRate: targetStats.cacheHitRate
      });

      setLogs(prev => [
        { time: new Date().toLocaleTimeString(), text: `[SYSTEM] Scenario initialized: ${targetStats.name}` },
        ...prev
      ]);

      interval = setInterval(() => {
        // Add realistic minor fluctuations (jitter)
        setTelemetry(prev => {
          const jitterRps = Math.max(10, prev.rps + Math.floor(Math.random() * 15) - 7);
          const jitterLat = Math.max(2, prev.latency + Math.floor(Math.random() * 9) - 4);
          const jitterSla = Math.min(100, Math.max(0, prev.successRate + (Math.random() * 1.6 - 0.8)));
          const jitterCache = Math.min(100, Math.max(0, prev.cacheHitRate + (Math.random() * 2 - 1)));
          return {
            rps: jitterRps,
            latency: parseFloat(jitterLat.toFixed(1)),
            successRate: parseFloat(jitterSla.toFixed(1)),
            cacheHitRate: parseFloat(jitterCache.toFixed(1))
          };
        });

        // Add contextual logs based on active nodes and scenario
        const randomLog = getRandomLog(scenario, nodes, lang);
        if (randomLog) {
          setLogs(prev => [
            { time: new Date().toLocaleTimeString(), text: randomLog },
            ...prev.slice(0, 40) // cap logs size
          ]);
        }
      }, 2000);
    } else {
      setTelemetry({ rps: 0, latency: 0, successRate: 0, cacheHitRate: 0 });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, scenario, nodes]);

  const getRandomLog = (scen, placedNodes, language) => {
    const nodeTypes = placedNodes.map(n => n.nodeType);
    const hasDb = nodeTypes.includes('postgres-db');
    const hasCache = nodeTypes.includes('redis-cache');
    const hasCdn = nodeTypes.includes('cdn');

    if (scen === 'db-crash') {
      return language === 'ja'
        ? '[ERROR] [Postgres Primary] クエリタイムアウト。接続プールが枯渇しています。'
        : '[ERROR] [Postgres Primary] Query timeout occurred. Connection pool exhausted.';
    }
    if (scen === 'cache-hotspot') {
      return language === 'ja'
        ? '[WARN] [Redis Cache] CPU使用率が98%に達しています。キャッシュキーの再計算中...'
        : '[WARN] [Redis Cache] CPU utilization reached 98%. Eviction limit exceeded.';
    }
    if (scen === 'cdn-hit') {
      return language === 'ja'
        ? '[INFO] [Cloudflare CDN] エッジヒット率 98.2%。オリジンサーバーへのトラフィックはありません。'
        : '[INFO] [Cloudflare CDN] Edge cache hit rate 98.2%. Origin shield actively protecting backend.';
    }

    // Normal operation logs
    const options = [];
    if (hasCdn) {
      options.push(language === 'ja' 
        ? '[INFO] [Cloudflare CDN] キャッシュヒット。静的リソースをエッジから返却しました。'
        : '[INFO] [Cloudflare CDN] Cache HIT. Returning static assets from Tokyo Edge.');
    }
    if (hasCache) {
      options.push(language === 'ja'
        ? '[INFO] [Redis Cache] セッションキーをインメモリから正常にロードしました。'
        : '[INFO] [Redis Cache] Retrieved session state. Cache Hit Latency: 1.2ms');
    }
    if (hasDb) {
      options.push(language === 'ja'
        ? '[INFO] [Postgres Primary] トランザクションコミット。更新成功。'
        : '[INFO] [Postgres Primary] Transaction committed. Isolation level: Read Committed');
    }
    options.push(language === 'ja'
      ? '[INFO] [Node.js Web App] HTTP 200 OK - /api/v1/profile (32ms)'
      : '[INFO] [Node.js Web App] HTTP 200 OK - /api/v1/profile (32ms)');

    return options[Math.floor(Math.random() * options.length)];
  };

  const catalog = [
    { nodeType: 'client', name: 'Web Client', icon: <Globe size={18} />, desc: 'User web browsers sending requests' },
    { nodeType: 'cdn', name: 'Cloudflare CDN', icon: <Network size={18} />, desc: 'Global edge cache and static assets storage' },
    { nodeType: 'load-balancer', name: 'Nginx Load Balancer', icon: <Activity size={18} />, desc: 'Distributes traffic across server instances' },
    { nodeType: 'web-server', name: 'Node.js Web Server', icon: <Server size={18} />, desc: 'Application runtime executing business logic' },
    { nodeType: 'redis-cache', name: 'Redis Cache', icon: <Cpu size={18} />, desc: 'High-speed in-memory database lookup cache' },
    { nodeType: 'postgres-db', name: 'Postgres Database', icon: <Database size={18} />, desc: 'Primary relational persistent storage' }
  ];

  const addNode = (item) => {
    const defaultX = {
      client: 30,
      cdn: 160,
      'load-balancer': 300,
      'web-server': 440,
      'redis-cache': 580,
      'postgres-db': 580
    };

    const typeNodes = nodes.filter(n => n.nodeType === item.nodeType);
    const count = typeNodes.length;

    let x = defaultX[item.nodeType] || 250;
    let y = 80 + (count * 105);

    // If redis and postgres, separate their Y coordinate
    if (item.nodeType === 'redis-cache') {
      y = 80;
    } else if (item.nodeType === 'postgres-db') {
      y = 220;
    }

    nodeIdCounter.current += 1;
    const newNode = {
      id: `${item.nodeType}-${nodeIdCounter.current}`,
      nodeType: item.nodeType,
      name: `${item.name} #${count + 1}`,
      capacity: 'Standard Option',
      status: 'healthy',
      x,
      y
    };

    setNodes(prev => [...prev, newNode]);
  };

  const handleStartDrag = (e, node) => {
    e.stopPropagation();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    dragStart.current = { x: clientX, y: clientY };
    nodeStart.current = { x: node.x, y: node.y };
    draggingNodeId.current = node.id;
    dragDistance.current = 0;
    setDraggedNodeId(node.id);
  };

  const handleDrag = (e) => {
    if (!draggingNodeId.current) return;
    if (e.cancelable) {
      e.preventDefault();
    }

    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    dragDistance.current = Math.sqrt(dx * dx + dy * dy);

    const canvasWidth = canvasRef.current?.clientWidth || 900;
    const canvasHeight = 400;

    let newX = nodeStart.current.x + dx;
    let newY = nodeStart.current.y + dy;

    newX = Math.max(0, Math.min(newX, canvasWidth - 110));
    newY = Math.max(0, Math.min(newY, canvasHeight - 95));

    setNodes(prev => prev.map(n => n.id === draggingNodeId.current ? { ...n, x: newX, y: newY } : n));
  };

  const handleEndDrag = () => {
    draggingNodeId.current = null;
    setDraggedNodeId(null);
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (dragDistance.current < 5) {
      setSelectedNode(node);
    }
  };

  const deleteNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  };

  const updateNode = (updated) => {
    setNodes(prev => prev.map(n => n.id === updated.id ? updated : n));
    setSelectedNode(updated);
  };

  // Compute connections based on network topology logic
  const getConnections = () => {
    const list = [];
    const clients = nodes.filter(n => n.nodeType === 'client');
    const cdns = nodes.filter(n => n.nodeType === 'cdn');
    const lbs = nodes.filter(n => n.nodeType === 'load-balancer');
    const servers = nodes.filter(n => n.nodeType === 'web-server');
    const caches = nodes.filter(n => n.nodeType === 'redis-cache');
    const dbs = nodes.filter(n => n.nodeType === 'postgres-db');

    clients.forEach(c => {
      if (cdns.length > 0) {
        cdns.forEach(cdn => list.push({ from: c, to: cdn, type: 'healthy' }));
      } else if (lbs.length > 0) {
        lbs.forEach(lb => list.push({ from: c, to: lb, type: 'healthy' }));
      } else {
        servers.forEach(srv => list.push({ from: c, to: srv, type: 'healthy' }));
      }
    });

    cdns.forEach(cdn => {
      if (lbs.length > 0) {
        lbs.forEach(lb => list.push({ from: cdn, to: lb, type: 'healthy' }));
      } else {
        servers.forEach(srv => list.push({ from: cdn, to: srv, type: 'healthy' }));
      }
    });

    lbs.forEach(lb => {
      servers.forEach(srv => list.push({ from: lb, to: srv, type: 'healthy' }));
    });

    servers.forEach(srv => {
      caches.forEach(cache => {
        const type = scenario === 'cache-hotspot' ? 'warning' : 'healthy';
        list.push({ from: srv, to: cache, type });
      });
      dbs.forEach(db => {
        const type = scenario === 'db-crash' ? 'error' : 'healthy';
        list.push({ from: srv, to: db, type });
      });
    });

    return list;
  };

  const connections = getConnections();

  return (
    <div className="systems-simulator-page container animate-in">
      <div className="simulator-header">
        <h1 className="text-gradient">
          {lang === 'ja' ? 'システム設計・トラフィックシミュレーター' : 'Systems Design Flow Simulator'}
        </h1>
        <p>
          {lang === 'ja'
            ? 'ドラッグ＆ドロップでクラウドネットワーク構成を設計し、トラフィックや負荷分散、フェイルオーバーシナリオをシミュレート。'
            : 'Design system topologies, link service nodes, and simulate real-time packet traffic flows under load scenarios.'}
        </p>
      </div>

      {/* Top Controls Panel */}
      <div className="simulator-controls-bar">
        <div className="scenarios-panel">
          <label className="input-label">{lang === 'ja' ? 'シミュレーションシナリオ' : 'Active Scenario'}</label>
          <select 
            className="scenario-select" 
            value={scenario}
            onChange={(e) => {
              setScenario(e.target.value);
              if (isSimulating) {
                setLogs(prev => [
                  { time: new Date().toLocaleTimeString(), text: `[SYSTEM] Switching scenario to: ${SCENARIOS[e.target.value].name}` },
                  ...prev
                ]);
              }
            }}
          >
            <option value="normal">Normal Operations</option>
            <option value="db-crash">Database Crash (Failures Spike)</option>
            <option value="cache-hotspot">Cache Stampede (Cache Bypassed)</option>
            <option value="cdn-hit">CDN Edge Caching (Origin Shield)</option>
          </select>
        </div>

        <div className="action-buttons-group">
          {isSimulating ? (
            <button 
              type="button" 
              className="designer-btn danger animate-pulse" 
              onClick={() => setIsSimulating(false)}
            >
              <Square size={16} />
              <span>{lang === 'ja' ? 'シミュレーション停止' : 'Stop Traffic'}</span>
            </button>
          ) : (
            <button 
              type="button" 
              className="designer-btn primary" 
              onClick={() => {
                if (nodes.length === 0) {
                  setLogs([{ time: new Date().toLocaleTimeString(), text: '[ERROR] Connect nodes on canvas to start traffic simulation.' }]);
                  return;
                }
                setIsSimulating(true);
              }}
            >
              <Play size={16} />
              <span>{lang === 'ja' ? 'シミュレーション開始' : 'Simulate Traffic'}</span>
            </button>
          )}

          <button 
            type="button" 
            className="designer-btn secondary"
            onClick={() => {
              setNodes([]);
              setSelectedNode(null);
              setIsSimulating(false);
              setLogs([]);
            }}
            disabled={nodes.length === 0}
          >
            <Trash2 size={16} />
            <span>{lang === 'ja' ? 'キャンバスクリア' : 'Clear Grid'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="simulator-split-layout">
        {/* Node Catalog Sidebar */}
        <div className="node-catalog-sidebar glass-card">
          <h3 className="sidebar-section-title">{lang === 'ja' ? 'コンポーネント目録' : 'Resource Catalog'}</h3>
          <div className="catalog-nodes-list">
            {catalog.map((item, idx) => (
              <button 
                type="button" 
                key={idx} 
                className="catalog-node-btn"
                onClick={() => addNode(item)}
              >
                <div className="node-btn-icon">{item.icon}</div>
                <div className="node-btn-text">
                  <span className="node-btn-name">{item.name}</span>
                  <span className="node-btn-desc">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Grid Canvas */}
        <div className="simulator-canvas-wrapper glass-card">
          <div className="canvas-header-bar">
            <span className="canvas-indicator-title">
              <Network size={16} />
              <span>{lang === 'ja' ? 'ネットワーク・設計トポロジー' : 'Network Topology Grid'}</span>
            </span>
            {isSimulating && (
              <span className={`status-pill ${SCENARIOS[scenario].status}`}>
                {SCENARIOS[scenario].name}
              </span>
            )}
          </div>

          <div 
            ref={canvasRef}
            className={`simulator-canvas-grid ${isSimulating ? 'simulating' : ''}`}
            onMouseMove={handleDrag}
            onTouchMove={handleDrag}
            onMouseUp={handleEndDrag}
            onTouchEnd={handleEndDrag}
            onMouseLeave={handleEndDrag}
          >
            {nodes.length === 0 ? (
              <div className="grid-empty-state">
                <Network size={54} className="empty-state-icon" />
                <p>{lang === 'ja' ? '左側の目録からコンポーネントをクリックしてトポロジーを作成します。' : 'Select resources from the catalog to populate your system layout.'}</p>
              </div>
            ) : (
              <>
                {/* SVG Connections and animated packets */}
                <svg className="connections-svg-overlay">
                  {connections.map((conn, idx) => {
                    const x1 = conn.from.x + 110;
                    const y1 = conn.from.y + 35;
                    const x2 = conn.to.x;
                    const y2 = conn.to.y + 35;
                    const d = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

                    let color = 'rgba(99, 102, 241, 0.4)';
                    if (conn.type === 'error') color = 'rgba(239, 68, 68, 0.5)';
                    if (conn.type === 'warning') color = 'rgba(245, 158, 11, 0.5)';

                    return (
                      <g key={idx}>
                        <path 
                          d={d}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          className="top-connection-line"
                        />
                        {isSimulating && conn.type !== 'error' && (
                          <circle r="3.5" fill={conn.type === 'warning' ? '#f59e0b' : '#10b981'} className="traffic-packet">
                            <animateMotion dur={scenario === 'cdn-hit' ? '1s' : '2.2s'} repeatCount="indefinite" path={d} />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Placed Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  let icon = <Server size={18} />;
                  let nodeColorClass = 'web-server-node';
                  
                  if (node.nodeType === 'client') {
                    icon = <Globe size={18} />;
                    nodeColorClass = 'client-node';
                  } else if (node.nodeType === 'cdn') {
                    icon = <Network size={18} />;
                    nodeColorClass = 'cdn-node';
                  } else if (node.nodeType === 'load-balancer') {
                    icon = <Activity size={18} />;
                    nodeColorClass = 'lb-node';
                  } else if (node.nodeType === 'redis-cache') {
                    icon = <Cpu size={18} />;
                    nodeColorClass = 'cache-node';
                  } else if (node.nodeType === 'postgres-db') {
                    icon = <Database size={18} />;
                    nodeColorClass = 'db-node';
                  }

                  let nodeAlert = null;
                  if (isSimulating) {
                    if (node.nodeType === 'postgres-db' && scenario === 'db-crash') {
                      nodeAlert = 'CRITICAL';
                    } else if (node.nodeType === 'redis-cache' && scenario === 'cache-hotspot') {
                      nodeAlert = 'SATURATED';
                    }
                  }

                  return (
                    <div 
                      key={node.id}
                      className={`placed-node-card ${nodeColorClass} ${isSelected ? 'selected' : ''} ${nodeAlert ? 'alert-node' : ''}`}
                      style={{ 
                        left: `${node.x}px`, 
                        top: `${node.y}px`,
                        cursor: draggedNodeId === node.id ? 'grabbing' : 'grab'
                      }}
                      onMouseDown={(e) => handleStartDrag(e, node)}
                      onTouchStart={(e) => handleStartDrag(e, node)}
                      onClick={(e) => handleNodeClick(e, node)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSelectedNode(node);
                        }
                      }}
                    >
                      <div className="node-card-icon">{icon}</div>
                      <div className="node-card-labels">
                        <span className="node-card-title">{node.name}</span>
                        <span className="node-card-type">{node.nodeType.toUpperCase()}</span>
                      </div>
                      
                      {nodeAlert && (
                        <div className="node-alert-badge">
                          <ShieldAlert size={10} />
                          <span>{nodeAlert}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* Node settings sidebar / floating overlay */}
            {selectedNode && (
              <div className="floating-settings-overlay" onClick={() => setSelectedNode(null)}>
                <div className="floating-settings-card" onClick={(e) => e.stopPropagation()}>
                  <div className="settings-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
                      <Settings size={16} />
                      <h4>{lang === 'ja' ? 'ノード設定' : 'Component Settings'}</h4>
                    </div>
                    <button type="button" className="close-settings-btn" onClick={() => setSelectedNode(null)}>
                      <X size={16} />
                    </button>
                  </div>

                  <div className="settings-form-body">
                    <div className="input-group">
                      <label>{lang === 'ja' ? 'ノード名' : 'Node Label'}</label>
                      <input 
                        type="text" 
                        value={selectedNode.name}
                        onChange={(e) => updateNode({ ...selectedNode, name: e.target.value })}
                        className="settings-input"
                      />
                    </div>

                    <div className="input-group">
                      <label>{lang === 'ja' ? 'インスタンス容量' : 'Instance Capacity'}</label>
                      <select 
                        value={selectedNode.capacity}
                        onChange={(e) => updateNode({ ...selectedNode, capacity: e.target.value })}
                        className="settings-input"
                      >
                        <option value="Mini Scale">Micro (t3.micro)</option>
                        <option value="Standard Option">Standard (m5.large)</option>
                        <option value="Enterprise Cluster">Cluster (c5.4xlarge Multi-AZ)</option>
                      </select>
                    </div>

                    <button 
                      type="button" 
                      className="designer-btn danger settings-delete-btn"
                      onClick={() => deleteNode(selectedNode.id)}
                    >
                      <Trash2 size={14} />
                      <span>{lang === 'ja' ? 'ノード削除' : 'Remove Node'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Telemetry dashboard & logs block */}
      <div className="simulator-telemetry-section">
        {/* Telemetry Metrics */}
        <div className="telemetry-card glass-card">
          <h3 className="telemetry-title">
            <BarChart2 size={16} />
            <span>{lang === 'ja' ? 'リアルタイムテレメトリ' : 'Live Telemetry Dashboard'}</span>
          </h3>

          <div className="telemetry-grid">
            <div className="telemetry-item">
              <span className="telemetry-val text-gradient">{isSimulating ? `${telemetry.rps} req/s` : '0'}</span>
              <span className="telemetry-label">Throughput (RPS)</span>
            </div>
            
            <div className="telemetry-item">
              <span className="telemetry-val text-gradient">{isSimulating ? `${telemetry.latency} ms` : '0'}</span>
              <span className="telemetry-label">Avg Latency</span>
            </div>

            <div className="telemetry-item">
              <span className={`telemetry-val ${isSimulating && telemetry.successRate < 90 ? 'critical' : 'healthy'}`}>
                {isSimulating ? `${telemetry.successRate}%` : '0%'}
              </span>
              <span className="telemetry-label">SLA Success Rate</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-val text-gradient">{isSimulating ? `${telemetry.cacheHitRate}%` : '0%'}</span>
              <span className="telemetry-label">Cache Hit Ratio</span>
            </div>
          </div>
        </div>

        {/* Live System Logs */}
        <div className="telemetry-card glass-card logs-console-card">
          <h3 className="telemetry-title">
            <Clock size={16} />
            <span>{lang === 'ja' ? 'システムイベントログ' : 'System Event Console'}</span>
          </h3>
          
          <div className="simulator-logs-viewport">
            {logs.length === 0 ? (
              <div className="logs-empty-state">
                <span>{lang === 'ja' ? 'ログは空です。シミュレーションを開始してください。' : 'Simulate Traffic to stream real-time JSON log outputs.'}</span>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="log-row">
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-msg">{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsSimulator;
