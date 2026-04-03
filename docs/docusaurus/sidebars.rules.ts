import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Sidebar doc item shape for generated lists. */
type SidebarDocItem = {
    readonly className?: string;
    readonly id: string;
    readonly label: string;
    readonly type: "doc";
};

/** Directory containing this sidebar module. */
const sidebarDirectoryPath = dirname(fileURLToPath(import.meta.url));
/** Root rules docs directory consumed by the rules docs plugin. */
const rulesDocsDirectoryPath = join(sidebarDirectoryPath, "..", "rules");
/** Presets docs directory under rules docs. */
const presetsDocsDirectoryPath = join(rulesDocsDirectoryPath, "presets");

/** Files that are overview docs, not individual rule docs. */
const nonRuleDocIds = new Set(["getting-started", "overview"]);

/** Check whether a directory entry points to a markdown file. */
const isMarkdownFile = (fileName: string): boolean => fileName.endsWith(".md");

/** Convert a markdown filename (e.g. `foo.md`) to a Docusaurus doc id. */
const toDocId = (fileName: string): string => fileName.slice(0, -".md".length);

/** Sort strings in a stable, locale-aware way for sidebar labels. */
const sortStrings = (left: string, right: string): number =>
    left.localeCompare(right);

/** All top-level rule doc IDs discovered under `docs/rules/*.md`. */
const topLevelRuleDocIds = readdirSync(rulesDocsDirectoryPath, {
    withFileTypes: true,
})
    .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
    .map((entry) => toDocId(entry.name))
    .filter((docId) => !nonRuleDocIds.has(docId))
    .sort(sortStrings);

/** All preset doc IDs discovered under `docs/rules/presets/*.md`. */
const presetDocIds = readdirSync(presetsDocsDirectoryPath, {
    withFileTypes: true,
})
    .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
    .map((entry) => toDocId(entry.name))
    .filter((docId) => docId !== "index")
    .sort(sortStrings);

/** Preset order for primary docs UX. */
const presetOrder = [
    "recommended",
    "security",
    "code-scanning",
    "strict",
    "all",
    "dependabot",
    "action-metadata",
    "workflow-template-properties",
    "workflow-templates",
] as const;

/** Fast membership lookup for preset IDs included in preferred display order. */
const presetOrderSet = new Set<string>(presetOrder);

/** Preferred label overrides for rule category docs. */
const presetLabelById = new Map<string, string>([
    ["recommended", "🟡 Recommended"],
    ["security", "🛡️ Security"],
    ["code-scanning", "🔎 Code scanning"],
    ["strict", "🔴 Strict"],
    ["all", "🟣 All"],
    ["dependabot", "🤖 Dependabot"],
    ["action-metadata", "🧩 Action metadata"],
    ["workflow-template-properties", "🧱 Workflow template properties"],
    ["workflow-templates", "🧪 Workflow templates"],
]);

const isDependabotRule = (docId: string): boolean =>
    docId.includes("dependabot");

/**
 * Classify rule docs by lint target family for clearer navigation.
 *
 * Workflow templates: rules that validate workflow-template package files.
 * Action metadata: rules that target `action.yml` / `action.yaml`. Workflow
 * rules: remaining workflow YAML rules.
 */
const isWorkflowTemplateRule = (docId: string): boolean =>
    docId.includes("template") ||
    docId.includes("icon-name") ||
    docId.includes("file-pattern");

const isActionMetadataRule = (docId: string): boolean =>
    docId.includes("composite") ||
    docId.includes("input") ||
    docId.includes("action-") ||
    docId.includes("post-if") ||
    docId.includes("pre-if") ||
    docId.includes("node-runtime") ||
    docId.includes("required-input") ||
    docId === "prefer-action-yml";

