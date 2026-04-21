/**
 * @packageDocumentation
 * Require every Dependabot update entry to define an effective `schedule.interval`.
 */
import type { Rule } from "eslint";

import { isDefined, setHas } from "ts-extras";

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

/** Valid schedule interval values documented by GitHub. */
const validDependabotIntervals = new Set([
    "cron",
    "daily",
    "monthly",
    "quarterly",
    "semiannually",
    "weekly",
    "yearly",
]);

/** Rule implementation for requiring effective `schedule.interval`. */
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
                    const intervalPair =
                        scheduleMapping === null
                            ? null
                            : getMappingPair(scheduleMapping, "interval");
                    const intervalValue = getScalarStringValue(
                        intervalPair?.value
                    )?.trim();

                    if (
                        isDefined(intervalValue) &&
                        intervalValue !== null &&
                        setHas(validDependabotIntervals, intervalValue)
                    ) {
                        continue;
                    }

                    context.report({
                        data: {
                            updateLabel: getDependabotUpdateLabel(update),
                        },
                        messageId:
                            intervalPair === null
                                ? "missingScheduleInterval"
                                : "invalidScheduleInterval",
                        node: (intervalPair?.value ??
                            intervalPair ??
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
                "require every Dependabot update entry to define a valid effective `schedule.interval`.",
            dialects: ["Dependabot configuration"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R074",
            ruleNumber: 74,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-dependabot-schedule-interval",
        },
        messages: {
            invalidScheduleInterval:
                "{{updateLabel}} must use a supported `schedule.interval` value such as `daily`, `weekly`, `monthly`, or `cron`.",
            missingScheduleInterval:
                "{{updateLabel}} must define an effective `schedule.interval` (directly or via its `multi-ecosystem-group`).",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
