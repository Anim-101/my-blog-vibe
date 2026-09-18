export const personalInfo = {
    name: "Anim Akash",
    role: "Team Lead (Consultant) - Full-Stack Development",
    bio: "Hello! I am Anim Akash, a Consultant and Full-Stack Software Engineer currently based in Tokyo, Japan. With a background extending from deep cloud infrastructure and legacy Unisys mainframe modernization to crafting modern full-stack applications, I specialize in architecting resilient systems at scale. Currently at Avanade Japan, I lead mainframe modernization software engineering and core data pipeline architectures. Previously, I spent several years at Business Architects Inc. designing critical AWS infrastructure, leading engineering teams, and building SaaS platforms. Beyond traditional development, I actively explore Agentic AI architectures, LLM tooling, and cloud automation.",
    certifications: [
        {
            id: 'claude_code',
            name: 'Anthropic: Claude Code 101',
            score: 'Passed',
            date: 'Jun 2026',
            certId: 'i4e7owvqo5um',
            verifyUrl: 'https://www.anthropic.com',
            skills: ['Claude Code CLI', 'Agentic Workflows', 'Automated Refactoring', 'AI Pair Programming'],
            color: '#d97706' // Amber / Anthropic Gold
        },
        {
            id: 'claude_101',
            name: 'Anthropic: Claude 101',
            score: 'Passed',
            date: 'Apr 2026',
            certId: 'w9e6psj2vq5r',
            verifyUrl: 'https://www.anthropic.com',
            skills: ['Prompt Engineering', 'Context Optimization', 'System Directives', 'LLM Architectures'],
            color: '#b45309' // Dark Amber
        },
        {
            id: 'agent_skills',
            name: 'Anthropic: Introduction to Agent Skills',
            score: 'Passed',
            date: 'Mar 2026',
            certId: '4co72t6vw2nk',
            verifyUrl: 'https://www.anthropic.com',
            skills: ['Agentic Tools Design', 'Autonomous Execution', 'Tool Protocol Specs', 'Multi-Agent Coordination'],
            color: '#92400e' // Bronze
        },
        {
            id: 'rhce',
            name: 'Red Hat Certified Engineer (RHCE)',
            score: '300/300',
            date: 'Jan 2019',
            certId: '200-244-934',
            verifyUrl: 'https://www.credly.com/badges/dbf9d854-47be-4395-816b-ce3e66050b1d',
            skills: ['Ansible Automation', 'System Scripting', 'Service Configuration', 'Security Administration'],
            color: '#e53e3e' // Red Hat Red
        },
        {
            id: 'rhcsa',
            name: 'Red Hat Certified System Administrator (RHCSA)',
            score: '300/300',
            date: 'Jan 2019',
            certId: '200-244-934',
            verifyUrl: 'https://www.credly.com/badges/c6a6f44d-d779-43c3-888e-6705663bd631',
            skills: ['Essential CLI Tools', 'Storage Management', 'User Administration', 'System Security'],
            color: '#c53030' // Dark Red Hat Red
        },
        {
            id: 'azure_fund',
            name: 'Microsoft Certified: Azure Fundamentals',
            score: 'Passed',
            date: 'Oct 2025',
            certId: '5557BC1D6AE9196D',
            verifyUrl: 'https://learn.microsoft.com',
            skills: ['Cloud Computing Concepts', 'Azure Architecture & Services', 'Azure Security & Governance'],
            color: '#008ad7' // Azure Blue
        },
        {
            id: 'azure_ai',
            name: 'Microsoft Certified: Azure AI Fundamentals',
            score: 'Passed',
            date: 'Dec 2025',
            certId: '8D46C06FA0724D2C',
            verifyUrl: 'https://learn.microsoft.com',
            skills: ['AI & Machine Learning Workloads', 'Azure OpenAI & Cognitive Services', 'Responsible AI Principles'],
            color: '#00a4ef' // Azure Light Blue
        },
        {
            id: 'aws',
            name: 'AWS Certified Solutions Architect – Associate',
            score: '815/1000',
            date: 'Jan 2024',
            certId: 'Z4D9R1K2BJQQ1S5G',
            verifyUrl: 'https://www.credly.com/badges/b784fa78-d4fa-4ce6-a70d-ce0b2848ca12',
            skills: ['VPC Architecture', 'Serverless (Lambda/S3)', 'High Availability', 'IAM Governance'],
            color: '#ff9900' // AWS Gold/Orange
        },
        {
            id: 'jlpt',
            name: 'Japanese Language Proficiency Test (JLPT) N2',
            score: 'Passed',
            date: 'Jan 2024',
            certId: 'N2-2112-98401',
            verifyUrl: 'https://www.jlpt.jp',
            skills: ['Business Japanese Communication', 'Reading Comprehension', 'Advanced Kanji & Vocabulary'],
            color: '#2b6cb0' // JLPT Blue
        }
    ],
    expertise: [
        "Mainframe Modernization (Unisys AMT)",
        "Full-Stack Software Engineering (React, C#, Python, Django)",
        "Data Engineering & Data Pipelines (Azure, AWS)",
        "DevOps & Infrastructure Automation (Terraform, Ansible, Linux AL2/AL3)",
        "Agentic AI Systems (Anthropic Claude, Semantic Kernel)"
    ],
    socialLinks: {
        github: "https://github.com/Anim-101",
        linkedin: "https://www.linkedin.com/in/anim-101",
        email: "anmaksh@gmail.com"
    }
};

