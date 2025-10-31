import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function TechnicalWritings() {
  const categoryPosts = getAllPosts()

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl mb-16 text-center">Technical Writings</h1>

      {categoryPosts.length === 0 ? (
        <p className="text-center text-gray-600">No posts yet. Add markdown files to the posts directory to get started.</p>
      ) : (
        <div className="space-y-16">
          {categoryPosts.map((categoryGroup) => (
            <div key={categoryGroup.category}>
              <h2 className="font-serif text-3xl mb-8 pb-2 border-b-2 border-black">
                {categoryGroup.category}
              </h2>

              <div className="space-y-4">
                {categoryGroup.posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/technical-writings/${post.slug}`}
                    className="block py-3 border-b border-gray-300 hover:border-black transition-colors"
                  >
                    <h3 className="text-lg">{post.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
