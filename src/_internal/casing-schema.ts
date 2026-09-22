/**
 * @packageDocumentation
 * Shared option properties for casing rules with literal name exceptions.
 */
import type { GithubActionsCasingKind } from "./casing.js";

/** JSON Schema property shapes used by casing object options. */
type CasingOptionProperty =
    | {
          readonly description: string;
          readonly items: { readonly type: "string" };
          readonly type: "array";
          readonly uniqueItems: true;
      }
    | { readonly description: string; readonly type: "boolean" };

/** Build style flags and literal ignores from the rule's supported conventions. */
export const createCasingOptionProperties = (
    casingKinds: readonly GithubActionsCasingKind[],
    subject: string,
    ignoresDescription: string
): Record<string, CasingOptionProperty> => {
    const properties: Record<string, CasingOptionProperty> = {
        ignores: {
            description: ignoresDescription,
            items: { type: "string" },
            type: "array",
            uniqueItems: true,
        },
    };

    for (const casingKind of casingKinds) {
        properties[casingKind] = {
            description: `Allow ${casingKind} ${subject}.`,
            type: "boolean",
        };
    }

    return properties;
};
