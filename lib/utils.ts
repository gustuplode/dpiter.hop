import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

export function getCollectionUrl(id: string, title: string): string {
  const slug = generateSlug(title)
  return `/collections/${id}/${slug}`
}

export function getProductUrl(id: string, title: string, category: string): string {
  const slug = generateSlug(title)
  return `/products/${category}/${id}/${slug}`
}

export function getCollectionProductUrl(collectionId: string, productId: string, title: string): string {
  const slug = generateSlug(title)
  return `/collections/${collectionId}/products/${productId}/${slug}`
}

export const generateProductUrl = getProductUrl
