/**
 * @packageDocumentation
 * Disallow INPUT_* environment variable access inside composite action runs.
 */
import type { Rule } from "eslint";

import { isDefined } from "ts-extras";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";
import { visitYamlStringScalars } from "../_internal/yaml-traversal.js";

/** Composite-action INPUT_* environment variable reference detector. */
const inputEnvironmentPattern = /\bINPUT_[\dA-Z_]+\b/g;

/** Rule implementation for composite input access style checks. */
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
                    runsMapping.pairs.find(
                        (pair) => getScalarStringValue(pair.key) === "using"
                    )?.value
                );

                if (usingRuntime !== "composite") {
                    return;
                }

                visitYamlStringScalars(runsMapping, (node, value) => {
                    const firstMatch = value.match(
                        inputEnvironmentPattern
                    )?.[0];

                    if (!isDefined(firstMatch)) {
                        return;
                    }

                    context.report({
                        data: {
                            inputEnvironmentReference: firstMatch,
                        },
                        messageId: "compositeInputEnvAccess",
                        node: node as unknown as Rule.Node,
                    });
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "disallow `INPUT_*` environment-variable access in composite actions and require `inputs.*` context references.",
            dialects: ["GitHub Action metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R049",
            ruleNumber: 49,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-composite-input-env-access",
        },
        messages: {
            compositeInputEnvAccess:
                "Composite actions should reference inputs via `inputs.*`, not environment variable '{{inputEnvironmentReference}}'.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
