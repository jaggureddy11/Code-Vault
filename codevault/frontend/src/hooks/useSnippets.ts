import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Snippet, CreateSnippetInput, UpdateSnippetInput, Tag } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useSnippets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const normalizeSnippet = (row: any): Snippet => {
    const tags: Tag[] =
      row?.snippet_tags?.map((st: any) => st?.tags).filter(Boolean) ??
      row?.tags ??
      [];
    return {
      ...row,
      tags,
    };
  };

  const fetchSnippets = async (): Promise<Snippet[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('snippets')
      .select('*, profiles(username), snippet_tags(tag_id, tags(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizeSnippet);
  };

  const snippetsQuery = useQuery({
    queryKey: ['snippets', user?.id],
    queryFn: fetchSnippets,
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  const fetchExploreSnippets = async (): Promise<Snippet[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('*, profiles(username), snippet_tags(tag_id, tags(*))')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback: fetch without profiles if join fails
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('snippets')
          .select('*, snippet_tags(tag_id, tags(*))')
          .neq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        return (fallbackData || []).map(normalizeSnippet);
      }
      return (data || []).map(normalizeSnippet);
    } catch (err) {
      console.error('Explore fetch failed:', err);
      return [];
    }
  };

  const exploreSnippetsQuery = useQuery({
    queryKey: ['explore-snippets', user?.id],
    queryFn: fetchExploreSnippets,
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  const createSnippetMutation = useMutation({
    mutationFn: async (input: CreateSnippetInput) => {
      if (!user) throw new Error('Not authenticated');

      // 1. Create the snippet
      const { data: snippet, error: snippetError } = await supabase
        .from('snippets')
        .insert([
          {
            user_id: user.id,
            title: input.title,
            description: input.description,
            code: input.code,
            language: input.language,
            is_favorite: false,
          },
        ])
        .select()
        .single();

      if (snippetError) throw snippetError;

      // 2. Handle tags if any
      if (input.tags && input.tags.length > 0) {
        // Find existing tags for these names
        const { data: existingTags, error: tagsError } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', input.tags)
          .eq('user_id', user.id);

        if (tagsError) throw tagsError;

        if (existingTags && existingTags.length > 0) {
          const snippetTags = existingTags.map(tag => ({
            snippet_id: snippet.id,
            tag_id: tag.id,
            user_id: user.id,
          }));

          const { error: linkError } = await supabase
            .from('snippet_tags')
            .insert(snippetTags);

          if (linkError) throw linkError;
        }
      }

      return snippet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['explore-snippets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['tags', user?.id] });
    },
  });

  const updateSnippetMutation = useMutation({
    mutationFn: async ({ id, ...input }: UpdateSnippetInput & { id: string }) => {
      if (!user) throw new Error('Not authenticated');

      // 1. Update snippet basic info
      const { data: snippet, error: snippetError } = await supabase
        .from('snippets')
        .update({
          title: input.title,
          description: input.description,
          code: input.code,
          language: input.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (snippetError) throw snippetError;

      // 2. Sync tags if provided
      if (input.tags) {
        // Delete existing associations
        const { error: deleteError } = await supabase
          .from('snippet_tags')
          .delete()
          .eq('snippet_id', id);

        if (deleteError) throw deleteError;

        if (input.tags.length > 0) {
          // Get tag IDs for names
          const { data: existingTags, error: tagsError } = await supabase
            .from('tags')
            .select('id, name')
            .in('name', input.tags)
            .eq('user_id', user.id);

          if (tagsError) throw tagsError;

          if (existingTags && existingTags.length > 0) {
            const snippetTags = existingTags.map(tag => ({
              snippet_id: id,
              tag_id: tag.id,
              user_id: user.id,
            }));

            const { error: linkError } = await supabase
              .from('snippet_tags')
              .insert(snippetTags);

            if (linkError) throw linkError;
          }
        }
      }

      return snippet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['explore-snippets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['tags', user?.id] });
    },
  });

  const deleteSnippetMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['explore-snippets', user?.id] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, is_favorite }: { id: string; is_favorite: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('snippets')
        .update({ is_favorite })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets', user?.id] });
    },
  });

  return {
    snippets: snippetsQuery.data ?? [],
    exploreSnippets: exploreSnippetsQuery.data ?? [],
    isLoading: snippetsQuery.isLoading || exploreSnippetsQuery.isLoading,
    error: snippetsQuery.error || exploreSnippetsQuery.error,
    createSnippet: createSnippetMutation.mutateAsync,
    isCreating: createSnippetMutation.isPending,
    updateSnippet: updateSnippetMutation.mutateAsync,
    isUpdating: updateSnippetMutation.isPending,
    deleteSnippet: deleteSnippetMutation.mutateAsync,
    isDeleting: deleteSnippetMutation.isPending,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
  };
}
