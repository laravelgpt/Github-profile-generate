
export interface Skill {
  name: string;
  badgeText?: string;
  logo?: string;
  color?: string;
  deviconName: string;
}

export type SkillStyle = 
  | 'badge' | 'badge-plastic' | 'badge-flat' | 'badge-flat-square' | 'badge-social'
  | 'icon' | 'icon-grid'
  | 'star' | 'icon-text' | 'table' | 'pills'
  | 'list-bullet' | 'list-comma' | 'list-dot' | 'list-pipe' | 'list-newline';

export type ProjectCategory = 'Static Website' | 'Web Application' | 'Console Application' | 'GUI Application' | 'Game' | 'Script' | 'Research' | 'Live Service / API' | 'Other';
export type ProjectStyle = 'list' | 'box';

export interface MainHeaderConfig {
    enabled: boolean;
    title: string;
    subtitle: string;
    aiPrompt: string;
    aiStyle: string;
    aiEffect: string;
    aiColor: string;
    aiMotion: string;
    aiAspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    generatedImageUrl: string;
}

export interface ProfileHeaderConfig {
    enabled: boolean;
    title: string;
    subtitle: string;
    background: string;
}

export interface WorkExperience {
    company: string;
    title: string;
    duration: string;
    description: string;
}

export interface Project {
    name: string;
    description: string;
    repoUrl: string;
    liveUrl: string;
    tech: string[];
    isTopProject: boolean;
    category: ProjectCategory;
    thumbnailUrl: string;
    customBadges: string;
}

export interface Education {
    institution: string;
    degree: string;
    duration: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
    url: string;
}

export interface Volunteering {
    organization: string;
    role: string;
    duration: string;
    description: string;
}

export interface Award {
    name: string;
    issuer: string;
    date: string;
}

export interface Publication {
    title: string;
    journal: string;
    date: string;
    url: string;
}

export interface Research {
    title: string;
    publication: string;
    date: string;
    url: string;
    description: string;
}

export interface Talk {
    title: string;
    event: string;
    date: string;
    url: string;
}


export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

export interface Hackathon {
  name: string;
  description: string;
  link: string;
}

export interface ProblemSolvingProfile {
  platform: string;
  username: string;
}

export type TechStack = Record<string, string[]>;

export interface SectionStyleConfig {
    style: 'default' | 'card';
    cardBackgroundColor: string;
    cardBorderColor: string;
    cardBorderRadius: number;
}

export interface SocialIconStyle {
    size: number;
    backgroundColor: string;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
}

export type SectionKey =
  | 'mainHeaderBanner'
  | 'profileHeaderBanner'
  | 'appearance'
  | 'aiAssistant'
  | 'basicInfo'
  | 'myMission'
  | 'githubStats'
  | 'githubAnalytics'
  | 'socials'
  | 'techStack'
  | 'workExperience'
  | 'projects'
  | 'featuredProjects'
  | 'volunteering'
  | 'education'
  | 'certifications'
  | 'research'
  | 'awards'
  | 'publications'
  | 'talks'
  | 'languages'
  | 'hobbies'
  | 'hackathons'
  | 'problemSolving'
  | 'supportMe'
  | 'blogPosts'
  | 'customHtml'
  | 'footer'
  | 'settings'
  | 'sectionLayout';
  
export type SocialStyle = 'badge' | 'icon' | 'list';
export type FooterStyle = 'simple' | 'card' | 'centered';

export interface FormData {
    mainHeader: MainHeaderConfig;
    profileHeader: ProfileHeaderConfig;
    resumeText: string;
    name: string;
    githubUser: string;
    bio: string;
    myMission: string;
    techStack: TechStack;
    skillStyle: SkillStyle;
    badgeColor: string;
    socials: SocialLink[];
    socialStyle: SocialStyle;
    socialIconStyle: SocialIconStyle;
    workExperience: WorkExperience[];
    projects: Project[];
    projectStyle: ProjectStyle;
    volunteering: Volunteering[];
    education: Education[];
    certifications: Certification[];
    research: Research[];
    awards: Award[];
    publications: Publication[];
    talks: Talk[];
    languages: string[];
    hobbies: string[];
    buyMeACoffee: string;
    kofi: string;
    blogUrl: string;
    customHtml: string;
    footerText: string;
    footerStyle: FooterStyle;
    footerCardWidth: number;
    footerCardBorderRadius: number;
    footerCardBorderColor: string;
    hackathons: Hackathon[];
    problemSolving: ProblemSolvingProfile[];
    showVisitors: boolean;
    showStats: boolean;
    showTopLangs: boolean;
    showTrophies: boolean;
    showPinnedRepos: boolean;
    showProfileSummary: boolean;
    showProductiveTime: boolean;
    githubUtcOffset: string;
    showStreakStats: boolean;
    showActivityGraph: boolean;
    showWakatimeBadge: boolean;
    showWakatimeChart: boolean;
    wakatimeUser: string;
    statsTheme: string;
    showBorder: boolean;
    borderRadius: number;
    sectionOrder: SectionKey[];
    sectionStyleConfig: SectionStyleConfig;
    statsCardType: 'standard' | 'advanced';
    borderColor: string;
    advancedMetrics: {
        languages: boolean;
        habits: boolean;
        isocalendar: boolean;
        skyline: boolean;
    };
}