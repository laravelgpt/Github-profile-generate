
import React, { useState, useRef, useEffect } from 'react';
import { FormData } from '../types';
import { InputField, TextareaField, AiButton } from './FormControls';

interface AIPanelProps {
    formData: FormData;
    isLoading: boolean;
    actions: {
        onAnalyzeProfile: (url: string) => void;
        onGenerateBio: (keywords: string) => void;
        handleAnalyzeProjectUrl: (url: string) => void;
        handleAnalyzeResume: (resumeText: string) => void;
        handleQuickGenerate: (keywords: string) => void;
        handleCustomPromptGenerate: (prompt: string) => void;
        handleFileAnalysis: (file: File, prompt: string) => void;
        handleFormChange: (field: keyof FormData, value: any) => void;
    };
}

export const AIPanel: React.FC<AIPanelProps> = ({ formData, isLoading, actions }) => {
    const [activeTab, setActiveTab] = useState<'populate' | 'full' | 'file'>('populate');
    
    const [bioKeywords, setBioKeywords] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [quickGenKeywords, setQuickGenKeywords] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const [fileToAnalyze, setFileToAnalyze] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileAnalysisPrompt, setFileAnalysisPrompt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!fileToAnalyze) {
            setFilePreview(null);
            return;
        }

        if (fileToAnalyze.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(fileToAnalyze);
        } else if (fileToAnalyze.type === 'text/plain') {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsText(fileToAnalyze);
        } else {
            setFilePreview(`Unsupported file type: ${fileToAnalyze.type}`);
        }
    }, [fileToAnalyze]);

    const TabButton: React.FC<{ tabName: string, children: React.ReactNode }> = ({ tabName, children }) => (
        <button
            onClick={() => setActiveTab(tabName as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                activeTab === tabName
                    ? 'bg-slate-800 text-purple-300'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800/70'
            }`}
        >
            {children}
        </button>
    );
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileToAnalyze(file);
        }
    };

    return (
        <div className="bg-slate-900/50 rounded-md">
            <div className="flex border-b border-slate-700">
                <TabButton tabName="populate">Quick Populate</TabButton>
                <TabButton tabName="full">Full Generation</TabButton>
                <TabButton tabName="file">Analyze File</TabButton>
            </div>
            <div className="p-4 space-y-4">
                {activeTab === 'populate' && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-slate-300 mb-2">Analyze GitHub Profile</h4>
                            <div className="flex items-end gap-2">
                                <InputField
                                    label=""
                                    placeholder="your-github-username"
                                    value={formData.githubUser}
                                    onChange={e => actions.handleFormChange('githubUser', e.target.value)}
                                    disabled={isLoading}
                                    className="flex-grow"
                                />
                                <AiButton onClick={() => actions.onAnalyzeProfile(`https://github.com/${formData.githubUser}`)} disabled={isLoading || !formData.githubUser}>Analyze & Populate</AiButton>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Fills your bio and suggests relevant skills based on your public profile.</p>
                        </div>
                        <div className="border-t border-slate-700/50 pt-4">
                             <h4 className="font-semibold text-slate-300 mb-2">Generate Bio from Keywords</h4>
                             <div className="flex items-end gap-2">
                                <InputField
                                    label=""
                                    placeholder="e.g., 'passionate, full-stack, react, rust'"
                                    value={bioKeywords}
                                    onChange={e => setBioKeywords(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-grow"
                                />
                                <AiButton onClick={() => actions.onGenerateBio(bioKeywords)} disabled={isLoading || !bioKeywords}>Generate Bio</AiButton>
                            </div>
                             <p className="text-xs text-slate-400 mt-2">Generates a new 'About Me' section using the keywords you provide.</p>
                        </div>
                         <div className="border-t border-slate-700/50 pt-4">
                            <h4 className="font-semibold text-slate-300 mb-2">Add Project from URL</h4>
                            <div className="flex items-end gap-2">
                                <InputField
                                    label=""
                                    placeholder="Paste a GitHub repo or live project URL..."
                                    value={projectUrl}
                                    onChange={e => setProjectUrl(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-grow"
                                />
                                <AiButton onClick={() => { actions.handleAnalyzeProjectUrl(projectUrl); setProjectUrl(''); }} disabled={isLoading || !projectUrl}>Analyze & Add</AiButton>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Let AI analyze a URL and automatically fill in the project name, description, tech stack, and thumbnail.</p>
                        </div>
                         <div className="border-t border-slate-700/50 pt-4">
                             <h4 className="font-semibold text-slate-300 mb-2">Populate from Resume/CV Text</h4>
                             <TextareaField
                                label=""
                                value={formData.resumeText}
                                onChange={e => actions.handleFormChange('resumeText', e.target.value)}
                                disabled={isLoading}
                                rows={8}
                                placeholder="Paste your full resume or CV text here..."
                            />
                            <div className="flex justify-end mt-2">
                                <AiButton onClick={() => actions.handleAnalyzeResume(formData.resumeText)} disabled={isLoading || !formData.resumeText}>Analyze & Populate Form</AiButton>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'full' && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-slate-300 mb-2">Quick Generate Full README</h4>
                            <div className="flex items-end gap-2">
                                <InputField
                                    label=""
                                    placeholder="Enter a few keywords (e.g., 'Go developer, loves cloud tech')"
                                    value={quickGenKeywords}
                                    onChange={e => setQuickGenKeywords(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-grow"
                                />
                                <AiButton onClick={() => actions.handleQuickGenerate(quickGenKeywords)} disabled={isLoading || !quickGenKeywords}>✨ Quick Generate</AiButton>
                            </div>
                             <p className="text-xs text-slate-400 mt-2">Generates a complete README from scratch based on your GitHub username and keywords. This will replace all existing content.</p>
                        </div>
                        <div className="border-t border-slate-700/50 pt-4">
                             <h4 className="font-semibold text-slate-300 mb-2">Generate from Custom Prompt</h4>
                             <TextareaField
                                label=""
                                placeholder="Describe your ideal README in detail. Mention your tone, key achievements, and what sections to include..."
                                value={customPrompt}
                                onChange={e => setCustomPrompt(e.target.value)}
                                disabled={isLoading}
                                rows={6}
                                className="flex-grow"
                            />
                            <div className="flex justify-end mt-2">
                                <AiButton onClick={() => actions.handleCustomPromptGenerate(customPrompt)} disabled={isLoading || !customPrompt}>Generate from Prompt</AiButton>
                            </div>
                             <p className="text-xs text-slate-400 mt-2">Provides maximum control. Write a detailed prompt and let the AI build your profile. This will replace all existing content.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'file' && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-slate-300 mb-2">Analyze Uploaded File</h4>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,image/png,image/jpeg" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors">
                            {fileToAnalyze ? `Selected: ${fileToAnalyze.name}` : 'Select .txt or Image File'}
                        </button>
                        
                        {filePreview && (
                            <div className="mt-4 p-3 bg-slate-900 rounded-md border border-slate-700 max-h-60 overflow-auto">
                                {fileToAnalyze?.type.startsWith('image/') ? (
                                    <img src={filePreview} alt="File preview" className="max-w-full h-auto rounded-md" />
                                ) : (
                                    <pre className="text-sm text-slate-300 whitespace-pre-wrap">{filePreview}</pre>
                                )}
                            </div>
                        )}

                        <div className="pt-2">
                             <TextareaField
                                label="Analysis Prompt"
                                placeholder="e.g., 'Analyze this resume and populate my profile.' OR 'Describe this image for my project named X and suggest tech.'"
                                value={fileAnalysisPrompt}
                                onChange={e => setFileAnalysisPrompt(e.target.value)}
                                disabled={isLoading}
                                rows={3}
                            />
                        </div>
                         <div className="flex justify-end mt-2">
                            <AiButton onClick={() => fileToAnalyze && actions.handleFileAnalysis(fileToAnalyze, fileAnalysisPrompt)} disabled={isLoading || !fileToAnalyze || !fileAnalysisPrompt}>Analyze File</AiButton>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Upload a file (like a resume.txt or project screenshot) and tell the AI what to do with it. The results will be merged into your current form data.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
