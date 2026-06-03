const KNOWLEDGE_BASE = {
    en: {
        greetings: [
            "Hi there! I'm Anim's AI Copilot. Ask me about his experience, skills, certifications, or projects!",
            "Hello! I am Anim's digital assistant. How can I help you today? I can tell you about his work at Avanade, Red Hat certifications, or AI agent development.",
            "Hey! Glad you're here. Ask me anything about Anim's software engineering background."
        ],
        certs: "Anim holds several professional credentials and certifications:\n\n" +
               "• **Microsoft Certified: Azure AI Fundamentals**\n" +
               "• **Microsoft Certified: Azure Fundamentals**\n" +
               "• **AWS Certified Solutions Architect – Associate** (SAA-C03)\n" +
               "• **RHCE (Red Hat Certified Engineer)**\n" +
               "• **RHCSA (Red Hat Certified System Administrator)**\n" +
               "• **JLPT N2 (Japanese Language Proficiency Test)**\n\n" +
               "Would you like to know more about his cloud or infrastructure background?",
        skills: "Anim's core expertise spans multiple domains:\n\n" +
                "• **Frontend:** React, JavaScript, CSS/HTML, responsive layout design.\n" +
                "• **Backend/OS:** Node.js, Linux administration, Linux Kernel upgrades, Red Hat configurations.\n" +
                "• **Data & Cloud:** AWS architecture, cloud infrastructure, ETL data pipelines, cloud database warehousing.\n" +
                "• **AI Agents:** Microsoft Semantic Kernel, AutoGen, LLM integrations.\n" +
                "• **Other:** OpenGL (3D graphics TA experience), blockchain development.\n\n" +
                "Which area are you interested in?",
        experience: "Anim is currently working as a **Team Lead (Consultant) - Full-Stack Development** at **Avanade** in Tokyo, Japan (since March 2025). He:\n\n" +
                     "• Designs core data pipelines and data ingestion workflows for LNG trading systems.\n" +
                     "• Serves as Application Developer (Cloud) for robotics systems at **Microsoft AI Lab Kobe** and Kawasaki Heavy Industries.\n" +
                     "• Leads O&M engineering and daily/monthly operations for supply chain systems at power/energy companies.\n\n" +
                     "Previously, he spent 3 years at **Business Architects Inc.** as a System Engineer upgrading AWS/Linux kernels, designing infrastructure renewals, and leading frontend teams. Would you like his contact details?",
        ai: "Anim is deeply interested in the intersection of Software Engineering and Artificial Intelligence. His AI credentials include:\n\n" +
            "• Developing robotics applications at **Microsoft AI Lab Kobe**.\n" +
            "• Active exploration of agentic AI frameworks: **Semantic Kernel** (Microsoft) and **AutoGen** (Microsoft/pydantic).\n" +
            "• Custom integrations of Large Language Models (LLMs) into production architectures.\n\n" +
            "You are chatting with an AI Copilot that he built right now!",
        contact: "You can reach out to Anim Akash via:\n\n" +
                 "• **Email:** [anmaksh@gmail.com](mailto:anmaksh@gmail.com)\n" +
                 "• **LinkedIn:** [linkedin.com/in/anim-101](https://www.linkedin.com/in/anim-101)\n" +
                 "• **GitHub:** [github.com/Anim-101](https://github.com/Anim-101)\n\n" +
                 "He is based in Tokyo, Japan and is open to consultations and collaborations!",
        hobbies: "Beyond software, Anim has experience as a Teaching Assistant in **Computer Graphics (OpenGL)**. He also loves street and landscape photography (which you can check out in the **Photography** section!) and martial arts (Taekwondo).\n\n" +
                 "He also loves travel, street photography, and exploring Tokyo.",
        blog: "Anim writes about modern software architectures, React 19 safety patterns, and web development on his **Dev Blog** section. Feel free to check out his articles there!",
        default: "I'm not quite sure about that specific detail. But I can tell you all about Anim's:\n\n" +
                 "• Current work at **Avanade**\n" +
                 "• Perfect 300/300 **Red Hat Certifications**\n" +
                 "• **AI Agent** experiments (Semantic Kernel, AutoGen)\n" +
                 "• Core **technical stack** or **contact details**\n\n" +
                 "What would you like to explore?"
    },
    ja: {
        greetings: [
            "こんにちは！アニムのAIコパイロットです。彼の経歴や資格、スキル、プロジェクトについて何でも聞いてください！",
            "はじめまして！デジタルアシスタントです。アバナードでの経歴、Red Hatの満点資格、AIエージェント開発などについてお答えできます。どのような情報をお探しですか？",
            "こんにちは！アニムのソフトウェアエンジニアとしての背景について何でもお尋ねください。"
        ],
        certs: "アニムは以下の認定資格を保有しています：\n\n" +
               "• **Microsoft Certified: Azure AI Fundamentals**\n" +
               "• **Microsoft Certified: Azure Fundamentals**\n" +
               "• **AWS 認定ソリューションアーキテクト – アソシエイト** (SAA-C03)\n" +
               "• **RHCE (Red Hat 認定エンジニア)**\n" +
               "• **RHCSA (Red Hat 認定システム管理者)**\n" +
               "• **日本語能力試験 (JLPT) N2**\n\n" +
               "クラウドやインフラの運用経験について詳しくお知りになりたいですか？",
        skills: "アニムの主な専門分野は以下の通りです：\n\n" +
                "• **フロントエンド:** React, JavaScript, CSS/HTML, レスポンシブUIデザイン。\n" +
                "• **バックエンド/OS:** Node.js, Linuxシステム管理, カーネルアップグレード, Red Hatシステム設定。\n" +
                "• **データとクラウド:** AWSクラウド設計, インフラ構築, ETLデータパイプライン, クラウドデータウェアハウス。\n" +
                "• **AIエージェント:** Microsoft Semantic Kernel, AutoGen, LLM統合開発。\n" +
                "• **その他:** OpenGL (3DグラフィックスTA経験), ブロックチェーン開発。\n\n" +
                "どの分野に興味がありますか？",
        experience: "アニムは現在、東京の**アバナード株式会社**にて**チームリード（コンサルタント）- フルスタック開発**として勤務しています（2025年3月〜現在）。\n\n" +
                     "• 大手ガス生産会社におけるLNG取引システムのデータパイプラインおよびデータ取り込みフロー設計。\n" +
                     "• **Microsoft AI Lab 神戸**および川崎重工業のロボティクスシステムのアプリケーション開発（クラウド）。\n" +
                     "• 大手電力・エネルギー会社のサプライチェーンシステムにおける日次・月次の運用保守サブチームリード。\n\n" +
                     "それ以前は、**株式会社ビジネス・アーキテクツ**に3年間在籍し、インフラ構築、ショッピングモールシステムの負荷テスト、セキュリティ・金融サービスのフロントエンドチームリード、AWS/Linuxカーネルアップグレードやシステム監視などを担当しました。連絡先を表示しますか？",
        ai: "アニムはソフトウェアエンジニアリングと人工知能 (AI) の融合に強い関心を持っています。彼のAI実績は以下の通りです：\n\n" +
            "• **Microsoft AI Lab 神戸**でのロボティクスAI・アプリケーション開発。\n" +
            "• エージェントAIフレームワーク（**Semantic Kernel**, **AutoGen**）の活用。\n" +
            "• 大規模言語モデル (LLM) の実用システムへの実装。\n" +
            "\n" +
            "現在あなたがチャットしているこのコパイロットも、彼自身が実装したエージェントのデモです！",
        contact: "アニムへのご連絡は、以下の方法で可能です：\n\n" +
                 "• **メール:** [anmaksh@gmail.com](mailto:anmaksh@gmail.com)\n" +
                 "• **LinkedIn:** [linkedin.com/in/anim-101](https://www.linkedin.com/in/anim-101)\n" +
                 "• **GitHub:** [github.com/Anim-101](https://github.com/Anim-101)\n\n" +
                 "現在東京都内に拠点を置いており、コラボレーションや案件のご相談をお待ちしています！",
        hobbies: "趣味やその他の活動：\n\n" +
                 "• 大学での**コンピュータ・グラフィックス (OpenGL)**のティーチングアシスタント経験。\n" +
                 "• 武道 (テコンドー)。\n" +
                 "• ストリート・風景写真撮影（サイト内の**Photography**セクションで写真をご覧いただけます！）。",
        blog: "アニムはReact 19の設計パターン、モダンWebアーキテクチャについて**開発ブログ (Dev Blog)**で発信しています。ぜひ記事を読んでみてください！",
        default: "ご質問の内容について十分な情報を検索できませんでした。ですが、以下の情報についてお答えできます：\n\n" +
                 "• 現在の**アバナード**での仕事内容\n" +
                 "• 満点合格した**Red Hat認定資格 (RHCE/RHCSA)**\n" +
                 "• **AIエージェント**開発実績 (Semantic Kernel, AutoGen)\n" +
                 "• 主な**技術スタック**や**連絡先**\n\n" +
                 "何について聞きたいですか？"
    }
};

