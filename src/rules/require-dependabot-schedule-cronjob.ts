/**
 * @packageDocumentation
 * Require cron schedules to declare `cronjob` and non-cron schedules to omit it.
 */
import type { Rule } from "eslint";

import {
    getDependabotRoot,
    getDependabotUpdateEntries,
    getDependabotUpdateLabel,
    getEffectiveDependabotUpdateMapping,
} from "../_internal/dependabot-yaml.js";
import {
    getMappingPair,
    getScalarStringValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for `schedule.cronjob` correctness. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                const root = getDependabotRoot(context);

                if (root === null) {
                    return;
                }

                for (const update of getDependabotUpdateEntries(root)) {
                    const scheduleMapping = getEffectiveDependabotUpdateMapping(
                        root,
                        update,
                        "schedule"
                    );

                    if (scheduleMapping === null) {
                        continue;
                    }

                    const intervalValue = getScalarStringValue(
                        getMappingPair(scheduleMapping, "interval")?.value
                    )?.trim();
                    const cronjobPair = getMappingPair(
                        scheduleMapping,
                        "cronjob"
                    );
                    const cronjobValueNode = cronjobPair?.value ?? null;
                    const cronjobValue =
                        getScalarStringValue(cronjobValueNode)?.trim();

                    if (intervalValue === "cron") {
                        if (
                            cronjobValue !== undefined &&
                            cronjobValue !== null &&
                            cronjobValue.length > 0
                        ) {
                            continue;
                        }

                        context.report({
                            data: {
                                updateLabel: getDependabotUpdateLabel(update),
                            },
                            messageId: "missingCronjob",
                            node: (cronjobValueNode ??
                                cronjobPair ??
                                update.node) as unknown as Rule.Node,
                        });

                        continue;
                    }

                    if (
                        cronjobValue === undefined ||
                        cronjobValue === null ||
                        cronjobValue.length === 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            intervalValue: intervalValue ?? "(missing)",
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "unexpectedCronjob",
                        node: (cronjobValueNode ??
                            cronjobPair ??
                            update.node) as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.dependabot",
            ],
            description:
                "require Dependabot `schedule.cronjob` for `interval: cron` and disallow it for non-cron intervals.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R083",
            ruleNumber: 83,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-schedule-cronjob",
        },
        messages: {
            missingCronjob:
                "{{updateLabel}} uses `schedule.interval: cron` and must define a non-empty `schedule.cronjob`.",
            unexpectedCronjob:
                "{{updateLabel}} defines `schedule.cronjob`, but `schedule.interval` is '{{intervalValue}}'. Use `cronjob` only with `interval: cron`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
