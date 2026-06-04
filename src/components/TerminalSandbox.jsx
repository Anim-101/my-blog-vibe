import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, RefreshCw } from 'lucide-react';
import { personalInfo } from '../data/personal';
import './TerminalSandbox.css';

// Virtual File System Helper Markdown formatters
const getSkillsMd = (t) => `${t('terminal.skillsTitle')}

# Frontend
- React, JavaScript (ES6+), TypeScript, Next.js, Vite, HTML5/CSS3

# Backend
- Node.js, Python, REST APIs, Microservices, SaaS Architecture

# DevOps & Cloud Infrastructure
- Ansible Automation, Linux System Administration, AWS (VPC, Lambda, S3, IAM), Docker, CI/CD`;

const getCertsMd = (t) => `${t('terminal.certsTitle')}

- Red Hat Certified Engineer (RHCE) - Perfect Score 300/300 (ID: 200-244-934)
- Red Hat Certified System Administrator (RHCSA) - Perfect Score 300/300 (ID: 200-244-934)
- Microsoft Certified: Azure Fundamentals & Azure AI Fundamentals
- AWS Certified Solutions Architect – Associate (ID: Z4D9R1K2BJQQ1S5G)`;

const getPlaybooksMd = () => `=== Ansible Playbooks ===

- deploy_skills.yml: Playbook to configure full stack environment and verify credentials.`;

// Virtual File System Definition
const VFS = {
  '/': {
    type: 'dir',
    contents: ['bio.md', 'contact.md', 'skills', 'certifications', 'playbooks']
  },
  '/skills': {
    type: 'dir',
    contents: ['skills.md', 'readme.md', 'frontend.json', 'backend.json', 'devops.json']
  },
  '/certifications': {
    type: 'dir',
    contents: ['certifications.md', 'readme.md', 'rhce.json', 'rhcsa.json', 'azure.json', 'aws.json']
  },
  '/playbooks': {
    type: 'dir',
    contents: ['playbooks.md', 'readme.md', 'deploy_skills.yml']
  }
};

const FILE_CONTENTS = {
  '/bio.md': (t) => `${t('terminal.bioTitle')}\n\n${t('about.bio')}\n\nRole: ${t('about.role')}`,
  '/contact.md': (t) => `${t('terminal.contactTitle')}\n\nEmail: ${personalInfo.socialLinks.email}\nGitHub: ${personalInfo.socialLinks.github}\nLinkedIn: ${personalInfo.socialLinks.linkedin}`,
  
  // Skills Markdown Files
  '/skills/skills.md': (t) => getSkillsMd(t),
  '/skills/readme.md': (t) => getSkillsMd(t),

  // Certifications Markdown Files
  '/certifications/certifications.md': (t) => getCertsMd(t),
  '/certifications/readme.md': (t) => getCertsMd(t),

  // Playbook Markdown Files
  '/playbooks/playbooks.md': (t) => getPlaybooksMd(t),
  '/playbooks/readme.md': (t) => getPlaybooksMd(t),

  '/skills/frontend.json': () => JSON.stringify({
    category: "Frontend Development",
    technologies: ["React", "JavaScript (ES6+)", "TypeScript", "Next.js", "Vite", "HTML5/CSS3"]
  }, null, 2),
  '/skills/backend.json': () => JSON.stringify({
    category: "Backend Development",
    technologies: ["Node.js", "Python", "REST APIs", "Microservices", "SaaS Architecture"]
  }, null, 2),
  '/skills/devops.json': () => JSON.stringify({
    category: "DevOps & Cloud Infrastructure",
    technologies: ["Ansible Automation", "Linux System Administration", "AWS (VPC, Lambda, S3, IAM)", "Docker", "CI/CD"]
  }, null, 2),
  '/certifications/rhce.json': () => JSON.stringify({
    name: "Red Hat Certified Engineer (RHCE)",
    score: "300/300 (Perfect Score)",
    credential_id: "200-244-934",
    issue_date: "Jan 2019",
    skills: ["Ansible Automation", "System Scripting", "Service Configuration", "Security Administration"]
  }, null, 2),
  '/certifications/rhcsa.json': () => JSON.stringify({
    name: "Red Hat Certified System Administrator (RHCSA)",
    score: "300/300 (Perfect Score)",
    credential_id: "200-244-934",
    issue_date: "Jan 2019",
    skills: ["Essential CLI Tools", "Storage Management", "User Administration", "System Security"]
  }, null, 2),
  '/certifications/azure.json': () => JSON.stringify({
    name: "Microsoft Certified: Azure Fundamentals & Azure AI Fundamentals",
    status: "Passed",
    skills: ["Cloud Computing Concepts", "Azure Architecture", "OpenAI & Cognitive Services", "Responsible AI"]
  }, null, 2),
  '/certifications/aws.json': () => JSON.stringify({
    name: "AWS Certified Solutions Architect – Associate",
    score: "815/1000",
    credential_id: "Z4D9R1K2BJQQ1S5G",
    skills: ["VPC Architecture", "Serverless (Lambda/S3)", "High Availability", "IAM Governance"]
  }, null, 2),
  '/playbooks/deploy_skills.yml': () => `---
- name: Deploy Anim Akash's Software Engineering Skills
  hosts: localhost
  connection: local
  tasks:
    - name: Load personal information and biography
      include_vars: bio.json

    - name: Configure full stack technologies
      deploy_module:
        frontend: [React, JavaScript, Next.js, Vite, TypeScript]
        backend: [Node.js, Python, REST APIs, Microservices]
        devops: [Ansible, Linux Administration, AWS, Docker]

    - name: Verify Red Hat Certified Engineer credentials
      assert:
        that:
          - rhce_score == "300/300"
          - rhcsa_score == "300/300"
      msg: "System verified. Perfect score configuration applied successfully."`
};

