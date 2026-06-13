import { useState } from 'react';
import { Copy, Monitor, Keyboard, Laptop, ShieldCheck, Terminal as TermIcon } from 'lucide-react';
import './WorkspaceSetup.css';

const CONFIGS_DATA = {
  monitor: {
    title: 'Monitor & Workspace Environment',
    icon: <Monitor size={18} />,
    description: 'Bilingual coding workspace designed for focus and visual comfort under low light.',
    specList: [
      { key: 'Primary Display', value: '34" UltraWide QHD IPS Curved Display' },
      { key: 'Resolution', value: '3440 x 1440 @ 144Hz Refresh Rate' },
      { key: 'Color Accuracy', value: 'sRGB 99% factory calibrated' },
      { key: 'Mount', value: 'Ergonomic Gas Spring Arm Monitor Mount' },
      { key: 'Aesthetics', value: 'Neutral warm backlighting (bias lighting)' }
    ],
    codeTitle: 'Workspace Config (.yaml)',
    code: `workspace:
  theme: dracula-extreme
  bias_lighting:
    status: enabled
    color: "#ffb86c"
    brightness: 45%
  screentime_alert:
    enabled: true
    interval_minutes: 50
    break_seconds: 600`
  },
  keyboard: {
    title: 'Mechanical Keyboard Specifications',
    icon: <Keyboard size={18} />,
    description: 'Fully customized ergonomic keyboard built for tactile typing speed and quiet acoustic output.',
    specList: [
      { key: 'Form Factor', value: '75% Layout (Compact with dedicated function row)' },
      { key: 'Keycaps', value: 'PBT Double-Shot Dye-Sub (Dracula theme colors)' },
      { key: 'Switches', value: 'Gateron Silent Black Linear Switches (Lubed with Krytox)' },
      { key: 'Stabilizers', value: 'Durock V2 Screw-in stabilizers (tuned & modded)' },
      { key: 'Acoustics', value: 'Poron foam dampeners and tape-modded case' }
    ],
    codeTitle: 'QMK Keymap Configuration (.json)',
    code: `{
  "keyboard": "custom_75",
  "keymap": "anim_jp_en",
  "layout": "LAYOUT_ansi_75",
  "layers": [
    ["ESC", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "MUTE"],
    ["GRAVE", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "MINUS", "EQUAL", "BACKSPACE"],
    ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "LBRACKET", "RBRACKET", "BACKSLASH"],
    ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", "SEMICOLON", "QUOTE", "ENTER"],
    ["LSHIFT", "Z", "X", "C", "V", "B", "N", "M", "COMMA", "DOT", "SLASH", "RSHIFT", "UP"],
    ["LCTRL", "LGUI", "LALT", "SPACE_EN", "SPACE_JA", "RALT", "RCTRL", "LEFT", "DOWN", "RIGHT"]
  ]
}`
  },
  pc: {
    title: 'Workstation System Hardware specs',
    icon: <Laptop size={18} />,
    description: 'High performance host running automated data processing scripts and local AI execution blocks.',
    specList: [
      { key: 'Operating System', value: 'Rocky Linux / macOS dual setup' },
      { key: 'Processor', value: 'AMD Ryzen 9 5900X (12 Cores / 24 Threads @ 4.8GHz)' },
      { key: 'Memory', value: '64GB DDR4 Corsair Vengeance @ 3600MHz' },
      { key: 'Graphics Card', value: 'NVIDIA RTX 4070 Ti (12GB VRAM for local LLM runs)' },
      { key: 'Storage', value: '2TB Samsung 980 Pro NVMe PCIe 4.0 SSD' }
    ],
    codeTitle: 'System Initialization Ansible Script (.yaml)',
    code: `- name: Configure Local Developer Workspace
  hosts: localhost
  connection: local
  tasks:
    - name: Ensure standard dev tools are present
      package:
        name:
          - neovim
          - git
          - tmux
          - zsh
          - docker
        state: latest
    - name: Configure Zsh as default user shell
      user:
        name: anim
        shell: /bin/zsh`
  },
  terminal: {
    title: 'Zsh Shell & Neovim Configuration',
    icon: <TermIcon size={18} />,
    description: 'Optimized environment configurations for speed, multi-pane window sessions, and file search indicators.',
    specList: [
      { key: 'Shell', value: 'Zsh with custom lightweight theme prompts' },
      { key: 'Multiplexer', value: 'Tmux with custom key bindings (Dracula styles)' },
      { key: 'Editor', value: 'Neovim with lazy.nvim and LSP integrations' },
      { key: 'Search tool', value: 'Ripgrep and FZF fuzzy search helpers' },
      { key: 'Alias', value: 'Optimized docker-compose and git commands shortcuts' }
    ],
    codeTitle: 'Terminal Config Files (.zshrc)',
    code: `# ZSH Theme configurations
export PROMPT="%F{99}%n%f@%F{135}%m%f %F{140}%c%f %F{34}➔%f "

# Useful developer aliases
alias g="git"
alias ga="git add"
alias gc="git commit -m"
alias gp="git push"
alias dco="docker-compose"
alias n="nvim"

# Launch TMUX automatically if running in interactive shell
if [ -z "$TMUX" ] && [ -n "$PS1" ]; then
    exec tmux new-session -A -s main
fi`
  }
};

