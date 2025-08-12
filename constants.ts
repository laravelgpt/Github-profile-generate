
import { Skill, SectionKey, FormData, TechStack, ProjectCategory, FooterStyle, ProfileHeaderConfig, MainHeaderConfig } from './types';

export const AI_HEADER_STYLES = ['Photorealistic', 'Digital Art', 'Anime', 'Cyberpunk', 'Minimalist', '3D Render', 'Retro', 'Abstract', 'Pixel Art'];
export const AI_HEADER_EFFECTS = ['Cinematic', 'Dramatic Lighting', 'Bokeh', 'Vintage Film', 'Glow', 'Glitch', 'Long Exposure', 'Fisheye Lens'];
export const AI_HEADER_COLORS = ['Vibrant', 'Monochromatic', 'Pastel', 'Neon', 'Dark & Moody', 'Earthy Tones', 'Black and White', 'Sepia'];
export const AI_HEADER_MOTIONS = ['Dynamic', 'Serene', 'Explosive', 'Flowing', 'Static', 'Blurred', 'Warp Speed'];
export const AI_HEADER_ASPECT_RATIOS: MainHeaderConfig['aiAspectRatio'][] = ['16:9', '4:3', '1:1', '3:4', '9:16'];

export const TECH_STACK: Record<string, Skill[]> = {
  "Programming Languages": [
    { name: 'JavaScript', deviconName: 'javascript-plain' },
    { name: 'TypeScript', deviconName: 'typescript-plain' },
    { name: 'Python', deviconName: 'python-plain' },
    { name: 'Java', deviconName: 'java-plain' },
    { name: 'Go', deviconName: 'go-original-wordmark' },
    { name: 'Rust', deviconName: 'rust-plain' },
    { name: 'C++', deviconName: 'cplusplus-plain' },
    { name: 'C#', deviconName: 'csharp-plain' },
    { name: 'PHP', deviconName: 'php-plain' },
    { name: 'Ruby', deviconName: 'ruby-plain' },
    { name: 'Swift', deviconName: 'swift-plain' },
    { name: 'Kotlin', deviconName: 'kotlin-plain' },
    { name: 'Dart', deviconName: 'dart-plain' },
  ],
  "Frontend Development": [
    { name: 'React', deviconName: 'react-original' },
    { name: 'Next.js', deviconName: 'nextjs-original' },
    { name: 'Vue.js', deviconName: 'vuejs-plain' },
    { name: 'Angular', deviconName: 'angularjs-plain' },
    { name: 'Svelte', deviconName: 'svelte-plain' },
    { name: 'HTML5', deviconName: 'html5-plain' },
    { name: 'CSS3', deviconName: 'css3-plain' },
    { name: 'Sass', deviconName: 'sass-original' },
    { name: 'Tailwind CSS', deviconName: 'tailwindcss-plain' },
    { name: 'Bootstrap', deviconName: 'bootstrap-plain' },
    { name: 'Redux', deviconName: 'redux-original' },
  ],
  "Backend Development": [
    { name: 'Node.js', deviconName: 'nodejs-plain' },
    { name: 'Express', deviconName: 'express-original' },
    { name: 'Django', deviconName: 'django-plain' },
    { name: 'Flask', deviconName: 'flask-original' },
    { name: 'Ruby on Rails', deviconName: 'rails-plain' },
    { name: 'Spring', deviconName: 'spring-plain' },
  ],
  "Mobile App Development": [
    { name: 'React Native', deviconName: 'react-original' },
    { name: 'Flutter', deviconName: 'flutter-plain' },
    { name: 'Swift', deviconName: 'swift-plain' },
    { name: 'Kotlin', deviconName: 'kotlin-plain' },
    { name: 'Android', deviconName: 'android-plain' },
    { name: 'iOS', deviconName: 'apple-original' },
  ],
  "AI/ML": [
    { name: 'TensorFlow', deviconName: 'tensorflow-original' },
    { name: 'PyTorch', deviconName: 'pytorch-plain' },
    { name: 'Scikit-learn', deviconName: 'scikitlearn-plain' },
  ],
  "Database": [
    { name: 'MongoDB', deviconName: 'mongodb-plain' },
    { name: 'PostgreSQL', deviconName: 'postgresql-plain' },
    { name: 'MySQL', deviconName: 'mysql-plain' },
    { name: 'SQLite', deviconName: 'sqlite-plain' },
    { name: 'Redis', deviconName: 'redis-plain' },
  ],
  "Data Visualization": [
    { name: 'D3.js', deviconName: 'd3js-plain' },
    { name: 'Chart.js', deviconName: 'chartjs-plain' },
  ],
  "DevOps": [
    { name: 'Docker', deviconName: 'docker-plain' },
    { name: 'Kubernetes', deviconName: 'kubernetes-plain' },
    { name: 'AWS', deviconName: 'amazonwebservices-original' },
    { name: 'Google Cloud', deviconName: 'googlecloud-plain' },
    { name: 'Azure', deviconName: 'azure-plain' },
    { name: 'Git', deviconName: 'git-plain' },
    { name: 'Jenkins', deviconName: 'jenkins-line' },
    { name: 'Terraform', deviconName: 'terraform-plain' },
  ],
  "Backend as a Service (BaaS)": [
    { name: 'Firebase', deviconName: 'firebase-plain' },
    { name: 'Supabase', deviconName: 'supabase-plain' },
    { name: 'Heroku', deviconName: 'heroku-plain' },
  ],
  "Testing": [
    { name: 'Jest', deviconName: 'jest-plain' },
    { name: 'Mocha', deviconName: 'mocha-plain' },
    { name: 'Cypress', deviconName: 'cypressio-plain' },
    { name: 'Selenium', deviconName: 'selenium-original' },
  ],
  "Software": [
    { name: 'Figma', deviconName: 'figma-plain' },
    { name: 'Postman', deviconName: 'postman-plain' },
    { name: 'VS Code', deviconName: 'vscode-plain' },
  ],
  "Static Site Generators": [
    { name: 'Gatsby', deviconName: 'gatsby-plain' },
    { name: 'Jekyll', deviconName: 'jekyll-plain' },
    { name: 'Hugo', deviconName: 'hugo-plain' },
  ],
  "Game Engines": [
    { name: 'Unity', deviconName: 'unity-original' },
    { name: 'Unreal Engine', deviconName: 'unrealengine-original' },
  ],
  "Automation": [
    { name: 'GitHub Actions', deviconName: 'githubactions-plain' },
  ],
  "Other": [
    { name: 'Linux', deviconName: 'linux-plain' },
    { name: 'Webpack', deviconName: 'webpack-plain' },
    { name: 'GraphQL', deviconName: 'graphql-plain' },
  ],
};


