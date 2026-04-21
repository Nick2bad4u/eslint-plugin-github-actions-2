import Link from "@docusaurus/Link";

import styles from "./GitHubStats.module.css";

type GitHubStatsProps = {
    readonly className?: string;
};

type LiveBadge = {
    readonly alt: string;
    readonly href: string;
    readonly src: string;
};

const liveBadges = [
    {
        alt: "npm license",
        href: "https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/blob/main/LICENSE",
        src: "https://flat.badgen.net/npm/license/eslint-plugin-github-actions-2?color=purple",
    },
    {
        alt: "npm total downloads",
        href: "https://www.npmjs.com/package/eslint-plugin-github-actions-2",
        src: "https://flat.badgen.net/npm/dt/eslint-plugin-github-actions-2?color=pink",
    },
    {
        alt: "latest GitHub release",
        href: "https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/releases",
        src: "https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-github-actions-2?color=cyan",
    },
    {
        alt: "GitHub stars",
        href: "https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/stargazers",
        src: "https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-github-actions-2?color=yellow",
    },
    {
        alt: "GitHub forks",
        href: "https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/forks",
        src: "https://flat.badgen.net/github/forks/Nick2bad4u/eslint-plugin-github-actions-2?color=green",
    },
    {
        alt: "GitHub open issues",
        href: "https://github.com/Nick2bad4u/eslint-plugin-github-actions-2/issues",
        src: "https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-plugin-github-actions-2?color=red",
    },
    {
        alt: "codecov",
        href: "https://codecov.io/gh/Nick2bad4u/eslint-plugin-github-actions-2",
        src: "https://codecov.io/gh/Nick2bad4u/eslint-plugin-github-actions-2/branch/main/graph/badge.svg",
    },
] as const satisfies readonly LiveBadge[];

/** Render live package and repository badges. */
export default function GitHubStats({ className = "" }: GitHubStatsProps) {
    const badgeListClassName = [styles["liveBadgeList"], className]
        .filter(Boolean)
        .join(" ");

    return (
        <ul className={badgeListClassName}>
            {liveBadges.map((badge) => (
                <li key={badge.src} className={styles["liveBadgeListItem"]}>
                    <Link
                        className={styles["liveBadgeAnchor"] ?? ""}
                        href={badge.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            alt={badge.alt}
                            className={styles["liveBadgeImage"]}
                            decoding="async"
                            loading="lazy"
                            src={badge.src}
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
