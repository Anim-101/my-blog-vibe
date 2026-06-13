import { useState, useRef, useEffect } from 'react';
import { Play, Terminal, CheckCircle2, ChevronRight, FileCode, Cpu } from 'lucide-react';
import './ResumeDebugger.css';

const MOCK_CODE = `// Consultant & Full-Stack Engineer Profile
class Developer {
  constructor() {
    this.name = "Anim Akash";
    this.currentRole = "Team Lead (Consultant)";
    this.location = "Tokyo, Japan";
    this.company = "Avanade";
  }

  getSkills() {
    return {
      frontend: ["React 19", "JavaScript/TS", "TailwindCSS", "CSS3"],
      backend: ["Node.js", "SQL", "Data Pipelines", "API Design"],
      automation: ["Ansible Playbooks", "Bash Shell", "CI/CD Git"],
      cloudAI: ["Azure OpenAI", "Semantic Kernel", "AWS Solutions Architect"]
    };
  }

  getCertifications() {
    return [
      "Red Hat Certified Engineer (RHCE)",
      "Red Hat Certified System Administrator (RHCSA)",
      "AWS Certified Solutions Architect – Associate",
      "Microsoft Certified: Azure AI Fundamentals",
      "Japanese Language Proficiency Test (JLPT) N2"
    ];
  }

  getCoreExperience() {
    return {
      Avanade: "Architecting data pipelines & Kobe AI lab robot arm systems.",
      BusinessArchitectsInc: "Infrastructure renewal, kernel updates & team lead."
    };
  }
}`;

const MOCK_TESTS = [
  { id: 1, name: "should verify Red Hat Automation capacity", assert: "expect(dev.getCertifications()).toContain('RHCE')", desc: "Verifies perfect 300/300 score Red Hat Certified Engineer automation status." },
  { id: 2, name: "should possess enterprise consulting skills", assert: "expect(dev.currentRole).toBe('Team Lead (Consultant)')", desc: "Validates active team lead roles at Avanade." },
  { id: 3, name: "should architect AI & systems automation pipelines", assert: "expect(dev.getSkills().cloudAI).toContain('Semantic Kernel')", desc: "Validates experience with Azure OpenAI and advanced agent structures." },
  { id: 4, name: "should communicate fluently in Japanese business contexts", assert: "expect(dev.getCertifications()).toContain('JLPT N2')", desc: "Verifies business communication capabilities in bilingual development environments." }
];

const ResumeDebugger = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'tests'
  const [consoleLogs, setConsoleLogs] = useState([]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current && typeof terminalEndRef.current.scrollIntoView === 'function') {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  const runTests = async () => {
    setIsRunning(true);
    setActiveTab('tests');
    setConsoleLogs(["[INFO] Initializing Vitest environment...", "[INFO] Resolving dependencies...", "[INFO] Found 4 test specs to run..."]);
    setTestResults([]);

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    await sleep(800);
    setConsoleLogs(prev => [...prev, "[INFO] Running test suite against spec 'Resume.test.jsx'..."]);
    await sleep(600);

    for (let i = 0; i < MOCK_TESTS.length; i++) {
      const test = MOCK_TESTS[i];
      setConsoleLogs(prev => [...prev, `[RUNNING] ${test.name}`]);
      await sleep(700);

      setTestResults(prev => [...prev, { ...test, status: 'pass' }]);
      setConsoleLogs(prev => [
        ...prev,
        `  ✓ ${test.name} (${Math.floor(Math.random() * 20 + 5)}ms)`,
        `    └─ Assertion: ${test.assert} [PASSED]`
      ]);
    }

    await sleep(500);
    setConsoleLogs(prev => [
      ...prev,
      "",
      "Test Files: 1 passed, 1 total",
      "Tests:      4 passed, 4 total",
      "Snapshots:  0 total",
      "Time:       2.84s",
      "[SUCCESS] All assertions verified successfully. Ready for deployment."
    ]);
    setIsRunning(false);
  };

  return (
    <div className="resume-debugger-container">
      <div className="debugger-header">
        <div className="debugger-title-group">
          <Cpu className="debugger-icon" size={20} />
          <div>
            <h3 className="debugger-title">Interactive Resume Debugger</h3>
            <p className="debugger-subtitle">Execute unit assertions against my professional qualifications</p>
          </div>
        </div>

        <button
          className="run-tests-btn"
          onClick={runTests}
          disabled={isRunning}
        >
          <Play size={14} fill="currentColor" />
          <span>{isRunning ? "Running Suite..." : "Run Assertions"}</span>
        </button>
      </div>

      <div className="editor-card">
        {/* Editor Tabs bar */}
        <div className="editor-tabs-bar">
          <button
            className={`editor-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FileCode size={14} className="tab-icon file-icon" />
            <span>Developer.js</span>
          </button>
          <button
            className={`editor-tab ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            <Terminal size={14} className="tab-icon term-icon" />
            <span>TestConsole.log</span>
            {testResults.length > 0 && (
              <span className="badge-pass">{testResults.length}/4</span>
            )}
          </button>
        </div>

        {/* Editor Main Content Area */}
        <div className="editor-body">
          {activeTab === 'editor' ? (
            <div className="editor-code-view">
              <pre className="code-pre">
                <code className="code-block">
                  {MOCK_CODE.split('\n').map((line, idx) => (
                    <div key={idx} className="code-line">
                      <span className="line-number">{idx + 1}</span>
                      <span className="line-text">{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          ) : (
            <div className="console-view">
              {/* Split Screen: Left logs console, Right verified checklist */}
              <div className="console-split">
                <div className="console-logs-column">
                  <div className="console-label">Terminal Output</div>
                  <div className="logs-terminal">
                    {consoleLogs.map((log, lIdx) => (
                      <div key={lIdx} className="terminal-line">
                        {log.startsWith('  ✓') ? (
                          <span className="line-pass">{log}</span>
                        ) : log.startsWith('[SUCCESS]') ? (
                          <span className="line-success">{log}</span>
                        ) : log.startsWith('[RUNNING]') ? (
                          <span className="line-running">{log}</span>
                        ) : (
                          <span>{log}</span>
                        )}
                      </div>
                    ))}
                    {isRunning && <span className="console-cursor">_</span>}
                    <div ref={terminalEndRef} />
                  </div>
                </div>

                <div className="console-checklist-column">
                  <div className="console-label">Assertion Checklist</div>
                  <div className="checklist-wrapper">
                    {MOCK_TESTS.map((test) => {
                      const isPassed = testResults.some(r => r.id === test.id);
                      return (
                        <div key={test.id} className={`checklist-item ${isPassed ? 'passed' : ''}`}>
                          <div className="check-icon-wrapper">
                            {isPassed ? (
                              <CheckCircle2 size={16} className="icon-check active" />
                            ) : (
                              <div className="bullet-pending" />
                            )}
                          </div>
                          <div className="check-text">
                            <h4 className="check-name">{test.name}</h4>
                            <p className="check-desc">{test.desc}</p>
                            <code className="check-assert">{test.assert}</code>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeDebugger;
