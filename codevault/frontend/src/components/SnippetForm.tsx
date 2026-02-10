import { lazy, Suspense, useState } from 'react';
import { CreateSnippetInput, POPULAR_LANGUAGES } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { Sparkles, Loader2, Tag as TagIcon, Code2, Type, FileCode, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TagInput from '@/components/TagInput';
import { fetchJson, getApiBaseUrl } from '@/lib/utils';

const MonacoEditor = lazy(() => import('@monaco-editor/react')) as unknown as React.ComponentType<any>;

interface SnippetFormProps {
    initialData?: Partial<CreateSnippetInput>;
    onSubmit: (data: CreateSnippetInput) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function SnippetForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}: SnippetFormProps) {
    const { theme } = useTheme();
    const { toast } = useToast();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [securityStatus, setSecurityStatus] = useState<'SECURE' | 'WARNING' | 'CRITICAL' | null>(null);
    const [formData, setFormData] = useState<CreateSnippetInput>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        code: initialData?.code || '',
        language: initialData?.language || 'javascript',
        tags: initialData?.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [],
    });

    const handleAIAnalyze = async () => {
        if (!formData.code) {
            toast({
                title: 'ERROR',
                description: 'INPUT REQUIRED FOR SCAN.',
                variant: 'destructive',
            });
            return;
        }

        setIsAnalyzing(true);
        try {
            const base = getApiBaseUrl();
            const data = await fetchJson<any>(`${base}/api/ai/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: formData.code }),
                timeoutMs: 60000,
            });

            setFormData((prev: CreateSnippetInput) => ({
                ...prev,
                title: data.title || prev.title,
                description: data.description || prev.description,
                language: data.language?.toLowerCase() || prev.language,
                tags: data.tags || prev.tags,
            }));

            toast({
                title: 'Scan Complete',
                description: 'Snippet analyzed successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'AI subsystem is currently unavailable.',
                variant: 'destructive',
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const simulateSecurityScan = () => {
        setIsScanning(true);
        setSecurityStatus(null);

        setTimeout(() => {
            const hasEval = formData.code.includes('eval(');
            const hasHardcodedSecret = /key|token|password|secret/i.test(formData.code);

            if (hasEval) {
                setSecurityStatus('CRITICAL');
                toast({
                    title: 'Security Alert',
                    description: 'Critical vulnerability detected: eval() usage.',
                    variant: 'destructive',
                });
            } else if (hasHardcodedSecret) {
                setSecurityStatus('WARNING');
                toast({
                    title: 'Security Warning',
                    description: 'Possible hardcoded secrets detected.',
                    variant: 'destructive',
                });
            } else {
                setSecurityStatus('SECURE');
                toast({
                    title: 'System Secure',
                    description: 'No common vulnerabilities detected.',
                });
            }
            setIsScanning(false);
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.code) return;
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                            <Type className="h-4 w-4" />
                            Title
                        </Label>
                        <input
                            id="title"
                            placeholder="Enter snippet title..."
                            className="w-full h-16 border-b-4 border-black dark:border-white bg-transparent outline-none text-2xl font-black italic tracking-tighter transition-colors focus:border-red-600"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <FileCode className="h-4 w-4" />
                                Language
                            </Label>
                            <Select
                                value={formData.language}
                                onValueChange={(value) => setFormData({ ...formData, language: value })}
                            >
                                <SelectTrigger className="h-16 rounded-none border-b-4 border-black dark:border-white text-lg font-black italic uppercase tracking-tighter focus:ring-0 bg-transparent">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-2 border-black dark:border-white bg-white dark:bg-black">
                                    {POPULAR_LANGUAGES.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value} className="font-bold uppercase tracking-widest text-xs p-4 focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black">
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <TagIcon className="h-4 w-4" />
                                Tags
                            </Label>
                            <TagInput
                                selectedTags={formData.tags || []}
                                onChange={(tags) => setFormData({ ...formData, tags })}
                                className="min-h-16 border-b-4 border-black dark:border-white rounded-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                            <Code2 className="h-4 w-4" />
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Add a brief description..."
                            className="min-h-[160px] rounded-none border-4 border-black dark:border-white text-lg font-bold italic tracking-tighter placeholder:opacity-30 focus:ring-0 p-6 bg-transparent"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center px-1 gap-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                            <Sparkles className="h-4 w-4" />
                            Code Editor
                        </Label>
                        <div className="flex gap-2">
                            {securityStatus && (
                                <div className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${securityStatus === 'SECURE'
                                    ? 'border-emerald-500 text-emerald-500'
                                    : securityStatus === 'CRITICAL'
                                        ? 'border-red-500 text-red-500'
                                        : 'border-yellow-500 text-yellow-500'
                                    }`}>
                                    {securityStatus === 'SECURE' ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                    {securityStatus}
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="h-10 px-4 rounded-none border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-black uppercase italic tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all gap-2"
                                onClick={simulateSecurityScan}
                                disabled={isScanning || !formData.code}
                            >
                                {isScanning ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                                SECURITY
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="h-10 px-4 rounded-none border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-black uppercase italic tracking-widest hover:invert transition-all gap-2"
                                onClick={handleAIAnalyze}
                                disabled={isAnalyzing || !formData.code}
                            >
                                {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                                AI Fill
                            </Button>
                        </div>
                    </div>
                    <div className="border-2 border-black dark:border-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
                        <Suspense
                            fallback={
                                <div className="h-[500px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            }
                        >
                            <MonacoEditor
                                height="500px"
                                language={formData.language}
                                value={formData.code}
                                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                onChange={(value: string | undefined) => setFormData({ ...formData, code: value || '' })}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 32, bottom: 32 },
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    cursorSmoothCaretAnimation: 'on',
                                    smoothScrolling: true,
                                    wordWrap: 'on',
                                    lineDecorationsWidth: 20,
                                    scrollbar: {
                                        vertical: 'visible',
                                        horizontal: 'visible',
                                        verticalScrollbarSize: 10,
                                        horizontalScrollbarSize: 10,
                                    },
                                }}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-6 pt-12 border-t-2 border-black/10 dark:border-white/10">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="h-16 px-12 rounded-none border-2 border-black/10 dark:border-white/10 font-black uppercase italic tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.code}
                    className="adidas-button h-16 px-20 text-xl"
                >
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        initialData ? 'Save Changes' : 'Save Snippet'
                    )}
                </Button>
            </div>
        </form>
    );
}
