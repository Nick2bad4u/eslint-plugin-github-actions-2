import { readFileSync } from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import githubActionsPlugin from "../src/plugin.js";

const docsRoot = path.join(process.cwd(), "docs", "rules");

describe("docs integrity", () => {
    it("contains markdown pages for every published rule", () => {
        const requiredRuleDocNames = Object.keys(githubActionsPlugin.rules)
            .toSorted((left, right) => left.localeCompare(right))
            .map((ruleName) => `${ruleName}.md`);

        for (const fileName of requiredRuleDocNames) {
            const contents = readFileSync(
                path.join(docsRoot, fileName),
                "utf8"
            );

            expect(contents).toContain("## Further reading");
            expect(contents).toMatch(/> \*\*Rule catalog ID:\*\* R\d+/v);
        }
    });
});
