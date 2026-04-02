/**
 * @packageDocumentation
 * Require non-cron Dependabot schedules to declare an explicit `schedule.time`.
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

/** Rule implementation for requiring `schedule.time` on non-cron schedules. */
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

                    if (intervalValue === undefined || intervalValue === null) {
                        continue;
                    }

                    if (intervalValue === "cron") {
                        continue;
                    }

                    const timePair = getMappingPair(scheduleMapping, "time");
                    const timeValue = getScalarStringValue(
                        timePair?.value
                    )?.trim();

                    if (
                        timeValue !== undefined &&
                        timeValue !== null &&
                        timeValue.length > 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingScheduleTime",
                        node: (timePair?.value ??
                            timePair ??
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
                "require non-cron Dependabot schedules to declare an explicit `schedule.time`.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R075",
            ruleNumber: 75,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-schedule-time",
        },
        messages: {
            missingScheduleTime:
                "{{updateLabel}} should declare an explicit `schedule.time` for predictable Dependabot update runs.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
