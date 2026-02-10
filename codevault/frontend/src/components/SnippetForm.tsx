import { useState, useEffect } from 'react';
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

import { Sparkles, Loader2, Tag as TagIcon, Code2, Type, FileCode, Zap, ShieldCheck, AlertTriangle, Globe, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TagInput from '@/components/TagInput';
import { fetchJson, getApiBaseUrl, cn } from '@/lib/utils';
import CodeEditor from '@/components/CodeEditor';

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
        is_public: initialData?.is_public ?? false,
    });

    const handleAIAnalyze = async () => {
        if (!formData.code) {
            toast({
                title: 'Error',
                description: 'Input required for scan.',
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

    const [isPreview, setIsPreview] = useState(false);

    // Auto-save draft to localStorage
    useEffect(() => {
        const draft = localStorage.getItem('snippet_draft');
        if (draft && !initialData) {
            try {
                const parsed = JSON.parse(draft);
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Failed to load draft');
            }
        }
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            localStorage.setItem('snippet_draft', JSON.stringify(formData));
        }
    }, [formData, initialData]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSubmit(e as any);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.code) {
            toast({
                title: 'Input Required',
                description: 'Title and code are mandatory fields.',
                variant: 'destructive'
            });
            return;
        }
        await onSubmit(formData);
        if (!initialData) {
            localStorage.removeItem('snippet_draft');
        }
    };

    if (isPreview) {
        return (
            <div className="space-y-6 sm:space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black text-white p-6 sm:p-8 gap-4 sm:gap-0">
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter">{formData.title || 'Untitled'}</h2>
                        <p className="text-[8px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mt-2">{formData.language} // {formData.tags?.length} tags</p>
                    </div>
                    <Button onClick={() => setIsPreview(false)} className="adidas-button w-full sm:w-auto bg-white text-black hover:invert">Edit Mode</Button>
                </div>

                <div className="border-4 border-black dark:border-white p-4 sm:p-8 bg-neutral-50 dark:bg-neutral-900 overflow-x-auto">
                    <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {formData.code}
                    </pre>
                </div>

                <div className="flex justify-end pt-6 sm:pt-12">
                    <Button onClick={handleSubmit} disabled={isLoading} className="adidas-button w-full sm:w-auto h-16 px-12 sm:px-20 text-lg sm:text-xl">
                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Confirm & Save'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="flex justify-end mb-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsPreview(true)}
                    className="text-[10px] font-black uppercase tracking-widest italic hover:underline"
                >
                    Switch to Preview
                </Button>
            </div>
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
                            className="w-full h-12 sm:h-16 border-b-4 border-black dark:border-white bg-transparent outline-none text-xl sm:text-2xl font-black italic tracking-tighter transition-colors focus:border-red-600"
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

                    <div className="flex items-center gap-4 p-4 border-4 border-black dark:border-white">
                        <div className="flex-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic mb-1">
                                Visibility
                            </Label>
                            <p className="text-[10px] opacity-60 italic">
                                {formData.is_public ? 'Visible to the community' : 'Private to your vault'}
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_public: !formData.is_public })}
                            className={cn(
                                "h-12 px-6 rounded-none font-black italic uppercase tracking-widest transition-all",
                                formData.is_public
                                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                    : "bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {formData.is_public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                {formData.is_public ? 'Public' : 'Private'}
                            </div>
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                            <Code2 className="h-4 w-4" />
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Add a brief description..."
                            className="min-h-[120px] sm:min-h-[160px] rounded-none border-4 border-black dark:border-white text-sm sm:text-lg font-bold italic tracking-tighter placeholder:opacity-30 focus:ring-0 p-4 sm:p-6 bg-transparent"
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
                        <div className="flex flex-wrap gap-2">
                            {securityStatus && (
                                <div className={`flex items-center gap-2 px-3 py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest border-2 ${securityStatus === 'SECURE'
                                    ? 'border-emerald-500 text-emerald-500'
                                    : securityStatus === 'CRITICAL'
                                        ? 'border-red-500 text-red-500'
                                        : 'border-yellow-500 text-yellow-500'
                                    }`}>
                                    {securityStatus === 'SECURE' ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                    {securityStatus}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="h-8 sm:h-10 px-3 sm:px-4 rounded-none border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-black uppercase italic tracking-widest text-[8px] sm:text-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all gap-2"
                                    onClick={simulateSecurityScan}
                                    disabled={isScanning || !formData.code}
                                >
                                    {isScanning ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                                    Security
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="h-8 sm:h-10 px-3 sm:px-4 rounded-none border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-black uppercase italic tracking-widest text-[8px] sm:text-[10px] hover:invert transition-all gap-2"
                                    onClick={handleAIAnalyze}
                                    disabled={isAnalyzing || !formData.code}
                                >
                                    {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                                    AI Fill
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 border-black dark:border-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
                        <CodeEditor
                            height="500px"
                            language={formData.language}
                            value={formData.code}
                            onChange={(value: string) => setFormData({ ...formData, code: value })}
                            onLanguageChange={(lang) => setFormData({ ...formData, language: lang })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-6 pt-8 sm:pt-12 border-t-2 border-black/10 dark:border-white/10">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="h-12 sm:h-16 px-6 sm:px-12 rounded-none border-2 border-black/10 dark:border-white/10 font-black uppercase italic tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all text-xs sm:text-base"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.code}
                    className="adidas-button h-14 sm:h-16 px-10 sm:px-20 text-lg sm:text-xl"
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
