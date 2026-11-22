import { createRuleTester, getPluginRule } from "./_internal/ruleTester.js";

const ruleTester = createRuleTester();
const workflowFilename = ".github/workflows/example.yml";
const allowPattern = String.raw`^(?:CodeQL|\.NET|C/C\+\+|MSBuild|OpenSSF|OSSAR|SLSA)(?: |$)`;

ruleTester.run("action-name-casing", getPluginRule("action-name-casing"), {
    invalid: [
        {
            code: "name: CodeQL Advanced",
            errors: [{ messageId: "nameDoesNotMatchCasing" }],
            filename: workflowFilename,
            options: [{ ignores: ["CodeQL.*"] }],
            output: "name: Code Ql Advanced",
        },
        {
            code: "name: codeQL",
            errors: [{ messageId: "nameDoesNotMatchCasing" }],
            filename: workflowFilename,
            options: [{ allowPattern }],
            output: "name: Code Ql",
        },
        {
            code: "name: release-pipeline",
            errors: [{ messageId: "nameDoesNotMatchCasing" }],
            filename: workflowFilename,
            options: [{ allowPattern }],
            output: "name: Release Pipeline",
        },
    ],
    valid: [
        ...[
            "CodeQL",
            "CodeQL Advanced",
            ".NET",
            "C/C++ CI",
            "MSBuild",
            "OpenSSF Scorecard",
            "OSSAR",
            "SLSA Go releaser",
            "Release Pipeline",
        ].map((name) => ({
            code: `name: ${name}`,
            filename: workflowFilename,
            options: [{ allowPattern }],
        })),
        {
            code: "name: Dependency review",
            filename: workflowFilename,
            options: [{ allowPattern: "^[A-Z][a-z]+(?: [a-z]+)+$" }],
        },
        {
            code: "name: legacyWorkflow",
            filename: workflowFilename,
            options: [{ allowPattern, ignores: ["legacyWorkflow"] }],
        },
    ],
});
