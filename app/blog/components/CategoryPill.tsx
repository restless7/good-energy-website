import Link from 'next/link'

interface CategoryPillProps {
    name: string
    slug: string
    className?: string
}

export default function CategoryPill({ name, slug, className = '' }: CategoryPillProps) {
    return (
        <Link
            href={`/blog?category=${slug}`}
            className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-good-lime text-good-dark-green hover:bg-white transition-colors duration-300 ${className}`}
        >
            {name}
        </Link>
    )
}
