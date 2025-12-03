import { getPosts, getCategories } from '../actions/blog'
import BlogHero from './components/BlogHero'
import BlogCard from './components/BlogCard'
import CategoryFilter from './components/CategoryFilter'

export const revalidate = 60

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const resolvedSearchParams = await searchParams
    const categorySlug = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined

    const [posts, categories] = await Promise.all([
        getPosts(categorySlug),
        getCategories()
    ])

    return (
        <main className="min-h-screen bg-good-dark-green text-white">
            <BlogHero />

            <section className="container mx-auto px-4 py-16 md:py-24">
                <CategoryFilter categories={categories} activeSlug={categorySlug} />

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-good-white/60">
                            No hay noticias en esta categoría.
                        </p>
                    </div>
                )}
            </section>
        </main>
    )
}
