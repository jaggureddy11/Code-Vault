import { useState, Suspense, lazy } from 'react';
import { Loader2, Maximize2, Minimize2, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const COMPILER_LANGUAGES = {
    javascript: { name: 'JavaScript', id: 93, defaultCode: 'console.log("Hello from JavaScript!");' },
    typescript: { name: 'TypeScript', id: 94, defaultCode: 'const message: string = "Hello from TypeScript!";\nconsole.log(message);' },
    python: { name: 'Python', id: 92, defaultCode: 'def main():\n    print("Hello from Python!")\n\nif __name__ == "__main__":\n    main()' },
    java: { name: 'Java', id: 91, defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}' },
    go: { name: 'Go', id: 95, defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}' },
    rust: { name: 'Rust', id: 73, defaultCode: 'fn main() {\n    println!("Hello from Rust!");\n}' },
    cpp: { name: 'C++', id: 54, defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!\\n";\n    return 0;\n}' },
    csharp: { name: 'C#', id: 51, defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C#!");\n    }\n}' },
    php: { name: 'PHP', id: 68, defaultCode: '<?php\n\necho "Hello from PHP!";\n?>' },
    ruby: { name: 'Ruby', id: 72, defaultCode: 'puts "Hello from Ruby!"' },
    swift: { name: 'Swift', id: 83, defaultCode: 'print("Hello from Swift!")' },
    kotlin: { name: 'Kotlin', id: 78, defaultCode: 'fun main() {\n    println("Hello from Kotlin!")\n}' },
    bash: { name: 'Bash', id: 46, defaultCode: '#!/bin/bash\n\necho "Hello from Bash!"' }
};

const LANGUAGE_ICONS: Record<string, { color: string; label: string; file: string }> = {
    javascript: { color: '#F7DF1E', label: 'JS', file: 'main.js' },
    typescript: { color: '#3178C6', label: 'TS', file: 'main.ts' },
    python: { color: '#3776AB', label: 'PY', file: 'main.py' },
    java: { color: '#b07219', label: 'JA', file: 'Main.java' },
    go: { color: '#00ADD8', label: 'GO', file: 'main.go' },
    rust: { color: '#dea584', label: 'RS', file: 'main.rs' },
    cpp: { color: '#00599C', label: 'C++', file: 'main.cpp' },
    csharp: { color: '#239120', label: 'C#', file: 'Program.cs' },
    php: { color: '#777BB4', label: 'PHP', file: 'main.php' },
    ruby: { color: '#CC342D', label: 'RB', file: 'main.rb' },
    swift: { color: '#F05138', label: 'SW', file: 'main.swift' },
    kotlin: { color: '#7F52FF', label: 'KT', file: 'main.kt' },
    bash: { color: '#4EAA25', label: 'SH', file: 'main.sh' }
};

type LanguageKey = keyof typeof COMPILER_LANGUAGES;

export default function CompilerPage() {
    const { theme } = useTheme();
    const [language, setLanguage] = useState<LanguageKey>('javascript');
    const [code, setCode] = useState(COMPILER_LANGUAGES['javascript'].defaultCode);
    const [output, setOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleLanguageChange = (newLanguage: string) => {
        if (newLanguage in COMPILER_LANGUAGES) {
            const langKey = newLanguage as LanguageKey;
            setLanguage(langKey);
            setCode(COMPILER_LANGUAGES[langKey].defaultCode);
            setOutput('');
        }
    };

    const runCode = async () => {
        setIsLoading(true);
        setOutput('Executing code...');
        try {
            const langConfig = COMPILER_LANGUAGES[language];
            const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_code: code,
                    language_id: langConfig.id
                }),
            });
            const data = await response.json();

            if (response.ok) {
                if (data.compile_output) {
                    setOutput(data.compile_output);
                } else if (data.stderr) {
                    setOutput(data.stderr + (data.stdout ? '\n' + data.stdout : ''));
                } else {
                    setOutput(data.stdout || 'Execution complete. No output.');
                }
            } else {
                setOutput('Error: ' + (data.error || data.message || 'Execution failed. Please try again.'));
            }
        } catch (error) {
            setOutput('Error compounding network request. Please check your connection or CORS status.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
    };

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on' as const,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontFamily: "'JetBrains Mono', monospace",
        padding: { top: 16, bottom: 16 },
        roundedSelection: false,
        cursorSmoothCaretAnimation: 'on' as const,
        smoothScrolling: true,
        wordWrap: 'on' as const,
        theme: theme === 'dark' ? 'vs-dark' : 'light',
    };

    return (
        <div className={cn(
            "transition-all duration-300 bg-white dark:bg-black",
            isFullscreen ? "fixed inset-0 z-[200] p-4 flex flex-col pt-4" : "flex flex-col h-[calc(100vh)] pt-24 pb-8 px-4 sm:px-8 max-w-[1800px] mx-auto w-full"
        )}>
            {/* Main Window Frame */}
            <div className="flex flex-1 border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">

                {/* Left Sidebar (Desktop) */}
                <div className="w-16 border-r-2 border-black/10 dark:border-white/10 flex-col overflow-y-auto hidden md:flex custom-scrollbar bg-neutral-50 dark:bg-neutral-900/50">
                    {Object.entries(COMPILER_LANGUAGES).map(([key]) => {
                        const icon = LANGUAGE_ICONS[key];
                        const isActive = language === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleLanguageChange(key)}
                                className={cn(
                                    "flex-shrink-0 h-16 w-full flex items-center justify-center transition-all group border-b-2 border-black/5 dark:border-white/5 relative",
                                    isActive ? "bg-white dark:bg-black" : "hover:bg-black/5 dark:hover:bg-white/5"
                                )}
                            >
                                {/* Active Indicator line */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: icon.color }} />
                                )}

                                <span
                                    className={cn(
                                        "text-sm font-black tracking-tighter transition-all duration-300",
                                        isActive ? "scale-110" : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                                    )}
                                    style={{ color: icon.color }}
                                >
                                    {icon.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Top Control Bar */}
                    <div className="h-14 flex items-center justify-between px-4 border-b-2 border-black/10 dark:border-white/10 bg-white dark:bg-black">

                        {/* Mobile Language Selector */}
                        <div className="md:hidden">
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="h-8 w-32 rounded-none border-2 border-black dark:border-white bg-transparent font-black italic uppercase text-[10px] tracking-widest">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-2 border-black dark:border-white bg-white dark:bg-black max-h-64">
                                    {Object.keys(COMPILER_LANGUAGES).map((key) => (
                                        <SelectItem
                                            key={key}
                                            value={key}
                                            className="font-bold uppercase tracking-widest text-[10px] p-2 focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black"
                                        >
                                            {COMPILER_LANGUAGES[key as LanguageKey].name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* File Name Tab */}
                        <div className="hidden md:flex items-center h-full">
                            <div className="flex items-center gap-3 px-6 h-full border-r-2 border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800">
                                <span className="text-[11px] font-black uppercase tracking-widest">
                                    {LANGUAGE_ICONS[language].file}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-r-2 border-black/10 dark:border-white/10 text-black dark:text-white"
                                title="Toggle Fullscreen"
                            >
                                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={handleShare}
                                className="h-8 rounded-none border-2 border-black dark:border-white bg-transparent font-black italic uppercase text-[10px] tracking-widest hidden sm:flex gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                                <Share2 className="h-3 w-3" /> Share
                            </Button>
                            <Button
                                onClick={runCode}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 rounded-none h-8 px-6 sm:px-8 font-black uppercase italic tracking-widest text-[10px] sm:text-[11px] flex items-center justify-center transition-transform active:scale-95 border-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none min-w-[100px]"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run'}
                            </Button>
                        </div>
                    </div>

                    {/* Split View Container */}
                    <div className="flex-1 flex flex-col lg:flex-row min-h-0">

                        {/* Editor Pane */}
                        <div className="flex-[3] flex flex-col min-h-[300px] lg:min-h-0 border-b-2 lg:border-b-0 lg:border-r-2 border-black/10 dark:border-white/10 relative">
                            <Suspense
                                fallback={
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">Loading Editor...</p>
                                    </div>
                                }
                            >
                                <MonacoEditor
                                    height="100%"
                                    language={language}
                                    value={code}
                                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                    onChange={(val) => setCode(val || '')}
                                    options={editorOptions}
                                />
                            </Suspense>
                        </div>

                        {/* Output Pane */}
                        <div className="flex-[2] flex flex-col bg-neutral-50 dark:bg-[#0a0a0a] min-h-[250px] lg:min-h-0">
                            <div className="h-10 flex items-center justify-between px-4 border-b-2 border-black/5 dark:border-white/5 bg-white dark:bg-black/50">
                                <span className="text-[11px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                                    Output
                                </span>
                                <Button
                                    variant="ghost"
                                    onClick={() => setOutput('')}
                                    className="h-6 px-2 rounded-none hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 font-bold uppercase text-[9px] tracking-widest gap-1 transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" /> Clear
                                </Button>
                            </div>
                            <div className="flex-1 p-4 overflow-auto font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-black dark:text-gray-300 custom-scrollbar">
                                {output ? (
                                    <span className={output.startsWith('Error') ? "text-red-600 dark:text-red-400" : ""}>
                                        {output}
                                    </span>
                                ) : (
                                    <span className="text-black/30 dark:text-white/30 italic">Execution output will appear here...</span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles for the Sidebar and Output */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.8);
                }
            `}} />
        </div>
    );
}
