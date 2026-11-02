import { createPageMetadata } from "@/lib/site";
import data from "@/json/data.json";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = data.Projects.find((entry) => entry.slug === slug);
  if (!project) return createPageMetadata({ title: "Project not found | Lucas Huang", path: `/projects/${slug}` });
  return createPageMetadata({
    title: `${project.title} | Lucas Huang`,
    description: project.desc[0].slice(0, 190).replace(/\s+\S*$/, "") + "…",
    path: `/projects/${slug}`,
  });
}

export default function ProjectLayout({ children }) {
  return children;
}
