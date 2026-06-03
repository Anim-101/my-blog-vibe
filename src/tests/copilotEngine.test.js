import { describe, it, expect } from 'vitest';
import { getAIResponse } from '../utils/copilotEngine';

describe('AI Copilot Engine', () => {
    describe('English Queries (lang = en)', () => {
        it('should handle greetings', () => {
            const response = getAIResponse('hi', 'en');
            expect(response).toBeDefined();
            const greetings = [
                "Hi there! I'm Anim's AI Copilot. Ask me about his experience, skills, certifications, or projects!",
                "Hello! I am Anim's digital assistant. How can I help you today? I can tell you about his work at Avanade, Red Hat certifications, or AI agent development.",
                "Hey! Glad you're here. Ask me anything about Anim's software engineering background."
            ];
            expect(greetings).toContain(response);
        });

        it('should route certifications queries', () => {
            const response = getAIResponse('tell me about your certs', 'en');
            expect(response).toContain('Azure AI Fundamentals');
            expect(response).toContain('AWS Certified Solutions Architect');
        });

        it('should route skills queries', () => {
            const response = getAIResponse('what are your skills?', 'en');
            expect(response).toContain('React');
            expect(response).toContain('AWS architecture');
        });

        it('should route experience queries', () => {
            const response = getAIResponse('tell me about your work experience', 'en');
            expect(response).toContain('Avanade');
            expect(response).toContain('Business Architects Inc.');
        });

        it('should route AI agent queries', () => {
            const response = getAIResponse('tell me about your AI agent work', 'en');
            expect(response).toContain('Semantic Kernel');
            expect(response).toContain('AutoGen');
        });

        it('should route projects queries', () => {
            const response = getAIResponse('tell me about your projects', 'en');
            expect(response).toContain('Interactive Data Engineering Pipeline Simulator');
            expect(response).toContain('3D Skills Constellation');
            expect(response).toContain('Holographic Certification Vault');
            expect(response).toContain('A Study on Data Compression');
        });

        it('should fall back to default when query is unknown', () => {
            const response = getAIResponse('random query', 'en');
            expect(response).toContain("I'm not quite sure about that specific detail");
            expect(response).toContain("Pipeline Simulator");
        });
    });

    describe('Japanese Queries (lang = ja)', () => {
        it('should handle greetings', () => {
            const response = getAIResponse('こんにちは', 'ja');
            expect(response).toBeDefined();
            const greetings = [
                "こんにちは！アニムのAIコパイロットです。彼の経歴や資格、スキル、プロジェクトについて何でも聞いてください！",
                "はじめまして！デジタルアシスタントです。アバナードでの経歴、Red Hatの満点資格、AIエージェント開発などについてお答えできます。どのような情報をお探しですか？",
                "こんにちは！アニムのソフトウェアエンジニアとしての背景について何でもお尋ねください。"
            ];
            expect(greetings).toContain(response);
        });

        it('should route certifications queries', () => {
            const response = getAIResponse('資格について教えてください', 'ja');
            expect(response).toContain('Microsoft Certified: Azure AI Fundamentals');
            expect(response).toContain('日本語能力試験');
        });

        it('should route skills queries', () => {
            const response = getAIResponse('得意な技術は何ですか？', 'ja');
            expect(response).toContain('フロントエンド');
            expect(response).toContain('AIエージェント');
        });

        it('should route experience queries', () => {
            const response = getAIResponse('経歴について', 'ja');
            expect(response).toContain('アバナード株式会社');
        });

        it('should route projects queries', () => {
            const response = getAIResponse('プロジェクトについて教えて', 'ja');
            expect(response).toContain('データパイプライン・シミュレーター');
            expect(response).toContain('3D技術スタック星座');
            expect(response).toContain('ホログラフィック資格保管庫');
            expect(response).toContain('データ圧縮に関する研究');
        });

        it('should fall back to default when query is unknown', () => {
            const response = getAIResponse('不明な質問', 'ja');
            expect(response).toContain('ご質問の内容について十分な情報を検索できませんでした');
        });
    });
});
