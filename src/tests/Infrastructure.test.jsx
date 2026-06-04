import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import Infrastructure from '../pages/Infrastructure';

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                'designer.title': 'Cloud Infrastructure Designer',
                'designer.subtitle': 'Interactive sandbox to architect AWS/Azure topologies.',
                'designer.provider': 'Cloud Provider',
                'designer.clear': 'Clear Canvas',
                'designer.simulate': 'Simulate Traffic',
                'designer.stopSimulate': 'Stop Simulation',
                'designer.catalog': 'Resource Catalog',
                'designer.canvas': 'Architecture Canvas',
                'designer.emptyCanvas': 'Click icons in the sidebar to add resources.',
                'designer.costCalculator': 'Real-time Cost Calculator',
                'designer.hourly': 'Hourly Estimate',
                'designer.monthly': 'Monthly Estimate',
                'designer.iacTitle': 'Infrastructure as Code (IaC) Exporter',
                'designer.iacSubtitle': 'Generated configurations.',
                'designer.auditorTitle': 'Architecture Security & Design Auditor',
                'designer.auditorEmpty': 'No issues found! Your architecture looks well-designed.',
                'designer.download': 'Download File',
                'designer.copied': 'Copied!',
                'designer.copy': 'Copy',
                'designer.settings': 'Resource Settings',
                'designer.close': 'Close',
                'designer.delete': 'Delete Resource',
                'designer.warnings.noDatabase': 'Warning: Web servers have no database connection.',
                'designer.warnings.noCompute': 'Warning: Public Load Balancer has no target compute nodes.',
                'designer.warnings.publicDatabase': 'Caution: Database server has a public IP address.',
                'designer.warnings.openS3': 'Caution: S3 storage bucket is set to public read-access.'
            };
            return translations[key] || key;
        }
    })
}));

describe('Cloud Infrastructure Designer Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial empty state and title', () => {
        const { getByText } = render(<Infrastructure />);
        expect(getByText('Cloud Infrastructure Designer')).toBeDefined();
        expect(getByText('Click icons in the sidebar to add resources.')).toBeDefined();
    });

    it('toggles cloud providers correctly between AWS and Azure', () => {
        const { getByText } = render(<Infrastructure />);
        const awsBtn = getByText('AWS');
        const azureBtn = getByText('Azure');

        // Check classes
        expect(awsBtn.className).toContain('active');
        expect(azureBtn.className).not.toContain('active');

        // Switch to Azure
        fireEvent.click(azureBtn);
        expect(azureBtn.className).toContain('active');
        expect(awsBtn.className).not.toContain('active');
    });

    it('adds resources to the canvas, updates the cost calculator, and generates Terraform code', () => {
        const { getByText, container } = render(<Infrastructure />);
        
        // Find EC2 Instance catalog button and click it
        const ec2Btn = getByText('EC2 Instance');
        fireEvent.click(ec2Btn);

        // Should appear on canvas
        expect(container.textContent).toContain('EC2 Instance #1');

        // Verify Cost Calculator
        expect(container.textContent).toContain('EC2 Instance #1 (compute)');
        // Cost totals: $7.59 monthly
        expect(container.textContent).toContain('$7.59');

        // Verify Terraform IaC output displays the aws_instance resource
        const preCode = container.querySelector('.iac-code-panel pre');
        expect(preCode.textContent).toContain('resource "aws_instance"');
    });

    it('runs architecture security audits and reports warnings', () => {
        const { getByText, container } = render(<Infrastructure />);

        // Add compute node
        const ec2Btn = getByText('EC2 Instance');
        fireEvent.click(ec2Btn);

        // With only a compute node, the auditor should complain about missing database connection
        expect(container.textContent).toContain('Warning: Web servers have no database connection.');

        // Add database node
        const rdsBtn = getByText('RDS Instance');
        fireEvent.click(rdsBtn);

        // Warning about missing database connection should disappear
        expect(container.textContent).not.toContain('Warning: Web servers have no database connection.');
    });

    it('allows clearing the canvas', () => {
        const { getByText, container } = render(<Infrastructure />);

        // Add compute node
        const ec2Btn = getByText('EC2 Instance');
        fireEvent.click(ec2Btn);
        expect(container.textContent).toContain('EC2 Instance #1');

        // Clear canvas
        const clearBtn = getByText('Clear Canvas');
        fireEvent.click(clearBtn);

        // Should display empty state again
        expect(container.textContent).toContain('Click icons in the sidebar to add resources.');
        expect(container.textContent).not.toContain('EC2 Instance #1');
    });

    it('handles resource node settings configuration and public IP warning', () => {
        const { getByText, container } = render(<Infrastructure />);

        // Add database node
        const rdsBtn = getByText('RDS Instance');
        fireEvent.click(rdsBtn);

        // Click database node on canvas to open details popover
        const dbNode = container.querySelector('.canvas-node');
        fireEvent.click(dbNode);

        // Verify configuration modal is open
        expect(getByText('Resource Settings')).toBeDefined();

        // Check the "Enable Public IP Address" checkbox to trigger warning
        const publicIpCheckbox = container.querySelector('input[type="checkbox"]');
        fireEvent.click(publicIpCheckbox);

        // Check if database public IP caution is reported by auditor
        expect(container.textContent).toContain('Caution: Database server has a public IP address.');
    });

    it('toggles traffic flow simulation', () => {
        const { getByText } = render(<Infrastructure />);

        // Add a compute node so simulation button is not disabled
        const ec2Btn = getByText('EC2 Instance');
        fireEvent.click(ec2Btn);

        const simulateBtn = getByText('Simulate Traffic');
        
        // Start simulation
        fireEvent.click(simulateBtn);
        expect(getByText('Stop Simulation')).toBeDefined();

        // Stop simulation
        fireEvent.click(getByText('Stop Simulation'));
        expect(getByText('Simulate Traffic')).toBeDefined();
    });
});
