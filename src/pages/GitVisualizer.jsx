import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import './GitVisualizer.css';

// Game level definitions
const LEVELS = [
  {
    id: 1,
    goal: "Create a branch named 'feature', switch to it, and create a commit.",
    setup: () => ({
      commits: {
        'c0': { id: 'c0', message: 'Initial commit', parents: [], branch: 'master', depth: 0 }
      },
      branches: { master: 'c0' },
      activeBranch: 'master',
      head: 'master',
      counter: 1
    }),
    checkWin: (state) => {
      const { branches, commits, activeBranch } = state;
      // Must have feature branch
      if (!branches.feature) return false;
      // Active branch must be feature
      if (activeBranch !== 'feature') return false;
      // Feature branch must point to a new commit (not c0)
      if (branches.feature === 'c0') return false;
      // The commit must have parent c0
      const tipCommit = commits[branches.feature];
      return tipCommit && tipCommit.parents.includes('c0');
    }
  },
  {
    id: 2,
    goal: "Merge the branch 'feature' into 'master' (perform a fast-forward merge).",
    setup: () => ({
      commits: {
        'c0': { id: 'c0', message: 'Initial commit', parents: [], branch: 'master', depth: 0 },
        'c1': { id: 'c1', message: 'Add layout shell', parents: ['c0'], branch: 'feature', depth: 1 }
      },
      branches: { master: 'c0', feature: 'c1' },
      activeBranch: 'master',
      head: 'master',
      counter: 2
    }),
    checkWin: (state) => {
      const { branches, activeBranch } = state;
      // HEAD must be master
      if (activeBranch !== 'master') return false;
      // master must point to c1
      return branches.master === 'c1';
    }
  },
  {
    id: 3,
    goal: "Rebase the 'feature' branch onto 'master' to make the commit history linear.",
    setup: () => ({
      commits: {
        'c0': { id: 'c0', message: 'Initial commit', parents: [], branch: 'master', depth: 0 },
        'c1': { id: 'c1', message: 'Commit on master', parents: ['c0'], branch: 'master', depth: 1 },
        'c2': { id: 'c2', message: 'Commit on feature', parents: ['c0'], branch: 'feature', depth: 1 }
      },
      branches: { master: 'c1', feature: 'c2' },
      activeBranch: 'feature',
      head: 'feature',
      counter: 3
    }),
    checkWin: (state) => {
      const { branches, commits, activeBranch } = state;
      // HEAD must be on feature
      if (activeBranch !== 'feature') return false;
      // feature must point to a commit that is on top of master (c1)
      const featureCommitId = branches.feature;
      const featureCommit = commits[featureCommitId];
      if (!featureCommit || featureCommitId === 'c2') return false;
      
      // The parent of the rebased feature commit should be master's commit (c1)
      return featureCommit.parents.includes('c1');
    }
  },
  {
    id: 4,
    goal: "Cherry-pick commit 'c2' from 'feature' branch onto 'master'.",
    setup: () => ({
      commits: {
        'c0': { id: 'c0', message: 'Initial commit', parents: [], branch: 'master', depth: 0 },
        'c1': { id: 'c1', message: 'Hotfix on master', parents: ['c0'], branch: 'master', depth: 1 },
        'c2': { id: 'c2', message: 'SQL setup on feature', parents: ['c0'], branch: 'feature', depth: 1 },
        'c3': { id: 'c3', message: 'SQL seed data', parents: ['c2'], branch: 'feature', depth: 2 }
      },
      branches: { master: 'c1', feature: 'c3' },
      activeBranch: 'master',
      head: 'master',
      counter: 4
    }),
    checkWin: (state) => {
      const { branches, commits, activeBranch } = state;
      // HEAD must be master
      if (activeBranch !== 'master') return false;
      
      // master must point to a new commit (not c1)
      const masterCommitId = branches.master;
      if (masterCommitId === 'c1') return false;
      
      // That commit's parent must be c1, and it must clone c2's message
      const masterCommit = commits[masterCommitId];
      return masterCommit && masterCommit.parents.includes('c1') && masterCommit.message.includes('SQL setup');
    }
  }
];

