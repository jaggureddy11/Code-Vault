import { useTags } from '@/hooks/useTags';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tag as TagIcon, XCircle } from 'lucide-react';
import { TAG_COLORS } from '@/types';

interface TagFilterProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    className?: string;
}

export default function TagFilter({
    selectedTags,
    onTagsChange,
    className,
}: TagFilterProps) {
    const { tags } = useTags();

    const toggleTag = (tagName: string) => {
        if (selectedTags.includes(tagName)) {
            onTagsChange(selectedTags.filter((t) => t !== tagName));
        } else {
            onTagsChange([...selectedTags, tagName]);
        }
    };

    const clearAll = () => {
        onTagsChange([]);
    };

    if (tags.length === 0) return null;

    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
                    <TagIcon className="h-3 w-3" />
                    Filter by Tags
                </h4>
                {selectedTags.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="h-auto p-0 text-[8px] font-black uppercase tracking-widest italic opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                        <XCircle className="h-2 w-2" />
                        Clear All
                    </Button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    const tagColor = tag.color || TAG_COLORS[0];

                    return (
                        <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.name)}
                            className={cn(
                                'px-4 py-2 text-[10px] font-black uppercase italic tracking-widest transition-all border-2 flex items-center gap-2',
                                isSelected
                                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                    : 'bg-transparent border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white opacity-60 hover:opacity-100'
                            )}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: tagColor }}
                            />
                            {tag.name}
                            {isSelected && (
                                <div className="ml-1 bg-white/20 dark:bg-black/20 rounded-full p-0.5">
                                    <span className="text-[8px]">ACTIVE</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
