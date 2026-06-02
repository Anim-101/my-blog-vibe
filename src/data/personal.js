export const personalInfo = {
    name: "Anim Akash",
    role: "Consultant, Full-Stack Software Engineer",
    bio: "Hello! I am Anim Akash, a Consultant and Full-Stack Software Engineer currently based in Tokyo, Japan. With a background extending from deep infrastructure and data engineering to crafting modern frontend experiences, I specialize in architecting resilient, full-stack systems that thrive at scale. I recently joined Avanade, where I build robust data pipelines and cloud applications. Previously, I spent several years at Business Architects Inc. designing critical infrastructure and leading frontend development teams. Beyond traditional web development, I am deeply invested in the intersection of Software Engineering and Artificial Intelligence, frequently exploring AI agents, Semantic Kernel, and advanced architectures.",
    certifications: [
        {
            id: 'rhce',
            name: 'Red Hat Certified Engineer (RHCE)',
            score: '300/300',
            date: 'Nov 2020',
            certId: '200-244-934',
            verifyUrl: 'https://www.credly.com/badges/dbf9d854-47be-4395-816b-ce3e66050b1d',
            skills: ['Ansible Automation', 'System Scripting', 'Service Configuration', 'Security Administration'],
            color: '#e53e3e' // Red Hat Red
        },
        {
            id: 'rhcsa',
            name: 'Red Hat Certified System Administrator (RHCSA)',
            score: '300/300',
            date: 'Oct 2020',
            certId: '200-244-934',
            verifyUrl: 'https://www.credly.com/badges/c6a6f44d-d779-43c3-888e-6705663bd631',
            skills: ['Essential CLI Tools', 'Storage Management', 'User Administration', 'System Security'],
            color: '#c53030' // Dark Red Hat Red
        },
        {
            id: 'aws',
            name: 'AWS Certified Solutions Architect – Associate',
            score: '815/1000',
            date: 'May 2023',
            certId: 'Z4D9R1K2BJQQ1S5G',
            verifyUrl: 'https://www.credly.com/badges/b784fa78-d4fa-4ce6-a70d-ce0b2848ca12', // standard credly badge
            skills: ['VPC Architecture', 'Serverless (Lambda/S3)', 'High Availability', 'IAM Governance'],
            color: '#ff9900' // AWS Gold/Orange
        },
        {
            id: 'jlpt',
            name: 'Japanese Language Proficiency Test (JLPT) N2',
            score: 'Passed',
            date: 'Dec 2021',
            certId: 'N2-2112-98401',
            verifyUrl: 'https://www.jlpt.jp',
            skills: ['Business Japanese Communication', 'Reading Comprehension', 'Advanced Kanji & Vocabulary'],
            color: '#2b6cb0' // JLPT Blue
        }
    ],
    expertise: [
        "Full-Stack Web Development",
        "Data Engineering & Cloud (AWS)",
        "AI Agents (SemanticKernel, AutoGen)",
        "OS Development",
        "Blockchain Development"
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
        role: "Consultant (Full-Stack Data & Cloud)",
        company: "Avanade",
        period: "Mar 2025 - Present",
        description: "Designing data pipelines and main technical flow for an LNG trading system. Serving as Application Developer for robotics systems at Microsoft AI Lab Kobe. Leading subsets of operation & maintenance teams for major electricity & energy company systems.",
        technologies: ["Data Engineering", "Cloud Systems", "Microservices"]
    },
    {
        id: 1,
        role: "System Engineer",
        company: "Business Architects Inc.",
        period: "Apr 2022 - Feb 2025",
        description: "Served as Infrastructure & Backend engineer on various renewals including a consulting service, a shopping mall, a security service, and a financial/banking platform. Handled stress testing, AWS kernel upgrades, and overall infrastructure deployment logic.",
        technologies: ["AWS", "Infrastructure", "Backend", "Frontend", "Linux"]
    },
    {
        id: 2,
        role: "Freelance Software Engineer",
        company: "Business Architects Inc.",
        period: "Oct 2020 - Mar 2022",
        description: "Worked as the main backend and infrastructure engineer for an in-house SaaS system. Built custom admin and role-based interaction systems, and managed AWS deployments from initial requirement definitions through production.",
        technologies: ["Node.js", "SaaS Architecture", "AWS", "Backend Design"]
    },
    {
        id: 3,
        role: "Trainee",
        company: "Japan International Cooperation Agency (JICA)",
        period: "Feb 2020 - Aug 2020",
        description: "Engaged in learning Japanese business manners and language through direct collaboration with experienced linguists.",
        technologies: ["Japanese Language", "Business Culture Adaptation"]
    },
    {
        id: 4,
        role: "Teaching Assistant",
        company: "American International University-Bangladesh",
        period: "Mar 2018 - Apr 2018",
        description: "Assisted in teaching a computer graphics lab course strictly focused on OpenGL, actively enhancing participating students' fundamental technical skills.",
        technologies: ["OpenGL", "Computer Graphics", "Mentoring"]
    }
];
