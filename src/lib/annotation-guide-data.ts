export interface GuideSection {
  title: string;
  slug: string;
  icon: string;
  children?: GuideSection[];
}

export const annotationGuideNav: GuideSection[] = [
  {
    title: "What is an Annotation?",
    slug: "what-is-annotation",
    icon: "HelpCircle",
  },
  {
    title: "Big Picture Architecture",
    slug: "architecture",
    icon: "Layers",
  },
  {
    title: "Prerequisites",
    slug: "prerequisites",
    icon: "ClipboardCheck",
  },
  {
    title: "YANG Basics You Need",
    slug: "yang-basics",
    icon: "BookOpen",
    children: [
      { title: "Modules & Imports", slug: "yang-modules", icon: "Package" },
      { title: "Containers & Lists", slug: "yang-containers", icon: "Box" },
      { title: "Leafs & Leaf-Lists", slug: "yang-leafs", icon: "Leaf" },
      { title: "Paths & Prefixes", slug: "yang-paths", icon: "Route" },
    ],
  },
  {
    title: "Deviation Blocks",
    slug: "deviation-blocks",
    icon: "GitBranch",
    children: [
      { title: "Syntax Rules", slug: "deviation-syntax", icon: "Code" },
      { title: "Path Format", slug: "deviation-paths", icon: "Route" },
      { title: "deviate add vs replace", slug: "deviate-types", icon: "Diff" },
    ],
  },
  {
    title: "All Extensions Reference",
    slug: "extensions-ref",
    icon: "Puzzle",
    children: [
      { title: "table-name", slug: "ext-table-name", icon: "Table" },
      { title: "field-name", slug: "ext-field-name", icon: "Tag" },
      { title: "key-transformer", slug: "ext-key-xfmr", icon: "Key" },
      { title: "field-transformer", slug: "ext-field-xfmr", icon: "Wand2" },
      { title: "table-transformer", slug: "ext-table-xfmr", icon: "Shuffle" },
      { title: "subtree-transformer", slug: "ext-subtree-xfmr", icon: "GitBranch" },
      { title: "db-name", slug: "ext-db-name", icon: "Database" },
      { title: "post-transformer", slug: "ext-post-xfmr", icon: "CheckCircle" },
      { title: "pre-transformer", slug: "ext-pre-xfmr", icon: "Shield" },
      { title: "key-delimiter", slug: "ext-key-delimiter", icon: "Minus" },
    ],
  },
  {
    title: "Transformer Types Deep Dive",
    slug: "transformer-types",
    icon: "Repeat",
    children: [
      { title: "Direct Mapping", slug: "xfmr-direct", icon: "ArrowRight" },
      { title: "Key Transformer", slug: "xfmr-key", icon: "Key" },
      { title: "Field Transformer", slug: "xfmr-field", icon: "Wand2" },
      { title: "Table Transformer", slug: "xfmr-table", icon: "Table" },
      { title: "Subtree Transformer", slug: "xfmr-subtree", icon: "GitBranch" },
      { title: "Pre/Post Transformer", slug: "xfmr-pre-post", icon: "Layers" },
    ],
  },
  {
    title: "Decision Tree: Which to Use",
    slug: "decision-tree",
    icon: "GitFork",
  },
  {
    title: "Writing Go Transformers",
    slug: "go-transformers",
    icon: "Code",
    children: [
      { title: "Registration Pattern", slug: "go-registration", icon: "Plug" },
      { title: "XfmrParams Explained", slug: "go-xfmr-params", icon: "Package" },
      { title: "Return Types", slug: "go-return-types", icon: "ArrowLeftRight" },
      { title: "Error Handling", slug: "go-error-handling", icon: "AlertTriangle" },
    ],
  },
  {
    title: "Complete Example #1: Interface",
    slug: "example-interface",
    icon: "MonitorSmartphone",
  },
  {
    title: "Complete Example #2: VLAN",
    slug: "example-vlan",
    icon: "Network",
  },
  {
    title: "Complete Example #3: ACL (Subtree)",
    slug: "example-acl",
    icon: "Shield",
  },
  {
    title: "Common Mistakes & Fixes",
    slug: "common-mistakes",
    icon: "Bug",
  },
  {
    title: "Verification Checklist",
    slug: "verification",
    icon: "CheckSquare",
  },
  {
    title: "Quick Reference Cheatsheet",
    slug: "cheatsheet",
    icon: "Zap",
  },
];
