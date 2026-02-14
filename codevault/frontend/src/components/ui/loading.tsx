import { cn } from '@/lib/utils';
// Loader2 removed as it was unused

export function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className="h-12 w-12 border-8 border-black dark:border-white border-b-transparent animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Processing...</span>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-none border-2 border-black/5 dark:border-white/5 p-8 space-y-6 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-800" />
            <div className="space-y-2">
                <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="h-32 w-full bg-neutral-100 dark:bg-neutral-900" />
            <div className="flex gap-2">
                <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 text-[8px]" />
                <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 text-[8px]" />
            </div>
        </div>
    );
}
