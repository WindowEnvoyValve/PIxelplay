import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pixelplay.by";
const routes = [
  "/",
  "/clubs",
  "/games",
  "/pricing",
  "/promos",
  "/rules",
  "/services",
  "/specs",
  "/partners",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
