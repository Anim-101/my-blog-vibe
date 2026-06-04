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

  const [interactiveMode, setInteractiveMode] = useState(null); // null | 'guestbook' | 'snake'
  const [guestbookStep, setGuestbookStep] = useState(0); // 0: Name, 1: Company, 2: Message
  const [tempSignature, setTempSignature] = useState({ name: '', company: '', message: '' });

  // Snake Game State
  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Tetris Game State
  const [tetrisGrid, setTetrisGrid] = useState(Array.from({ length: 15 }, () => Array(10).fill(0)));
  const [tetrisPiece, setTetrisPiece] = useState(null);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisHighScore, setTetrisHighScore] = useState(0);
  const [tetrisGameOver, setTetrisGameOver] = useState(false);

  const screenRef = useRef(null);
  const inputRef = useRef(null);
  const playbookIntervalRef = useRef(null);

  // Helper to spawn food for Snake game
  const spawnFood = (currentSnake) => {
    let newFood;
    let attempts = 0;
    while (attempts < 100) {
      const x = Math.floor(Math.random() * 15);
      const y = Math.floor(Math.random() * 10);
      const onSnake = currentSnake.some(segment => segment.x === x && segment.y === y);
      if (!onSnake) {
        newFood = { x, y };
        break;
      }
      attempts++;
    }
    if (!newFood) {
      newFood = { x: 0, y: 0 };
    }
    return newFood;
  };

  // Helper to start the Snake game
  const startSnakeGame = () => {
    setInteractiveMode('snake');
    const initialSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setFood(spawnFood(initialSnake));
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('my_blog_vibe_snake_highscore');
      setHighScore(stored ? parseInt(stored, 10) : 0);
    }
  };

  // Tetris Definitions & Helpers
  const TETROMINOES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]]
  };

  const spawnTetrisPiece = () => {
    const keys = Object.keys(TETROMINOES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const shape = TETROMINOES[randomKey];
    const x = Math.floor((10 - shape[0].length) / 2);
    return { shape, x, y: 0, type: randomKey };
  };

  const checkTetrisCollision = (shape, x, y, boardGrid) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nextX = x + c;
          const nextY = y + r;
          
          if (nextX < 0 || nextX >= 10 || nextY >= 15) {
            return true;
          }
          
          if (nextY >= 0 && boardGrid[nextY][nextX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const startTetrisGame = () => {
    setInteractiveMode('tetris');
    setTetrisGrid(Array.from({ length: 15 }, () => Array(10).fill(0)));
    setTetrisScore(0);
    setTetrisGameOver(false);
    const initialPiece = spawnTetrisPiece();
    setTetrisPiece(initialPiece);

    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('my_blog_vibe_tetris_highscore');
      setTetrisHighScore(stored ? parseInt(stored, 10) : 0);
    }
  };

  const lockTetrisPiece = (piece) => {
    setTetrisGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      const { shape, x, y } = piece;
      
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const boardRow = y + r;
            const boardCol = x + c;
            if (boardRow >= 0 && boardRow < 15 && boardCol >= 0 && boardCol < 10) {
              newGrid[boardRow][boardCol] = 1;
            }
          }
        }
      }
      
      let linesCleared = 0;
      const filteredGrid = newGrid.filter(row => {
        const isFull = row.every(cell => cell === 1);
        if (isFull) linesCleared++;
        return !isFull;
      });
      
      while (filteredGrid.length < 15) {
        filteredGrid.unshift(Array(10).fill(0));
      }
      
      if (linesCleared > 0) {
        setTetrisScore(prevScore => {
          const points = [0, 100, 300, 500, 800];
          const nextScore = prevScore + (points[linesCleared] || 1000);
          if (nextScore > tetrisHighScore) {
            setTetrisHighScore(nextScore);
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem('my_blog_vibe_tetris_highscore', nextScore.toString());
            }
          }
          return nextScore;
        });
      }
      
      return filteredGrid;
    });
  };

  const rotateTetrisPiece = () => {
    setTetrisPiece(prev => {
      if (!prev) return prev;
      const n = prev.shape.length;
      const m = prev.shape[0].length;
      const rotatedShape = Array.from({ length: m }, () => Array(n).fill(0));
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < m; c++) {
          rotatedShape[c][n - 1 - r] = prev.shape[r][c];
        }
      }
      
      const kicks = [0, -1, 1, -2, 2];
      for (const kick of kicks) {
        if (!checkTetrisCollision(rotatedShape, prev.x + kick, prev.y, tetrisGrid)) {
          return { ...prev, shape: rotatedShape, x: prev.x + kick };
        }
      }
      return prev;
    });
  };

  // Helper to format and display guestbook list
  const printGuestbookList = (entriesList) => {
    const list = entriesList || [];
    if (list.length === 0) {
      setHistory(prev => [...prev, { type: 'output', text: t('terminal.guestbookNoEntries') }]);
      return;
    }
    
    let outputText = `\n${t('terminal.guestbookTitle')}\n\n`;
    
    // Monospace column layout
    const colName = "NAME".padEnd(20);
    const colCompany = "COMPANY / ROLE".padEnd(30);
    const colDate = "DATE".padEnd(12);
    const colMessage = "MESSAGE";
    
    outputText += `${colName} | ${colCompany} | ${colDate} | ${colMessage}\n`;
    outputText += `${"-".repeat(20)}-+-${"-".repeat(30)}-+-${"-".repeat(12)}-+-${"-".repeat(20)}\n`;
    
    list.forEach(entry => {
      const name = (entry.name || '').substring(0, 19).padEnd(20);
      const company = (entry.company || '').substring(0, 29).padEnd(30);
      const date = (entry.date || '').substring(0, 11).padEnd(12);
      const message = entry.message || '';
      outputText += `${name} | ${company} | ${date} | ${message}\n`;
    });
    
    outputText += "\n";
    setHistory(prev => [...prev, { type: 'output', text: outputText }]);
  };

  // Initialize with welcome message, load highscore & seed guestbook on mount
  useEffect(() => {
    setHistory([{ type: 'output', text: t('terminal.welcome') }]);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('my_blog_vibe_snake_highscore');
      if (stored) {
        setHighScore(parseInt(stored, 10));
      }

      const storedTetris = window.localStorage.getItem('my_blog_vibe_tetris_highscore');
      if (storedTetris) {
        setTetrisHighScore(parseInt(storedTetris, 10));
      }
      
      const storedGb = window.localStorage.getItem('my_blog_vibe_guestbook');
      if (!storedGb) {
        const mockEntries = [
          {
            name: "Sarah Jenkins",
            company: "TechCorp Global / Tech Recruiter",
            message: "Loved the interactive playbook simulator! Very creative portfolio.",
            date: "2026-06-01"
          },
          {
            name: "Kenji Sato",
            company: "Cloud Solutions Japan / DevOps Lead",
            message: "Impressive RHCE credentials. The 3D skills constellation works beautifully.",
            date: "2026-06-03"
          }
        ];
        window.localStorage.setItem('my_blog_vibe_guestbook', JSON.stringify(mockEntries));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Snake Game Loop
  useEffect(() => {
    if (interactiveMode !== 'snake' || gameOver) return;

    const isTest = import.meta.env.MODE === 'test';
    const tickRate = isTest ? 1 : 200;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        if (prevSnake.length === 0) return prevSnake;

        const head = prevSnake[0];
        let newHead = { ...head };

        switch (direction) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
          default:
            break;
        }

        // Check boundary collision (15x10 grid)
        if (newHead.x < 0 || newHead.x >= 15 || newHead.y < 0 || newHead.y >= 10) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        const hitSelf = prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
        if (hitSelf) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prevScore => {
            const nextScore = prevScore + 1;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('my_blog_vibe_snake_highscore', nextScore.toString());
              }
            }
            return nextScore;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, tickRate);

    return () => clearInterval(interval);
  }, [interactiveMode, gameOver, direction, food, highScore]);

  // Tetris Game Loop - Drop Tick
  useEffect(() => {
    if (interactiveMode !== 'tetris' || tetrisGameOver) return;

    const isTest = import.meta.env.MODE === 'test';
    const tickRate = isTest ? 1 : 500;

    const interval = setInterval(() => {
      setTetrisPiece(prevPiece => {
        if (!prevPiece) return prevPiece;
        const canMoveDown = !checkTetrisCollision(prevPiece.shape, prevPiece.x, prevPiece.y + 1, tetrisGrid);
        if (canMoveDown) {
          return { ...prevPiece, y: prevPiece.y + 1 };
        } else {
          lockTetrisPiece(prevPiece);
          return null;
        }
      });
    }, tickRate);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveMode, tetrisGameOver, tetrisGrid]);

  // Tetris Game Loop - Spawn Trigger
  useEffect(() => {
    if (interactiveMode === 'tetris' && !tetrisPiece && !tetrisGameOver) {
      const next = spawnTetrisPiece();
      if (checkTetrisCollision(next.shape, next.x, next.y, tetrisGrid)) {
        setTetrisGameOver(true);
      } else {
        setTetrisPiece(next);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveMode, tetrisPiece, tetrisGameOver, tetrisGrid]);

  const renderTetrisBoard = () => {
    const board = tetrisGrid.map(row => [...row]);
    
    if (tetrisPiece) {
      const { shape, x, y } = tetrisPiece;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const boardRow = y + r;
            const boardCol = x + c;
            if (boardRow >= 0 && boardRow < 15 && boardCol >= 0 && boardCol < 10) {
              board[boardRow][boardCol] = 1;
            }
          }
        }
      }
    }
    
    const textBoard = board.map(row => {
      return row.map(cell => (cell ? '■' : '·')).join(' ');
    });
    
    return (
      <div className="tetris-board-container" data-testid="tetris-game-board">
        <div className="tetris-stats">
          <span>{t('terminal.tetrisScore')}{tetrisScore}</span>
          <span>{t('terminal.tetrisHighScore')}{tetrisHighScore}</span>
        </div>
        <div className="tetris-grid">
          <div>╔═════════════════════╗</div>
          {textBoard.map((rowText, i) => (
            <div key={i}>║ {rowText} ║</div>
          ))}
          <div>╚═════════════════════╝</div>
        </div>
        <div className="tetris-instructions">
          {tetrisGameOver ? (
            <span className="tetris-game-over-text">{t('terminal.tetrisGameOver')}</span>
          ) : (
            <span>{t('terminal.tetrisInstructions')}</span>
          )}
        </div>
      </div>
    );
  };

  const isSnakeDanger = () => {
    if (interactiveMode !== 'snake' || snake.length === 0 || gameOver) return false;
    const head = snake[0];
    
    // Check near walls (grid size: 15 columns x 10 rows)
    if (head.x === 0 && direction === 'LEFT') return true;
    if (head.x === 14 && direction === 'RIGHT') return true;
    if (head.y === 0 && direction === 'UP') return true;
    if (head.y === 9 && direction === 'DOWN') return true;
    
    // Check near body segments
    let nextX = head.x;
    let nextY = head.y;
    switch (direction) {
      case 'UP': nextY -= 1; break;
      case 'DOWN': nextY += 1; break;
      case 'LEFT': nextX -= 1; break;
      case 'RIGHT': nextX += 1; break;
      default: break;
    }
    const hitSelf = snake.slice(1).some(segment => segment.x === nextX && segment.y === nextY);
    if (hitSelf) return true;
    
    return false;
  };

  const renderSnakeBoard = () => {
    const board = [];
    const danger = isSnakeDanger();

    // Determine snake head arrow based on direction
    let headChar = '■';
    if (direction === 'UP') headChar = '▲';
    else if (direction === 'DOWN') headChar = '▼';
    else if (direction === 'LEFT') headChar = '◀';
    else if (direction === 'RIGHT') headChar = '▶';

    for (let y = 0; y < 10; y++) {
      const row = [];
      for (let x = 0; x < 15; x++) {
        const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
        const isBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        if (isHead) {
          row.push(headChar);
        } else if (isBody) {
          row.push('□');
        } else if (isFood) {
          row.push('★');
        } else {
          row.push('·');
        }
      }
      board.push(row.join(' '));
    }

    return (
      <div className={`snake-board-container${danger ? ' danger' : ''}`} data-testid="snake-game-board">
        <div className="snake-stats">
          <span>{t('terminal.snakeScore')}{score}</span>
          {danger && <span className="snake-danger-flash">⚠️ DANGER ⚠️</span>}
          <span>{t('terminal.snakeHighScore')}{highScore}</span>
        </div>
        <div className="snake-grid">
          <div>╔═════════════════════════════╗</div>
          {board.map((rowText, i) => (
            <div key={i}>║ {rowText} ║</div>
          ))}
          <div>╚═════════════════════════════╝</div>
        </div>
        <div className="snake-instructions">
          {gameOver ? (
            <span className="snake-game-over-text">{t('terminal.snakeGameOver')}</span>
          ) : danger ? (
            <span className="snake-game-warning-text">⚠️ COLLISION IMMINENT! CHANGE DIRECTION!</span>
          ) : (
            <span>{t('terminal.snakeInstructions')}</span>
          )}
        </div>
      </div>
    );
  };

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
      case 'guestbook': {
        const sub = arg.toLowerCase().trim();
        if (sub === 'sign') {
          setInteractiveMode('guestbook');
          setGuestbookStep(0);
          setTempSignature({ name: '', company: '', message: '' });
          setHistory(prev => [...prev, { type: 'output', text: "\nStarting interactive Guestbook signature wizard. Press ESC at any time to cancel.\n" }]);
        } else if (sub === 'clear') {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem('my_blog_vibe_guestbook');
          }
          setHistory(prev => [...prev, { type: 'output', text: t('terminal.gbCleared') }]);
        } else if (sub === 'list' || !sub) {
          let entries = [];
          if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem('my_blog_vibe_guestbook');
            if (stored) {
              try {
                entries = JSON.parse(stored);
              } catch {
                entries = [];
              }
            }
          }
          printGuestbookList(entries);
        } else {
          setHistory(prev => [...prev, { type: 'output', text: t('terminal.guestbookHelp') }]);
        }
        break;
      }
      case 'snake':
      case 'play':
        startSnakeGame();
        break;
      case 'tetris':
        startTetrisGame();
        break;
      default:
        setHistory(prev => [...prev, { type: 'output', text: `${t('terminal.cmdNotFound')}${cmd}` }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isExecutingPlaybook) return;

    if (interactiveMode === 'guestbook') {
      const val = inputValue.trim();
      if (!val && guestbookStep < 2) return; // Name and company shouldn't be empty
      if (guestbookStep === 0) {
        setTempSignature(prev => ({ ...prev, name: val }));
        setHistory(prev => [...prev, { type: 'input', text: `${t('terminal.gbEnterName')}${val}`, dir: currentDir }]);
        setGuestbookStep(1);
        setInputValue('');
      } else if (guestbookStep === 1) {
        setTempSignature(prev => ({ ...prev, company: val }));
        setHistory(prev => [...prev, { type: 'input', text: `${t('terminal.gbEnterCompany')}${val}`, dir: currentDir }]);
        setGuestbookStep(2);
        setInputValue('');
      } else if (guestbookStep === 2) {
        const entry = {
          name: tempSignature.name,
          company: tempSignature.company,
          message: val || 'Visited!',
          date: new Date().toISOString().split('T')[0]
        };
        
        let entries = [];
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = window.localStorage.getItem('my_blog_vibe_guestbook');
          if (stored) {
            try {
              entries = JSON.parse(stored);
            } catch {
              entries = [];
            }
          }
          entries.push(entry);
          window.localStorage.setItem('my_blog_vibe_guestbook', JSON.stringify(entries));
        }
        
        setHistory(prev => [
          ...prev,
          { type: 'input', text: `${t('terminal.gbEnterMessage')}${val}`, dir: currentDir },
          { type: 'output', text: `\n${t('terminal.gbSignedSuccess')}\n` }
        ]);
        
        printGuestbookList(entries);
        
        setInteractiveMode(null);
        setGuestbookStep(0);
        setInputValue('');
      }
      return;
    }

    processCommand(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (isExecutingPlaybook) {
      e.preventDefault();
      return;
    }

    if (interactiveMode === 'tetris') {
      e.preventDefault();
      const key = e.key.toUpperCase();
      
      if (tetrisGameOver) {
        if (key === 'R') {
          startTetrisGame();
        } else if (key === 'Q') {
          setInteractiveMode(null);
          setHistory(prev => [...prev, { type: 'output', text: "\nTetris game exited.\n" }]);
        }
        return;
      }

      if (key === 'Q') {
        setInteractiveMode(null);
        setHistory(prev => [...prev, { type: 'output', text: "\nTetris game exited.\n" }]);
        return;
      }

      if (key === 'ARROWLEFT' || key === 'A') {
        setTetrisPiece(prev => {
          if (!prev) return prev;
          const nextX = prev.x - 1;
          if (!checkTetrisCollision(prev.shape, nextX, prev.y, tetrisGrid)) {
            return { ...prev, x: nextX };
          }
          return prev;
        });
      } else if (key === 'ARROWRIGHT' || key === 'D') {
        setTetrisPiece(prev => {
          if (!prev) return prev;
          const nextX = prev.x + 1;
          if (!checkTetrisCollision(prev.shape, nextX, prev.y, tetrisGrid)) {
            return { ...prev, x: nextX };
          }
          return prev;
        });
      } else if (key === 'ARROWDOWN' || key === 'S') {
        setTetrisPiece(prev => {
          if (!prev) return prev;
          const nextY = prev.y + 1;
          if (!checkTetrisCollision(prev.shape, prev.x, nextY, tetrisGrid)) {
            return { ...prev, y: nextY };
          }
          return prev;
        });
      } else if (key === 'ARROWUP' || key === 'W') {
        rotateTetrisPiece();
      } else if (e.key === ' ' || key === 'SPACE') {
        setTetrisPiece(prev => {
          if (!prev) return prev;
          let currentY = prev.y;
          while (!checkTetrisCollision(prev.shape, prev.x, currentY + 1, tetrisGrid)) {
            currentY++;
          }
          const droppedPiece = { ...prev, y: currentY };
          lockTetrisPiece(droppedPiece);
          return null;
        });
      }
      return;
    }

    if (interactiveMode === 'snake') {
      e.preventDefault();
      const key = e.key.toUpperCase();
      if (gameOver) {
        if (key === 'R') {
          startSnakeGame();
        } else if (key === 'Q') {
          setInteractiveMode(null);
          setHistory(prev => [...prev, { type: 'output', text: "\nSnake game exited.\n" }]);
        }
        return;
      }
      
      if (key === 'Q') {
        setInteractiveMode(null);
        setHistory(prev => [...prev, { type: 'output', text: "\nSnake game exited.\n" }]);
        return;
      }
      
      if ((key === 'ARROWUP' || key === 'W') && direction !== 'DOWN') {
        setDirection('UP');
      } else if ((key === 'ARROWDOWN' || key === 'S') && direction !== 'UP') {
        setDirection('DOWN');
      } else if ((key === 'ARROWLEFT' || key === 'A') && direction !== 'RIGHT') {
        setDirection('LEFT');
      } else if ((key === 'ARROWRIGHT' || key === 'D') && direction !== 'LEFT') {
        setDirection('RIGHT');
      }
      return;
    }

    if (interactiveMode === 'guestbook' && e.key === 'Escape') {
      e.preventDefault();
      setInteractiveMode(null);
      setGuestbookStep(0);
      setInputValue('');
      setHistory(prev => [...prev, { type: 'output', text: "\nGuestbook signature cancelled.\n" }]);
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
      } else if (/^guestbook\s+$/i.test(inputValue)) {
        // User typed "guestbook " and pressed tab: list guestbook options
        const subs = ['sign', 'list', 'clear'];
        const listText = subs.join('   ');
        
        setHistory(prev => [
          ...prev,
          { type: 'input', text: inputValue, dir: currentDir },
          { type: 'output', text: listText }
        ]);
      } else if (parts.length === 1 && parts[0]) {
        // Autocomplete command
        const cmdPrefix = parts[0];
        const commands = ['ls', 'cd', 'cat', 'clear', 'neofetch', 'ansible-playbook', 'theme', 'sudo', 'help', 'guestbook', 'snake', 'tetris'];
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
      } else if (parts.length === 2 && parts[0] === 'guestbook' && parts[1]) {
        const subPrefix = parts[1].toLowerCase();
        const subs = ['sign', 'list', 'clear'];
        const matches = subs.filter(s => s.startsWith(subPrefix));
        
        if (matches.length === 1) {
          setInputValue(`guestbook ${matches[0]}`);
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
            setInteractiveMode(null);
            setGuestbookStep(0);
            setTetrisGrid(Array.from({ length: 15 }, () => Array(10).fill(0)));
            setTetrisPiece(null);
            setTetrisScore(0);
            setTetrisGameOver(false);
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

        {interactiveMode === 'snake' && renderSnakeBoard()}
        {interactiveMode === 'tetris' && renderTetrisBoard()}

        {!isExecutingPlaybook && (
          <form onSubmit={handleSubmit} className="terminal-input-row">
            {interactiveMode === 'snake' ? (
              <div style={{ color: 'var(--accent-secondary)', opacity: 0.8, fontSize: '0.85rem' }}>
                [Snake Active] Controls: Arrow keys / WASD. Press Q to Quit.
              </div>
            ) : interactiveMode === 'tetris' ? (
              <div style={{ color: 'var(--accent-secondary)', opacity: 0.8, fontSize: '0.85rem' }}>
                [Tetris Active] Controls: W/S/A/D / Arrows / Space. Press Q to Quit.
              </div>
            ) : interactiveMode === 'guestbook' ? (
              <span className="terminal-prompt">
                {guestbookStep === 0 ? t('terminal.gbEnterName') : guestbookStep === 1 ? t('terminal.gbEnterCompany') : t('terminal.gbEnterMessage')}
              </span>
            ) : (
              <span className="terminal-prompt">
                anim@animos:{getPromptPath()} $
              </span>
            )}
            <div className="terminal-input-wrapper" style={(interactiveMode === 'snake' || interactiveMode === 'tetris') ? { opacity: 0, position: 'absolute', pointerEvents: 'none' } : {}}>
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
