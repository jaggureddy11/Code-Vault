import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkQuery() {
    console.log('🔍 Testing snippet fetch query...');

    // Try to fetch one snippet with the join
    const { data, error } = await supabase
        .from('snippets')
        .select('*, profiles(username), snippet_tags(tag_id, tags(*))')
        .limit(1);

    if (error) {
        console.error('❌ Query failed:', error.message);
        if (error.message.includes('profiles')) {
            console.log('💡 Theory: Relationship to "profiles" is missing.');
        }
    } else {
        console.log('✅ Query succeeded!');
        console.log('Data sample:', JSON.stringify(data, null, 2));
    }
}

checkQuery();
