import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Plus, Trash2, Globe, AlertTriangle, Play, CheckCircle2, RefreshCw } from 'lucide-react';
import './ApiClient.css';

const PRESETS = [
  { name: 'Get Posts (Real)', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts' },
  { name: 'Get User profile (Real)', method: 'GET', url: 'https://jsonplaceholder.typicode.com/users/1' },
  { name: 'Delay Simulator (Real)', method: 'GET', url: 'https://httpbin.org/delay/1' },
  { name: 'Anim\'s GitHub (Real)', method: 'GET', url: 'https://api.github.com/users/B1nit' },
  { name: 'Mock Users (Local)', method: 'GET', url: 'mock://users' },
  { name: 'Mock Server Error (Local)', method: 'POST', url: 'mock://error/500' }
];

const ApiClient = () => {
  const { t } = useTranslation();
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'Accept', value: 'application/json', enabled: true }
  ]);
  const [reqBody, setReqBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [activeReqTab, setActiveReqTab] = useState('headers'); // 'headers' | 'body'
  const [activeResTab, setActiveResTab] = useState('body'); // 'body' | 'headers'
  
  // Response States
  const [resStatus, setResStatus] = useState(null);
  const [resTime, setResTime] = useState(null);
  const [resSize, setResSize] = useState(null);
  const [resBody, setResBody] = useState('');
  const [resHeaders, setResHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isJsonValid, setIsJsonValid] = useState(true);

  // CORS dialog warning state
  const [showCorsModal, setShowCorsModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');

  // Validate JSON body on change
  useEffect(() => {
    if (!reqBody.trim()) {
      setIsJsonValid(true);
      return;
    }
    try {
      JSON.parse(reqBody);
      setIsJsonValid(true);
    } catch {
      setIsJsonValid(false);
    }
  }, [reqBody]);

  const handleAddHeader = () => {
    setHeaders(prev => [...prev, { key: '', value: '', enabled: true }]);
  };

  const handleHeaderChange = (index, field, val) => {
    setHeaders(prev => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

  const handleHeaderToggle = (index) => {
    setHeaders(prev => {
      const updated = [...prev];
      updated[index].enabled = !updated[index].enabled;
      return updated;
    });
  };

  const handleRemoveHeader = (index) => {
    setHeaders(prev => prev.filter((_, idx) => idx !== index));
  };

  const handlePresetClick = (preset) => {
    setMethod(preset.method);
    setUrl(preset.url);
  };

  const clearAll = () => {
    setResStatus(null);
    setResTime(null);
    setResSize(null);
    setResBody('');
    setResHeaders([]);
    setErrorText('');
    setShowCorsModal(false);
  };

  // Mock server emulator logic
  const handleLocalMock = async (targetUrl, targetMethod) => {
    setIsLoading(true);
    clearAll();
    
    // Simulate latency
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 600));

    let mockData = {};
    let status = 200;
    let statusText = 'OK';

    const headersList = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'X-Mock-Engine', value: 'AnimOS-v1.0.0-mock-server' },
      { key: 'Access-Control-Allow-Origin', value: '*' }
    ];

    if (targetUrl.includes('mock://users')) {
      mockData = [
        { id: 1, name: 'Anim Akash', role: 'Consultant & Full-Stack Engineer', company: 'Avanade' },
        { id: 2, name: 'Taro Tanaka', role: 'Solutions Architect', company: 'Partner Corp' },
        { id: 3, name: 'John Doe', role: 'Recruiting Director', company: 'Global Tech' }
      ];
    } else if (targetUrl.includes('mock://error/500')) {
      status = 500;
      statusText = 'Internal Server Error';
      mockData = { error: 'Internal Server Error', message: 'Simulated 500 crash in local mock sandbox.' };
    } else if (targetUrl.includes('mock://posts') || targetUrl.includes('posts')) {
      mockData = {
        id: 101,
        title: 'REST client testing',
        body: 'Local mock simulation data parsed successfully.',
        userId: 1
      };
      if (targetMethod === 'GET') {
        mockData = [
          { id: 1, title: 'Introduction to AI Agents', body: 'Exploring semantic kernel orchestrations.' },
          { id: 2, title: 'Red Hat certified setups', body: 'Perfect score playbooks in action.' }
        ];
      }
    } else {
      // General fallbacks
      mockData = {
        status: 'Success',
        message: 'Mock simulation executed successfully.',
        requestedUrl: targetUrl,
        requestedMethod: targetMethod,
        timestamp: new Date().toISOString()
      };
    }

    const end = performance.now();
    const duration = Math.round(end - start);
    const bodyStr = JSON.stringify(mockData, null, 2);

    setResStatus({ code: status, text: statusText });
    setResTime(duration);
    setResSize((bodyStr.length / 1024).toFixed(2));
    setResBody(bodyStr);
    setResHeaders(headersList);
    setIsLoading(false);
  };

  const handleSendRequest = async () => {
    if (!url.trim()) return;

    if (url.startsWith('mock://')) {
      handleLocalMock(url, method);
      return;
    }

    setIsLoading(true);
    setErrorText('');
    setResStatus(null);

    const start = performance.now();

    // Assemble headers
    const requestHeaders = {};
    headers.forEach(h => {
      if (h.enabled && h.key.trim()) {
        requestHeaders[h.key] = h.value;
      }
    });

    const fetchOptions = {
      method: method,
      headers: requestHeaders
    };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && reqBody) {
      fetchOptions.body = reqBody;
    }

    try {
      const response = await fetch(url, fetchOptions);
      const end = performance.now();

      const duration = Math.round(end - start);
      const dataText = await response.text();
      let parsedJson = '';
      try {
        parsedJson = JSON.stringify(JSON.parse(dataText), null, 2);
      } catch {
        parsedJson = dataText;
      }

      // Format response headers
      const resHeadersArray = [];
      response.headers.forEach((value, key) => {
        resHeadersArray.push({ key, value });
      });

      setResStatus({ code: response.status, text: response.statusText });
      setResTime(duration);
      setResSize((dataText.length / 1024).toFixed(2));
      setResBody(parsedJson);
      setResHeaders(resHeadersArray);
    } catch (err) {
      console.warn("API request failed:", err);
      // Typically, a TypeError: Failed to fetch in the browser indicates CORS blocking or DNS issues
      setPendingUrl(url);
      setShowCorsModal(true);
      setErrorText(t('apiClient.error') + `: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSimulatedCorsMock = () => {
    setShowCorsModal(false);
    handleLocalMock(pendingUrl, method);
  };

  const isSuccessStatus = resStatus && resStatus.code >= 200 && resStatus.code < 300;
  const isErrorStatus = resStatus && resStatus.code >= 400;

  return (
    <div className="api-client-page">
      {/* Title */}
      <div className="designer-header">
        <h1 className="text-gradient">{t('apiClient.title')}</h1>
        <p>{t('apiClient.subtitle')}</p>
      </div>

      {/* Main UI layout */}
      <div className="api-client-grid" data-testid="api-client-workspace">
        
        {/* Preset Endpoints Bar */}
        <div className="api-presets-row">
          <span className="presets-label">{t('apiClient.presets')}:</span>
          <div className="presets-list">
            {PRESETS.map((preset, idx) => (
              <button 
                key={idx}
                type="button"
                className="preset-badge-btn"
                onClick={() => handlePresetClick(preset)}
              >
                <span className={`method-tag ${preset.method.toLowerCase()}`}>{preset.method}</span>
                <span className="preset-name">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar Section */}
        <div className="api-request-bar">
          <select 
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`method-select ${method.toLowerCase()}`}
            data-testid="api-method-select"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>

          <input 
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/resource..."
            className="api-url-input"
            data-testid="api-url-input"
          />

          <button 
            type="button"
            className={`api-send-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleSendRequest}
            disabled={isLoading}
            data-testid="api-send-btn"
          >
            {isLoading ? <RefreshCw className="spinner-icon" size={16} /> : <Send size={16} />}
            <span>{isLoading ? t('apiClient.loading') : t('apiClient.send')}</span>
          </button>
        </div>

        {/* Workspace Columns */}
        <div className="api-workspace-panes">
          
          {/* Left Column: Request Headers and Body */}
          <div className="request-pane">
            <div className="pane-tabs-header">
              <button 
                type="button"
                className={`pane-tab-btn ${activeReqTab === 'headers' ? 'active' : ''}`}
                onClick={() => setActiveReqTab('headers')}
              >
                {t('apiClient.headers')} ({headers.length})
              </button>
              <button 
                type="button"
                className={`pane-tab-btn ${activeReqTab === 'body' ? 'active' : ''}`}
                onClick={() => setActiveReqTab('body')}
                disabled={['GET'].includes(method)}
                style={{ opacity: ['GET'].includes(method) ? 0.4 : 1 }}
              >
                {t('apiClient.body')}
              </button>
            </div>

            <div className="pane-tab-body">
              {activeReqTab === 'headers' ? (
                <div className="headers-editor">
                  <div className="headers-grid-labels">
                    <span>{t('apiClient.key')}</span>
                    <span>{t('apiClient.value')}</span>
                    <span></span>
                  </div>
                  <div className="headers-rows-list">
                    {headers.map((h, idx) => (
                      <div key={idx} className="header-row-item">
                        <input 
                          type="checkbox"
                          checked={h.enabled}
                          onChange={() => handleHeaderToggle(idx)}
                          className="header-toggle-check"
                        />
                        <input 
                          type="text"
                          placeholder="Key..."
                          value={h.key}
                          onChange={(e) => handleHeaderChange(idx, 'key', e.target.value)}
                          className="header-key-input"
                        />
                        <input 
                          type="text"
                          placeholder="Value..."
                          value={h.value}
                          onChange={(e) => handleHeaderChange(idx, 'value', e.target.value)}
                          className="header-val-input"
                        />
                        <button 
                          type="button"
                          className="header-remove-btn"
                          onClick={() => handleRemoveHeader(idx)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button"
                    className="add-header-btn"
                    onClick={handleAddHeader}
                  >
                    <Plus size={14} />
                    <span>{t('apiClient.addHeader')}</span>
                  </button>
                </div>
              ) : (
                <div className="body-editor">
                  {!isJsonValid && (
                    <div className="json-validation-warn">
                      <AlertTriangle size={14} />
                      <span>Malformed JSON. Please correct body parameters.</span>
                    </div>
                  )}
                  <textarea 
                    value={reqBody}
                    onChange={(e) => setReqBody(e.target.value)}
                    className={`body-textarea ${!isJsonValid ? 'invalid' : ''}`}
                    placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
                    spellCheck="false"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Response Details */}
          <div className="response-pane">
            <div className="pane-tabs-header justify-between">
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button"
                  className={`pane-tab-btn ${activeResTab === 'body' ? 'active' : ''}`}
                  onClick={() => setActiveResTab('body')}
                >
                  {t('apiClient.response')}
                </button>
                <button 
                  type="button"
                  className={`pane-tab-btn ${activeResTab === 'headers' ? 'active' : ''}`}
                  onClick={() => setActiveResTab('headers')}
                >
                  {t('apiClient.headers')} ({resHeaders.length})
                </button>
              </div>
              {resStatus && (
                <button type="button" className="response-clear-btn" onClick={clearAll}>
                  {t('apiClient.clear')}
                </button>
              )}
            </div>

            <div className="pane-tab-body bg-dark-console">
              {resStatus ? (
                <div className="response-details-view">
                  {/* Response Meta Header */}
                  <div className="response-meta-bar">
                    <div className="meta-stat">
                      <span className="meta-label">{t('apiClient.status')}:</span>
                      <span className={`status-badge ${isSuccessStatus ? 'success' : isErrorStatus ? 'error' : 'warning'}`}>
                        {resStatus.code} {resStatus.text}
                      </span>
                    </div>
                    <div className="meta-stat">
                      <span className="meta-label">{t('apiClient.time')}:</span>
                      <span className="stat-value">{resTime} ms</span>
                    </div>
                    <div className="meta-stat">
                      <span className="meta-label">{t('apiClient.size')}:</span>
                      <span className="stat-value">{resSize} KB</span>
                    </div>
                  </div>

                  {/* Response content */}
                  <div className="response-content-block">
                    {activeResTab === 'body' ? (
                      <pre className="response-body-pre" data-testid="response-body-output">
                        <code>{resBody}</code>
                      </pre>
                    ) : (
                      <div className="response-headers-list">
                        {resHeaders.map((rh, idx) => (
                          <div key={idx} className="resp-header-item">
                            <span className="resp-header-key">{rh.key}:</span>
                            <span className="resp-header-val">{rh.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="response-empty-state">
                  {errorText ? (
                    <div className="error-alert-box">
                      <AlertTriangle className="error-icon" size={32} />
                      <p className="error-message">{errorText}</p>
                    </div>
                  ) : (
                    <>
                      <Globe size={40} className="globe-icon" />
                      <p>{t('apiClient.emptyResponse')}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* CORS Dialog/Modal Fallback */}
      {showCorsModal && (
        <div className="cors-modal-overlay">
          <div className="cors-modal-content">
            <div className="cors-header">
              <AlertTriangle className="warn-icon" size={24} />
              <h2>{t('apiClient.corsWarning')}</h2>
            </div>
            <p>{t('apiClient.corsDesc')}</p>
            <div className="cors-actions">
              <button 
                type="button" 
                className="cors-btn cancel"
                onClick={() => setShowCorsModal(false)}
              >
                {t('apiClient.cancel')}
              </button>
              <button 
                type="button" 
                className="cors-btn simulate"
                onClick={executeSimulatedCorsMock}
              >
                <Play size={14} fill="currentColor" />
                <span>{t('apiClient.simulateResp')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiClient;
