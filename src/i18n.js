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
                "memory": "Memory"
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
                    "0": { "role": "Consultant (Full-Stack Data & Cloud)", "company": "Avanade", "description": "Designing data pipelines and main technical flow for an LNG trading system. Serving as Application Developer for robotics systems at Microsoft AI Lab Kobe. Leading subsets of operation & maintenance teams for major electricity & energy company systems." },
                    "1": { "role": "System Engineer", "company": "Business Architects Inc.", "description": "Served as Infrastructure & Backend engineer on various renewals including a consulting service, a shopping mall, a security service, and a financial/banking platform. Handled stress testing, AWS kernel upgrades, and overall infrastructure deployment logic." },
                    "2": { "role": "Freelance Software Engineer", "company": "Business Architects Inc.", "description": "Worked as the main backend and infrastructure engineer for an in-house SaaS system. Built custom admin and role-based interaction systems, and managed AWS deployments from initial requirement definitions through production." },
                    "3": { "role": "Trainee", "company": "Japan International Cooperation Agency (JICA)", "description": "Engaged in learning Japanese business manners and language through direct collaboration with experienced linguists." },
                    "4": { "role": "Teaching Assistant", "company": "American International University-Bangladesh", "description": "Assisted in teaching a computer graphics lab course strictly focused on OpenGL, actively enhancing participating students' fundamental technical skills." }
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
                            "name": "IoT Telemetry Stream",
                            "tech": "Simulates high-velocity JSON event packets emitted from millions of edge power/energy devices.",
                            "animExp": "At Avanade, Anim designed stream ingestion for major utility grids processing telemetry messages in real-time."
                        },
                        "api": {
                            "name": "API Gateway",
                            "tech": "Ingests HTTP Webhook payloads with token validation, rate-limiting, and client-level traffic management.",
                            "animExp": "Developed RESTful webhook handlers at Business Architects Inc. for e-commerce and banking portals under high-stress periods."
                        },
                        "cdc": {
                            "name": "Database CDC",
                            "tech": "Log-based Change Data Capture parsing transactional commits from Postgres or SQL Server databases via Debezium.",
                            "animExp": "Deployed transactional CDC streams to sync database records with low-latency search caches."
                        },
                        "schema": {
                            "name": "Schema Registry",
                            "tech": "Validates message payload schemas against strict Apache Avro declarations. Bad JSON is instantly flagged.",
                            "animExp": "Configured registry validations in AWS EventBridge and Kafka environments to prevent schema drift."
                        },
                        "dedup": {
                            "name": "Deduplicator",
                            "tech": "Filters duplicate message IDs using a sliding-window cache in a high-speed Redis cluster.",
                            "animExp": "Created Redis-based idempotency filters handling 10k+ requests/sec with a 10-minute sliding window."
                        },
                        "compliance": {
                            "name": "Compliance Guard",
                            "tech": "Inspects text fields for PII (Personally Identifiable Information) and masks values before cloud ingestion.",
                            "animExp": "Built regulatory compliance filters for enterprise clients to comply with Japanese APPI regulations."
                        },
                        "joiner": {
                            "name": "Streaming Joiner",
                            "tech": "Enriches real-time transaction event streams by joining them with static dimensional database caches.",
                            "animExp": "Optimized streaming memory footprints by implementing localized in-memory cache lookups."
                        },
                        "aggregator": {
                            "name": "Aggregator",
                            "tech": "Groups metrics into 1-minute tumbling windows to calculate rolling averages, sums, and traffic peaks.",
                            "animExp": "Designed analytical aggregation pipelines that process trading volume reports."
                        },
                        "anomaly": {
                            "name": "Anomaly Detector",
                            "tech": "Uses statistical analysis (z-scores) on stream inputs to detect spikes or unexpected data drops.",
                            "animExp": "Developed monitoring heuristics at Microsoft AI Lab to alert robotics systems of sensor faults."
                        },
                        "datalake": {
                            "name": "S3 Data Lake",
                            "tech": "Compacts raw messages into compressed Apache Parquet formats, saving them in AWS S3 partitions.",
                            "animExp": "Maintained petabyte-scale data lakes with automated lifecycle policies and Athena integration."
                        },
                        "snowflake": {
                            "name": "Snowflake DW",
                            "tech": "Loads cleansed events into analytics tables for business intelligence, reporting, and dashboard querying.",
                            "animExp": "Built Snowflake DBT models for energy trading reports at Avanade, speeding up query times by 40%."
                        },
                        "cache": {
                            "name": "PostgreSQL Cache",
                            "tech": "Hot database replica maintaining the latest system state, powering web app dashboards and real-time APIs.",
                            "animExp": "Configured highly available Postgres read-replicas with pgpool load balancing at Business Architects Inc."
                        },
                        "dlq": {
                            "name": "Dead Letter Queue",
                            "tech": "Quarantines bad, malformed, or timed-out events. Holds them for manual inspection and re-driving.",
                            "animExp": "Set up SQS Dead Letter Queues with CloudWatch alert triggers to notify teams of processing anomalies."
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
                "memory": "メモリー"
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
                    "0": { "role": "コンサルタント (フルスタックデータ＆クラウド)", "company": "Avanade", "description": "LNGトレーディングシステムのためのデータパイプラインとメインの技術フローを設計。Microsoft AI Lab 神尾でロボティクスシステムのアプリケーション開発者として従事。大手電力・エネルギー会社のシステムにおける運用保守チームのサブセットを指揮。" },
                    "1": { "role": "システムエンジニア", "company": "株式会社ビジネス・アーキテクツ", "description": "コンサルティングサービス、ショッピングモール、セキュリティサービス、金融・銀行プラットフォームなど、各種リニューアルにおけるインフラ・バックエンドエンジニアとして従事。負荷テスト、AWSカーネルのアップグレード、インフラ展開ロジック全般を担当。" },
                    "2": { "role": "フリーランス ソフトウェア エンジニア", "company": "株式会社ビジネス・アーキテクツ", "description": "社内SaaSシステムのメインバックエンドおよびインフラストラクチャー・エンジニアとして従事。カスタム管理システムおよびロールベースのインタラクションシステムを構築し、初期要件定義から本番環境までのAWSデプロイメントを管理。" },
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
                            "name": "IoT テレメトリ ストリーム",
                            "tech": "数百万台のエッジ電力・エネルギーデバイスから送信される高速なJSONイベントパケットをシミュレートします。",
                            "animExp": "アバナードにおいて、電力会社のグリッドシステム向けにテレメトリメッセージをリアルタイムで処理するストリームインジェクションを設計しました。"
                        },
                        "api": {
                            "name": "API ゲートウェイ",
                            "tech": "トークン検証、レート制限、クライアントレベルのトラフィック管理を備えたHTTPウェブフックのペイロードを処理します。",
                            "animExp": "株式会社ビジネス・アーキテクツにて、高負荷時のECおよび金融ポータル向けのRESTfulウェブフックハンドラを開発しました。"
                        },
                        "cdc": {
                            "name": "データベース CDC",
                            "tech": "Debeziumを介してPostgresやSQL Serverデータベースからのトランザクションコミットをログベースで解析します。",
                            "animExp": "データベースレコードを低遅延検索キャッシュと同期するためのトランザクションCDCストリームを展開しました。"
                        },
                        "schema": {
                            "name": "スキーマレジストリ",
                            "tech": "メッセージペイロードのスキーマを厳密なApache Avro定義に照らし合わせて検証します。無効なJSONは即座に除外されます。",
                            "animExp": "スキーマの不一致を防ぐため、AWS EventBridgeおよびKafka環境でレジストリ検証を構成しました。"
                        },
                        "dedup": {
                            "name": "重複排除デデュープ",
                            "tech": "高速なRedisクラスター内のスライディングウィンドウキャッシュを使用して、重複するメッセージIDをフィルタリングします。",
                            "animExp": "10分間のスライディングウィンドウで、毎秒1万件以上のリクエストを処理するRedisベースのべき等性フィルターを作成しました。"
                        },
                        "compliance": {
                            "name": "コンプライアンスガード",
                            "tech": "テキストフィールド内のPII（個人情報）を検査し、クラウドへ送信する前に機密データをマスクします。",
                            "animExp": "日本の個人情報保護法（APPI）に準拠するため、エンタープライズ顧客向けのコンプライアンスフィルターを構築しました。"
                        },
                        "joiner": {
                            "name": "ストリーミング結合",
                            "tech": "トランザクションイベントストリームを静的なディメンションデータベースキャッシュと結合し、リアルタイムでデータを拡張します。",
                            "animExp": "ローカライズされたインメモリキャッシュルックアップを実装することで、ストリーミング時のメモリフットプリントを最適化しました。"
                        },
                        "aggregator": {
                            "name": "集計エンジン",
                            "tech": "指標を1分間のタンブリングウィンドウにグループ化し、移動平均、合計値、トラフィックピークを計算します。",
                            "animExp": "取引量レポートを処理する分析用の集計パイプラインを設計しました。"
                        },
                        "anomaly": {
                            "name": "異常検知器",
                            "tech": "ストリーム入力に対して統計分析（Zスコア）を使用し、スパイクや予期しないデータの切断を検出します。",
                            "animExp": "Microsoft AI Labにて、ロボティクスシステムのセンサー障害を監視・警告する検出プログラムを開発しました。"
                        },
                        "datalake": {
                            "name": "S3 データレイク",
                            "tech": "生メッセージを圧縮されたApache Parquet形式に圧縮し、AWS S3パーティションに保存します。",
                            "animExp": "自動ライフサイクルポリシーとAthena統合を備えたペタバイト規模のデータレイクを管理しました。"
                        },
                        "snowflake": {
                            "name": "Snowflake DWH",
                            "tech": "クレンジングされたイベントをビジネスインテリジェンス、レポート、ダッシュボードクエリ用の分析テーブルにロードします。",
                            "animExp": "アバナードにてエネルギー取引レポート用のSnowflake DBTモデルを構築し、クエリ処理速度を40%向上させました。"
                        },
                        "cache": {
                            "name": "PostgreSQL キャッシュ",
                            "tech": "最新のシステム状態を維持するホットデータベースレプリカ。WebアプリのダッシュボードやリアルタイムAPIの基盤となります。",
                            "animExp": "株式会社ビジネス・アーキテクツにて、pgpoolによる負荷分散を備えた高可用性Postgresリードレプリカを構成しました。"
                        },
                        "dlq": {
                            "name": "デッドレターキュー (DLQ)",
                            "tech": "破損、不正、またはタイムアウトしたイベントを隔離します。手動での検査や再試行に備えて保持されます。",
                            "animExp": "SQSデッドレターキューを設定し、処理異常が発生した際にチームへ通知するCloudWatchアラートを構成しました。"
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