export const PROBLEM_SOLVING_PLATFORMS = [
    { name: 'HackerRank', icon: 'hackerrank', url: 'https://www.hackerrank.com/' },
    { name: 'LeetCode', icon: 'leetcode', url: 'https://leetcode.com/u/' },
    { name: 'CodeChef', icon: 'codechef', url: 'https://www.codechef.com/users/' },
    { name: 'CodeSignal', icon: 'codesignal', url: 'https://app.codesignal.com/profile/' },
];

export const SOCIAL_PLATFORMS = [
  { name: 'GitHub', icon: 'github', color: '181717', baseUrl: 'https://github.com/' },
  { name: 'LinkedIn', icon: 'linkedin', color: '0A66C2', baseUrl: 'https://linkedin.com/in/' },
  { name: 'Twitter', icon: 'x', color: '000000', baseUrl: 'https://twitter.com/' },
  { name: 'Medium', icon: 'medium', color: '12100E', baseUrl: 'https://medium.com/@' },
  { name: 'DEV.to', icon: 'devdotto', color: '0A0A0A', baseUrl: 'https://dev.to/' },
  { name: 'Stack Overflow', icon: 'stackoverflow', color: 'F58025', baseUrl: 'https://stackoverflow.com/users/' },
  { name: 'YouTube', icon: 'youtube', color: 'FF0000', baseUrl: 'https://youtube.com/c/' },
  { name: 'Instagram', icon: 'instagram', color: 'E4405F', baseUrl: 'https://instagram.com/' },
  { name: 'Facebook', icon: 'facebook', color: '1877F2', baseUrl: 'https://www.facebook.com/' },
  { name: 'Dribbble', icon: 'dribbble', color: 'EA4C89', baseUrl: 'https://dribbble.com/' },
  { name: 'Behance', icon: 'behance', color: '1769FF', baseUrl: 'https://www.behance.net/' },
  { name: 'Website', icon: 'apollographql', color: '311C87', baseUrl: '' },
];


