import { describe, expect, it } from "vitest";

import {
    convertToGithubActionsCasing,
    type GithubActionsCasingKind,
    githubActionsCasingKinds,
    matchesGithubActionsCasing,
} from "../src/_internal/casing.js";

describe("casing helpers", () => {
    it("converts mixed identifiers across all supported casing kinds", () => {
        expect.hasAssertions();

        const source = "HTTPServer_error-code 2FA";

        const expectedByKind: Record<GithubActionsCasingKind, string> = {
            camelCase: "httpServerErrorCode2fa",
            "kebab-case": "http-server-error-code-2fa",
            PascalCase: "HttpServerErrorCode2fa",
            SCREAMING_SNAKE_CASE: "HTTP_SERVER_ERROR_CODE_2FA",
            snake_case: "http_server_error_code_2fa",
            "Title Case": "HTTP Server Error Code 2fa",
            "Train-Case": "HTTP-Server-Error-Code-2fa",
        };

        for (const kind of githubActionsCasingKinds) {
            expect(convertToGithubActionsCasing(source, kind)).toBe(
                expectedByKind[kind]
            );
        }
    });

    it("retains original values when no alphanumeric words can be extracted", () => {
        expect.hasAssertions();
        expect(convertToGithubActionsCasing("---___***", "camelCase")).toBe(
            "---___***"
        );
    });

    it("handles acronym boundaries and numeric segments predictably", () => {
        expect.hasAssertions();
        expect(convertToGithubActionsCasing("myXMLParser2", "snake_case")).toBe(
            "my_xml_parser2"
        );
        expect(
            convertToGithubActionsCasing("release2026Build", "kebab-case")
        ).toBe("release2026build");
    });

    it("respects case-police canonical brand and acronym spellings for title styles", () => {
        expect.hasAssertions();
        expect(
            convertToGithubActionsCasing("git hub actions", "Title Case")
        ).toBe("GitHub Actions");
        expect(convertToGithubActionsCasing("wifi setup", "Train-Case")).toBe(
            "Wi-Fi-Setup"
        );
    });

    it("checks whether an input already matches a requested casing style", () => {
        expect.hasAssertions();
        expect(
            matchesGithubActionsCasing("build-release", "kebab-case")
        ).toBeTruthy();
        expect(
            matchesGithubActionsCasing("BuildRelease", "kebab-case")
        ).toBeFalsy();
    });

    it("falls back safely for unknown casing kinds at runtime", () => {
        expect.hasAssertions();
        expect(
            convertToGithubActionsCasing(
                "KeepOriginal",
                "not-a-real-kind" as GithubActionsCasingKind
            )
        ).toBe("KeepOriginal");
    });
});
