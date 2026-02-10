import { Suspense, lazy, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, Copy, Maximize2, Minimize2, Check, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { POPULAR_LANGUAGES } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language?: string;
    height?: string;
    className?: string;
    onLanguageChange?: (language: string) => void;
    showToolbar?: boolean;
}

export default function CodeEditor({
    value,
    onChange,
    language = 'javascript',
    height = '400px',
    className,
    onLanguageChange,
    showToolbar = true,
}: CodeEditorProps) {
    const { theme } = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
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
        <div
            className={cn(
                'flex flex-col border-2 border-black dark:border-white overflow-hidden transition-all duration-300',
                isFullscreen ? 'fixed inset-0 z-[1000] bg-white dark:bg-black p-8' : 'rounded-none',
                className
            )}
        >
            {showToolbar && (
                <div className="flex items-center justify-between p-4 border-b-2 border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900">
                    <div className="flex items-center gap-4">
                        <Select value={language} onValueChange={onLanguageChange}>
                            <SelectTrigger className="h-10 w-40 rounded-none border-2 border-black dark:border-white bg-transparent font-black italic uppercase text-[10px] tracking-widest">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-2 border-black dark:border-white bg-white dark:bg-black">
                                {POPULAR_LANGUAGES.map((lang) => (
                                    <SelectItem
                                        key={lang.value}
                                        value={lang.value}
                                        className="font-bold uppercase tracking-widest text-[10px] p-3 focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black"
                                    >
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="h-10 w-10 p-0 rounded-none border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
                        >
                            {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="h-10 w-10 p-0 rounded-none border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
                        >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex-1 relative min-h-[400px]">
                <Suspense
                    fallback={
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">Loading Editor...</p>
                        </div>
                    }
                >
                    <MonacoEditor
                        height={isFullscreen ? '100%' : height}
                        language={language}
                        value={value}
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        onChange={(val) => onChange(val || '')}
                        options={editorOptions}
                    />
                </Suspense>
            </div>
        </div>
    );
}
