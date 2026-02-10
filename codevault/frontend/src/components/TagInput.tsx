import { useState, KeyboardEvent } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { cn } from '@/lib/utils';

interface TagInputProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    className?: string;
}

export default function TagInput({ selectedTags, onChange, className }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const { tags: allTags, createTag } = useTags();

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tagName = inputValue.trim().toLowerCase();

            if (tagName && !selectedTags.includes(tagName)) {
                const existingTag = allTags.find((t: any) => t.name.toLowerCase() === tagName);
                if (!existingTag) {
                    try {
                        await createTag({ name: tagName });
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
        <div className={cn("space-y-2 w-full", className)}>
            <div className="flex flex-wrap gap-2 p-3 border-2 border-transparent bg-transparent transition-all min-h-[60px] items-center">
                {selectedTags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase italic tracking-widest rounded-none">
                        <TagIcon className="h-3 w-3" />
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:scale-125 transition-transform focus:outline-none"
                        >
                            <X className="h-3 w-3 " />
                        </button>
                    </div>
                ))}
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
