export interface DocSection {
  title: string;
  slug: string;
  icon: string;
  children?: DocSection[];
}

export const docsNavigation: DocSection[] = [
  {
    title: "OpenConfig YANG Model",
    slug: "yang-model",
    icon: "Globe",
  },
  {
    title: "Annotation File",
    slug: "annotation-file",
    icon: "FileCode",
  },
  {
    title: "Extensions (oc-ext)",
    slug: "extensions",
    icon: "Puzzle",
  },
  {
    title: "Transformer Code",
    slug: "transformers",
    icon: "Repeat",
    children: [
      { title: "Key Transformer", slug: "key-transformer", icon: "Key" },
      { title: "Field Transformer", slug: "field-transformer", icon: "Wand2" },
      { title: "Table Transformer", slug: "table-transformer", icon: "Table" },
    ],
  },
  {
    title: "SET Flow (Write)",
    slug: "set-flow",
    icon: "Upload",
  },
  {
    title: "GET Flow (Read)",
    slug: "get-flow",
    icon: "Download",
  },
  {
    title: "Redis DB Output",
    slug: "redis-output",
    icon: "Database",
  },
  {
    title: "Annotation Types Compared",
    slug: "annotation-types",
    icon: "LayoutGrid",
  },
  {
    title: "Backend Invocation",
    slug: "backend-invocation",
    icon: "Cpu",
  },
  {
    title: "Verify Annotation",
    slug: "verify-annotation",
    icon: "CheckCircle",
  },
  {
    title: "Subtree Transformer E2E",
    slug: "subtree-e2e",
    icon: "GitBranch",
  },
];

export interface SearchableItem {
  title: string;
  slug: string;
  parentSlug?: string;
  description: string;
  keywords: string[];
}

export const searchableItems: SearchableItem[] = [
  { title: "OpenConfig YANG Model", slug: "yang-model", description: "The OpenConfig interface YANG model structure", keywords: ["yang", "openconfig", "model", "interface"] },
  { title: "Annotation File", slug: "annotation-file", description: "Annotation .yang file that maps OpenConfig to SONiC", keywords: ["annotation", "mapping", "yang", "deviation"] },
  { title: "Extensions", slug: "extensions", description: "oc-ext extensions: table-name, field-name, transformers", keywords: ["extension", "oc-ext", "table-name", "field-name"] },
  { title: "Key Transformer", slug: "key-transformer", parentSlug: "transformers", description: "Converts OpenConfig list keys to Redis keys", keywords: ["key", "transformer", "redis", "convert"] },
  { title: "Field Transformer", slug: "field-transformer", parentSlug: "transformers", description: "Converts field values between OpenConfig and SONiC", keywords: ["field", "transformer", "value", "convert"] },
  { title: "Table Transformer", slug: "table-transformer", parentSlug: "transformers", description: "Dynamically resolves which Redis table to use", keywords: ["table", "transformer", "dynamic", "resolve"] },
  { title: "SET Flow", slug: "set-flow", description: "OpenConfig → Annotation → Transformer → Redis DB", keywords: ["set", "write", "flow", "gnmi"] },
  { title: "GET Flow", slug: "get-flow", description: "Redis DB → Transformer → Annotation → OpenConfig", keywords: ["get", "read", "flow", "gnmi"] },
  { title: "Redis DB Output", slug: "redis-output", description: "Final Redis entries in CONFIG_DB, APPL_DB, STATE_DB", keywords: ["redis", "db", "output", "config_db", "appl_db"] },
  { title: "Annotation Types Compared", slug: "annotation-types", description: "How annotation differs for subtree, field, key, table transformers", keywords: ["annotation", "types", "compare", "subtree", "field", "key", "table"] },
  { title: "Backend Invocation", slug: "backend-invocation", description: "How Translib invokes transformers in Go backend", keywords: ["backend", "invocation", "translib", "go", "function"] },
  { title: "Verify Annotation", slug: "verify-annotation", description: "How to check if annotation is mapped correctly", keywords: ["verify", "check", "validate", "annotation", "correct"] },
  { title: "Subtree Transformer E2E", slug: "subtree-e2e", description: "End-to-end subtree transformer converting to Redis DB", keywords: ["subtree", "transformer", "e2e", "end-to-end", "redis"] },
];
