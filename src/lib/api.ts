import { supabase } from './supabase'

export async function createPost(payload: {
  title: string; content_md: string; status: 'draft'|'scheduled'|'published';
  scheduled_at?: string | null; cover_image?: string | null;
  categories?: string[]; tags?: string[];
}) {
  const { data: post, error } = await supabase
    .from('posts')
    .insert([{ title: payload.title, content_md: payload.content_md, status: payload.status, scheduled_at: payload.scheduled_at ?? null, cover_image: payload.cover_image ?? null }])
    .select('*')
    .single()
  if (error) throw error

  if (payload.categories?.length) {
    const { data: cats } = await supabase.from('categories').select('id,slug').in('slug', payload.categories)
    if (cats?.length) await supabase.from('post_categories').insert(cats.map(c => ({ post_id: (post as any).id, category_id: c.id })))
  }
  if (payload.tags?.length) {
    const { data: tags } = await supabase.from('tags').select('id,slug').in('slug', payload.tags)
    if (tags?.length) await supabase.from('post_tags').insert(tags.map(t => ({ post_id: (post as any).id, tag_id: t.id })))
  }
  return post
}

