import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
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
  "/tournaments",
  "/terms",
  "/tournaments",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
