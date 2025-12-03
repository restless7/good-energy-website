import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import CategoryPill from './CategoryPill'
import { Post, Author, Category } from '../../generated/prisma'

interface BlogCardProps {
    post: Post & { author: Author; category: Category | null }
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="flex flex-col h-full overflow-hidden rounded-2xl bg-good-dark-green/30 border border-white/10 hover:border-good-lime/50 transition-all duration-300 group">
            <Link href={`/blog/${post.slug}`} className="relative h-48 w-full overflow-hidden">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-good-green flex items-center justify-center">
                        <span className="text-good-white/20 text-4xl font-bold">GE</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-good-dark-green to-transparent opacity-60" />
            </Link>

            <div className="flex flex-col flex-grow p-6">
                <div className="flex items-center gap-3 mb-4">
                    {post.category && (
                        <CategoryPill name={post.category.name} slug={post.category.slug} />
                    )}
                    {post.publishedAt && (
                        <span className="text-xs text-good-white/60">
                            {format(new Date(post.publishedAt), 'd MMM, yyyy', { locale: es })}
                        </span>
                    )}
                </div>

                <Link href={`/blog/${post.slug}`} className="group-hover:text-good-lime transition-colors">
                    <h3 className="text-xl font-bold text-good-white mb-3 line-clamp-2 leading-tight">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-good-white/70 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                </p>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                    {post.author.avatar ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-good-lime/30">
                            <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-good-lime/20 flex items-center justify-center text-good-lime text-xs font-bold">
                            {post.author.name.charAt(0)}
                        </div>
                    )}
                    <span className="text-sm text-good-white/80 font-medium">
                        {post.author.name}
                    </span>
                </div>
            </div>
        </article>
    )
}
