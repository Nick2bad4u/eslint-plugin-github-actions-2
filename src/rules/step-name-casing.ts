/**
 * @packageDocumentation
 * Enforce a consistent casing convention for workflow and composite action
 * step display names.
 */
import type { Rule } from "eslint";
import type { AST } from "yaml-eslint-parser";

import { isDefined } from "ts-extras";

import {
    createDisplayNameCasingPolicy,
    createDisplayNameCasingSchema,
    DEFAULT_DISPLAY_NAME_CASING,
    type DisplayNameCasingPolicy,
    getDisplayNameCasingViolation,
} from "../_internal/display-name-casing.js";
import {
    isActionMetadataFile,
    isWorkflowFile,
} from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
    getWorkflowRoot,
    unwrapYamlValue,
} from "../_internal/workflow-yaml.js";

/** Check every step mapping in a `steps` sequence. */
const checkSteps = (
    context: Readonly<Rule.RuleContext>,
    stepsSequence: Readonly<AST.YAMLSequence>,
    policy: Readonly<DisplayNameCasingPolicy>,
    location: string
): void => {
    for (const entry of stepsSequence.entries) {
        const stepMapping = unwrapYamlValue(entry);

        const violation =
            stepMapping?.type === "YAMLMapping"
                ? getDisplayNameCasingViolation(context, stepMapping, policy)
                : undefined;

        if (isDefined(violation)) {
            reportYamlNode(context, {
                data: { ...violation.data, location },
                fix: violation.fix,
                messageId: "stepNameDoesNotMatchCasing",
                node: violation.node,
            });
        }
    }
};

/** Resolve the steps of a composite action's `runs` mapping. */
const getCompositeActionSteps = (
    root: Readonly<AST.YAMLMapping>
): AST.YAMLSequence | null => {
    const runsMapping = getMappingValueAsMapping(root, "runs");

    if (
        runsMapping === null ||
        getScalarStringValue(getMappingPair(runsMapping, "using")?.value) !==
            "composite"
    ) {
        return null;
    }

    return getMappingValueAsSequence(runsMapping, "steps");
};

/** Rule implementation for enforcing step display-name casing. */
const rule: Rule.RuleModule = {
    create(context) {
        const policy = createDisplayNameCasingPolicy(context.options);

        return {
            Program() {
                const isWorkflow = isWorkflowFile(context.filename);

                if (!isWorkflow && !isActionMetadataFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);

                if (root === null) {
                    return;
                }

                if (!isWorkflow) {
                    const compositeSteps = getCompositeActionSteps(root);

                    if (compositeSteps !== null) {
                        checkSteps(
                            context,
                            compositeSteps,
                            policy,
                            "this composite action"
                        );
                    }

                    return;
                }

                for (const job of getWorkflowJobs(root)) {
                    const stepsSequence = getMappingValueAsSequence(
                        job.mapping,
                        "steps"
                    );

                    if (stepsSequence !== null) {
                        checkSteps(
                            context,
                            stepsSequence,
                            policy,
                            `job '${job.id}'`
                        );
                    }
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
                "enforce a consistent casing convention for workflow and composite action step `name` values.",
            dialects: ["GitHub Actions workflow", "GitHub Action metadata"],
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            ruleId: "R118",
            ruleNumber: 118,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/step-name-casing",
        },
        fixable: "code",
        messages: {
            stepNameDoesNotMatchCasing:
                "Step name '{{name}}' in {{location}} is not in the configured casing: {{caseTypes}}.",
        },
        schema: createDisplayNameCasingSchema("step names"),
        type: "suggestion",
    } as Rule.RuleMetaData,
};

export default rule;