export const STATS_THEMES = [
    'tokyonight', 'dark', 'light', 'highcontrast', 'dracula', 'github_dark', 'radical',
    'merko', 'gruvbox', 'onedark', 'cobalt', 'synthwave', 'catppuccin_latte', 'catppuccin_mocha'
];

export const PROJECT_CATEGORIES: ProjectCategory[] = ['Static Website', 'Web Application', 'Console Application', 'GUI Application', 'Game', 'Script', 'Research', 'Live Service / API', 'Other'];

export const HEADER_BACKGROUNDS: Record<string, { name: string, group: string, svgDefs: string, fill: string, bgColor: string }> = {
    'gradient-1': { name: 'Purple Reign', group: 'Gradients', svgDefs: '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4c1d95" /><stop offset="100%" stop-color="#1e1b4b" /></linearGradient>', fill: 'url(#g)', bgColor: '#0d1117' },
    'gradient-2': { name: 'Sunset', group: 'Gradients', svgDefs: '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#be185d" /><stop offset="100%" stop-color="#5b21b6" /></linearGradient>', fill: 'url(#g)', bgColor: '#0d1117' },
    'gradient-3': { name: 'Ocean', group: 'Gradients', svgDefs: '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#047857" /><stop offset="100%" stop-color="#1d4ed8" /></linearGradient>', fill: 'url(#g)', bgColor: '#0d1117' },
    'gradient-4': { name: 'Cosmic Fusion', group: 'Gradients', svgDefs: '<radialGradient id="g"><stop offset="0%" stop-color="#3b0764" /><stop offset="100%" stop-color="#0d1117" /></radialGradient>', fill: 'url(#g)', bgColor: '#0d1117' },
    'gradient-5': { name: 'Aurora Borealis', group: 'Gradients', svgDefs: '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%"><stop stop-color="#0369a1" offset="0%"/><stop stop-color="#10b981" offset="50%"/><stop stop-color="#8b5cf6" offset="100%"/></linearGradient>', fill: 'url(#g)', bgColor: '#0d1117' },
    'gradient-6': { name: 'Neon Pulse', group: 'Gradients', svgDefs: '<linearGradient id="g" gradientTransform="rotate(45)"><stop offset="0%" stop-color="#db2777" /><stop offset="50%" stop-color="#1d4ed8" /><stop offset="100%" stop-color="#db2777" /></linearGradient>', fill: 'url(#g)', bgColor: '#0d1117' },
    'pattern-1': { name: 'Matrix', group: 'Patterns', svgDefs: '<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 0h20v20H0z" fill="none"/><path d="M20 20H0V0h20v20zM18 2H2v16h16V2zM6 6h2v2H6V6zm4 0h2v2h-2V6zm4 0h2v2h-2V6zM6 10h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H6v-2zm4 0h2v2h-2v-2z" fill="rgba(168, 85, 247, 0.1)"/></pattern>', fill: 'url(#p)', bgColor: '#0d1117' },
    'pattern-2': { name: 'Grid', group: 'Patterns', svgDefs: '<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 0 0 H 10 V 10 H 0 Z" fill="none" stroke="rgba(168, 85, 247, 0.2)" stroke-width="1"/></pattern>', fill: 'url(#p)', bgColor: '#0d1117' },
    'pattern-3': { name: 'Circuit Board', group: 'Patterns', svgDefs: '<pattern id="p" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M0 25h100M25 0v100M0 75h100M75 0v100M25 25h50v50h-50z" fill="none" stroke="rgba(168, 85, 247, 0.1)" stroke-width="2"/></pattern>', fill: 'url(#p)', bgColor: '#0d1117' },
    'pattern-4': { name: 'Polka Dots', group: 'Patterns', svgDefs: '<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(168, 85, 247, 0.2)"/></pattern>', fill: 'url(#p)', bgColor: '#0d1117' },
    'pattern-5': { name: 'Hexagons', group: 'Patterns', svgDefs: '<pattern id="p" width="30" height="26" patternUnits="userSpaceOnUse"><path d="M15 0l15 8.66v17.32l-15 8.66-15-8.66v-17.32z" fill="none" stroke="rgba(168, 85, 247, 0.15)" stroke-width="1"/></pattern>', fill: 'url(#p)', bgColor: '#0d1117' },
    'pattern-6': { name: 'Wavy', group: 'Animated', svgDefs: '<filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.01 0.04" numOctaves="3" seed="2" /></filter><pattern id="p" width="800" height="200" patternUnits="userSpaceOnUse"><rect width="800" height="200" fill="#a855f7" filter="url(#f)" opacity="0.1"/></pattern>', fill: 'url(#p)', bgColor: '#0d1117' },
    'pattern-7': { name: 'Nebula', group: 'Animated', svgDefs: '<filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" seed="10" stitchTiles="stitch"/></filter><pattern id="p" width="800" height="200" patternUnits="userSpaceOnUse"><rect width="800" height="200" fill="#5b21b6" filter="url(#f)" opacity="0.2"/></pattern>', fill: 'url(#p)', bgColor: '#0d1117' },
};

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
    'mainHeaderBanner',
    'profileHeaderBanner',
    'basicInfo',
    'myMission',
    'socials',
    'techStack',
    'githubStats',
    'githubAnalytics',
    'workExperience',
    'featuredProjects',
    'projects',
    'volunteering',
    'education',
    'certifications',
    'research',
    'awards',
    'publications',
    'talks',
    'languages',
    'hobbies',
    'hackathons',
    'problemSolving',
    'supportMe',
    'blogPosts',
    'customHtml',
    'footer',
];

