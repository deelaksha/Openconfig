export interface WalkthroughSection {
  title: string;
  slug: string;       // empty = index page
  icon: string;
  badge?: string;
  children?: WalkthroughSection[];
}

export const WALKTHROUGH_BASE = "/docs/walkthrough";

export const walkthroughNav: WalkthroughSection[] = [
  {
    title: "Overview",
    slug: "",
    icon: "Home",
    badge: "Start",
  },
  {
    title: "1. YANG Model",
    slug: "yang-model",
    icon: "Globe",
  },
  {
    title: "2. Annotation File",
    slug: "annotation-file",
    icon: "FileCode",
  },
  {
    title: "3. Extensions (oc-ext)",
    slug: "extensions",
    icon: "Puzzle",
  },
  {
    title: "4. Transformer Code",
    slug: "transformer-code",
    icon: "Repeat",
    badge: "Deep dive",
    children: [
      { title: "How Translib Calls Them", slug: "transformer-code/how-translib-calls", icon: "Cpu" },
      { title: "Key Transformer", slug: "transformer-code/key-transformer", icon: "Key" },
      { title: "Field Transformer", slug: "transformer-code/field-transformer", icon: "Wand2" },
      { title: "Table Transformer", slug: "transformer-code/table-transformer", icon: "Table" },
      { title: "Return Types & Results", slug: "transformer-code/return-types", icon: "ArrowLeftRight" },
    ],
  },
  {
    title: "5. SET Flow (Write)",
    slug: "set-flow",
    icon: "Upload",
  },
  {
    title: "6. GET Flow (Read)",
    slug: "get-flow",
    icon: "Download",
  },
  {
    title: "7. Redis DB Output",
    slug: "redis-output",
    icon: "Database",
  },
  {
    title: "8. Backend Invocation",
    slug: "backend-invocation",
    icon: "Cpu",
  },
  {
    title: "9. Verification",
    slug: "verify-annotation",
    icon: "CheckCircle",
  },
];
