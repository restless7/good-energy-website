'use server'

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export async function getPosts(categorySlug?: string) {
    try {
        const where: any = {
            publishedAt: {
                lte: new Date(),
            },
        }

        if (categorySlug) {
            where.category = {
                slug: categorySlug,
            }
        }

        const posts = await prisma.post.findMany({
            where,
            include: {
                author: true,
                category: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
        })
        return posts
    } catch (error) {
        console.error('Error fetching posts:', error)
        return []
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        })
        return categories
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                slug,
            },
            include: {
                author: true,
                category: true,
            },
        })
        return post
    } catch (error) {
        console.error(`Error fetching post with slug ${slug}:`, error)
        return null
    }
}

export async function getFeaturedPost() {
    try {
        // For now, just return the latest post as featured
        const post = await prisma.post.findFirst({
            where: {
                publishedAt: {
                    lte: new Date(),
                },
            },
            include: {
                author: true,
                category: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
        })
        return post
    } catch (error) {
        console.error('Error fetching featured post:', error)
        return null
    }
}
