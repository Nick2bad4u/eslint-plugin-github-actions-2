/**
 * @packageDocumentation
 * Disallow deprecated Node.js action runtimes.
 */
import type { Rule } from "eslint";

import { setHas } from "ts-extras";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Deprecated Node runtime values for `runs.using`. */
const deprecatedNodeRuntimes = new Set(["node12", "node16"]);

/** Rule implementation for deprecated Node runtime checks in action metadata. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
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

                const usingPair = runsMapping.pairs.find(
                    (pair) => getScalarStringValue(pair.key) === "using"
                );
                const usingRuntime = getScalarStringValue(usingPair?.value);

                if (
                    usingRuntime === null ||
                    !setHas(deprecatedNodeRuntimes, usingRuntime)
                ) {
                    return;
                }

                context.report({
                    data: {
                        runtime: usingRuntime,
                    },
                    messageId: "deprecatedNodeRuntime",
                    node: (usingPair?.value ??
                        usingPair) as unknown as Rule.Node,
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
                "disallow deprecated Node.js runtimes in action metadata `runs.using`.",
            dialects: ["GitHub Action metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R044",
            ruleNumber: 44,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-deprecated-node-runtime",
        },
        messages: {
            deprecatedNodeRuntime:
                "Action metadata uses deprecated runtime `{{runtime}}` for `runs.using`.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
