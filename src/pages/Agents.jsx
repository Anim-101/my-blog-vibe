import { useState, useRef, useEffect } from 'react';
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
  Brain,
  MessageSquare,
  Users
} from 'lucide-react';
import './Agents.css';

const DEBATE_SCENARIOS = {
  en: {
    'Kubernetes vs. Serverless': [
      { speaker: 'moderator', text: 'Welcome team. Today we are debating: Kubernetes vs Serverless. Sophia, let\'s start with the frontend & application layer perspective.' },
      { speaker: 'frontend', text: 'Serverless is a game-changer. We get instant auto-scaling to zero, zero-cold start optimizations, and developers can focus on features rather than cluster configs. It aligns perfectly with rapid frontend releases.' },
      { speaker: 'systems', text: 'Hold on. Serverless introduces severe vendor lock-in, unpredictable budget spikes under high continuous throughput, and cold starts are still a problem for JVM/TS runtimes. With Kubernetes, we have full orchestration control, cloud neutrality, and highly optimized container densities.' },
      { speaker: 'frontend', text: 'Full orchestration comes at the cost of massive operational overhead. How many engineers do we need just to keep the control plane, ingress controllers, and service meshes running? Serverless lets us ship APIs in minutes.' },
      { speaker: 'systems', text: 'Operational overhead can be managed via managed services (like EKS/GKE) and GitOps tooling like ArgoCD. Kubernetes gives us robust networking, daemonsets for log harvesting, and direct volume mounting which serverless functions simply cannot do cleanly.' },
      { speaker: 'moderator', text: 'Excellent points. In summary: Serverless optimizes developer velocity and variable workloads, while Kubernetes is superior for high, steady-state compute volumes and strict multi-tenant networking control.' }
    ],
    'GraphQL vs. REST APIs': [
      { speaker: 'moderator', text: 'Welcome. Today\'s topic: GraphQL vs REST APIs. Sophia, please begin.' },
      { speaker: 'frontend', text: 'GraphQL solves over-fetching and under-fetching. With a single request, the frontend can query exactly the nested fields it needs. This reduces mobile payload sizes and eliminates the need for endless REST custom endpoints.' },
      { speaker: 'systems', text: 'GraphQL shifts the complexity to the backend. Resolving nested queries leads to the N+1 database problem. It\'s also extremely hard to cache GraphQL queries at the CDN level because they are typically POST requests.' },
      { speaker: 'frontend', text: 'The N+1 problem can be solved with dataloaders or batching mechanisms. And client-side caching (like Apollo Client) handles state beautifully. Developer experience is significantly improved with autocomplete and strong schemas.' },
      { speaker: 'systems', text: 'CDN caching is crucial for global scale. Standard REST endpoints can be cached heavily using simple Varnish or Cloudflare rules. Plus, rate limiting and field-level security are straightforward in REST, whereas GraphQL requires complex query-depth analyzers.' },
      { speaker: 'moderator', text: 'Both sides are right. GraphQL is excellent for dynamic frontends with deep relationships. REST remains the standard for public APIs and high-volume, CDN-cacheable microservices.' }
    ],
    'Micro-Frontends vs. Monoliths': [
      { speaker: 'moderator', text: 'Welcome team. Today we debate: Micro-Frontends vs. Monolithic architecture. Sophia, go ahead.' },
      { speaker: 'frontend', text: 'Micro-frontends allow large organizations to scale. Independent teams can deploy their features separately without risking the entire application stack. It enables technology independence and isolates failures.' },
      { speaker: 'systems', text: 'Micro-frontends come with huge performance penalties. Users end up downloading multiple runtimes, and routing/state sharing becomes a complex mess. From a deployment perspective, managing 20 separate pipelines for one user screen is a nightmare.' },
      { speaker: 'frontend', text: 'We can mitigate runtime overhead using module federation, shared dependencies, and server-side rendering. The organizational alignment and deploy velocity outweigh the complexity.' },
      { speaker: 'systems', text: 'Only if your team has mature platform engineering. Monoliths are vastly simpler to build, test, monitor, and deploy. In most cases, a modular monolith is a far more practical starting point.' },
      { speaker: 'moderator', text: 'Indeed. Micro-frontends solve organizational scaling problems at the expense of performance and infrastructure complexity. For smaller teams, modular monoliths are usually preferred.' }
    ]
  },
  ja: {
    'Kubernetes vs. Serverless': [
      { speaker: 'moderator', text: 'チームの皆さん、ようこそ。今日のテーマは「Kubernetes 対 Serverless」です。まずはSophia、フロントエンドとアプリケーション層の視点から始めてください。' },
      { speaker: 'frontend', text: 'Serverlessは革新的です。自動でゼロまでスケーリングし、コールドスタートの最適化も容易で、開発者はクラスター管理ではなく機能開発に集中できます。高速なフロントエンドのリリースサイクルに最適です。' },
      { speaker: 'systems', text: '待ってください。Serverlessはベンダーロックインが強く、一定の高スループット下ではクラウド費用が予測不能に跳ね上がります。また、コールドスタートは依然として問題です。Kubernetesなら、完全なオーケストレーション制御、クラウド中立性、そして最適化されたコンテナ密度が得られます。' },
      { speaker: 'frontend', text: 'しかし、完全なオーケストレーションは膨大な運用オーバーヘッドを伴います。コントロールプレーンやインプレス、サービスメッシュを維持するだけで何人のインフラエンジニアが必要ですか？Serverlessなら数分でAPIを公開できます。' },
      { speaker: 'systems', text: '運用オーバーヘッドは、EKSやGKEなどのマネージドサービスや、ArgoCDのようなGitOpsツールで管理可能です。Kubernetesは、堅牢なネットワーク制御、ログ収集用のDaemonSet、そして直接のボリュームマウントなど、Serverlessではクリーンに行えない柔軟性を提供します。' },
      { speaker: 'moderator', text: '素晴らしい議論でした。要約すると、Serverlessは開発速度と不規則なワークロードを最適化し、Kubernetesは安定した高トラフィックの計算量と厳格なネットワーク制御に優れています。' }
    ],
    'GraphQL vs. REST APIs': [
      { speaker: 'moderator', text: 'ようこそ。今日のテーマは「GraphQL 対 REST API」です。Sophia、どうぞ。' },
      { speaker: 'frontend', text: 'GraphQLはオーバーフェッチとアンダーフェッチを解決します。フロントエンドは一度のクエリで必要なネストされたフィールドだけを取得できるため、モバイルでのペイロードサイズを縮小でき、エンドレスなカスタムエンドポイントの作成から解放されます。' },
      { speaker: 'systems', text: 'GraphQLは複雑さをバックエンドに押し付けるだけです。ネストされたクエリはデータベースのN+1問題を引き起こしやすく、リクエストが通常POSTメソッドであるため、CDNレベルでのクエリキャッシュが極めて困難になります。' },
      { speaker: 'frontend', text: 'N+1問題はDataLoaderやバッチ処理で解決できます。また、Apollo Clientなどのフロントエンドキャッシュが状態管理を美しく処理します。スキーマの型安全性と自動補完により、開発者の生産性は大きく向上します。' },
      { speaker: 'systems', text: 'グローバルスケールではCDNキャッシュが不可欠です。REST APIなら、CloudflareやVarnishのシンプルなルールで静的キャッシュを強力に効かせられます。また、レート制限やセキュリティ制御もRESTの方がはるかにシンプルで安全です。' },
      { speaker: 'moderator', text: '双方ともに納得のいく意見です。GraphQLはリレーションの深い動的なフロントエンドに最適で、RESTはパブリックAPIや高トラフィックでCDNキャッシュが重要なマイクロサービスにおいて標準であり続けます。' }
    ],
    'Micro-Frontends vs. Monoliths': [
      { speaker: 'moderator', text: 'チームの皆さん、ようこそ。今日のテーマは「マイクロフロントエンド 対 モノリス」です。Sophia、お願いします。' },
      { speaker: 'frontend', text: 'マイクロフロントエンドは大規模な開発組織をスケールさせます。独立したチームがスタック全体を壊すリスクなしに、自身の機能を個別にデプロイできます。技術の独立性と障害の分離が可能になります。' },
      { speaker: 'systems', text: 'マイクロフロントエンドはパフォーマンスに悪影響を及ぼします。ユーザーは複数のフレームワークランタイムをダウンロードさせられ、ルーティングや状態共有は複雑化します。運用面でも、1つの画面のために20個のデプロイパイプラインを管理するのは悪夢です。' },
      { speaker: 'frontend', text: 'モジュールフェデレーションや共有依存関係、SSR（サーバーサイドレンダリング）を使うことでランタイムオーバーヘッドは軽減できます。チームの自律性とデプロイ速度の向上は、その複雑さを補って余りあります。' },
      { speaker: 'systems', text: 'それは成熟したプラットフォームエンジニアリングがある場合だけです。通常、モノリスの方がビルド、テスト、監視、デプロイが圧倒的にシンプルです。多くの場合、モジュール式モノリス（Modular Monolith）から始める方がはるかに現実的です。' },
      { speaker: 'moderator', text: '同感です。マイクロフロントエンドはパフォーマンスやインフラの複雑さと引き換えに、組織のスケーリング課題を解決します。小規模なチームでは、モジュール式モノリスが賢明な選択肢となるでしょう。' }
    ]
  }
};

