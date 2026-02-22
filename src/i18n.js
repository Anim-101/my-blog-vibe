import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "about": "About",
                "experience": "Experience",
                "devBlog": "Dev Blog",
                "photography": "Photography"
            },
            "home": {
                "greeting": "Hi, I'm",
                "cta": "View My Work",
                "exploring": "Currently Exploring",
                "exploringSub": "AI Agents & Data Pipelines",
                "se": "Software Engineering",
                "seDesc": "Read about my thoughts on modern web development, architecture, and best practices.",
                "readBlog": "Read the Blog",
                "photo": "Photography",
                "photoDesc": "Explore my visual journey through landscapes, street photography, and portraits.",
                "viewGallery": "View Gallery"
            },
            "about": {
                "title": "About",
                "me": "Me",
                "subtitle": "Get to know the person behind the code.",
                "bio": "Hello! I am Anim Akash, a Consultant and Full-Stack Software Engineer currently based in Tokyo, Japan. With a background extending from deep infrastructure and data engineering to crafting modern frontend experiences, I specialize in architecting resilient, full-stack systems that thrive at scale. I recently joined Avanade, where I build robust data pipelines and cloud applications. Previously, I spent several years at Business Architects Inc. designing critical infrastructure and leading frontend development teams. Beyond traditional web development, I am deeply invested in the intersection of Software Engineering and Artificial Intelligence, frequently exploring AI agents, Semantic Kernel, and advanced architectures.",
                "role": "Consultant, Full-Stack Software Engineer",
                "certifications": "Certifications",
                "focusAreas": "Focus Areas",
                "githubTitle": "GitHub",
                "githubActivity": "Activity",
                "githubSubtitle": "Days I code"
            },
            "experience": {
                "title": "My",
                "journey": "Journey",
                "subtitle": "The path that brought me here.",
                "roles": {
                    "0": { "role": "Consultant (Full-Stack Data & Cloud)", "company": "Avanade", "description": "Designing data pipelines and main technical flow for an LNG trading system. Serving as Application Developer for robotics systems at Microsoft AI Lab Kobe. Leading subsets of operation & maintenance teams for major electricity & energy company systems." },
                    "1": { "role": "System Engineer", "company": "Business Architects Inc.", "description": "Served as Infrastructure & Backend engineer on various renewals including a consulting service, a shopping mall, a security service, and a financial/banking platform. Handled stress testing, AWS kernel upgrades, and overall infrastructure deployment logic." },
                    "2": { "role": "Freelance Software Engineer", "company": "Business Architects Inc.", "description": "Worked as the main backend and infrastructure engineer for an in-house SaaS system. Built custom admin and role-based interaction systems, and managed AWS deployments from initial requirement definitions through production." },
                    "3": { "role": "Trainee", "company": "Japan International Cooperation Agency (JICA)", "description": "Engaged in learning Japanese business manners and language through direct collaboration with experienced linguists." },
                    "4": { "role": "Teaching Assistant", "company": "American International University-Bangladesh", "description": "Assisted in teaching a computer graphics lab course strictly focused on OpenGL, actively enhancing participating students' fundamental technical skills." }
                }
            },
            "devblog": {
                "title1": "Software",
                "title2": "Engineering",
                "subtitle": "Thoughts, learnings, and deep dives into modern web development architecture.",
                "searchPlaceholder": "Search for articles, technologies, or concepts...",
                "readArticle": "Read Article",
                "noResults": "No articles found",
                "noResultsText": "We couldn't find anything matching",
                "tryDifferent": "Try using different keywords or checking your spelling.",
                "page": "Page",
                "of": "of",
                "prev": "Previous",
                "next": "Next"
            },
            "photography": {
                "title1": "Through the",
                "title2": "Lens",
                "subtitle": "A collection of moments captured around the world."
            },
            "post": {
                "backGallery": "Back to Gallery",
                "backBlog": "Back to Dev Blog",
                "photoNotFound": "Photo not found",
                "prevImage": "Previous image",
                "nextImage": "Next image",
                "readTime": "min read",
                "postNotFound": "Post not found",
                "backAllPosts": "Back to all posts",
                "projectNotFound": "Project not found",
                "backExperience": "Back to Experience",
                "backProjects": "Back to Projects",
                "liveDemo": "Live Demo",
                "viewSource": "View Source"
            }
        }
    },
    ja: {
        translation: {
            "nav": {
                "home": "ホーム",
                "about": "自己紹介",
                "experience": "経歴",
                "devBlog": "開発ブログ",
                "photography": "写真"
            },
            "home": {
                "greeting": "こんにちは、",
                "cta": "実績を見る",
                "exploring": "現在探究中",
                "exploringSub": "AIエージェントとデータパイプライン",
                "se": "ソフトウェアエンジニアリング",
                "seDesc": "モダンなWeb開発、アーキテクチャ、ベストプラクティスに関する考察。",
                "readBlog": "ブログを読む",
                "photo": "写真",
                "photoDesc": "風景、スナップ、ポートレートなど、カメラを通した記録。",
                "viewGallery": "ギャラリーを見る"
            },
            "about": {
                "title": "私に",
                "me": "ついて",
                "subtitle": "私の人物像について",
                "bio": "こんにちは！ Anim Akash です。現在、東京を拠点とするコンサルタントおよびフルスタックソフトウェアエンジニアです。深いインフラストラクチャやデータエンジニアリングから、モダンなフロントエンドエクスペリエンスの構築に至るまでのバックグラウンドを持ち、大規模な環境で機能する回復力のあるフルスタックシステムの設計を専門としています。最近アバナードに入社し、強力なデータパイプラインとクラウド アプリケーションを構築しています。それ以前は、Business Architects Inc. に数年間勤務し、重要なインフラストラクチャの設計とフロントエンド開発チームの指揮に携わりました。従来のWeb開発にとどまらず、ソフトウェアエンジニアリングとAIの交差点に深い関心を持ち、AIエージェント、セマンティックカーネル、先進的なアーキテクチャなどを探求しています。",
                "role": "コンサルタント、フルスタックソフトウェアエンジニア",
                "certifications": "資格",
                "focusAreas": "専門分野",
                "githubTitle": "GitHub",
                "githubActivity": "アクティビティ",
                "githubSubtitle": "コーディングの日々"
            },
            "experience": {
                "title": "これまでの",
                "journey": "道のり",
                "subtitle": "私がここに至るまでの歩み",
                "roles": {
                    "0": { "role": "コンサルタント (フルスタックデータ＆クラウド)", "company": "Avanade", "description": "LNGトレーディングシステムのためのデータパイプラインとメインの技術フローを設計。Microsoft AI Lab 神戸でロボティクスシステムのアプリケーション開発者として従事。大手電力・エネルギー会社のシステムにおける運用保守チームのサブセットを指揮。" },
                    "1": { "role": "システムエンジニア", "company": "株式会社ビジネス・アーキテクツ", "description": "コンサルティングサービス、ショッピングモール、セキュリティサービス、金融・銀行プラットフォームなど、各種リニューアルにおけるインフラ・バックエンドエンジニアとして従事。負荷テスト、AWSカーネルのアップグレード、インフラ展開ロジック全般を担当。" },
                    "2": { "role": "フリーランス ソフトウェア エンジニア", "company": "株式会社ビジネス・アーキテクツ", "description": "社内SaaSシステムのメインバックエンドおよびインフラストラクチャー・エンジニアとして従事。カスタム管理システムおよびロールベースのインタラクションシステムを構築し、初期要件定義から本番環境までのAWSデプロイメントを管理。" },
                    "3": { "role": "研修生", "company": "独立行政法人国際協力機構（JICA）", "description": "熟練の言語専門家との直接的な協働を通じて、日本のビジネス・マナーと語学の学習に従事。" },
                    "4": { "role": "ティーチング・アシスタント", "company": "アメリカン・インターナショナル・ユニバーシティー・バングラデシュ", "description": "OpenGLに特化したコンピュータ・グラフィックス実験講座の教育補助を行い、参加学生の技術的基礎力の向上に積極的に貢献。" }
                }
            },
            "devblog": {
                "title1": "ソフトウェア",
                "title2": "エンジニアリング",
                "subtitle": "モダンなWeb開発アーキテクチャについての考察と学び",
                "searchPlaceholder": "記事、技術、または概念を検索...",
                "readArticle": "記事を読む",
                "noResults": "記事が見つかりません",
                "noResultsText": "一致するものが見つかりませんでした：",
                "tryDifferent": "別のキーワードを試すか、スペルを確認してください。",
                "page": "ページ",
                "of": " / ",
                "prev": "前へ",
                "next": "次へ"
            },
            "photography": {
                "title1": "レンズ",
                "title2": "越し",
                "subtitle": "世界中で捉えた瞬間のコレクション。"
            },
            "post": {
                "backGallery": "ギャラリーに戻る",
                "backBlog": "開発ブログに戻る",
                "photoNotFound": "写真が見つかりません",
                "prevImage": "前の画像",
                "nextImage": "次の画像",
                "readTime": "分で読める",
                "postNotFound": "記事が見つかりません",
                "backAllPosts": "すべての記事に戻る",
                "projectNotFound": "プロジェクトが見つかりません",
                "backExperience": "経歴に戻る",
                "backProjects": "プロジェクトに戻る",
                "liveDemo": "デモを見る",
                "viewSource": "ソースコード"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
