import { useState, KeyboardEvent } from 'react';
import { X, Palette } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { cn } from '@/lib/utils';
import { TAG_COLORS } from '@/types';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TagInputProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    className?: string;
}

export default function TagInput({ selectedTags, onChange, className }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [selectedColor, setSelectedColor] = useState<string>(TAG_COLORS[0]);
    const { tags: allTags, createTag } = useTags();

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tagName = inputValue.trim().toLowerCase();

            if (tagName && !selectedTags.includes(tagName)) {
                const existingTag = allTags.find((t: any) => t.name.toLowerCase() === tagName);
                if (!existingTag) {
                    try {
                        await createTag({ name: tagName, color: selectedColor });
                    } catch (err) {
                        console.error('Failed to create tag:', err);
                    }
                }

                onChange([...selectedTags, tagName]);
                setInputValue('');
            }
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            onChange(selectedTags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(selectedTags.filter(t => t !== tagToRemove));
    };

    return (
        <div className={cn("space-y-4 w-full", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 rounded-none border-2 border-black dark:border-white gap-2 text-[10px] font-black uppercase italic">
                                <Palette className="h-3.5 w-3.5" />
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor }} />
                                Color
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-none border-2 border-black dark:border-white p-2 min-w-[150px]">
                            <div className="grid grid-cols-4 gap-2">
                                {TAG_COLORS.map(color => (
                                    <DropdownMenuItem
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className="p-0 h-8 w-8 rounded-none cursor-pointer border focus:border-black"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {inputValue && (
                        <div className="text-[8px] font-black uppercase italic animate-pulse opacity-50">
                            Press Enter to add tag
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-3 border-2 border-black/10 dark:border-white/10 bg-transparent transition-all min-h-[60px] items-center focus-within:border-black dark:focus-within:border-white">
                {selectedTags.map((tag) => {
                    const tagInfo = allTags.find(t => t.name.toLowerCase() === tag.toLowerCase());
                    const tagColor = tagInfo?.color || selectedColor;

                    return (
                        <div key={tag} className="flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase italic tracking-widest rounded-none">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tagColor }} />
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:scale-125 transition-transform focus:outline-none ml-1"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    );
                })}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedTags.length === 0 ? "INPUT_TAGS..." : ""}
                    className="flex-1 bg-transparent border-none outline-none text-xs font-black uppercase italic tracking-widest placeholder:opacity-30"
                />
            </div>
        </div>
    );
}
