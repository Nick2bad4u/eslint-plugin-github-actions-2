Fix legend:
🔧 = autofixable
💡 = suggestions available
— = report only

Preset key legend:
🧩 — githubActions.configs.actionMetadata
🗂️ — githubActions.configs.workflowTemplateProperties
🧱 — githubActions.configs.workflowTemplates
🟡 — githubActions.configs.recommended
🛡️ — githubActions.configs.security
🔴 — githubActions.configs.strict
🟣 — githubActions.configs.all

| Rule | Fix | Preset key |
| --- | :-: | --- |
| <span class="sb-inline-rule-number">R009</span> `action-name-casing` | 🔧 | 🟣 🔴 |
| <span class="sb-inline-rule-number">R010</span> `job-id-casing` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R011</span> `max-jobs-per-action` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R048</span> `no-case-insensitive-input-id-collision` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R049</span> `no-composite-input-env-access` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R044</span> `no-deprecated-node-runtime` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R051</span> `no-duplicate-composite-step-id` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R060</span> `no-empty-template-file-pattern` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R012</span> `no-external-job` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R068</span> `no-hardcoded-default-branch-in-template` | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R063</span> `no-icon-file-extension-in-template-icon-name` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R026</span> `no-inherit-secrets` | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R042</span> `no-invalid-concurrency-context` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R019</span> `no-invalid-key` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R041</span> `no-invalid-reusable-workflow-job-key` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R059</span> `no-invalid-template-file-pattern-regex` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R040</span> `no-invalid-workflow-call-output-value` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R064</span> `no-path-separators-in-template-icon-name` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R046</span> `no-post-if-without-post` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R030</span> `no-pr-head-checkout-in-pull-request-target` | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R045</span> `no-pre-if-without-pre` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R047</span> `no-required-input-with-default` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R027</span> `no-secrets-in-if` | — | 🟣 🟡 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R036</span> `no-self-hosted-runner-on-fork-pr-events` | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R062</span> `no-subdirectory-template-file-pattern` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R069</span> `no-template-placeholder-in-non-template-workflow` | — | 🟡 🔴 🟣 |
| <span class="sb-inline-rule-number">R013</span> `no-top-level-env` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R014</span> `no-top-level-permissions` | — | 🟣 |
| <span class="sb-inline-rule-number">R061</span> `no-universal-template-file-pattern` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R050</span> `no-unknown-input-reference-in-composite` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R037</span> `no-unknown-job-output-reference` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R038</span> `no-unknown-step-reference` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R029</span> `no-untrusted-input-in-run` | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R053</span> `no-unused-input-in-composite` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R023</span> `no-write-all-permissions` | — | 🟣 🟡 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R003</span> `pin-action-shas` | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R043</span> `prefer-action-yml` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R015</span> `prefer-fail-fast` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R020</span> `prefer-file-extension` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R033</span> `prefer-inputs-context` | 🔧 | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R016</span> `prefer-step-uses-style` | — | 🟣 |
| <span class="sb-inline-rule-number">R066</span> `prefer-template-yml-extension` | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R005</span> `require-action-name` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R006</span> `require-action-run-name` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R025</span> `require-checkout-before-local-action` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R052</span> `require-composite-step-name` | — | 🧩 🟣 |
| <span class="sb-inline-rule-number">R007</span> `require-job-name` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R008</span> `require-job-step-name` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R002</span> `require-job-timeout-minutes` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R035</span> `require-merge-group-trigger` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R032</span> `require-pull-request-target-branches` | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R021</span> `require-run-step-shell` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R057</span> `require-template-categories` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R058</span> `require-template-file-patterns` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R065</span> `require-template-icon-file-exists` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R056</span> `require-template-icon-name` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R067</span> `require-template-workflow-name` | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R031</span> `require-trigger-types` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R034</span> `require-workflow-call-input-type` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R039</span> `require-workflow-call-output-value` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R004</span> `require-workflow-concurrency` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R022</span> `require-workflow-dispatch-input-type` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R024</span> `require-workflow-interface-description` | — | 🟣 🔴 |
| <span class="sb-inline-rule-number">R001</span> `require-workflow-permissions` | — | 🟣 🟡 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R028</span> `require-workflow-run-branches` | — | 🟣 🛡️ 🔴 |
| <span class="sb-inline-rule-number">R054</span> `require-workflow-template-pair` | — | 🧱 🟣 |
| <span class="sb-inline-rule-number">R055</span> `require-workflow-template-properties-pair` | — | 🗂️ 🧱 🟣 |
| <span class="sb-inline-rule-number">R017</span> `valid-timeout-minutes` | — | 🟣 🟡 🔴 |
| <span class="sb-inline-rule-number">R018</span> `valid-trigger-events` | — | 🟣 🟡 🔴 |
