import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

export const searchVideos = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }
        if (typeof q !== 'string') {
            return res.status(400).json({ error: 'Query parameter "q" must be a string' });
        }
        if (q.length > 200) {
            return res.status(400).json({ error: 'Query parameter "q" too long' });
        }

        if (!YOUTUBE_API_KEY) {
            return res.status(500).json({
                error: 'YouTube API key is not configured in backend .env',
                message: 'Please add YOUTUBE_API_KEY to your .env file.'
            });
        }

        // Enforce educational context
        const educationalQuery = `${q} course tutorial`;

        // 1. Search for videos
        const searchResponse = await fetch(
            `${YOUTUBE_SEARCH_URL}?part=snippet&maxResults=12&q=${encodeURIComponent(educationalQuery)}&type=video&order=viewCount&key=${YOUTUBE_API_KEY}`
        );
        const searchData = await searchResponse.json();

        if (searchData.error) {
            return res.status(searchData.error.code || 500).json({ error: searchData.error.message });
        }

        const videoIds = (searchData.items || []).map(item => item?.id?.videoId).filter(Boolean).join(',');
        if (!videoIds) {
            return res.json([]);
        }

        // 2. Get video details (contentDetails for duration, statistics for views/likes)
        const detailsResponse = await fetch(
            `${YOUTUBE_VIDEOS_URL}?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const detailsData = await detailsResponse.json();

        // 3. Format response
        const videos = (detailsData.items || []).map(item => {
            // Convert ISO 8601 duration (e.g. PT1H2M30S) to readable format (1:02:30)
            const durationIso = item?.contentDetails?.duration || 'PT0S';
            const durationArr = durationIso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const h = durationArr?.[1];
            const m = durationArr?.[2];
            const s = durationArr?.[3];
            const hours = h ? h + ':' : '';
            const minutes = (m ? (h ? m.padStart(2, '0') : m) : '0') + ':';
            const seconds = (s || '0').padStart(2, '0');
            const readableDuration = hours + minutes + seconds;

            // Format views (e.g. 1500000 -> 1.5M)
            const views = parseInt(item?.statistics?.viewCount || '0', 10);
            let formattedViews = views.toString();
            if (views >= 1000000) formattedViews = (views / 1000000).toFixed(1) + 'M';
            else if (views >= 1000) formattedViews = (views / 1000).toFixed(1) + 'K';

            // Format likes
            const likes = parseInt(item?.statistics?.likeCount || '0', 10);
            let formattedLikes = likes.toString();
            if (likes >= 1000000) formattedLikes = (likes / 1000000).toFixed(1) + 'M';
            else if (likes >= 1000) formattedLikes = (likes / 1000).toFixed(1) + 'K';

            return {
                id: item?.id,
                title: item?.snippet?.title,
                thumbnail: item?.snippet?.thumbnails?.maxres?.url || item?.snippet?.thumbnails?.high?.url || item?.snippet?.thumbnails?.default?.url,
                channel: item?.snippet?.channelTitle,
                duration: readableDuration,
                views: formattedViews,
                likes: formattedLikes,
                description: item?.snippet?.description,
                category: 'YouTube'
            };
        });

        res.json(videos);
    } catch (error) {
        console.error('YouTube Search Error:', error);
        res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
};
