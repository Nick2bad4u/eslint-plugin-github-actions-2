/**
 * @packageDocumentation
 * Disallow case-insensitive collisions between action input ids.
 */
import type { Rule } from "eslint";

import { isDefined } from "ts-extras";

import { isActionMetadataFile } from "../_internal/lint-targets.js";
import {
    getMappingValueAsMapping,
    getScalarStringValue,
    getWorkflowRoot,
} from "../_internal/workflow-yaml.js";

/** Rule implementation for case-insensitive input id collision detection. */
const rule: Rule.RuleModule = {
    create(context) {
        return {
            Program() {
                if (!isActionMetadataFile(context.filename)) {
                    return;
                }

                const root = getWorkflowRoot(context);
                const inputsMapping =
                    root === null
                        ? null
                        : getMappingValueAsMapping(root, "inputs");

                if (inputsMapping === null) {
                    return;
                }

                const inputByCanonicalId = new Map<string, string>();

                for (const pair of inputsMapping.pairs) {
                    const inputId = getScalarStringValue(pair.key);

                    if (inputId === null) {
                        continue;
                    }

                    const canonicalId = inputId.toLowerCase();
                    const firstSeenInputId =
                        inputByCanonicalId.get(canonicalId);

                    if (!isDefined(firstSeenInputId)) {
                        inputByCanonicalId.set(canonicalId, inputId);

                        continue;
                    }

                    if (firstSeenInputId === inputId) {
                        continue;
                    }

                    context.report({
                        data: {
                            firstInputId: firstSeenInputId,
                            inputId,
                        },
                        messageId: "collidingInputId",
                        node: pair.key as unknown as Rule.Node,
                    });
                }
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
                "disallow case-insensitive collisions between action input ids.",
            dialects: ["GitHub Action metadata"],
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            ruleId: "R048",
            ruleNumber: 48,
            url: "https://nick2bad4u.github.io/eslint-plugin-github-actions-2/docs/rules/no-case-insensitive-input-id-collision",
        },
        messages: {
            collidingInputId:
                "Input '{{inputId}}' collides with '{{firstInputId}}' when normalized case-insensitively.",
        },
        schema: [],
        type: "problem",
    } as Rule.RuleMetaData,
};

export default rule;
