import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface PostMetadata {
  title: string
  date: string
  category: string
  author?: string
  excerpt?: string
}

export interface Post extends PostMetadata {
  slug: string
  content: string
}

export interface PostPreview extends PostMetadata {
  slug: string
}

export interface CategoryPosts {
  category: string
  posts: PostPreview[]
}

// Get all posts grouped by category
export function getAllPosts(): CategoryPosts[] {
  const categories: { [key: string]: PostPreview[] } = {}

  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)

  fileNames.forEach((fileName) => {
    if (!fileName.endsWith('.md')) return

    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    const metadata = data as PostMetadata
    const category = metadata.category || 'Uncategorized'

    if (!categories[category]) {
      categories[category] = []
    }

    categories[category].push({
      slug,
      ...metadata,
    })
  })

  // Sort posts within each category by date (newest first)
  Object.keys(categories).forEach((category) => {
    categories[category].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  // Convert to array and sort categories alphabetically
  return Object.keys(categories)
    .sort()
    .map((category) => ({
      category,
      posts: categories[category],
    }))
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Convert markdown to HTML with math support
    const processedContent = await remark()
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeStringify)
      .process(content)
    const contentHtml = String(processedContent)

    return {
      slug,
      content: contentHtml,
      ...(data as PostMetadata),
    }
  } catch (error) {
    return null
  }
}

// Get all post slugs for static generation
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}
