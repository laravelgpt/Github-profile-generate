
import React, { useState, useRef } from 'react';
import { TECH_STACK, PROBLEM_SOLVING_PLATFORMS, STATS_THEMES, HEADER_BACKGROUNDS, PROJECT_CATEGORIES, SOCIAL_PLATFORMS, FORM_TABS, DEFAULT_SECTION_ORDER, AI_HEADER_STYLES, AI_HEADER_EFFECTS, AI_HEADER_COLORS, AI_HEADER_MOTIONS, AI_HEADER_ASPECT_RATIOS } from '../constants';
import { FormData, SectionKey, Hackathon, ProblemSolvingProfile, WorkExperience, SocialLink, Skill, Project, Education, Certification, Volunteering, Award, Publication, Talk, Research, FooterStyle, SectionStyleConfig, SocialIconStyle } from '../types';
import { InputField, TextareaField, CheckboxField, SkillButton, SelectField, RemoveButton, AiButton, Spinner, DraggableHandle, ColorField } from './FormControls';
import { AIPanel } from './AIPanel';

const sectionTitles: Record<string, string> = {
    mainHeaderBanner: "Main Banner (AI Generated)",
    profileHeaderBanner: "Profile Header (SVG Template)",
    appearance: "🎨 Appearance",
    aiAssistant: "🤖 AI Tools",
    basicInfo: "Basic Information",
    myMission: "My Mission",
    githubStats: "GitHub Stats & Insights",
    githubAnalytics: "📊 GitHub Analytics",
    socials: "Social Links",
    techStack: "Tech Stack",
    workExperience: "Work Experience",
    projects: "All Projects",
    featuredProjects: "🚀 Featured Projects",
    volunteering: "Volunteering Experience",
    education: "Education",
    certifications: "Certifications",
    research: "Research",
    awards: "Awards & Recognition",
    publications: "Publications",
    talks: "Talks & Presentations",
    languages: "Languages",
    hobbies: "Hobbies & Interests",
    hackathons: "Hackathons",
    problemSolving: "Problem Solving Profiles",
    supportMe: "Support Me",
    blogPosts: "Latest Blog Posts",
    customHtml: "Custom Content",
    footer: "Footer",
    settings: "Settings & Data",
    sectionLayout: "Section Layout & Order",
};

interface FormPanelProps {
    formData: FormData;
    isLoading: boolean;
    error: string | null;
    actions: {
        handleFormChange: (field: keyof FormData, value: any) => void;
        handleMainHeaderChange: (field: keyof FormData['mainHeader'], value: any) => void;
        handleProfileHeaderChange: (field: keyof FormData['profileHeader'], value: string) => void;
        addListItem: (field: keyof FormData, newItem: any) => void;
        removeListItem: (field: keyof FormData, index: number) => void;
        handleListChange: <T>(field: keyof FormData, index: number, itemField: keyof T, value: string) => void;
        handleListChangeArray: <T>(field: keyof FormData, index: number, itemField: keyof T, value: string[]) => void;
        handleListToggle: <T>(field: keyof FormData, index: number, itemField: keyof T) => void;
        handleAdvancedMetricsToggle: (field: keyof FormData['advancedMetrics']) => void;
        onTechStackToggle: (category: string, skillName: string) => void;
        addCustomSkill: (category: string, skillName: string) => void;
        onAnalyzeProfile: (url: string) => void;
        onGenerateBio: (keywords: string) => void;
        handleGenerateHeaderImage: () => void;
        handleGenerateWorkDescription: (index: number) => void;
        handleGenerateProjectDescription: (index: number) => void;
        handleGenerateProjectTechStack: (index: number) => void;
        handleAnalyzeProjectUrl: (url: string) => void;
        handleGenerateVolunteeringDescription: (index: number) => void;
        handleAnalyzeResume: (resumeText: string) => void;
        handleQuickGenerate: (keywords: string) => void;
        handleCustomPromptGenerate: (prompt: string) => void;
        handleFileAnalysis: (file: File, prompt: string) => void;
        handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
        handleExport: () => void;
        handleResetToDefaults: () => void;
        handleSocialLinkPlatformChange: (index: number, platformName: string) => void;
        clearError: () => void;
    };
}