const resolvePath = (path, currentDir) => {
  if (!path) return null;
  const target = path.trim();
  
  let absolute;
  if (target.startsWith('/')) {
    absolute = target;
  } else {
    if (currentDir === '/') {
      absolute = '/' + target;
    } else {
      absolute = currentDir + '/' + target;
    }
  }

  // Normalize segments (resolve '.' and '..')
  const parts = absolute.split('/').filter(Boolean);
  const stack = [];
  for (const part of parts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  
  return '/' + stack.join('/');
};

const TerminalSandbox = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [currentDir, setCurrentDir] = useState('/');
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState('glass');
  const [isExecutingPlaybook, setIsExecutingPlaybook] = useState(false);

  const screenRef = useRef(null);
  const inputRef = useRef(null);
  const playbookIntervalRef = useRef(null);

  // Initialize with welcome message on mount
  useEffect(() => {
    setHistory([{ type: 'output', text: t('terminal.welcome') }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom whenever history changes
  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [history]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (playbookIntervalRef.current) {
        clearInterval(playbookIntervalRef.current);
      }
    };
  }, []);

  const focusInput = () => {
    if (inputRef.current && !isExecutingPlaybook) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setHistory([]);
  };

  const executePlaybookSim = () => {
    setIsExecutingPlaybook(true);
    const playbookLines = [
      "\nPLAY [Deploy Anim Akash's Software Engineering Skills] *************************",
      "\nTASK [Gathering Facts] *********************************************************",
      "ok: [localhost]",
      "\nTASK [Load personal information and biography] *********************************",
      `ok: [localhost] => {\n    "changed": false,\n    "name": "Anim Akash",\n    "role": "Team Lead (Consultant) - Full-Stack Development"\n}`,
      "\nTASK [Configure full stack technologies] ***************************************",
      `changed: [localhost] => {\n    "changed": true,\n    "deployed_modules": {\n        "frontend": ["React", "JavaScript", "Next.js", "Vite", "TypeScript"],\n        "backend": ["Node.js", "Python", "REST APIs", "Microservices"],\n        "devops": ["Ansible Automation", "Linux Administration", "AWS", "Docker"]\n    }\n}`,
      "\nTASK [Verify Red Hat Certified Engineer credentials] ***************************",
      `ok: [localhost] => {\n    "changed": false,\n    "assertion": "rhce_score == '300/300'",\n    "credential_id": "200-244-934",\n    "status": "VERIFIED PERFECT SCORE"\n}`,
      "\nPLAY RECAP *********************************************************************",
      "localhost                  : ok=4    changed=1    unreachable=0    failed=0    skipped=0\n"
    ];

    let currentLineIndex = 0;
    
    // Append the initial playbook start message
    setHistory(prev => [...prev, { type: 'output', text: t('terminal.playbookSimulating') }]);

    const isTest = import.meta.env.MODE === 'test';
    const delay = isTest ? 1 : 600;

    playbookIntervalRef.current = setInterval(() => {
      if (currentLineIndex < playbookLines.length) {
        setHistory(prev => [...prev, { type: 'output', text: playbookLines[currentLineIndex] }]);
        currentLineIndex++;
      } else {
        if (playbookIntervalRef.current) {
          clearInterval(playbookIntervalRef.current);
          playbookIntervalRef.current = null;
        }
        setHistory(prev => [...prev, { type: 'output', text: t('terminal.playbookSuccess') }]);
        setIsExecutingPlaybook(false);
      }
    }, delay);
  };

  const processCommand = (rawCommand) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    // Add to history
    setHistory(prev => [...prev, { type: 'input', text: trimmed, dir: currentDir }]);
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        setHistory(prev => [...prev, { type: 'output', text: t('terminal.helpText') }]);
        break;
      case 'clear':
        handleClear();
        break;
      case 'theme':
        if (!arg) {
          setHistory(prev => [...prev, { type: 'output', text: t('terminal.invalidTheme') }]);
        } else {
          const newTheme = arg.toLowerCase();
          if (['glass', 'matrix', 'cyberpunk', 'amber', 'classic'].includes(newTheme)) {
            setTheme(newTheme);
            setHistory(prev => [...prev, { type: 'output', text: `${t('terminal.themeChanged')}${newTheme}` }]);
          } else {
            setHistory(prev => [...prev, { type: 'output', text: t('terminal.invalidTheme') }]);
          }
        }
        break;
      case 'ls': {
        const contents = VFS[currentDir]?.contents || [];
        const formattedList = contents.map(item => {
          // If it is a directory in VFS
          const isDir = VFS[currentDir === '/' ? `/${item}` : `${currentDir}/${item}`]?.type === 'dir';
          return isDir ? `${item}/` : item;
        }).join('   ');
        setHistory(prev => [...prev, { type: 'output', text: formattedList || '(empty directory)' }]);
        break;
      }
      case 'cd': {
        if (!arg || arg === '~' || arg === '/') {
          setCurrentDir('/');
        } else if (arg === '..') {
          if (currentDir !== '/') {
            const parent = currentDir.substring(0, currentDir.lastIndexOf('/')) || '/';
            setCurrentDir(parent);
          }
        } else {
          const target = resolvePath(arg, currentDir);
          if (VFS[target] && VFS[target].type === 'dir') {
            setCurrentDir(target);
          } else {
            setHistory(prev => [...prev, { type: 'output', text: `${t('terminal.noSuchFile')}${arg}` }]);
          }
        }
        break;
      }
      case 'cat': {
        if (!arg) {
          setHistory(prev => [...prev, { type: 'output', text: 'Usage: cat [filename]' }]);
          break;
        }
        let target = resolvePath(arg, currentDir);
        
        // If file or directory doesn't exist locally, check if we can fall back
        if (!FILE_CONTENTS[target] && !VFS[target]) {
          const fileName = target.split('/').pop();
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
          const subDirMd = `/${nameWithoutExt}/${fileName}`;
          
          if (FILE_CONTENTS[subDirMd]) {
            target = subDirMd;
          } else if (FILE_CONTENTS['/' + fileName]) {
            target = '/' + fileName;
          }
        }

        if (VFS[target] && VFS[target].type === 'dir') {
          // If trying to cat a directory, attempt to find a default markdown file in it
          const dirName = target.split('/').pop();
          const specificMd = `${target}/${dirName}.md`;
          const readmeMd = `${target}/readme.md`;
          
          if (FILE_CONTENTS[specificMd]) {
            setHistory(prev => [...prev, { type: 'output', text: FILE_CONTENTS[specificMd](t) }]);
          } else if (FILE_CONTENTS[readmeMd]) {
            setHistory(prev => [...prev, { type: 'output', text: FILE_CONTENTS[readmeMd](t) }]);
          } else {
            setHistory(prev => [...prev, { type: 'output', text: `${t('terminal.isDir')}${arg}` }]);
          }
        } else if (FILE_CONTENTS[target]) {
          setHistory(prev => [...prev, { type: 'output', text: FILE_CONTENTS[target](t) }]);
        } else {
          setHistory(prev => [...prev, { type: 'output', text: `${t('terminal.noSuchFile')}${arg}` }]);
        }
        break;
      }
      case 'sudo': {
        if (arg.toLowerCase() === 'rhce') {
          // Special Red Hat badge output
          const rhceASCII = `
==================================================
           RED HAT CERTIFIED ENGINEER             
==================================================
      _   _  _ ___ __  __ 
     /_\\ | \\| |_ _|  \\/  |
    / _ \\| .\` || || |\\/| |
   /_/ \\_\\_|\\_|___|_|  |_|
   
  Credential ID: 200-244-934
  RHCE Score:    300/300 (Perfect Score)
  RHCSA Score:   300/300 (Perfect Score)
  
  Ansible Automation / Shell Scripting / Security
==================================================
`;
          setHistory(prev => [...prev, { type: 'output', text: rhceASCII }]);
        } else {
          setHistory(prev => [...prev, { type: 'output', text: t('terminal.permissionDenied') }]);
        }
        break;
      }
      case 'neofetch': {
        const logoASCII = 
`      _   _  _ ___ __  __
     /_\\ | \\| |_ _|  \\/  |
    / _ \\| .\` || || |\\/| |
   /_/ \\_\\_|\\_|___|_|  |_|`;
        
        const neofetchInfo = (
          <div className="neofetch-container">
            <div className="neofetch-logo">{logoASCII}</div>
            <div className="neofetch-info">
              <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>anim@animos</span>
              <span>---------------------</span>
              <span><b>OS:</b> AnimOS v1.0.0</span>
              <span><b>Host:</b> React-Vite Web Console</span>
              <span><b>Kernel:</b> React 19.2.0</span>
              <span><b>Uptime:</b> 4 mins</span>
              <span><b>Shell:</b> zsh-sandbox</span>
              <span><b>Certified:</b> RHCE #200-244-934</span>
              <span><b>Score:</b> Perfect 300/300</span>
              <span><b>Location:</b> Tokyo, Japan</span>
            </div>
          </div>
        );
        setHistory(prev => [...prev, { type: 'output', node: neofetchInfo }]);
        break;
      }
      case 'ansible-playbook': {
        const resolvedArg = resolvePath(arg, currentDir);
        if (resolvedArg === '/playbooks/deploy_skills.yml' || arg === 'deploy_skills.yml') {
          executePlaybookSim();
        } else {
          setHistory(prev => [...prev, { type: 'output', text: t('terminal.usagePlaybook') }]);
        }
        break;
      }
      default:
        setHistory(prev => [...prev, { type: 'output', text: `${t('terminal.cmdNotFound')}${cmd}` }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isExecutingPlaybook) return;

    processCommand(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (isExecutingPlaybook) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      
      const trimmed = inputValue.trim();
      const parts = trimmed.split(/\s+/);
      
      if (/^(cd|cat|ls)\s+$/i.test(inputValue)) {
        // User typed "cd ", "cat ", or "ls " and pressed tab: list current directory contents
        const contents = VFS[currentDir]?.contents || [];
        const listText = contents.map(item => {
          const targetPath = currentDir === '/' ? `/${item}` : `${currentDir}/${item}`;
          const isDir = VFS[targetPath]?.type === 'dir';
          return isDir ? `${item}/` : item;
        }).join('   ');
        
        setHistory(prev => [
          ...prev,
          { type: 'input', text: inputValue, dir: currentDir },
          { type: 'output', text: listText }
        ]);
      } else if (/^theme\s+$/i.test(inputValue)) {
        // User typed "theme " and pressed tab: list available themes
        const themes = ['glass', 'matrix', 'cyberpunk', 'amber', 'classic'];
        const listText = themes.join('   ');
        
        setHistory(prev => [
          ...prev,
          { type: 'input', text: inputValue, dir: currentDir },
          { type: 'output', text: listText }
        ]);
      } else if (parts.length === 1 && parts[0]) {
        // Autocomplete command
        const cmdPrefix = parts[0];
        const commands = ['ls', 'cd', 'cat', 'clear', 'neofetch', 'ansible-playbook', 'theme', 'sudo', 'help'];
        const matches = commands.filter(c => c.startsWith(cmdPrefix));
        if (matches.length === 1) {
          setInputValue(matches[0] + ' ');
        }
      } else if (parts.length === 2 && parts[0] === 'theme' && parts[1]) {
        const themePrefix = parts[1].toLowerCase();
        const themes = ['glass', 'matrix', 'cyberpunk', 'amber', 'classic'];
        const matches = themes.filter(t => t.startsWith(themePrefix));
        
        if (matches.length === 1) {
          setInputValue(`theme ${matches[0]}`);
        } else if (matches.length > 1) {
          const listText = matches.join('   ');
          setHistory(prev => [
            ...prev,
            { type: 'input', text: inputValue, dir: currentDir },
            { type: 'output', text: listText }
          ]);
        }
      } else if (parts.length === 2 && (parts[0] === 'cd' || parts[0] === 'cat' || parts[0] === 'ls') && parts[1]) {
        const cmd = parts[0];
        const pathArg = parts[1];
        
        let parentPath = '';
        let prefix = pathArg;
        
        if (pathArg.includes('/')) {
          const lastSlashIndex = pathArg.lastIndexOf('/');
          parentPath = pathArg.substring(0, lastSlashIndex);
          prefix = pathArg.substring(lastSlashIndex + 1);
        }
        
        const resolvedParent = resolvePath(parentPath || '.', currentDir);
        
        if (VFS[resolvedParent] && VFS[resolvedParent].type === 'dir') {
          const contents = VFS[resolvedParent].contents || [];
          const matches = contents.filter(item => item.startsWith(prefix));
          
          if (matches.length === 1) {
            const match = matches[0];
            const targetPath = resolvedParent === '/' ? `/${match}` : `${resolvedParent}/${match}`;
            const isDirectory = VFS[targetPath]?.type === 'dir';
            const suffix = isDirectory ? '/' : '';
            
            const completedPath = parentPath ? `${parentPath}/${match}${suffix}` : `${match}${suffix}`;
            setInputValue(`${cmd} ${completedPath}`);
          } else if (matches.length > 1 || (prefix === '' && contents.length > 0)) {
            const listText = (matches.length > 0 ? matches : contents).map(item => {
              const targetPath = resolvedParent === '/' ? `/${item}` : `${resolvedParent}/${item}`;
              const isDir = VFS[targetPath]?.type === 'dir';
              return isDir ? `${item}/` : item;
            }).join('   ');
            
            setHistory(prev => [
              ...prev,
              { type: 'input', text: inputValue, dir: currentDir },
              { type: 'output', text: listText }
            ]);
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex === commandHistory.length - 1 ? -1 : historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputValue(nextIndex === -1 ? '' : commandHistory[nextIndex]);
      }
    }
  };

  // Convert current directory path for visual display
  const getPromptPath = () => {
    if (currentDir === '/') return '~';
    return `~${currentDir}`;
  };

  return (
    <div 
      className={`terminal-sandbox theme-${theme}`} 
      onClick={focusInput}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Also focus on any general keydown if not typing
        if (e.target.tagName !== 'INPUT') {
          focusInput();
        }
      }}
    >
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
        </div>
        <div className="terminal-title">
          anim@animos: {getPromptPath()}
        </div>
        <div className="terminal-actions">
          <span className="terminal-action-btn" title="Reset Terminal" onClick={(e) => {
            e.stopPropagation();
            setHistory([{ type: 'output', text: t('terminal.welcome') }]);
            setCurrentDir('/');
            setInputValue('');
          }} role="button" tabIndex={0}>
            <RefreshCw size={12} />
          </span>
        </div>
      </div>

      <div className="terminal-screen" ref={screenRef}>
        {history.map((line, index) => (
          <div key={index} className="terminal-output-line">
            {line.type === 'input' ? (
              <div>
                <span className="terminal-prompt">
                  anim@animos:{line.dir === '/' ? '~' : `~${line.dir}`} $
                </span>
                <span>{line.text}</span>
              </div>
            ) : line.node ? (
              line.node
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }}>{line.text}</div>
            )}
          </div>
        ))}

        {!isExecutingPlaybook && (
          <form onSubmit={handleSubmit} className="terminal-input-row">
            <span className="terminal-prompt">
              anim@animos:{getPromptPath()} $
            </span>
            <div className="terminal-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                disabled={isExecutingPlaybook}
              />
              <span className="terminal-cursor"></span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TerminalSandbox;
