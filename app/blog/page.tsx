// app/blog/page.tsx
import type { Metadata } from 'next'
import BlogCard from '@/components/blog/BlogCard'
import { getArtigos } from '@/sanity/queries'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos e dicas sobre saúde, equipamentos médicos e cuidados em casa.',
}

export default async function BlogPage() {
  const artigos = await getArtigos()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Blog</h1>
      <p className="text-gray-500 mb-8">Dicas e informações sobre saúde e equipamentos médicos.</p>

      {artigos.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Nenhum artigo publicado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artigos.map((a) => (
            <BlogCard key={a._id} artigo={a} />
          ))}
        </div>
      )}
    </div>
  )
}
