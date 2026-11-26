/**
 * @packageDocumentation
 * Enforce a consistent casing convention for workflow job display names.
 */
import type { Rule } from "eslint";

import { isDefined } from "ts-extras";

import {
    createDisplayNameCasingPolicy,
    createDisplayNameCasingSchema,
    DEFAULT_DISPLAY_NAME_CASING,
    getDisplayNameCasingViolation,
} from "../_internal/display-name-casing.js";
import { isWorkflowFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getWorkflowJobs,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for enforcing job display-name casing. */
const rule: Rule.RuleModule = {
    create(context) {
        const policy = createDisplayNameCasingPolicy(context.options);

        return {
            Program() {
                if (!isWorkflowFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const violation = getDisplayNameCasingViolation(
                        context,
                        job.mapping,
                        policy
                    );

                    if (!isDefined(violation)) {
                        continue;
                    }

                    const data = { ...violation.data, jobId: job.id };

                    // A job name is its check-run name, so renaming it is a
                    // suggestion: required status checks may use the old name.
                    reportYamlNode(context, {
                        data,
                        messageId: "jobNameDoesNotMatchCasing",
                        node: violation.node,
                        suggest: isDefined(violation.fix)
                            ? [
                                  {
                                      data,
                                      fix: violation.fix,
                                      messageId: "renameJobSuggestion",
                                  },
                              ]
                            : undefined,
                    });
                }
            },
        };
    },
    meta: {
        defaultOptions: [DEFAULT_DISPLAY_NAME_CASING],
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.stylistic",
            ],
            description:
                "enforce a consistent casing convention for workflow job `name` values.",
            dialects: ["GitHub Actions workflow"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R117",
            ruleNumber: 117,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/job-name-casing",
        },
        hasSuggestions: true,
        messages: {
            jobNameDoesNotMatchCasing:
                "Job '{{jobId}}' name '{{name}}' is not in the configured casing: {{caseTypes}}.",
            renameJobSuggestion:
                "Rename job '{{jobId}}' to '{{replacementName}}'. Update required status checks that use the old name.",
        },
        schema: createDisplayNameCasingSchema("job names"),
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
