import React from 'react';
import { Skill } from '../types';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
    <div className={props.className}>
        {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
        <input
            {...props}
            className="w-full bg-slate-900/80 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition disabled:bg-slate-800 disabled:cursor-not-allowed"
        />
    </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, children, ...props }) => (
     <div className={props.className}>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select
            {...props}
            className="w-full bg-slate-900/80 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition disabled:bg-slate-800 disabled:cursor-not-allowed"
        >
            {children}
        </select>
    </div>
);


interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ label, ...props }) => (
    <div className={props.className}>
        {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
        <textarea
            {...props}
            rows={props.rows || 3}
            className="w-full bg-slate-900/80 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition disabled:bg-slate-800 disabled:cursor-not-allowed"
        />
    </div>
);

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, ...props }) => (
    <label className={`flex items-center space-x-3 ${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
            type="checkbox"
            {...props}
            className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-purple-600 focus:ring-purple-600 focus:ring-offset-slate-900 disabled:opacity-50"
        />
        <span className={`text-slate-300 ${props.disabled ? 'opacity-50' : ''}`}>{label}</span>
    </label>
);


interface SkillButtonProps {
    skill: Partial<Skill> & { name: string };
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export const SkillButton: React.FC<SkillButtonProps> = ({ skill, isSelected, onClick, disabled }) => {
    const selectedClasses = 'bg-purple-500/20 border-purple-400 text-purple-300 ring-1 ring-purple-500';
    const unselectedClasses = 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isSelected ? selectedClasses : unselectedClasses}`}
        >
            {skill.name}
        </button>
    );
};

export const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
);

export const RemoveButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <button
        type="button"
        {...props}
        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Remove item"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    </button>
);

export const AiButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button 
        type="button" 
        {...props} 
        className="flex-shrink-0 px-3 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        {props.disabled ? <Spinner /> : children}
    </button>
);

export const DraggableHandle: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 cursor-grab active:cursor-grabbing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

interface ColorFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const ColorField: React.FC<ColorFieldProps> = ({ label, ...props }) => {
    const stringValue = typeof props.value === 'string' ? props.value : '';

    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <div className="relative h-10">
                 <input
                    type="color"
                    {...props}
                    value={`#${stringValue}`}
                    // A neat trick to style the native color picker: make it transparent and overlay it on a styled div.
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="w-full h-full bg-slate-900/80 border border-slate-600 rounded-md px-3 flex items-center justify-between pointer-events-none" style={{ backgroundColor: props.disabled ? '#334155' : `#${stringValue}` }}>
                    <span className="font-mono text-white mix-blend-difference">{`#${stringValue.toUpperCase()}`}</span>
                </div>
            </div>
        </div>
    );
};