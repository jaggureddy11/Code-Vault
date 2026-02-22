import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Minimize2, Maximize2, X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import Draggable from 'react-draggable';

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}

const GEMINI_API_KEY = 'AIzaSyA5CA1dhumCRQkyzmmJFgZLnj4GAikbIc8';

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('codevault_chat_messages');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse chat messages", e);
            }
        }
        return [
            {
                id: 'welcome',
                role: 'model',
                content: "Hello! I'm your CodeVault AI Assistant. I'm here to help you learn coding concepts, explain snippets, and clear your doubts. What would you like to discuss today?"
            }
        ];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        localStorage.setItem('codevault_chat_messages', JSON.stringify(messages));
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for Gemini API
            const history = messages.filter(m => m.id !== 'welcome').map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: "You are an expert AI tutor inside a software engineering learning platform called CodeVault. Help the user learn coding concepts, explain snippets, and provide clear code examples in a friendly, concise manner." }]
                        },
                        {
                            role: 'model',
                            parts: [{ text: "Understood! I'll act as an expert AI tutor for CodeVault. How can I help you today?" }]
                        },
                        ...history,
                        {
                            role: 'user',
                            parts: [{ text: userMsg.content }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2000,
                    }
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const modelText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (modelText) {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: modelText }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Sorry, I couldn\'t generate a response.' }]);
            }
        } catch (error: any) {
            console.error('Gemini API Error:', error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "An error occurred while connecting to the AI. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                id="tour-chatbot-button"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-16 min-w-[4rem] px-0 hover:px-6 rounded-full bg-black hover:bg-neutral-900 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 z-[9999] border-4 border-black dark:border-white transition-all duration-300 hover:-translate-y-1 shadow-[4px_4px_0px_rgba(220,38,38,1)] hover:shadow-[8px_8px_0px_rgba(220,38,38,1)] group flex items-center justify-center overflow-hidden"
            >
                <Bot className="h-8 w-8 shrink-0 transition-transform group-hover:scale-110 group-hover:text-red-500" />
                <span className="max-w-0 overflow-hidden font-black italic tracking-widest uppercase text-sm whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 transition-all duration-300">
                    CODEVAULT AI
                </span>
            </Button>
        );
    }

    return (
        <Draggable handle=".chat-header" bounds="body">
            <div className={cn(
                "fixed bottom-6 right-6 max-h-[85vh] bg-white dark:bg-black border-4 border-black dark:border-white z-[9999] flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,1)] overflow-hidden font-sans transition-all",
                isExpanded ? "w-[80vw] h-[80vh] min-w-[380px] min-h-[600px]" : "w-[380px] h-[600px]"
            )}>
                {/* Header */}
                <div className="chat-header cursor-move flex items-center justify-between px-4 py-4 bg-black text-white dark:bg-white dark:text-black border-b-4 border-black dark:border-white">
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5" />
                        <div>
                            <h3 className="font-black italic uppercase tracking-widest text-sm leading-none">CodeVault AI</h3>
                            <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest font-bold">Always learning...</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 hover:bg-neutral-800 dark:hover:bg-neutral-200">
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
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </span>
                            </div>
                            <div className={cn("max-w-[85%] px-4 py-3 text-sm rounded-none border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] text-black dark:text-white", msg.role === 'user' ? "bg-white dark:bg-black border-black dark:border-white" : "bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white")}>
                                <div className="prose prose-sm dark:prose-invert max-w-none break-words space-y-2">
                                    <ReactMarkdown>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-xs font-bold uppercase tracking-widest italic animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-black border-t-4 border-black dark:border-white">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-transparent border-b-2 border-black dark:border-white px-2 py-2 text-sm focus:outline-none focus:border-red-600 font-medium placeholder:opacity-40"
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
