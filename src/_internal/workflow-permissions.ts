/**
 * @packageDocumentation
 * Helpers for reasoning about workflow and job-level GitHub token permissions.
 */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- YAML AST nodes come from parser-owned mutable types shared across helper boundaries. */
import type { AST } from "yaml-eslint-parser";

import { isDefined } from "ts-extras";

import {
    getMappingPair,
    getScalarStringValue,
    unwrapYamlValue,
    type WorkflowJobEntry,
} from "./workflow-yaml.js";

/** GitHub token permission levels used in workflow YAML. */
export type WorkflowPermissionLevel = "read" | "write";

/** YAML node shape used for workflow or job permissions values. */
type PermissionsNode = AST.YAMLContent | AST.YAMLWithMeta | null;

/** Read the permissions node for a workflow or job mapping. */
const getPermissionsNode = (mapping: AST.YAMLMapping): PermissionsNode =>
    getMappingPair(mapping, "permissions")?.value ?? null;

/** Convert a scalar permissions shorthand into an exact effective level. */
const getScalarPermissionLevel = (
    scalarValue: string
): null | WorkflowPermissionLevel => {
    const normalizedValue = scalarValue.trim().toLowerCase();

    if (normalizedValue === "read-all") {
        return "read";
    }

    if (normalizedValue === "write-all") {
        return "write";
    }

    return null;
};

/** Determine whether a permissions scalar satisfies the required access level. */
const scalarPermissionSatisfies = (
    scalarValue: string,
    requiredLevel: WorkflowPermissionLevel
): boolean => {
    const permissionLevel = getScalarPermissionLevel(scalarValue);

    if (permissionLevel === "write") {
        return true;
    }

    if (requiredLevel === "read") {
        return permissionLevel === "read";
    }

    return false;
};

/** Resolve an exact permission level from a permissions mapping. */
const getMappingPermissionLevel = (
    permissionsMapping: AST.YAMLMapping,
    permissionName: string
): null | WorkflowPermissionLevel => {
    const permissionValue = getScalarStringValue(
        getMappingPair(permissionsMapping, permissionName)?.value ?? null
    )?.trim();

    if (!isDefined(permissionValue) || permissionValue.length === 0) {
        return null;
    }

    if (permissionValue === "read") {
        return "read";
    }

    if (permissionValue === "write") {
        return "write";
    }

    return null;
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
    const permissionLevel = getMappingPermissionLevel(
        permissionsMapping,
        permissionName
    );

    if (permissionLevel === null) {
        return false;
    }

    if (requiredLevel === "read") {
        return permissionLevel === "read" || permissionLevel === "write";
    }

    return permissionLevel === "write";
};

/** Resolve the exact permission level declared by a permissions node. */
const getPermissionsNodeLevel = (
    permissionsNode: PermissionsNode,
    permissionName: string
): null | WorkflowPermissionLevel => {
    const scalarValue = getScalarStringValue(permissionsNode)?.trim();

    if (isDefined(scalarValue) && scalarValue.length > 0) {
        return getScalarPermissionLevel(scalarValue);
    }

    const unwrappedPermissionsNode = unwrapYamlValue(permissionsNode);

    if (unwrappedPermissionsNode?.type === "YAMLMapping") {
        return getMappingPermissionLevel(
            unwrappedPermissionsNode,
            permissionName
        );
    }

    return null;
};

/** Determine whether a permissions node satisfies a required permission level. */
const permissionsNodeSatisfies = (
    permissionsNode: PermissionsNode,
    permissionName: string,
    requiredLevel: WorkflowPermissionLevel
): boolean => {
    const scalarValue = getScalarStringValue(permissionsNode)?.trim();

    if (isDefined(scalarValue) && scalarValue.length > 0) {
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

/** Determine whether a workflow/job has an exact effective permission level. */
export const hasExactWorkflowPermission = (
    root: AST.YAMLMapping,
    job: WorkflowJobEntry,
    permissionName: string,
    requiredLevel: WorkflowPermissionLevel
): boolean => {
    const jobPermissionsNode = getPermissionsNode(job.mapping);

    if (jobPermissionsNode !== null) {
        return (
            getPermissionsNodeLevel(jobPermissionsNode, permissionName) ===
            requiredLevel
        );
    }

    return (
        getPermissionsNodeLevel(getPermissionsNode(root), permissionName) ===
        requiredLevel
    );
};

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable readonly-parameter checks outside parser AST helper signatures. */