export const getAIResponse = (query, lang = 'en') => {
    const q = query.toLowerCase().trim();
    const db = KNOWLEDGE_BASE[lang] || KNOWLEDGE_BASE['en'];
    
    // Intent mapping
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greetings') || q.includes('こんにちは') || q.includes('はじめまして') || q.includes('yo') || q.includes('test') || q.includes('greet')) {
        const idx = Math.floor(Math.random() * db.greetings.length);
        return db.greetings[idx];
    }
    
    if (q.includes('cert') || q.includes('qualification') || q.includes('rhce') || q.includes('rhcsa') || q.includes('aws') || q.includes('jlpt') || q.includes('n2') || q.includes('azure') || q.includes('microsoft') || q.includes('資格') || q.includes('認定')) {
        return db.certs;
    }
    
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('expert') || q.includes('program') || q.includes('backend') || q.includes('frontend') || q.includes('開発') || q.includes('技術') || q.includes('言語') || q.includes('得意')) {
        return db.skills;
    }
    
    if (q.includes('work') || q.includes('job') || q.includes('experience') || q.includes('company') || q.includes('avanade') || q.includes('business architect') || q.includes('経歴') || q.includes('職歴') || q.includes('会社') || q.includes('仕事') || q.includes('アバナード')) {
        return db.experience;
    }
    
    if (q.includes('ai') || q.includes('agent') || q.includes('semantickernel') || q.includes('autogen') || q.includes('llm') || q.includes('gpt') || q.includes('openai') || q.includes('gemini') || q.includes('エージェント') || q.includes('人工知能')) {
        return db.ai;
    }
    
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('github') || q.includes('linkedin') || q.includes('resume') || q.includes('cv') || q.includes('連絡') || q.includes('メール') || q.includes('採用')) {
        return db.contact;
    }
    
    if (q.includes('hobby') || q.includes('interest') || q.includes('photo') || q.includes('camera') || q.includes('opengl') || q.includes('taekwondo') || q.includes('graphics') || q.includes('趣味') || q.includes('写真') || q.includes('テコンドー') || q.includes('グラフィックス')) {
        return db.hobbies;
    }
    
    if (q.includes('blog') || q.includes('article') || q.includes('post') || q.includes('ブログ') || q.includes('記事')) {
        return db.blog;
    }
    
    return db.default;
};
