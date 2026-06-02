import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SkillsConstellation.css';

const SKILLS_DATA = {
    en: [
        { id: 'react', name: 'React', category: 'Frontend', desc: 'Expert in React SPA development, state management, transitions, hooks, and optimizing render performance.', connections: ['js', 'ts', 'vite'] },
        { id: 'ts', name: 'TypeScript', category: 'Languages', desc: 'Developing robust, statically typed codebases with complex interfaces, generics, and strict compiler safety.', connections: ['js', 'node'] },
        { id: 'js', name: 'JavaScript', category: 'Languages', desc: 'Deep knowledge of modern ES6+ paradigms, asynchronous runtimes (promises/async-await), and client-side DOM events.', connections: ['node', 'react'] },
        { id: 'node', name: 'Node.js', category: 'Backend', desc: 'Building scalable backend REST APIs, WebSocket servers, and scripting utilities in JavaScript.', connections: ['ts', 'docker'] },
        { id: 'aws', name: 'AWS Cloud', category: 'DevOps', desc: 'Certified Solutions Architect – Associate (SAA-C03) designing secure, highly-available architectures, VPCs, IAM policies, and serverless workflows.', connections: ['docker', 'linux'] },
        { id: 'linux', name: 'Red Hat Linux', category: 'DevOps', desc: 'Certified Engineer (RHCE) and Administrator (RHCSA) with perfect 300/300 scores. Automating server deployments and performing kernel optimizations.', connections: ['aws', 'docker'] },
        { id: 'docker', name: 'Docker / Containers', category: 'DevOps', desc: 'Creating efficient containerized application builds, optimizing layer sizes, and managing multi-container service orchestration.', connections: ['node', 'aws', 'linux'] },
        { id: 'ai', name: 'AI Agents', category: 'Emerging Tech', desc: 'Architecting agentic LLM workflows using AutoGen and Semantic Kernel to solve complex conversational tasks.', connections: ['python', 'react'] },
        { id: 'python', name: 'Python', category: 'Languages', desc: 'Used extensively for data engineering pipelines, scripting automation, and machine learning models.', connections: ['ai', 'data'] },
        { id: 'data', name: 'Data Pipelines', category: 'Backend', desc: 'Designing resilient ETL/ELT pipelines, ingestion systems, and cloud database warehouses at Avanade.', connections: ['python', 'aws'] },
        { id: 'opengl', name: 'OpenGL / Graphics', category: 'Emerging Tech', desc: 'Teaching Assistant experience instruction in computer graphics rendering pipelines, custom shaders, and linear algebra math.', connections: ['js'] },
        { id: 'blockchain', name: 'Blockchain', category: 'Emerging Tech', desc: 'Exploring smart contract development, distributed ledgers, and decentralized application paradigms.', connections: ['ts'] }
    ],
    ja: [
        { id: 'react', name: 'React', category: 'フロントエンド', desc: 'ReactによるSPA開発、状態管理、アニメーション遷移、カスタムフック、およびレンダリング速度の最適化に精通。', connections: ['js', 'ts', 'vite'] },
        { id: 'ts', name: 'TypeScript', category: '言語', desc: '厳格なコンパイラ設定と高度なインターフェース設計、ジェネリクスを用いた、堅牢で型安全なコード開発。', connections: ['js', 'node'] },
        { id: 'js', name: 'JavaScript', category: '言語', desc: '非同期処理、最新のES6+構文、クライアントサイドDOMイベントモデルへの深い理解。', connections: ['node', 'react'] },
        { id: 'node', name: 'Node.js', category: 'バックエンド', desc: 'スケーラブルなREST APIサーバー、WebSocketサーバー、およびスクリプトユーティリティの開発。', connections: ['ts', 'docker'] },
        { id: 'aws', name: 'AWS クラウド', category: 'DevOps', desc: 'AWS認定ソリューションアーキテクト（SAA-C03）として、安全で冗長性の高いインフラ、VPC、サーバーレス設計を構築。', connections: ['docker', 'linux'] },
        { id: 'linux', name: 'Red Hat Linux', category: 'DevOps', desc: 'RHCEおよびRHCSAを共に満点（300/300）で合格。Ansible自動化構築やカーネルチューニングを得意とする。', connections: ['aws', 'docker'] },
        { id: 'docker', name: 'Docker / コンテナ', category: 'DevOps', desc: '軽量なアプリケーションコンテナの作成、レイヤー最適化、およびマルチサービス連携環境の管理。', connections: ['node', 'aws', 'linux'] },
        { id: 'ai', name: 'AIエージェント', category: '先端技術', desc: 'Semantic KernelやAutoGenを利用し、複数のLLMを連携させたエージェント対話ワークフローを開発。', connections: ['python', 'react'] },
        { id: 'python', name: 'Python', category: '言語', desc: 'データエンジニアリングの自動処理、自動化スクリプト、機械学習モデルの構築などに幅広く活用。', connections: ['ai', 'data'] },
        { id: 'data', name: 'データパイプライン', category: 'バックエンド', desc: 'アバナード株式会社にて、LNG取引やスマートシステムのデータETL/ELT基盤およびデータウェアハウス構築に従事。', connections: ['python', 'aws'] },
        { id: 'opengl', name: 'OpenGL / グラフィックス', category: '先端技術', desc: '大学での3Dコンピュータ・グラフィックス、レンダリングパイプライン、シェーダーのTA指導経験。', connections: ['js'] },
        { id: 'blockchain', name: 'ブロックチェーン', category: '先端技術', desc: 'スマートコントラクト、分散型台帳、およびWeb3アプリケーションのアーキテクチャ研究。', connections: ['ts'] }
    ]
};

