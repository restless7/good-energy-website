import { getPostBySlug } from '../../actions/blog'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import CategoryPill from '../components/CategoryPill'

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-good-dark-green text-white pb-20">
            {/* Header / Hero for the post */}
            <div className="relative w-full h-[60vh] min-h-[400px]">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-good-green" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-good-dark-green via-good-dark-green/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
                    <div className="container mx-auto max-w-4xl">
                        <div className="mb-6">
                            {post.category && (
                                <CategoryPill name={post.category.name} slug={post.category.slug} />
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-good-white/80">
                            {post.author.avatar && (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-good-lime/30">
                                    <Image
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <span className="font-medium">{post.author.name}</span>
                            <span className="w-1 h-1 bg-good-lime rounded-full" />
                            <span>{post.publishedAt && format(new Date(post.publishedAt), 'd MMMM, yyyy', { locale: es })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 max-w-3xl mt-12">
                <div className="prose prose-invert prose-lg prose-headings:text-good-white prose-a:text-good-lime prose-strong:text-white prose-blockquote:border-l-good-lime prose-blockquote:text-good-lime/90 prose-blockquote:italic max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-good-lime hover:text-white transition-colors font-semibold"
                    >
                        ← Volver al Blog
                    </Link>
                </div>
            </div>
        </article>
    )
}
