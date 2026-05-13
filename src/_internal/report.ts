/**
 * @packageDocumentation
 * Shared helpers for reporting YAML-derived nodes through ESLint RuleContext.
 */
import type { Rule } from "eslint";
import type { UnknownRecord } from "type-fest";

import { isPresent, keyIn } from "ts-extras";

type ReportData = Record<
    string,
    bigint | boolean | null | number | string | undefined
>;

type YamlReportDescriptor = Readonly<{
    readonly data?: ReportData;
    readonly fix?: null | Rule.ReportFixer | undefined;
    readonly message?: string;
    readonly messageId?: string;
    readonly node: unknown;
    readonly suggest?: null | Rule.SuggestionReportDescriptor[] | undefined;
}>;

/** Determine whether an unknown value is a non-null object record. */
const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

/** Determine whether an unknown value satisfies ESLint's `Rule.Node` shape. */
const isRuleNode = (value: unknown): value is Rule.Node =>
    isUnknownRecord(value) &&
    keyIn(value, "type") &&
    typeof Reflect.get(value, "type") === "string";

/** Report a lint problem while safely adapting parser-specific node shapes. */
export const reportYamlNode = (
    context: Readonly<Rule.RuleContext>,
    descriptor: Readonly<YamlReportDescriptor>
): void => {
    if (!isRuleNode(descriptor.node)) {
        return;
    }

    if (isPresent(descriptor.messageId)) {
        context.report({
            data: descriptor.data,
            fix: descriptor.fix,
            messageId: descriptor.messageId,
            node: descriptor.node,
            suggest: descriptor.suggest,
        });
        return;
    }

    if (isPresent(descriptor.message)) {
        context.report({
            data: descriptor.data,
            fix: descriptor.fix,
            message: descriptor.message,
            node: descriptor.node,
            suggest: descriptor.suggest,
        });
    }
};