export const experiences = [
    {
        id: 0,
        role: "Team Lead (Consultant) - Full-Stack Development",
        company: "Avanade",
        period: "Mar 2025 - Present",
        description: "AMT Mainframe Migration Software Engineer on a high-impact modernization project for a major Japanese enterprise client, migrating legacy Unisys mainframe architectures to open cloud environments ahead of end-of-support deadlines while collaborating across global delivery teams (Netherlands, England, Japan). Full-Stack Engineer for an LNG trading system at a major gas producer, designing core data ingestion workflows and leading integration, system, and regression testing. Led a complete Azure tenant-to-tenant cloud migration for Microsoft AI Lab Kobe and Kawasaki Heavy Industries' robotic arm systems. Sub-Team Lead for daily/monthly O&M operations of a major utility supply chain platform.",
        technologies: ["Unisys AMT Modernization", "C#", "Python", "Azure", "AWS", "Terraform", "Data Pipelines"]
    },
    {
        id: 1,
        role: "System Engineer (Infrastructure & Backend)",
        company: "Business Architects Inc.",
        period: "Apr 2022 - Feb 2025",
        description: "Infrastructure & Backend Engineering Lead contributing to web portal renewals across multiple enterprise clients. Designed and implemented infrastructure renewals and automated load/stress testing for a major shopping mall system. Served as Frontend Engineering Team Lead for a security service portal renewal, Sub-Team Lead for a financial service website renewal, and core Frontend Engineer for a banking platform renewal. Managed operations, monthly maintenance, and Amazon Linux 2 to Amazon Linux 3 OS kernel upgrades for a Japanese railway system advertising platform.",
        technologies: ["React.js", "MySQL", "AWS", "Infrastructure Design", "Linux (AL2/AL3)", "Load Testing"]
    },
    {
        id: 2,
        role: "Freelance Software Engineer",
        company: "Business Architects Inc.",
        period: "Oct 2020 - Mar 2022",
        description: "Primary Backend and Infrastructure Engineer for an in-house SaaS platform. Designed custom administrative interaction systems, role-based comment engines, and security access controls. Deployed, configured, and maintained production cloud infrastructure on AWS across the entire SDLC from requirements definition to post-launch maintenance.",
        technologies: ["Python", "Django REST Framework", "Node.js", "AWS", "Database Design", "SaaS Architecture"]
    },
    {
        id: 3,
        role: "Trainee",
        company: "Japan International Cooperation Agency (JICA)",
        period: "Feb 2020 - Aug 2020",
        description: "Completed intensive training in Japanese business manners, corporate culture, and language communication through direct collaboration with experienced linguists.",
        technologies: ["Japanese Business Etiquette", "Corporate Communication", "JLPT N2 Preparation"]
    },
    {
        id: 4,
        role: "Teaching Assistant",
        company: "American International University-Bangladesh",
        period: "Mar 2018 - Apr 2018",
        description: "Assisted in teaching an undergraduate Computer Graphics laboratory course centered on OpenGL, C, and C++, assisting students with 3D rendering algorithms and laboratory assignments.",
        technologies: ["OpenGL", "C++", "C", "Computer Graphics", "Mentoring"]
    }
];