const SectionOrderManager: React.FC<any> = ({ sectionOrder, onOrderChange, isLoading }) => {
    const [draggedItem, setDraggedItem] = useState<SectionKey | null>(null);
    const [dragOverItem, setDragOverItem] = useState<SectionKey | null>(null);
    const availableSections = DEFAULT_SECTION_ORDER.filter(s => s !== 'mainHeaderBanner' && s !== 'profileHeaderBanner');

    const handleDragStart = (key: SectionKey) => setDraggedItem(key);
    const handleDragEnter = (key: SectionKey) => setDragOverItem(key);

    const handleDragEnd = () => {
        if (draggedItem && dragOverItem && draggedItem !== dragOverItem) {
            const newOrder = [...sectionOrder];
            const draggedIndex = newOrder.indexOf(draggedItem);
            const targetIndex = newOrder.indexOf(dragOverItem);
            
            const [removed] = newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, removed);
            
            onOrderChange(newOrder);
        }
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleToggleSection = (key: SectionKey) => {
        const newOrder = sectionOrder.includes(key)
            ? sectionOrder.filter((s: SectionKey) => s !== key)
            : [...sectionOrder, key];
        onOrderChange(newOrder);
    };

    return (
        <div className="space-y-2">
            <p className="text-sm text-slate-400 mb-4">Drag and drop to reorder the sections in your README. Uncheck a section to hide it.</p>
            {availableSections.map(key => (
                <div
                    key={key}
                    className={`flex items-center justify-between p-3 rounded-md transition-shadow bg-slate-800/50 ${draggedItem === key ? 'bg-slate-900/50 rounded-md shadow-lg shadow-purple-500/20' : ''} ${dragOverItem === key ? 'border-dashed border-purple-400' : ''}`}
                    draggable={sectionOrder.includes(key)}
                    onDragStart={() => sectionOrder.includes(key) && handleDragStart(key)}
                    onDragEnter={() => sectionOrder.includes(key) && handleDragEnter(key)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="flex items-center gap-3">
                        <CheckboxField label="" checked={sectionOrder.includes(key)} onChange={() => handleToggleSection(key)} disabled={isLoading} />
                        <span className={`font-medium ${sectionOrder.includes(key) ? 'text-slate-300' : 'text-slate-500 line-through'}`}>{sectionTitles[key] || key}</span>
                    </div>
                    {sectionOrder.includes(key) && <DraggableHandle />}
                </div>
            ))}
        </div>
    );
};


export const FormPanel: React.FC<FormPanelProps> = ({ formData, isLoading, error, actions }) => {
    const importFileRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState(Object.keys(FORM_TABS)[0]);

    const renderSectionContent = (key: SectionKey) => {
        switch(key) {
            case 'mainHeaderBanner': return <MainHeaderBannerSection formData={formData} actions={actions} isLoading={isLoading} />;
            case 'profileHeaderBanner': return <ProfileHeaderBannerSection formData={formData} actions={actions} isLoading={isLoading} />;
            case 'appearance': return <AppearanceSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'aiAssistant': return <AIPanel formData={formData} actions={actions} isLoading={isLoading} />;
            case 'basicInfo': return <BasicInfoSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'myMission': return <MyMissionSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'githubStats': return <GitHubStatsSection formData={formData} onFormChange={actions.handleFormChange} onAdvancedMetricsToggle={actions.handleAdvancedMetricsToggle} isLoading={isLoading} />;
            case 'githubAnalytics': return <GitHubAnalyticsSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'socials': return <SocialsSection formData={formData} actions={actions} isLoading={isLoading} />;
            case 'techStack': return <TechStackSection formData={formData} onFormChange={actions.handleFormChange} onSkillToggle={actions.onTechStackToggle} addCustomSkill={actions.addCustomSkill} isLoading={isLoading} />;
            case 'workExperience': return <DynamicListSection<WorkExperience> field="workExperience" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <WorkExperienceItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ company: '', title: '', duration: '', description: '' }} buttonText="+ Add Work Experience" />;
            case 'projects': return <ProjectsSection formData={formData} actions={actions} isLoading={isLoading} />;
            case 'featuredProjects': return <p className="text-slate-400 text-sm">To feature a project, check the "Make this a Top Project" box in the "All Projects" section under the **Projects** tab.</p>;
            case 'volunteering': return <DynamicListSection<Volunteering> field="volunteering" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <VolunteeringItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ organization: '', role: '', duration: '', description: '' }} buttonText="+ Add Volunteering" />;
            case 'education': return <DynamicListSection<Education> field="education" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <EducationItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ institution: '', degree: '', duration: '' }} buttonText="+ Add Education" />;
            case 'certifications': return <DynamicListSection<Certification> field="certifications" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <CertificationItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ name: '', issuer: '', date: '', url: '' }} buttonText="+ Add Certification" />;
            case 'research': return <DynamicListSection<Research> field="research" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <ResearchItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ title: '', publication: '', date: '', url: '', description: '' }} buttonText="+ Add Research" />;
            case 'awards': return <DynamicListSection<Award> field="awards" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <AwardItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ name: '', issuer: '', date: ''}} buttonText="+ Add Award" />;
            case 'publications': return <DynamicListSection<Publication> field="publications" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <PublicationItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ title: '', journal: '', date: '', url: ''}} buttonText="+ Add Publication" />;
            case 'talks': return <DynamicListSection<Talk> field="talks" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <TalkItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ title: '', event: '', date: '', url: ''}} buttonText="+ Add Talk" />;
            case 'languages': return <TagListSection field="languages" label="Language" formData={formData} actions={actions} isLoading={isLoading} />;
            case 'hobbies': return <TagListSection field="hobbies" label="Hobby / Interest" formData={formData} actions={actions} isLoading={isLoading} />;
            case 'hackathons': return <DynamicListSection<Hackathon> field="hackathons" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <HackathonItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ name: '', description: '', link: '' }} buttonText="+ Add Hackathon" />;
            case 'problemSolving': return <DynamicListSection<ProblemSolvingProfile> field="problemSolving" formData={formData} actions={actions} isLoading={isLoading} renderItem={(item, index) => <ProblemSolvingItem item={item} index={index} actions={actions} isLoading={isLoading} />} newItem={{ platform: 'LeetCode', username: '' }} buttonText="+ Add Profile" />;
            case 'supportMe': return <SupportMeSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'blogPosts': return <BlogPostsSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'customHtml': return <CustomHtmlSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'footer': return <FooterSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />;
            case 'sectionLayout': return <SectionOrderManager sectionOrder={formData.sectionOrder} onOrderChange={(newOrder: SectionKey[]) => actions.handleFormChange('sectionOrder', newOrder)} isLoading={isLoading} />;
            case 'settings': return <SettingsSection handleImport={actions.handleImport} handleExport={actions.handleExport} handleReset={actions.handleResetToDefaults} importFileRef={importFileRef} />;
            default: return null;
        }
    };
    
    const TabButton: React.FC<{ tabKey: string; icon: string; title: string; }> = ({ tabKey, icon, title }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`flex-shrink-0 px-3 py-3 text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === tabKey
                    ? 'text-purple-300 border-b-2 border-purple-400 bg-slate-800/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 border-b-2 border-transparent'
            }`}
        >
            <span className="text-lg">{icon}</span>
            <span className="hidden sm:inline">{title}</span>
        </button>
    );

    return (
        <div className="flex flex-col bg-slate-900/70 rounded-md">
             {error && (
                <div className="text-red-400 text-sm m-4 bg-red-500/10 p-3 rounded-md border border-red-500/30 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={actions.clearError} className="p-1 text-red-400 hover:text-red-200 font-bold text-lg">&times;</button> 
                </div>
            )}
            <div className="flex border-b border-slate-700 overflow-x-auto">
                 {Object.entries(FORM_TABS).map(([key, { title, icon }]) => (
                    <TabButton key={key} tabKey={key} title={title} icon={icon} />
                ))}
            </div>
            <div className="p-4 space-y-6">
                {(FORM_TABS[activeTab]?.sections || []).map(key => (
                     <details key={key} className="space-y-4" open>
                         <summary className="font-semibold text-lg text-slate-200 cursor-pointer list-none">
                            {sectionTitles[key] || key}
                         </summary>
                         {renderSectionContent(key)}
                     </details>
                ))}
            </div>
        </div>
    );
};

