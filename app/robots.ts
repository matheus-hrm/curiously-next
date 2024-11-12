import { type MetadataRoute } from "next"

const absoluteUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}