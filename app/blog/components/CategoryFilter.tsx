import Link from 'next/link'
import { Category } from '../../generated/prisma'

interface CategoryFilterProps {
    categories: Category[]
    activeSlug?: string
}

export default function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Link
                href="/blog"
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${!activeSlug
                        ? 'bg-good-lime text-good-dark-green'
                        : 'bg-white/10 text-good-white hover:bg-white/20'
                    }`}
            >
                TODOS
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeSlug === category.slug
                            ? 'bg-good-lime text-good-dark-green'
                            : 'bg-white/10 text-good-white hover:bg-white/20'
                        }`}
                >
                    {category.name.toUpperCase()}
                </Link>
            ))}
        </div>
    )
}
