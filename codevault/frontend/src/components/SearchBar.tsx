import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
    return (
        <div className={cn("relative group w-full", className)}>
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-black dark:text-white opacity-40 group-focus-within:opacity-100 transition-all duration-300" />
            </div>
            <Input
                type="text"
                placeholder={placeholder || 'SEARCH_LOGIC...'}
                className={cn(
                    "pl-16 pr-16 h-16 rounded-none bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white focus:ring-0 text-base font-bold uppercase italic tracking-widest placeholder:opacity-30 transition-all",
                    className
                )}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-4 h-10 w-10 my-auto rounded-none hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    onClick={() => onChange('')}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
