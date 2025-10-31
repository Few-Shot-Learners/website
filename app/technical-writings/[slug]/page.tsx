import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <Link href="/technical-writings" className="inline-block mb-8 hover:opacity-60 transition-opacity">
        ← Back
      </Link>
      <article>
        {/* Header */}
        <header className="mb-12 pb-8 border-b border-gray-300 dark:border-gray-700">
          <h1 className="font-serif text-5xl mb-6">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {post.author && (
              <>
                <span>Written by {post.author}</span>
                <span>•</span>
              </>
            )}
            <span>Published on {new Date(post.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-h1:text-4xl prose-h1:mb-4
            prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:mb-4 prose-p:leading-relaxed
            prose-a:text-black dark:prose-a:text-white prose-a:underline hover:prose-a:opacity-60
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded
            prose-img:rounded prose-img:my-8
            dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  )
}
