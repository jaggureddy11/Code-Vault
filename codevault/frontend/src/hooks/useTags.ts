import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tag } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useTags() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const fetchTags = async (): Promise<Tag[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('user_id', user.id)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    };

    const tagsQuery = useQuery({
        queryKey: ['tags', user?.id],
        queryFn: fetchTags,
        enabled: !!user,
    });

    const createTagMutation = useMutation({
        mutationFn: async ({ name, color }: { name: string; color?: string }) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('tags')
                .insert([
                    {
                        user_id: user.id,
                        name,
                        color: color || '#3B82F6',
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags', user?.id] });
        },
    });

    const deleteTagMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('tags')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags', user?.id] });
        },
    });

    return {
        tags: tagsQuery.data ?? [],
        isLoading: tagsQuery.isLoading,
        error: tagsQuery.error,
        createTag: createTagMutation.mutateAsync,
        isCreating: createTagMutation.isPending,
        deleteTag: deleteTagMutation.mutateAsync,
        isDeleting: deleteTagMutation.isPending,
    };
}
