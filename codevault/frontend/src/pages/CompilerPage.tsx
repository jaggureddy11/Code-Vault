import { useState, Suspense, lazy, useEffect } from 'react';
import { Loader2, Play, Terminal, Code2, Maximize2, Minimize2, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
    SiJavascript, SiTypescript, SiPython, SiGo, SiRust,
    SiCplusplus, SiPhp, SiRuby, SiSwift, SiKotlin, SiGnubash
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { TbBrandCSharp } from 'react-icons/tb';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const COMPILER_LANGUAGES = {
    java: { name: 'Java', id: 91, icon: FaJava, color: '#007396', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}' },
    python: { name: 'Python', id: 92, icon: SiPython, color: '#3776AB', defaultCode: 'def main():\n    print("Hello from Python!")\n\nif __name__ == "__main__":\n    main()' },
    javascript: { name: 'JavaScript', id: 93, icon: SiJavascript, color: '#F7DF1E', defaultCode: 'console.log("Hello from JavaScript!");' },
    typescript: { name: 'TypeScript', id: 94, icon: SiTypescript, color: '#3178C6', defaultCode: 'const message: string = "Hello from TypeScript!";\nconsole.log(message);' },
    go: { name: 'Go', id: 95, icon: SiGo, color: '#00ADD8', defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}' },
    rust: { name: 'Rust', id: 73, icon: SiRust, color: '#CE412B', defaultCode: 'fn main() {\n    println!("Hello from Rust!");\n}' },
    cpp: { name: 'C++', id: 54, icon: SiCplusplus, color: '#00599C', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!\\n";\n    return 0;\n}' },
    csharp: { name: 'C#', id: 51, icon: TbBrandCSharp, color: '#239120', defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C#!");\n    }\n}' },
    php: { name: 'PHP', id: 68, icon: SiPhp, color: '#777BB4', defaultCode: '<?php\n\necho "Hello from PHP!";\n?>' },
    ruby: { name: 'Ruby', id: 72, icon: SiRuby, color: '#CC342D', defaultCode: 'puts "Hello from Ruby!"' },
    swift: { name: 'Swift', id: 83, icon: SiSwift, color: '#F05138', defaultCode: 'print("Hello from Swift!")' },
    kotlin: { name: 'Kotlin', id: 78, icon: SiKotlin, color: '#7F52FF', defaultCode: 'fun main() {\n    println("Hello from Kotlin!")\n}' },
    bash: { name: 'Bash', id: 46, icon: SiGnubash, color: '#4EAA25', defaultCode: '#!/bin/bash\n\necho "Hello from Bash!"' }
};

type LanguageKey = keyof typeof COMPILER_LANGUAGES;

const EXT_MAP: Record<LanguageKey, string> = {
    javascript: 'js', typescript: 'ts', python: 'py', java: 'java', go: 'go',
    rust: 'rs', cpp: 'cpp', csharp: 'cs', php: 'php', ruby: 'rb', swift: 'swift',
    kotlin: 'kt', bash: 'sh'
};

export default function CompilerPage() {
    const { theme } = useTheme();
    const { toast } = useToast();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');
    const [language, setLanguage] = useState<LanguageKey>(() => {
        const saved = localStorage.getItem('codevault_compiler_language');
        return (saved as LanguageKey) || 'java';
    });
    const [code, setCode] = useState(() => {
        const savedLang = localStorage.getItem('codevault_compiler_language') || 'java';
        const savedCode = localStorage.getItem('codevault_compiler_code');
        return savedCode || COMPILER_LANGUAGES[savedLang as LanguageKey].defaultCode;
    });
    const [output, setOutput] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fileName, setFileName] = useState(() => {
        const saved = localStorage.getItem('codevault_compiler_filename');
        return saved || 'main.java';
    });

    useEffect(() => {
        localStorage.setItem('codevault_compiler_language', language);
        localStorage.setItem('codevault_compiler_code', code);
        localStorage.setItem('codevault_compiler_filename', fileName);
    }, [language, code, fileName]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        const urlLang = urlParams.get('lang');
        const urlCode = urlParams.get('code');
        const urlFile = urlParams.get('file');

        if (urlId) {
            const fetchShared = async () => {
                const { data, error } = await supabase.from('snippets').select('*').eq('id', urlId).single();
                if (!error && data) {
                    if (data.language in COMPILER_LANGUAGES) {
                        setLanguage(data.language as LanguageKey);
                    }
                    setCode(data.code);
                    if (data.title) setFileName(data.title);
                }
            };
            fetchShared();
            return;
        }

        if (urlLang && urlLang in COMPILER_LANGUAGES) {
            setLanguage(urlLang as LanguageKey);
        }
        if (urlCode) {
            try {
                setCode(decodeURIComponent(escape(atob(urlCode))));
            } catch (e) {
                console.error("Failed to parse code from URL");
            }
        }
        if (urlFile) {
            setFileName(urlFile);
        }
    }, []);

    useEffect(() => {
        if (isFullscreen) {
            document.body.classList.add('is-compiler-fullscreen');
        } else {
            document.body.classList.remove('is-compiler-fullscreen');
        }
        return () => document.body.classList.remove('is-compiler-fullscreen');
    }, [isFullscreen]);

    const handleLanguageChange = (newLanguage: string) => {
        if (newLanguage in COMPILER_LANGUAGES) {
            const langKey = newLanguage as LanguageKey;
            setLanguage(langKey);
            setCode(COMPILER_LANGUAGES[langKey].defaultCode);
            setOutput('');
            setFileName(`main.${EXT_MAP[langKey]}`);
        }
    };

    const runCode = async () => {
        setIsLoading(true);
        setActiveTab('output');
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

    const clearOutput = () => setOutput('');

    const shareCode = async () => {
        setIsLoading(true);
        try {
            if (!user) throw new Error("Authentication required");
            const { data, error } = await supabase
                .from('snippets')
                .insert([{
                    user_id: user.id,
                    title: fileName,
                    code: code,
                    language: language,
                    is_public: false
                }])
                .select()
                .single();
            if (error) throw error;

            const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${data.id}`;
            navigator.clipboard.writeText(newUrl);
            toast({
                title: "Link Copied!",
                description: "A short, shareable link to this snippet has been copied!",
            });
        } catch (error: any) {
            console.error(error);
            // Fallback to local params
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('code', btoa(unescape(encodeURIComponent(code))));
            urlParams.set('lang', language);
            urlParams.set('file', fileName);
            const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${urlParams.toString()}`;
            navigator.clipboard.writeText(newUrl);
            toast({
                title: "Fallback Link Copied!",
                description: "Generated a local share link due to a network error.",
            });
        } finally {
            setIsLoading(false);
        }
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

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    return (
        <div className={cn(
            "bg-white dark:bg-black",
            isFullscreen
                ? "fixed inset-0 z-[99999] w-screen h-screen overflow-hidden flex flex-col"
                : "min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto"
        )}>
            {!isFullscreen && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-10 mb-8 lg:mb-12 px-2">
                    <div className="space-y-4">

                        <h1 className="text-4xl sm:text-4xl font-black uppercase tracking-tighter italic">
                            ONLINE <span className="text-orange-500">COMPILER</span>

                        </h1>
                    </div>
                </div>
            )}

            <div className={cn(
                "w-full flex shrink-0",
                isFullscreen ? "flex-1 overflow-hidden" : "lg:h-[700px] h-auto gap-4 lg:gap-12 flex-col lg:flex-row"
            )}>

                {/* Mobile Tabs */}
                {!isFullscreen && (
                    <div className="flex lg:hidden w-full border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900">
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={cn(
                                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors border-r-2 border-black dark:border-white",
                                activeTab === 'editor' ? "bg-black text-white dark:bg-white dark:text-black" : "text-neutral-500 hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('output')}
                            className={cn(
                                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                                activeTab === 'output' ? "bg-black text-white dark:bg-white dark:text-black" : "text-neutral-500 hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            Output
                        </button>
                    </div>
                )}

                {/* Sidebar languages */}
                {!isFullscreen && (
                    <div className="hidden lg:flex flex-col gap-4 w-16 items-center shrink-0 border-r-2 border-black/10 dark:border-white/10 pr-4 overflow-y-auto no-scrollbar pb-6">
                        {Object.entries(COMPILER_LANGUAGES).map(([key, config]) => {
                            const isSelected = language === key;
                            const Icon = config.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleLanguageChange(key)}
                                    onMouseEnter={(e) => e.currentTarget.style.color = config.color}
                                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.color = ''; }}
                                    style={{ color: isSelected ? config.color : '' }}
                                    className={cn(
                                        "p-3 rounded-none border-2 transition-all duration-300 group dark:text-neutral-400 text-neutral-500 hover:scale-110",
                                        isSelected ? "border-black dark:border-white bg-black/5 dark:bg-white/5" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                    title={config.name}
                                >
                                    <Icon className="w-6 h-6" />
                                </button>
                            )
                        })}
                    </div>
                )}

                <div className={cn(
                    "flex-1 flex",
                    isFullscreen ? "flex-col lg:flex-row h-full overflow-hidden" : "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-[65vh] lg:h-full"
                )}>

                    {/* Editor Panel */}
                    <div className={cn(
                        "flex-col bg-white dark:bg-black overflow-hidden",
                        isFullscreen
                            ? "flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white h-full"
                            : "border-2 border-black dark:border-white h-full",
                        (activeTab === 'editor' || isFullscreen) ? 'flex' : 'hidden lg:flex'
                    )}>
                        <div className="flex flex-wrap items-center justify-between p-3 border-b-2 border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 gap-3">
                            <div className="flex items-center gap-3">
                                <Select value={language} onValueChange={handleLanguageChange}>
                                    <SelectTrigger className="h-10 w-36 sm:w-40 rounded-none border-2 border-black dark:border-white bg-white dark:bg-black font-black italic uppercase text-[10px] tracking-widest">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-2 border-black dark:border-white bg-white dark:bg-black max-h-64">
                                        {Object.entries(COMPILER_LANGUAGES).map(([key, config]) => (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="font-bold uppercase tracking-widest text-[10px] p-3 focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <config.icon className="w-4 h-4 opacity-70" />
                                                    {config.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="h-10 w-32 sm:w-48 rounded-none border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="main.js"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={shareCode}
                                    className="h-10 w-10 p-0 rounded-none border-2 border-transparent hover:border-black dark:hover:border-white transition-all hidden sm:flex"
                                    title="Share snippet"
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleFullscreen}
                                    className="h-10 w-10 p-0 rounded-none border-2 border-transparent hover:border-black dark:hover:border-white transition-all hidden sm:flex"
                                    title="Toggle Fullscreen"
                                >
                                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>
                                <Button
                                    onClick={runCode}
                                    disabled={isLoading}
                                    className="bg-black text-white dark:bg-white dark:text-black rounded-none h-10 px-4 sm:px-6 font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2 transition-transform active:scale-95"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                    Run
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 relative">
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
                    </div>

                    {/* Output Panel */}
                    <div className={cn(
                        "flex-col bg-black text-white relative",
                        isFullscreen
                            ? "h-[40vh] lg:h-full lg:w-[40%] xl:w-[35%] shrink-0"
                            : "border-2 border-black dark:border-white h-full",
                        (activeTab === 'output' || isFullscreen) ? 'flex' : 'hidden lg:flex'
                    )}>
                        <div className="flex items-center justify-between p-3 border-b-2 border-white/20">
                            <div className="flex items-center gap-3">
                                <Code2 className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Output Console</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearOutput}
                                className="h-8 w-8 p-0 hover:bg-white/10 text-white rounded-none transition-all"
                                title="Clear Console"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 p-6 overflow-auto bg-[#0a0a0a] font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-white/30">
                            {output ? (
                                <span className={output.startsWith('Error') ? "text-red-400" : "text-green-400"}>
                                    {output}
                                </span>
                            ) : (
                                <span className="text-neutral-600 italic">Click 'Run' to see the output.</span>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Actions Overlay (only visible on small screens to replace hidden buttons) */}
            {!isFullscreen && (
                <div className="flex justify-center sm:hidden mt-4 gap-4">
                    <Button
                        variant="outline"
                        onClick={shareCode}
                        className="flex-1 rounded-none border-2 border-black dark:border-white bg-transparent font-black italic uppercase text-[10px] tracking-widest h-12"
                    >
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button
                        variant="outline"
                        onClick={toggleFullscreen}
                        className="flex-1 rounded-none border-2 border-black dark:border-white bg-transparent font-black italic uppercase text-[10px] tracking-widest h-12"
                    >
                        {isFullscreen ? <><Minimize2 className="mr-2 h-4 w-4" /> Exit</> : <><Maximize2 className="mr-2 h-4 w-4" /> Focus</>}
                    </Button>
                </div>
            )}
        </div>
    );
}
