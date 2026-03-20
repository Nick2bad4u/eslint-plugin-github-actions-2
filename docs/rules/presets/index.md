# Presets

The plugin exports seven flat-config presets:

- `githubActions.configs.actionMetadata`
- `githubActions.configs.workflowTemplateProperties`
- `githubActions.configs.workflowTemplates`
- `githubActions.configs.recommended`
- `githubActions.configs.security`
- `githubActions.configs.strict`
- `githubActions.configs.all`

These presets cover workflow YAML, action metadata (`action.yml` / `action.yaml`),
and workflow template package files (`workflow-templates/*.yml`, `*.yaml`, and
`*.properties.json`).

## Preset docs

- [Recommended preset](./recommended.md)
- [Security preset](./security.md)
- [Strict preset](./strict.md)
- [All rules preset](./all.md)
- [Action metadata preset](./action-metadata.md)
- [Workflow templates preset](./workflow-templates.md)
- [Workflow template properties preset](./workflow-template-properties.md)

## How to choose

- Start with **recommended** for broad baseline quality and safety.
- Layer **security** for stronger supply-chain and permissions-focused checks.
- Use **strict** when you want high signal on operational consistency.
- Use **all** for complete rule coverage (best for internal policy repos).

Then review [getting started](../getting-started.md) and the full
[rule reference](../overview.md).
