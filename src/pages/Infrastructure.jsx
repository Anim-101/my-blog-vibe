import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Server, 
  Database, 
  HardDrive, 
  Layers, 
  Globe, 
  Play, 
  Square, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Cloud,
  X,
  FileCode2,
  DollarSign
} from 'lucide-react';
import './Infrastructure.css';

const Infrastructure = () => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState('aws'); // 'aws' | 'azure'
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeIacTab, setActiveIacTab] = useState('terraform');
  const [copied, setCopied] = useState(false);
  const nodeIdCounterRef = useRef(0);
  const canvasRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const nodeStartRef = useRef({ x: 0, y: 0 });
  const draggingNodeIdRef = useRef(null);
  const dragDistanceRef = useRef(0);
  const [draggedNodeId, setDraggedNodeId] = useState(null);

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    setNodes([]);
    setSelectedNode(null);
    setIsSimulating(false);
    draggingNodeIdRef.current = null;
    setDraggedNodeId(null);
  };

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
    
    // Prevent default scroll on touch devices during dragging
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

    // Constrain nodes inside the 480px canvas container (subtract node size 110px)
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

  // Define catalog items with their costs and descriptors
  const catalog = {
    aws: [
      { type: 'dns', name: 'Route 53', cost: 0.50, icon: <Globe size={18} />, desc: 'DNS Routing' },
      { type: 'loadbalancer', name: 'ALB', cost: 18.00, icon: <Layers size={18} />, desc: 'Application Load Balancer' },
      { type: 'compute', name: 'EC2 Instance', cost: 12.00, icon: <Server size={18} />, desc: 't3.micro instance' },
      { type: 'database', name: 'RDS Instance', cost: 24.00, icon: <Database size={18} />, desc: 'db.t3.micro database' },
      { type: 'storage', name: 'S3 Bucket', cost: 4.00, icon: <HardDrive size={18} />, desc: 'Object Storage' }
    ],
    azure: [
      { type: 'dns', name: 'Azure DNS', cost: 0.50, icon: <Globe size={18} />, desc: 'Domain Hosting' },
      { type: 'loadbalancer', name: 'Load Balancer', cost: 20.00, icon: <Layers size={18} />, desc: 'L4 Load Balancer' },
      { type: 'compute', name: 'Virtual Machine', cost: 14.00, icon: <Server size={18} />, desc: 'B1s burstable instance' },
      { type: 'database', name: 'Azure SQL', cost: 28.00, icon: <Database size={18} />, desc: 'S0 standard database' },
      { type: 'storage', name: 'Blob Storage', cost: 5.00, icon: <HardDrive size={18} />, desc: 'Hot storage account' }
    ]
  };

  // Helper to add resource to canvas with layout heuristics
  const addResource = (item) => {
    // Generate simple coordinates depending on item type to keep canvas clean
    const xOffsets = {
      dns: 40,
      loadbalancer: 160,
      compute: 280,
      database: 420,
      storage: 420
    };

    const typeNodes = nodes.filter(n => n.type === item.type);
    const count = typeNodes.length;

    let x = xOffsets[item.type] || 200;
    let y = 180;

    // Shift y values to stack items vertically if multiple of same type exist
    if (item.type === 'compute') {
      if (count === 0) y = 180;
      else if (count === 1) {
        // Adjust previous compute node and current compute node
        setNodes(prev => prev.map(n => n.type === 'compute' ? { ...n, y: 100 } : n));
        y = 260;
      } else {
        y = 100 + (count * 80);
      }
    } else if (item.type === 'database') {
      y = 100 + (count * 160);
    } else if (item.type === 'storage') {
      y = 260 + (count * 160);
    } else if (item.type === 'loadbalancer') {
      y = 180 + (count * 80);
    } else if (item.type === 'dns') {
      y = 180 + (count * 80);
    }

    nodeIdCounterRef.current += 1;
    const newNode = {
      id: `${item.type}-${nodeIdCounterRef.current}`,
      type: item.type,
      name: `${item.name} #${count + 1}`,
      cost: item.cost,
      instanceSize: item.type === 'compute' ? (provider === 'aws' ? 't3.micro' : 'Standard_B1s') : 
                    item.type === 'database' ? (provider === 'aws' ? 'db.t3.micro' : 'GP_Gen5_2') : 'default',
      publicIp: item.type === 'compute',
      publicRead: false, // For storage
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

  // Generate connection lines automatically for 3-tier architecture
  const getConnections = () => {
    const list = [];
    const dnsNodes = nodes.filter(n => n.type === 'dns');
    const lbNodes = nodes.filter(n => n.type === 'loadbalancer');
    const computeNodes = nodes.filter(n => n.type === 'compute');
    const dbNodes = nodes.filter(n => n.type === 'database');
    const storageNodes = nodes.filter(n => n.type === 'storage');

    // DNS -> LB
    dnsNodes.forEach(dns => {
      lbNodes.forEach(lb => {
        list.push({ from: dns, to: lb });
      });
    });

    // LB -> Compute
    lbNodes.forEach(lb => {
      computeNodes.forEach(comp => {
        list.push({ from: lb, to: comp });
      });
    });

    // Compute -> DB
    computeNodes.forEach(comp => {
      dbNodes.forEach(db => {
        list.push({ from: comp, to: db });
      });
    });

    // Compute -> Storage
    computeNodes.forEach(comp => {
      storageNodes.forEach(st => {
        list.push({ from: comp, to: st });
      });
    });

    return list;
  };

  // Calculate costs
  const calculateTotals = () => {
    const monthly = nodes.reduce((sum, n) => sum + n.cost, 0);
    const hourly = monthly / 730;
    return {
      monthly: monthly.toFixed(2),
      hourly: hourly.toFixed(4)
    };
  };

  // Run security auditor rules
  const runAudits = () => {
    const warnings = [];
    const compute = nodes.filter(n => n.type === 'compute');
    const database = nodes.filter(n => n.type === 'database');
    const lb = nodes.filter(n => n.type === 'loadbalancer');
    const storage = nodes.filter(n => n.type === 'storage');

    if (compute.length > 0 && database.length === 0) {
      warnings.push({ id: 'noDatabase', type: 'warning', text: t('designer.warnings.noDatabase') });
    }

    if (lb.length > 0 && compute.length === 0) {
      warnings.push({ id: 'noCompute', type: 'warning', text: t('designer.warnings.noCompute') });
    }

    database.forEach(db => {
      if (db.publicIp) {
        warnings.push({ id: `publicDb-${db.id}`, type: 'caution', text: `${db.name}: ${t('designer.warnings.publicDatabase')}` });
      }
    });

    storage.forEach(st => {
      if (st.publicRead) {
        warnings.push({ id: `openStorage-${st.id}`, type: 'caution', text: `${st.name}: ${t('designer.warnings.openS3')}` });
      }
    });

    return warnings;
  };

  // Generate Terraform Config
  const generateTerraform = () => {
    let code = `# Terraform configuration generated by Cloud Designer\n`;
    if (provider === 'aws') {
      code += `provider "aws" {
  region = "us-east-1"
}\n\n`;

      nodes.forEach(n => {
        const resourceId = n.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (n.type === 'dns') {
          code += `resource "aws_route53_zone" "${resourceId}" {
  name = "myportfolio.local"
}\n\n`;
        } else if (n.type === 'loadbalancer') {
          code += `resource "aws_lb" "${resourceId}" {
  name               = "portfolio-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}\n\n`;
        } else if (n.type === 'compute') {
          code += `resource "aws_instance" "${resourceId}" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "${n.instanceSize}"
  associate_public_ip_address = ${n.publicIp}
  tags = {
    Name = "${n.name}"
  }
}\n\n`;
        } else if (n.type === 'database') {
          code += `resource "aws_db_instance" "${resourceId}" {
  allocated_storage    = 20
  engine               = "postgres"
  instance_class       = "${n.instanceSize}"
  db_name              = "portfolio_db"
  username             = "dbadmin"
  password             = "supersecretpw"
  publicly_accessible  = ${n.publicIp}
  skip_final_snapshot  = true
}\n\n`;
        } else if (n.type === 'storage') {
          code += `resource "aws_s3_bucket" "${resourceId}" {
  bucket = "anim-portfolio-storage"
}

resource "aws_s3_bucket_public_access_block" "${resourceId}_acl" {
  bucket = aws_s3_bucket.${resourceId}.id
  block_public_acls       = ${!n.publicRead}
  block_public_policy     = ${!n.publicRead}
  ignore_public_acls      = ${!n.publicRead}
  restrict_public_buckets = ${!n.publicRead}
}\n\n`;
        }
      });
    } else {
      code += `provider "azurerm" {
  features {}
}\n\n`;

      nodes.forEach(n => {
        const resourceId = n.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (n.type === 'dns') {
          code += `resource "azurerm_dns_zone" "${resourceId}" {
  name                = "myportfolio.local"
  resource_group_name = "portfolio-rg"
}\n\n`;
        } else if (n.type === 'loadbalancer') {
          code += `resource "azurerm_lb" "${resourceId}" {
  name                = "portfolio-lb"
  location            = "eastus"
  resource_group_name = "portfolio-rg"
  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = azurerm_public_ip.lb_ip.id
  }
}\n\n`;
        } else if (n.type === 'compute') {
          code += `resource "azurerm_linux_virtual_machine" "${resourceId}" {
  name                = "vm-node"
  resource_group_name = "portfolio-rg"
  location            = "eastus"
  size                = "${n.instanceSize}"
  admin_username      = "adminuser"
  network_interface_ids = [
    azurerm_network_interface.vm_nic.id,
  ]
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}\n\n`;
        } else if (n.type === 'database') {
          code += `resource "azurerm_mssql_database" "${resourceId}" {
  name           = "portfolio-sql"
  server_id      = azurerm_mssql_server.sql_server.id
  sku_name       = "${n.instanceSize}"
  zone_redundant = false
}\n\n`;
        } else if (n.type === 'storage') {
          code += `resource "azurerm_storage_account" "${resourceId}" {
  name                     = "animportfoliostor"
  resource_group_name      = "portfolio-rg"
  location                 = "eastus"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  allow_nested_items_to_be_public = ${n.publicRead}
}\n\n`;
        }
      });
    }
    return code.trim();
  };

  // Generate Ansible Config
  const generateAnsible = () => {
    let yaml = `---
- name: Configure Cloud Architecture Infrastructure
  hosts: localhost
  connection: local
  tasks:\n`;

    nodes.forEach(n => {
      if (n.type === 'dns') {
        yaml += `    - name: Configure DNS Route Zone for ${n.name}
      ${provider === 'aws' ? 'amazon.aws.route53' : 'azure.azcollection.azure_rm_dnszone'}:
        zone: "myportfolio.local"
        state: present\n\n`;
      } else if (n.type === 'loadbalancer') {
        yaml += `    - name: Create Load Balancer endpoint
      ${provider === 'aws' ? 'amazon.aws.elb_application_lb' : 'azure.azcollection.azure_rm_loadbalancer'}:
        name: "portfolio-lb"
        state: present\n\n`;
      } else if (n.type === 'compute') {
        yaml += `    - name: Provision host instance (${n.instanceSize})
      ${provider === 'aws' ? 'amazon.aws.ec2_instance' : 'azure.azcollection.azure_rm_virtualmachine'}:
        name: "${n.name}"
        type: "${n.instanceSize}"
        public_ip: ${n.publicIp}
        state: present\n\n`;
      } else if (n.type === 'database') {
        yaml += `    - name: Setup Database instance (${n.name})
      ${provider === 'aws' ? 'amazon.aws.rds_instance' : 'azure.azcollection.azure_rm_sqlserver'}:
        name: "portfolio-db"
        tier: "${n.instanceSize}"
        publicly_accessible: ${n.publicIp}
        state: present\n\n`;
      } else if (n.type === 'storage') {
        yaml += `    - name: Setup Cloud Storage Buckets
      ${provider === 'aws' ? 'amazon.aws.s3_bucket' : 'azure.azcollection.azure_rm_storageaccount'}:
        name: "anim-portfolio-storage"
        public_access: ${n.publicRead}
        state: present\n\n`;
      }
    });

    return yaml.trim();
  };

  const handleCopyCode = () => {
    const code = activeIacTab === 'terraform' ? generateTerraform() : generateAnsible();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const code = activeIacTab === 'terraform' ? generateTerraform() : generateAnsible();
    const filename = activeIacTab === 'terraform' ? 'main.tf' : 'deploy_infra.yml';
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

  const totals = calculateTotals();
  const warnings = runAudits();
  const connections = getConnections();

  return (
    <div className="infrastructure-designer container">
      {/* Title */}
      <div className="designer-header">
        <h1 className="text-gradient">{t('designer.title')}</h1>
        <p>{t('designer.subtitle')}</p>
      </div>

      {/* Top Selector Panel */}
      <div className="designer-top-bar">
        <div className="provider-toggle-group">
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t('designer.provider')}:
          </span>
          <button 
            type="button"
            className={`provider-btn ${provider === 'aws' ? 'active aws' : ''}`}
            onClick={() => handleProviderChange('aws')}
          >
            <Cloud size={16} /> AWS
          </button>
          <button 
            type="button"
            className={`provider-btn ${provider === 'azure' ? 'active azure' : ''}`}
            onClick={() => handleProviderChange('azure')}
          >
            <Cloud size={16} /> Azure
          </button>
        </div>

        <div className="control-actions-group">
          <button 
            type="button"
            className={`designer-btn ${isSimulating ? 'danger' : 'primary'}`}
            onClick={() => setIsSimulating(!isSimulating)}
            disabled={nodes.length === 0}
          >
            {isSimulating ? (
              <>
                <Square size={16} /> {t('designer.stopSimulate')}
              </>
            ) : (
              <>
                <Play size={16} /> {t('designer.simulate')}
              </>
            )}
          </button>
          <button 
            type="button"
            className="designer-btn secondary"
            onClick={() => {
              setNodes([]);
              setSelectedNode(null);
              setIsSimulating(false);
            }}
            disabled={nodes.length === 0}
          >
            <Trash2 size={16} /> {t('designer.clear')}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="designer-workspace">
        {/* Sidebar resource templates catalog */}
        <div className="resource-sidebar">
          <h3>{t('designer.catalog')}</h3>
          <div className="catalog-list">
            {catalog[provider].map((item, idx) => (
              <button 
                type="button"
                key={idx} 
                className="catalog-item"
                onClick={() => addResource(item)}
              >
                <div className="catalog-item-icon">{item.icon}</div>
                <div className="catalog-item-details">
                  <span className="catalog-item-name">{item.name}</span>
                  <span className="catalog-item-cost">${item.cost.toFixed(2)}/mo</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas panel */}
        <div className="canvas-panel">
          <div className="canvas-header">
            <span className="canvas-title">
              <Cloud size={18} /> {t('designer.canvas')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              ({nodes.length} placed)
            </span>
          </div>

          <div 
            ref={canvasRef}
            className="canvas-container" 
            data-testid="designer-canvas"
            onMouseMove={handleDrag}
            onTouchMove={handleDrag}
            onMouseUp={handleEndDrag}
            onTouchEnd={handleEndDrag}
            onMouseLeave={handleEndDrag}
          >
            {nodes.length === 0 ? (
              <div className="canvas-empty-state">
                <Cloud size={48} style={{ opacity: 0.3 }} />
                <p>{t('designer.emptyCanvas')}</p>
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
                        className={`connection-line ${provider} ${isSimulating ? 'active-flow' : ''}`}
                      />
                    );
                  })}
                </svg>

                {/* Placed Resource Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  let icon = <Server size={20} />;
                  if (node.type === 'database') icon = <Database size={20} />;
                  else if (node.type === 'storage') icon = <HardDrive size={20} />;
                  else if (node.type === 'loadbalancer') icon = <Layers size={20} />;
                  else if (node.type === 'dns') icon = <Globe size={20} />;

                  return (
                    <div 
                      key={node.id}
                      className={`canvas-node ${provider} ${isSelected ? 'selected' : ''}`}
                      style={{ 
                        left: `${node.x}px`, 
                        top: `${node.y}px`,
                        cursor: draggedNodeId === node.id ? 'grabbing' : 'grab'
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
                      {/* Public IP indicator indicator */}
                      {(node.publicIp || (node.type === 'storage' && node.publicRead)) && (
                        <div className="node-flag-dot" title="Public IP / Public Access Enabled"></div>
                      )}
                      <div className="node-icon-wrapper">{icon}</div>
                      <div className="node-label">{node.name}</div>
                      <div className="node-desc">
                        {node.type === 'compute' || node.type === 'database' ? node.instanceSize : `$${node.cost.toFixed(2)}/mo`}
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
                    <h4>{t('designer.settings')}</h4>
                    <button 
                      type="button"
                      className="config-close-btn"
                      onClick={() => setSelectedNode(null)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="config-form-group">
                    <label>Resource Name</label>
                    <input 
                      type="text"
                      className="config-input"
                      value={selectedNode.name}
                      onChange={(e) => updateNode({ ...selectedNode, name: e.target.value })}
                    />
                  </div>

                  {(selectedNode.type === 'compute' || selectedNode.type === 'database') && (
                    <div className="config-form-group">
                      <label>Instance Size / Tier</label>
                      <select 
                        className="config-input"
                        value={selectedNode.instanceSize}
                        onChange={(e) => updateNode({ ...selectedNode, instanceSize: e.target.value })}
                      >
                        {selectedNode.type === 'compute' ? (
                          provider === 'aws' ? (
                            <>
                              <option value="t3.micro">t3.micro ($12.00/mo)</option>
                              <option value="t3.small">t3.small ($24.00/mo)</option>
                              <option value="m5.large">m5.large ($96.00/mo)</option>
                            </>
                          ) : (
                            <>
                              <option value="Standard_B1s">Standard_B1s ($14.00/mo)</option>
                              <option value="Standard_B2s">Standard_B2s ($28.00/mo)</option>
                              <option value="Standard_D2s_v5">Standard_D2s_v5 ($110.00/mo)</option>
                            </>
                          )
                        ) : (
                          provider === 'aws' ? (
                            <>
                              <option value="db.t3.micro">db.t3.micro ($24.00/mo)</option>
                              <option value="db.t3.small">db.t3.small ($48.00/mo)</option>
                              <option value="db.m5.large">db.m5.large ($180.00/mo)</option>
                            </>
                          ) : (
                            <>
                              <option value="GP_Gen5_2">GP_Gen5_2 ($28.00/mo)</option>
                              <option value="GP_Gen5_4">GP_Gen5_4 ($56.00/mo)</option>
                              <option value="BC_Gen5_4">BC_Gen5_4 ($190.00/mo)</option>
                            </>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  {(selectedNode.type === 'compute' || selectedNode.type === 'database') && (
                    <label className="config-checkbox-row">
                      <input 
                        type="checkbox"
                        checked={selectedNode.publicIp}
                        onChange={(e) => updateNode({ ...selectedNode, publicIp: e.target.checked })}
                      />
                      <span>Enable Public IP Address</span>
                    </label>
                  )}

                  {selectedNode.type === 'storage' && (
                    <label className="config-checkbox-row">
                      <input 
                        type="checkbox"
                        checked={selectedNode.publicRead}
                        onChange={(e) => updateNode({ ...selectedNode, publicRead: e.target.checked })}
                      />
                      <span>Allow Public Read Access (Bucket)</span>
                    </label>
                  )}

                  <div className="config-actions-row">
                    <button 
                      type="button"
                      className="designer-btn danger"
                      style={{ flexGrow: 1 }}
                      onClick={() => deleteNode(selectedNode.id)}
                    >
                      <Trash2 size={14} /> {t('designer.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Sections (Costs + Audit + IaC Tabs) */}
      <div className="designer-bottom-section">
        {/* Left Side: Cost Calculator & Auditor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Real-time Cost Calculator */}
          <div className="bottom-card">
            <h3>
              <DollarSign size={18} /> {t('designer.costCalculator')}
            </h3>
            <div className="cost-breakdown-list">
              {nodes.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                  No resources added yet.
                </div>
              ) : (
                nodes.map((node) => (
                  <div key={node.id} className="cost-breakdown-item">
                    <span className="item-info">
                      <strong>{node.name}</strong> ({node.type})
                    </span>
                    <span className="item-price">${node.cost.toFixed(2)}/mo</span>
                  </div>
                ))
              )}
            </div>

            <div className="cost-totals-panel">
              <div className="total-box">
                <span className="label">{t('designer.hourly')}</span>
                <span className="amount">${totals.hourly}</span>
              </div>
              <div className="total-box">
                <span className="label">{t('designer.monthly')}</span>
                <span className="amount">${totals.monthly}</span>
              </div>
            </div>
          </div>

          {/* Architecture Security & Design Auditor */}
          <div className="bottom-card">
            <h3>
              <ShieldAlert size={18} /> {t('designer.auditorTitle')}
            </h3>
            <div className="audit-list">
              {warnings.length === 0 ? (
                <div className="audit-empty-state">
                  <Check size={18} />
                  <span>{t('designer.auditorEmpty')}</span>
                </div>
              ) : (
                warnings.map((warn) => (
                  <div key={warn.id} className={`audit-warning-item ${warn.type}`}>
                    <AlertTriangle size={16} />
                    <span>{warn.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: IaC Exporter */}
        <div className="bottom-card" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3>
              <FileCode2 size={18} /> {t('designer.iacTitle')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {t('designer.iacSubtitle')}
            </p>
            
            <div className="iac-tabs-header">
              <button 
                type="button"
                className={`iac-tab-btn ${activeIacTab === 'terraform' ? 'active' : ''}`}
                onClick={() => setActiveIacTab('terraform')}
              >
                Terraform (main.tf)
              </button>
              <button 
                type="button"
                className={`iac-tab-btn ${activeIacTab === 'ansible' ? 'active' : ''}`}
                onClick={() => setActiveIacTab('ansible')}
              >
                Ansible (deploy.yml)
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
                {copied ? t('designer.copied') : t('designer.copy')}
              </button>
              <button 
                type="button"
                className="code-action-btn"
                onClick={handleDownloadCode}
                title="Download configuration file"
              >
                <Download size={14} /> {t('designer.download')}
              </button>
            </div>
            
            <pre>
              <code>
                {activeIacTab === 'terraform' ? generateTerraform() : generateAnsible()}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
