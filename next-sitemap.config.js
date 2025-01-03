module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', // Your site's URL
    generateRobotsTxt: true, // Generate a robots.txt file
    exclude: ['/server-sitemap.xml'], // Exclude specific routes
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
      additionalSitemaps: [
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/server-sitemap.xml`, // Add additional sitemaps if needed
      ],
    },
  };