export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  tags?: Tag[];
  profiles?: Profile;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface SnippetTag {
  snippet_id: string;
  tag_id: string;
}

export interface CreateSnippetInput {
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[];
}

export interface UpdateSnippetInput {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  tags?: string[];
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  language?: string;
}

export const POPULAR_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
] as const;

export const TAG_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
] as const;

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  views: string;
  likes: string;
  description: string;
  category?: string;
}