const initialTechStack: TechStack = Object.keys(TECH_STACK).reduce((acc, category) => {
    acc[category] = [];
    return acc;
}, {} as TechStack);

initialTechStack['Programming Languages'] = ['JavaScript', 'Python'];
initialTechStack['Frontend Development'] = ['React', 'HTML5', 'CSS3'];
initialTechStack['Backend Development'] = ['Node.js'];
initialTechStack['DevOps'] = ['Git'];

export const INITIAL_FORM_DATA: FormData = {
    mainHeader: {
        enabled: true,
        title: 'Welcome to my Profile!',
        subtitle: 'Showcasing my journey in code',
        aiPrompt: 'A majestic cat astronaut floating in a galaxy of code, digital art',
        aiStyle: 'Digital Art',
        aiEffect: 'Cinematic',
        aiColor: 'Vibrant',
        aiMotion: 'Serene',
        aiAspectRatio: '16:9',
        generatedImageUrl: '',
    },
    profileHeader: {
        enabled: true,
        title: 'Hi 👋, I\'m',
        subtitle: 'A Passionate Developer',
        background: 'gradient-1',
    },
    resumeText: '',
    name: 'Your Name',
    githubUser: 'your-github-username',
    bio: '🚀 A passionate developer exploring the universe of code.',
    myMission: 'To leverage technology to build innovative solutions that solve real-world problems and drive positive change.',
    techStack: initialTechStack,
    skillStyle: 'badge',
    badgeColor: 'a855f7',
    socials: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/your-profile', icon: 'linkedin' },
        { platform: 'Twitter', url: 'https://twitter.com/your-handle', icon: 'x' },
    ],
    socialStyle: 'badge',
    socialIconStyle: {
        size: 32,
        backgroundColor: '161b22',
        borderWidth: 1,
        borderColor: '30363d',
        borderRadius: 50,
    },
    workExperience: [],
    projects: [],
    projectStyle: 'list',
    volunteering: [],
    education: [],
    certifications: [],
    research: [],
    awards: [],
    publications: [],
    talks: [],
    languages: ['English (Fluent)', 'Spanish (Conversational)'],
    hobbies: ['Coding', 'Reading', 'Hiking'],
    buyMeACoffee: '',
    kofi: '',
    blogUrl: '',
    customHtml: '',
    footerText: 'This README was generated with ❤️ by [Ultimate GitHub README Generator](https://github.com/)',
    footerStyle: 'card',
    footerCardWidth: 80,
    footerCardBorderRadius: 6,
    footerCardBorderColor: 'a855f7',
    hackathons: [],
    problemSolving: [],
    showVisitors: true,
    showStats: true,
    showTopLangs: true,
    showTrophies: true,
    showPinnedRepos: true,
    showProfileSummary: true,
    showProductiveTime: true,
    githubUtcOffset: "0",
    showStreakStats: true,
    showActivityGraph: true,
    showWakatimeBadge: false,
    showWakatimeChart: false,
    wakatimeUser: '',
    statsTheme: 'tokyonight',
    showBorder: false,
    borderRadius: 10,
    sectionOrder: [
        'mainHeaderBanner', 'profileHeaderBanner', 'appearance', 'basicInfo', 'myMission', 'githubStats', 'githubAnalytics', 'socials', 'techStack', 
        'workExperience', 'featuredProjects', 'projects', 'volunteering', 'education', 'certifications', 
        'research', 'awards', 'publications', 'talks', 'languages', 'hobbies', 'hackathons', 
        'problemSolving', 'supportMe', 'blogPosts', 'customHtml', 'footer'
    ],
    sectionStyleConfig: {
        style: 'default',
        cardBackgroundColor: '161b22',
        cardBorderColor: '30363d',
        cardBorderRadius: 6,
    },
    statsCardType: 'standard',
    borderColor: 'a855f7',
    advancedMetrics: {
        languages: true,
        habits: true,
        isocalendar: false,
        skyline: false,
    },
};

export const FORM_TABS: Record<string, { title: string; icon: string; sections: SectionKey[] }> = {
    core: {
        title: 'Core',
        icon: '👤',
        sections: ['mainHeaderBanner', 'profileHeaderBanner', 'basicInfo', 'myMission', 'socials'],
    },
    appearance: {
        title: 'Appearance',
        icon: '🎨',
        sections: ['appearance', 'footer'],
    },
    content: {
        title: 'Content',
        icon: '📝',
        sections: [
            'workExperience', 'volunteering', 'education', 'certifications', 'research', 
            'awards', 'publications', 'talks', 'languages', 'hobbies', 'customHtml',
        ],
    },
    projects: {
        title: 'Projects',
        icon: '🚀',
        sections: ['techStack', 'featuredProjects', 'projects'],
    },
    stats: {
        title: 'Stats',
        icon: '📊',
        sections: ['githubStats', 'githubAnalytics', 'problemSolving', 'hackathons', 'supportMe', 'blogPosts'],
    },
    ai: {
        title: 'AI Tools',
        icon: '🤖',
        sections: ['aiAssistant'],
    },
    layout: {
        title: 'Layout & Settings',
        icon: '⚙️',
        sections: ['sectionLayout', 'settings'],
    },
};