const GitVisualizer = () => {
  const { t } = useTranslation();
  const [gameMode, setGameMode] = useState('sandbox'); // 'sandbox' or 'game'
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  
  // Sandbox default state
  const [gitState, setGitState] = useState(() => ({
    commits: {
      'c0': { id: 'c0', message: 'Initial commit', parents: [], branch: 'master', depth: 0 }
    },
    branches: { master: 'c0' },
    activeBranch: 'master',
    head: 'master',
    counter: 1
  }));
  
  const [commandInput, setCommandInput] = useState('');
  const [logs, setLogs] = useState([
    { type: 'info', text: 'Git interactive shell initialized. Type git commands to begin.' }
  ]);
  const [hasWon, setHasWon] = useState(false);
  const terminalLogsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (terminalLogsEndRef.current?.scrollIntoView) {
      terminalLogsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle switching level/mode
  useEffect(() => {
    resetLevel();
  }, [gameMode, currentLevelIdx]);

  const resetLevel = () => {
    setHasWon(false);
    if (gameMode === 'sandbox') {
      setGitState({
        commits: {
          'c0': { id: 'c0', message: 'Initial commit', parents: [], branch: 'master', depth: 0 }
        },
        branches: { master: 'c0' },
        activeBranch: 'master',
        head: 'master',
        counter: 1
      });
      setLogs([{ type: 'info', text: 'Sandbox reset. Enter git commands.' }]);
    } else {
      const level = LEVELS[currentLevelIdx];
      setGitState(level.setup());
      setLogs([
        { type: 'info', text: `Level ${level.id} started. Goal: ${level.goal}` }
      ]);
    }
  };

  // Helper to find common ancestor of two commits
  const findCommonAncestor = (c1, c2, commits) => {
    const getAncestors = (commitId) => {
      const list = new Set();
      const queue = [commitId];
      while (queue.length > 0) {
        const current = queue.shift();
        if (current && !list.has(current)) {
          list.add(current);
          const cObj = commits[current];
          if (cObj) queue.push(...cObj.parents);
        }
      }
      return list;
    };

    const ancestors1 = getAncestors(c1);
    const queue = [c2];
    while (queue.length > 0) {
      const current = queue.shift();
      if (ancestors1.has(current)) return current;
      const cObj = commits[current];
      if (cObj) queue.push(...cObj.parents);
    }
    return 'c0'; // fallback
  };

  // Execute Git Command Parser
  const runGitCommand = (cmdStr) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    setLogs(prev => [...prev, { type: 'input', text: `$ ${raw}` }]);
    setCommandInput('');

    const parts = raw.split(/\s+/);
    if (parts[0] !== 'git') {
      setLogs(prev => [...prev, { type: 'error', text: "error: not a git command. (Did you forget 'git'?)" }]);
      return;
    }

    const sub = parts[1];
    if (!sub) {
      setLogs(prev => [...prev, { type: 'error', text: 'usage: git [commit | branch | checkout | merge | rebase | cherry-pick]' }]);
      return;
    }

    // Clone state
    let state = JSON.parse(JSON.stringify(gitState));
    let { commits, branches, activeBranch, head, counter } = state;
    
    const getCurrentCommitId = () => {
      if (activeBranch) return branches[activeBranch];
      return head; // detached HEAD points directly to commit ID
    };

    const currentCommitId = getCurrentCommitId();

    if (sub === 'commit') {
      let msg = `Commit #${counter}`;
      const mIdx = parts.indexOf('-m');
      if (mIdx !== -1 && parts[mIdx + 1]) {
        // extract message between quotes
        const match = raw.match(/-m\s+["']([^"']+)["']/);
        if (match && match[1]) {
          msg = match[1];
        } else {
          msg = parts.slice(mIdx + 1).join(' ').replace(/["']/g, '');
        }
      }

      const newId = `c${counter}`;
      const parentObj = commits[currentCommitId];
      const nextDepth = parentObj ? parentObj.depth + 1 : 0;
      const currentBranch = activeBranch || 'detached';

      commits[newId] = {
        id: newId,
        message: msg,
        parents: [currentCommitId],
        branch: currentBranch,
        depth: nextDepth
      };

      if (activeBranch) {
        branches[activeBranch] = newId;
        state.head = activeBranch;
      } else {
        state.head = newId;
      }
      state.counter += 1;
      state.commits = commits;
      state.branches = branches;

      setGitState(state);
      setLogs(prev => [
        ...prev,
        { type: 'output', text: `[${currentBranch} ${newId}] ${msg}` }
      ]);

    } else if (sub === 'branch') {
      const bName = parts[2];
      if (!bName) {
        // print branches
        const bList = Object.keys(branches).map(b => {
          const isCurrent = activeBranch === b;
          return `${isCurrent ? '* ' : '  '}${b} (${branches[b]})`;
        }).join('\n');
        setLogs(prev => [...prev, { type: 'output', text: bList }]);
        return;
      }

      if (branches[bName]) {
        setLogs(prev => [...prev, { type: 'error', text: `fatal: A branch named '${bName}' already exists.` }]);
        return;
      }

      branches[bName] = currentCommitId;
      state.branches = branches;
      setGitState(state);
      setLogs(prev => [...prev, { type: 'output', text: `Created branch '${bName}' pointing to ${currentCommitId}` }]);

    } else if (sub === 'checkout') {
      const bIdx = parts.indexOf('-b');
      if (bIdx !== -1 && parts[bIdx + 1]) {
        const bName = parts[bIdx + 1];
        if (branches[bName]) {
          setLogs(prev => [...prev, { type: 'error', text: `fatal: A branch named '${bName}' already exists.` }]);
          return;
        }
        branches[bName] = currentCommitId;
        state.branches = branches;
        state.activeBranch = bName;
        state.head = bName;
        setGitState(state);
        setLogs(prev => [...prev, { type: 'output', text: `Switched to a new branch '${bName}'` }]);
        return;
      }

      const target = parts[2];
      if (!target) {
        setLogs(prev => [...prev, { type: 'error', text: 'usage: git checkout [-b] <branch-or-commit>' }]);
        return;
      }

      if (branches[target]) {
        state.activeBranch = target;
        state.head = target;
        setGitState(state);
        setLogs(prev => [...prev, { type: 'output', text: `Switched to branch '${target}'` }]);
      } else if (commits[target]) {
        state.activeBranch = null; // detached HEAD
        state.head = target;
        setGitState(state);
        setLogs(prev => [
          ...prev,
          { type: 'warning', text: `Note: switching to '${target}' (detached HEAD).` },
          { type: 'output', text: `HEAD is now at ${target}... ${commits[target].message}` }
        ]);
      } else {
        setLogs(prev => [...prev, { type: 'error', text: `error: pathspec '${target}' did not match any files.` }]);
      }

    } else if (sub === 'merge') {
      const targetBranch = parts[2];
      if (!targetBranch || !branches[targetBranch]) {
        setLogs(prev => [...prev, { type: 'error', text: `fatal: '${targetBranch || ''}' does not seem to be a valid branch.` }]);
        return;
      }

      if (activeBranch === targetBranch) {
        setLogs(prev => [...prev, { type: 'output', text: 'Already up to date.' }]);
        return;
      }

      const targetCommitId = branches[targetBranch];
      const curCommitId = currentCommitId;

      // Fast-forward check: is current commit an ancestor of target?
      const isAncestor = (anc, desc) => {
        if (anc === desc) return true;
        const queue = [desc];
        while (queue.length > 0) {
          const current = queue.shift();
          const cObj = commits[current];
          if (cObj) {
            if (cObj.parents.includes(anc)) return true;
            queue.push(...cObj.parents);
          }
        }
        return false;
      };

      if (isAncestor(targetCommitId, curCommitId)) {
        setLogs(prev => [...prev, { type: 'output', text: 'Already up to date.' }]);
        return;
      }

      if (isAncestor(curCommitId, targetCommitId)) {
        // Fast forward!
        if (activeBranch) {
          branches[activeBranch] = targetCommitId;
        } else {
          state.head = targetCommitId;
        }
        state.branches = branches;
        setGitState(state);
        setLogs(prev => [
          ...prev,
          { type: 'output', text: `Updating ${curCommitId}..${targetCommitId}\nFast-forward` }
        ]);
        return;
      }

      // Merge commit
      const newId = `c${counter}`;
      const curDepth = commits[curCommitId].depth;
      const tarDepth = commits[targetCommitId].depth;
      const nextDepth = Math.max(curDepth, tarDepth) + 1;

      commits[newId] = {
        id: newId,
        message: `Merge branch '${targetBranch}' into ${activeBranch || 'HEAD'}`,
        parents: [curCommitId, targetCommitId],
        branch: activeBranch || 'detached',
        depth: nextDepth
      };

      if (activeBranch) {
        branches[activeBranch] = newId;
      } else {
        state.head = newId;
      }
      state.counter += 1;
      state.commits = commits;
      state.branches = branches;

      setGitState(state);
      setLogs(prev => [
        ...prev,
        { type: 'output', text: `Merge made by the 'recursive' strategy.\nCreated merge commit ${newId}` }
      ]);

    } else if (sub === 'rebase') {
      const targetBranch = parts[2];
      if (!targetBranch || !branches[targetBranch]) {
        setLogs(prev => [...prev, { type: 'error', text: `fatal: '${targetBranch || ''}' is not a valid branch.` }]);
        return;
      }

      const targetCommitId = branches[targetBranch];
      const curCommitId = currentCommitId;

      if (curCommitId === targetCommitId) {
        setLogs(prev => [...prev, { type: 'output', text: 'Current branch is already up to date.' }]);
        return;
      }

      // Find common ancestor
      const ancestor = findCommonAncestor(curCommitId, targetCommitId, commits);
      
      // Get all commits on active branch back to ancestor
      const commitsToRebase = [];
      let curr = curCommitId;
      while (curr && curr !== ancestor) {
        const cObj = commits[curr];
        if (!cObj) break;
        commitsToRebase.unshift(cObj); // oldest first
        curr = cObj.parents[0]; // traverse first parent
      }

      if (commitsToRebase.length === 0) {
        // Fast-forward rebase
        if (activeBranch) {
          branches[activeBranch] = targetCommitId;
        } else {
          state.head = targetCommitId;
        }
        state.branches = branches;
        setGitState(state);
        setLogs(prev => [...prev, { type: 'output', text: `Successfully rebased and fast-forwarded to ${targetBranch}.` }]);
        return;
      }

      // Copy commits on top of target commit
      let lastParentId = targetCommitId;
      commitsToRebase.forEach((c) => {
        const newId = `c${counter}`;
        const pObj = commits[lastParentId];
        const nextDepth = pObj ? pObj.depth + 1 : 0;
        
        commits[newId] = {
          id: newId,
          message: `${c.message} (rebased)`,
          parents: [lastParentId],
          branch: activeBranch || 'detached',
          depth: nextDepth
        };
        lastParentId = newId;
        counter += 1;
      });

      if (activeBranch) {
        branches[activeBranch] = lastParentId;
      } else {
        state.head = lastParentId;
      }

      state.commits = commits;
      state.branches = branches;
      state.counter = counter;

      setGitState(state);
      setLogs(prev => [
        ...prev,
        { type: 'output', text: `Successfully rebased and updated refs/heads/${activeBranch || 'HEAD'}.` }
      ]);

    } else if (sub === 'cherry-pick') {
      const targetCommitId = parts[2];
      if (!targetCommitId || !commits[targetCommitId]) {
        setLogs(prev => [...prev, { type: 'error', text: `error: commit '${targetCommitId || ''}' does not exist.` }]);
        return;
      }

      const targetCommit = commits[targetCommitId];
      const newId = `c${counter}`;
      const pObj = commits[currentCommitId];
      const nextDepth = pObj ? pObj.depth + 1 : 0;

      commits[newId] = {
        id: newId,
        message: `${targetCommit.message} (cherry-picked)`,
        parents: [currentCommitId],
        branch: activeBranch || 'detached',
        depth: nextDepth
      };

      if (activeBranch) {
        branches[activeBranch] = newId;
      } else {
        state.head = newId;
      }
      state.counter += 1;
      state.commits = commits;
      state.branches = branches;

      setGitState(state);
      setLogs(prev => [
        ...prev,
        { type: 'output', text: `[${activeBranch || 'HEAD'} ${newId}] ${commits[newId].message}` }
      ]);

    } else {
      setLogs(prev => [...prev, { type: 'error', text: `fatal: Unknown git command '${sub}'.` }]);
    }
  };

  // Run validation checks for active levels
  useEffect(() => {
    if (gameMode === 'game' && !hasWon) {
      const level = LEVELS[currentLevelIdx];
      if (level.checkWin(gitState)) {
        setHasWon(true);
        setLogs(prev => [
          ...prev,
          { type: 'info', text: 'SUCCESS! Level goal met. Congratulations!' }
        ]);
      }
    }
  }, [gitState, gameMode, currentLevelIdx]);

  // Compute Layout Positions for Commit SVG Rendering
  const computeCommitLayout = () => {
    // Map branches to unique column indexes
    const branchCols = { 'master': 0 };
    let nextCol = 1;

    // Traverse all commits, compute their topological depth/column
    const sortedCommits = Object.values(gitState.commits).sort((a, b) => a.depth - b.depth);

    sortedCommits.forEach(c => {
      if (c.branch && branchCols[c.branch] === undefined) {
        branchCols[c.branch] = nextCol;
        nextCol += 1;
      }
    });

    const nodes = sortedCommits.map(c => {
      const col = branchCols[c.branch] !== undefined ? branchCols[c.branch] : 0;
      const x = 70 + (col * 110);
      const y = 60 + (c.depth * 75);
      return { ...c, x, y };
    });

    return nodes;
  };

  const layoutNodes = computeCommitLayout();

  // Find where labels/branch tags float on top of commits
  const getBranchPointers = () => {
    const list = [];
    Object.keys(gitState.branches).forEach(bName => {
      const targetCommit = gitState.branches[bName];
      const matchNode = layoutNodes.find(n => n.id === targetCommit);
      if (matchNode) {
        list.push({ name: bName, x: matchNode.x, y: matchNode.y, type: 'branch' });
      }
    });

    // Add HEAD pointer
    const headTarget = gitState.activeBranch ? gitState.branches[gitState.activeBranch] : gitState.head;
    const headNode = layoutNodes.find(n => n.id === headTarget);
    if (headNode) {
      list.push({ name: 'HEAD', x: headNode.x, y: headNode.y, type: 'head' });
    }

    return list;
  };

  const pointers = getBranchPointers();

  return (
    <div className="git-visualizer-page container">
      {/* Title */}
      <div className="designer-header">
        <h1 className="text-gradient">{t('git.title')}</h1>
        <p>{t('git.subtitle')}</p>
      </div>

      {/* Mode Switches */}
      <div className="git-controls-top">
        <div className="mode-toggle-group">
          <button 
            type="button"
            className={`mode-btn ${gameMode === 'sandbox' ? 'active' : ''}`}
            onClick={() => setGameMode('sandbox')}
          >
            {t('git.sandbox')}
          </button>
          <button 
            type="button"
            className={`mode-btn ${gameMode === 'game' ? 'active' : ''}`}
            onClick={() => setGameMode('game')}
          >
            {t('git.game')}
          </button>
        </div>

        {gameMode === 'game' && (
          <div className="level-select-group">
            <label style={{ marginRight: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
              Select Level:
            </label>
            <select 
              className="level-select"
              value={currentLevelIdx}
              onChange={(e) => setCurrentLevelIdx(parseInt(e.target.value))}
            >
              {LEVELS.map((lvl, idx) => (
                <option key={lvl.id} value={idx}>
                  {t('git.level', { level: lvl.id })}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          type="button" 
          className="git-reset-btn"
          onClick={resetLevel}
        >
          <RotateCcw size={14} /> {t('git.resetLevel')}
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="git-visualizer-workspace" data-testid="git-workspace">
        
        {/* Left/Bottom Column: Terminal and Game Instructions */}
        <div className="terminal-instructions-pane">
          {gameMode === 'game' && (
            <div className="game-instructions-card">
              <div className="instructions-header">
                <HelpCircle size={18} className="icon-blue" />
                <h4>{t('git.levelTitle')} #{LEVELS[currentLevelIdx].id}</h4>
              </div>
              <p className="instruction-text">{LEVELS[currentLevelIdx].goal}</p>
            </div>
          )}

          {/* CLI Terminal console */}
          <div className="git-terminal-console">
            <div className="git-terminal-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span style={{ marginLeft: '1rem', fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>
                git-bash -- {gameMode}
              </span>
            </div>

            <div className="git-terminal-logs">
              {logs.map((log, idx) => (
                <div key={idx} className={`git-log-row ${log.type}`}>
                  {log.text}
                </div>
              ))}
              <div ref={terminalLogsEndRef} />
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                runGitCommand(commandInput);
              }}
              className="git-terminal-input-form"
            >
              <span className="prompt-prefix">git-visualizer $</span>
              <input 
                type="text"
                className="git-terminal-input"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="e.g. git commit -m 'adds code'"
                autoFocus
              />
              <button type="submit" style={{ display: 'none' }} />
            </form>
          </div>
        </div>

        {/* Right Column: Interactive SVG Graph Panel */}
        <div className="git-graph-pane">
          <div className="graph-header">
            <GitBranch size={16} />
            <span>Commit History Graph</span>
          </div>

          <div className="graph-svg-container">
            <svg width="100%" height="100%" style={{ minHeight: '400px' }}>
              <defs>
                <marker 
                  id="arrow" 
                  viewBox="0 0 10 10" 
                  refX="18" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 255, 255, 0.25)" />
                </marker>
              </defs>

              {/* Render parent connections lines */}
              {layoutNodes.map((node) => {
                return node.parents.map((pId, idx) => {
                  const pNode = layoutNodes.find(n => n.id === pId);
                  if (!pNode) return null;
                  
                  // Curved paths to make layout feel modern and premium
                  const d = `M ${node.x} ${node.y} C ${(node.x + pNode.x) / 2} ${node.y}, ${(node.x + pNode.x) / 2} ${pNode.y}, ${pNode.x} ${pNode.y}`;
                  
                  return (
                    <path 
                      key={`${node.id}-${pId}-${idx}`}
                      d={d}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow)"
                    />
                  );
                });
              })}

              {/* Render Commit node circles */}
              {layoutNodes.map((node) => {
                const isActiveHead = gitState.activeBranch 
                  ? gitState.branches[gitState.activeBranch] === node.id 
                  : gitState.head === node.id;

                return (
                  <g key={node.id} className="commit-node-group">
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isActiveHead ? "15" : "12"}
                      className={`commit-circle ${isActiveHead ? 'head-glow' : ''}`}
                      style={{ 
                        fill: node.branch === 'master' ? '#3b82f6' : node.branch === 'feature' ? '#10b981' : '#f59e0b',
                        stroke: isActiveHead ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                        strokeWidth: isActiveHead ? 3.5 : 2
                      }}
                    />
                    {/* Commit ID Label */}
                    <text 
                      x={node.x} 
                      y={node.y + 4} 
                      textAnchor="middle" 
                      className="commit-node-label"
                    >
                      {node.id.toUpperCase()}
                    </text>
                    
                    {/* Hover Info Tooltip */}
                    <title>
                      {`${node.id.toUpperCase()}: ${node.message}\nBranch: ${node.branch}`}
                    </title>
                  </g>
                );
              })}

              {/* Render floating pointers labels next to node */}
              {pointers.map((p, idx) => {
                const isHead = p.type === 'head';
                const yOffset = isHead ? -32 : 32;
                const fill = isHead 
                  ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
                  : p.name === 'master' 
                  ? '#3b82f6' 
                  : '#10b981';

                return (
                  <g key={`${p.name}-${idx}`} className="pointer-tag-group">
                    {/* Background Tag Rectangle */}
                    <rect 
                      x={p.x - 35} 
                      y={p.y + yOffset - 12} 
                      width="70" 
                      height="20" 
                      rx="4" 
                      className={`pointer-tag-rect ${isHead ? 'head-pointer' : ''}`}
                      style={{ 
                        fill: isHead ? '#ef4444' : fill,
                        opacity: 0.95
                      }}
                    />
                    {/* Tag label text */}
                    <text 
                      x={p.x} 
                      y={p.y + yOffset + 2} 
                      textAnchor="middle" 
                      className="pointer-tag-text"
                    >
                      {p.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>

      {/* Level Success Celebration Overlay */}
      {hasWon && (
        <div className="celebration-overlay">
          <div className="celebration-card">
            <Trophy size={48} className="trophy-icon glow-animation" />
            <h3>{t('git.congrats')}</h3>
            <p>{t('git.success')}</p>

            <div className="celebration-actions">
              {currentLevelIdx < LEVELS.length - 1 ? (
                <button 
                  type="button" 
                  className="celeb-btn primary"
                  onClick={() => setCurrentLevelIdx(prev => prev + 1)}
                >
                  {t('git.nextLevel')} <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  type="button" 
                  className="celeb-btn secondary"
                  onClick={() => setGameMode('sandbox')}
                >
                  Go to Sandbox Mode
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitVisualizer;
