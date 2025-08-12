
import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';

interface PreviewPanelProps {
    markdown: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ markdown }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy Markdown');
    const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
    const [renderedHtml, setRenderedHtml] = useState('');

    const processedMarkdown = useMemo(() => {
        let tempMarkdown = markdown;
        if (tempMarkdown.includes('<!-- BLOG-POST-LIST:START -->')) {
            const placeholderNote = `
    <div class="my-4 p-4 border border-dashed border-slate-600 rounded-lg bg-slate-900/50">
        <h4 class="font-bold text-slate-300">My Latest Blog Posts</h4>
        <p class="text-slate-400 text-sm mt-2">
            Your latest blog posts will be displayed here automatically after setting up the required GitHub Action.
        </p>
    </div>
    `;
            tempMarkdown = tempMarkdown.replace(/<!-- BLOG-POST-LIST:START -->[\s\S]*<!-- BLOG-POST-LIST:END -->/, placeholderNote);
        }
        
        return tempMarkdown;
    }, [markdown]);

    useEffect(() => {
        const renderMarkdown = async () => {
            const html = await marked.parse(processedMarkdown);
            setRenderedHtml(html);
        };
        renderMarkdown();
    }, [processedMarkdown]);

    useEffect(() => {
        if (copyButtonText === 'Copied!') {
            const timer = setTimeout(() => {
                setCopyButtonText('Copy Markdown');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copyButtonText]);

    const handleCopy = () => {
        navigator.clipboard.writeText(markdown);
        setCopyButtonText('Copied!');
    };

    const TabButton: React.FC<{ tabName: 'visual' | 'code', children: React.ReactNode }> = ({ tabName, children }) => {
        const isActive = activeTab === tabName;
        const classes = isActive 
            ? 'bg-slate-700/50 text-purple-300 border-b-2 border-purple-400'
            : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border-b-2 border-transparent';
        return (
            <button
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-3 font-semibold transition-colors duration-200 -mb-px ${classes}`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-700 bg-slate-900/70 rounded-t-md">
                <div className="flex">
                    <TabButton tabName="visual">Visual</TabButton>
                    <TabButton tabName="code">Code</TabButton>
                </div>
                <div className="pr-3">
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-colors duration-200 text-sm"
                    >
                        {copyButtonText}
                    </button>
                </div>
            </div>
            <div className="p-6 bg-[#0d1117] rounded-b-md">
                {activeTab === 'visual' ? (
                    <div
                        className="prose prose-invert max-w-none 
                                   prose-headings:text-slate-200 prose-h2:mb-4 prose-h3:mb-3 prose-h4:text-slate-300 prose-h4:mb-2
                                   prose-p:text-slate-300 prose-p:my-4
                                   prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                                   prose-img:inline-block prose-img:m-1 prose-img:align-middle
                                   prose-strong:text-slate-200
                                   prose-ul:list-disc prose-ul:pl-6 prose-ul:my-2
                                   prose-li:text-slate-300 prose-li:my-1
                                   prose-li:marker:text-slate-500
                                   prose-ul:prose-li:my-2"
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                    />
                ) : (
                    <pre className="text-slate-300 text-sm whitespace-pre-wrap break-words font-mono">
                        <code>{markdown}</code>
                    </pre>
                )}
            </div>
        </div>
    );
};
