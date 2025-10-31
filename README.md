# Few Shot Learners Website

A minimalist blog website for Few Shot Learners, featuring technical writings about AI and machine learning.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Adding Blog Posts

To add a new blog post, simply create a markdown file in the `posts/` directory with the following format:

### File Structure

Create a file like `posts/your-post-title.md`:

```markdown
---
title: "Your Post Title"
date: "2024-03-15"
category: "Optimizers"
author: "Your Name"
excerpt: "A brief description of your post"
---

# Your Post Title

Your content here...

## Section Heading

More content...

### Subsection

Code examples:

\`\`\`python
def example():
    pass
\`\`\`
```

### Frontmatter Fields

- `title` (required): The title of your post
- `date` (required): Publication date in YYYY-MM-DD format
- `category` (required): The category/section for grouping posts (e.g., "Optimizers", "Transformers", "Attention Mechanisms")
- `author` (optional): Author name
- `excerpt` (optional): Short description for previews

### Categories

Posts are automatically grouped by category on the Technical Writings page. Some suggested categories:

- Optimizers
- Transformers
- Attention Mechanisms
- Training Techniques
- Model Architectures

### Markdown Support

The blog supports standard markdown features:

- Headings (h1-h6)
- Bold, italic, links
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Images
- Blockquotes

## Project Structure

```
website/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── about/
│   │   └── page.tsx             # About page
│   └── technical-writings/
│       ├── page.tsx             # Blog listing page
│       └── [slug]/
│           └── page.tsx         # Individual blog post page
├── components/
│   └── Navigation.tsx           # Site navigation
├── lib/
│   └── posts.ts                 # Blog post utilities
├── posts/                       # Markdown blog posts go here
│   ├── example-post-1.md
│   └── example-post-2.md
└── public/                      # Static assets
```

## Styling

The website uses:
- **Fonts**: Instrument Serif for headings, Helvetica Neue for body text
- **Colors**: Minimalist black and white theme
- **Framework**: Tailwind CSS for styling

## Editing Content

### Homepage
Edit `app/page.tsx` to change the homepage content.

### About Page
Edit `app/about/page.tsx` to update team bios and mission statement.

### Navigation
Edit `components/Navigation.tsx` to add or remove navigation links.

## Deployment

This is a Next.js application and can be deployed to:
- Vercel (recommended)
- Netlify
- Any hosting platform that supports Node.js

For Vercel deployment:
```bash
npm install -g vercel
vercel
```

## Notes

- Blog posts are statically generated at build time for optimal performance
- Posts are automatically sorted by date within each category
- The site is fully responsive and works on all devices
