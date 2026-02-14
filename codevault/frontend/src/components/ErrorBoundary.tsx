import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
                    <div className="max-w-2xl w-full border-4 border-white p-12 space-y-8 text-center italic">
                        <AlertTriangle className="h-24 w-24 mx-auto text-red-600 animate-pulse" />
                        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
                            System<br />Failed.
                        </h1>
                        <p className="text-xl font-bold uppercase opacity-60">
                            The Vault encountered a critical memory segmentation fault.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <Button
                                onClick={() => window.location.reload()}
                                className="adidas-button bg-white text-black hover:invert flex-1"
                            >
                                <RefreshCcw className="h-5 w-5 mr-3" />
                                Initialize Sync
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                                className="adidas-button bg-transparent border-white text-white hover:bg-white hover:text-black flex-1"
                            >
                                <Home className="h-5 w-5 mr-3" />
                                Return Home
                            </Button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <pre className="mt-12 p-6 bg-white/5 text-left font-mono text-xs overflow-auto max-h-40 border border-white/20 whitespace-pre-wrap">
                                {this.state.error?.toString()}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