const generateDynamicDebate = (topic, lang) => {
  const cleanTopic = topic || (lang === 'ja' ? 'カスタムトピック' : 'Custom Topic');
  if (lang === 'ja') {
    return [
      { speaker: 'moderator', text: `チームの皆さん、歓迎します。今回の討論テーマは「${cleanTopic}」です。Sophia、まずはフロントエンドおよびアプリケーション開発者の視点から意見を聞かせてください。` },
      { speaker: 'frontend', text: `フロントエンド開発の観点から見ると、「${cleanTopic}」は非常に興味深い機会を提供します。私たちはクライアント側の表示速度を高め、コンポーネントの柔軟性を最大化し、複雑なインフラのデプロイを待つことなく迅速にイテレーションを進めたいと考えています。` },
      { speaker: 'systems', text: `開発効率の向上は素晴らしいことですが、「${cleanTopic}」は運用上の懸念を引き起こします。インフラの安定性、リソース消費、監視メトリクス、そして継続的なトラフィックロード下でのクラウド料金コストを無視することはできません。スピードのために可用性を犠牲にはできません。` },
      { speaker: 'frontend', text: `最新のクライアント側ステート管理、エッジコンピューティング、サーバー主導UIによってその懸念は緩和できます。モジュール設計を採用すれば、ボトルネックを分離し、システム全体に影響を与えずにユーザー体験を良好に保つことができます。` },
      { speaker: 'systems', text: `それも適切なリクエスト制限、オートスケーリングの閾値、そして堅牢なテレメトリー監視があってこそです。フロントエンドの利便性のために、システムの稼働率や予算管理が破綻しては元も子もありません。` },
      { speaker: 'moderator', text: `その通りですね。Sophiaが強調する「開発速度とUI体験」、そしてMarcusが主張する「システムの可用性とコスト管理」のバランスを取ることが重要です。最適な答えは、明確なAPIスキーマ契約と堅牢なゲートウェイ構成の調和にあります。` }
    ];
  } else {
    return [
      { speaker: 'moderator', text: `Welcome team. Let's debate the topic: "${cleanTopic}". Sophia, share your frontend design architecture insights first.` },
      { speaker: 'frontend', text: `From the frontend and application developer perspective, "${cleanTopic}" presents interesting opportunities. We want to maximize component flexibility, reduce client-side latency, and ensure our developers can iterate rapidly without waiting on complex backend infrastructure deployments.` },
      { speaker: 'systems', text: `While that sounds great for code shipping, "${cleanTopic}" raises operational concerns. We need to consider infrastructure stability, resource exhaustion, monitoring metrics, and cloud resource billing under sustained traffic load. Speed cannot come at the expense of uptime.` },
      { speaker: 'frontend', text: `Modern client-side state managers, edge runtime caching, and server-driven options can offset those concerns. A modular design allows us to isolate performance bottlenecks and keep the user experience smooth without bringing down the system.` },
      { speaker: 'systems', text: `Only if it's paired with proper service limits, auto-scaling thresholds, and robust cluster telemetry. We cannot let frontend convenience compromise system availability and cost compliance.` },
      { speaker: 'moderator', text: `Indeed. Balancing developer velocity (Sophia's focus) with systems resilience and resource control (Marcus's focus) is key. The ideal solution lies in modular APIs, robust gateway configurations, and clear contracts between client and server.` }
    ];
  }
};

