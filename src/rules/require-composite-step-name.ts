/**
 * @packageDocumentation
 * Require `name` on composite action steps.
 */
import type { Rule } from "eslint";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for requiring names on composite steps. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isActionMetadataFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);
                const runsMapping =
                    root === null
                        ? null
                        : getMappingValueAsMapping(root, "runs");

                if (runsMapping === null) {
                    return;
                }

                const usingRuntime = getScalarStringValue(
                    getMappingPair(runsMapping, "using")?.value
                );

                if (usingRuntime !== "composite") {
                    return;
                }

                const stepsSequence = getMappingValueAsSequence(
                    runsMapping,
                    "steps"
                );

                if (stepsSequence === null) {
                    return;
                }

                for (const [
                    index,
                    stepEntry,
                ] of stepsSequence.entries.entries()) {
                    const stepMapping = unwrapYamlValue(stepEntry);

                    if (stepMapping?.type !== "YAMLMapping") {
                        continue;
                    }

                    const nameValue = getScalarStringValue(
                        getMappingPair(stepMapping, "name")?.value
                    );

                    if (nameValue !== null && nameValue.trim().length > 0) {
                        continue;
                    }

                    context.report({
                        data: {
                            index: String(index + 1),
                        },
                        messageId: "missingCompositeStepName",
                        node: stepMapping as unknown as Rule.Node,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "require each composite action step to declare a descriptive `name`.",
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R052",
            ruleNumber: 52,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/require-composite-step-name",
        },
        messages: {
            missingCompositeStepName:
                "Composite step #{{index}} should declare a non-empty `name` for readability and debugging.",
        },
        schema: [],
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
