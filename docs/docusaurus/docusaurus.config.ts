import { themes as prismThemes } from "prism-react-renderer";

import type { Config } from "@docusaurus/types";
import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type * as Preset from "@docusaurus/preset-classic";
import { fileURLToPath } from "node:url";

import { suppressKnownWebpackWarningsPlugin } from "./src/plugins/suppressKnownWebpackWarningsPlugin";

const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ?? "/eslint-plugin-github-actions-2/";
const enableExperimentalFaster =
    process.env["DOCUSAURUS_ENABLE_EXPERIMENTAL"] === "true";

const organizationName = "Nick2bad4u";
const projectName = "eslint-plugin-github-actions-2";
const siteOrigin = "https://nick2bad4u.github.io";
const siteUrl = `${siteOrigin}${baseUrl}`;
const siteDescription =
    "ESLint rules for GitHub Actions workflows, reusable workflows, and workflow templates.";
const socialCardImagePath = "img/logo.png";
const socialCardImageUrl = new URL(socialCardImagePath, siteUrl).toString();
const modernEnhancementsClientModule = fileURLToPath(
    new URL("src/js/modernEnhancements.ts", import.meta.url)
);

const pwaThemeColor = "#101010";
const footerCopyright =
    `© ${new Date().getFullYear()} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> 💻 Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">🦖 Docusaurus</a>.';

const removeHeadAttrFlagKey = [
    "remove",
    "Le",
    "gacyPostBuildHeadAttribute",
].join("");

const futureConfig = {
    ...(enableExperimentalFaster
        ? {
              faster: {
                  mdxCrossCompilerCache: true,
                  rspackBundler: true,
                  rspackPersistentCache: true,
                  ssgWorkerThreads: true,
              },
          }
        : {}),
    v4: {
        [removeHeadAttrFlagKey]: true,
        fasterByDefault: true,
        mdx1CompatDisabledByDefault: true,
        removeLegacyPostBuildHeadAttribute: true,
        siteStorageNamespacing: true,
        // Keep disabled for now; enabling this has produced CSS minification
        // regressions in similar repos and needs dedicated validation.
        useCssCascadeLayers: false,
    },
} satisfies Config["future"];

const config = {
    baseUrl,
    baseUrlIssueBanner: true,
    clientModules: [modernEnhancementsClientModule],
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.ico",
    future: futureConfig,
    headTags: [
        {
            attributes: {
                href: siteOrigin,
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                href: "https://github.com",
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                description: siteDescription,
                image: socialCardImageUrl,
                name: projectName,
                publisher: {
                    "@type": "Person",
                    name: "Nick2bad4u",
                    url: "https://github.com/Nick2bad4u",
                },
                url: siteUrl,
            }),
            tagName: "script",
        },
    ],
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        anchors: {
            maintainCase: true,
        },
        emoji: true,
        format: "detect",
        hooks: {
            onBrokenMarkdownImages: "warn",
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
    organizationName,
    plugins: [
        suppressKnownWebpackWarningsPlugin,
        "docusaurus-plugin-image-zoom",
        [
            "@docusaurus/plugin-pwa",
            {
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "standalone",
                    "queryString",
                ],
                pwaHead: [
                    {
                        href: `${baseUrl}manifest.json`,
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: pwaThemeColor,
                        name: "theme-color",
                        tagName: "meta",
                    },
                ],
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                sidebarPath: "./sidebars.rules.ts",
            } satisfies DocsPluginOptions,
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: {
                    blogDescription:
                        "Updates, architecture notes, and practical guidance for eslint-plugin-github-actions-2 users.",
                    blogSidebarCount: "ALL",
                    blogSidebarTitle: "All posts",
                    blogTitle: "eslint-plugin-github-actions-2 Blog",
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    onInlineAuthors: "warn",
                    onInlineTags: "warn",
                    onUntruncatedBlogPosts: "warn",
                    path: "blog",
                    routeBasePath: "blog",
                    showReadingTime: true,
                },
                docs: {
                    breadcrumbs: true,
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    includeCurrentVersion: true,
                    onInlineTags: "ignore",
                    path: "site-docs",
                    routeBasePath: "docs",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    sidebarCollapsed: true,
                    sidebarCollapsible: true,
                    sidebarPath: "./sidebars.ts",
                },
                googleTagManager: {
                    containerId: "GTM-T8J6HPLF",
                },
                gtag: {
                    trackingID: "G-18DR1S6R1T",
                },
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: [
                        "**/*.d.ts",
                        "**/*.d.tsx",
                        "**/__tests__/**",
                        "**/*.test.{js,jsx,ts,tsx}",
                        "**/*.spec.{js,jsx,ts,tsx}",
                    ],
                    include: ["**/*.{js,jsx,ts,tsx,md,mdx}"],
                    mdxPageComponent: "@theme/MDXPage",
                    path: "src/pages",
                    routeBasePath: "/",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },
                sitemap: {
                    filename: "sitemap.xml",
                    ignorePatterns: ["/tests/**"],
                    lastmod: "datetime",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    tagline:
        "ESLint rules for GitHub Actions workflows, action metadata, and workflow templates.",
    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        footer: {
            copyright: footerCopyright,
            links: [
                {
                    items: [
                        {
                            label: "🏁 Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "📖 Getting Started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "🧭 Guides",
                            to: "/docs/rules/guides",
                        },
                        {
                            label: "📏 Rule reference",
                            to: "/docs/rules",
                        },
                    ],
                    title: "📚 Explore",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "📦 Releases",
                        },
                        {
                            href: `${siteUrl}eslint-inspector/`,
                            label: "🕵️‍♂️ ESLint Inspector",
                        },
                        {
                            href: `${siteUrl}stylelint-inspector/`,
                            label: "🎨 Stylelint Inspector",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "📦 NPM",
                        },
                    ],
                    title: "📦 Project",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "🐙 GitHub Repository",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/issues`,
                            label: "🐛 Report Issues",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/actions`,
                            label: "🎬 GitHub Actions",
                        },
                        {
                            href: `https://github.com/Nick2bad4u`,
                            label: "👤 Nick2bad4u on GitHub",
                        },
                    ],
                    title: "⚙️ Support",
                },
            ],
            logo: {
                alt: "eslint-plugin-github-actions logo",
                href: `https://github.com/${organizationName}/${projectName}`,
                src: "img/logo.svg",
                width: 120,
                height: 120,
            },
            style: "dark",
        },
        image: socialCardImagePath,
        mermaid: {
            theme: {
                dark: "dark",
                light: "neutral",
            },
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
                            label: "🏁 Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "🚀 Getting started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "🧭 Guides",
                            to: "/docs/rules/guides",
                        },
                    ],
                },
                {
                    label: "📜 Rules",
                    to: "/docs/rules",
                    type: "dropdown",
                    items: [
                        {
                            label: "📏 Rule reference",
                            to: "/docs/rules",
                        },
                        {
                            label: "📄 Workflow rules",
                            to: "/docs/rules/category/workflow-rules",
                        },
                        {
                            label: "🤖 Dependabot rules",
                            to: "/docs/rules/category/dependabot-rules",
                        },
                        {
                            label: "🧩 Action metadata rules",
                            to: "/docs/rules/category/action-metadata-rules",
                        },
                        {
                            label: "🧱 Workflow template rules",
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
                            label: "🧭 Preset reference",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "🟡 Recommended",
                            to: "/docs/rules/presets/recommended",
                        },
                        {
                            label: "🛡️ Security",
                            to: "/docs/rules/presets/security",
                        },
                        {
                            label: "🔎 Code scanning",
                            to: "/docs/rules/presets/code-scanning",
                        },
                        {
                            label: "🔴 Strict",
                            to: "/docs/rules/presets/strict",
                        },
                        {
                            label: "🟣 All",
                            to: "/docs/rules/presets/all",
                        },
                        {
                            label: "🤖 Dependabot",
                            to: "/docs/rules/presets/dependabot",
                        },
                        {
                            label: "🧩 Action metadata",
                            to: "/docs/rules/presets/action-metadata",
                        },
                        {
                            label: "🗂️ Workflow template properties",
                            to: "/docs/rules/presets/workflow-template-properties",
                        },
                        {
                            label: "🧱 Workflow templates",
                            to: "/docs/rules/presets/workflow-templates",
                        },
                    ],
                },
                {
                    label: "👨‍💻 Developer",
                    position: "right",
                    type: "dropdown",
                    items: [
                        {
                            label: "Developer guide",
                            to: "/docs/developer",
                        },
                        {
                            label: "🚀 Maintainer quickstart",
                            to: "/docs/developer/getting-started",
                        },
                        {
                            label: "🏗️ Architecture",
                            to: "/docs/developer/architecture",
                        },
                        {
                            label: "📐 ADRs",
                            to: "/docs/developer/adr",
                        },
                        {
                            label: "👨‍💻 Developer API",
                            to: "/docs/developer/api",
                        },
                    ],
                },
                {
                    label: "📰 Blog",
                    to: "/blog",
                    position: "right",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "GitHub",
                    position: "right",
                },
            ],
            logo: {
                alt: "eslint-plugin-github-actions-2 logo",
                href: baseUrl,
                src: "img/logo.svg",
            },
            title: "eslint-plugin-github-actions-2",
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "yaml",
                "typescript",
            ],
            darkTheme: prismThemes.dracula,
            defaultLanguage: "typescript",
            theme: prismThemes.github,
        },
        tableOfContents: {
            maxHeadingLevel: 4,
            minHeadingLevel: 2,
        },
        zoom: {
            background: {
                dark: "rgb(50, 50, 50)",
                light: "rgb(255, 255, 255)",
            },
            config: {},
            selector: ".markdown > img",
        },
    } satisfies Preset.ThemeConfig,
    themes: [
        "@docusaurus/theme-mermaid",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                docsRouteBasePath: ["docs", "docs/rules"],
                explicitSearchResultPath: true,
                hashed: true,
                indexBlog: true,
                indexDocs: true,
                indexPages: true,
                searchBarPosition: "right",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
            },
        ],
    ],
    title: "eslint-plugin-github-actions-2",
    trailingSlash: true,
    url: siteOrigin,
} satisfies Config;

export default config;