const workflowTemplateRuleDocIds = topLevelRuleDocIds.filter(
    (docId) => !isDependabotRule(docId) && isWorkflowTemplateRule(docId)
);
const actionMetadataRuleDocIds = topLevelRuleDocIds.filter(
    (docId) =>
        !isDependabotRule(docId) &&
        !isWorkflowTemplateRule(docId) &&
        isActionMetadataRule(docId)
);
const dependabotRuleDocIds = topLevelRuleDocIds.filter(isDependabotRule);
const workflowRuleDocIds = topLevelRuleDocIds.filter(
    (docId) =>
        !isDependabotRule(docId) &&
        !isWorkflowTemplateRule(docId) &&
        !isActionMetadataRule(docId)
);

/** Build labeled doc items for a list of rule doc ids. */
const toRuleItems = (
    docIds: readonly string[],
    options: { readonly showRuleIcon: boolean }
): SidebarDocItem[] =>
    docIds.map((docId) => ({
        id: docId,
        label: options.showRuleIcon ? `📄 ${docId}` : docId,
        type: "doc",
    }));

/** Build labeled preset sidebar items in a preferred order. */
const presetItems: SidebarDocItem[] = [
    ...presetOrder.filter((presetId) => presetDocIds.includes(presetId)),
    ...presetDocIds.filter((presetId) => !presetOrderSet.has(presetId)),
].map((presetId) => ({
    className: `sb-preset-${presetId}`,
    id: `presets/${presetId}`,
    label: presetLabelById.get(presetId) ?? presetId,
    type: "doc",
}));

/** Sidebar structure for rule and preset documentation. */
const sidebars: SidebarsConfig = {
    rules: [
        {
            className: "sb-doc-overview",
            id: "overview",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            className: "sb-doc-getting-started",
            id: "getting-started",
            label: "🚀 Getting started",
            type: "doc",
        },
        {
            className: "sb-cat-presets",
            collapsed: true,
            link: {
                id: "presets/index",
                type: "doc",
            },
            items: presetItems,
            label: "🧭 Presets",
            type: "category",
        },
        {
            className: "sb-cat-rules",
            collapsed: true,
            label: "📚 Rule reference",
            link: {
                description:
                    "Reference documentation for every eslint-plugin-github-actions-2 rule.",
                slug: "/",
                title: "Rule reference",
                type: "generated-index",
            },
            items: [
                {
                    className: "sb-cat-rules-workflows",
                    collapsed: true,
                    label: "⚙️ Workflow rules",
                    link: {
                        description:
                            "Rules targeting `.github/workflows/*.{yml,yaml}` files.",
                        slug: "/category/workflow-rules",
                        title: "Workflow rules",
                        type: "generated-index",
                    },
                    items: toRuleItems(workflowRuleDocIds, {
                        showRuleIcon: true,
                    }),
                    type: "category",
                },
                {
                    className: "sb-cat-rules-dependabot",
                    collapsed: true,
                    label: "🤖 Dependabot rules",
                    link: {
                        description:
                            "Rules targeting `.github/dependabot.{yml,yaml}` configuration files.",
                        slug: "/category/dependabot-rules",
                        title: "Dependabot rules",
                        type: "generated-index",
                    },
                    items: toRuleItems(dependabotRuleDocIds, {
                        showRuleIcon: true,
                    }),
                    type: "category",
                },
                {
                    className: "sb-cat-rules-action-metadata",
                    collapsed: true,
                    label: "🧩 Action metadata rules",
                    link: {
                        description:
                            "Rules targeting action metadata files (`action.yml` / `action.yaml`).",
                        slug: "/category/action-metadata-rules",
                        title: "Action metadata rules",
                        type: "generated-index",
                    },
                    items: toRuleItems(actionMetadataRuleDocIds, {
                        showRuleIcon: true,
                    }),
                    type: "category",
                },
                {
                    className: "sb-cat-rules-workflow-templates",
                    collapsed: true,
                    label: "🧪 Workflow template rules",
                    link: {
                        description:
                            "Rules targeting `workflow-templates/` YAML and properties package files.",
                        slug: "/category/workflow-template-rules",
                        title: "Workflow template rules",
                        type: "generated-index",
                    },
                    items: toRuleItems(workflowTemplateRuleDocIds, {
                        showRuleIcon: true,
                    }),
                    type: "category",
                },
            ],
            type: "category",
        },
    ],
};

export default sidebars;
