import { readFileSync } from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = path.join(process.cwd(), "docs", "rules");

describe("docs integrity", () => {
    it("contains markdown pages for every published rule", () => {
        const requiredRuleDocNames = [
            "action-name-casing.md",
            "job-id-casing.md",
            "max-jobs-per-action.md",
            "no-external-job.md",
            "no-inherit-secrets.md",
            "no-invalid-concurrency-context.md",
            "no-invalid-key.md",
            "no-invalid-reusable-workflow-job-key.md",
            "no-invalid-workflow-call-output-value.md",
            "no-pr-head-checkout-in-pull-request-target.md",
            "no-secrets-in-if.md",
            "no-self-hosted-runner-on-fork-pr-events.md",
            "no-top-level-env.md",
            "no-top-level-permissions.md",
            "no-unknown-job-output-reference.md",
            "no-unknown-step-reference.md",
            "no-untrusted-input-in-run.md",
            "no-write-all-permissions.md",
            "require-workflow-permissions.md",
            "require-job-timeout-minutes.md",
            "pin-action-shas.md",
            "prefer-fail-fast.md",
            "prefer-file-extension.md",
            "prefer-inputs-context.md",
            "prefer-step-uses-style.md",
            "require-action-name.md",
            "require-action-run-name.md",
            "require-checkout-before-local-action.md",
            "require-job-name.md",
            "require-job-step-name.md",
            "require-merge-group-trigger.md",
            "require-pull-request-target-branches.md",
            "require-run-step-shell.md",
            "require-trigger-types.md",
            "require-workflow-call-input-type.md",
            "require-workflow-call-output-value.md",
            "require-workflow-dispatch-input-type.md",
            "require-workflow-interface-description.md",
            "require-workflow-concurrency.md",
            "require-workflow-run-branches.md",
            "valid-timeout-minutes.md",
            "valid-trigger-events.md",
        ];

        for (const fileName of requiredRuleDocNames) {
            const contents = readFileSync(
                path.join(docsRoot, fileName),
                "utf8"
            );

            expect(contents).toContain("## Further reading");
            expect(contents).toContain("> **Rule catalog ID:** R0");
        }
    });
});
