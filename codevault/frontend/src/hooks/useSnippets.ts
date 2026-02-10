import { useState, useEffect } from 'react';
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

  const fetchSnippets = async (filters?: { query?: string; tags?: string[]; language?: string }): Promise<Snippet[]> => {
    if (!user) return [];

    let query = supabase
      .from('snippets')
      .select('*, snippet_tags(tag_id, tags(*))')
      .eq('user_id', user.id);

    if (filters?.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,code.ilike.%${filters.query}%`);
    }

    if (filters?.language && filters.language !== 'all' && filters.language !== '') {
      query = query.eq('language', filters.language);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    let results = (data || []).map(normalizeSnippet);

    if (filters?.tags && filters.tags.length > 0) {
      results = results.filter(snippet =>
        filters.tags?.every(tagName =>
          snippet.tags?.some(t => t.name.toLowerCase() === tagName.toLowerCase())
        )
      );
    }

    return results;
  };

  const [searchFilters, setSearchFilters] = useState<{ query?: string; tags?: string[]; language?: string }>({});

  const snippetsQuery = useQuery({
    queryKey: ['snippets', user?.id, searchFilters],
    queryFn: () => fetchSnippets(searchFilters),
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  // Real-time synchronization
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('snippets-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'snippets',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['snippets', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const fetchExploreSnippets = async (filters?: { query?: string; tags?: string[]; language?: string }): Promise<Snippet[]> => {
    if (!user) return [];

    try {
      let query = supabase
        .from('snippets')
        .select('*, snippet_tags(tag_id, tags(*)), profiles(username)')
        .eq('is_public', true);

      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,code.ilike.%${filters.query}%`);
      }

      if (filters?.language && filters.language !== 'all' && filters.language !== '') {
        query = query.eq('language', filters.language);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('snippets')
          .select('*, snippet_tags(tag_id, tags(*))')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        let results = (fallbackData || []).map(normalizeSnippet);
        if (filters?.tags && filters.tags.length > 0) {
          results = results.filter(snippet =>
            filters.tags?.every(tagName =>
              snippet.tags?.some(t => t.name.toLowerCase() === tagName.toLowerCase())
            )
          );
        }
        return results;
      }
      let results = (data || []).map(normalizeSnippet);
      if (filters?.tags && filters.tags.length > 0) {
        results = results.filter(snippet =>
          filters.tags?.every(tagName =>
            snippet.tags?.some(t => t.name.toLowerCase() === tagName.toLowerCase())
          )
        );
      }
      return results;
    } catch (err) {
      console.error('Explore fetch failed:', err);
      return [];
    }
  };

  const exploreSnippetsQuery = useQuery({
    queryKey: ['explore-snippets', user?.id, searchFilters],
    queryFn: () => fetchExploreSnippets(searchFilters),
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  const createSnippetMutation = useMutation({
    mutationFn: async (input: CreateSnippetInput) => {
      if (!user) throw new Error('Not authenticated');

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
            is_public: input.is_public ?? false,
          },
        ])
        .select()
        .single();

      if (snippetError) throw snippetError;

      if (input.tags && input.tags.length > 0) {
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

      const { data: snippet, error: snippetError } = await supabase
        .from('snippets')
        .update({
          title: input.title,
          description: input.description,
          code: input.code,
          language: input.language,
          is_public: input.is_public ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (snippetError) throw snippetError;

      if (input.tags) {
        const { error: deleteError } = await supabase
          .from('snippet_tags')
          .delete()
          .eq('snippet_id', id);

        if (deleteError) throw deleteError;

        if (input.tags.length > 0) {
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
    setSearchFilters,
    searchFilters,
  };
}
