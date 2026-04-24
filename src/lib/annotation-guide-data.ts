export interface GuideSection {
  title: string;
  slug: string;       // used as href path segment
  icon: string;
  badge?: string;
  children?: GuideSection[];
}

// Base path for the annotation guide
export const GUIDE_BASE = "/docs/annotation-guide";

export const annotationGuideNav: GuideSection[] = [
  {
    title: "Overview",
    slug: "",               // /docs/annotation-guide
    icon: "Home",
    badge: "Start here",
  },
  {
    title: "1. Annotation Anatomy",
    slug: "annotation-anatomy",
    icon: "FileCode",
    badge: "Foundation",
  },
  {
    title: "2. Direct Mapping",
    slug: "direct-mapping",
    icon: "ArrowRight",
    badge: "Simplest",
  },
  {
    title: "3. Key Transformer",
    slug: "key-transformer",
    icon: "Key",
  },
  {
    title: "4. Field Transformer",
    slug: "field-transformer",
    icon: "Wand2",
  },
  {
    title: "5. Table Transformer",
    slug: "table-transformer",
    icon: "Table",
  },
  {
    title: "6. Subtree Transformer",
    slug: "subtree-transformer",
    icon: "GitBranch",
    badge: "Advanced",
  },
  {
    title: "7. Pre / Post Transformer",
    slug: "pre-post-transformer",
    icon: "Layers",
  },
  {
    title: "8. Decision Tree",
    slug: "decision-tree",
    icon: "GitFork",
  },
  {
    title: "9. Verification",
    slug: "verification",
    icon: "CheckSquare",
  },
  {
    title: "10. Cheatsheet",
    slug: "cheatsheet",
    icon: "Zap",
    badge: "Reference",
  },
];
