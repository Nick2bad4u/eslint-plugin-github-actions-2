/**
 * @packageDocumentation
 * Disallow references to undeclared inputs in composite action metadata.
 */
import type { Rule } from "eslint";

import { isDefined, setHas } from "ts-extras";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import { reportYamlNode } from "../_internal/report.js";
import {
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";
import { visitYamlStringScalars } from "../_internal/yaml-traversal.js";

/**
 * Pattern for extracting `inputs.<input_id>` references from expression-like
 * strings.
 */
const inputReferencePattern = /inputs\.(?<inputId>(?:\w|-)+)/gv;

/** Rule implementation for unknown composite input references. */
const rule: Rule.RuleModule = {
    create: (context) => ({
        Program() {
            if (!isActionMetadataFile(context.filename)) {
                return;
            }

            const root = getWorkflowRoot(context);

            if (root === null) {
                return;
            }

            const runsMapping = getMappingValueAsMapping(root, "runs");

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

            const inputsMapping = getMappingValueAsMapping(root, "inputs");
            const declaredInputIds = new Set<string>();

            if (inputsMapping !== null) {
                for (const pair of inputsMapping.pairs) {
                    const inputId = getScalarStringValue(pair.key);

                    if (inputId !== null) {
                        declaredInputIds.add(inputId);
                    }
                }
            }

            visitYamlStringScalars(runsMapping, (node, value) => {
                for (const match of value.matchAll(inputReferencePattern)) {
                    const inputId = match.groups?.["inputId"];

                    if (
                        !isDefined(inputId) ||
                        setHas(declaredInputIds, inputId)
                    ) {
                        continue;
                    }

                    reportYamlNode(context, {
                        data: {
                            inputId,
                        },
                        messageId: "unknownInputReference",
                        node: node,
                    });
                }
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            configs: [
                "github-actions.configs.actionMetadata",
                "github-actions.configs.all",
            ],
            description:
                "disallow `inputs.<id>` references in composite action metadata when the input id is not declared.",
            dialects: ["GitHub Action metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R050",
            ruleNumber: 50,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-unknown-input-reference-in-composite",
        },
        messages: {
            unknownInputReference:
                "Composite action references `inputs.{{inputId}}`, but that input is not declared in `inputs`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
