import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import React from 'react';
import ApiClient from '../pages/ApiClient';

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                'apiClient.title': 'REST API Client',
                'apiClient.subtitle': 'Send HTTP requests, test API endpoints, inspect JSON responses, and view performance latency stats.',
                'apiClient.send': 'Send',
                'apiClient.clear': 'Clear',
                'apiClient.method': 'Method',
                'apiClient.url': 'URL',
                'apiClient.headers': 'Headers',
                'apiClient.body': 'Body',
                'apiClient.response': 'Response',
                'apiClient.status': 'Status',
                'apiClient.time': 'Time',
                'apiClient.size': 'Size',
                'apiClient.emptyResponse': 'Enter a URL and click Send to inspect the API response.',
                'apiClient.loading': 'Sending request...',
                'apiClient.error': 'Failed to execute request',
                'apiClient.key': 'Key',
                'apiClient.value': 'Value',
                'apiClient.addHeader': 'Add Header',
                'apiClient.presets': 'Quick Presets',
                'apiClient.corsWarning': 'CORS Policy Warning',
                'apiClient.corsDesc': 'The request was blocked by the browser\'s security policies. Would you like to simulate a successful mock API response instead?',
                'apiClient.simulateResp': 'Simulate Response',
                'apiClient.cancel': 'Cancel'
            };
            return translations[key] || key;
        }
    })
}));

describe('REST API Client Page Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders request presets, input bar, and editor panes correctly', () => {
        const { getByText, getByTestId, container } = render(<ApiClient />);
        
        expect(getByText('REST API Client')).toBeDefined();
        expect(getByTestId('api-client-workspace')).toBeDefined();
        
        // Assert mock presets are displayed
        expect(getByText('Quick Presets:')).toBeDefined();
        expect(container.textContent).toContain('Mock Users (Local)');
        expect(container.textContent).toContain('Mock Server Error (Local)');
        
        // Assert initial URL input value
        const urlInput = getByTestId('api-url-input');
        expect(urlInput.value).toBe('https://jsonplaceholder.typicode.com/posts');
    });

    it('prefills URL and method when a preset badge is clicked', () => {
        const { getByText, getByTestId } = render(<ApiClient />);
        
        const presetBtn = getByText('Mock Server Error (Local)');
        fireEvent.click(presetBtn);

        const methodSelect = getByTestId('api-method-select');
        const urlInput = getByTestId('api-url-input');

        expect(methodSelect.value).toBe('POST');
        expect(urlInput.value).toBe('mock://error/500');
    });

    it('adds and removes headers dynamically in the headers editor', () => {
        const { getByText, container } = render(<ApiClient />);
        
        // Initial setup has 2 header rows
        let rows = container.querySelectorAll('.header-row-item');
        expect(rows.length).toBe(2);

        const addBtn = getByText('Add Header');
        fireEvent.click(addBtn);

        rows = container.querySelectorAll('.header-row-item');
        expect(rows.length).toBe(3);

        // Remove the newly added header (last row)
        const deleteBtns = container.querySelectorAll('.header-remove-btn');
        fireEvent.click(deleteBtns[2]);

        rows = container.querySelectorAll('.header-row-item');
        expect(rows.length).toBe(2);
    });

    it('enables the request body tab only for write methods (POST/PUT/PATCH/DELETE)', () => {
        const { getByText, getByTestId } = render(<ApiClient />);
        
        const bodyTabBtn = getByText('Body');
        const methodSelect = getByTestId('api-method-select');

        // Initially GET method is active - Body tab should be disabled
        expect(bodyTabBtn.disabled).toBe(true);

        // Change method to POST
        fireEvent.change(methodSelect, { target: { value: 'POST' } });
        expect(bodyTabBtn.disabled).toBe(false);
    });

    it('runs local mock request successfully and updates latency stats', async () => {
        const { getByText, getByTestId, container } = render(<ApiClient />);
        
        // Change URL to a mock local endpoint
        const urlInput = getByTestId('api-url-input');
        fireEvent.change(urlInput, { target: { value: 'mock://users' } });

        const sendBtn = getByTestId('api-send-btn');
        fireEvent.click(sendBtn);

        // Advance timers by simulation delay
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Verify simulated logs
        expect(container.textContent).toContain('Status:');
        expect(container.textContent).toContain('200 OK');
        expect(container.textContent).toContain('Anim Akash');
        expect(container.textContent).toContain('Avanade');
    });

    it('displays error response mock on HTTP 500 triggers', async () => {
        const { getByText, getByTestId, container } = render(<ApiClient />);
        
        // Select Mock Server Error preset
        const presetBtn = getByText('Mock Server Error (Local)');
        fireEvent.click(presetBtn);

        const sendBtn = getByTestId('api-send-btn');
        fireEvent.click(sendBtn);

        // Advance timers
        await act(async () => {
            vi.advanceTimersByTime(1000);
        });

        // Verify status and JSON response
        expect(container.textContent).toContain('500 Internal Server Error');
        expect(container.textContent).toContain('Simulated 500 crash');
    });
});
