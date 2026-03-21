import { themes as prismThemes } from "prism-react-renderer";

import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

/** GitHub Pages base URL for the docs site. */
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ?? "/eslint-plugin-github-actions-2/";

/** Repository owner used for edit links. */
const organizationName = "Nick2bad4u";
/** Repository name used for edit links and project metadata. */
const repositoryName = "eslint-plugin-github-actions-2";
/** Published npm package name. */
const npmPackageName = "eslint-plugin-github-actions-2";

/** Full Docusaurus site configuration. */
const config: Config = {
    baseUrl,
    deploymentBranch: "gh-pages",
    favicon: "img/logo.svg",
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    organizationName,
    plugins: [
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${repositoryName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                sidebarPath: "./sidebars.rules.ts",
            },
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: {
                    editUrl: `https://github.com/${organizationName}/${repositoryName}/blob/main/docs/docusaurus/`,
                    path: "site-docs",
                    routeBasePath: "docs",
                    sidebarPath: "./sidebars.ts",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    projectName: repositoryName,
    tagline:
        "ESLint rules for GitHub Actions workflows, action metadata, and workflow templates.",
    themeConfig: {
        colorMode: {
            defaultMode: "light",
            respectPrefersColorScheme: true,
        },
        metadata: [
            {
                content:
                    "eslint, github actions, workflows, action metadata, workflow templates",
                name: "keywords",
            },
        ],
        footer: {
            copyright:
                `© ${new Date().getFullYear()} ` +
                '<a href="https://github.com/Nick2bad4u" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> 💻 Built with ' +
                '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">🦖 Docusaurus</a>.',
            links: [
                {
                    title: "📚 Explore",
                    items: [
                        {
                            label: "🏁 Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "🚀 Getting started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "🧭 Presets",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "📏 Rule reference",
                            to: "/docs/rules",
                        },
                    ],
                },
                {
                    title: "📁 Project",
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${repositoryName}/releases`,
                            label: "🧾 Releases",
                        },
                        {
                            href: `https://nick2bad4u.github.io/${repositoryName}/eslint-inspector/`,
                            label: "🔎 ESLint Inspector",
                        },
                        {
                            href: `https://nick2bad4u.github.io/${repositoryName}/stylelint-inspector/`,
                            label: "🎨 Stylelint Inspector",
                        },
                    ],
                },
                {
                    title: "⚙️ Support",
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${repositoryName}`,
                            label: "🐙 GitHub repository",
                        },
                        {
                            href: `https://github.com/${organizationName}/${repositoryName}/issues`,
                            label: "🐛 Report issues",
                        },
                        {
                            href: `https://www.npmjs.com/package/${npmPackageName}`,
                            label: "📦 NPM package",
                        },
                    ],
                },
            ],
            logo: {
                alt: "eslint-plugin-github-actions-2 logo",
                href: `https://github.com/${organizationName}/${repositoryName}`,
                src: "img/logo.svg",
            },
            style: "dark",
        },
        navbar: {
            hideOnScroll: true,
            items: [
                {
                    label: "📚 Docs",
                    to: "/docs/rules/overview",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "• Getting started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "• Presets",
                            to: "/docs/rules/presets",
                        },
                    ],
                },
                {
                    label: "📜 Rules",
                    to: "/docs/rules",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Rule reference",
                            to: "/docs/rules",
                        },
                        {
                            label: "• Workflow rules",
                            to: "/docs/rules/category/workflow-rules",
                        },
                        {
                            label: "• Action metadata rules",
                            to: "/docs/rules/category/action-metadata-rules",
                        },
                        {
                            label: "• Workflow template rules",
                            to: "/docs/rules/category/workflow-template-rules",
                        },
                    ],
                },
                {
                    label: "🧭 Presets",
                    to: "/docs/rules/presets",
                    type: "dropdown",
                    items: [
                        {
                            label: "• Preset reference",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "• Recommended",
                            to: "/docs/rules/presets/recommended",
                        },
                        {
                            label: "• Security",
                            to: "/docs/rules/presets/security",
                        },
                        {
                            label: "• Strict",
                            to: "/docs/rules/presets/strict",
                        },
                        {
                            label: "• All",
                            to: "/docs/rules/presets/all",
                        },
                        {
                            label: "• Action metadata",
                            to: "/docs/rules/presets/action-metadata",
                        },
                        {
                            label: "• Workflow templates",
                            to: "/docs/rules/presets/workflow-templates",
                        },
                    ],
                },
                {
                    href: `https://github.com/${organizationName}/${repositoryName}`,
                    label: "🐙 GitHub",
                    position: "right",
                },
            ],
            logo: {
                alt: "eslint-plugin-github-actions-2 logo",
                src: "img/logo.svg",
            },
            title: npmPackageName,
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "yaml",
                "typescript",
            ],
            darkTheme: prismThemes.dracula,
            theme: prismThemes.github,
        },
    },
    themes: ["@docusaurus/theme-mermaid"],
    title: npmPackageName,
    url: "https://nick2bad4u.github.io",
};

export default config;
