/**
 * @packageDocumentation
 * Require explicit `schedule.timezone` when Dependabot uses `time` or `cron` scheduling.
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

/** Rule implementation for requiring explicit schedule timezones. */
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
                    const timeValue = getScalarStringValue(
                        getMappingPair(scheduleMapping, "time")?.value
                    )?.trim();

                    if (
                        intervalValue !== "cron" &&
                        (timeValue === undefined ||
                            timeValue === null ||
                            timeValue.length === 0)
                    ) {
                        continue;
                    }

                    const timezonePair = getMappingPair(
                        scheduleMapping,
                        "timezone"
                    );
                    const timezoneValue = getScalarStringValue(
                        timezonePair?.value
                    )?.trim();

                    if (
                        timezoneValue !== undefined &&
                        timezoneValue !== null &&
                        timezoneValue.length > 0
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId: "missingScheduleTimezone",
                        node: (timezonePair?.value ??
                            timezonePair ??
                            update.node) as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.all",
                "github-actions.configs.dependabot",
            ],
            description:
                "require explicit `schedule.timezone` when Dependabot schedules use `time` or `cron` semantics.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R076",
            ruleNumber: 76,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-schedule-timezone",
        },
        messages: {
            missingScheduleTimezone:
                "{{updateLabel}} should declare `schedule.timezone` so Dependabot runs at the intended local time.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
