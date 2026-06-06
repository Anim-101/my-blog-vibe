import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileCode2, 
  Play, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Terminal, 
  Eye, 
  X, 
  FileText,
  FileCode,
  LayoutGrid,
  Database
} from 'lucide-react';
import './Compiler.css';

const INITIAL_FILES = {
  'script.py': `print("Hello from Python!")

# Calculate Fibonacci numbers
def fibonacci(n):
    a, b = 0, 1
    for i in range(n):
        print("Fibonacci(" + str(i) + ") =", a)
        a, b = b, a + b

fibonacci(8)
`,
  'main.js': `console.log("Hello from JavaScript!");

// Interactive counter logic for HTML Live Preview
function initCounter() {
  let count = 0;
  const counterVal = document.getElementById("counter-val");
  const decBtn = document.getElementById("dec-btn");
  const incBtn = document.getElementById("inc-btn");

  if (decBtn && incBtn && counterVal) {
    decBtn.onclick = () => {
      count--;
      counterVal.innerText = count;
      console.log("Counter decremented to: " + count);
    };
    incBtn.onclick = () => {
      count++;
      counterVal.innerText = count;
      console.log("Counter incremented to: " + count);
    };
    console.log("Interactive counter initialized successfully.");
  }
}

// Safely initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCounter);
} else {
  initCounter();
}
`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Repl.it Live Preview</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <div class="avatar-glow"></div>
    <h2>Interactive Counter</h2>
    <p>This page is rendering live inside your browser sandbox.</p>
    
    <div class="counter-box">
      <span id="counter-val">0</span>
      <div class="btn-group">
        <button id="dec-btn" class="ctrl-btn">-</button>
        <button id="inc-btn" class="ctrl-btn">+</button>
      </div>
    </div>
  </div>
  <script src="main.js"></script>
</body>
</html>
`,
  'style.css': `body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at center, #0B0E14 0%, #030406 100%);
  color: #fff;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

.card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  max-width: 320px;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: var(--accent-primary, #3b82f6);
  border-radius: 50%;
  filter: blur(15px);
  opacity: 0.6;
}

h2 {
  color: #3b82f6;
  margin-top: 0;
  font-size: 1.5rem;
  letter-spacing: -0.025em;
}

p {
  color: #8b949e;
  font-size: 0.85rem;
  line-height: 1.6;
}

.counter-box {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

#counter-val {
  font-size: 3.5rem;
  font-weight: 800;
  color: #39d353;
  text-shadow: 0 0 10px rgba(57, 211, 83, 0.3);
}

.btn-group {
  display: flex;
  gap: 1rem;
}

.ctrl-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ctrl-btn:hover {
  background: var(--accent-primary, #3b82f6);
  border-color: var(--accent-primary, #3b82f6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}
`,
  'query.sql': `-- SQL Database Query Sandbox
CREATE TABLE employees (
  id INT,
  name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);

INSERT INTO employees VALUES (1, 'Anim Akash', 'Engineering', 120000);
INSERT INTO employees VALUES (2, 'Bob Jones', 'Design', 95000);
INSERT INTO employees VALUES (3, 'Alice Smith', 'Engineering', 135000);
INSERT INTO employees VALUES (4, 'Charlie Brown', 'Marketing', 88000);

-- Query the table
SELECT name, department, salary FROM employees WHERE salary > 90000;
`,
  'README.md': `# Online Web & Script Compiler

Welcome to the browser-based REPL editor! You can create, edit, and run files instantly.

### Supported Features
1. **Python Scripting**: Run \`script.py\` to execute loops and math.
2. **JavaScript Shell**: Run \`main.js\` to run JS code.
3. **Database Queries**: Run \`query.sql\` to run SQL queries and render visual database tables.
4. **Markdown Preview**: Run \`README.md\` (or any \`.md\` file) to render a formatted live view page.
5. **Web Dev Mode**: Run \`index.html\` to launch the interactive live preview frame.
`
};

const Compiler = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('compiler_workspace');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });
  const [activeFile, setActiveFile] = useState('script.py');
  const [openFiles, setOpenFiles] = useState(['script.py', 'main.js', 'index.html', 'query.sql']);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('console'); // 'console' or 'preview'
  const [isRunning, setIsRunning] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [previewSrcDoc, setPreviewSrcDoc] = useState('');
  const [runStats, setRunStats] = useState(null);

  const editorRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('compiler_workspace', JSON.stringify(files));
  }, [files]);

  const updateFileContent = (filename, content) => {
    setFiles(prev => ({
      ...prev,
      [filename]: content
    }));
  };

  const addFile = (e) => {
    e.preventDefault();
    const name = newFileName.trim();
    if (!name) return;
    if (files[name] !== undefined) {
      alert('File already exists!');
      return;
    }

    setFiles(prev => ({
      ...prev,
      [name]: name.endsWith('.html') 
        ? '<h1>New Page</h1>' 
        : name.endsWith('.css') 
        ? 'body { background: #000; }' 
        : '// Write your code here'
    }));
    setActiveFile(name);
    if (!openFiles.includes(name)) {
      setOpenFiles(prev => [...prev, name]);
    }
    setNewFileName('');
    setShowNewFileInput(false);
    
    setConsoleLogs(prev => [
      ...prev,
      { type: 'info', text: `[INFO] File "${name}" created successfully.` }
    ]);
  };

  const deleteFile = (filename, e) => {
    e.stopPropagation();
    const defaults = ['script.py', 'main.js', 'index.html', 'style.css', 'README.md'];
    if (defaults.includes(filename)) {
      alert('Default template files cannot be deleted.');
      return;
    }

    const confirmDel = window.confirm(`Are you sure you want to delete ${filename}?`);
    if (!confirmDel) return;

    const updatedFiles = { ...files };
    delete updatedFiles[filename];
    setFiles(updatedFiles);

    const updatedOpen = openFiles.filter(f => f !== filename);
    setOpenFiles(updatedOpen);

    if (activeFile === filename) {
      setActiveFile(updatedOpen[0] || 'script.py');
    }

    setConsoleLogs(prev => [
      ...prev,
      { type: 'warning', text: `[WARNING] File "${filename}" was deleted.` }
    ]);
  };

  const handleTabClick = (filename) => {
    setActiveFile(filename);
    if (!openFiles.includes(filename)) {
      setOpenFiles(prev => [...prev, filename]);
    }
  };

  const closeTab = (filename, e) => {
    e.stopPropagation();
    const updated = openFiles.filter(f => f !== filename);
    setOpenFiles(updated);
    if (activeFile === filename && updated.length > 0) {
      setActiveFile(updated[updated.length - 1]);
    }
  };

  const resetWorkspace = () => {
    const confirmReset = window.confirm('Reset all files back to their default templates? Your changes will be lost.');
    if (!confirmReset) return;
    setFiles(INITIAL_FILES);
    setActiveFile('script.py');
    setOpenFiles(['script.py', 'main.js', 'index.html', 'query.sql']);
    setConsoleLogs([]);
    setPreviewSrcDoc('');
    setRunStats(null);
  };

  // Custom Python Interpreter in JavaScript
  const executePython = (code, customLogger) => {
    const lines = code.split('\n');
    const variables = {};
    let outputLines = 0;

    const parseVal = (expr) => {
      let trimmed = expr.trim();
      if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
      }
      if (!isNaN(trimmed)) {
        return Number(trimmed);
      }
      if (variables[trimmed] !== undefined) {
        return variables[trimmed];
      }
      // math parser
      try {
        let evalStr = trimmed;
        // replace functions like str(val)
        evalStr = evalStr.replace(/str\(([^)]+)\)/g, (_, match) => {
          return `String(${match})`;
        });
        Object.keys(variables).forEach(v => {
          evalStr = evalStr.replace(new RegExp(`\\b${v}\\b`, 'g'), variables[v]);
        });
        return eval(evalStr);
      } catch {
        return trimmed;
      }
    };

    const parsePrintArguments = (argStr) => {
      // Custom arg parser splitting by comma or plus while ignoring quotes
      const args = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';
      
      for (let i = 0; i < argStr.length; i++) {
        const char = argStr[i];
        if ((char === '"' || char === "'") && (i === 0 || argStr[i-1] !== '\\')) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char;
            current += char;
          } else if (char === quoteChar) {
            inQuotes = false;
            current += char;
          }
        } else if ((char === ',' || char === '+') && !inQuotes) {
          args.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      args.push(current.trim());
      
      return args
        .filter(arg => arg.length > 0)
        .map(arg => {
          const parsed = parseVal(arg);
          return typeof parsed === 'object' ? JSON.stringify(parsed) : String(parsed);
        })
        .join(' ');
    };

    try {
      let inLoop = false;
      let loopVar = '';
      let loopRange = [];
      let loopLines = [];

      const executeLine = (l) => {
        const lineVal = l.trim();
        if (!lineVal || lineVal.startsWith('#')) return;

        // Print Statement
        if (lineVal.startsWith('print(') && lineVal.endsWith(')')) {
          const inner = lineVal.slice(6, -1);
          const val = parsePrintArguments(inner);
          customLogger(val);
          outputLines++;
          return;
        }

        // Variable assignments
        if (lineVal.includes('=')) {
          const eqIdx = lineVal.indexOf('=');
          const varName = lineVal.slice(0, eqIdx).trim();
          const expr = lineVal.slice(eqIdx + 1).trim();

          // Swap variables: a, b = b, a + b
          if (varName.includes(',')) {
            const vars = varName.split(',').map(x => x.trim());
            const exprs = expr.split(',').map(x => x.trim());
            const nextVals = exprs.map(ex => parseVal(ex));
            vars.forEach((v, idx) => {
              variables[v] = nextVals[idx];
            });
          } else {
            variables[varName] = parseVal(expr);
          }
          return;
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (inLoop) {
          const indent = line.length - line.trimStart().length;
          if (indent > 0 && trimmed.length > 0) {
            loopLines.push(trimmed);
            continue;
          } else {
            // Loop ended, evaluate
            inLoop = false;
            loopRange.forEach(val => {
              variables[loopVar] = val;
              loopLines.forEach(l => executeLine(l));
            });
            loopLines = [];
          }
        }

        if (trimmed.startsWith('for ') && trimmed.includes(' in range(') && trimmed.endsWith(':')) {
          const loopHead = trimmed.replace('for ', '').replace(':', '');
          const parts = loopHead.split(' in ');
          loopVar = parts[0].trim();
          
          const rangeContent = parts[1].replace('range(', '').slice(0, -1);
          const rangeParts = rangeContent.split(',').map(x => parseVal(x.trim()));
          
          let start = 0, end = 0, step = 1;
          if (rangeParts.length === 1) {
            end = rangeParts[0];
          } else if (rangeParts.length === 2) {
            start = rangeParts[0];
            end = rangeParts[1];
          } else if (rangeParts.length === 3) {
            start = rangeParts[0];
            end = rangeParts[1];
            step = rangeParts[2];
          }
          
          loopRange = [];
          for (let val = start; step > 0 ? val < end : val > end; val += step) {
            loopRange.push(val);
          }
          inLoop = true;
          continue;
        }

        executeLine(line);
      }

      // Loop trailing evaluation
      if (inLoop && loopLines.length > 0) {
        loopRange.forEach(val => {
          variables[loopVar] = val;
          loopLines.forEach(l => executeLine(l));
        });
      }

      if (outputLines === 0) {
        customLogger("[Python complete: No output printed]");
      }
    } catch (err) {
      customLogger(`[Python Error] ${err.message}`, 'error');
    }
  };

  // Custom client-side SQL Query Sandbox interpreter
  const executeSQL = (code, logWriter, outputLogs) => {
    const cleanCode = code
      .split('\n')
      .map(line => {
        const commentIndex = line.indexOf('--');
        return commentIndex !== -1 ? line.substring(0, commentIndex) : line;
      })
      .join('\n');

    const statements = cleanCode.split(';').map(s => s.trim()).filter(s => s.length > 0);
    const localTables = {};

    statements.forEach(statement => {
      try {
        const upper = statement.toUpperCase();
        
        // 1. CREATE TABLE
        if (upper.startsWith('CREATE TABLE')) {
          const match = statement.match(/CREATE\s+TABLE\s+(\w+)\s*\(([^)]+)\)/i);
          if (!match) throw new Error("Syntax error in CREATE TABLE");
          const tableName = match[1].toLowerCase();
          const colsStr = match[2];
          const columns = colsStr.split(',').map(c => {
            const parts = c.trim().split(/\s+/);
            return parts[0].toLowerCase(); // column name
          });
          localTables[tableName] = { columns, rows: [] };
          logWriter(`[SQL] Table "${tableName}" created successfully.`, 'info');
        }
        
        // 2. INSERT INTO
        else if (upper.startsWith('INSERT INTO')) {
          const match = statement.match(/INSERT\s+INTO\s+(\w+)\s*(?:\(([^)]+)\))?\s*VALUES\s*\(([^)]+)\)/i);
          if (!match) throw new Error("Syntax error in INSERT INTO");
          const tableName = match[1].toLowerCase();
          const valuesStr = match[3];
          
          if (!localTables[tableName]) throw new Error(`Table "${tableName}" does not exist`);
          
          const table = localTables[tableName];
          const values = valuesStr.split(',').map(v => {
            const trimmed = v.trim();
            if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
              return trimmed.slice(1, -1);
            }
            return isNaN(trimmed) ? trimmed : Number(trimmed);
          });
          
          const row = {};
          table.columns.forEach((col, idx) => {
            row[col] = values[idx] !== undefined ? values[idx] : null;
          });
          table.rows.push(row);
          logWriter(`[SQL] 1 row inserted into "${tableName}".`, 'info');
        }
        
        // 3. SELECT
        else if (upper.startsWith('SELECT')) {
          const selectMatch = statement.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
          if (!selectMatch) throw new Error("Syntax error in SELECT");
          
          const colsSelector = selectMatch[1].trim();
          const tableName = selectMatch[2].toLowerCase();
          const whereClause = selectMatch[3];
          
          if (!localTables[tableName]) throw new Error(`Table "${tableName}" does not exist`);
          const table = localTables[tableName];
          
          // Filter rows based on WHERE clause
          let filteredRows = [...table.rows];
          if (whereClause) {
            const whereParts = whereClause.match(/(\w+)\s*(=|>|<)\s*(.+)/);
            if (whereParts) {
              const col = whereParts[1].toLowerCase();
              const op = whereParts[2];
              let val = whereParts[3].trim();
              if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                val = val.slice(1, -1);
              } else {
                val = isNaN(val) ? val : Number(val);
              }
              
              filteredRows = filteredRows.filter(row => {
                const rowVal = row[col];
                if (op === '=') return String(rowVal) === String(val);
                if (op === '>') return Number(rowVal) > Number(val);
                if (op === '<') return Number(rowVal) < Number(val);
                return true;
              });
            }
          }
          
          // Select columns
          let selectedColumns = [];
          if (colsSelector === '*') {
            selectedColumns = table.columns;
          } else {
            selectedColumns = colsSelector.split(',').map(c => c.trim().toLowerCase());
          }
          
          outputLogs.push({
            type: 'table',
            headers: selectedColumns,
            rows: filteredRows
          });
        }
        
        // 4. UPDATE
        else if (upper.startsWith('UPDATE')) {
          const updateMatch = statement.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?/i);
          if (!updateMatch) throw new Error("Syntax error in UPDATE");
          
          const tableName = updateMatch[1].toLowerCase();
          const setClause = updateMatch[2];
          const whereClause = updateMatch[3];
          
          if (!localTables[tableName]) throw new Error(`Table "${tableName}" does not exist`);
          const table = localTables[tableName];
          
          // Parse SET
          const setParts = setClause.split('=').map(s => s.trim());
          const setCol = setParts[0].toLowerCase();
          let setVal = setParts[1];
          if ((setVal.startsWith("'") && setVal.endsWith("'")) || (setVal.startsWith('"') && setVal.endsWith('"'))) {
            setVal = setVal.slice(1, -1);
          } else {
            setVal = isNaN(setVal) ? setVal : Number(setVal);
          }
          
          let count = 0;
          table.rows.forEach(row => {
            let matches = true;
            if (whereClause) {
              const whereParts = whereClause.match(/(\w+)\s*(=|>|<)\s*(.+)/);
              if (whereParts) {
                const col = whereParts[1].toLowerCase();
                const op = whereParts[2];
                let val = whereParts[3].trim();
                if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                  val = val.slice(1, -1);
                } else {
                  val = isNaN(val) ? val : Number(val);
                }
                
                const rowVal = row[col];
                if (op === '=') matches = String(rowVal) === String(val);
                else if (op === '>') matches = Number(rowVal) > Number(val);
                else if (op === '<') matches = Number(rowVal) < Number(val);
              }
            }
            
            if (matches) {
              row[setCol] = setVal;
              count++;
            }
          });
          
          logWriter(`[SQL] ${count} rows updated.`, 'info');
        }
        
        else {
          throw new Error(`Command "${statement.split(/\s+/)[0]}" is not supported in this sandbox`);
        }
      } catch (err) {
        logWriter(`[SQL Error] ${err.message} in statement: "${statement}"`, 'error');
      }
    });
  };

  // Custom client-side Markdown compile converter
  const compileMarkdown = (mdText) => {
    let html = mdText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/```([\s\S]*?)```/g, (_, code) => `<pre style="background: #161b22; padding: 1rem; border-radius: 6px; overflow: auto; font-family: monospace; border: 1px solid #30363d;"><code>${code.trim()}</code></pre>`)
      .replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace;">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/^#\s+(.+)$/gm, '<h1 style="color: #3b82f6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; font-size: 1.8rem;">$1</h1>')
      .replace(/^##\s+(.+)$/gm, '<h2 style="color: #58a6ff; margin-top: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.3rem; font-size: 1.4rem;">$1</h2>')
      .replace(/^###\s+(.+)$/gm, '<h3 style="color: #bc8cff; margin-top: 1.2rem; font-size: 1.1rem;">$1</h3>')
      .replace(/^\-\s+(.+)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.35rem;">$1</li>')
      .replace(/\n\n([^\n<]+)/g, '<p style="color: #8b949e; line-height: 1.6; margin: 1rem 0;">$1</p>');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            background: #0d1117;
            color: #c9d1d9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            padding: 2rem;
            margin: 0;
            line-height: 1.6;
          }
          h1, h2, h3 { font-weight: 700; margin-bottom: 1rem; }
          strong { color: #ffffff; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
  };

  const runCode = () => {
    setIsRunning(true);
    setRunStats(null);
    const start = performance.now();

    const outputLogs = [];
    const logWriter = (text, type = 'output') => {
      outputLogs.push({ type, text });
    };

    logWriter(`[COMPILE] Compiling workspace file "${activeFile}"...`, 'info');

    // Run execution context
    setTimeout(() => {
      if (activeFile.endsWith('.py')) {
        logWriter('[RUN] Executing script via Python Emulator...', 'info');
        executePython(files[activeFile], logWriter);
        setConsoleLogs(outputLogs);
        setActiveTab('console');
      } else if (activeFile.endsWith('.sql')) {
        logWriter('[RUN] Connecting mock DB. Executing SQL queries...', 'info');
        executeSQL(files[activeFile], logWriter, outputLogs);
        setConsoleLogs(outputLogs);
        setActiveTab('console');
      } else if (activeFile.endsWith('.md')) {
        logWriter('[RUN] Compiling markdown preview page...', 'info');
        const parsedHtml = compileMarkdown(files[activeFile]);
        setPreviewSrcDoc(parsedHtml);
        setConsoleLogs(outputLogs);
        setActiveTab('preview');
        logWriter('[INFO] Markdown live page generated.', 'info');
      } else if (activeFile.endsWith('.js')) {
        logWriter('[RUN] Evaluating JavaScript sandbox...', 'info');
        const customConsole = {
          log: (...args) => {
            logWriter(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          },
          error: (...args) => {
            logWriter(`[JavaScript Error] ${args.join(' ')}`, 'error');
          },
          warn: (...args) => {
            logWriter(`[Warning] ${args.join(' ')}`, 'warning');
          },
          table: (obj) => {
            logWriter(JSON.stringify(obj, null, 2));
          }
        };

        try {
          const runJS = new Function('console', files[activeFile]);
          runJS(customConsole);
        } catch (err) {
          customConsole.error(err.message);
        }
        setConsoleLogs(outputLogs);
        setActiveTab('console');
      } else if (activeFile.endsWith('.html') || activeFile === 'style.css') {
        logWriter('[RUN] Bundling HTML, CSS, and JS. Starting Preview Server...', 'info');
        
        let htmlContent = files['index.html'] || '<h1>Preview File</h1>';
        const cssContent = files['style.css'] || '';
        const jsContent = files['main.js'] || '';

        // Inject style and script
        htmlContent = htmlContent.replace(/<link[^>]*href="style\.css"[^>]*>/i, `<style>${cssContent}</style>`);
        
        // Intercept standard console in Preview iframe and forward to compiler terminal
        const consoleInterceptor = `
          <script>
            (function() {
              const _log = console.log;
              const _error = console.error;
              const _warn = console.warn;
              
              console.log = function(...args) {
                _log.apply(console, args);
                window.parent.postMessage({ type: 'preview_log', text: args.join(' '), logType: 'output' }, '*');
              };
              console.error = function(...args) {
                _error.apply(console, args);
                window.parent.postMessage({ type: 'preview_log', text: args.join(' '), logType: 'error' }, '*');
              };
              console.warn = function(...args) {
                _warn.apply(console, args);
                window.parent.postMessage({ type: 'preview_log', text: args.join(' '), logType: 'warning' }, '*');
              };
            })();
          </script>
        `;

        htmlContent = htmlContent.replace('<head>', `<head>${consoleInterceptor}`);

        // Inject main JS script
        if (htmlContent.includes('<script src="main.js"></script>')) {
          htmlContent = htmlContent.replace('<script src="main.js"></script>', `<script>${jsContent}</script>`);
        } else {
          htmlContent += `<script>${jsContent}</script>`;
        }

        setPreviewSrcDoc(htmlContent);
        setConsoleLogs(outputLogs);
        setActiveTab('preview');
        logWriter('[INFO] HTML Live Preview active on port 8080.', 'info');
      } else {
        logWriter(`[INFO] Displaying raw contents of text file "${activeFile}".`, 'info');
        logWriter(files[activeFile]);
        setConsoleLogs(outputLogs);
        setActiveTab('console');
      }

      const end = performance.now();
      setRunStats(Math.round(end - start));
      setIsRunning(false);
    }, 600);
  };

  // Handle postMessage console logs from Iframe Preview sandbox
  useEffect(() => {
    const handleIframeLogs = (e) => {
      if (e.data?.type === 'preview_log') {
        setConsoleLogs(prev => [
          ...prev,
          { type: e.data.logType || 'output', text: `[PREVIEW] ${e.data.text}` }
        ]);
      }
    };
    window.addEventListener('message', handleIframeLogs);
    return () => window.removeEventListener('message', handleIframeLogs);
  }, []);

  const getFileIcon = (filename) => {
    if (filename.endsWith('.py')) return <FileCode size={16} className="file-py-icon" />;
    if (filename.endsWith('.js')) return <FileCode2 size={16} className="file-js-icon" />;
    if (filename.endsWith('.html')) return <FileCode2 size={16} className="file-html-icon" />;
    if (filename.endsWith('.css')) return <FileCode2 size={16} className="file-css-icon" />;
    if (filename.endsWith('.sql')) return <Database size={16} className="file-sql-icon" />;
    if (filename.endsWith('.md')) return <FileText size={16} className="file-md-icon" />;
    return <FileText size={16} className="file-txt-icon" />;
  };

  const lineCount = files[activeFile]?.split('\n').length || 1;
  const linesArr = Array.from({ length: lineCount }, (_, idx) => idx + 1);

  return (
    <div className="compiler-page container">
      {/* Title */}
      <div className="designer-header">
        <h1 className="text-gradient">{t('compiler.title')}</h1>
        <p>{t('compiler.subtitle')}</p>
      </div>

      {/* Editor Main Grid */}
      <div className="compiler-grid" data-testid="compiler-workspace">
        
        {/* Left Sidebar - File Explorer */}
        <div className="explorer-pane">
          <div className="explorer-header">
            <span>{t('compiler.fileExplorer')}</span>
            <button 
              type="button" 
              className="add-file-btn"
              onClick={() => setShowNewFileInput(!showNewFileInput)}
              title={t('compiler.newFile')}
            >
              <Plus size={16} />
            </button>
          </div>

          {showNewFileInput && (
            <form onSubmit={addFile} className="new-file-form">
              <input 
                type="text" 
                className="new-file-input"
                placeholder="filename.js..."
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ display: 'none' }} />
              <button 
                type="button"
                className="new-file-close"
                onClick={() => setShowNewFileInput(false)}
              >
                <X size={14} />
              </button>
            </form>
          )}

          <div className="explorer-files-list">
            {Object.keys(files).map((filename) => {
              const isActive = activeFile === filename;
              const isDefault = ['script.py', 'main.js', 'index.html', 'style.css', 'README.md'].includes(filename);
              return (
                <div 
                  key={filename}
                  className={`explorer-file-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(filename)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTabClick(filename);
                  }}
                >
                  <div className="explorer-file-label">
                    {getFileIcon(filename)}
                    <span>{filename}</span>
                  </div>
                  {!isDefault && (
                    <button 
                      type="button"
                      className="delete-file-btn"
                      onClick={(e) => deleteFile(filename, e)}
                      title={t('compiler.deleteFile')}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="explorer-footer">
            <button 
              type="button"
              className="workspace-reset-btn"
              onClick={resetWorkspace}
            >
              <RotateCcw size={14} /> {t('compiler.reset')}
            </button>
          </div>
        </div>

        {/* Center Panel - Code Editor */}
        <div className="editor-pane">
          {/* File Tabs */}
          <div className="editor-tabs-bar">
            {openFiles.map((filename) => {
              const isActive = activeFile === filename;
              return (
                <div 
                  key={filename}
                  className={`editor-tab-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFile(filename)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setActiveFile(filename);
                  }}
                >
                  {getFileIcon(filename)}
                  <span>{filename}</span>
                  <button 
                    type="button"
                    className="tab-close-btn"
                    onClick={(e) => closeTab(filename, e)}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="editor-actions-row">
            <span className="active-file-indicator">
              editing: <strong style={{ color: 'var(--accent-primary)' }}>{activeFile}</strong>
            </span>
            <div className="run-controls">
              <button 
                type="button"
                className={`run-btn ${isRunning ? 'running' : ''}`}
                onClick={runCode}
                disabled={isRunning}
              >
                <Play size={14} fill="currentColor" /> 
                <span>{isRunning ? t('compiler.stop') : t('compiler.run')}</span>
              </button>
            </div>
          </div>

          {/* Code text block */}
          <div className="editor-body">
            <div className="line-numbers-col">
              {linesArr.map(n => (
                <div key={n} className="line-number">{n}</div>
              ))}
            </div>
            <textarea 
              ref={editorRef}
              className="editor-textarea"
              value={files[activeFile] || ''}
              onChange={(e) => updateFileContent(activeFile, e.target.value)}
              spellCheck="false"
              data-testid="compiler-textarea"
            />
          </div>
        </div>

        {/* Right Panel - Console Terminal & Web Preview */}
        <div className="output-pane">
          {/* Panel Tabs */}
          <div className="output-tabs-header">
            <button 
              type="button"
              className={`output-tab-btn ${activeTab === 'console' ? 'active' : ''}`}
              onClick={() => setActiveTab('console')}
            >
              <Terminal size={14} />
              <span>{t('compiler.consoleTab')}</span>
            </button>
            <button 
              type="button"
              className={`output-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <Eye size={14} />
              <span>{t('compiler.previewTab')}</span>
            </button>
          </div>

          {/* Panel Body */}
          <div className="output-body">
            {activeTab === 'console' ? (
              <div className="compiler-console-view">
                <div className="console-header-actions">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {runStats !== null && t('compiler.stats', { time: runStats })}
                  </span>
                  <button 
                    type="button" 
                    className="console-clear-btn"
                    onClick={() => setConsoleLogs([])}
                  >
                    {t('compiler.clear')}
                  </button>
                </div>
                <div className="console-logs-list">
                  {consoleLogs.length === 0 ? (
                    <div className="console-empty-state">
                      <span>{t('compiler.emptyConsole')}</span>
                    </div>
                  ) : (
                    consoleLogs.map((log, idx) => {
                      if (log.type === 'table') {
                        return (
                          <div key={idx} className="console-log-table-wrapper" style={{ overflowX: 'auto', margin: '0.5rem 0' }}>
                            <table className="console-log-table">
                              <thead>
                                <tr>
                                  {log.headers.map((h, i) => (
                                    <th key={i}>{h.toUpperCase()}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {log.rows.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    {log.headers.map((h, cIdx) => (
                                      <td key={cIdx}>{row[h] !== null ? String(row[h]) : 'NULL'}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className={`console-log-row ${log.type}`}>
                          {log.text}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="compiler-preview-view">
                {previewSrcDoc ? (
                  <div className="iframe-container">
                    <div className="mock-browser-bar">
                      <div className="mock-dots">
                        <span className="dot dot-red"></span>
                        <span className="dot dot-yellow"></span>
                        <span className="dot dot-green"></span>
                      </div>
                      <div className="mock-address-bar">
                        <span>http://localhost:8080/index.html</span>
                      </div>
                    </div>
                    <iframe 
                      title="HTML Preview"
                      srcDoc={previewSrcDoc}
                      sandbox="allow-scripts allow-same-origin"
                      className="preview-iframe"
                    />
                  </div>
                ) : (
                  <div className="preview-empty-state">
                    <LayoutGrid size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {t('compiler.previewError')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Compiler;
