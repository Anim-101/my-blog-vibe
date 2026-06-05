import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Cpu, 
  Database, 
  Wrench, 
  Play, 
  Square, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Terminal, 
  Code2,
  AlertTriangle,
  Brain
} from 'lucide-react';
import './Agents.css';

const Agents = () => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [activeIacTab, setActiveIacTab] = useState('semantic-kernel');
  const [copied, setCopied] = useState(false);
  const nodeIdCounterRef = useRef(0);
  const canvasRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const nodeStartRef = useRef({ x: 0, y: 0 });
  const draggingNodeIdRef = useRef(null);
  const dragDistanceRef = useRef(0);
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const simTimeoutRef = useRef(null);

  const handleStartDrag = (e, node) => {
    e.stopPropagation();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    dragStartRef.current = { x: clientX, y: clientY };
    nodeStartRef.current = { x: node.x, y: node.y };
    draggingNodeIdRef.current = node.id;
    dragDistanceRef.current = 0;
    setDraggedNodeId(node.id);
  };

  const handleDrag = (e) => {
    if (!draggingNodeIdRef.current) return;
    if (e.cancelable) {
      e.preventDefault();
    }

    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    dragDistanceRef.current = Math.sqrt(dx * dx + dy * dy);

    const canvasWidth = canvasRef.current?.clientWidth || 900;
    const canvasHeight = 480;

    let newX = nodeStartRef.current.x + dx;
    let newY = nodeStartRef.current.y + dy;

    // Constrain nodes inside 480px canvas (subtract node size 110px)
    newX = Math.max(0, Math.min(newX, canvasWidth - 110));
    newY = Math.max(0, Math.min(newY, canvasHeight - 110));

    setNodes(prev => prev.map(n => n.id === draggingNodeIdRef.current ? { ...n, x: newX, y: newY } : n));
  };

  const handleEndDrag = () => {
    draggingNodeIdRef.current = null;
    setDraggedNodeId(null);
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (dragDistanceRef.current < 5) {
      setSelectedNode(node);
    }
  };

  const catalog = [
    { type: 'brain', name: 'GPT-4o Brain', icon: <Cpu size={18} />, model: 'gpt-4o', temp: 0.7, desc: 'OpenAI multi-modal LLM' },
    { type: 'brain', name: 'Claude 3.5 Sonnet', icon: <Cpu size={18} />, model: 'claude-3-5', temp: 0.2, desc: 'Anthropic high-reasoning LLM' },
    { type: 'brain', name: 'Llama 3 Brain', icon: <Cpu size={18} />, model: 'llama-3', temp: 0.8, desc: 'Meta open-weight LLM' },
    { type: 'memory', name: 'Short-Term Buffer', icon: <Database size={18} />, memType: 'buffer', desc: 'In-memory sliding window history' },
    { type: 'memory', name: 'Vector Database', icon: <Database size={18} />, memType: 'vector', desc: 'ChromaDB / Pinecone embeddings storage' },
    { type: 'tool', name: 'Google Search Tool', icon: <Wrench size={18} />, toolName: 'web_search', desc: 'Real-time query retrieval API' },
    { type: 'tool', name: 'Python Sandbox', icon: <Wrench size={18} />, toolName: 'python_exec', desc: 'Secure local script execution core' },
    { type: 'tool', name: 'Calculator Tool', icon: <Wrench size={18} />, toolName: 'math_solver', desc: 'Float arithmetic processing core' },
    { type: 'tool', name: 'Fetch Weather', icon: <Wrench size={18} />, toolName: 'weather_api', desc: 'JSON meteorological status query' },
    { type: 'tool', name: 'Web Scraper', icon: <Wrench size={18} />, toolName: 'html_parser', desc: 'Raw body data content extraction' }
  ];

  const addResource = (item) => {
    const xOffsets = {
      brain: 40,
      memory: 220,
      tool: 400
    };

    const typeNodes = nodes.filter(n => n.type === item.type);
    const count = typeNodes.length;

    let x = xOffsets[item.type] || 200;
    let y = 180;

    // Stack nodes nicely in columns
    y = 80 + (count * 95);

    nodeIdCounterRef.current += 1;
    const newNode = {
      id: `${item.type}-${nodeIdCounterRef.current}`,
      type: item.type,
      name: `${item.name} #${count + 1}`,
      model: item.model || 'default',
      temp: item.temp || 0.7,
      memType: item.memType || 'default',
      toolName: item.toolName || 'default',
      x,
      y
    };

    setNodes(prev => [...prev, newNode]);
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

  // Canvas layout connections: Brains connect to Memory, Brains connect to Tools
  const getConnections = () => {
    const list = [];
    const brainNodes = nodes.filter(n => n.type === 'brain');
    const memNodes = nodes.filter(n => n.type === 'memory');
    const toolNodes = nodes.filter(n => n.type === 'tool');

    brainNodes.forEach(brain => {
      memNodes.forEach(mem => {
        list.push({ from: brain, to: mem });
      });
      toolNodes.forEach(tool => {
        list.push({ from: brain, to: tool });
      });
    });

    return list;
  };

  const runSimulation = () => {
    const brainNodes = nodes.filter(n => n.type === 'brain');
    if (brainNodes.length === 0) {
      setTerminalLogs([{ type: 'error', text: 'Execution Error: No LLM Brain node connected on canvas.' }]);
      return;
    }

    const toolNodes = nodes.filter(n => n.type === 'tool');
    const activeBrain = brainNodes[0];
    const promptText = taskInput.trim() || 'Calculate temperature differences between Tokyo and London';
    
    setIsSimulating(true);
    setSimStep(1);
    setTerminalLogs([
      { type: 'info', text: `Initializing agent executor with LLM: ${activeBrain.name} (temp=${activeBrain.temp})` },
      { type: 'info', text: `System context loaded. Connecting ${nodes.filter(n => n.type === 'memory').length} memory buffers.` },
      { type: 'input', text: `User Task: "${promptText}"` }
    ]);

    let step = 1;
    const executeNextStep = () => {
      step += 1;
      setSimStep(step);

      if (step === 2) {
        setTerminalLogs(prev => [
          ...prev,
          { type: 'thought', text: `Thought: I need to solve: "${promptText}". I should evaluate which tools are connected on the canvas.` }
        ]);
        simTimeoutRef.current = setTimeout(executeNextStep, 1500);
      } else if (step === 3) {
        if (toolNodes.length === 0) {
          setTerminalLogs(prev => [
            ...prev,
            { type: 'warning', text: `Warning: No tools are connected. Falling back to zero-shot parametric memory.` },
            { type: 'thought', text: `Thought: Without active tools, I will infer static weather templates and calculate base estimates.` }
          ]);
          step = 4; // Skip tool call
          simTimeoutRef.current = setTimeout(executeNextStep, 1500);
        } else {
          const firstTool = toolNodes[0];
          setTerminalLogs(prev => [
            ...prev,
            { type: 'action', text: `Action [Tool Call]: Invoking "${firstTool.name}" with argument {"query": "${promptText}"}` }
          ]);
          simTimeoutRef.current = setTimeout(executeNextStep, 1800);
        }
      } else if (step === 4) {
        const firstTool = toolNodes[0];
        let observationText = 'Weather API output: Tokyo=22C, London=15C.';
        if (firstTool?.toolName === 'python_exec') {
          observationText = 'Python interpreter execution: stdout="Calculated diff: 7".';
        } else if (firstTool?.toolName === 'math_solver') {
          observationText = 'Calculator execution: 22 - 15 = 7.';
        } else if (firstTool?.toolName === 'web_search') {
          observationText = 'Search results: Tokyo temperature is 22C, London is 15C.';
        }

        setTerminalLogs(prev => [
          ...prev,
          { type: 'observation', text: `Observation: ${observationText}` }
        ]);
        simTimeoutRef.current = setTimeout(executeNextStep, 1500);
      } else if (step === 5) {
        setTerminalLogs(prev => [
          ...prev,
          { type: 'thought', text: `Thought: I have the metrics. Tokyo is 22°C and London is 15°C. The temperature difference is 7°C.` }
        ]);
        simTimeoutRef.current = setTimeout(executeNextStep, 1500);
      } else {
        setTerminalLogs(prev => [
          ...prev,
          { type: 'final', text: `Final Answer: Based on current data, Tokyo is warmer at 22°C compared to London at 15°C. The temperature difference is exactly 7°C.` }
        ]);
        setIsSimulating(false);
      }
    };

    simTimeoutRef.current = setTimeout(executeNextStep, 1500);
  };

  const stopSimulation = () => {
    if (simTimeoutRef.current) {
      clearTimeout(simTimeoutRef.current);
    }
    setIsSimulating(false);
    setTerminalLogs(prev => [...prev, { type: 'error', text: 'Execution aborted by user.' }]);
  };

  const generateSemanticKernel = () => {
    const brainNodes = nodes.filter(n => n.type === 'brain');
    const activeBrain = brainNodes[0] || { model: 'gpt-4o', temp: 0.7 };
    const toolNodes = nodes.filter(n => n.type === 'tool');

    let code = `# Python Semantic Kernel configurations\n`;
    code += `import semantic_kernel as sk\n`;
    code += `from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion, OpenAIChatCompletion\n\n`;
    code += `kernel = sk.Kernel()\n\n`;

    if (activeBrain.model === 'claude-3-5') {
      code += `# Anthropic Claude Brain configuration\n`;
      code += `kernel.add_chat_service("anthropic_chat", AnthropicChatCompletion(model="claude-3-5-sonnet", temp=${activeBrain.temp}))\n\n`;
    } else {
      code += `# OpenAI Brain configuration\n`;
      code += `kernel.add_chat_service("openai_chat", OpenAIChatCompletion(model="${activeBrain.model}", api_key="sk-...", temperature=${activeBrain.temp}))\n\n`;
    }

    if (toolNodes.length > 0) {
      code += `# Register connected tools\n`;
      toolNodes.forEach(t => {
        code += `kernel.import_plugin(name="${t.toolName}_plugin", plugin_instance=${t.toolName.toUpperCase()}Plugin())\n`;
      });
      code += `\n`;
    }

    code += `# Execute agent reasoning loop\n`;
    code += `async def run_agent(input_task):\n`;
    code += `    result = await kernel.run_async(input_task)\n`;
    code += `    print(f"Agent Output: {result}")\n`;

    return code.trim();
  };

  const generateLangChain = () => {
    const brainNodes = nodes.filter(n => n.type === 'brain');
    const activeBrain = brainNodes[0] || { model: 'gpt-4o', temp: 0.7 };
    const toolNodes = nodes.filter(n => n.type === 'tool');

    let code = `// LangChain agent definition in TypeScript\n`;
    code += `import { ChatOpenAI } from "@langchain/openai";\n`;
    code += `import { initializeAgentExecutorWithOptions } from "langchain/agents";\n\n`;

    code += `const model = new ChatOpenAI({\n`;
    code += `  modelName: "${activeBrain.model}",\n`;
    code += `  temperature: ${activeBrain.temp},\n`;
    code += `  openAIApiKey: process.env.OPENAI_API_KEY\n`;
    code += `});\n\n`;

    code += `const tools = [\n`;
    toolNodes.forEach(t => {
      code += `  new ${t.toolName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Tool(),\n`;
    });
    code += `];\n\n`;

    code += `// Initialize agent executor with connected tools\n`;
    code += `const executor = await initializeAgentExecutorWithOptions(tools, model, {\n`;
    code += `  agentType: "openai-functions",\n`;
    code += `  verbose: true\n`;
    code += `});\n\n`;

    code += `const response = await executor.call({ input: "${taskInput.trim() || 'Compare weather data'}" });\n`;
    code += `console.log(response.output);`;

    return code.trim();
  };

  const handleCopyCode = () => {
    const code = activeIacTab === 'semantic-kernel' ? generateSemanticKernel() : generateLangChain();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const code = activeIacTab === 'semantic-kernel' ? generateSemanticKernel() : generateLangChain();
    const filename = activeIacTab === 'semantic-kernel' ? 'agent_config.py' : 'agent_config.ts';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const connections = getConnections();

  return (
    <div className="agents-sandbox container">
      {/* Title */}
      <div className="designer-header">
        <h1 className="text-gradient">{t('agents.title')}</h1>
        <p>{t('agents.subtitle')}</p>
      </div>

      {/* Control Actions Bar */}
      <div className="designer-top-bar">
        <div className="provider-toggle-group">
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Agent Nodes Configuration
          </span>
        </div>

        <div className="control-actions-group">
          <button 
            type="button"
            className="designer-btn secondary"
            onClick={() => {
              setNodes([]);
              setSelectedNode(null);
              setIsSimulating(false);
              setTerminalLogs([]);
            }}
            disabled={nodes.length === 0}
          >
            <Trash2 size={16} /> {t('agents.clear')}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="designer-workspace">
        {/* Sidebar component templates catalog */}
        <div className="resource-sidebar">
          <h3>{t('agents.catalog')}</h3>
          <div className="catalog-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {catalog.map((item, idx) => (
              <button 
                type="button"
                key={idx} 
                className="catalog-item"
                onClick={() => addResource(item)}
              >
                <div className="catalog-item-icon">{item.icon}</div>
                <div className="catalog-item-details">
                  <span className="catalog-item-name">{item.name}</span>
                  <span className="catalog-item-cost" style={{ fontSize: '0.7rem' }}>{item.type.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas panel */}
        <div className="canvas-panel">
          <div className="canvas-header">
            <span className="canvas-title">
              <Brain size={18} /> {t('agents.canvas')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              ({nodes.length} nodes placed)
            </span>
          </div>

          <div 
            ref={canvasRef}
            className="canvas-container" 
            data-testid="agents-canvas"
            onMouseMove={handleDrag}
            onTouchMove={handleDrag}
            onMouseUp={handleEndDrag}
            onTouchEnd={handleEndDrag}
            onMouseLeave={handleEndDrag}
          >
            {nodes.length === 0 ? (
              <div className="canvas-empty-state">
                <Brain size={48} style={{ opacity: 0.3 }} />
                <p>{t('agents.emptyCanvas')}</p>
              </div>
            ) : (
              <>
                {/* SVG Connections overlay */}
                <svg className="canvas-svg-overlay">
                  {connections.map((conn, idx) => {
                    const x1 = conn.from.x + 110;
                    const y1 = conn.from.y + 55;
                    const x2 = conn.to.x;
                    const y2 = conn.to.y + 55;
                    const d = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

                    return (
                      <path 
                        key={idx}
                        d={d}
                        fill="none"
                        className={`connection-line active-flow`}
                        style={{ stroke: 'var(--accent-primary)', strokeWidth: 2.5 }}
                      />
                    );
                  })}
                </svg>

                {/* Placed Agent Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  let icon = <Cpu size={20} />;
                  if (node.type === 'memory') icon = <Database size={20} />;
                  else if (node.type === 'tool') icon = <Wrench size={20} />;

                  return (
                    <div 
                      key={node.id}
                      className={`canvas-node ${isSelected ? 'selected' : ''}`}
                      style={{ 
                        left: `${node.x}px`, 
                        top: `${node.y}px`,
                        cursor: draggedNodeId === node.id ? 'grabbing' : 'grab',
                        borderColor: node.type === 'brain' ? '#3b82f6' : node.type === 'memory' ? '#10b981' : '#f59e0b'
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
                      <div className="node-icon-wrapper" style={{ color: node.type === 'brain' ? '#3b82f6' : node.type === 'memory' ? '#10b981' : '#f59e0b' }}>{icon}</div>
                      <div className="node-label">{node.name}</div>
                      <div className="node-desc">
                        {node.type === 'brain' ? `temp=${node.temp}` : node.type === 'memory' ? node.memType : node.toolName}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Config Overlay Modal */}
            {selectedNode && (
              <div className="node-config-overlay" onClick={() => setSelectedNode(null)}>
                <div className="node-config-card" onClick={(e) => e.stopPropagation()}>
                  <div className="config-card-header">
                    <h4>{t('agents.settings')}</h4>
                    <button 
                      type="button"
                      className="config-close-btn"
                      onClick={() => setSelectedNode(null)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="config-form-group">
                    <label>Node Name</label>
                    <input 
                      type="text"
                      className="config-input"
                      value={selectedNode.name}
                      onChange={(e) => updateNode({ ...selectedNode, name: e.target.value })}
                    />
                  </div>

                  {selectedNode.type === 'brain' && (
                    <div className="config-form-group">
                      <label>Temperature ({selectedNode.temp})</label>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="config-input"
                        value={selectedNode.temp}
                        onChange={(e) => updateNode({ ...selectedNode, temp: parseFloat(e.target.value) })}
                      />
                    </div>
                  )}

                  {selectedNode.type === 'memory' && (
                    <div className="config-form-group">
                      <label>Memory Type</label>
                      <select 
                        className="config-input"
                        value={selectedNode.memType}
                        onChange={(e) => updateNode({ ...selectedNode, memType: e.target.value })}
                      >
                        <option value="buffer">Short-term Conversation Buffer</option>
                        <option value="vector">Long-term Vector Index DB</option>
                      </select>
                    </div>
                  )}

                  {selectedNode.type === 'tool' && (
                    <div className="config-form-group">
                      <label>System Tool API</label>
                      <select 
                        className="config-input"
                        value={selectedNode.toolName}
                        onChange={(e) => updateNode({ ...selectedNode, toolName: e.target.value })}
                      >
                        <option value="web_search">web_search (Google search scraper)</option>
                        <option value="python_exec">python_exec (Local code interpreter)</option>
                        <option value="math_solver">math_solver (Calculator core)</option>
                        <option value="weather_api">weather_api (Meteorology parameters)</option>
                        <option value="html_parser">html_parser (Raw text crawler)</option>
                      </select>
                    </div>
                  )}

                  <div className="config-actions-row">
                    <button 
                      type="button"
                      className="designer-btn danger"
                      style={{ flexGrow: 1 }}
                      onClick={() => deleteNode(selectedNode.id)}
                    >
                      <Trash2 size={14} /> {t('agents.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Execution logs console & code exporter */}
      <div className="designer-bottom-section">
        {/* Real-time Thought console */}
        <div className="bottom-card">
          <h3>
            <Terminal size={18} /> {t('agents.terminalTitle')}
          </h3>
          
          <div className="terminal-logs-view">
            {terminalLogs.length === 0 ? (
              <div className="terminal-empty-state">
                <span>{t('agents.terminalEmpty')}</span>
              </div>
            ) : (
              terminalLogs.map((log, idx) => (
                <div key={idx} className={`terminal-log-row ${log.type}`}>
                  <span className="log-badge">[{log.type.toUpperCase()}]</span>
                  <span className="log-text">{log.text}</span>
                </div>
              ))
            )}
          </div>

          <div className="terminal-input-actions">
            <input 
              type="text"
              className="terminal-text-input"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder={t('agents.inputPlaceholder')}
              disabled={isSimulating}
            />
            {isSimulating ? (
              <button 
                type="button" 
                className="designer-btn danger"
                onClick={stopSimulation}
              >
                <Square size={14} /> {t('agents.stop')}
              </button>
            ) : (
              <button 
                type="button" 
                className="designer-btn primary"
                onClick={runSimulation}
                disabled={nodes.length === 0}
              >
                <Play size={14} /> {t('agents.run')}
              </button>
            )}
          </div>
        </div>

        {/* Exporter code block */}
        <div className="bottom-card" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3>
              <Code2 size={18} /> {t('agents.exporterTitle')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {t('agents.exporterSubtitle')}
            </p>
            
            <div className="iac-tabs-header">
              <button 
                type="button"
                className={`iac-tab-btn ${activeIacTab === 'semantic-kernel' ? 'active' : ''}`}
                onClick={() => setActiveIacTab('semantic-kernel')}
              >
                Semantic Kernel (Python)
              </button>
              <button 
                type="button"
                className={`iac-tab-btn ${activeIacTab === 'langchain' ? 'active' : ''}`}
                onClick={() => setActiveIacTab('langchain')}
              >
                LangChain (TS)
              </button>
            </div>
          </div>

          <div className="iac-code-panel">
            <div className="code-actions">
              <button 
                type="button"
                className="code-action-btn"
                onClick={handleCopyCode}
                title="Copy to Clipboard"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? t('agents.copied') : t('agents.copy')}
              </button>
              <button 
                type="button"
                className="code-action-btn"
                onClick={handleDownloadCode}
                title="Download configuration file"
              >
                <Download size={14} /> {t('agents.copy')}
              </button>
            </div>
            
            <pre>
              <code>
                {activeIacTab === 'semantic-kernel' ? generateSemanticKernel() : generateLangChain()}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
