/**
 * @packageDocumentation
 * Locate step sequences in workflows and composite action metadata.
 */
import type { AST } from "yaml-eslint-parser";

import { isActionMetadataFile, isWorkflowFile } from "./lint-targets.js";
import {
    getMappingPair,
    getMappingValueAsMapping,
    getMappingValueAsSequence,
    getScalarStringValue,
    getWorkflowJobs,
} from "./workflow-yaml.js";

/** Collect only the step sequences supported by the current file's dialect. */
export const getActionStepSequences = (
    root: Readonly<AST.YAMLMapping>,
    filename: string
): readonly AST.YAMLSequence[] => {
    if (isWorkflowFile(filename)) {
        return getWorkflowJobs(root).flatMap((job) => {
            const steps = getMappingValueAsSequence(job.mapping, "steps");

            return steps === null ? [] : [steps];
        });
    }

    if (!isActionMetadataFile(filename)) {
        return [];
    }

    const runs = getMappingValueAsMapping(root, "runs");

    if (
        runs === null ||
        getScalarStringValue(getMappingPair(runs, "using")?.value) !==
            "composite"
    ) {
        return [];
    }

    const steps = getMappingValueAsSequence(runs, "steps");

    return steps === null ? [] : [steps];
};
