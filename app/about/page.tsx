import Link from 'next/link'

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <Link href="/" className="inline-block mb-8 hover:opacity-60 transition-opacity">
        ← Back
      </Link>
      <h1 className="font-serif text-5xl mb-12 text-center">About</h1>

      <div className="space-y-12">
        {/* Mission */}
        <section>
          <h2 className="font-serif text-3xl mb-4">Our Mission</h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p>
              Few Shot Learners is a research and learning-focused group dedicated to understanding AI at the deepest level. We implement papers from scratch and explore complex machine learning systems with no LLM assistance.
            </p>
            <p>
              We had a good understanding of AI conceptually—if you asked a question verbally about any part of the transformer, we could answer. But our knowledge wasn't grounded in the strong coding foundation we wanted. We could work on complex ML systems, but when it came to the nitty-gritty details, we were lacking.
            </p>
            <p>
              Learning to code well is something that simply takes time and a lot of energy. Many people in the ML space spend time on conceptual understanding but fail to comprehend the details that only come from implementation. Implementing papers isn't a new concept—it's one of the most well-known approaches—but we're committed to making it our practice.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-gray-300 dark:border-gray-700 pt-12">
          <h2 className="font-serif text-3xl mb-8">Team</h2>

          <div className="space-y-8">
            {/* Sid */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <h3 className="font-serif text-2xl mb-3">Sid</h3>
              <p className="text-gray-600 dark:text-gray-400 italic">Placeholder for bio</p>
            </div>

            {/* Akshay */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <h3 className="font-serif text-2xl mb-3">Akshay</h3>
              <p className="text-gray-600 dark:text-gray-400 italic">Placeholder for bio</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
