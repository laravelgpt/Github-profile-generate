
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FormPanel } from './components/FormPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { TECH_STACK, PROBLEM_SOLVING_PLATFORMS, INITIAL_FORM_DATA, HEADER_BACKGROUNDS, PROJECT_CATEGORIES, SOCIAL_PLATFORMS } from './constants';
import { FormData, SectionKey, WorkExperience, SocialLink, Project, Volunteering, Award, Publication, Talk, Research, ProjectCategory, Skill, FooterStyle, SocialIconStyle, MainHeaderConfig, ProfileHeaderConfig } from './types';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

    const skillToCategoryMap = useMemo(() => {
        const map = new Map<string, string>();
        Object.entries(TECH_STACK).forEach(([category, skills]) => {
            (skills as Skill[]).forEach(skill => {
                map.set(skill.name, category);
            });
        });
        return map;
    }, []);

    const clearError = useCallback(() => setError(null), []);

    // Generic handler for form fields
    const handleFormChange = useCallback((field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleMainHeaderChange = useCallback((field: keyof MainHeaderConfig, value: any) => {
        setFormData(prev => ({ ...prev, mainHeader: { ...prev.mainHeader, [field]: value } }));
    }, []);
    
    const handleProfileHeaderChange = useCallback((field: keyof ProfileHeaderConfig, value: string) => {
        setFormData(prev => ({ ...prev, profileHeader: { ...prev.profileHeader, [field]: value } }));
    }, []);

    // Generic list manipulation handlers
    const handleListChange = useCallback(<T,>(field: keyof FormData, index: number, itemField: keyof T, value: string) => {
        setFormData(prev => {
            const list = (prev[field] as T[]).map((item, i) =>
                i === index ? { ...item, [itemField]: value } : item
            );
            return { ...prev, [field]: list };
        });
    }, []);
    
    const handleListChangeArray = useCallback(<T,>(field: keyof FormData, index: number, itemField: keyof T, value: string[]) => {
        setFormData(prev => {
            const list = (prev[field] as T[]).map((item, i) =>
                i === index ? { ...item, [itemField]: value } : item
            );
            return { ...prev, [field]: list };
        });
    }, []);
    
    const handleListToggle = useCallback(<T,>(field: keyof FormData, index: number, itemField: keyof T) => {
        setFormData(prev => {
            const list = (prev[field] as any[]).map((item, i) =>
                i === index ? { ...item, [itemField]: !item[itemField] } : item
            );
            return { ...prev, [field]: list };
        });
    }, []);
    
    const handleAdvancedMetricsToggle = useCallback((field: keyof FormData['advancedMetrics']) => {
        setFormData(prev => ({
            ...prev,
            advancedMetrics: {
                ...prev.advancedMetrics,
                [field]: !prev.advancedMetrics[field]
            }
        }));
    }, []);


    const addListItem = useCallback((field: keyof FormData, newItem: any) => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), newItem] }));
    }, []);

    const removeListItem = useCallback((field: keyof FormData, index: number) => {
        setFormData(prev => ({ ...prev, [field]: (prev[field] as any[]).filter((_, i) => i !== index) }));
    }, []);

    const handleSocialLinkPlatformChange = useCallback((index: number, platformName: string) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.name === platformName);
        if (!platform) return;
    
        setFormData(prev => {
            const newSocials = [...prev.socials];
            newSocials[index] = {
                platform: platform.name,
                icon: platform.icon,
                url: platform.baseUrl
            };
            return { ...prev, socials: newSocials };
        });
    }, []);

    const handleTechStackToggle = useCallback((category: string, skillName: string) => {
        setFormData(prev => {
            const currentSkills = prev.techStack[category] || [];
            const newSkills = currentSkills.includes(skillName)
                ? currentSkills.filter(s => s !== skillName)
                : [...currentSkills, skillName];
            return {
                ...prev,
                techStack: { ...prev.techStack, [category]: newSkills }
            };
        });
    }, []);

    const addCustomSkill = useCallback((category: string, skillName: string) => {
        if (!skillName.trim() || (formData.techStack[category] || []).includes(skillName)) return;
        handleTechStackToggle(category, skillName);
    }, [formData.techStack, handleTechStackToggle]);

    const mergeFormData = useCallback((partialData: Partial<FormData>) => {
        setFormData(prev => {
            const newState = { ...prev };
            // Handle nested objects first
            if (partialData.mainHeader) newState.mainHeader = { ...prev.mainHeader, ...partialData.mainHeader };
            if (partialData.profileHeader) newState.profileHeader = { ...prev.profileHeader, ...partialData.profileHeader };
            if (partialData.socialIconStyle) newState.socialIconStyle = { ...prev.socialIconStyle, ...partialData.socialIconStyle };
            if (partialData.advancedMetrics) newState.advancedMetrics = { ...prev.advancedMetrics, ...partialData.advancedMetrics };
            
            if (partialData.techStack) {
                const newTechStack = { ...prev.techStack };
                for (const category in partialData.techStack) {
                    if (Object.prototype.hasOwnProperty.call(partialData.techStack, category)) {
                        const skills = partialData.techStack[category] || [];
                        const existingSkills = newTechStack[category] || [];
                        newTechStack[category] = [...new Set([...existingSkills, ...skills])];
                    }
                }
                newState.techStack = newTechStack;
            }
    
            // Handle other top-level fields
            for (const key of Object.keys(partialData)) {
                const k = key as keyof FormData;
                // Skip already handled fields
                if (['mainHeader', 'profileHeader', 'socialIconStyle', 'advancedMetrics', 'techStack'].includes(k)) continue;
    
                const value = partialData[k];
                if (Array.isArray(value) && value.length > 0) {
                     // @ts-ignore
                    newState[k] = [...(prev[k] || []), ...value.filter(item => item)]; // Append new items
                } else if (value !== null && typeof value !== 'object') {
                     // @ts-ignore
                    newState[k] = value;
                } else if(typeof value === 'object' && !Array.isArray(value) && value !== null) {
                    // @ts-ignore
                    newState[k] = {...prev[k], ...value};
                }
            }
            return newState;
        });
    }, []);

    const handleAnalyzeProfile = useCallback(async (url: string) => {
        if (!url.trim() || !url.includes('github.com')) {
            setError("Please provide a valid GitHub profile URL.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const allSkills = Object.values(TECH_STACK).flat().map(s => s.name);
            const prompt = `Analyze the public GitHub profile at ${url}. Based on the user's pinned repositories, repository names, descriptions, and languages, generate a professional bio and a list of relevant technical skills. 
            
            For the skills, choose only from the following list: ${allSkills.join(', ')}.
            
            Respond ONLY with a valid JSON object containing two keys: "bio" (a string for the 'About Me' section) and "skills" (an array of skill name strings).
            
            Example JSON response:
            {
              "bio": "A passionate full-stack developer with a love for open-source and building innovative web applications.",
              "skills": ["React", "Node.js", "TypeScript", "Python", "Docker"]
            }`;
    
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            
            const jsonString = response.text.match(/\{[\s\S]*\}/)?.[0];
            if (!jsonString) throw new Error("AI response was not in the expected JSON format.");
    
            const parsed = JSON.parse(jsonString);
    
            setFormData(prev => {
                const newTechStack = { ...INITIAL_FORM_DATA.techStack }; // Start fresh
                if (Array.isArray(parsed.skills)) {
                    parsed.skills.forEach((skillName: string) => {
                        const category = skillToCategoryMap.get(skillName);
                        if (category && !newTechStack[category].includes(skillName)) {
                            newTechStack[category].push(skillName);
                        }
                    });
                }
    
                return {
                    ...prev,
                    bio: parsed.bio || prev.bio,
                    techStack: newTechStack,
                };
            });
    
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred while analyzing the profile.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [skillToCategoryMap]);

    const handleGenerateBio = useCallback(async (keywords: string) => {
        if (!keywords.trim()) {
            setError("Please provide some keywords for your bio.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Write a compelling and professional 'About Me' section for a developer's GitHub profile based on these keywords: "${keywords}". The bio should be 2-3 sentences long, have an enthusiastic tone, and use 1-2 relevant emojis. Output only the generated bio text.`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            setFormData(prev => ({ ...prev, bio: response.text.trim() }));
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred while generating the bio.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleGenerateHeaderImage = useCallback(async () => {
        const { mainHeader } = formData;
        if (!mainHeader.aiPrompt) {
            setError("Please provide a prompt for the AI header background.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `A GitHub profile header banner background image, visually appealing and without any text. Prompt: "${mainHeader.aiPrompt}". Style: ${mainHeader.aiStyle}. Effect: ${mainHeader.aiEffect}. Color palette: ${mainHeader.aiColor}. Motion: ${mainHeader.aiMotion}.`;
            
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: mainHeader.aiAspectRatio,
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                handleMainHeaderChange('generatedImageUrl', imageUrl);
            } else {
                throw new Error("AI did not generate an image. Please try a different prompt.");
            }

        } catch (e: any) {
            setError(e.message || "An unexpected error occurred while generating the header image.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [formData.mainHeader, handleMainHeaderChange]);
    
    const handleGenerateWorkDescription = useCallback(async (index: number) => {
        const workItem = formData.workExperience[index];
        if (!workItem.title || !workItem.company) {
            setError("Please provide a Job Title and Company to generate a description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Write 2-3 bullet points for a developer's resume describing their role as a "${workItem.title}" at "${workItem.company}". Focus on achievements and impact, using action verbs. Output only the bullet points.`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            handleListChange<WorkExperience>('workExperience', index, 'description', response.text.trim());
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [formData.workExperience, handleListChange]);
    
    const handleGenerateVolunteeringDescription = useCallback(async (index: number) => {
        const item = formData.volunteering[index];
        if (!item.role || !item.organization) {
            setError("Please provide a Role and Organization to generate a description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Write 1-2 bullet points for a developer's resume describing their volunteer role as a "${item.role}" at "${item.organization}". Focus on contributions and impact. Output only the bullet points.`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            handleListChange<Volunteering>('volunteering', index, 'description', response.text.trim());
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [formData.volunteering, handleListChange]);

     const handleGenerateProjectDescription = useCallback(async (index: number) => {
        const project = formData.projects[index];
        if (!project.name) {
            setError("Please provide a Project Name to generate a description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Write a concise, 1-2 sentence description for a portfolio project named "${project.name}". Mention its core purpose and key technology if relevant (e.g., "${project.tech.join(', ')}"). Output only the description text.`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            handleListChange<Project>('projects', index, 'description', response.text.trim());
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [formData.projects, handleListChange]);
    
    const handleGenerateProjectTechStack = useCallback(async (projectIndex: number) => {
        const project = formData.projects[projectIndex];
        if (!project.repoUrl || !project.repoUrl.includes('github.com')) {
            setError("Please provide a valid GitHub repository URL for the project.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const allSkills = Object.values(TECH_STACK).flat().map(s => s.name);
            const prompt = `Analyze the public GitHub repository at ${project.repoUrl}. Based on the languages and frameworks detected, suggest a list of relevant technical skills.
            
            Choose only from the following list: ${allSkills.join(', ')}.
            
            Respond ONLY with a valid JSON object with a single key "skills" which is an array of skill name strings.
            
            Example JSON response:
            {
              "skills": ["React", "Node.js", "TypeScript", "Tailwind CSS"]
            }`;
    
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const jsonString = response.text.match(/\{[\s\S]*\}/)?.[0];
            if (!jsonString) throw new Error("AI response was not in the expected JSON format.");
            
            const parsed = JSON.parse(jsonString);
    
            if (Array.isArray(parsed.skills)) {
                handleListChangeArray<Project>('projects', projectIndex, 'tech', parsed.skills);
            }
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred while suggesting tech stack.");
        } finally {
            setIsLoading(false);
        }
    }, [formData.projects, handleListChangeArray]);

    const handleAnalyzeProjectUrl = useCallback(async (url: string) => {
        if (!url.trim()) {
            setError("Please provide a URL to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const allSkills = Object.values(TECH_STACK).flat().map(s => s.name);
            const allCategories = PROJECT_CATEGORIES;
    
            const prompt = `Analyze the content at the following URL: ${url}. The URL could be a live project website, a GitHub repository, or something else.
            
            Extract the following information and return it as a valid JSON object:
            1. "name": A concise and suitable name for the project.
            2. "description": A 1-2 sentence summary of the project's purpose.
            3. "thumbnailUrl": The absolute URL of a relevant preview image for the project. Look for 'og:image' meta tags or a prominent image on the page. If none found, return an empty string.
            4. "tech": An array of technology names used in the project. Choose ONLY from this list: ${allSkills.join(', ')}.
            5. "category": The most appropriate category for the project. Choose ONLY ONE from this list: ${allCategories.join(', ')}.
            
            If the URL is a GitHub repository, use the repo name for "name" and its description for "description".
            If the URL is a live website, use its title tag for "name" and meta description for "description".
    
            Respond ONLY with a single, valid JSON object.
            
            Example JSON response:
            {
              "name": "Cool Project",
              "description": "An innovative web application that does amazing things using modern technology.",
              "thumbnailUrl": "https://example.com/images/preview.png",
              "tech": ["React", "Tailwind CSS", "Firebase"],
              "category": "Web Application"
            }`;
    
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const jsonString = response.text.match(/\{[\s\S]*\}/)?.[0];
            if (!jsonString) throw new Error("AI response was not in the expected JSON format.");
    
            const parsed = JSON.parse(jsonString);
    
            const newProject: Project = {
                name: parsed.name || 'Untitled Project',
                description: parsed.description || '',
                liveUrl: !url.includes('github.com') ? url : '',
                repoUrl: url.includes('github.com') ? url : '',
                tech: parsed.tech || [],
                category: parsed.category || 'Web Application',
                thumbnailUrl: parsed.thumbnailUrl || '',
                isTopProject: false,
                customBadges: ''
            };
    
            addListItem('projects', newProject);
    
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred while analyzing the project URL.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [addListItem]);
    
    const handleAnalyzeResume = useCallback(async (resumeText: string) => {
        if (!resumeText.trim()) {
            setError("Please paste your resume text to be analyzed.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const allSkills = Object.values(TECH_STACK).flat().map(s => s.name);
            const prompt = `Analyze the following resume text and extract the information into a structured JSON object.
            
Resume Text: """
${resumeText}
"""

Extract the following information:
1. "name": The full name of the person.
2. "bio": A short, professional bio (2-3 sentences).
3. "workExperience": An array of objects, where each object has "title", "company", "duration", and a "description" with bullet points.
4. "education": An array of objects, where each object has "institution", "degree", and "duration".
5. "skills": An array of skill names. Choose ONLY from this list: ${allSkills.join(', ')}.

Respond ONLY with the valid JSON object.
`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const jsonString = response.text.match(/\{[\s\S]*\}/)?.[0];
            if (!jsonString) throw new Error("AI response was not in the expected JSON format.");
            
            const parsed = JSON.parse(jsonString);

            setFormData(prev => {
                const newTechStack = { ...INITIAL_FORM_DATA.techStack };
                 if (Array.isArray(parsed.skills)) {
                    parsed.skills.forEach((skillName: string) => {
                        const category = skillToCategoryMap.get(skillName);
                        if (category && !newTechStack[category].includes(skillName)) {
                            newTechStack[category].push(skillName);
                        }
                    });
                }

                return {
                    ...prev,
                    name: parsed.name || prev.name,
                    bio: parsed.bio || prev.bio,
                    workExperience: parsed.workExperience || prev.workExperience,
                    education: parsed.education || prev.education,
                    techStack: newTechStack,
                };
            });
            
        } catch(e: any) {
            setError(e.message || "An unexpected error occurred while analyzing the resume.");
        } finally {
            setIsLoading(false);
        }
    }, [skillToCategoryMap]);

    const handleQuickGenerate = useCallback(async (keywords: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an expert assistant for creating GitHub profile READMEs. Based on the user's GitHub username "${formData.githubUser}" and these keywords "${keywords}", generate a complete JSON object that populates all relevant fields for their profile. The JSON object must match the structure of the application's FormData. Include a professional bio, a mission statement, suggest projects based on their likely interests, and fill out other sections creatively. Omit fields you are not confident about. Respond ONLY with the valid, complete JSON object.`;

            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const jsonString = response.text.match(/\{[\s\S]*\}/)?.[0];
            if (!jsonString) throw new Error("AI response was not in the expected JSON format.");

            const parsed = JSON.parse(jsonString);
            setFormData({ ...INITIAL_FORM_DATA, ...parsed });

        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during quick generation.");
        } finally {
            setIsLoading(false);
        }
    }, [formData.githubUser]);

    const handleCustomPromptGenerate = useCallback(async (customPrompt: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an expert assistant for creating GitHub profile READMEs. The user has provided a custom prompt to describe themselves. Based on this prompt, generate a complete JSON object that populates all relevant fields for their profile. The JSON object must match the structure of the application's FormData. User's prompt: """${customPrompt}""". Respond ONLY with the valid, complete JSON object.`;
            
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const jsonString = response.text.match(/\{[\s\S]*\}/)?.[0];
            if (!jsonString) throw new Error("AI response was not in the expected JSON format.");

            const parsed = JSON.parse(jsonString);
            setFormData({ ...INITIAL_FORM_DATA, ...parsed });

        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during custom generation.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFileAnalysis = useCallback(async (file: File, prompt: string) => {
        if (!file || !prompt) {
            setError("Please provide a file and a prompt for analysis.");
            return;
        }
        setIsLoading(true);
        setError(null);
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
            const fileToPart = (file: File): Promise<{inlineData: {mimeType: string, data: string}}> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Data = (reader.result as string).split(',')[1];
                        resolve({
                            inlineData: {
                                mimeType: file.type,
                                data: base64Data,
                            },
                        });
                    };
                    reader.onerror = (err) => reject(err);
                    reader.readAsDataURL(file);
                });
            };
    
            const filePart = await fileToPart(file);
    
            const systemInstruction = `You are an expert assistant for creating GitHub profile READMEs. The user has uploaded a file and provided a prompt. Analyze them and generate a valid JSON object to populate their profile. The JSON object should be a subset of the main data structure. You can populate fields like "bio", "name", "workExperience", "education", "projects", and "techStack". For "techStack", categorize skills into appropriate categories. For arrays like "workExperience", create complete array items. Respond ONLY with the valid JSON object.`;
    
            const contents = {
                parts: [
                    filePart,
                    { text: `User prompt: "${prompt}"` }
                ]
            };
    
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                }
            });
    
            const jsonString = response.text.match(/\{[\s\S]*\}/)?.[0];
            if (!jsonString) throw new Error("AI response was not in the expected JSON format.");
    
            const parsed = JSON.parse(jsonString);
            mergeFormData(parsed);
    
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during file analysis.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [mergeFormData]);

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target?.result as string);
                    // Merge deeply to preserve structure of nested objects
                    const mergedData = { ...INITIAL_FORM_DATA, ...importedData };
                    setFormData(mergedData);
                } catch (err) {
                    setError('Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(formData, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "readme-config.json";
        link.click();
    };
    
    const handleResetToDefaults = useCallback(() => {
        if (window.confirm("Are you sure you want to reset all fields to their default values? This cannot be undone.")) {
            setFormData(INITIAL_FORM_DATA);
            setError(null);
        }
    }, []);
    
    const renderers = useMemo(() => {
        const renderProject = (p: Project) => {
            const { projectStyle } = formData;
            
            let header = `**${p.name}**`;
            if (p.repoUrl || p.liveUrl) {
                header += ` - ${p.repoUrl ? `[Repo](${p.repoUrl})` : ''} ${p.repoUrl && p.liveUrl ? ' | ' : ''} ${p.liveUrl ? `[Live Demo](${p.liveUrl})` : ''}`;
            }
            
            if (projectStyle === 'box') {
                let techLine = '';
                if (p.tech.length > 0) {
                    techLine = `<p><i>Tech: ${p.tech.join(', ')}</i></p>`;
                }
                const customBadgesLine = p.customBadges ? `<p>${p.customBadges}</p>` : '';
        
                let content;
                if (p.thumbnailUrl) {
                    content = `
          <br>
          <table>
            <tr>
              <td width="250" valign="top">
                <a href="${p.liveUrl || p.repoUrl || '#'}" target="_blank" rel="noopener noreferrer">
                  <img src="${p.thumbnailUrl}" alt="${p.name} thumbnail" width="250" />
                </a>
              </td>
              <td valign="top">
                <p>${p.description}</p>
                <br />
                ${techLine}
                ${customBadgesLine}
              </td>
            </tr>
          </table>
        `;
                } else {
                    content = `
          <br>
          ${p.description}
          <br><br>
          ${techLine.replace(/<.+?>/g, '')}
          <br><br>
          ${customBadgesLine.replace(/<.+?>/g, '')}
        `;
                }
        
                return `
        <details>
          <summary>${header}</summary>
          ${content}
        </details>`.trim();
            }
        
            // Default list style
            let techLine = '';
            if (p.tech.length > 0) {
                techLine = `\n  - _Tech: ${p.tech.join(', ')}_`;
            }
            const customBadgesLine = p.customBadges ? `\n  - ${p.customBadges}` : '';
        
            return `- ${header}\n  - ${p.description}${techLine}${customBadgesLine}`;
        };
        
        return {
            mainHeaderBanner: () => {
                const { enabled, title, subtitle, generatedImageUrl, aiAspectRatio } = formData.mainHeader;
                if (!enabled) return '';
            
                const [arW, arH] = aiAspectRatio.split(':').map(Number);
                const width = 1200;
                const height = Math.round((width / arW) * arH);
                const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <style>
    .title { font: 600 60px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: #fff; text-shadow: 2px 2px 6px rgba(0,0,0,0.8); }
    .subtitle { font: 400 30px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: #e0e0e0; text-shadow: 1px 1px 4px rgba(0,0,0,0.9); }
  </style>
  ${generatedImageUrl ? `<image href="${generatedImageUrl}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />` : `<rect width="${width}" height="${height}" fill="#0d1117" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="subtitle">Generate an AI image to see it here</text>`}
  <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.25)"/>
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" class="title">${title}</text>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" class="subtitle">${subtitle}</text>
</svg>
                `.trim();
                const base64Svg = btoa(unescape(encodeURIComponent(svg)));
                return `![Main Banner](data:image/svg+xml;base64,${base64Svg})`;
            },
            profileHeaderBanner: () => {
                const { enabled, title, subtitle, background } = formData.profileHeader;
                if (!enabled) return '';

                const bgConfig = HEADER_BACKGROUNDS[background] || HEADER_BACKGROUNDS['gradient-1'];
                const { svgDefs, fill, bgColor } = bgConfig;
                
                const svg = `
<svg width="800" height="200" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: 600 45px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
    .subtitle { font: 400 22px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: #c9d1d9; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
  </style>
  <defs>${svgDefs}</defs>
  <rect width="800" height="200" fill="${bgColor}"/>
  <rect width="800" height="200" fill="${fill}"/>
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" class="title">${title} ${formData.name}</text>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" class="subtitle">${subtitle}</text>
</svg>
                `.trim();
                const base64Svg = btoa(unescape(encodeURIComponent(svg)));
                return `![Profile Header](data:image/svg+xml;base64,${base64Svg})`;
            },
            basicInfo: () => `## Hi there 👋\n\n${formData.bio}`,
            myMission: () => formData.myMission ? `### 🎯 My Mission\n\n${formData.myMission}` : '',
            socials: () => {
                const { socials, socialStyle, socialIconStyle } = formData;
                const visibleSocials = socials.filter(s => s.url && s.platform);
                if (visibleSocials.length === 0) return '';
            
                let content = '';
                const getPlatformInfo = (platformName: string) => SOCIAL_PLATFORMS.find(p => p.name === platformName);
            
                switch (socialStyle) {
                    case 'badge':
                        content = visibleSocials.map(s => {
                            const info = getPlatformInfo(s.platform);
                            const color = info?.color || '0D1117';
                            const logo = info?.icon || s.icon;
                            return `[![${s.platform}](https://img.shields.io/badge/${encodeURIComponent(s.platform)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white)](${s.url})`;
                        }).join(' ');
                        break;
                    case 'icon':
                        const { size, backgroundColor, borderWidth, borderColor, borderRadius } = socialIconStyle;
                        const styles = `display: inline-block; vertical-align: middle; padding: ${Math.round(size * 0.1)}px; background-color: #${backgroundColor}; border: ${borderWidth}px solid #${borderColor}; border-radius: ${borderRadius}px; margin: 4px; line-height: 0;`;
                        content = visibleSocials.map(s => {
                            const info = getPlatformInfo(s.platform);
                            const logo = info?.icon || s.icon;
                            return `<a href="${s.url}" target="_blank" rel="noopener noreferrer" style="${styles}"><img src="https://cdn.jsdelivr.net/npm/simple-icons/icons/${logo}.svg" alt="${s.platform}" height="${size}" width="${size}" /></a>`;
                        }).join(' \n');
                        content = `<p align="left">${content}</p>`;
                        break;
                    case 'list':
                        const { size: listSize, backgroundColor: listBg, borderWidth: listBw, borderColor: listBc, borderRadius: listBr } = socialIconStyle;
                        const iconSize = Math.round(listSize * 0.6);
                        const containerPadding = Math.round(listSize * 0.1);
                        const listIconContainerStyles = `display: inline-block; vertical-align: middle; padding: ${containerPadding}px; background-color: #${listBg}; border: ${listBw}px solid #${listBc}; border-radius: ${listBr}px; margin-right: 8px; line-height: 0;`;

                        content = visibleSocials.map(s => {
                            const info = getPlatformInfo(s.platform);
                            const logo = info?.icon || s.icon;
                            const iconHtml = `<span style="${listIconContainerStyles}"><img src="https://cdn.jsdelivr.net/npm/simple-icons/icons/${logo}.svg" height="${iconSize}" width="${iconSize}" alt="${s.platform}" /></span>`;
                            return `- ${iconHtml} [${s.platform}](${s.url})`;
                        }).join('\n');
                        break;
                    default:
                         content = visibleSocials.map(s => `[![${s.platform}](https://img.shields.io/badge/${s.platform}-0D1117?style=for-the-badge&logo=${s.icon}&logoColor=white)](${s.url})`).join(' ');
                }
                
                return content ? `### 🤝 Let's Connect\n\n${content}` : '';
            },
            workExperience: () => {
                const content = formData.workExperience.filter(w => w.title && w.company).map(w => 
                    `**${w.title}** at **${w.company}** (_${w.duration}_)\n${w.description ? w.description.split('\n').map(line => `- ${line.trim()}`).join('\n') : ''}`
                ).join('\n\n');
                return content ? `### 💼 Work Experience\n\n${content}` : '';
            },
            volunteering: () => {
                 const content = formData.volunteering.filter(v => v.organization && v.role).map(v => 
                    `**${v.role}** at **${v.organization}** (_${v.duration}_)\n${v.description ? v.description.split('\n').map(line => `- ${line.trim()}`).join('\n') : ''}`
                ).join('\n\n');
                return content ? `### 🤝 Volunteering\n\n${content}` : '';
            },
            projects: () => {
                const projectsByCategory = formData.projects.reduce((acc, p) => {
                    if (p.name && !p.isTopProject) { // Exclude top projects
                        (acc[p.category] = acc[p.category] || []).push(p);
                    }
                    return acc;
                }, {} as Record<ProjectCategory, Project[]>);

                if (Object.keys(projectsByCategory).length === 0) return '';
                
                let content = `### 💻 All My Projects\n\n`;
                for (const category of PROJECT_CATEGORIES) {
                    if (projectsByCategory[category] && projectsByCategory[category].length > 0) {
                        content += `#### ${category}\n`;
                        content += projectsByCategory[category].map(renderProject).join(formData.projectStyle === 'list' ? '\n' : '\n\n');
                        content += '\n';
                    }
                }
                return content.trim();
            },
            featuredProjects: () => {
                const top = formData.projects.filter(p => p.isTopProject && p.name);
                if (top.length === 0) return '';
                const content = top.map(renderProject).join(formData.projectStyle === 'list' ? '\n' : '\n\n');
                return `### 🚀 Featured Projects\n\n${content}`;
            },
            education: () => {
                const content = formData.education.filter(e => e.institution).map(e =>
                    `- **${e.degree || 'Degree'}** from **${e.institution}** (_${e.duration || 'Year'}_)`
                ).join('\n');
                return content ? `### 🎓 Education\n\n${content}` : '';
            },
            certifications: () => {
                const content = formData.certifications.filter(c => c.name).map(c => {
                    const link = c.url ? `[${c.name}](${c.url})` : c.name;
                    return `- **${link}** from _${c.issuer}_ (${c.date})`
                }).join('\n');
                return content ? `### 📜 Certifications\n\n${content}`: '';
            },
            research: () => {
                 const content = formData.research.filter(r => r.title).map(r =>
                    `- **[${r.title}](${r.url})** - _${r.publication}_ (${r.date})\n  - ${r.description}`
                ).join('\n\n');
                return content ? `### 🔬 Research\n\n${content}`: '';
            },
             awards: () => {
                const content = formData.awards.filter(a => a.name).map(a =>
                    `- **${a.name}** from _${a.issuer}_ (${a.date})`
                ).join('\n');
                return content ? `### 🏆 Awards & Recognition\n\n${content}`: '';
            },
            publications: () => {
                const content = formData.publications.filter(p => p.title).map(p =>
                    `- [${p.title}](${p.url}) - _${p.journal}_ (${p.date})`
                ).join('\n');
                return content ? `### 📚 Publications\n\n${content}`: '';
            },
            talks: () => {
                const content = formData.talks.filter(t => t.title).map(t =>
                    `- [${t.title}](${t.url}) at **${t.event}** (${t.date})`
                ).join('\n');
                return content ? `### 🎤 Talks & Presentations\n\n${content}`: '';
            },
            languages: () => formData.languages.length > 0 ? `### 🗣️ Languages\n\n- ${formData.languages.join('\n- ')}` : '',
            hobbies: () => formData.hobbies.length > 0 ? `### 🎨 Hobbies & Interests\n\n- ${formData.hobbies.join('\n- ')}` : '',
            techStack: () => {
                const { techStack, skillStyle, badgeColor } = formData;
                const hasSkills = Object.values(techStack).some(categorySkills => categorySkills.length > 0);
                if (!hasSkills) return '';
    
                let markdown = `### 🛠️ My Tech Stack\n\n`;
                for (const category in techStack) {
                    const skills = techStack[category];
                    if (skills.length === 0) continue;
                    
                    markdown += `#### ${category}\n`;
                    const allSkillsData = TECH_STACK[category] || [];
                    const skillDataMap = new Map(allSkillsData.map(s => [s.name, s]));
                    
                    if (skillStyle.startsWith('badge')) {
                        const styleName = skillStyle.replace('badge-', ''); // 'badge' becomes 'for-the-badge' implicitly later, others are explicit
                        const shieldStyle = styleName === 'badge' ? 'for-the-badge' : styleName;
                        const badgeMarkdown = skills.map(name => {
                            const skillInfo = skillDataMap.get(name);
                            const logo = skillInfo ? skillInfo.deviconName.replace(/-plain|-original|-wordmark/g, '') : name.toLowerCase().replace(/ /g, '-');
                            return `  <a href="#"><img src="https://img.shields.io/badge/${encodeURIComponent(name)}-${badgeColor}?style=${shieldStyle}&logo=${logo}&logoColor=white" alt="${name}"/></a>\n`;
                        }).join('');
                        markdown += `<p align="left">\n${badgeMarkdown}</p>\n\n`;
                    } else if (skillStyle === 'icon' || skillStyle === 'icon-grid') {
                         const iconsMarkdown = skills.map(name => {
                            const skillInfo = skillDataMap.get(name);
                            if (!skillInfo?.deviconName) return `  <a href="#" style="display: inline-block; text-align: center; width: 52px; vertical-align: top; margin: 4px; text-decoration: none;">\n    <div style="height: 40px; width: 52px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 11px; color: #c9d1d9; word-break: break-all; line-height: 1.2;">${name}</div>\n  </a>\n`;
                            return `  <a href="#"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skillInfo.deviconName.split('-')[0]}/${skillInfo.deviconName}.svg" height="40" width="52" alt="${name} icon"/></a>\n`;
                        }).join('');
                        markdown += `<p align="left">\n${iconsMarkdown}</p>\n\n`;
                    } else if (skillStyle === 'star') {
                        const starsMarkdown = skills.map(name => {
                            const skillInfo = skillDataMap.get(name);
                            const iconHtml = (skillInfo?.deviconName) 
                                ? `    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skillInfo.deviconName.split('-')[0]}/${skillInfo.deviconName}.svg" height="40" width="40" alt="${name} icon"/>\n`
                                : `    <div style="height: 40px; width: 40px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 11px; color: #c9d1d9; word-break: break-all; line-height: 1.2;">${name}</div>\n`;
                            
                            return `  <a href="#" style="display: inline-block; text-align: center; width: 90px; vertical-align: top; margin: 10px; text-decoration: none;">\n` +
                                   iconHtml +
                                   `    <br><sub style="font-size: 12px; color: #c9d1d9;">${name}</sub>\n  </a>\n`;
                        }).join('');
                        markdown += `<p align="center">\n${starsMarkdown}</p>\n\n`;
                    } else if (skillStyle === 'icon-text') {
                        const listItems = skills.map(name => {
                            const skillInfo = skillDataMap.get(name);
                            if (skillInfo?.deviconName) {
                                return `- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skillInfo.deviconName.split('-')[0]}/${skillInfo.deviconName}.svg" height="20" width="20" alt="${name} icon" style="vertical-align: middle; margin-right: 5px;"/> ${name}`;
                            }
                            return `- ${name}`;
                        }).join('\n');
                        markdown += `${listItems}\n\n`;
                     } else if (skillStyle === 'table') {
                        let table = '| Icon | Name |\n|:---:|:---:|\n';
                        table += skills.map(name => {
                            const skillInfo = skillDataMap.get(name);
                             if (skillInfo?.deviconName) {
                                return `| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skillInfo.deviconName.split('-')[0]}/${skillInfo.deviconName}.svg" height="25" width="25" alt="${name} icon" /> | ${name} |`;
                            }
                            return `| | ${name} |`;
                        }).join('\n');
                        markdown += table + '\n\n';
                    } else if (skillStyle === 'pills') {
                         const pillsMarkdown = skills.map(name => {
                            return `  <a href="#"><img src="https://img.shields.io/badge/${encodeURIComponent(name)}-${badgeColor}?style=flat&logoColor=white" alt="${name}"/></a>\n`;
                        }).join('');
                        markdown += `<p align="left">\n${pillsMarkdown}</p>\n\n`;
                    } else if (skillStyle === 'list-bullet') {
                        markdown += skills.map(s => `- ${s}`).join('\n') + '\n\n';
                    } else if (skillStyle === 'list-comma') {
                        markdown += skills.join(', ') + '\n\n';
                    } else if (skillStyle === 'list-dot') {
                        markdown += skills.join(' &nbsp;•&nbsp; ') + '\n\n';
                    } else if (skillStyle === 'list-pipe') {
                        markdown += skills.join(' | ') + '\n\n';
                    } else if (skillStyle === 'list-newline') {
                        markdown += skills.join('<br>') + '\n\n';
                    } else { // Default to 'badge'
                        const badgeMarkdown = skills.map(name => {
                            const skillInfo = skillDataMap.get(name);
                            const logo = skillInfo ? skillInfo.deviconName.replace(/-plain|-original|-wordmark/g, '') : name.toLowerCase().replace(/ /g, '-');
                            return `  <a href="#"><img src="https://img.shields.io/badge/${encodeURIComponent(name)}-${badgeColor}?style=for-the-badge&logo=${logo}&logoColor=white" alt="${name}"/></a>\n`;
                        }).join('');
                        markdown += `<p align="left">\n${badgeMarkdown}</p>\n\n`;
                    }
                }
                return markdown.trim();
            },
            hackathons: () => {
                 const content = formData.hackathons.filter(h => h.name).map(h => 
                    `- **${h.name}**${h.description ? `\n  - ${h.description}` : ''}${h.link ? `\n  - [Project Link](${h.link})` : ''}`
                 ).join('\n');
                 return content ? `### 🏆 Hackathons\n\n${content}`: '';
            },
            problemSolving: () => {
                const content = formData.problemSolving.filter(p => p.username).map(p => {
                    const platformInfo = PROBLEM_SOLVING_PLATFORMS.find(pl => pl.name === p.platform);
                    return platformInfo ? `[![${p.platform}](https://img.shields.io/badge/${p.platform}-0D1117?style=for-the-badge&logo=${platformInfo.icon}&logoColor=white)](${platformInfo.url}${p.username})` : '';
                }).join(' ');
                return content ? `### 🚀 Problem Solving\n\n${content}` : '';
            },
            supportMe: () => {
                const supportLinks = [
                    formData.buyMeACoffee && `[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/${formData.buyMeACoffee})`,
                    formData.kofi && `[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/${formData.kofi})`
                ].filter(Boolean).join(' ');
                return supportLinks ? `### 🙏 Support Me\n\n${supportLinks}` : '';
            },
            blogPosts: () => formData.blogUrl ? `### 📰 My Latest Blog Posts\n\n<!-- BLOG-POST-LIST:START -->\n<!-- BLOG-POST-LIST:END -->` : '',
            githubAnalytics: () => {
                const { githubUser, showActivityGraph, showWakatimeChart, wakatimeUser, statsTheme, showBorder, borderRadius, borderColor } = formData;
                if (!githubUser) return '';
    
                let content = '';
                const accentColor = 'a855f7';
                if (showActivityGraph) content += `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${githubUser}&bg_color=0d1117&color=ffffff&line=${accentColor}&point=ffffff&area=true&hide_border=true" alt="GitHub Activity Graph" />\n`;
                if (showWakatimeChart && wakatimeUser) content += `<img src="https://github-readme-stats.vercel.app/api/wakatime?username=${wakatimeUser}&theme=${statsTheme}&hide_border=${!showBorder}&layout=compact&bg_color=0d1117&border_radius=${borderRadius}&border_color=${borderColor}" alt="WakaTime Chart" />\n`;
                
                return content ? `### 📊 GitHub Analytics\n\n<p align="center">\n${content.split('\n').filter(Boolean).map(item => `  ${item}`).join('\n')}\n</p>` : '';
            },
            githubStats: () => {
                const { githubUser, showVisitors, showStats, showTopLangs, showTrophies, showStreakStats, showWakatimeBadge, wakatimeUser, statsTheme, showBorder, borderRadius, showProfileSummary, showProductiveTime, githubUtcOffset, showPinnedRepos, statsCardType, advancedMetrics, borderColor } = formData;
                if (!githubUser) return '';
    
                if (statsCardType === 'advanced') {
                    let metricsUrl = `https://metrics.lecoq.io/${githubUser}?template=classic&theme=${statsTheme}&config.timezone=${githubUtcOffset}`;
                    metricsUrl += `&base.header=true&base.activity=true&base.community=true&base.repositories=true&base.metadata=false`;
    
                    if (advancedMetrics.languages) {
                        metricsUrl += '&languages=true&languages.limit=8&languages.sections=most-used&languages.indepth=true&languages.details=bytes-size,percentage&languages.colors=github';
                    }
                    if (advancedMetrics.habits) {
                        metricsUrl += '&habits=true&habits.from=200&habits.charts=true&habits.trim=true';
                    }
                    if (advancedMetrics.isocalendar) {
                        metricsUrl += '&isocalendar=true&isocalendar.duration=half-year';
                    }
                    if (advancedMetrics.skyline) {
                        metricsUrl += '&skyline=true';
                    }
    
                    const content = `<img src="${metricsUrl}" alt="GitHub Metrics" />`;
                    return `### 📊 My GitHub Stats & Insights\n\n<p align="center">\n  ${content}\n</p>`;
                }
                
                // Standard cards logic
                const accentColor = 'a855f7'; // purple-500
                const statsParams = `&theme=${statsTheme}&hide_border=${!showBorder}&border_radius=${borderRadius}&show_icons=true&count_private=true&bg_color=0d1117&text_color=c9d1d9&title_color=${accentColor}&icon_color=${accentColor}&border_color=${borderColor}`;
                
                const summaryCardBaseUrl = `https://github-profile-summary-cards.vercel.app/api/cards`;

                let content = '';
                if (showVisitors) content += `<img src="https://komarev.com/ghpvc/?username=${githubUser}&label=Profile%20Visitors&color=a855f7&style=flat" alt="Profile Visitors" />\n`;
                if (showPinnedRepos) content += `<!-- PINNED-REPOS-START -->\n<!-- PINNED-REPOS-END -->\n`;
                if (showStats) content += `<img src="https://github-readme-stats.vercel.app/api?username=${githubUser}${statsParams}" alt="GitHub Stats" />\n`;
                if (showProfileSummary) content += `<img src="${summaryCardBaseUrl}/profile-details?username=${githubUser}&theme=${statsTheme}" alt="GitHub Profile Summary" />\n`;
                if (showTopLangs) content += `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}${statsParams}&layout=compact" alt="Top Languages" />\n`;
                if (showProductiveTime) content += `<img src="${summaryCardBaseUrl}/productive-time?username=${githubUser}&theme=${statsTheme}&utcOffset=${githubUtcOffset}" alt="Productive Time" />\n`;
                if (showStreakStats) content += `<img src="https://github-readme-streak-stats.herokuapp.com?user=${githubUser}&theme=${statsTheme}&hide_border=${!showBorder}&background=0d1117&border=${borderColor}&stroke=${accentColor}&ring=${accentColor}&fire=${accentColor}&currStreakNum=ffffff&sideNums=ffffff&currStreakLabel=ffffff&sideLabels=ffffff&dates=ffffff" alt="GitHub Streak" />\n`;
                if (showTrophies) content += `<img src="https://github-profile-trophy.vercel.app/?username=${githubUser}&theme=dracula&no-frame=true&no-bg=true&margin-w=4" alt="GitHub Trophies" />\n`;
                if (showWakatimeBadge && wakatimeUser) content += `\n[![WakaTime](https://wakatime.com/badge/user/${wakatimeUser}.svg)](https://wakatime.com/@${wakatimeUser})\n`;
                
                return content ? `### 📊 My GitHub Stats\n\n<p align="center">\n${content.split('\n').filter(Boolean).map(item => `  ${item}`).join('\n')}\n</p>` : '';
            },
            footer: () => {
                const { footerText, footerStyle, footerCardWidth, footerCardBorderRadius, footerCardBorderColor } = formData;
                if (!footerText) return '';
    
                if (footerStyle === 'card') {
                    const cardStyles = `width: ${footerCardWidth}%; margin: 20px auto; padding: 15px; border: 2px solid #${footerCardBorderColor}; border-radius: ${footerCardBorderRadius}px; background-color: #161b22; text-align: center;`;
                    return `<div align="center">\n  <div style="${cardStyles}">\n    ${footerText}\n  </div>\n</div>`;
                }
                
                if (footerStyle === 'centered') {
                    return `<p align="center">${footerText}</p>`;
                }

                // Default 'simple' style
                return `\n---\n\n<p align="center">${footerText}</p>`;
            },
            customHtml: () => formData.customHtml
        };
    }, [formData]);


    const markdown = useMemo(() => {
        const sections = formData.sectionOrder
            .map(key => renderers[key as keyof typeof renderers]?.())
            .filter(Boolean); // Filter out empty sections
        
        let rawMd = sections.join('\n\n---\n\n');

        // Post-processing for conditional sections that depend on GitHub actions
        if (!formData.githubUser || !formData.showPinnedRepos) {
            rawMd = rawMd.replace(/<!-- PINNED-REPOS-START -->[\s\S]*<!-- PINNED-REPOS-END -->/g, '');
        } else if (rawMd.includes('<!-- PINNED-REPOS-START -->')) {
            const replacement = `[![Top Repos](https://github-readme-pinned-repos.vercel.app/?username=${formData.githubUser})](https://github.com/${formData.githubUser})`;
             rawMd = rawMd.replace(/<!-- PINNED-REPOS-START -->[\s\S]*<!-- PINNED-REPOS-END -->/g, replacement);
        }
        
        return rawMd.replace(/(\n\n---\n\n)+/g, '\n\n---\n\n').trim();
    }, [formData, renderers]);

    const formActions = {
        handleFormChange,
        handleMainHeaderChange,
        handleProfileHeaderChange,
        addListItem,
        removeListItem,
        handleListChange,
        handleListChangeArray,
        handleListToggle,
        handleAdvancedMetricsToggle,
        onTechStackToggle: handleTechStackToggle,
        addCustomSkill,
        onAnalyzeProfile: handleAnalyzeProfile,
        onGenerateBio: handleGenerateBio,
        handleGenerateHeaderImage,
        handleGenerateWorkDescription,
        handleGenerateProjectDescription,
        handleGenerateProjectTechStack,
        handleAnalyzeProjectUrl,
        handleGenerateVolunteeringDescription,
        handleAnalyzeResume,
        handleQuickGenerate,
        handleCustomPromptGenerate,
        handleFileAnalysis,
        handleImport,
        handleExport,
        handleResetToDefaults,
        handleSocialLinkPlatformChange,
        clearError,
    };

    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8 max-w-screen-2xl mx-auto">
            <div className="lg:order-1">
                <FormPanel
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
                    actions={formActions}
                />
            </div>
            <div className="lg:order-2">
                <PreviewPanel markdown={markdown} />
            </div>
        </main>
    );
};

export default App;
