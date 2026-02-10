import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Video } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useLearning() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const fetchRecentlyViewed = async (): Promise<Video[]> => {
        // Try user-specific localStorage first
        const storageKey = user ? `recently_viewed_videos_${user.id}` : 'recently_viewed_videos_anonymous';
        const local = localStorage.getItem(storageKey);
        const localVideos = local ? JSON.parse(local) : [];

        if (!user) return localVideos;

        try {
            const { data, error } = await supabase
                .from('recently_viewed')
                .select('*')
                .eq('user_id', user.id)
                .order('viewed_at', { ascending: false });

            if (error) {
                console.warn('Supabase fetch failed, using local:', error.message);
                return localVideos;
            }

            const remoteVideos = (data || []).map(item => ({
                id: item.video_id,
                title: item.title,
                thumbnail: item.thumbnail,
                channel: item.channel,
                duration: item.duration,
                views: item.views,
                likes: item.likes,
                description: item.description,
                category: 'Recently Viewed'
            }));

            // Sync user-specific local storage with remote
            if (remoteVideos.length > 0) {
                localStorage.setItem(storageKey, JSON.stringify(remoteVideos.slice(0, 10)));
            }
            return remoteVideos;
        } catch (err) {
            return localVideos;
        }
    };

    const recentlyViewedQuery = useQuery({
        queryKey: ['recently_viewed', user?.id],
        queryFn: fetchRecentlyViewed,
        enabled: true,
    });

    const saveVideoSession = useMutation({
        mutationFn: async (video: Video) => {
            // Priority 1: Persistent Scoped Local Storage (Immediate)
            const storageKey = user ? `recently_viewed_videos_${user.id}` : 'recently_viewed_videos_anonymous';
            const local = localStorage.getItem(storageKey);
            let localVideos = local ? JSON.parse(local) : [];
            localVideos = [video, ...localVideos.filter((v: Video) => v.id !== video.id)].slice(0, 10);
            localStorage.setItem(storageKey, JSON.stringify(localVideos));

            const lastViewedKey = user ? `last_viewed_video_id_${user.id}` : 'last_viewed_video_id_anonymous';
            localStorage.setItem(lastViewedKey, video.id);

            if (!user) return;

            // Priority 2: Database Sync (Cloud)
            try {
                await supabase
                    .from('recently_viewed')
                    .upsert({
                        user_id: user.id,
                        video_id: video.id,
                        title: video.title,
                        thumbnail: video.thumbnail,
                        channel: video.channel,
                        duration: video.duration,
                        views: video.views,
                        likes: video.likes,
                        description: video.description,
                        viewed_at: new Date().toISOString(),
                    }, {
                        onConflict: 'user_id, video_id'
                    });
            } catch (err) {
                console.warn('Database session sync failed (Cloud Down)');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recently_viewed', user?.id] });
        },
    });

    const deleteRecentlyViewedMutation = useMutation({
        mutationFn: async (videoId: string) => {
            const storageKey = user ? `recently_viewed_videos_${user.id}` : 'recently_viewed_videos_anonymous';
            const local = localStorage.getItem(storageKey);
            let localVideos: Video[] = local ? JSON.parse(local) : [];
            localVideos = localVideos.filter((v) => v.id !== videoId);
            localStorage.setItem(storageKey, JSON.stringify(localVideos));

            if (user) {
                const { error } = await supabase
                    .from('recently_viewed')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('video_id', videoId);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recently_viewed', user?.id] });
        },
    });

    return {
        recentlyViewed: recentlyViewedQuery.data ?? [],
        isLoading: recentlyViewedQuery.isLoading,
        saveVideoSession: saveVideoSession.mutateAsync,
        deleteRecentlyViewed: deleteRecentlyViewedMutation.mutateAsync,
        isDeletingRecent: deleteRecentlyViewedMutation.isPending,
    };
}
