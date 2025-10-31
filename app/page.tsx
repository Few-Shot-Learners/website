import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center">
      <div className="px-6 max-w-4xl mx-auto w-full">
        <h1 className="font-serif text-6xl mb-12">Few Shot Learners</h1>
        <div className="space-y-4 text-2xl">
          <div>
            <Link href="/technical-writings" className="underline underline-offset-4 decoration-2 hover:opacity-60 transition-opacity">
              technical writings
            </Link>
          </div>
          <div>
            <a href="https://github.com/Few-Shot-Learners" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-2 hover:opacity-60 transition-opacity">
              github
            </a>
          </div>
          <div>
            <Link href="/about" className="underline underline-offset-4 decoration-2 hover:opacity-60 transition-opacity">
              about
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