const SkillsConstellation = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === 'ja' ? 'ja' : 'en';
    const skillsList = SKILLS_DATA[lang];

    const canvasRef = useRef(null);
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [hoveredSkill, setHoveredSkill] = useState(null);

    // Track width to handle responsiveness
    const [canvasWidth, setCanvasWidth] = useState(500);

    // Initial state setup: Fibonacci sphere distribution (completely deterministic, satisfying React 19 hook purity)
    const pointsRef = useRef([]);

    // Derived state: defaults to first skill in the current language if none selected
    const selectedSkill = skillsList.find(s => s.id === selectedSkillId) || skillsList[0];

    useEffect(() => {
        const updateWidth = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                const parentWidth = canvasRef.current.parentElement.clientWidth;
                setCanvasWidth(Math.min(500, parentWidth));
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        const radius = 160;
        pointsRef.current = skillsList.map((skill, i) => {
            const theta = Math.acos(2 * ((i + 0.5) / skillsList.length) - 1);
            const phi = Math.sqrt(skillsList.length * Math.PI) * theta;

            return {
                ...skill,
                x3d: radius * Math.sin(theta) * Math.cos(phi),
                y3d: radius * Math.sin(theta) * Math.sin(phi),
                z3d: radius * Math.cos(theta),
                screenX: 0,
                screenY: 0,
                scale: 1,
                opacity: 1
            };
        });
    }, [skillsList]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        
        // Rotation angles velocities
        let rotX = 0.001; // auto-rotation speed
        let rotY = 0.002;
        let targetRotX = 0.001;
        let targetRotY = 0.002;

        let mouseX = 0;
        let mouseY = 0;
        let isMouseOver = false;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isMouseOver = true;

            const centerX = canvasWidth / 2;
            const centerY = canvasWidth / 2;
            targetRotX = (mouseY - centerY) * 0.00015;
            targetRotY = (mouseX - centerX) * 0.00015;
        };

        const handleMouseLeave = () => {
            isMouseOver = false;
            targetRotX = 0.001;
            targetRotY = 0.002;
            setHoveredSkill(null);
        };

        const handleCanvasClick = () => {
            if (hoveredSkill) {
                setSelectedSkillId(hoveredSkill.id);
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('click', handleCanvasClick);

        const render = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasWidth);

            const centerX = canvasWidth / 2;
            const centerY = canvasWidth / 2;
            const depth = 350;
            const radius = 160;

            // Interpolate velocities smoothly (linear interpolation)
            rotX += (targetRotX - rotX) * 0.1;
            rotY += (targetRotY - rotY) * 0.1;

            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);

            // 1. Rotate & project coordinates
            pointsRef.current.forEach((pt) => {
                // Rotate around Y-axis
                const x1 = pt.x3d * cosY - pt.z3d * sinY;
                const z1 = pt.x3d * sinY + pt.z3d * cosY;

                // Rotate around X-axis
                const y2 = pt.y3d * cosX - z1 * sinX;
                const z2 = pt.y3d * sinX + z1 * cosX;

                pt.x3d = x1;
                pt.y3d = y2;
                pt.z3d = z2;

                // Project to 2D
                const scale = depth / (depth + z2);
                pt.screenX = centerX + x1 * scale;
                pt.screenY = centerY + y2 * scale;
                pt.scale = scale;
                pt.opacity = (z2 + radius) / (2 * radius) * 0.6 + 0.4;
            });

            // 2. Hit-testing for hover state
            if (isMouseOver) {
                let foundHover = null;
                let minDist = 24; // trigger range pixels

                pointsRef.current.forEach((pt) => {
                    const dist = Math.sqrt((mouseX - pt.screenX) ** 2 + (mouseY - pt.screenY) ** 2);
                    if (dist < minDist) {
                        minDist = dist;
                        foundHover = pt;
                    }
                });

                // Update state conditionally to prevent thrashing
                setHoveredSkill(foundHover);
            }

            // 3. Draw connection lines (from back to front)
            ctx.lineWidth = 1;
            pointsRef.current.forEach((pt1) => {
                if (!pt1.connections) return;
                pt1.connections.forEach((connId) => {
                    const pt2 = pointsRef.current.find((p) => p.id === connId);
                    if (pt2) {
                        const avgOpacity = (pt1.opacity + pt2.opacity) / 2;
                        const isPrimary = (hoveredSkill && (hoveredSkill.id === pt1.id || hoveredSkill.id === pt2.id)) ||
                                          (selectedSkill && (selectedSkill.id === pt1.id || selectedSkill.id === pt2.id));
                        
                        ctx.strokeStyle = isPrimary 
                            ? `rgba(99, 102, 241, ${avgOpacity * 0.45})` 
                            : `rgba(255, 255, 255, ${avgOpacity * 0.08})`;
                        
                        ctx.lineWidth = isPrimary ? 1.5 : 0.8;
                        ctx.beginPath();
                        ctx.moveTo(pt1.screenX, pt1.screenY);
                        ctx.lineTo(pt2.screenX, pt2.screenY);
                        ctx.stroke();
                    }
                });
            });

            // 4. Sort points by Z-index depth for correct overlap rendering
            const sortedPoints = [...pointsRef.current].sort((a, b) => b.z3d - a.z3d);

            // 5. Draw skill labels and nodes
            sortedPoints.forEach((pt) => {
                const isSelected = selectedSkill && selectedSkill.id === pt.id;
                const isHovered = hoveredSkill && hoveredSkill.id === pt.id;

                ctx.save();
                
                // Draw node dot
                ctx.beginPath();
                ctx.arc(pt.screenX, pt.screenY, 3.5 * pt.scale, 0, 2 * Math.PI);
                ctx.fillStyle = isSelected || isHovered 
                    ? 'rgba(99, 102, 241, 1)' 
                    : `rgba(255, 255, 255, ${pt.opacity * 0.8})`;
                ctx.fill();

                if (isSelected || isHovered) {
                    ctx.beginPath();
                    ctx.arc(pt.screenX, pt.screenY, 8 * pt.scale, 0, 2 * Math.PI);
                    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }

                // Draw label text
                const fontSize = Math.max(10, Math.floor(13 * pt.scale));
                ctx.font = `${isSelected || isHovered ? 'bold' : 'normal'} ${fontSize}px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                ctx.fillStyle = isSelected
                    ? `rgba(255, 255, 255, 1)`
                    : isHovered
                    ? `rgba(165, 180, 252, 1)` // Indigo-300
                    : `rgba(156, 163, 175, ${pt.opacity})`; // Slate-400

                // Add drop-shadow for hovered/selected nodes
                if (isSelected || isHovered) {
                    ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
                    ctx.shadowBlur = 10;
                }

                ctx.fillText(pt.name, pt.screenX, pt.screenY - 14 * pt.scale);
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('click', handleCanvasClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, [canvasWidth, selectedSkill, hoveredSkill]);

    return (
        <section className="skills-constellation-section glass-card">
            <h3 className="section-title">
                {t('about.focusAreas')} <span className="text-gradient">Constellation</span>
            </h3>
            <p className="section-subtitle">
                Interact with the rotating 3D galaxy sphere to examine my core technical capabilities.
            </p>

            <div className="constellation-grid-container">
                {/* 3D Canvas Box */}
                <div className="constellation-canvas-wrapper">
                    <canvas 
                        ref={canvasRef} 
                        width={canvasWidth} 
                        height={canvasWidth}
                        className="constellation-canvas"
                    />
                </div>

                {/* Details Card */}
                <div className="constellation-detail-panel">
                    {selectedSkill ? (
                        <div className="constellation-detail-card glass-card">
                            <span className="skill-badge-category">{selectedSkill.category}</span>
                            <h4 className="skill-detail-title text-gradient">{selectedSkill.name}</h4>
                            <p className="skill-detail-description">{selectedSkill.desc}</p>
                        </div>
                    ) : (
                        <div className="constellation-detail-card glass-card placeholder-panel">
                            <p>Click a technology node in the 3D sphere to inspect its details.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SkillsConstellation;
