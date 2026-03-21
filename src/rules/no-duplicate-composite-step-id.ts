/**
 * @packageDocumentation
 * Disallow duplicate step IDs in composite actions.
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

/** Rule implementation for duplicate composite step ID checks. */
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

                const firstSeenByStepId = new Set<string>();

                for (const stepEntry of stepsSequence.entries) {
                    const stepMapping = unwrapYamlValue(stepEntry);

                    if (stepMapping?.type !== "YAMLMapping") {
                        continue;
                    }

                    const stepIdPair = getMappingPair(stepMapping, "id");
                    const stepId = getScalarStringValue(stepIdPair?.value);

                    if (stepId === null) {
                        continue;
                    }

                    if (!firstSeenByStepId.has(stepId)) {
                        firstSeenByStepId.add(stepId);

                        continue;
                    }

                    context.report({
                        data: {
                            stepId,
                        },
                        messageId: "duplicateCompositeStepId",
                        node: (stepIdPair?.value ??
                            stepIdPair) as unknown as Rule.Node,
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
                "disallow duplicate step IDs in `runs.steps` for composite actions.",
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R051",
            ruleNumber: 51,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-duplicate-composite-step-id",
        },
        messages: {
            duplicateCompositeStepId:
                "Composite step id '{{stepId}}' is declared more than once.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
