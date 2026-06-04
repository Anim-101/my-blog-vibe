import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "copilot": {
                "title": "Anim's AI Copilot",
                "subtitle": "Interactive Recruiter Assistant",
                "status": "Online",
                "placeholder": "Ask about skills, work, certs...",
                "greet": "Hi! I'm Anim's AI Copilot. Ask me about his experience, certifications, or projects!",
                "suggested": {
                    "certs": "What certs does he have?",
                    "skills": "What are his core skills?",
                    "experience": "Where does he work now?",
                    "ai": "Tell me about his AI work."
                }
            },
            "nav": {
                "home": "Home",
                "about": "About",
                "experience": "Experience",
                "devBlog": "Dev Blog",
                "photography": "Photography",
                "memory": "Memory",
                "designer": "Cloud Designer"
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
                "viewGallery": "View Gallery",
                "terminalTitle": "Interactive Developer Console",
                "terminalSubtitle": "Explore my Red Hat certified background, skills, and playbooks via a retro shell interface"
            },
            "about": {
                "title": "About",
                "me": "Me",
                "subtitle": "Get to know the person behind the code.",
                "bio": "Hello! I am Anim Akash, a Consultant and Full-Stack Software Engineer currently based in Tokyo, Japan. With a background extending from deep infrastructure and data engineering to crafting modern frontend experiences, I specialize in architecting resilient, full-stack systems that thrive at scale. I recently joined Avanade, where I build robust data pipelines and cloud applications. Previously, I spent several years at Business Architects Inc. designing critical infrastructure and leading frontend development teams. Beyond traditional web development, I am deeply invested in the intersection of Software Engineering and Artificial Intelligence, frequently exploring AI agents, Semantic Kernel, and advanced architectures.",
                "role": "Team Lead (Consultant) - Full-Stack Development",
                "certifications": "Certifications",
                "focusAreas": "Focus Areas",
                "githubTitle": "GitHub",
                "githubActivity": "Activity",
                "githubSubtitle": "Days I code",
                "github": {
                    "total": "Total Contributions",
                    "currentStreak": "Current Streak",
                    "longestStreak": "Longest Streak",
                    "activeDays": "Active Days",
                    "loading": "Loading GitHub Stats...",
                    "error": "Failed to load GitHub activity.",
                    "days": "days",
                    "commits": "commits"
                },
                "certVault": {
                    "title": "Professional Credentials",
                    "subtitle": "Holographic Certification Vault",
                    "desc": "Interact with 3D reflective certificates. Click a card to flip and verify credentials.",
                    "cardFlipPrompt": "Click to flip",
                    "certId": "Credential ID",
                    "date": "Issue Date",
                    "score": "Score",
                    "skills": "Skills Verified",
                    "verify": "Verify Badge"
                },
                "certificationsList": {
                    "rhce": {
                        "name": "Red Hat Certified Engineer (RHCE)",
                        "score": "300/300 (Perfect Score)",
                        "skills": {
                            "0": "Ansible Automation",
                            "1": "System Scripting",
                            "2": "Service Configuration",
                            "3": "Security Administration"
                        }
                    },
                    "rhcsa": {
                        "name": "Red Hat Certified System Administrator (RHCSA)",
                        "score": "300/300 (Perfect Score)",
                        "skills": {
                            "0": "Essential CLI Tools",
                            "1": "Storage Management",
                            "2": "User Administration",
                            "3": "System Security"
                        }
                    },
                    "azure_fund": {
                        "name": "Microsoft Certified: Azure Fundamentals",
                        "score": "Passed",
                        "skills": {
                            "0": "Cloud Computing Concepts",
                            "1": "Azure Architecture & Services",
                            "2": "Azure Security & Governance"
                        }
                    },
                    "azure_ai": {
                        "name": "Microsoft Certified: Azure AI Fundamentals",
                        "score": "Passed",
                        "skills": {
                            "0": "AI & Machine Learning Workloads",
                            "1": "Azure OpenAI & Cognitive Services",
                            "2": "Responsible AI Principles"
                        }
                    },
                    "aws": {
                        "name": "AWS Certified Solutions Architect – Associate",
                        "score": "815/1000",
                        "skills": {
                            "0": "VPC Architecture",
                            "1": "Serverless (Lambda/S3)",
                            "2": "High Availability",
                            "3": "IAM Governance"
                        }
                    },
                    "jlpt": {
                        "name": "Japanese Language Proficiency Test (JLPT) N2",
                        "score": "Passed",
                        "skills": {
                            "0": "Business Japanese Communication",
                            "1": "Reading Comprehension",
                            "2": "Advanced Kanji & Vocabulary"
                        }
                    }
                }
            },
            "experience": {
                "title": "My",
                "journey": "Journey",
                "subtitle": "The path that brought me here.",
                "roles": {
                    "0": { "role": "Team Lead (Consultant) - Full-Stack Development", "company": "Avanade", "description": "Full Stack Engineer for an LNG-related trading system at a major gas production company. Responsible for designing core data pipelines and data ingestion workflows. Led the design and implementation of integration, system, and regression testing to ensure high-quality and reliable application performance. Application Developer (Cloud) for a system related to Microsoft AI Lab Kobe and Kawasaki Heavy Industries' robotic arms. Led the migration and transfer of the entire system from one Azure tenant to another. Served as a sub-team lead, leading a team in daily and monthly operations and maintenance for a supply chain system at an electricity and energy company." },
                    "1": { "role": "System Engineer", "company": "Business Architects Inc.", "description": "Infrastructure & Backend Engineer contributing to the renewal of the main website for multiple customers. Designed and led infrastructure renewal for a shopping mall system, including stress testing to ensure system reliability. Served as Team Lead for frontend engineers on the renewal of a security service website. Acted as Sub-Team Lead for frontend engineers on the renewal of a financial service website. Contributed as a Frontend Engineer to the renewal of a banking service website. Provided operations and maintenance support for an advertising platform of a Japanese railway system, including upgrading the kernel from Amazon Linux 2 to Amazon Linux 3, and managed monthly maintenance and system monitoring." },
                    "2": { "role": "Freelance Software Engineer", "company": "Business Architects Inc.", "description": "Backend and Infrastructure Engineer. Served as the primary backend engineer for an in-house SaaS system. Developed a custom admin interaction system and a custom comment and role-based interaction system. Deployed, managed, and maintained infrastructure on AWS. Participated in the full lifecycle, from requirements definition through development, and continued to manage and maintain the system post-production." },
                    "3": { "role": "Trainee", "company": "Japan International Cooperation Agency (JICA)", "description": "Engaged in learning Japanese business manners and language through collaboration with experienced linguists." },
                    "4": { "role": "Teaching Assistant", "company": "American International University-Bangladesh", "description": "Assisted in teaching a computer graphics lab course focused on OpenGL, enhancing students' technical skills." }
                },
                "pipeline": {
                    "title": "Data Engineering",
                    "subtitle": "Interactive Data Pipeline Simulator",
                    "desc": "Simulate high-throughput cloud ingestion, validation, transformation, and storage systems modeled after Anim's enterprise architecture experience.",
                    "controls": {
                        "title": "Pipeline Controls",
                        "start": "Resume Stream",
                        "pause": "Pause Stream",
                        "speed": "Ingestion Rate (msg/s)",
                        "errorRate": "Error Rate (%)",
                        "injectSchema": "Inject Schema Error",
                        "injectTimeout": "Inject Timeout Error",
                        "injectDedup": "Inject Dedup Spike",
                        "clearTerminal": "Clear Console Logs"
                    },
                    "metrics": {
                        "title": "Live Pipeline Metrics",
                        "ingested": "Ingested",
                        "processed": "Processed",
                        "success": "Success Rate",
                        "latency": "Avg Latency",
                        "dlq": "DLQ Failures",
                        "backpressure": "System Backpressure"
                    },
                    "nodeDetail": {
                        "title": "Component Diagnostics",
                        "selectNode": "Click any pipeline node to inspect technical specs, code highlights, and Anim's real-world implementation history.",
                        "techSpecs": "Technical Diagnostics",
                        "animExp": "Anim's Project Implementation"
                    },
                    "stages": {
                        "ingestion": "Ingestion",
                        "validation": "Validation",
                        "transformation": "Transformation",
                        "storage": "Storage"
                    },
                    "nodes": {
                        "iot": {
                            "name": "LNG Transaction Feed",
                            "tech": "Simulates real-time ingestion of trade deal bookings, cargo schedules, and financial transactions from global trading desks.",
                            "animExp": "At Avanade, Anim designed core data pipelines and ingestion workflows to handle transaction and supply chain data streams for an LNG trading system."
                        },
                        "api": {
                            "name": "Supply Chain API Gateway",
                            "tech": "Ingests secure HTTP Webhook payloads containing logistics, scheduling, and power grid status updates for utility supply chains.",
                            "animExp": "Anim developed API configurations and backend endpoints at Business Architects Inc. to support secure, high-traffic website renewals for e-commerce and banking clients."
                        },
                        "cdc": {
                            "name": "Transactional DB CDC",
                            "tech": "Log-based Change Data Capture parsing transactional commits from Postgres or SQL Server database logs to sync trading registries.",
                            "animExp": "Anim managed database migrations and state replication. He notably led a full system and database tenant migration on Azure for a robotic systems client at Avanade."
                        },
                        "schema": {
                            "name": "Schema Registry",
                            "tech": "Validates message payload schemas against strict Apache Avro declarations. Bad JSON is instantly flagged.",
                            "animExp": "To maintain data integrity, Anim led the design of integration and regression testing suites at Avanade to validate data schemas and application performance."
                        },
                        "dedup": {
                            "name": "Deduplicator",
                            "tech": "Filters duplicate message IDs using a sliding-window cache in a high-speed Redis cluster.",
                            "animExp": "Anim designed custom role-based permission and deduplication logics in in-house SaaS applications during his freelance tenure."
                        },
                        "compliance": {
                            "name": "Compliance Guard",
                            "tech": "Inspects text fields for PII (Personally Identifiable Information) and masks values before cloud ingestion.",
                            "animExp": "He led frontend and backend engineering teams renewing financial and security service systems, ensuring strict security and compliance standards."
                        },
                        "joiner": {
                            "name": "Streaming Joiner",
                            "tech": "Enriches real-time transaction event streams by joining them with static dimensional database caches.",
                            "animExp": "Anim designed trading pipeline enrichment steps for a major gas production client, joining trade transaction feeds with static reference data."
                        },
                        "aggregator": {
                            "name": "Aggregator",
                            "tech": "Groups metrics into 1-minute tumbling windows to calculate rolling averages, sums, and traffic peaks.",
                            "animExp": "He supervised the maintenance and calculation of daily/monthly aggregation metrics for supply chain systems at a power and energy utility."
                        },
                        "anomaly": {
                            "name": "Anomaly Detector",
                            "tech": "Uses statistical analysis (z-scores) on stream inputs to detect spikes or unexpected data drops.",
                            "animExp": "Anim set up monitoring dashboards, logs, and alerts for e-commerce and advertising platforms to detect system anomalies and performance drops."
                        },
                        "datalake": {
                            "name": "S3 Data Lake",
                            "tech": "Compacts raw messages into compressed Apache Parquet formats, saving them in AWS S3 partitions.",
                            "animExp": "Anim deployed, managed, and maintained scalable cloud storage and hosting infrastructures on AWS for customer platforms."
                        },
                        "snowflake": {
                            "name": "Snowflake DW",
                            "tech": "Loads cleansed events into analytics tables for business intelligence, reporting, and dashboard querying.",
                            "animExp": "At Avanade, he integrated data warehouses and structured schemas to generate energy trading reports for business analysis."
                        },
                        "cache": {
                            "name": "PostgreSQL Cache",
                            "tech": "Hot database replica maintaining the latest system state, powering web app dashboards and real-time APIs.",
                            "animExp": "He optimized database performance, upgraded OS kernels (Amazon Linux 2 to 3), and performed extensive stress testing to guarantee cache reliability."
                        },
                        "dlq": {
                            "name": "Dead Letter Queue",
                            "tech": "Quarantines bad, malformed, or timed-out events. Holds them for manual inspection and re-driving.",
                            "animExp": "Anim led O&M engineering teams, designing retry rules and error handlers to capture processing failures and notify maintenance teams."
                        }
                    }
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
            "terminal": {
                "welcome": "Welcome to AnimOS v1.0.0 (zsh-sandbox)\nCertified: Red Hat Certified Engineer (RHCE) #200-244-934 (Perfect Score 300/300)\n\nType 'help' to see list of available commands.\nType 'snake' or 'tetris' to play retro games directly in this shell!\nType 'guestbook sign' to leave your signature.\n",
                "prompt": "anim@animos:~ $ ",
                "helpText": "Available commands:\n  ls                      List directory contents\n  cd [dir]                Change directory\n  cat [file]              Print file contents\n  neofetch                Display system information and credentials\n  ansible-playbook [file] Execute a simulated Ansible playbook\n  theme [theme-name]      Change terminal visual theme\n  guestbook               View or sign the recruiter guestbook\n  snake                   Play a retro ASCII Snake game\n  tetris                  Play a retro ASCII Tetris game\n  sudo rhce               Run special command for Red Hat Certification details\n  history                 Display command history list\n  clear                   Clear the screen\n  help                    Display this help message",
                "cmdNotFound": "command not found: ",
                "noSuchFile": "No such file or directory: ",
                "isDir": "Is a directory: ",
                "permissionDenied": "Permission denied. Anim is the only root user here. Try 'sudo rhce' for a surprise!",
                "themeChanged": "Terminal theme changed to: ",
                "invalidTheme": "Invalid theme. Available themes: glass, matrix, cyberpunk, amber, classic, dracula, solarized, synthwave, light.",
                "playbookSimulating": "Starting Ansible playbook simulation...",
                "playbookSuccess": "Ansible playbook execution finished successfully.",
                "usagePlaybook": "Usage: ansible-playbook playbooks/deploy_skills.yml",
                "bioTitle": "=== Biography ===",
                "contactTitle": "=== Contact Details ===",
                "skillsTitle": "=== Skill Categories ===",
                "certsTitle": "=== Professional Certifications ===",
                "guestbookHelp": "Usage: guestbook [list|sign|clear]",
                "guestbookTitle": "=== Recruiter Guestbook ===",
                "guestbookNoEntries": "No entries found. Be the first to sign using 'guestbook sign'!",
                "gbEnterName": "Enter your name: ",
                "gbEnterCompany": "Enter your company / role: ",
                "gbEnterMessage": "Enter your message: ",
                "gbSignedSuccess": "Thank you for signing the guestbook!",
                "gbCleared": "Guestbook signatures cleared successfully.",
                "snakeTitle": "=== Retro CLI Snake Game ===",
                "snakeInstructions": "Use Arrow keys or WASD to control. Press 'q' to quit.",
                "snakeScore": "Score: ",
                "snakeHighScore": "  High Score: ",
                "snakeGameOver": "Game Over! Press 'r' to restart, 'q' to quit.",
                "tetrisTitle": "=== Retro CLI Tetris Game ===",
                "tetrisInstructions": "A/D or Arrows to Move. W or Up to Rotate. S or Down to Drop. Space to Hard Drop. Q to Quit.",
                "tetrisScore": "Score: ",
                "tetrisHighScore": "  High Score: ",
                "tetrisGameOver": "Game Over! Press 'r' to restart, 'q' to quit."
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
            },
            "designer": {
                "title": "Cloud Infrastructure Designer",
                "subtitle": "Interactive sandbox to architect AWS/Azure topologies, calculate costs, and generate Terraform/Ansible IaC configurations.",
                "provider": "Cloud Provider",
                "clear": "Clear Canvas",
                "simulate": "Simulate Traffic",
                "stopSimulate": "Stop Simulation",
                "catalog": "Resource Catalog",
                "canvas": "Architecture Canvas",
                "emptyCanvas": "Click icons in the sidebar to add resources to your cloud topology.",
                "costCalculator": "Real-time Cost Calculator",
                "hourly": "Hourly Estimate",
                "monthly": "Monthly Estimate",
                "iacTitle": "Infrastructure as Code (IaC) Exporter",
                "iacSubtitle": "Generated configurations based on your active canvas topology.",
                "auditorTitle": "Architecture Security & Design Auditor",
                "auditorEmpty": "No issues found! Your architecture looks well-designed.",
                "download": "Download File",
                "copied": "Copied to clipboard!",
                "copy": "Copy to Clipboard",
                "settings": "Resource Settings",
                "close": "Close",
                "delete": "Delete Resource",
                "warnings": {
                    "noDatabase": "Warning: Web servers have no database connection.",
                    "noCompute": "Warning: Public Load Balancer has no target compute nodes to forward traffic.",
                    "publicDatabase": "Caution: Database server has a public IP address. In production, keep it in a private subnet.",
                    "openS3": "Caution: S3 storage bucket is set to public read-access."
                }
            }
        }
    },
    ja: {
        translation: {
            "copilot": {
                "title": "Anim's AI コパイロット",
                "subtitle": "インタラクティブ採用アシスタント",
                "status": "オンライン",
                "placeholder": "スキル、職歴、資格など...",
                "greet": "こんにちは！アニムのAIコパイロットです。彼の経歴や資格、プロジェクトについて何でも聞いてください！",
                "suggested": {
                    "certs": "どんな資格を持っていますか？",
                    "skills": "得意な技術は何ですか？",
                    "experience": "現在はどこで働いていますか？",
                    "ai": "AI開発について教えてください。"
                }
            },
            "nav": {
                "home": "ホーム",
                "about": "自己紹介",
                "experience": "経歴",
                "devBlog": "開発ブログ",
                "photography": "写真",
                "memory": "メモリー",
                "designer": "クラウド設計"
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
                "viewGallery": "ギャラリーを見る",
                "terminalTitle": "開発コンソール (インタラクティブ)",
                "terminalSubtitle": "Red Hat 認定エンジニアのスキルや Ansible 設定をシミュレーション環境で探索"
            },
            "about": {
                "title": "私に",
                "me": "ついて",
                "subtitle": "私の人物像について",
                "bio": "こんにちは！ Anim Akash です。現在、東京を拠点とするコンサルタントおよびフルスタックソフトウェアエンジニアです。深いインフラストラクチャやデータエンジニアリングから、モダンなフロントエンドエクスペリエンスの構築に至るまでのバックグラウンドを持ち、大規模な環境で機能する回復力のあるフルスタックシステムの設計を専門としています。最近アバナードに入社し、強力なデータパイプラインとクラウド アプリケーションを構築しています。それ以前は、Business Architects Inc. に数年間勤務し、重要なインフラストラクチャの設計とフロントエンド開発チームの指揮に携わりました。従来のWeb開発にとどまらず、ソフトウェアエンジニアリングとAIの交差点に深い関心を持ち、AIエージェント、セマンティックカーネル、先進的なアーキテクチャなどを探求しています。",
                "role": "チームリード（コンサルタント）- フルスタック開発",
                "certifications": "資格",
                "focusAreas": "専門分野",
                "githubTitle": "GitHub",
                "githubActivity": "アクティビティ",
                "githubSubtitle": "コーディングの日々",
                "github": {
                    "total": "合計アクティビティ",
                    "currentStreak": "現在の継続日数",
                    "longestStreak": "最長継続日数",
                    "activeDays": "アクティブ日数",
                    "loading": "GitHubデータを読み込み中...",
                    "error": "GitHubデータの読み込みに失敗しました。",
                    "days": "日",
                    "commits": "回"
                },
                "certVault": {
                    "title": "保有資格",
                    "subtitle": "ホログラフィック資格保管庫",
                    "desc": "3Dの反射する証明書カードを操作できます。カードをクリックすると裏返り、詳細情報と確認用リンクが表示されます。",
                    "cardFlipPrompt": "クリックして裏返す",
                    "certId": "資格証明 ID",
                    "date": "取得日",
                    "score": "スコア",
                    "skills": "検証されたスキル",
                    "verify": "資格を検証する"
                },
                "certificationsList": {
                    "rhce": {
                        "name": "Red Hat 認定エンジニア (RHCE)",
                        "score": "300/300 (満点)",
                        "skills": {
                            "0": "Ansible自動化構築",
                            "1": "システムスクリプト",
                            "2": "サービス設定",
                            "3": "セキュリティ管理"
                        }
                    },
                    "rhcsa": {
                        "name": "Red Hat 認定システム管理者 (RHCSA)",
                        "score": "300/300 (満点)",
                        "skills": {
                            "0": "基本的なCLIツール",
                            "1": "ストレージ管理",
                            "2": "ユーザー管理",
                            "3": "システムセキュリティ"
                        }
                    },
                    "azure_fund": {
                        "name": "Microsoft Certified: Azure Fundamentals",
                        "score": "合格",
                        "skills": {
                            "0": "クラウドコンピューティングの概念",
                            "1": "Azureのアーキテクチャとサービス",
                            "2": "Azureのセキュリティとガバナンス"
                        }
                    },
                    "azure_ai": {
                        "name": "Microsoft Certified: Azure AI Fundamentals",
                        "score": "合格",
                        "skills": {
                            "0": "AIおよび機械学習のワークロード",
                            "1": "Azure OpenAIとコグニティブサービス",
                            "2": "責任あるAIの原則"
                        }
                    },
                    "aws": {
                        "name": "AWS 認定ソリューションアーキテクト – アソシエイト",
                        "score": "815/1000 (合格分数: 720)",
                        "skills": {
                            "0": "VPCインフラ設計",
                            "1": "サーバーレス構成 (Lambda/S3)",
                            "2": "高可用性・耐障害性設計",
                            "3": "IAMセキュリティガバナンス"
                        }
                    },
                    "jlpt": {
                        "name": "日本語能力試験 (JLPT) N2",
                        "score": "合格",
                        "skills": {
                            "0": "ビジネス日本語会話",
                            "1": "読解・文章理解",
                            "2": "高度な漢字と語彙力"
                        }
                    }
                }
            },
            "experience": {
                "title": "これまでの",
                "journey": "道のり",
                "subtitle": "私がここに至るまでの歩み",
                "roles": {
                    "0": { "role": "チームリード（コンサルタント）- フルスタック開発", "company": "Avanade", "description": "大手ガス生産会社におけるLNG関連トレーディングシステムのフルスタックエンジニア。コアデータパイプラインおよびデータ取り込みワークフローの設計を担当。高品質で信頼性の高いアプリケーションパフォーマンスを保証するため、統合・システム・回帰テストの設計と実装を主導。Microsoft AI Lab神戸および川崎重工業のロボットアーム関連システムのアプリケーションデベロッパー（クラウド）。システム全体をあるAzureテナントから別のテナントへ移行・転送する作業を主導。電力・エネルギー会社のサプライチェーンシステムにおける日次・月次の運用保守チームのサブチームリードとして従事。" },
                    "1": { "role": "システムエンジニア", "company": "株式会社ビジネス・アーキテクツ", "description": "複数顧客向けの本サイトリニューアルにおけるインフラおよびバックエンドエンジニア。ショッピングモールシステムのインフラリニューアルの設計およびシステム信頼性確保のための負荷テストを主導。セキュリティサービスサイトリニューアルにおけるフロントエンドエンジニアのチームリードを担当。金融サービスサイトリニューアルにおけるフロントエンドエンジニアのサブチームリードとして従事。銀行サービスサイトリニューアルにフロントエンドエンジニアとして貢献。日本の鉄道会社の広告プラットフォームの運用保守サポートを担当し、Amazon Linux 2からAmazon Linux 3へのカーネルアップグレード、月次メンテナンス、およびシステム監視を管理。" },
                    "2": { "role": "フリーランス ソフトウェア エンジニア", "company": "株式会社ビジネス・アーキテクツ", "description": "バックエンドおよびインフラエンジニア。社内SaaSシステムのメインバックエンドエンジニアとして従事。カスタム管理画面連携システムやコメント・ロールベースの連携システムを開発。AWS上のインフラストラクチャのデプロイ、管理、保守。要件定義から開発までのフルライフサイクルに参画し、本番移行後のシステム管理・保守を継続。" },
                    "3": { "role": "研修生", "company": "独立行政法人国際協力機構（JICA）", "description": "熟練の言語専門家との直接的な協働を通じて、日本のビジネス・マナーと語学の学習に従事。" },
                    "4": { "role": "ティーチング・アシスタント", "company": "アメリカン・インターナショナル・ユニバーシティー・バングラデシュ", "description": "OpenGLに特化したコンピュータ・グラフィックス実験講座の教育補助を行い、参加学生の技術的基礎力の向上に積極的に貢献。" }
                },
                "pipeline": {
                    "title": "データエンジニアリング",
                    "subtitle": "インタラクティブ・データパイプライン・シミュレーター",
                    "desc": "アニムのエンタープライズアーキテクチャ設計の経験をモデルにした、高速なデータ取り込み、検証、変換、ストレージシステムのシミュレーションです。",
                    "controls": {
                        "title": "パイプライン操作",
                        "start": "ストリーム再開",
                        "pause": "ストリーム一時停止",
                        "speed": "データ入力速度 (msg/秒)",
                        "errorRate": "エラー注入率 (%)",
                        "injectSchema": "スキーマエラー注入",
                        "injectTimeout": "タイムアウトエラー注入",
                        "injectDedup": "重複排除スパイク注入",
                        "clearTerminal": "ログクリア"
                    },
                    "metrics": {
                        "title": "リアルタイム指標",
                        "ingested": "取り込み済",
                        "processed": "処理済",
                        "success": "正常処理率",
                        "latency": "平均レイテンシ",
                        "dlq": "DLQエラー数",
                        "backpressure": "バックプレッシャー"
                    },
                    "nodeDetail": {
                        "title": "コンポーネント詳細",
                        "selectNode": "パイプラインの各ノードをクリックすると、技術仕様やコードのハイライト、アニムの実際の実装経験が表示されます。",
                        "techSpecs": "技術仕様・診断",
                        "animExp": "アニムの実装実績"
                    },
                    "stages": {
                        "ingestion": "インジェクション (取り込み)",
                        "validation": "バリデーション (検証)",
                        "transformation": "トランスフォーム (変換)",
                        "storage": "ストレージ (保存)"
                    },
                    "nodes": {
                        "iot": {
                            "name": "LNG取引トランザクション",
                            "tech": "世界各地の取引システムから送られる、取引の約定、貨物の配送スケジュール、財務取引などのトランザクション情報をリアルタイムにシミュレートします。",
                            "animExp": "アバナードにて、大手ガス会社向けLNG取引データ取り込みのため、取引トランザクションと基本情報を結合・突合する処理ロジックを実装しました。"
                        },
                        "api": {
                            "name": "サプライチェーン APIゲートウェイ",
                            "tech": "電力・エネルギーサプライチェーンの物流データや在庫状況、稼働状況などを、トークン検証や流量制御付きのHTTP Webhookで安全に取り込みます。",
                            "animExp": "株式会社ビジネス・アーキテクツにて、高負荷に耐える安全なWebフックハンドラやAPIゲートウェイ、EC・金融ポータル向けのバックエンドシステム設計を担当しました。"
                        },
                        "cdc": {
                            "name": "トランザクションDB CDC",
                            "tech": "Debeziumを介してPostgresやSQL Serverデータベースのコミットログを解析し、取引記録の変更（CDC）を低遅延で同期します。",
                            "animExp": "アバナードにて、ロボットアーム制御システムのAzureマルチテナント移行を主導し、データベースとデータソースのセキュアな同期と移行を管理しました。"
                        },
                        "schema": {
                            "name": "スキーマレジストリ",
                            "tech": "メッセージペイロードのスキーマを厳密なApache Avro定義に照らし合わせて検証します。無効なJSONは即座に除外されます。",
                            "animExp": "アバナードにて、データの整合性を保証するために、統合テストおよび回帰テストスイートを設計し、スキーマ定義の厳密な検証と品質管理を徹底しました。"
                        },
                        "dedup": {
                            "name": "重複排除デデュープ",
                            "tech": "高速なRedisクラスター内のスライディングウィンドウキャッシュを使用して、重複するメッセージIDをフィルタリングします。",
                            "animExp": "フリーランスのバックエンド開発時に、社内SaaS向けにカスタム権限管理や、データ重複防止を考慮した書き込み処理ロジックを実装しました。"
                        },
                        "compliance": {
                            "name": "コンプライアンスガード",
                            "tech": "テキストフィールド内のPII（個人情報）を検査し、クラウドへ送信する前に機密データをマスクします。",
                            "animExp": "金融やセキュリティサービスのリニューアルプロジェクトで開発リードを務め、機密データ保護などのセキュリティ基準に準拠したシステムを設計しました。"
                        },
                        "joiner": {
                            "name": "ストリーミング結合",
                            "tech": "トランザクションイベントストリームを静的なディメンションデータベースキャッシュと結合し、リアルタイムでデータを拡張します。",
                            "animExp": "アバナードにて、大手ガス会社向けLNG取引データ取り込みのため、取引トランザクションと基本情報を結合・突合する処理ロジックを実装しました。"
                        },
                        "aggregator": {
                            "name": "集計エンジン",
                            "tech": "指標を1分間のタンブリングウィンドウにグループ化し、移動平均、合計値、トラフィックピークを計算します。",
                            "animExp": "アバナードにて、電力・エネルギー会社向けサプライチェーンシステムの日次・月次バッチ集計および監視の運用保守チームを率いました。"
                        },
                        "anomaly": {
                            "name": "異常検知器",
                            "tech": "ストリーム入力に対して統計分析（Zスコア）を使用し、スパイクや予期しないデータの切断を検出します。",
                            "animExp": "株式会社ビジネス・アーキテクツにて、広告プラットフォーム of システム監視体制を構築し、アクセス異常やサーバーエラーの早期検知を実現しました。"
                        },
                        "datalake": {
                            "name": "S3 データレイク",
                            "tech": "生メッセージを圧縮されたApache Parquet形式に圧縮し、AWS S3パーティションに保存します。",
                            "animExp": "株式会社ビジネス・アーキテクツにて、SaaSや顧客システムの基盤としてAWS上のセキュアなクラウドストレージの構築・管理を担当しました。"
                        },
                        "snowflake": {
                            "name": "Snowflake DWH",
                            "tech": "クレンジングされたイベントをビジネスインテリジェンス、レポート、ダッシュボードクエリ用の分析テーブルにロードします。",
                            "animExp": "アバナードにて、LNG取引やエネルギー関連レポートの生成を支えるデータウェアハウスおよび分析用スキーマ設計に関与しました。"
                        },
                        "cache": {
                            "name": "PostgreSQL キャッシュ",
                            "tech": "最新のシステム状態を維持するホットデータベースレプリカ。WebアプリのダッシュボードやリアルタイムAPIの基盤となります。",
                            "animExp": "インフラ運用において、データベース接続の安定化のほか、Amazon Linux 2から3へのカーネル更新や負荷テストを主導しました。"
                        },
                        "dlq": {
                            "name": "デッドレターキュー (DLQ)",
                            "tech": "破損、不正、またはタイムアウトしたイベントを隔離します。手動での検査や再試行に備えて保持されます。",
                            "animExp": "電力・エネルギーシステムの運用保守サブチームリードとして、エラー検知時のアラート通知とトラブルシューティング手順を整備しました。"
                        }
                    }
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
            "terminal": {
                "welcome": "AnimOS v1.0.0 (zsh-sandbox) へようこそ\n認定資格: Red Hat 認定エンジニア (RHCE) #200-244-934 (満点 300/300)\n\n'help' で利用可能なコマンド一覧が表示されます。\n'snake' または 'tetris' でレトロゲームをプレイできます！\n'guestbook sign' でゲストブックに署名を残せます。\n",
                "prompt": "anim@animos:~ $ ",
                "helpText": "利用可能なコマンド:\n  ls                      ディレクトリの内容を表示\n  cd [dir]                ディレクトリの移動\n  cat [file]              ファイル内容を表示\n  neofetch                システム情報と認定資格を表示\n  ansible-playbook [file] 模擬 Ansible プレイブックを実行\n  theme [theme-name]      ターミナルの配色テーマを変更\n  guestbook               ゲストブックの閲覧・記帳\n  snake                   レトロな ASCII スネークゲームをプレイ\n  tetris                  レトロな ASCII テトリスゲームをプレイ\n  sudo rhce               Red Hat 認定の秘密情報を実行\n  history                 実行したコマンド履歴を表示\n  clear                   画面をクリア\n  help                    このヘルプメッセージを表示",
                "cmdNotFound": "コマンドが見つかりません: ",
                "noSuchFile": "ファイルまたはディレクトリが見つかりません: ",
                "isDir": "ディレクトリです: ",
                "permissionDenied": "アクセス拒否。Anim のみが root 権限を持っています。'sudo rhce' を試してみてください！",
                "themeChanged": "ターミナルのテーマを以下に変更しました: ",
                "invalidTheme": "無効なテーマです。利用可能: glass, matrix, cyberpunk, amber, classic, dracula, solarized, synthwave, light。",
                "playbookSimulating": "Ansible プレイブックのシミュレーションを開始しています...",
                "playbookSuccess": "Ansible プレイブックの実行が正常に終了しました。",
                "usagePlaybook": "使用法: ansible-playbook playbooks/deploy_skills.yml",
                "bioTitle": "=== 略歴 ===",
                "contactTitle": "=== 連絡先 ===",
                "skillsTitle": "=== スキルカテゴリ ===",
                "certsTitle": "=== プロフェッショナル認定資格 ===",
                "guestbookHelp": "使用法: guestbook [list|sign|clear]",
                "guestbookTitle": "=== ゲストブック ===",
                "guestbookNoEntries": "署名が見つかりません。'guestbook sign' で最初の署名を残しましょう！",
                "gbEnterName": "名前を入力してください: ",
                "gbEnterCompany": "会社名 / 役職を入力してください: ",
                "gbEnterMessage": "メッセージを入力してください: ",
                "gbSignedSuccess": "ゲストブックへのご署名ありがとうございました！",
                "gbCleared": "ゲストブックの署名が正常に消去されました。",
                "snakeTitle": "=== レトロ CLI スネークゲーム ===",
                "snakeInstructions": "矢印キーまたは WASD キーで操作します。'q' で終了します。",
                "snakeScore": "スコア: ",
                "snakeHighScore": "  ハイスコア: ",
                "snakeGameOver": "ゲームオーバー！'r' でリスタート、'q' で終了します。",
                "tetrisTitle": "=== レトロ CLI テトリスゲーム ===",
                "tetrisInstructions": "A/D または矢印キーで移動。W または上キーで回転。S または下キーで落とす。Spaceでハードドロップ。Qで終了します。",
                "tetrisScore": "スコア: ",
                "tetrisHighScore": "  ハイスコア: ",
                "tetrisGameOver": "ゲームオーバー！'r' でリスタート、'q' で終了します。"
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
            },
            "designer": {
                "title": "クラウド・インフラ・デザイナー",
                "subtitle": "AWS/Azureのトポロジー設計、コスト計算、およびTerraform/Ansible IaC設定ファイルの自動生成ができるインタラクティブなサンドボックスです。",
                "provider": "クラウドプロバイダー",
                "clear": "キャンバスをクリア",
                "simulate": "トラフィックをシミュレート",
                "stopSimulate": "シミュレーション停止",
                "catalog": "リソースカタログ",
                "canvas": "設計キャンバス",
                "emptyCanvas": "サイドバーのアイコンをクリックして、キャンバスにリソースを追加してください。",
                "costCalculator": "リアルタイムコスト計算ツール",
                "hourly": "時間単位見積もり",
                "monthly": "月間単位見積もり",
                "iacTitle": "Infrastructure as Code (IaC) エクスポート",
                "iacSubtitle": "現在のトポロジーに基づいて自動生成された設定ファイルです。",
                "auditorTitle": "セキュリティ＆設計監査",
                "auditorEmpty": "問題は見つかりませんでした！優れたアーキテクチャ設計です。",
                "download": "ファイルをダウンロード",
                "copied": "クリップボードにコピーしました！",
                "copy": "コピーする",
                "settings": "リソース設定",
                "close": "閉じる",
                "delete": "リソース削除",
                "warnings": {
                    "noDatabase": "警告: Webサーバーがデータベースに接続されていません。",
                    "noCompute": "警告: ロードバランサーに転送先のコンピューティングノードがありません。",
                    "publicDatabase": "注意: データベースにパブリックIPが割り当てられています。本番環境ではプライベートサブネットに配置してください。",
                    "openS3": "注意: ストレージバケットが一般公開読み取りに設定されています。"
                }
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
