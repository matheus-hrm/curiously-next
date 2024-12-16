import { prisma } from '@/prisma/prisma';
import { MetadataRoute } from 'next';

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all users for dynamic routes
  const users = await prisma.user.findMany({
    select: {
      username: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // User profile pages
  const userRoutes = users.map((user) => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`,
    lastModified: user.createdAt,
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.8,
  }));

  // Static routes
  const routes = [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/feed`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.7,
    },
  ];

  return [...routes, ...userRoutes];
}
