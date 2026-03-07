import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Bot, User, Send, Minimize2, Maximize2, X, Sparkles, Loader2, Mic, Square, Plus, Trash2, Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import Draggable from 'react-draggable';
import { HfInference } from '@huggingface/inference';
import { Highlight, themes } from 'prism-react-renderer';

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const hf = new HfInference(HF_API_KEY);

const MarkdownCodeBlock = ({ children, className, theme }: { children: any, className?: string, theme: string }) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!match) {
        return <code className={cn("bg-black/5 dark:bg-white/5 px-1 rounded", className)}>{children}</code>;
    }

    return (
        <div className="relative group/code my-4">
            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-white dark:bg-black border-2 border-black dark:border-white rounded-none"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
            </div>
            <Highlight
                theme={theme === 'dark' ? themes.nightOwl : themes.nightOwlLight}
                code={String(children).replace(/\n$/, '')}
                language={match[1] as any}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={cn(className, "p-4 overflow-x-auto text-xs border-2 border-black/10 dark:border-white/10")} style={style}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
};

export default function AIChatbot() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleTheme, theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTTSActive, setIsTTSActive] = useState(() => localStorage.getItem('codevault_tts_enabled') === 'true');
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('codevault_chat_messages');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error("Failed to parse chat messages", e); }
        }
        return [{
            id: 'welcome',
            role: 'model',
            content: "Hello! I'm your CodeVault AI Assistant. I'm here to help you learn coding concepts, explain snippets, and clear your doubts. What would you like to discuss today?"
        }];
    });

    const clearChat = () => {
        if (confirm("Clear entire chat history and start a new session?")) {
            setMessages([{
                id: 'welcome',
                role: 'model',
                content: "Hello! I'm your CodeVault AI Assistant. I'm here to help you learn coding concepts, explain snippets, and clear your doubts. What would you like to discuss today?"
            }]);
            localStorage.removeItem('codevault_chat_messages');
            stopSpeaking();
        }
    };

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const recognitionRef = useRef<any>(null);
    const initialInputRef = useRef('');
    const isVoiceModeRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Pre-warm the TTS engine's voice list on mount so human voices are ready instantly
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
        }
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, isOpen]);

    useEffect(() => {
        localStorage.setItem('codevault_chat_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('codevault_tts_enabled', isTTSActive.toString());
        if (!isTTSActive) {
            stopSpeaking();
        }
    }, [isTTSActive]);

    useEffect(() => {
        if (!isOpen) {
            stopSpeaking();
        }
    }, [isOpen]);

    useEffect(() => {
        if (input.trim() && isSpeaking) {
            stopSpeaking();
        }
    }, [input, isSpeaking]);

    const speakResponse = (text: string) => {
        if (!isTTSActive || !window.speechSynthesis) return;

        // Cancel existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text.replace(/\[.*?\]/g, '')); // Strip commands
        const voices = window.speechSynthesis.getVoices();
        // Prefer a premium sounding voice if available
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.1;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const startSpeechRecognition = () => {
        // CLEANUP: If there's an existing instance, kill it first
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsVoiceMode(true);
            isVoiceModeRef.current = true;
            initialInputRef.current = input;
        };

        recognition.onresult = (event: any) => {
            let totalTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
                totalTranscript += event.results[i][0].transcript;
            }
            setInput((initialInputRef.current + ' ' + totalTranscript).trim());
        };

        recognition.onerror = (e: any) => {
            if (e.error === 'no-speech') return; // Silence is fine
            if (e.error === 'aborted' || e.error === 'not-allowed' || e.error === 'service-not-allowed') {
                console.error("Critical Speech Error:", e.error);
                stopVoiceSession();
                return;
            }
            console.error("Speech recognition error:", e.error);
        };

        recognition.onend = () => {
            setIsVoiceMode(false);
            isVoiceModeRef.current = false;
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }
    };

    const stopVoiceSession = () => {
        setIsVoiceMode(false);
        isVoiceModeRef.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
            recognitionRef.current = null;
        }
    };

    const toggleVoiceMode = () => {
        if (isVoiceMode) stopVoiceSession();
        else startSpeechRecognition();
    };

    const resumeListening = () => {
        // No auto-resume for voice typing
    };

    const handleSendRef = useRef<any>(null);

    useEffect(() => {
        if (isVoiceMode && input.trim() && !isLoading) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                if (handleSendRef.current) {
                    handleSendRef.current(input, true);
                }
            }, 3000);
        }
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [input, isVoiceMode, isLoading]);

    const handleSend = async (textToSend?: string | React.FormEvent, isFromVoice: boolean = false) => {
        if (textToSend && typeof textToSend === 'object' && 'preventDefault' in textToSend) {
            textToSend.preventDefault();
            textToSend = input;
        } else if (!textToSend) {
            textToSend = input;
        }

        const text = (textToSend as string).trim();
        if (!text || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
        setMessages((prev: ChatMessage[]) => [...prev.filter((m: ChatMessage) => m.id !== 'voice-start'), userMsg]);
        setInput('');
        setIsLoading(true);

        if ((isVoiceMode || isFromVoice) && recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
        }

        try {
            const history = messages.filter(m => m.id !== 'welcome' && !m.content.includes("*(Voice Mode Ended)*") && m.id !== 'voice-start').map(m => ({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.content
            }));

            const systemInstruction = `You are CodeVault AI, an elite personal tutor and study assistant. You have agentic capabilities to control the UI.
            
            **CRITICAL CAPABILITIES**:
            1. **UI CONTROL**: Trigger tags at the VERY END.
               - Pages: [NAV_VAULT], [NAV_EXPLORE], [NAV_FAVORITES], [NAV_PROJECTS], [NAV_LEARN], [NAV_NOTES], [NAV_COMPILER], [NAV_TODO], [NAV_PROFILE], [NAV_SUPPORT]
               - Actions: [TOGGLE_THEME], [CLEAR_CHAT], [EXPAND_AI], [MINIMIZE_AI], [RESTART_TOUR]

            2. **AGENTIC COMMANDS (CMD TAGS)**:
               - **WRITING CODE**: [CMD_WRITE_CODE]{"language": "python", "code": "...", "fileName": "app.py", "autoRun": true}[/CMD_WRITE_CODE]
               - **RUNNING CODE**: [CMD_RUN_CODE]{}[/CMD_RUN_CODE] (Triggers compiler logic)
               - **TASKS**: [CMD_ADD_TASKS]{"tasks": ["..."]}[/CMD_ADD_TASKS] or [CMD_CLEAR_TASKS]{}[/CMD_CLEAR_TASKS]
               - **SEARCH**: [CMD_SEARCH_COMMUNITY]{"query": "..."}[/CMD_SEARCH_COMMUNITY], [CMD_SEARCH_NOTES]{"query": "..."}[/CMD_SEARCH_NOTES], [CMD_SEARCH_FAVORITES]{"query": "..."}[/CMD_SEARCH_FAVORITES]
            
            3. **CONTEXT AWARENESS**: Current page: ${location.pathname}. 

            **MANDATORY ETIQUETTE**:
            - Tags MUST be at the end EXACTLY as shown (use brackets and correct case).
            - If generating code, ALWAYS use [CMD_WRITE_CODE] with autoRun:true.
            - CRITICAL: When using [CMD_WRITE_CODE], DO NOT print the code block in your conversational response. ONLY put the code inside the JSON payload to save space. Just say "I'm writing the code for you now."
            - You are a helpful, friendly, and conversational AI assistant. Do NOT use overly technical or robotic language. Do NOT expose or mention raw tags in your conversational response.`;

            let textOutput = "";

            // Using Hugging Face's Meta Llama 3 via Inference API
            for await (const chunk of hf.chatCompletionStream({
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [
                    { role: "system", content: systemInstruction },
                    ...history,
                    { role: "user", content: userMsg.content }
                ],
                max_tokens: 2000,
                temperature: 0.7,
            })) {
                if (chunk.choices && chunk.choices.length > 0) {
                    textOutput += chunk.choices[0].delta.content || "";
                }
            }

            if (!textOutput) throw new Error("Sorry, I couldn't generate a response.");

            // AGENTIC DISPATCHER: Parse command tags and execute actions
            let targetPath = '';
            const navCommands = [
                { tag: '[NAV_VAULT]', path: '/' },
                { tag: '[NAV_EXPLORE]', path: '/explore' },
                { tag: '[NAV_FAVORITES]', path: '/favorites' },
                { tag: '[NAV_PROJECTS]', path: '/projects' },
                { tag: '[NAV_LEARN]', path: '/learn' },
                { tag: '[NAV_NOTES]', path: '/notes' },
                { tag: '[NAV_COMPILER]', path: '/compiler' },
                { tag: '[NAV_TODO]', path: '/todo' },
                { tag: '[NAV_PROFILE]', path: '/profile' },
                { tag: '[NAV_SUPPORT]', path: '/support' },
            ];

            // 1. Check basic navigation
            navCommands.forEach(cmd => {
                const tagCore = cmd.tag.replace(/\[|\]/g, '');
                if (new RegExp(`\\[?${tagCore}\\]?`, 'i').test(textOutput)) targetPath = cmd.path;
            });

            // 2. Simple Actions
            if (/\[?TOGGLE_THEME\]?/i.test(textOutput)) setTimeout(() => toggleTheme(), 50);
            if (/\[?CLEAR_CHAT\]?/i.test(textOutput)) {
                setTimeout(() => {
                    setMessages([{ id: 'welcome', role: 'model', content: "Chat history cleared. How can I help you fresh?" }]);
                    localStorage.removeItem('codevault_chat_messages');
                }, 50);
            }
            if (/\[?EXPAND_AI\]?/i.test(textOutput)) setIsExpanded(true);
            if (/\[?MINIMIZE_AI\]?/i.test(textOutput)) setIsExpanded(false);
            if (/\[?RESTART_TOUR\]?/i.test(textOutput)) {
                localStorage.setItem('showTour', 'true');
                window.location.reload();
            }

            // 3. Deep Agentic Commands
            let agenticAction: any = null;

            const writeCodeMatch = textOutput.match(/\[?CMD_WRITE_CODE\]?([\s\S]*?)\[?\/CMD_WRITE_CODE\]?/i);
            if (writeCodeMatch) {
                try {
                    agenticAction = { type: 'WRITE_CODE', payload: JSON.parse(writeCodeMatch[1]) };
                    targetPath = '/compiler';
                } catch (e) { console.error("Agentic code error", e); }
            }

            const addTasksMatch = textOutput.match(/\[?CMD_ADD_TASKS\]?([\s\S]*?)\[?\/CMD_ADD_TASKS\]?/i);
            if (addTasksMatch) {
                try {
                    agenticAction = { type: 'ADD_TASKS', payload: JSON.parse(addTasksMatch[1]) };
                    targetPath = '/todo';
                } catch (e) { console.error("Agentic task error", e); }
            }

            if (/\[?CMD_CLEAR_TASKS\]?/i.test(textOutput)) {
                agenticAction = { type: 'CLEAR_TASKS' };
                targetPath = '/todo';
            }

            if (/\[?CMD_RUN_CODE\]?/i.test(textOutput)) {
                agenticAction = { type: 'RUN_CODE' };
                targetPath = '/compiler';
            }

            const searchCommunityMatch = textOutput.match(/\[?CMD_SEARCH_COMMUNITY\]?([\s\S]*?)\[?\/CMD_SEARCH_COMMUNITY\]?/i);
            if (searchCommunityMatch) {
                try {
                    agenticAction = { type: 'SEARCH_COMMUNITY', payload: JSON.parse(searchCommunityMatch[1]) };
                    targetPath = '/explore';
                } catch (e) { console.error("Agentic search error", e); }
            }

            const searchNotesMatch = textOutput.match(/\[?CMD_SEARCH_NOTES\]?([\s\S]*?)\[?\/CMD_SEARCH_NOTES\]?/i);
            if (searchNotesMatch) {
                try {
                    agenticAction = { type: 'SEARCH_NOTES', payload: JSON.parse(searchNotesMatch[1]) };
                    targetPath = '/notes';
                } catch (e) { console.error("Agentic notes search error", e); }
            }

            const searchFavoritesMatch = textOutput.match(/\[?CMD_SEARCH_FAVORITES\]?([\s\S]*?)\[?\/CMD_SEARCH_FAVORITES\]?/i);
            if (searchFavoritesMatch) {
                try {
                    agenticAction = { type: 'SEARCH_FAVORITES', payload: JSON.parse(searchFavoritesMatch[1]) };
                    targetPath = '/favorites';
                } catch (e) { console.error("Agentic favorites search error", e); }
            }

            // 4. Execution
            if (agenticAction) {
                localStorage.setItem('codevault_pending_action', JSON.stringify(agenticAction));
                // Dispatch event for components already on the path
                window.dispatchEvent(new Event('codevault_agentic_action'));
            }

            if (targetPath) {
                setTimeout(() => {
                    navigate(targetPath);
                    window.scrollTo(0, 0);
                    if (window.innerWidth < 1024) setIsOpen(false);
                }, 50);
            }

            // Cleanup: Remove command tags from the visible response
            let cleanResponse = textOutput;
            navCommands.forEach(cmd => {
                const tagCore = cmd.tag.replace(/\[|\]/g, '');
                // Escape bracket literals in string building
                cleanResponse = cleanResponse.replace(new RegExp(`\\[?${tagCore}\\]?`, 'gi'), '');
            });
            cleanResponse = cleanResponse.replace(/\[?TOGGLE_THEME\]?/gi, '')
                .replace(/\[?CLEAR_CHAT\]?/gi, '')
                .replace(/\[?EXPAND_AI\]?/gi, '')
                .replace(/\[?MINIMIZE_AI\]?/gi, '')
                .replace(/\[?RESTART_TOUR\]?/gi, '')
                .replace(/\[?CMD_WRITE_CODE\]?[\s\S]*?\[?\/CMD_WRITE_CODE\]?/gi, '')
                .replace(/\[?CMD_ADD_TASKS\]?[\s\S]*?\[?\/CMD_ADD_TASKS\]?/gi, '')
                .replace(/\[?CMD_CLEAR_TASKS\]?/gi, '')
                .replace(/\[?CMD_RUN_CODE\]?[\s\S]*?\[?\/CMD_RUN_CODE\]?/gi, '')
                .replace(/\[?CMD_SEARCH_COMMUNITY\]?[\s\S]*?\[?\/CMD_SEARCH_COMMUNITY\]?/gi, '')
                .replace(/\[?CMD_SEARCH_NOTES\]?[\s\S]*?\[?\/CMD_SEARCH_NOTES\]?/gi, '')
                .replace(/\[?CMD_SEARCH_FAVORITES\]?[\s\S]*?\[?\/CMD_SEARCH_FAVORITES\]?/gi, '')
                .trim();

            setMessages((prev: ChatMessage[]) => [...prev.filter((m: ChatMessage) => m.id !== 'voice-start'), { id: Date.now().toString(), role: 'model', content: cleanResponse }]);
            speakResponse(cleanResponse);

            // Remove TTS entirely; just receive the response as normal conversation.
            resumeListening();
        } catch (error: any) {
            console.error('HuggingFace API Error:', error);
            const errorMessage = error.message ? `API Error: ${error.message} ` : "An error occurred while connecting to the AI. Please try again.";
            setMessages(prev => [...prev.filter(m => m.id !== 'voice-start'), { id: Date.now().toString(), role: 'model', content: errorMessage }]);
            resumeListening();
        } finally {
            setIsLoading(false);
        }
    };

    handleSendRef.current = handleSend;

    const markdownComponents = useMemo(() => ({
        code: ({ inline, className, children }: any) => (
            <MarkdownCodeBlock className={className} theme={theme}>
                {children}
            </MarkdownCodeBlock>
        )
    }), [theme]);

    if (!isOpen) {
        return (
            <Button
                id="tour-chatbot-button"
                onClick={() => setIsOpen(true)}
                className="fixed lg:bottom-6 bottom-20 right-6 h-16 min-w-[4rem] px-0 hover:px-6 rounded-full bg-black hover:bg-neutral-900 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 z-[9999] border-4 border-black dark:border-white transition-all duration-300 hover:-translate-y-1 shadow-[4px_4px_0px_rgba(220,38,38,1)] hover:shadow-[8px_8px_0px_rgba(220,38,38,1)] group flex items-center justify-center overflow-hidden animate-slide-in-right"
            >
                <Bot className="h-8 w-8 shrink-0 transition-transform group-hover:scale-110 group-hover:text-red-500" />
                <span className="max-w-0 overflow-hidden font-black italic tracking-widest uppercase text-sm whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 transition-all duration-300">
                    CODEVAULT AI
                </span>
            </Button>
        );
    }

    return (
        <Draggable handle=".chat-header" cancel="button" bounds="body">
            <div className={cn(
                "fixed lg:bottom-6 bottom-20 right-4 lg:right-6 max-h-[85vh] bg-white dark:bg-black border-4 border-black dark:border-white z-[9999] flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,1)] overflow-hidden font-sans transition-all",
                isExpanded
                    ? "w-[95vw] lg:w-[80vw] h-[80vh] min-h-[600px]"
                    : "w-[calc(100vw-2rem)] lg:w-[380px] h-[600px]"
            )}>
                {/* Header */}
                <div className="chat-header cursor-move flex items-center justify-between px-4 py-4 bg-black text-white dark:bg-white dark:text-black border-b-4 border-black dark:border-white">
                    <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5" />
                        <div>
                            <h3 className="font-black italic uppercase tracking-widest text-sm leading-none">CodeVault AI</h3>
                            <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest font-bold">Always learning...</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsTTSActive(!isTTSActive)}
                            className={cn("h-8 w-8 hover:bg-neutral-800 dark:hover:bg-neutral-200", isTTSActive ? "text-amber-500" : "text-neutral-500")}
                            title={isTTSActive ? "Disable Voice Output" : "Enable Voice Output"}
                        >
                            {isTTSActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={clearChat} title="New Chat" className="h-8 w-8 hover:bg-neutral-800 dark:hover:bg-neutral-200">
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat" className="h-8 w-8 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-neutral-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold">
                            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-red-500 hover:text-red-400">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                            <div className={cn("flex items-center gap-2 mb-1", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                <div className={cn("h-6 w-6 rounded-none flex items-center justify-center border-2", msg.role === 'user' ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" : "bg-red-600 text-white border-red-600")}>
                                    {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                </div>
                                {msg.role === 'model' && isSpeaking && messages[messages.length - 1].id === msg.id && (
                                    <Volume2 className="h-3 w-3 text-red-500 animate-pulse" />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </span>
                            </div>
                            <div className={cn("max-w-[85%] px-4 py-3 text-sm rounded-none border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] text-black dark:text-white", msg.role === 'user' ? "bg-white dark:bg-black border-black dark:border-white" : "bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white")}>
                                <div className="prose prose-sm dark:prose-invert max-w-none break-words space-y-2">
                                    <ReactMarkdown
                                        components={markdownComponents}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {[
                                "Write Python palindrome & run",
                                "Search notes for React",
                                "Clear my tasks",
                                "Explain this page",
                                "Switch theme",
                                "Search community for Auth",
                                "Add 'Review PRs' to tasks",
                            ].map((suggest, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(suggest)}
                                    className="px-3 py-1.5 bg-white dark:bg-black border-2 border-black dark:border-white text-[10px] font-black uppercase italic tracking-widest hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] active:translate-y-[1px]"
                                >
                                    {suggest}
                                </button>
                            ))}
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-6 w-6 rounded-none flex items-center justify-center border-2 border-red-600 bg-red-600 text-white">
                                    <Bot className="h-3 w-3" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                    AI Assistant
                                </span>
                            </div>
                            <div className="max-w-[85%] px-4 py-3 text-sm rounded-none border-2 border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest italic flex gap-1 items-center">
                                    Thinking
                                    <span className="flex gap-[2px] ml-1">
                                        <span className="thinking-dot"></span>
                                        <span className="thinking-dot"></span>
                                        <span className="thinking-dot"></span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-black border-t-4 border-black dark:border-white">
                    <form
                        onSubmit={handleSend}
                        className="flex gap-2 items-center"
                    >
                        <Button
                            type="button"
                            onClick={toggleVoiceMode}
                            className={cn("rounded-none border-2 border-black dark:border-white h-10 w-10 p-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex-shrink-0", isVoiceMode ? "bg-red-600 hover:bg-red-700 text-white border-red-600 dark:bg-red-600 animate-pulse" : "bg-white hover:bg-neutral-100 text-black dark:bg-black dark:hover:bg-neutral-900 dark:text-white")}
                            title={isVoiceMode ? "Stop Voice Typing" : "Start Voice Typing"}
                        >
                            {isVoiceMode ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isVoiceMode ? "Listening..." : "Ask me anything..."}
                            className={cn("flex-1 min-w-0 bg-transparent border-b-2 border-black dark:border-white px-2 py-2 text-sm focus:outline-none focus:border-red-600 font-medium", isVoiceMode && "text-red-600 animate-pulse")}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="rounded-none border-2 border-black dark:border-white h-10 w-10 p-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none bg-white hover:bg-neutral-100 text-black dark:bg-black dark:hover:bg-neutral-900 dark:text-white transition-all disabled:opacity-50"
                        >
                            <Send className="h-4 w-4 ml-1" />
                        </Button>
                    </form>
                </div>
            </div>
        </Draggable>
    );
}