const WorkspaceSetup = () => {
  const [selectedKey, setSelectedKey] = useState('terminal');
  const [copied, setCopied] = useState(false);

  const config = CONFIGS_DATA[selectedKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(config.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="workspace-setup-container">
      <div className="workspace-header">
        <CompassIcon className="workspace-icon" size={24} />
        <div>
          <h3 className="workspace-title">Workspace Setup & Dotfiles</h3>
          <p className="workspace-subtitle">Interactive blueprint of my workstation. Select any component to view details & config files.</p>
        </div>
      </div>

      <div className="workspace-split">
        {/* Left Side: Interactive SVG Blueprint */}
        <div className="setup-svg-panel glass-card">
          <svg
            viewBox="0 0 200 160"
            className="setup-vector-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ambient desk backlights */}
            <circle cx="100" cy="55" r="40" className={`ambient-glow ${selectedKey === 'monitor' ? 'active' : ''}`} fill="rgba(99, 102, 241, 0.05)" />
            <circle cx="170" cy="80" r="25" className={`ambient-glow ${selectedKey === 'pc' ? 'active' : ''}`} fill="rgba(139, 92, 246, 0.05)" />

            {/* Desk Surface */}
            <polygon points="10,135 190,135 200,160 0,160" fill="#090a0c" stroke="var(--border-medium)" strokeWidth="0.5" />
            <line x1="10" y1="135" x2="190" y2="135" stroke="var(--border-strong)" strokeWidth="1" />

            {/* Widescreen Monitor */}
            <g className={`svg-element ${selectedKey === 'monitor' ? 'active' : ''}`} onClick={() => setSelectedKey('monitor')}>
              {/* Stand */}
              <rect x="94" y="90" width="12" height="25" fill="#1e1f29" stroke="currentColor" strokeWidth="0.5" />
              <polygon points="85,115 115,115 120,123 80,123" fill="#111216" stroke="currentColor" strokeWidth="0.5" />
              {/* Screen Bezel */}
              <rect x="35" y="30" width="130" height="60" rx="3" fill="#0b0c10" stroke="currentColor" strokeWidth="0.8" />
              {/* Active display preview screen */}
              <rect x="38" y="33" width="124" height="54" rx="1.5" fill="#12131a" />
              {/* Mock system screen graphics */}
              <rect x="44" y="39" width="35" height="42" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" rx="1" />
              <line x1="48" y1="44" x2="72" y2="44" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" />
              <line x1="48" y1="50" x2="68" y2="50" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
              <line x1="48" y1="54" x2="60" y2="54" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />

              <circle cx="100" cy="60" r="10" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.5" strokeDasharray="1,1" />
            </g>

            {/* PC Case Tower */}
            <g className={`svg-element ${selectedKey === 'pc' ? 'active' : ''}`} onClick={() => setSelectedKey('pc')}>
              {/* Case outline */}
              <rect x="156" y="50" width="28" height="65" rx="2" fill="#0c0d12" stroke="currentColor" strokeWidth="0.5" />
              {/* Side glass panel outline */}
              <rect x="158" y="54" width="24" height="57" rx="1" fill="#101116" stroke="currentColor" strokeWidth="0.2" />
              {/* Glowing inner parts preview */}
              <circle cx="170" cy="68" r="4.5" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.8" className="fan-spin" />
              <circle cx="170" cy="85" r="4.5" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.8" className="fan-spin" />
              <line x1="162" y1="102" x2="178" y2="102" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
            </g>

            {/* Keyboard */}
            <g className={`svg-element ${selectedKey === 'keyboard' ? 'active' : ''}`} onClick={() => setSelectedKey('keyboard')}>
              {/* Keyboard base body */}
              <polygon points="75,130 125,130 128,141 72,141" fill="#15161d" stroke="currentColor" strokeWidth="0.5" />
              {/* Key rows details */}
              <line x1="77" y1="133" x2="123" y2="133" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5, 0.8" />
              <line x1="76" y1="136" x2="124" y2="136" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5, 0.8" />
              <line x1="75" y1="139" x2="125" y2="139" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2.5, 1" />
            </g>

            {/* Mouse Pad and Terminal screen inside Monitor */}
            <g className={`svg-element ${selectedKey === 'terminal' ? 'active' : ''}`} onClick={() => setSelectedKey('terminal')}>
              {/* Terminal panel layout on right screen side */}
              <rect x="84" y="39" width="72" height="42" fill="#040507" stroke="currentColor" strokeWidth="0.5" rx="1" />
              <line x1="88" y1="44" x2="114" y2="44" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />
              <line x1="88" y1="50" x2="134" y2="50" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
              <line x1="88" y1="54" x2="124" y2="54" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
              <line x1="88" y1="58" x2="142" y2="58" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
              <line x1="88" y1="62" x2="110" y2="62" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.5" />
              <line x1="88" y1="66" x2="130" y2="66" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
            </g>
          </svg>
        </div>

        {/* Right Side: Dotfiles & Config Panel */}
        <div className="setup-details-panel glass-card">
          <div className="details-header-row">
            <div className="details-title-group">
              {config.icon}
              <h4 className="details-header-title">{config.title}</h4>
            </div>
            <button
              onClick={handleCopy}
              className={`copy-config-btn ${copied ? 'copied' : ''}`}
              title="Copy Config to Clipboard"
            >
              {copied ? <ShieldCheck size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="details-header-desc">{config.description}</p>

          <div className="details-spec-list">
            {config.specList.map((spec, sIdx) => (
              <div key={sIdx} className="spec-row">
                <span className="spec-key">{spec.key}</span>
                <span className="spec-val">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Config code codeblock display */}
          <div className="details-codeblock-wrapper">
            <div className="codeblock-header-label">{config.codeTitle}</div>
            <pre className="details-code-pre">
              <code>{config.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple compass icon replacement to align dependencies nicely
const CompassIcon = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
  </svg>
);

export default WorkspaceSetup;
