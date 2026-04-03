/**
 * @packageDocumentation
 * Helpers for reasoning about workflow and job-level GitHub token permissions.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { AST } from "yaml-eslint-parser";

import {
    getMappingPair,
    getScalarStringValue,
    unwrapYamlValue,
    type WorkflowJobEntry,
} from "./workflow-yaml.js";

/** GitHub token permission levels used in workflow YAML. */
export type WorkflowPermissionLevel = "read" | "write";

/** Read the permissions node for a workflow or job mapping. */
const getPermissionsNode = (
    mapping: AST.YAMLMapping
): AST.YAMLContent | AST.YAMLWithMeta | null =>
    getMappingPair(mapping, "permissions")?.value ?? null;

/** Determine whether a permissions scalar satisfies the required access level. */
const scalarPermissionSatisfies = (
    scalarValue: string,
    requiredLevel: WorkflowPermissionLevel
): boolean => {
    const normalizedValue = scalarValue.trim().toLowerCase();

    if (normalizedValue === "write-all") {
        return true;
    }

    if (requiredLevel === "read") {
        return normalizedValue === "read-all";
    }

    return false;
};

/**
 * Determine whether a permissions mapping satisfies a required permission
 * level.
 */
const mappingPermissionSatisfies = (
    permissionsMapping: AST.YAMLMapping,
    permissionName: string,
    requiredLevel: WorkflowPermissionLevel
): boolean => {
    const permissionValue = getScalarStringValue(
        getMappingPair(permissionsMapping, permissionName)?.value ?? null
    )?.trim();

    if (permissionValue === undefined || permissionValue.length === 0) {
        return false;
    }

    if (requiredLevel === "read") {
        return permissionValue === "read" || permissionValue === "write";
    }

    return permissionValue === "write";
};

/** Determine whether a permissions node satisfies a required permission level. */
const permissionsNodeSatisfies = (
    permissionsNode: AST.YAMLContent | AST.YAMLWithMeta | null,
    permissionName: string,
    requiredLevel: WorkflowPermissionLevel
): boolean => {
    const scalarValue = getScalarStringValue(permissionsNode)?.trim();

    if (scalarValue !== undefined && scalarValue.length > 0) {
        return scalarPermissionSatisfies(scalarValue, requiredLevel);
    }

    const unwrappedPermissionsNode = unwrapYamlValue(permissionsNode);

    if (unwrappedPermissionsNode?.type === "YAMLMapping") {
        return mappingPermissionSatisfies(
            unwrappedPermissionsNode,
            permissionName,
            requiredLevel
        );
    }

    return false;
};

/** Determine whether a workflow/job has the required effective permission level. */
export const hasRequiredWorkflowPermission = (
    root: AST.YAMLMapping,
    job: WorkflowJobEntry,
    permissionName: string,
    requiredLevel: WorkflowPermissionLevel
): boolean => {
    const jobPermissionsNode = getPermissionsNode(job.mapping);

    if (jobPermissionsNode !== null) {
        return permissionsNodeSatisfies(
            jobPermissionsNode,
            permissionName,
            requiredLevel
        );
    }

    return permissionsNodeSatisfies(
        getPermissionsNode(root),
        permissionName,
        requiredLevel
    );
};

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
