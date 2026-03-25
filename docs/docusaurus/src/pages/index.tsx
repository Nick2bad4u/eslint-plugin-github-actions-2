import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import GitHubStats from "../components/GitHubStats";
import styles from "./index.module.css";

type HeroStat = {
    readonly description: string;
    readonly headline: string;
};

type HeroBadge = {
    readonly description: string;
    readonly icon: string;
    readonly label: string;
};

type HomeCard = {
    readonly description: string;
    readonly icon: string;
    readonly title: string;
    readonly to: string;
};

const heroBadges = [
    {
        description: "Flat Config-native presets for ESLint v9+.",
        icon: "🧰",
        label: "Modern ESLint",
    },
    {
        description:
            "Covers workflow YAML, action metadata, and workflow-template packages.",
        icon: "⚙️",
        label: "GitHub Actions-first",
    },
    {
        description:
            "Clear diagnostics and focused examples for maintainers and contributors.",
        icon: "🧭",
        label: "Actionable docs",
    },
] as const satisfies readonly HeroBadge[];

const heroStats = [
    {
        description:
            "Rules across workflows, action metadata, and template package files.",
        headline: "📚 69+ Rules",
    },
    {
        description:
            "Recommended, security, strict, all, and target-specific presets.",
        headline: "🧭 7 Presets",
    },
    {
        description:
            "Security, reliability, and maintainability guidance for CI pipelines.",
        headline: "🚀 CI-focused",
    },
] as const satisfies readonly HeroStat[];

const homeCards = [
    {
        description:
            "Install the plugin, enable a preset, and lint workflows quickly.",
        icon: "⚙️",
        title: "Get started",
        to: "/docs/rules/getting-started",
    },
    {
        description: "Compare recommended, security, strict, and all presets.",
        icon: "🧭",
        title: "Choose a preset",
        to: "/docs/rules/presets",
    },
    {
        description:
            "Browse every rule with incorrect/correct examples and adoption guidance.",
        icon: "📚",
        title: "Rule reference",
        to: "/docs/rules",
    },
] as const satisfies readonly HomeCard[];

/** Render the Docusaurus landing page for eslint-plugin-github-actions-2. */
export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.svg");
    const cardLinkClassName = styles["cardLink"] ?? "";

    return (
        <Layout
            title="eslint-plugin-github-actions-2 docs"
            description="Documentation for eslint-plugin-github-actions-2"
        >
            <header className={styles["heroBanner"]}>
                <div className={`container ${styles["heroContent"]}`}>
                    <div className={styles["heroGrid"]}>
                        <div>
                            <p className={styles["heroKicker"]}>
                                ⚙️ ESLint plugin for secure and maintainable
                                GitHub Actions automation
                            </p>
                            <Heading as="h1" className={styles["heroTitle"]}>
                                eslint-plugin-github-actions-2
                            </Heading>
                            <p className={styles["heroSubtitle"]}>
                                Focused ESLint rules for workflow YAML files,
                                action metadata files, and workflow-template
                                package assets. Enforce explicit permissions,
                                safer triggers, reusable-workflow contracts, and
                                stronger template hygiene.
                            </p>

                            <div className={styles["heroBadgeRow"]}>
                                {heroBadges.map((badge) => (
                                    <article
                                        key={badge.label}
                                        className={styles["heroBadge"]}
                                    >
                                        <p className={styles["heroBadgeLabel"]}>
                                            <span
                                                aria-hidden="true"
                                                className={
                                                    styles["heroBadgeIcon"]
                                                }
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles["heroBadgeDescription"]
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles["heroActions"]}>
                                <Link
                                    className={`button button--lg ${styles["heroActionButton"]} ${styles["heroActionPrimary"]}`}
                                    to="/docs/rules/overview"
                                >
                                    🏁 Start with overview
                                </Link>
                                <Link
                                    className={`button button--lg ${styles["heroActionButton"]} ${styles["heroActionSecondary"]}`}
                                    to="/docs/rules/presets"
                                >
                                    🧭 Compare presets
                                </Link>
                            </div>
                        </div>

                        <aside className={styles["heroPanel"]}>
                            <img
                                alt="eslint-plugin-github-actions-2 logo"
                                className={styles["heroPanelLogo"]}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                        </aside>
                    </div>

                    <GitHubStats className={styles["heroLiveBadges"] ?? ""} />

                    <div className={styles["heroStats"]}>
                        {heroStats.map((stat) => (
                            <article
                                key={stat.headline}
                                className={styles["heroStatCard"]}
                            >
                                <p className={styles["heroStatHeading"]}>
                                    {stat.headline}
                                </p>
                                <p className={styles["heroStatDescription"]}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles["mainContent"]}>
                <section className="container">
                    <div className={styles["cardGrid"]}>
                        {homeCards.map((card) => (
                            <article
                                key={card.title}
                                className={styles["card"]}
                            >
                                <div className={styles["cardHeader"]}>
                                    <p className={styles["cardIcon"]}>
                                        {card.icon}
                                    </p>
                                    <Heading
                                        as="h2"
                                        className={styles["cardTitle"]}
                                    >
                                        {card.title}
                                    </Heading>
                                </div>
                                <p className={styles["cardDescription"]}>
                                    {card.description}
                                </p>
                                <Link
                                    className={cardLinkClassName}
                                    to={card.to}
                                >
                                    Open section →
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
