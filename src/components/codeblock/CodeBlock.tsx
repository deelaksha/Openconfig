"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal, FileCode } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const languageColors: Record<string, string> = {
  yang: "#10b981",
  python: "#f59e0b",
  bash: "#06b6d4",
  json: "#8b5cf6",
  go: "#3b82f6",
  shell: "#06b6d4",
  redis: "#ef4444",
  yaml: "#ec4899",
};

const languageLabels: Record<string, string> = {
  yang: "YANG",
  python: "Python",
  bash: "Bash",
  json: "JSON",
  go: "Go",
  shell: "Shell",
  redis: "Redis CLI",
  yaml: "YAML",
};

function highlightSyntax(code: string, language: string): string {
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments
  highlighted = highlighted.replace(
    /(\/\/.*$|#.*$)/gm,
    '<span style="color: var(--text-tertiary); font-style: italic;">$1</span>'
  );

  // Strings
  highlighted = highlighted.replace(
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    '<span style="color: #10b981;">$1</span>'
  );

  // Numbers
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span style="color: #f59e0b;">$1</span>'
  );

  if (language === "yang") {
    const yangKeywords = /\b(module|container|leaf|list|key|type|description|deviation|deviate|uses|augment|grouping|choice|case|when|must|revision|namespace|prefix|import|include|organization|contact|reference|typedef|identity|feature|if-feature|extension|argument|notification|rpc|input|output|action|anydata|anyxml|bit|bits|boolean|decimal64|empty|enumeration|int8|int16|int32|int64|uint8|uint16|uint32|uint64|string|union|binary|leafref|identityref|instance-identifier|config|mandatory|min-elements|max-elements|ordered-by|status|unique|refine|add|replace|delete|not-supported)\b/g;
    highlighted = highlighted.replace(
      yangKeywords,
      '<span style="color: #8b5cf6; font-weight: 500;">$1</span>'
    );
  } else if (language === "python") {
    const pyKeywords = /\b(def|class|return|if|elif|else|for|while|in|not|and|or|import|from|as|try|except|raise|with|pass|break|continue|True|False|None|self|yield|lambda|global|nonlocal|assert|del|finally|is|async|await)\b/g;
    highlighted = highlighted.replace(
      pyKeywords,
      '<span style="color: #8b5cf6; font-weight: 500;">$1</span>'
    );
    highlighted = highlighted.replace(
      /\b(def\s+)(\w+)/g,
      '$1<span style="color: #3b82f6; font-weight: 500;">$2</span>'
    );
    highlighted = highlighted.replace(
      /\b(class\s+)(\w+)/g,
      '$1<span style="color: #f59e0b; font-weight: 500;">$2</span>'
    );
    highlighted = highlighted.replace(
      /@(\w+)/g,
      '<span style="color: #ec4899;">@$1</span>'
    );
  } else if (language === "json") {
    highlighted = highlighted.replace(
      /("(?:[^"\\]|\\.)*")\s*:/g,
      '<span style="color: #3b82f6;">$1</span>:'
    );
  } else if (language === "bash" || language === "shell") {
    highlighted = highlighted.replace(
      /^\s*(\$|#|>)\s/gm,
      '<span style="color: #06b6d4; font-weight: 600;">$1 </span>'
    );
    const bashKeywords = /\b(sudo|echo|cat|grep|awk|sed|curl|wget|cd|ls|mkdir|rm|cp|mv|docker|redis-cli|sonic-cli|show|config|hgetall|keys|hget|hset)\b/g;
    highlighted = highlighted.replace(
      bashKeywords,
      '<span style="color: #8b5cf6; font-weight: 500;">$1</span>'
    );
  } else if (language === "go") {
    const goKeywords = /\b(func|package|import|type|struct|interface|return|if|else|for|range|var|const|map|string|int|bool|error|nil|fmt|log|switch|case|default|defer|go|chan|select|break|continue|fallthrough|goto)\b/g;
    highlighted = highlighted.replace(
      goKeywords,
      '<span style="color: #8b5cf6; font-weight: 500;">$1</span>'
    );
    highlighted = highlighted.replace(
      /\b(func\s+)(\w+)/g,
      '$1<span style="color: #3b82f6; font-weight: 500;">$2</span>'
    );
  }

  return highlighted;
}

export default function CodeBlock({
  code,
  language = "bash",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const lines = code.trim().split("\n");
  const accentColor = languageColors[language] || "#8b5cf6";

  return (
    <div className="group relative rounded-xl overflow-hidden my-4 border"
      style={{ 
        borderColor: "var(--border-primary)",
        background: "var(--bg-code)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ 
          borderColor: "var(--border-primary)",
          background: "var(--bg-tertiary)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] opacity-70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-70" />
          </div>
          {filename && (
            <div className="flex items-center gap-1.5 ml-2">
              <FileCode size={13} style={{ color: accentColor }} />
              <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                {filename}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              color: accentColor,
              background: `${accentColor}15`,
            }}
          >
            {languageLabels[language] || language}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ 
              color: "var(--text-tertiary)",
              background: "transparent",
            }}
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={14} style={{ color: "#10b981" }} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy size={14} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-[13px] leading-6">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span
                    className="select-none inline-block w-8 mr-4 text-right text-xs"
                    style={{ color: "var(--text-tertiary)", opacity: 0.5 }}
                  >
                    {i + 1}
                  </span>
                )}
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightSyntax(line, language) || "&nbsp;",
                  }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