// Sub-components for each section to keep FormPanel clean
const MainHeaderBannerSection: React.FC<any> = ({ formData, actions, isLoading }) => {
    return (
        <div className="space-y-4">
            <CheckboxField
                label="Enable AI Main Banner"
                checked={formData.mainHeader.enabled}
                onChange={e => actions.handleMainHeaderChange('enabled', e.target.checked)}
                disabled={isLoading}
            />
            {formData.mainHeader.enabled && (
                <div className="space-y-4 p-4 border border-purple-500/20 bg-slate-900/50 rounded-lg">
                    <InputField label="Title" value={formData.mainHeader.title} onChange={e => actions.handleMainHeaderChange('title', e.target.value)} disabled={isLoading} />
                    <InputField label="Subtitle" value={formData.mainHeader.subtitle} onChange={e => actions.handleMainHeaderChange('subtitle', e.target.value)} disabled={isLoading} />
                    <TextareaField
                        label="Prompt"
                        placeholder="e.g., A majestic cat astronaut floating in a galaxy of code"
                        value={formData.mainHeader.aiPrompt}
                        onChange={e => actions.handleMainHeaderChange('aiPrompt', e.target.value)}
                        disabled={isLoading}
                        rows={3}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SelectField label="Style" value={formData.mainHeader.aiStyle} onChange={e => actions.handleMainHeaderChange('aiStyle', e.target.value)} disabled={isLoading}>
                            {AI_HEADER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectField>
                        <SelectField label="Effect" value={formData.mainHeader.aiEffect} onChange={e => actions.handleMainHeaderChange('aiEffect', e.target.value)} disabled={isLoading}>
                            {AI_HEADER_EFFECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectField>
                        <SelectField label="Color Palette" value={formData.mainHeader.aiColor} onChange={e => actions.handleMainHeaderChange('aiColor', e.target.value)} disabled={isLoading}>
                            {AI_HEADER_COLORS.map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectField>
                        <SelectField label="Motion" value={formData.mainHeader.aiMotion} onChange={e => actions.handleMainHeaderChange('aiMotion', e.target.value)} disabled={isLoading}>
                           {AI_HEADER_MOTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectField>
                         <SelectField label="Aspect Ratio" value={formData.mainHeader.aiAspectRatio} onChange={e => actions.handleMainHeaderChange('aiAspectRatio', e.target.value)} disabled={isLoading}>
                            {AI_HEADER_ASPECT_RATIOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectField>
                    </div>
                    <div className="flex justify-end">
                        <AiButton onClick={actions.handleGenerateHeaderImage} disabled={isLoading || !formData.mainHeader.aiPrompt}>
                            {isLoading ? 'Generating...' : 'Generate Header Image'}
                        </AiButton>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileHeaderBannerSection: React.FC<any> = ({ formData, actions, isLoading }) => {
    const backgroundGroups = Object.entries(HEADER_BACKGROUNDS).reduce((acc, [key, value]) => {
        (acc[value.group] = acc[value.group] || []).push({ key, name: value.name });
        return acc;
    }, {} as Record<string, { key: string, name: string }[]>);

    return (
        <div className="space-y-4">
            <CheckboxField
                label="Enable SVG Profile Header"
                checked={formData.profileHeader.enabled}
                onChange={e => actions.handleProfileHeaderChange('enabled', e.target.checked)}
                disabled={isLoading}
            />
            {formData.profileHeader.enabled && (
                <div className="space-y-4 p-4 border border-blue-500/20 bg-slate-900/50 rounded-lg">
                    <InputField label="Title" value={formData.profileHeader.title} onChange={e => actions.handleProfileHeaderChange('title', e.target.value)} disabled={isLoading} />
                    <InputField label="Subtitle" value={formData.profileHeader.subtitle} onChange={e => actions.handleProfileHeaderChange('subtitle', e.target.value)} disabled={isLoading} />
                    <SelectField label="Background Style" value={formData.profileHeader.background} onChange={e => actions.handleProfileHeaderChange('background', e.target.value)} disabled={isLoading}>
                        {Object.entries(backgroundGroups).map(([group, options]) => (
                            <optgroup key={group} label={group}>
                                {options.map(opt => <option key={opt.key} value={opt.key}>{opt.name}</option>)}
                            </optgroup>
                        ))}
                    </SelectField>
                </div>
            )}
        </div>
    );
};


const AppearanceSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => {
    const handleStyleChange = (field: keyof SectionStyleConfig, value: any) => {
        onFormChange('sectionStyleConfig', { ...formData.sectionStyleConfig, [field]: value });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-300 -mb-1">Global Section Styling</h4>
            <SelectField
                label="Section Style"
                value={formData.sectionStyleConfig.style}
                onChange={e => handleStyleChange('style', e.target.value)}
                disabled={isLoading}
            >
                <option value="default">Default (Simple Separators)</option>
                <option value="card">Card (Boxed Sections)</option>
            </SelectField>

            {formData.sectionStyleConfig.style === 'card' && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <ColorField label="Card BG Color" value={formData.sectionStyleConfig.cardBackgroundColor} onChange={e => handleStyleChange('cardBackgroundColor', e.target.value.substring(1))} disabled={isLoading} />
                     <ColorField label="Card Border Color" value={formData.sectionStyleConfig.cardBorderColor} onChange={e => handleStyleChange('cardBorderColor', e.target.value.substring(1))} disabled={isLoading} />
                     <InputField label="Border Radius (px)" type="number" min="0" value={formData.sectionStyleConfig.cardBorderRadius} onChange={e => handleStyleChange('cardBorderRadius', e.target.valueAsNumber)} disabled={isLoading} />
                 </div>
            )}
             <p className="text-xs text-slate-400 -mt-2">Choosing "Card" will wrap each content section in a styled container.</p>
        </div>
    );
};

const BasicInfoSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => {
    return (
        <>
            <InputField label="Display Name" value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} disabled={isLoading} />
            <InputField label="GitHub Username" value={formData.githubUser} onChange={(e) => onFormChange('githubUser', e.target.value)} disabled={isLoading} />
            <TextareaField label="About Me / Bio" value={formData.bio} onChange={(e) => onFormChange('bio', e.target.value)} disabled={isLoading} />
        </>
    );
};

const MyMissionSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => (
    <TextareaField label="Your Mission Statement" value={formData.myMission} onChange={(e) => onFormChange('myMission', e.target.value)} disabled={isLoading} rows={3} />
);

const GitHubStatsSection: React.FC<any> = ({ formData, onFormChange, onAdvancedMetricsToggle, isLoading }) => {
    const StatTypeButton: React.FC<{ type: 'standard' | 'advanced', children: React.ReactNode }> = ({ type, children }) => {
        const isActive = formData.statsCardType === type;
        return (
            <button
                onClick={() => onFormChange('statsCardType', type)}
                disabled={isLoading}
                className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
                {children}
            </button>
        );
    };

    return (
        <>
            <label className="block text-sm font-medium text-slate-300 mb-2">Stat Card Style</label>
            <div className="flex gap-2 rounded-md bg-slate-900/80 p-1 mb-4">
                <StatTypeButton type="standard">Standard Cards</StatTypeButton>
                <StatTypeButton type="advanced">Advanced Card (Metrics)</StatTypeButton>
            </div>

            {formData.statsCardType === 'standard' ? (
                <>
                    <h4 className="text-md font-semibold text-slate-300 -mb-1">Cards to Display</h4>
                    <CheckboxField label="Display Profile Visitors Counter" checked={formData.showVisitors} onChange={(e) => onFormChange('showVisitors', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display Pinned Repositories" checked={formData.showPinnedRepos} onChange={(e) => onFormChange('showPinnedRepos', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display GitHub Stats Card" checked={formData.showStats} onChange={(e) => onFormChange('showStats', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display 'Summary of My Github Status' Card" checked={formData.showProfileSummary} onChange={(e) => onFormChange('showProfileSummary', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display Top Languages Card" checked={formData.showTopLangs} onChange={(e) => onFormChange('showTopLangs', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display Productive Time Chart" checked={formData.showProductiveTime} onChange={(e) => onFormChange('showProductiveTime', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display GitHub Profile Trophies" checked={formData.showTrophies} onChange={(e) => onFormChange('showTrophies', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display GitHub Streak Stats" checked={formData.showStreakStats} onChange={(e) => onFormChange('showStreakStats', e.target.checked)} disabled={isLoading} />
                    <CheckboxField label="Display WakaTime Badge" checked={formData.showWakatimeBadge} onChange={(e) => onFormChange('showWakatimeBadge', e.target.checked)} disabled={isLoading} />
                </>
            ) : (
                 <>
                    <h4 className="text-md font-semibold text-slate-300 -mb-1">Plugins to Enable</h4>
                    <p className="text-xs text-slate-400 mb-2">The Advanced Card is a single, comprehensive image generated by <a href="https://metrics.lecoq.io/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">GitHub Metrics</a>.</p>
                    <CheckboxField label="Languages Breakdown (Progress bars, pie chart)" checked={formData.advancedMetrics.languages} onChange={() => onAdvancedMetricsToggle('languages')} disabled={isLoading} />
                    <CheckboxField label="Coding Habits (Commit times, lines of code)" checked={formData.advancedMetrics.habits} onChange={() => onAdvancedMetricsToggle('habits')} disabled={isLoading} />
                    <CheckboxField label="Isometric Commit Calendar (3D-style)" checked={formData.advancedMetrics.isocalendar} onChange={() => onAdvancedMetricsToggle('isocalendar')} disabled={isLoading} />
                    <CheckboxField label="Contribution Skyline (3D-style city)" checked={formData.advancedMetrics.skyline} onChange={() => onAdvancedMetricsToggle('skyline')} disabled={isLoading} />
                </>
            )}
            
            <h4 className="text-md font-semibold text-slate-300 pt-3 -mb-1">Card Customization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="WakaTime Username" value={formData.wakatimeUser} onChange={(e) => onFormChange('wakatimeUser', e.target.value)} disabled={isLoading || (!formData.showWakatimeBadge && !formData.showWakatimeChart)} />
                <InputField label="Productive Time UTC Offset" type="number" value={formData.githubUtcOffset} onChange={e => onFormChange('githubUtcOffset', e.target.value)} disabled={isLoading || (formData.statsCardType === 'standard' && !formData.showProductiveTime)} />
                <SelectField label="Card Theme" value={formData.statsTheme} onChange={e => onFormChange('statsTheme', e.target.value)} disabled={isLoading}>
                    {STATS_THEMES.map(theme => <option key={theme} value={theme}>{theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </SelectField>
                <ColorField label="Border Color" value={formData.borderColor} onChange={e => onFormChange('borderColor', e.target.value.substring(1))} disabled={isLoading} />
                 <div className="flex items-center gap-4">
                    <InputField label="Border Radius" type="number" value={formData.borderRadius} onChange={e => onFormChange('borderRadius', e.target.valueAsNumber)} disabled={isLoading} className="w-1/2" />
                    <CheckboxField label="Show Card Border" checked={formData.showBorder} onChange={(e) => onFormChange('showBorder', e.target.checked)} disabled={isLoading} />
                </div>
            </div>
             {formData.statsCardType === 'advanced' && <p className="text-xs text-slate-400 mt-2">Note: Border options and some other settings may not apply to the Advanced Card style.</p>}
        </>
    );
};

const GitHubAnalyticsSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => (
    <>
        <CheckboxField label="Display GitHub Activity Graph" checked={formData.showActivityGraph} onChange={(e) => onFormChange('showActivityGraph', e.target.checked)} disabled={isLoading} />
        <CheckboxField label="Display WakaTime Stats Chart" checked={formData.showWakatimeChart} onChange={(e) => onFormChange('showWakatimeChart', e.target.checked)} disabled={isLoading} />
        {formData.showWakatimeChart && <p className="text-xs text-slate-400 -mt-2">Requires WakaTime username to be set in the "GitHub Stats & Insights" section.</p>}
    </>
);


const TechStackSection: React.FC<any> = ({ formData, onFormChange, onSkillToggle, addCustomSkill, isLoading }) => (
    <>
        <div className="grid grid-cols-2 gap-4">
            <SelectField label="Display Style" value={formData.skillStyle} onChange={e => onFormChange('skillStyle', e.target.value)} disabled={isLoading}>
                <optgroup label="Badges">
                    <option value="badge">Badges (For the Badge)</option>
                    <option value="badge-plastic">Badges (Plastic)</option>
                    <option value="badge-flat">Badges (Flat)</option>
                    <option value="badge-flat-square">Badges (Flat Square)</option>
                    <option value="badge-social">Badges (Social)</option>
                    <option value="pills">Pills</option>
                </optgroup>
                <optgroup label="Icons & Text">
                    <option value="icon">Icons Only</option>
                    <option value="icon-grid">Icons (Grid)</option>
                    <option value="star">Icons with Text (Grid)</option>
                    <option value="icon-text">Icons with Text (List)</option>
                    <option value="table">Table (Icon & Name)</option>
                </optgroup>
                <optgroup label="Text Lists">
                    <option value="list-bullet">Bulleted List</option>
                    <option value="list-comma">Comma-separated</option>
                    <option value="list-dot">Dot-separated</option>
                    <option value="list-pipe">Pipe-separated</option>
                    <option value="list-newline">Newline-separated</option>
                </optgroup>
            </SelectField>
            <ColorField label="Badge/Pill Color" value={formData.badgeColor} onChange={e => onFormChange('badgeColor', e.target.value.substring(1))} disabled={isLoading || !formData.skillStyle.includes('badge') && !formData.skillStyle.includes('pills')} />
        </div>
        <div className="space-y-3 pt-2">
            {Object.entries(TECH_STACK).map(([category, skills]) => (
                <details key={category} className="bg-slate-900/50 p-3 rounded-md" open>
                    <summary className="font-semibold text-slate-300 cursor-pointer">{category}</summary>
                    <div className="flex flex-wrap gap-2 pt-3">
                        {(skills as Skill[]).map(skill => (
                            <SkillButton key={skill.name} skill={skill} isSelected={formData.techStack[category]?.includes(skill.name)} onClick={() => onSkillToggle(category, skill.name)} disabled={isLoading} />
                        ))}
                        {(formData.techStack[category] || []).filter(s => !(skills as Skill[]).some(ps => ps.name === s)).map(custom => (
                            <SkillButton key={custom} skill={{ name: custom, deviconName: '' }} isSelected={true} onClick={() => onSkillToggle(category, custom)} disabled={isLoading} />
                        ))}
                    </div>
                    <CustomSkillAdder category={category} onAddCustomSkill={addCustomSkill} isLoading={isLoading} />
                </details>
            ))}
        </div>
    </>
);

const ProjectsSection: React.FC<any> = ({ formData, actions, isLoading }) => {
    return (
        <div className="space-y-4">
            <SelectField
                label="Display Style"
                value={formData.projectStyle}
                onChange={e => actions.handleFormChange('projectStyle', e.target.value)}
                disabled={isLoading}
            >
                <option value="list">List</option>
                <option value="box">Box (Expandable)</option>
            </SelectField>
            
            <DynamicListSection<Project>
                field="projects"
                formData={formData}
                actions={actions}
                isLoading={isLoading}
                renderItem={(item: Project, index: number) => (
                    <ProjectItem
                        item={item}
                        index={index}
                        actions={actions}
                        isLoading={isLoading}
                        allSkills={Object.values(TECH_STACK).flat().map(s => s.name)}
                    />
                )}
                newItem={{ name: '', description: '', repoUrl: '', liveUrl: '', tech: [], isTopProject: false, category: 'Web Application', thumbnailUrl: '', customBadges: '' }}
                buttonText="+ Add Project Manually"
            />
        </div>
    );
};


const CustomSkillAdder: React.FC<{ category: string, onAddCustomSkill: (category: string, skillName: string) => void, isLoading: boolean }> = ({ category, onAddCustomSkill, isLoading }) => {
    const [customSkill, setCustomSkill] = useState('');
    const handleAdd = () => { onAddCustomSkill(category, customSkill); setCustomSkill(''); };
    return (
        <div className="flex items-end gap-2 mt-3 pt-3 border-t border-slate-700/50">
            <InputField label="" placeholder="Add custom skill..." value={customSkill} onChange={e => setCustomSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="flex-grow" disabled={isLoading} />
            <button onClick={handleAdd} disabled={isLoading || !customSkill} className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 disabled:bg-slate-500 transition-colors">Add</button>
        </div>
    );
};

const TagListSection: React.FC<any> = ({ field, label, formData, actions, isLoading }) => {
    const [newTag, setNewTag] = useState('');
    const items = formData[field] as string[];
    
    const handleAdd = () => {
        if (newTag && !items.includes(newTag)) {
            actions.handleFormChange(field, [...items, newTag]);
            setNewTag('');
        }
    };
    
    const handleRemove = (tagToRemove: string) => {
        actions.handleFormChange(field, items.filter(t => t !== tagToRemove));
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 p-2 bg-slate-900/70 rounded-md min-h-[40px]">
                {items.map(item => (
                    <button key={item} onClick={() => handleRemove(item)} disabled={isLoading} className="px-2 py-0.5 text-sm bg-purple-500/20 text-purple-300 rounded-md">&times; {item}</button>
                ))}
            </div>
             <div className="flex items-end gap-2">
                <InputField label="" placeholder={`Add new ${label.toLowerCase()}...`} value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="flex-grow" disabled={isLoading} />
                <button onClick={handleAdd} disabled={isLoading || !newTag} className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 disabled:bg-slate-500 transition-colors">Add</button>
            </div>
        </div>
    );
};

const SupportMeSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => (
    <>
        <InputField label="Buy Me a Coffee Username" placeholder="your-username" value={formData.buyMeACoffee} onChange={(e) => onFormChange('buyMeACoffee', e.target.value)} disabled={isLoading} />
        <InputField label="Ko-fi Username" placeholder="your-username" value={formData.kofi} onChange={(e) => onFormChange('kofi', e.target.value)} disabled={isLoading} />
    </>
);

const BlogPostsSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => (
    <>
        <InputField label="Blog RSS Feed URL" placeholder="e.g., https://medium.com/feed/@your-username" value={formData.blogUrl} onChange={(e) => onFormChange('blogUrl', e.target.value)} disabled={isLoading} />
        <p className="text-xs text-slate-400 -mt-2">Requires setting up the <a href="https://github.com/gautamkrishnar/blog-post-workflow" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">blog-post-workflow</a> GitHub Action.</p>
    </>
);

const CustomHtmlSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => (
    <>
        <TextareaField label="Custom HTML" placeholder="Add any raw HTML here (e.g., another badge, a custom card, etc.)" value={formData.customHtml} onChange={(e) => onFormChange('customHtml', e.target.value)} disabled={isLoading} rows={5} />
        <p className="text-xs text-slate-400 -mt-2">The HTML you enter here will be added directly to your README. Be sure it's valid.</p>
    </>
);

const FooterSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => (
    <>
        <SelectField
            label="Footer Style"
            value={formData.footerStyle}
            onChange={e => onFormChange('footerStyle', e.target.value)}
            disabled={isLoading}
        >
            <option value="simple">Simple (line separator)</option>
            <option value="centered">Centered</option>
            <option value="card">Card</option>
        </SelectField>

        {formData.footerStyle === 'card' && (
             <div className="grid grid-cols-3 gap-4">
                <InputField label="Width (%)" type="number" min="10" max="100" value={formData.footerCardWidth} onChange={e => onFormChange('footerCardWidth', e.target.valueAsNumber)} disabled={isLoading} />
                <InputField label="Border Radius (px)" type="number" min="0" value={formData.footerCardBorderRadius} onChange={e => onFormChange('footerCardBorderRadius', e.target.valueAsNumber)} disabled={isLoading} />
                <ColorField label="Border Color" value={formData.footerCardBorderColor} onChange={e => onFormChange('footerCardBorderColor', e.target.value.substring(1))} disabled={isLoading} />
             </div>
        )}

        <TextareaField label="Footer Content" placeholder="Add a footer message, credits, etc. Supports Markdown/HTML." value={formData.footerText} onChange={(e) => onFormChange('footerText', e.target.value)} disabled={isLoading} rows={3} />
        <p className="text-xs text-slate-400 -mt-2">This will appear at the very bottom of your README.</p>
    </>
);


const SettingsSection: React.FC<any> = ({ handleImport, handleExport, handleReset, importFileRef }) => (
    <div className="flex flex-col gap-4">
        <div>
           <h4 className="text-md font-semibold text-slate-300 mb-2">Configuration</h4>
           <div className="flex gap-4">
               <button onClick={() => importFileRef.current?.click()} className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors">Import Config</button>
               <input type="file" accept=".json" ref={importFileRef} onChange={handleImport} className="hidden" />
               <button onClick={handleExport} className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors">Export Config</button>
           </div>
       </div>
        <div>
           <h4 className="text-md font-semibold text-slate-300 mb-2">Danger Zone</h4>
           <button onClick={handleReset} className="w-full px-4 py-2 bg-red-600/80 text-white font-semibold rounded-md hover:bg-red-700 transition-colors">Reset to Defaults</button>
       </div>
    </div>
);


// Generic component for dynamic lists (Work, Socials, etc.)
const DynamicListSection = <T,>({ field, formData, actions, renderItem, newItem, buttonText, isLoading }: any) => (
    <div className="space-y-3">
        {(formData[field] as T[]).map((item: T, index: number) => (
             <div key={index} className="p-3 bg-slate-900/50 rounded-md relative">
                 {renderItem(item, index)}
                 <div className="absolute top-2 right-2">
                     <RemoveButton onClick={() => actions.removeListItem(field, index)} disabled={isLoading} />
                 </div>
             </div>
        ))}
        <button onClick={() => actions.addListItem(field, newItem)} disabled={isLoading} className="text-purple-400 hover:text-purple-300 font-semibold text-sm">{buttonText}</button>
    </div>
);

const SocialIconStylingSection: React.FC<any> = ({ formData, onFormChange, isLoading }) => {
    const handleIconStyleChange = (field: keyof SocialIconStyle, value: any) => {
        onFormChange('socialIconStyle', { ...formData.socialIconStyle, [field]: value });
    };

    return (
        <details className="bg-slate-900/50 p-3 rounded-md">
            <summary className="font-semibold text-slate-300 text-sm cursor-pointer">Advanced Icon Styling</summary>
            <div className="pt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="Size (px)" type="number" value={formData.socialIconStyle.size} onChange={e => handleIconStyleChange('size', e.target.valueAsNumber)} disabled={isLoading} />
                <ColorField label="Background Color" value={formData.socialIconStyle.backgroundColor} onChange={e => handleIconStyleChange('backgroundColor', e.target.value.substring(1))} disabled={isLoading} />
                <InputField label="Border Width (px)" type="number" min="0" value={formData.socialIconStyle.borderWidth} onChange={e => handleIconStyleChange('borderWidth', e.target.valueAsNumber)} disabled={isLoading} />
                <ColorField label="Border Color" value={formData.socialIconStyle.borderColor} onChange={e => handleIconStyleChange('borderColor', e.target.value.substring(1))} disabled={isLoading} />
                <InputField label="Border Radius (px)" type="number" min="0" value={formData.socialIconStyle.borderRadius} onChange={e => handleIconStyleChange('borderRadius', e.target.valueAsNumber)} disabled={isLoading} />
            </div>
        </details>
    );
};

// Item renderers for each list type
const SocialsSection: React.FC<any> = ({ formData, actions, isLoading }) => (
    <div className="space-y-4">
        <SelectField label="Display Style" value={formData.socialStyle} onChange={e => actions.handleFormChange('socialStyle', e.target.value)} disabled={isLoading}>
            <option value="badge">Badges</option>
            <option value="icon">Icons Only (Grid)</option>
            <option value="list">Icon with Text (List)</option>
        </SelectField>

        {(formData.socialStyle === 'icon' || formData.socialStyle === 'list') && (
            <SocialIconStylingSection formData={formData} onFormChange={actions.handleFormChange} isLoading={isLoading} />
        )}

        <DynamicListSection<SocialLink>
            field="socials"
            formData={formData}
            actions={actions}
            isLoading={isLoading}
            renderItem={(item, index) => <SocialLinkItem item={item} index={index} actions={actions} isLoading={isLoading} />}
            newItem={{ platform: 'GitHub', url: 'https://github.com/', icon: 'github' }}
            buttonText="+ Add Social Link"
        />
    </div>
);

const SocialLinkItem: React.FC<any> = ({ item, index, actions, isLoading }) => {
    const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        actions.handleSocialLinkPlatformChange(index, e.target.value);
    };

    const platformInfo = SOCIAL_PLATFORMS.find(p => p.name === item.platform);
    const urlPlaceholder = platformInfo ? `${platformInfo.baseUrl}your-handle` : 'https://...';

    return (
        <div className="space-y-3">
            <SelectField
                label="Platform"
                value={item.platform}
                onChange={handlePlatformChange}
                disabled={isLoading}
            >
                <option value="" disabled>-- Select a Platform --</option>
                {SOCIAL_PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </SelectField>
            <InputField
                label="URL"
                placeholder={urlPlaceholder}
                value={item.url}
                onChange={e => actions.handleListChange('socials', index, 'url', e.target.value)}
                disabled={isLoading}
            />
             <p className="text-xs text-slate-400 -mt-2">
                For many platforms, you only need to enter your username or handle, and the generator will construct the full link.
            </p>
        </div>
    );
};

const WorkExperienceItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="space-y-3">
        <InputField label="Job Title" value={item.title} onChange={e => actions.handleListChange('workExperience', index, 'title', e.target.value)} disabled={isLoading} />
        <div className="flex gap-2">
            <InputField label="Company" value={item.company} onChange={e => actions.handleListChange('workExperience', index, 'company', e.target.value)} disabled={isLoading} className="w-2/3" />
            <InputField label="Duration" placeholder="e.g., 2022 - Present" value={item.duration} onChange={e => actions.handleListChange('workExperience', index, 'duration', e.target.value)} disabled={isLoading} className="w-1/3" />
        </div>
        <div>
            <TextareaField label="Description (use bullet points)" rows={4} value={item.description} onChange={e => actions.handleListChange('workExperience', index, 'description', e.target.value)} disabled={isLoading} />
            <div className="flex justify-end mt-2">
                <AiButton onClick={() => actions.handleGenerateWorkDescription(index)} disabled={isLoading || !item.title || !item.company}>Generate Description</AiButton>
            </div>
        </div>
    </div>
);

const VolunteeringItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="space-y-3">
        <InputField label="Role" value={item.role} onChange={e => actions.handleListChange('volunteering', index, 'role', e.target.value)} disabled={isLoading} />
        <div className="flex gap-2">
            <InputField label="Organization" value={item.organization} onChange={e => actions.handleListChange('volunteering', index, 'organization', e.target.value)} disabled={isLoading} className="w-2/3" />
            <InputField label="Duration" placeholder="e.g., 2023" value={item.duration} onChange={e => actions.handleListChange('volunteering', index, 'duration', e.target.value)} disabled={isLoading} className="w-1/3" />
        </div>
        <div>
            <TextareaField label="Description (use bullet points)" rows={3} value={item.description} onChange={e => actions.handleListChange('volunteering', index, 'description', e.target.value)} disabled={isLoading} />
            <div className="flex justify-end mt-2">
                <AiButton onClick={() => actions.handleGenerateVolunteeringDescription(index)} disabled={isLoading || !item.role || !item.organization}>Generate Description</AiButton>
            </div>
        </div>
    </div>
);

const ProjectItem: React.FC<any> = ({ item, index, actions, isLoading, allSkills }) => {
    const [techSearch, setTechSearch] = useState('');
    const availableTech = allSkills.filter((s: string) => !item.tech.includes(s) && s.toLowerCase().includes(techSearch.toLowerCase()));

    const addTech = (tech: string) => {
        actions.handleListChangeArray('projects', index, 'tech', [...item.tech, tech]);
        setTechSearch('');
    };
    const removeTech = (tech: string) => {
        actions.handleListChangeArray('projects', index, 'tech', item.tech.filter((t: string) => t !== tech));
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-4">
                <InputField label="Project Name" value={item.name} onChange={e => actions.handleListChange('projects', index, 'name', e.target.value)} disabled={isLoading} className="flex-grow" />
                <SelectField label="Category" value={item.category} onChange={e => actions.handleListChange('projects', index, 'category', e.target.value)} disabled={isLoading}>
                    {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </SelectField>
            </div>
            <div className="flex items-end gap-2">
                <TextareaField label="Description" rows={2} value={item.description} onChange={e => actions.handleListChange('projects', index, 'description', e.target.value)} disabled={isLoading} className="flex-grow"/>
                <AiButton onClick={() => actions.handleGenerateProjectDescription(index)} disabled={isLoading || !item.name}>Generate</AiButton>
            </div>
             <div className="flex gap-2">
                <InputField label="Repo URL" placeholder="https://github.com/..." value={item.repoUrl} onChange={e => actions.handleListChange('projects', index, 'repoUrl', e.target.value)} disabled={isLoading} className="w-1/2" />
                <InputField label="Live URL" placeholder="https://..." value={item.liveUrl} onChange={e => actions.handleListChange('projects', index, 'liveUrl', e.target.value)} disabled={isLoading} className="w-1/2" />
            </div>
            <InputField label="Thumbnail Image URL" placeholder="https://..." value={item.thumbnailUrl} onChange={e => actions.handleListChange('projects', index, 'thumbnailUrl', e.target.value)} disabled={isLoading} />
            <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">Tech Stack</label>
                 <div className="flex flex-wrap gap-2 p-2 bg-slate-900/70 rounded-md min-h-[40px]">
                    {item.tech.map((t: string) => <button key={t} onClick={() => removeTech(t)} className="px-2 py-0.5 text-sm bg-purple-500/20 text-purple-300 rounded-md">&times; {t}</button>)}
                 </div>
                 <div className="relative mt-2">
                     <div className="flex items-center gap-2">
                        <InputField label="" placeholder="Add tech..." value={techSearch} onChange={e => setTechSearch(e.target.value)} disabled={isLoading} className="flex-grow"/>
                        <AiButton onClick={() => actions.handleGenerateProjectTechStack(index)} disabled={isLoading || !item.repoUrl}>Suggest Tech</AiButton>
                     </div>
                     {techSearch && availableTech.length > 0 && (
                         <div className="absolute z-10 w-full bg-slate-800 border border-slate-600 rounded-md mt-1 max-h-40 overflow-y-auto">
                            {availableTech.slice(0, 10).map((t: string) => <div key={t} onClick={() => addTech(t)} className="px-3 py-2 cursor-pointer hover:bg-slate-700">{t}</div>)}
                         </div>
                     )}
                 </div>
            </div>
            <div>
                <TextareaField label="Custom Badges (Markdown)" placeholder="e.g., Vercel deploy status, visitor count badge..." rows={2} value={item.customBadges} onChange={e => actions.handleListChange('projects', index, 'customBadges', e.target.value)} disabled={isLoading} />
                <p className="text-xs text-slate-400 -mt-2">Add markdown for any badges you want to display for this project. Great for deployment status or visitor counters.</p>
            </div>
            <div className="pt-2">
                <CheckboxField label="Make this a Top Project" checked={item.isTopProject} onChange={() => actions.handleListToggle('projects', index, 'isTopProject')} disabled={isLoading} />
            </div>
        </div>
    );
};


const EducationItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
     <div className="flex items-end gap-2">
        <InputField label="Institution" value={item.institution} onChange={e => actions.handleListChange('education', index, 'institution', e.target.value)} disabled={isLoading} className="w-1/2" />
        <InputField label="Degree / Field of Study" value={item.degree} onChange={e => actions.handleListChange('education', index, 'degree', e.target.value)} disabled={isLoading} className="w-1/3" />
        <InputField label="Duration" placeholder="e.g., 2018-2022" value={item.duration} onChange={e => actions.handleListChange('education', index, 'duration', e.target.value)} disabled={isLoading} className="w-1/4" />
    </div>
);

const CertificationItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="space-y-3">
        <InputField label="Certification Name" value={item.name} onChange={e => actions.handleListChange('certifications', index, 'name', e.target.value)} disabled={isLoading} />
        <div className="flex gap-2">
            <InputField label="Issuer" value={item.issuer} onChange={e => actions.handleListChange('certifications', index, 'issuer', e.target.value)} disabled={isLoading} className="w-1/2" />
            <InputField label="Date" placeholder="e.g., 2023" value={item.date} onChange={e => actions.handleListChange('certifications', index, 'date', e.target.value)} disabled={isLoading} className="w-1/4" />
        </div>
        <InputField label="Credential URL" value={item.url} onChange={e => actions.handleListChange('certifications', index, 'url', e.target.value)} disabled={isLoading} />
    </div>
);

const AwardItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="flex items-end gap-2">
        <InputField label="Award Name" value={item.name} onChange={e => actions.handleListChange('awards', index, 'name', e.target.value)} disabled={isLoading} className="w-1/2" />
        <InputField label="Awarded By" value={item.issuer} onChange={e => actions.handleListChange('awards', index, 'issuer', e.target.value)} disabled={isLoading} className="w-1/3" />
        <InputField label="Date" placeholder="e.g., 2023" value={item.date} onChange={e => actions.handleListChange('awards', index, 'date', e.target.value)} disabled={isLoading} className="w-1/4" />
    </div>
);

const PublicationItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="space-y-3">
        <InputField label="Title" value={item.title} onChange={e => actions.handleListChange('publications', index, 'title', e.target.value)} disabled={isLoading} />
        <div className="flex items-end gap-2">
            <InputField label="Journal / Platform" value={item.journal} onChange={e => actions.handleListChange('publications', index, 'journal', e.target.value)} disabled={isLoading} className="w-2/3" />
            <InputField label="Date" placeholder="e.g., 2023" value={item.date} onChange={e => actions.handleListChange('publications', index, 'date', e.target.value)} disabled={isLoading} className="w-1/3" />
        </div>
        <InputField label="Publication URL" value={item.url} onChange={e => actions.handleListChange('publications', index, 'url', e.target.value)} disabled={isLoading} />
    </div>
);

const ResearchItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="space-y-3">
        <InputField label="Research Title" value={item.title} onChange={e => actions.handleListChange('research', index, 'title', e.target.value)} disabled={isLoading} />
        <div className="flex items-end gap-2">
            <InputField label="Publication / Venue" value={item.publication} onChange={e => actions.handleListChange('research', index, 'publication', e.target.value)} disabled={isLoading} className="w-2/3" />
            <InputField label="Date" placeholder="e.g., 2023" value={item.date} onChange={e => actions.handleListChange('research', index, 'date', e.target.value)} disabled={isLoading} className="w-1/3" />
        </div>
        <InputField label="URL" value={item.url} onChange={e => actions.handleListChange('research', index, 'url', e.target.value)} disabled={isLoading} />
        <TextareaField label="Description" rows={3} value={item.description} onChange={e => actions.handleListChange('research', index, 'description', e.target.value)} disabled={isLoading} />
    </div>
);

const TalkItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="space-y-3">
        <InputField label="Talk Title" value={item.title} onChange={e => actions.handleListChange('talks', index, 'title', e.target.value)} disabled={isLoading} />
        <div className="flex items-end gap-2">
            <InputField label="Event / Conference" value={item.event} onChange={e => actions.handleListChange('talks', index, 'event', e.target.value)} disabled={isLoading} className="w-2/3" />
            <InputField label="Date" placeholder="e.g., 2023" value={item.date} onChange={e => actions.handleListChange('talks', index, 'date', e.target.value)} disabled={isLoading} className="w-1/3" />
        </div>
        <InputField label="URL (to slides or video)" value={item.url} onChange={e => actions.handleListChange('talks', index, 'url', e.target.value)} disabled={isLoading} />
    </div>
);


const ProblemSolvingItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="flex items-end gap-2">
        <SelectField label="Platform" value={item.platform} onChange={e => actions.handleListChange('problemSolving', index, 'platform', e.target.value)} disabled={isLoading} className="flex-grow">
            {PROBLEM_SOLVING_PLATFORMS.map(pl => <option key={pl.name} value={pl.name}>{pl.name}</option>)}
        </SelectField>
         <InputField label="Username" value={item.username} onChange={e => actions.handleListChange('problemSolving', index, 'username', e.target.value)} disabled={isLoading} className="flex-grow" />
    </div>
);

const HackathonItem: React.FC<any> = ({ item, index, actions, isLoading }) => (
    <div className="space-y-3">
        <InputField label="Hackathon Name" value={item.name} onChange={e => actions.handleListChange('hackathons', index, 'name', e.target.value)} disabled={isLoading} />
        <InputField label="Short Description" value={item.description} onChange={e => actions.handleListChange('hackathons', index, 'description', e.target.value)} disabled={isLoading} />
        <InputField label="Project Link" value={item.link} onChange={e => actions.handleListChange('hackathons', index, 'link', e.target.value)} disabled={isLoading} />
    </div>
);