const Agents = () => {
  const { t, i18n } = useTranslation();
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

  // Debate Sandbox States
  const [mode, setMode] = useState('console'); // 'console' or 'debate'
  const [debateTopic, setDebateTopic] = useState('Kubernetes vs. Serverless');
  const [customTopic, setCustomTopic] = useState('');
  const [debateMessages, setDebateMessages] = useState([]);
  const [isDebating, setIsDebating] = useState(false);
  const debateTimeoutRef = useRef(null);
  const debateEndRef = useRef(null);

  // Normalize language flag
  const lang = i18n?.language?.startsWith('ja') ? 'ja' : 'en';

  useEffect(() => {
    return () => {
      if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
      if (debateTimeoutRef.current) clearTimeout(debateTimeoutRef.current);
    };
  }, []);

  // Auto scroll debate chat
  useEffect(() => {
    if (debateEndRef.current) {
      debateEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debateMessages]);

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
    let y = 80 + (count * 95);

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
          step = 4;
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

  // Debate sandbox handlers
  const startDebate = () => {
    if (isDebating) return;
    setIsDebating(true);
    setDebateMessages([]);

    const topic = customTopic.trim() ? customTopic : debateTopic;
    const script = DEBATE_SCENARIOS[lang]?.[topic] || generateDynamicDebate(topic, lang);
    
    let messageIndex = 0;
    const postNextMessage = () => {
      if (messageIndex < script.length) {
        const turn = script[messageIndex];
        setDebateMessages(prev => [...prev, turn]);
        messageIndex++;
        debateTimeoutRef.current = setTimeout(postNextMessage, 3500);
      } else {
        setIsDebating(false);
      }
    };

    postNextMessage();
  };

  const stopDebate = () => {
    if (debateTimeoutRef.current) {
      clearTimeout(debateTimeoutRef.current);
    }
    setIsDebating(false);
  };

  const resetDebate = () => {
    stopDebate();
    setDebateMessages([]);
  };

  const connections = getConnections();
  const lastMsg = debateMessages[debateMessages.length - 1];
  const activeSpeaker = isDebating && lastMsg ? lastMsg.speaker : null;

  return (
    <div className="agents-sandbox container">
      {/* Title */}
      <div className="designer-header">
        <h1 className="text-gradient">{t('agents.title')}</h1>
        <p>{t('agents.subtitle')}</p>
      </div>

      {/* Mode Switcher */}
      <div className="agents-mode-selector">
        <button 
          className={`mode-btn ${mode === 'console' ? 'active' : ''}`}
          onClick={() => {
            setMode('console');
            resetDebate();
          }}
        >
          <Brain size={16} />
          <span>{lang === 'ja' ? 'コンソール ワークスペース' : 'Console Sandbox'}</span>
        </button>
        <button 
          className={`mode-btn ${mode === 'debate' ? 'active' : ''}`}
          onClick={() => {
            setMode('debate');
            stopSimulation();
          }}
        >
          <Sparkles size={16} />
          <span>{lang === 'ja' ? 'ディベート サンドボックス' : 'Debate Sandbox'}</span>
        </button>
      </div>

      {mode === 'console' ? (
        <>
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
        </>
      ) : (
        /* Render Debate Sandbox Mode */
        <div className="debate-sandbox-workspace animate-in">
          {/* Left Column: Sophia (Frontend Architect) */}
          <div className={`debate-agent-card glass-card sophia-card ${activeSpeaker === 'frontend' ? 'active-speaker' : ''}`}>
            <div className="agent-avatar-wrapper sophia">
              <Cpu size={36} />
              <div className="pulse-ring"></div>
            </div>
            <h3 className="agent-name">Sophia</h3>
            <span className="agent-role">Lead Frontend Engineer</span>
            <p className="agent-bio">
              {lang === 'ja' 
                ? 'React 19、TypeScript、ユーザー体験、パフォーマンス最適化、SEOを提唱。開発者の俊敏性を重視。'
                : 'Advocates for React 19, TypeScript, UX, performance, edge runtimes, and developer velocity.'}
            </p>
            <div className="agent-specs">
              <span className="spec-tag">React 19</span>
              <span className="spec-tag">TypeScript</span>
              <span className="spec-tag">Edge Caching</span>
            </div>
          </div>

          {/* Center Column: Chat Arena & Controls */}
          <div className="debate-arena-panel glass-card">
            <div className="arena-header">
              <MessageSquare size={18} />
              <h4>
                {lang === 'ja' ? 'AI アーキテクチャ討論アリーナ' : 'AI Architecture Debate Arena'}
              </h4>
              {isDebating && <div className="live-badge">LIVE DEBATE</div>}
            </div>

            <div className="arena-messages-view">
              {debateMessages.length === 0 ? (
                <div className="arena-empty-state">
                  <Users size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>
                    {lang === 'ja' 
                      ? '討論テーマを選択し、「ディベート開始」をクリックして討論を開始します。'
                      : 'Select a technical topic and click "Start Debate" to watch the agents discuss.'}
                  </p>
                </div>
              ) : (
                debateMessages.map((msg, idx) => (
                  <div key={idx} className={`arena-msg-row ${msg.speaker} animate-bubble`}>
                    <div className="msg-avatar-mini">
                      {msg.speaker === 'moderator' ? <Sparkles size={14} /> : msg.speaker === 'frontend' ? <Cpu size={14} /> : <Database size={14} />}
                    </div>
                    <div className="msg-content-bubble">
                      <div className="msg-sender-name">
                        {msg.speaker === 'moderator' ? 'Moderator Anya' : msg.speaker === 'frontend' ? 'Sophia (Frontend)' : 'Marcus (Systems)'}
                      </div>
                      <p className="msg-text">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={debateEndRef} />
            </div>

            {/* Controls Bar at bottom of Center Panel */}
            <div className="arena-controls-panel">
              <div className="topic-select-row">
                <div className="input-group">
                  <label>{lang === 'ja' ? 'テーマの選択' : 'Select Topic'}</label>
                  <select 
                    className="debate-select"
                    value={debateTopic}
                    onChange={(e) => {
                      setDebateTopic(e.target.value);
                      setCustomTopic('');
                      resetDebate();
                    }}
                    disabled={isDebating}
                  >
                    <option value="Kubernetes vs. Serverless">Kubernetes vs. Serverless</option>
                    <option value="GraphQL vs. REST APIs">GraphQL vs. REST APIs</option>
                    <option value="Micro-Frontends vs. Monoliths">Micro-Frontends vs. Monoliths</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>{lang === 'ja' ? 'カスタムテーマの入力' : 'Or Custom Topic'}</label>
                  <input 
                    type="text"
                    className="debate-custom-input"
                    value={customTopic}
                    onChange={(e) => {
                      setCustomTopic(e.target.value);
                      resetDebate();
                    }}
                    placeholder={lang === 'ja' ? '例: SQL vs NoSQL' : 'e.g. SQL vs. NoSQL'}
                    disabled={isDebating}
                  />
                </div>
              </div>

              <div className="debate-buttons-row">
                {isDebating ? (
                  <button type="button" className="designer-btn danger animate-pulse" onClick={stopDebate}>
                    <Square size={14} />
                    <span>{lang === 'ja' ? 'ディベート停止' : 'Stop Debate'}</span>
                  </button>
                ) : (
                  <button type="button" className="designer-btn primary" onClick={startDebate}>
                    <Play size={14} />
                    <span>{lang === 'ja' ? 'ディベート開始' : 'Start Debate'}</span>
                  </button>
                )}
                <button type="button" className="designer-btn secondary" onClick={resetDebate} disabled={debateMessages.length === 0}>
                  <Trash2 size={14} />
                  <span>{lang === 'ja' ? 'リセット' : 'Reset'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Marcus (Systems Admin) */}
          <div className={`debate-agent-card glass-card marcus-card ${activeSpeaker === 'systems' ? 'active-speaker' : ''}`}>
            <div className="agent-avatar-wrapper marcus">
              <Database size={36} />
              <div className="pulse-ring"></div>
            </div>
            <h3 className="agent-name">Marcus</h3>
            <span className="agent-role">Lead Systems Administrator</span>
            <p className="agent-bio">
              {lang === 'ja' 
                ? 'Kubernetes、Terraform、システム監視、インフラコスト、高可用性設計、SLA管理を提唱。'
                : 'Focuses on Kubernetes clusters, infrastructure scaling, SLA management, cost optimization, and resilience.'}
            </p>
            <div className="agent-specs">
              <span className="spec-tag">Kubernetes</span>
              <span className="spec-tag">Terraform</span>
              <span className="spec-tag">Prometheus</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
