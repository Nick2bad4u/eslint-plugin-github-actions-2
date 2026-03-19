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

type HomeCard = {
    readonly description: string;
    readonly icon: string;
    readonly title: string;
    readonly to: string;
};

const heroStats = [
    {
        description:
            "Workflow security and quality checks for GitHub Actions YAML.",
        headline: "4 Initial Rules",
    },
    {
        description: "Balanced, security-focused, strict, and all-in presets.",
        headline: "4 Presets",
    },
    {
        description:
            "Purpose-built for .github/workflows/*.yml and *.yaml files.",
        headline: "YAML-first",
    },
] as const satisfies readonly HeroStat[];

const homeCards = [
    {
        description:
            "Install the plugin, enable a preset, and lint workflow files immediately.",
        icon: "⚙️",
        title: "Get started",
        to: "/docs/rules/getting-started",
    },
    {
        description: "Compare recommended, security, strict, and all presets.",
        icon: "🧭",
        title: "Choose a preset",
        to: "/docs/rules/presets/index",
    },
    {
        description:
            "Read the individual rule docs with incorrect and correct examples.",
        icon: "📚",
        title: "Browse rules",
        to: "/docs/rules/overview",
    },
] as const satisfies readonly HomeCard[];

/** Render the Docusaurus landing page for eslint-plugin-github-actions. */
export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.svg");

    return (
        <Layout
            title="eslint-plugin-github-actions docs"
            description="Documentation for eslint-plugin-github-actions"
        >
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div>
                            <p className={styles.heroKicker}>
                                GitHub Actions workflow linting for quality,
                                reliability, and security.
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                eslint-plugin-github-actions
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                Focused ESLint rules for workflow YAML files,
                                including explicit permissions, job timeout
                                enforcement, immutable SHA pinning, and workflow
                                concurrency guidance.
                            </p>

                            <div className={styles.heroActions}>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                                    to="/docs/rules/getting-started"
                                >
                                    Start here
                                </Link>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                                    to="/docs/rules/overview"
                                >
                                    View rules
                                </Link>
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt="eslint-plugin-github-actions logo"
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                        </aside>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        {heroStats.map((stat) => (
                            <article
                                key={stat.headline}
                                className={styles.heroStatCard}
                            >
                                <p className={styles.heroStatHeading}>
                                    {stat.headline}
                                </p>
                                <p className={styles.heroStatDescription}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className="container">
                    <div className={styles.cardGrid}>
                        {homeCards.map((card) => (
                            <article key={card.title} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <p className={styles.cardIcon}>
                                        {card.icon}
                                    </p>
                                    <Heading
                                        as="h2"
                                        className={styles.cardTitle}
                                    >
                                        {card.title}
                                    </Heading>
                                </div>
                                <p className={styles.cardDescription}>
                                    {card.description}
                                </p>
                                <Link className={styles.cardLink} to={card.to}>
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
