/* GENERATED FILE — do not edit by hand.
 * Source: external/ai-contributor-spec/AI-CONTRIBUTOR-RULE-CATALOG.json (spec v0.1.2)
 * Intents: src/data/spec-intents.json
 * Run: pnpm prepare:spec
 */
export const SPEC = {
  "version": "v0.1.2",
  "specVersion": "0.1.2",
  "schemaVersion": "0.1",
  "pillars": [
    {
      "id": "engineering",
      "num": "I",
      "icon": "🏗️",
      "name": "Engineering Foundation",
      "description": "The reproducible environment, static correctness, architecture boundaries, and pre-commit / CI gates that make any change reviewable.",
      "range": "§1–4",
      "accent": "#0a0a0a"
    },
    {
      "id": "security",
      "num": "II",
      "icon": "🛡️",
      "name": "Security",
      "description": "Secrets handling, dependency and CI/CD security, authorization boundaries, and threat modeling.",
      "range": "§5–9",
      "accent": "#0a0a0a"
    },
    {
      "id": "quality",
      "num": "III",
      "icon": "🎯",
      "name": "Quality & Reliability",
      "description": "Runtime validation, testing strategy, accessibility, failure handling and observability, and performance and reliability.",
      "range": "§10–14",
      "accent": "#0a0a0a"
    },
    {
      "id": "release",
      "num": "IV",
      "icon": "🚀",
      "name": "Release",
      "description": "Supply-chain transparency, branch protection, and release governance.",
      "range": "§15–16",
      "accent": "#0a0a0a"
    },
    {
      "id": "agents",
      "num": "V",
      "icon": "🤖",
      "name": "AI Agents",
      "description": "How AI agents, shared skills, MCP servers, and delegated agents are governed in the repository.",
      "range": "§17–20",
      "accent": "#0a0a0a"
    },
    {
      "id": "risk",
      "num": "VI",
      "icon": "⚠️",
      "name": "AI Risk",
      "description": "AI-specific risks (prompt injection, untrusted input, capability scoping, allowlists, cost ceilings) and data protection for AI workflows.",
      "range": "§21–22",
      "accent": "#0a0a0a"
    },
    {
      "id": "oversight",
      "num": "VII",
      "icon": "🧭",
      "name": "Oversight",
      "description": "Human approval, guardrail evidence, policy ownership, AI licensing and attribution, AI credential lifecycle, model/provider changes, and AI incident response.",
      "range": "§23–29",
      "accent": "#0a0a0a"
    }
  ],
  "levels": [
    {
      "id": "L0",
      "order": 0,
      "label": "Baseline Hygiene",
      "description": "The repository satisfies the baseline requirements in §1, §2, and §5: no secrets in version control, placeholder-only env examples when contributor-supplied or runtime environment variables exist, documented credential handling, a clean setup path, committed lockfile, pinned runtime, pinned package manager, and automated formatting. AI is not yet part of the contribution workflow. A repository at Level 0 publishes `conformance_level: 0`.",
      "workflowSummary": "AI is not part of the contribution workflow yet. People may still use AI for personal help, but no AI tool reads the repository as workspace context, creates commits, or opens pull requests."
    },
    {
      "id": "L1",
      "order": 1,
      "label": "Hardened",
      "description": "Level 0, plus the remaining unconditional `MUST` rows in Pillars 1–4 and the oversight MUSTs in §23, §24, and §25. A Level 1 repository is strong enough for AI tooling to read repository content. AI-specific MUSTs in Pillars 5–6 are not yet evaluated.",
      "workflowSummary": "AI tools may read repository context, explain code, suggest commands, or help with review, but do not produce shippable changes"
    },
    {
      "id": "L2",
      "order": 2,
      "label": "AI Assisted",
      "description": "Level 1, plus AI instructions, AI data classification, AI-surface redaction, AI-generated-content licensing, and authorship tracking. Any triggered §18–§22 or §26 rows must also be satisfied. AI may assist humans, but every change passes through human acceptance.",
      "workflowSummary": "AI may produce code, docs, tests, configuration, or migrations that a human actively accepts. Extra risks such as tool use, external GitHub content, fetched URLs, retained context, provider routing, and dependency suggestions must be controlled."
    },
    {
      "id": "L3",
      "order": 3,
      "label": "AI Authored",
      "description": "Level 2, plus the rows triggered by AI-authored work, shared skills, MCP servers, delegated agents, or other AI tooling that materially authors code. `AIC-prompt-audit-trail` always applies because Level 3 means AI materially authors code that ships. Humans still review before merge.",
      "workflowSummary": "AI may complete delegated implementation tasks, open pull requests, or make material repository changes for human review"
    },
    {
      "id": "L4",
      "order": 4,
      "label": "AI Autonomous",
      "description": "Level 3, plus any autonomous-runner rows and every applicable `SHOULD`. Each `SHOULD` row must be `Fulfilled` or `Not relevant` with a documented reason. `⚠️ Warning` is not passing for Level 4. This level is for repositories where AI ships changes without human review for each change.",
      "workflowSummary": "AI may merge, release, deploy, schedule recurring changes, approve workflows, rotate settings, or otherwise act without per-change human approval"
    }
  ],
  "clauses": [
    {
      "num": 1,
      "pillar": "engineering",
      "title": "Reproducible environment",
      "anchor": "p01-c1-reproducible-environment",
      "lvl": "L0",
      "intent": "Anyone — human or agent — can stand up the project from a clean machine and arrive at a working state without tribal knowledge.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-clean-clone-bootstrap",
          "t": "A clean clone `MUST` reach a working development state using documented steps.",
          "level": "L0"
        },
        {
          "w": "MUST",
          "id": "AIC-lockfile-committed",
          "t": "The dependency lockfile `MUST` be committed to version control.",
          "level": "L0"
        },
        {
          "w": "MUST",
          "id": "AIC-package-manager-pinned",
          "t": "The package manager version `MUST` be pinned when the ecosystem allows it.",
          "level": "L0"
        },
        {
          "w": "MUST",
          "id": "AIC-runtime-version-pinned",
          "t": "The runtime version `MUST` be pinned.",
          "level": "L0"
        },
        {
          "w": "MUST",
          "id": "AIC-deterministic-build-order",
          "t": "Multi-package repositories `MUST` have a deterministic build order.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-lockfile-enforced-in-ci",
          "t": "CI `MUST` reject changes that would invalidate the committed lockfile (for example via `--frozen-lockfile`, `npm ci`, `pip --require-hashes`, or equivalent).",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-lockfile-integrity-hashes",
          "t": "Dependency lockfiles `MUST` include integrity hashes where the ecosystem supports them, and CI `MUST` fail when integrity verification fails.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-heavy-build-prerequisites",
          "t": "Heavy builds `SHOULD` document memory, CPU, or platform prerequisites.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-platform-targets-explicit",
          "t": "Browser, runtime, and platform targets `SHOULD` be explicit.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-containerized-dev-env",
          "t": "The repository `MAY` provide containerized or sandboxed development environments for stronger consistency.",
          "level": "—"
        }
      ]
    },
    {
      "num": 2,
      "pillar": "engineering",
      "title": "Static correctness",
      "anchor": "p01-c2-static-correctness",
      "lvl": "L0",
      "intent": "Mistakes are caught before they reach review. Static analysis runs locally and in CI on identical configuration.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-formatting-automated",
          "t": "Formatting `MUST` be automated and enforced.",
          "level": "L0"
        },
        {
          "w": "MUST",
          "id": "AIC-dead-code-and-cycles-surfaced",
          "t": "Unused variables, dead code, import cycles, and unsafe dependency patterns `MUST` be surfaced automatically.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-lint-correctness-rules",
          "t": "Linting `MUST` include correctness rules, not only style rules.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-strict-typing-enabled",
          "t": "Strict typing or equivalent compile-time checks `MUST` be enabled.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-ban-unsafe-escape-hatches",
          "t": "The repository `SHOULD` ban unsafe escape hatches such as untyped `any` unless explicitly justified.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-debug-statement-lint",
          "t": "Ad-hoc debug statements (for example `console.log`, `print`, `dump`, language-equivalent debug emitters) `SHOULD` be flagged or blocked by lint, leaving structured logging from §13 as the only sanctioned output path. Agents and humans alike scatter debug emitters during exploration and forget to remove them; without a lint-time backstop, the residue ships.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-naming-export-conventions",
          "t": "It `SHOULD` enforce naming and export conventions where consistency materially improves maintenance.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-domain-lint-rules",
          "t": "The repository `MAY` add repository-specific lint rules for domain conventions.",
          "level": "—"
        }
      ]
    },
    {
      "num": 3,
      "pillar": "engineering",
      "title": "Architecture boundaries",
      "anchor": "p01-c3-architecture-boundaries",
      "lvl": "L1",
      "intent": "The shape of the codebase is legible. Modules have stated responsibilities and known import boundaries — both humans and agents can reason about scope.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-architecture-rules-automated",
          "t": "Architectural rules that can be machine-enforced `MUST` be automated.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-dependency-directions-explicit",
          "t": "Allowed dependency directions `MUST` be explicit.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-layer-responsibilities-defined",
          "t": "The repository `MUST` define module, package, or layer responsibilities.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-shared-layer-import-protection",
          "t": "Sensitive or shared layers `MUST` be protected from importing implementation-specific or infrastructure-specific code when architectural separation depends on that boundary.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-boundary-tests",
          "t": "The repository `SHOULD` use boundary tests or scans in addition to linter rules.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-coupling-review-checklist",
          "t": "It `SHOULD` include a review checklist for coupling risks that tooling cannot catch.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-architecture-analysis-tools",
          "t": "The repository `MAY` model architecture constraints in dedicated analysis tools if the codebase is large enough to justify it.",
          "level": "—"
        }
      ]
    },
    {
      "num": 4,
      "pillar": "engineering",
      "title": "Pre-commit and CI gates",
      "anchor": "p01-c4-pre-commit-and-ci-gates",
      "lvl": "L1",
      "intent": "Verification cannot be skipped. The same checks run locally before commit and on every push.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-ci-guardrail-suite",
          "t": "CI `MUST` run the authoritative guardrail suite for protected branches.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-ci-pinned-toolchain",
          "t": "CI `MUST` use the pinned toolchain and locked dependency state.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-protected-branch-status-checks",
          "t": "Protected branches `MUST` require passing status checks before merge.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-precommit-meaningful-checks",
          "t": "Pre-commit hooks `MUST` run meaningful local checks.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-expensive-jobs-explicit",
          "t": "Expensive jobs `SHOULD` be separated intentionally rather than omitted silently.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-fast-iteration-path",
          "t": "The repository `SHOULD` expose a fast-iteration command path — for example scoped tests, changed-file lint, or per-package verify scripts — so intermediate work can be validated cheaply without running the full guardrail suite on every iteration. The full suite remains the authoritative gate; the fast path is for the iteration loop.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-local-ci-aligned",
          "t": "The local and CI quality bars `SHOULD` stay closely aligned.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-adaptive-staged-ci",
          "t": "The repository `MAY` use adaptive or staged CI when the distinction between fast and slow checks is explicit and documented.",
          "level": "—"
        }
      ]
    },
    {
      "num": 5,
      "pillar": "security",
      "title": "Secrets and credentials",
      "anchor": "p02-c1-secrets-and-credentials",
      "lvl": "L0",
      "intent": "Secrets never live in the repository, in chat with an agent, or in build artifacts.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-credential-handling-documented",
          "t": "Credential handling `MUST` be documented for contributors and automation.",
          "level": "L0"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-env-example-placeholders",
          "t": "When the repository requires contributor-supplied or runtime environment variables, example environment files `MUST` contain placeholders only.",
          "level": "L0"
        },
        {
          "w": "MUST",
          "id": "AIC-secret-vcs-exclude",
          "t": "Secret-bearing files `MUST` be excluded from version control.",
          "level": "L0"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-push-protection-enabled",
          "t": "Push protection `MUST` be enabled when supported and feasible for the repository's hosting platform.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-secret-scanning-enabled",
          "t": "Automated secret scanning `MUST` be enabled.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-credential-rotation-documented",
          "t": "The repository `SHOULD` document how contributors and automation obtain development credentials, how those credentials are rotated, and what triggers a rotation (suspected leak, contributor offboarding, scheduled cadence). This is particularly important for AI agents, which cannot complete interactive credential-issuance flows and otherwise accumulate static, long-lived tokens.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-custom-secret-patterns",
          "t": "The repository `SHOULD` define custom detection patterns for organization-specific secret formats.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-mock-mode-fallback",
          "t": "It `SHOULD` provide a safe mock mode or local fallback path that avoids requiring live secrets for common development flows.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-secret-rotation-automation",
          "t": "The repository `MAY` integrate secret rotation or secret lease validation into operational workflows.",
          "level": "—"
        }
      ]
    },
    {
      "num": 6,
      "pillar": "security",
      "title": "Security scanning and dependency security",
      "anchor": "p02-c2-security-scanning-and-dependency-security",
      "lvl": "L1",
      "intent": "Third-party code is treated as untrusted input. Known vulnerabilities are surfaced and acted on.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-dependency-review-visibility",
          "t": "Dependency changes in pull requests `MUST` be visible to reviewers through automation or policy.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-dependency-vuln-detection",
          "t": "Dependency vulnerability detection `MUST` be enabled.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-sast-in-ci",
          "t": "Security-focused static analysis `MUST` run in CI for supported languages and platforms.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-automated-dep-updates",
          "t": "The repository `SHOULD` automate safe dependency update PRs.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-license-review-automation",
          "t": "It `SHOULD` automate license review if distribution or compliance requirements apply.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-vuln-alert-ownership",
          "t": "It `SHOULD` track and assign ownership for unresolved vulnerability alerts.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-dast-internet-facing",
          "t": "Internet-facing applications `MAY` run dynamic application security testing (DAST) against a deployed environment to surface vulnerabilities that static analysis misses.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-penetration-testing-periodic",
          "t": "High-risk systems `MAY` undergo periodic penetration testing by an independent reviewer.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-strict-new-dep-policy",
          "t": "The repository `MAY` apply stricter policies to new dependencies than to existing ones.",
          "level": "—"
        }
      ]
    },
    {
      "num": 7,
      "pillar": "security",
      "title": "Authorization and trusted boundaries",
      "anchor": "p02-c3-authorization-and-trusted-boundaries",
      "lvl": "L1",
      "intent": "The build pipeline itself is a privileged surface. It runs untrusted code only with intent.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-credential-leakage-checks",
          "t": "Repositories `MUST` have checks or tests that detect dangerous credential or role leakage into the wrong layers.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-data-integrity-constraints",
          "t": "Data integrity constraints `MUST` exist where the persistence layer supports them.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-authz-trusted-layer",
          "t": "Authorization `MUST` be enforced in a trusted layer such as the backend, API, or data layer.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-no-privileged-creds-in-client",
          "t": "Privileged credentials `MUST NOT` be present in untrusted client code.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-sensitive-write-paths-owned",
          "t": "Security-sensitive write paths `SHOULD` have explicit ownership, auditability, and narrow interfaces.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-defense-in-depth-client",
          "t": "The repository `MAY` add defense-in-depth client-side controls for UX, as long as they are not misrepresented as authoritative controls.",
          "level": "—"
        }
      ]
    },
    {
      "num": 8,
      "pillar": "security",
      "title": "CI/CD workflow hardening",
      "anchor": "p02-c4-ci-cd-workflow-hardening",
      "lvl": "L1",
      "intent": "Privileged operations are gated by explicit authorization checks at the boundary, not at the call site.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-prod-deploy-protected",
          "t": "Production deployment paths `MUST` be protected from arbitrary execution and unauthorized triggering.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-short-lived-deploy-creds",
          "t": "Deployment credentials `MUST` be short-lived where the platform supports it.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-workflow-token-least-privilege",
          "t": "Workflow tokens `MUST` use least privilege.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-action-version-pinned",
          "t": "Third-party GitHub Actions `SHOULD` be referenced by a tagged version or release ref (for example `pnpm/action-setup@v6`) rather than a floating branch ref like `@main` or `@master`. A floating ref ships whatever is on that branch into CI on the next run; pinning to a release tag bounds what can change between deliberate bumps. Stronger SHA pinning is the `MAY` below, justified by threat model.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-deploy-env-approvals",
          "t": "It `SHOULD` protect deployment environments with approval rules or environment policies.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-oidc-federation",
          "t": "The repository `SHOULD` use OIDC or equivalent identity federation instead of long-lived cloud secrets.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-workflow-change-review",
          "t": "It `SHOULD` review workflow file changes with extra scrutiny.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-reusable-workflows",
          "t": "The repository `MAY` use reusable workflows or central workflow templates to reduce drift.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-third-party-action-pinning",
          "t": "Repositories `MAY` SHA-pin third-party GitHub Actions when the threat model justifies it — production-deploy workflows, high-stakes tokens, or compliance regimes that require bit-exact reproducibility — paired with an automated bumper such as Renovate or Dependabot that keeps the pins current. Tag-pinning with an active bumper is the readable default; SHA-pinning without a bumper is worse than tag-pinning because pins go stale and stop receiving security patches.",
          "level": "—"
        }
      ]
    },
    {
      "num": 9,
      "pillar": "security",
      "title": "Threat modeling and security design review",
      "anchor": "p02-c5-threat-modeling-and-security-design-review",
      "lvl": "L1",
      "intent": "Security is reasoned about explicitly, not inferred. Trust boundaries are written down.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-threat-model-artifact",
          "t": "Threat modeling `MUST` produce a durable artifact identifying assets, trust boundaries, entry points, and likely attacker paths. A verbal agreement does not satisfy this requirement.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-threat-model-required",
          "t": "Internet-facing, multi-tenant, regulated, or high-impact systems `MUST` undergo threat modeling or security design review.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-threat-model-review-date",
          "t": "Repositories subject to this requirement `MUST` record when the threat model was last reviewed.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-threat-model-revisit",
          "t": "Threat models `SHOULD` be revisited when authentication, deployment, storage, or trust boundaries change.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-threat-model-lightweight",
          "t": "Lower-risk repositories `MAY` satisfy this requirement with lightweight design review rather than heavyweight formal exercises.",
          "level": "—"
        }
      ]
    },
    {
      "num": 10,
      "pillar": "quality",
      "title": "Runtime validation and invariants",
      "anchor": "p03-c1-runtime-validation-and-invariants",
      "lvl": "L1",
      "intent": "Inputs at process boundaries are validated. Bad data is rejected loudly, not propagated.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-invariants-documented",
          "t": "Critical invariants `MUST` be documented in one authoritative place.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-invariants-executable",
          "t": "Critical invariants `MUST` be executable through tests, assertions, or validators wherever practical.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-input-validation",
          "t": "External inputs, configuration, and machine-readable product metadata `MUST` be validated before use.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-fail-fast-diagnostics",
          "t": "The repository `SHOULD` fail fast on invalid inputs and emit actionable diagnostics.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-structural-vs-semantic-validation",
          "t": "Validation layers `SHOULD` separate structural validity from semantic validity.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-non-fatal-warning-downgrade",
          "t": "The repository `MAY` downgrade suspicious but non-fatal states to warnings if the product can continue safely.",
          "level": "—"
        }
      ]
    },
    {
      "num": 11,
      "pillar": "quality",
      "title": "Testing strategy",
      "anchor": "p03-c2-testing-strategy",
      "lvl": "L1",
      "intent": "There is a stated testing strategy, and CI runs the tests it implies. Tests are fast enough to be run on every change.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-coverage-as-minimum",
          "t": "Coverage thresholds `MUST` exist if the team uses coverage as a guardrail, and those thresholds `MUST` be treated as a minimum rather than a target.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-critical-behavior-tested",
          "t": "Critical business behavior `MUST` be covered by automated tests.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-multiple-test-layers",
          "t": "The repository `MUST` use multiple test layers rather than relying on a single style of testing.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-excluded-suites-documented",
          "t": "Environment-specific or excluded test suites `SHOULD` be explicitly documented.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-e2e-built-artifact",
          "t": "End-to-end and acceptance tests `SHOULD` execute against the same artifact the repository ships (for example the production build output, a built container image, or the published package), not the development server alone. Bundling, tree-shaking, asset rewriting, and environment-variable inlining produce divergence between dev and prod that only appears when the built artifact is exercised.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-test-strength-independent",
          "t": "Where coverage is used as a gate, the repository `SHOULD` assess test-suite strength through an independent mechanism such as mutation testing, property-based tests, or independent review. Coverage alone does not distinguish effective assertions from ones that pass trivially.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-test-network-isolation",
          "t": "Test environments `SHOULD` be deterministic where possible. Tests at the integration and end-to-end layers `SHOULD NOT` reach live external networks or shared production-like services by default; they `SHOULD` run against in-process mocks, recorded fixtures, or sandboxed substitutes, with any deviation explicitly opted in. Network nondeterminism amplifies AI-generated flakiness and erodes the signal of every gate that depends on the suite.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-tests-colocated",
          "t": "Tests `SHOULD` be located close to the code they protect.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-fuzzing-parsers",
          "t": "Parser-heavy or security-sensitive components `MAY` use fuzzing to surface input-domain failures that example-based tests routinely miss.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-risk-based-test-selection",
          "t": "The repository `MAY` use differential or risk-based test selection in CI if the full quality bar remains intact before release.",
          "level": "—"
        }
      ]
    },
    {
      "num": 12,
      "pillar": "quality",
      "title": "Accessibility",
      "anchor": "p03-c3-accessibility",
      "lvl": "L1",
      "intent": "User-facing surfaces are usable by people with disabilities. Accessibility is part of verification, not a follow-up.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-a11y-component-checks",
          "t": "Shared UI components `MUST` be checked for serious accessibility failures.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-a11y-review-testing",
          "t": "Accessibility expectations for semantics, focus, and labeling `MUST` be part of normal review and testing.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-a11y-helpers",
          "t": "The repository `SHOULD` provide shared accessibility test helpers.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-a11y-keyboard-focus",
          "t": "Keyboard behavior and focus management `SHOULD` be covered where interaction complexity warrants it.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-a11y-extra-gates",
          "t": "The repository `MAY` enforce additional accessibility gates such as motion, contrast, or localization-specific checks.",
          "level": "—"
        }
      ]
    },
    {
      "num": 13,
      "pillar": "quality",
      "title": "Failure handling and observability",
      "anchor": "p03-c4-failure-handling-and-observability",
      "lvl": "L1",
      "intent": "When things break, the system says so. Logs, metrics, and traces are deliberate, not accidental.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-failure-handling-explicit",
          "t": "Production code `MUST` handle failure explicitly, not only through happy-path logic.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-retries-backoff-deliberate",
          "t": "Retries, backoff, and fallback behavior `MUST` be deliberate where transient failure is expected.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-observability-redaction",
          "t": "When the repository operates a service, app, worker, proxy, or production runtime that emits logs, telemetry, traces, or error reports, observability outputs `MUST` redact secrets, credentials, and personally identifiable information, and `MUST` avoid leaking unnecessary personal data. §22 extends this requirement to AI-specific surfaces such as prompts, agent transcripts, and tool outputs.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-alert-ownership",
          "t": "It `SHOULD` provide clear ownership for alerts, logs, and operational visibility.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-preserve-user-work",
          "t": "It `SHOULD` preserve user work locally or durably when silent data loss would be unacceptable.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-structured-error-patterns",
          "t": "The repository `SHOULD` define structured error handling patterns.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-rich-diagnostics",
          "t": "The repository `MAY` include richer diagnostic breadcrumbs, tracing, or client event telemetry where privacy and value justify it.",
          "level": "—"
        }
      ]
    },
    {
      "num": 14,
      "pillar": "quality",
      "title": "Performance and reliability",
      "anchor": "p03-c5-performance-and-reliability",
      "lvl": "L1",
      "intent": "Performance and reliability targets are stated, measured, and defended.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-performance-budgets",
          "t": "User-facing systems `MUST` define performance budgets if speed materially affects user experience.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-reliability-expectations",
          "t": "Services and critical applications `MUST` define reliability expectations if downtime or latency materially affects users.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-reliability-consequences",
          "t": "Reliability targets `SHOULD` have clear consequences or escalation paths when missed.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-budgets-automated",
          "t": "Performance budgets `SHOULD` be measurable in automation.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-slo-sli-error-budgets",
          "t": "Teams `MAY` use SLOs, SLIs, error budgets, or equivalent models according to operational maturity.",
          "level": "—"
        }
      ]
    },
    {
      "num": 15,
      "pillar": "release",
      "title": "Supply-chain transparency and artifact integrity",
      "anchor": "p04-c1-supply-chain-transparency-and-artifact-integrity",
      "lvl": "L1",
      "intent": "What ships is what was reviewed. Provenance is verifiable.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-release-dependency-identification",
          "t": "Repositories that publish artifacts `MUST` be able to identify what dependencies went into a release.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-sbom-generation",
          "t": "Repositories that publish artifacts to external consumers `MUST` generate an SBOM if the ecosystem and tooling support it reasonably.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-build-immutable-refs",
          "t": "Source, build instructions, and outputs `SHOULD` be linked through immutable references where practical.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-build-provenance-attestation",
          "t": "Repositories `SHOULD` provide provenance or attestations when downstream consumers need build trust.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-release-from-ci",
          "t": "Published artifacts `SHOULD` be built from CI rather than developer workstations.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-artifact-signing",
          "t": "Repositories `MAY` sign artifacts, verify attestations downstream, or adopt stronger supply-chain frameworks when their distribution model warrants it.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-policy-enforcement-admission-control",
          "t": "Repositories `MAY` enforce admission control or attestation verification in downstream deployment environments so unsigned or unprovenanced artifacts cannot run.",
          "level": "—"
        }
      ]
    },
    {
      "num": 16,
      "pillar": "release",
      "title": "Branch protection, ownership, and release governance",
      "anchor": "p04-c2-branch-protection-ownership-and-release-governance",
      "lvl": "L1",
      "intent": "The default branch is sacred. Releases happen through documented rituals, not by accident.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-default-branch-protected",
          "t": "The default branch `MUST` be protected.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-required-checks-and-reviews",
          "t": "Required checks and required reviews `MUST` be enabled for protected branches.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-risky-change-ownership",
          "t": "Risky or sensitive changes `MUST` have clear ownership.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-sensitive-path-ownership",
          "t": "Repositories `MUST` identify sensitive paths — for example, authentication and authorization code, CI/CD workflow files, deployment configuration, dependency manifests, and policy documents — and define path-level ownership for them when platform support exists.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-human-review-required",
          "t": "Required-review approvals on protected branches `MUST` come from human reviewers; bot or agent accounts `MUST NOT` satisfy required-review counts and `MUST NOT` merge their own pull requests.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-vuln-disclosure-path",
          "t": "Public or externally consumed repositories `MUST` provide a vulnerability disclosure path such as `SECURITY.md`.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-codeowners-coverage",
          "t": "Path-level ownership `SHOULD` cover auth, infrastructure, workflow, deployment, and policy files (for example, a `CODEOWNERS` file on platforms that support it).",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-codeowners-self-owned",
          "t": "The ownership manifest itself `SHOULD` have an owner.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-deployment-separation",
          "t": "Preview and production deployments `SHOULD` be separated.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-merge-queue-policy-layers",
          "t": "The repository `MAY` add merge queues, release trains, or additional policy layers for high-throughput teams.",
          "level": "—"
        }
      ]
    },
    {
      "num": 17,
      "pillar": "agents",
      "title": "AI operating model",
      "anchor": "p05-c1-ai-operating-model",
      "lvl": "L2",
      "intent": "Agents need a README written for them. AGENTS.md is the entry point: how to run, test, and contribute, in machine-readable form.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-ai-forbidden-actions",
          "t": "It `MUST` identify actions the AI is not allowed to perform automatically.",
          "level": "L2"
        },
        {
          "w": "MUST",
          "id": "AIC-ai-instruction-boundaries",
          "t": "It `MUST` define architectural boundaries, coding conventions, non-negotiable invariants, and approval requirements.",
          "level": "L2"
        },
        {
          "w": "MUST",
          "id": "AIC-ai-instruction-coverage",
          "t": "That instruction source `MUST` describe how to build, test, lint, run, review, contribute, and determine when a change is ready to merge.",
          "level": "L2"
        },
        {
          "w": "MUST",
          "id": "AIC-ai-instruction-authoritative",
          "t": "The repository `MUST` provide one authoritative, versioned instruction source for AI agents.",
          "level": "L2"
        },
        {
          "w": "MUST",
          "id": "AIC-tool-specific-pointer-only",
          "t": "The path of the authoritative source `MUST` be documented in `CONTRIBUTING.md` or `README.md` so contributors and AI tools can resolve it without guessing. Any tool-specific instruction files that exist alongside it `MUST` contain only a pointer to the authoritative source — they `MUST NOT` re-declare or contradict its content.",
          "level": "L2"
        },
        {
          "w": "SHOULD",
          "id": "AIC-ai-instructions-discoverable",
          "t": "It `SHOULD` keep AI-facing instructions concise, current, and linked from contributor documentation. As a working ceiling, the authoritative instruction source `SHOULD` stay under roughly 300 lines: longer files stop being read end-to-end by either humans or model context windows, and the seven coverage areas in `AIC-ai-instruction-coverage` collapse into prose rather than scannable rules. Push detail into linked policy docs rather than growing the instruction file.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-ai-workflow-standardization",
          "t": "The repository `SHOULD` standardize common AI workflows such as implementation, review, PR preparation, release preparation, and incident fix handling.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-ai-task-templates",
          "t": "The repository `MAY` provide specialized task templates or commands for recurring workflows.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-scoped-ai-instructions",
          "t": "Multi-package repositories `MAY` add path-scoped instruction files in subdirectories so rules that apply to only one package live next to the code they govern. Path-scoped files `MUST` extend the root authoritative source, `MUST NOT` contradict it, and `MUST NOT` re-declare approval boundaries or forbidden actions — the root file remains authoritative for those.",
          "level": "—"
        }
      ]
    },
    {
      "num": 18,
      "pillar": "agents",
      "title": "Skills and shared workflow modules",
      "anchor": "p05-c2-skills-and-shared-workflow-modules",
      "lvl": "L2",
      "intent": "Recurring agent workflows live in the repo, not in chat history.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-shared-skills-versioned",
          "t": "Repositories that use shared skills, slash commands, or reusable AI workflow modules `MUST` version them in the repository.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-skill-code-review",
          "t": "Shared skills `MUST` be reviewed like code when they can change files, invoke tools, affect releases, or alter external systems.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-skill-contract-defined",
          "t": "Shared skills `MUST` define their purpose, expected inputs, expected outputs, and meaningful side effects.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-skill-no-secrets",
          "t": "Shared skills `MUST NOT` contain secrets, tokens, or environment-specific credentials.",
          "level": "L2"
        },
        {
          "w": "SHOULD",
          "id": "AIC-skill-shared-vs-personal",
          "t": "Repositories `SHOULD` separate project-shared skills from personal-only helpers.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-skill-usage-examples",
          "t": "Shared skills `SHOULD` include usage examples for high-risk or non-obvious workflows.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-skill-domain-grouping",
          "t": "Repositories `MAY` group skills by domain such as implementation, review, release, migration, or incident response.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-skill-sample-fixtures",
          "t": "Shared skills `MAY` include lightweight sample inputs or fixtures to make behavior easier to validate.",
          "level": "—"
        }
      ]
    },
    {
      "num": 19,
      "pillar": "agents",
      "title": "MCP servers and external tool governance",
      "anchor": "p05-c3-mcp-servers-and-external-tool-governance",
      "lvl": "L2",
      "intent": "Agents only get the tools they're meant to have. Tool catalogs are explicit and auditable.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-mcp-allowlist",
          "t": "Repositories that use MCP servers `MUST` explicitly approve which servers are allowed for team workflows.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-mcp-owner-purpose",
          "t": "Every approved MCP server `MUST` have a defined owner and purpose.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-mcp-auth-security",
          "t": "OAuth- or token-based MCP integrations `MUST` use secure token handling and redirect validation appropriate to the platform.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-mcp-least-privilege",
          "t": "MCP tools and servers `MUST` use least privilege.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-mcp-write-vs-read-distinguishable",
          "t": "Write-capable MCP servers `MUST` be distinguishable from read-only ones.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-mcp-root-scoping",
          "t": "Filesystem roots and other exposed resources `MUST` be scoped deliberately to approved workspaces or data sources.",
          "level": "L2"
        },
        {
          "w": "SHOULD",
          "id": "AIC-mcp-auditability",
          "t": "Teams `SHOULD` be able to identify which external systems an AI agent can read or mutate through MCP.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-mcp-env-separation",
          "t": "Dev, staging, and production MCP connectors `SHOULD` be separated when they touch operational systems.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-mcp-pinned-versions",
          "t": "MCP servers `SHOULD` be pinned to known versions or controlled deployment channels where possible.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-mcp-prompt-review",
          "t": "MCP prompts exposed as slash commands `SHOULD` be reviewed before being relied on operationally.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-mcp-read-only-default",
          "t": "Teams `SHOULD` prefer read-only MCP access by default.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-mcp-root-prompt",
          "t": "Users `SHOULD` be prompted before exposing roots or other sensitive resources to MCP servers.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-mcp-extra-sandboxing",
          "t": "Teams `MAY` apply additional sandboxing, network isolation, or execution controls to third-party MCP servers.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-mcp-registry-discovery",
          "t": "Teams `MAY` use the official MCP Registry for discovery, but they remain responsible for server vetting.",
          "level": "—"
        }
      ]
    },
    {
      "num": 20,
      "pillar": "agents",
      "title": "Agents and delegation governance",
      "anchor": "p05-c4-agents-and-delegation-governance",
      "lvl": "L2",
      "intent": "Agents that act without per-step human approval are first-class subjects: they have identities, scopes, and audit trails.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-parallel-isolation",
          "t": "Parallel agents `MUST NOT` edit overlapping files unless the workflow explicitly defines coordination for that case.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-permission-limits",
          "t": "Agents `MUST` have explicit tool, write, and approval limits.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-quality-gates",
          "t": "Agent-produced changes `MUST` pass the same quality gates as any other code contribution.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-scope-defined",
          "t": "Repositories that use autonomous or delegated agents `MUST` define agent roles, scope boundaries, ownership, and success conditions.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-action-traceability",
          "t": "Every material agent action `MUST` produce a record with, at minimum: agent identity, model identifier and model-version ID, prompt or skill version, ISO 8601 timestamp with seconds, and action category (read / write / merge / deploy / settings-change / external-call). The record location `MUST` be the same one documented for `AIC-prompt-audit-trail`. The record `MUST` be queryable: an auditor `MUST` be able to list material actions by agent, action category, or time range with one command or API query. Prose-only attribution (\"our agents log to Linear\") does not satisfy this rule.",
          "level": "L2"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-bounded-delegation",
          "t": "Delegation `SHOULD` be limited to bounded, well-scoped tasks.",
          "level": "L4"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-escalation-trigger-enforcement",
          "t": "Repositories that operate an autonomous runner `MUST` define and enforce escalation triggers before the runner performs destructive, security-sensitive, release-affecting, high-volume, or repeatedly failing actions. The triggers `MUST` include per-window action limits, a named escalation owner, and a response expectation or SLA for paused work.",
          "level": "L4"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-kill-switch",
          "t": "Repositories that operate an autonomous runner (any agent that can merge, deploy, release, rotate settings, or otherwise act without per-change human approval) `MUST` provide a kill switch: a single documented action that immediately halts the runner, by both disabling its execution path (workflow, scheduled job, agent harness) and revoking or expiring the runner's credentials so a residual process cannot continue acting. The kill switch `MUST` be exercisable without a code change to the repository. This complements `AIC-agent-cost-ceiling`, which addresses cost runaway; this clause addresses content runaway.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-escalation-paths",
          "t": "Teams `SHOULD` define escalation paths for uncertainty around security, production systems, data handling, or architecture changes.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-standard-roles",
          "t": "Teams `SHOULD` define standard agent roles such as implementer, reviewer, researcher, or release helper.",
          "level": "L4"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-rollback-procedure",
          "t": "Repositories that operate an autonomous runner `MUST` document a rollback procedure for content the runner has already merged, deployed, or released. The procedure `MUST` rely on the authorship-traceability mechanism from `AIC-ai-authorship-traceability` so that runner-authored commits, releases, or settings changes are mechanically identifiable for revert without manual archaeology. Incident response (§29) may invoke this procedure.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-structured-outputs",
          "t": "Agent outputs `SHOULD` be structured enough for safe handoff between agents and humans.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-versioned-instructions",
          "t": "Agents `SHOULD` rely on repository-versioned instructions rather than hidden session state.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-agent-benchmarking",
          "t": "Teams `MAY` benchmark agent roles on representative tasks.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-agent-extra-sandboxing",
          "t": "Teams `MAY` apply stronger sandboxing to higher-risk agents.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-agent-trust-tiers",
          "t": "Teams `MAY` define trust tiers such as read-only, code-write, or release-capable agents.",
          "level": "—"
        }
      ]
    },
    {
      "num": 21,
      "pillar": "risk",
      "title": "AI-specific risks",
      "anchor": "p06-c1-ai-specific-risks",
      "lvl": "L2",
      "intent": "Anything an agent reads can become an instruction. Untrusted sources are gated and marked.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-ai-context-retention",
          "t": "Repositories that retain AI conversation context, tool outputs, or training-adjacent data `MUST` state retention limits and sanitization rules.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-ai-dependency-verification",
          "t": "Repositories whose AI workflows can introduce dependencies `MUST` define how those dependency additions are verified before use, including whether the package exists in the canonical registry and who owns it.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-ai-provider-allowlist",
          "t": "Repositories that route work to external AI providers or models `MUST` maintain an explicit allowlist. Each entry `MUST` record its approval scope — permitted data classifications (consistent with §22) and action categories (read-only research, code authoring, release-affecting automation). Agent workflows `MUST NOT` route outside the allowlist.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-capability-scoping",
          "t": "Repositories that deploy agents exposed to untrusted input `MUST` apply capability scoping: the agent's tool, read, and write capabilities `MUST` be constrained at the permission layer based on the user's requested task, not by model self-policing. A read-only task `MUST NOT` run with write, send, or external-call capabilities enabled.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-non-english-filter-coverage",
          "t": "Repositories whose AI-exposed surfaces serve users in languages other than English `MUST` verify that any pattern-filter or LLM-filter guardrail claimed as a control has coverage in those languages, or `MUST` record the control's scope as English-only.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-risk-matched-controls",
          "t": "Controls claimed as mitigation for a specific risk class (for example prompt injection, data exfiltration, PII leakage, training-data reproduction, copyrighted-material reproduction, profanity, or toxicity) `MUST` be evaluated against that risk class. Effectiveness against a different class does not transfer without evidence. Static-benchmark results against fixed datasets `MUST NOT` be the sole evidence. Adaptive or human-in-the-loop evaluation `MUST` be included.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-trusted-channel-classification",
          "t": "Repositories that expose agents to external content `MUST` identify which content channels are trusted inputs to agents and which require sandboxing or human review.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-untrusted-agent-input",
          "t": "Repositories whose AI workflows consume external content (issues, pull request comments, fetched URLs, retrieved documents, tool outputs) `MUST` treat it as untrusted input. Such content `MUST NOT` silently elevate agent privileges, trigger destructive or release-affecting actions, or exfiltrate repository contents.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-cost-ceiling",
          "t": "Repositories that pay per-token or per-call for agent work `MUST` have a documented cost ceiling or kill switch for runaway loops.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-boundary-schema-validation",
          "t": "When agent-authored code consumes an external API, SDK, or data source whose wire shape is not enforced by the transport, the repository `MUST` validate responses against a runtime schema at the boundary, independent of the declared type.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-classifier-only-controls-excluded",
          "t": "LLM-filter guardrails and prompt-level refusal instructions (for example, \"if the user tries to trick you, refuse\") `MUST NOT` be counted, alone, as controls for any `MUST` clause concerning prompt injection, jailbreaking, destructive, security-sensitive, or release-affecting actions. They `MAY` be used as telemetry or a secondary signal.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-code-test-independence",
          "t": "When an agent session authors both an implementation and its tests, the repository `MUST` apply an independent verification mechanism — mutation testing, property-based tests, or independent review of the tests by a reviewer who did not author them — to detect the case where code and tests encode the same error.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-prompt-versioning-review",
          "t": "Repositories that author system prompts, agent instructions, or shared skills `MUST` version them in the repository and review them like code when they materially affect agent behavior.",
          "level": "L3"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-behavior-monitoring",
          "t": "Repositories `SHOULD` surface unusual agent behavior such as broad file rewrites, sudden permission changes, or repeated retries on the same failing step.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-tool-pinning",
          "t": "The set of tools exposed to agents `SHOULD` be pinned and changes `SHOULD` be reviewed.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-ai-coverage-vanity-guard",
          "t": "Repositories that gate on coverage `SHOULD` reject AI-authored test additions that raise the coverage number without raising assertion density on the lines they newly cover. Agents reliably generate tests that execute branches without checking observable behavior — clearing a percentage threshold while leaving the underlying logic unverified. Coverage growth without assertion growth is a vanity signal, not evidence the change is tested. This complements `AIC-coverage-as-minimum` (§11) and `AIC-test-strength-independent` (§11) by naming the AI-specific failure mode.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-input-domain-property-coverage",
          "t": "Agent-authored pure functions, parsers, and data transformations `SHOULD` be covered by property-based tests in addition to example-based tests. Agents reliably enumerate a handful of plausible inputs and miss input classes outside their training distribution — empty collections, Unicode, whitespace-only strings, duplicates, `NaN`, negatives, overlong inputs. Stating the invariant forces the coverage that sampling skips.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-minimum-capability-set",
          "t": "Agent workflows `SHOULD` derive the minimum required capability set from the user's requested task before the agent runs. Tasks that would combine read-from-untrusted-source and write-to-sensitive-sink capabilities in a single agent context `SHOULD` be rejected without an explicit approval step.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-agent-isolated-workspaces",
          "t": "Repositories `MAY` run agents in isolated workspaces, containers, or sandboxes when the blast radius of a mistake would be large.",
          "level": "—"
        },
        {
          "w": "MAY",
          "id": "AIC-model-output-attestation",
          "t": "Repositories `MAY` adopt model-output attestation or signing as agent-provenance tooling matures.",
          "level": "—"
        }
      ]
    },
    {
      "num": 22,
      "pillar": "risk",
      "title": "Data protection and privacy",
      "anchor": "p06-c2-data-protection-and-privacy",
      "lvl": "L2",
      "intent": "Sensitive data does not leak into model providers, telemetry, or logs without intent.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-ai-data-classification",
          "t": "Repositories `MUST` classify the data that flows through AI agents and tools: source code, secrets, customer data, regulated data, telemetry.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-regulated-data-provider-gate",
          "t": "Repositories whose AI workflows can expose regulated or secret data to provider context windows `MUST` prevent that data from entering any provider that is not explicitly approved for that data class.",
          "level": "L2"
        },
        {
          "w": "MUST",
          "id": "AIC-ai-surface-redaction",
          "t": "Secrets, credentials, and personally identifiable information `MUST` be redacted from AI-specific surfaces (prompts, agent transcripts, tool outputs, and AI-related error reports), extending the observability requirements of §13 to AI workflows.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-data-residency-verified",
          "t": "Repositories with data-residency requirements `MUST` verify that AI providers, MCP servers, and external tools respect those requirements.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-regulated-data-controls",
          "t": "Repositories handling regulated data (health, finance, government, minors, and similar) `MUST` document the legal basis and controls for sending any such data to AI providers or external tools.",
          "level": "L2"
        },
        {
          "w": "SHOULD",
          "id": "AIC-ai-fixtures",
          "t": "Repositories `SHOULD` provide a safe, scrubbed fixture set for AI workflows that would otherwise require real data.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-ai-prod-data-readonly",
          "t": "Access to production data through AI workflows `SHOULD` be read-only unless a write path is explicitly designed and approved.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-data-minimization-techniques",
          "t": "Repositories `MAY` adopt data minimization, synthetic-data generation, or differential-privacy techniques for AI workflows that require representative data.",
          "level": "—"
        }
      ]
    },
    {
      "num": 23,
      "pillar": "oversight",
      "title": "Human approval and manual checkpoints",
      "anchor": "p07-c1-human-approval-and-manual-checkpoints",
      "lvl": "L1",
      "intent": "At every level above L1, humans hold the gate. What requires approval, and from whom, is written down.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-human-approval-baseline",
          "t": "The repository `MUST` define which actions require explicit human confirmation. The baseline list `MUST` include every action that meets the Definitions of _destructive_, _security-sensitive_, or _release-affecting_; repositories may add more, but may not silently narrow these categories.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-no-silent-destructive-actions",
          "t": "AI agents `MUST NOT` be allowed to silently perform destructive, security-sensitive, or release-affecting actions that the repository policy reserves for humans.",
          "level": "L1"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-ai-authorship-disclosure-policy",
          "t": "Repositories that accept contributions from outside the documented contributor group `MUST` publish a disclosure policy for materially AI-authored pull requests and `MUST` enforce it during intake review. The policy `MUST` define what \"materially AI-authored\" means for the repository, how authorship is declared in the pull request, and how missing or incorrect declarations are handled.",
          "level": "L2"
        },
        {
          "w": "SHOULD",
          "id": "AIC-disclosure-evidence",
          "t": "The disclosure policy for materially AI-authored pull requests `SHOULD` specify the verification evidence expected — reproducible test output, screenshots of behavior, API traces, or equivalent — so reviewers can verify the change rather than re-generate it.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-escalated-approval-categories",
          "t": "The repository `SHOULD` escalate approval requirements for migrations, deployment changes, auth changes, or repository-wide rewrites.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-human-approval-large-changes",
          "t": "Human approval `SHOULD` be required before commit or push in workflows where AI can generate large or cross-cutting changes.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-stronger-signoff-regulated",
          "t": "Teams `MAY` add stronger sign-off requirements for regulated or high-impact systems.",
          "level": "—"
        }
      ]
    },
    {
      "num": 24,
      "pillar": "oversight",
      "title": "Guardrail documentation and evidence",
      "anchor": "p07-c2-guardrail-documentation-and-evidence",
      "lvl": "L1",
      "intent": "Claims about what agents can and cannot do are backed by evidence in the repository.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-authoritative-guardrail-doc",
          "t": "The repository `MUST` document guardrails in one authoritative place.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-gate-enforcement",
          "t": "An automated check `MUST NOT` be counted as enforcing a requirement from this document unless its failure blocks merge on the change path it evaluates. Jobs configured to continue on evaluation failure, or to otherwise mask non-zero results from the protected-branch status, `MUST` be labelled as advisory in the guardrail documentation.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-guardrail-failure-surface",
          "t": "It `MUST` identify where each guardrail is defined and how failure is surfaced.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-machine-vs-manual-guardrails",
          "t": "That document `MUST` clearly state what is enforced automatically and what depends on review or process.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-threshold-enforcement",
          "t": "A threshold, budget, or limit declared in configuration `MUST NOT` be counted as an automatic guardrail unless an automated check evaluates it on every change path that claims it.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-guardrail-active-evidence",
          "t": "The repository `SHOULD` maintain lightweight evidence that important guardrails are actually active, such as CI configuration, security settings, or documented repository policy.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-guardrail-doc-maturity-mapping",
          "t": "Teams `MAY` map this document to maturity models or external standards if organizational compliance requires it.",
          "level": "—"
        }
      ]
    },
    {
      "num": 25,
      "pillar": "oversight",
      "title": "Policy governance",
      "anchor": "p07-c3-policy-governance",
      "lvl": "L1",
      "intent": "Someone, by name or role, owns the AI policy. It is not orphaned.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-policy-change-review",
          "t": "Changes to the adopted specification `MUST` go through the same review process as code, including required reviewers.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-policy-living-document",
          "t": "When a new AI-era risk becomes credible, the repository `MUST` decide whether to add or revise guardrails rather than treating the specification as frozen.",
          "level": "L1"
        },
        {
          "w": "MUST",
          "id": "AIC-policy-owner-cadence",
          "t": "The adopted specification itself `MUST` have a named owner and a documented review cadence.",
          "level": "L1"
        },
        {
          "w": "SHOULD",
          "id": "AIC-policy-effective-dates",
          "t": "The repository `SHOULD` record the effective date and last review date of the adopted specification.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-policy-evidence-links",
          "t": "The repository `SHOULD` link each checklist item to the specific automation, configuration, or review step that enforces it, so conformance is auditable in practice.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-policy-external-mapping",
          "t": "Teams `MAY` map this document to external standards or maturity frameworks when organizational compliance requires cross-referencing.",
          "level": "—"
        }
      ]
    },
    {
      "num": 26,
      "pillar": "oversight",
      "title": "AI-generated content: licensing and attribution",
      "anchor": "p07-c4-ai-generated-content-licensing-and-attribution",
      "lvl": "L2",
      "intent": "AI-authored work is attributed and licensed clearly.",
      "rules": [
        {
          "w": "MUST",
          "id": "AIC-ai-authorship-traceability",
          "t": "Where the hosting platform or CI allows it, the repository `MUST` provide a way to identify materially AI-authored commits or pull requests after the fact — for example a commit trailer, PR label, or metadata field. The mechanism `MUST` be documented in the same place as the licensing declaration.",
          "level": "L2"
        },
        {
          "w": "MUST",
          "id": "AIC-ai-output-licensing-declaration",
          "t": "The repository `MUST` declare its position on license and ownership for AI-generated content in a durable document (for example `CONTRIBUTING.md`, `LICENSING.md`, or the authoritative AI instruction file from §17). The declaration `MUST` say whether AI-generated code, documentation, and tests are accepted, and under what license they are contributed.",
          "level": "L2"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-prompt-audit-trail",
          "t": "Repositories where AI materially authors code that ships `MUST` record, for every material AI-generated change: the model identifier, the prompt or system-prompt version, and any skill version used. The record location (commit trailer, PR body field, release manifest, audit-log row, or equivalent) `MUST` be documented with the `AIC-ai-authorship-traceability` mechanism. The record `MUST` be queryable: an auditor `MUST` be able to list AI-authored changes by model, prompt version, or skill version with one command or API query. This makes `AIC-ai-authorship-traceability` concrete for L3+ and supports `AIC-agent-rollback-procedure`.",
          "level": "L2"
        },
        {
          "w": "SHOULD",
          "id": "AIC-ai-model-provenance",
          "t": "The repository `SHOULD` record the model identifier on material AI-generated changes so provenance can be reconstructed if a downstream licensing question arises. Below L3 this remains a SHOULD; at L3+ it is covered by `AIC-prompt-audit-trail`.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-licensing-disclosure-alignment",
          "t": "The repository `SHOULD` align its AI-authorship disclosure policy (§23) with the licensing declaration in this section so contributors see a single, consistent story for both attribution and legal status.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-ai-input-retention",
          "t": "The repository `MAY` require contributors to retain prompts, tool outputs, or other inputs that produced material AI-generated changes for a defined period, where audit or regulatory needs justify it.",
          "level": "—"
        }
      ]
    },
    {
      "num": 27,
      "pillar": "oversight",
      "title": "AI credential lifecycle",
      "anchor": "p07-c5-ai-credential-lifecycle",
      "lvl": "L3",
      "intent": "Credentials issued to agents are short-lived, scoped, and revocable.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-credential-not-sole-approver",
          "t": "An agent `MUST NOT` be the sole approver of a credential rotation or revocation that affects production systems or any sensitive sink. Approval `MUST` come from a human reviewer per §23.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-credential-audit",
          "t": "Agent-initiated credential creation, rotation, and revocation `MUST` produce a durable audit record naming the agent, the human approver (per §23), the credential class, and the scope of the change.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-agent-credential-class-scope",
          "t": "Repositories whose agents can create, rotate, or revoke credentials `MUST` enumerate which credential classes the agent is allowed to operate on. Agent operations on classes outside that enumeration `MUST NOT` be permitted.",
          "level": "L3"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-observed-credential-rotation",
          "t": "Repositories `SHOULD` rotate any credential the agent demonstrably read from a transcript, tool output, or context window before continuing operations. The §22 redaction rules limit exposure; this rule treats observed exposure as a rotation trigger.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-agent-credential-short-lived",
          "t": "Credentials issued or rotated by an agent `SHOULD` be short-lived where the platform supports it, consistent with §8's deployment-credential rule.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-agent-credential-distinct-identity",
          "t": "Repositories `MAY` constrain agent credential operations to a separate role or harness identity distinct from the human-operator identity, so agent operations are distinguishable in audit logs.",
          "level": "—"
        }
      ]
    },
    {
      "num": 28,
      "pillar": "oversight",
      "title": "AI model and provider deprecation",
      "anchor": "p07-c6-ai-model-and-provider-deprecation",
      "lvl": "L3",
      "intent": "Switching the model is a code change, not a config tweak slipped past review.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-allowlist-rescope-on-terms-change",
          "t": "When a vendor changes the data classifications or action categories an entry was approved for under §21 and §22, the entry's approval scope `MUST` be re-evaluated before agent workflows continue using it.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-no-routing-past-eol",
          "t": "Agent workflows `MUST NOT` continue routing to a deprecated or sunset entry past its end-of-life date without explicit re-approval recorded against the §21 allowlist.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-provider-deprecation-procedure",
          "t": "The repository `MUST` define a procedure for evaluating an allowlist entry when the vendor announces deprecation, sunset, ownership change, or material terms-of-service change. The procedure `MUST` state who decides, on what evidence, and within what window.",
          "level": "L3"
        },
        {
          "w": "SHOULD",
          "id": "AIC-provider-eol-tracked",
          "t": "The repository `SHOULD` track the published end-of-life or deprecation status of allowlisted models and providers in the same place as the allowlist itself, so the dependency on third-party lifecycles is visible.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-provider-fallback-path",
          "t": "The repository `SHOULD` plan a fallback path — an alternative allowlisted entry, a documented degradation mode, or an explicit pause of the affected workflow — before relying on a model or provider whose continuity is uncertain.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-provider-deprecation-feed",
          "t": "Repositories `MAY` subscribe to vendor deprecation channels and surface notices in repository tooling rather than relying on out-of-band communication.",
          "level": "—"
        }
      ]
    },
    {
      "num": 29,
      "pillar": "oversight",
      "title": "AI incident response and guardrail-update loop",
      "anchor": "p07-c7-ai-incident-response-and-guardrail-update-loop",
      "lvl": "L3",
      "intent": "AI-driven incidents are first-class. There is a known way to stop, investigate, and learn from them.",
      "rules": [
        {
          "w": "MUST_WHEN",
          "id": "AIC-ai-incident-definition",
          "t": "Repositories that operate AI agents in production paths `MUST` define what counts as an AI-attributable incident, who triages it, and what evidence is preserved.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-ai-incident-review",
          "t": "After an AI-attributable incident, the repository `MUST` run a review that identifies the agent action that caused the harm, the control that should have prevented it, and whether that control existed, was bypassed, or was missing.",
          "level": "L3"
        },
        {
          "w": "MUST_WHEN",
          "id": "AIC-incident-guardrail-update",
          "t": "If the incident review identifies a missing or weakened control, the guardrail documentation under §24 `MUST` be updated to reflect the new or strengthened control before similar agent work resumes.",
          "level": "L3"
        },
        {
          "w": "SHOULD",
          "id": "AIC-incident-context-recorded",
          "t": "Incident reviews `SHOULD` record the model identifier, prompt or skill version, and tool set involved, consistent with `AIC-prompt-audit-trail` (§26, MUST when applicable for L3+) and `AIC-ai-model-provenance`, so the review is reproducible against the same operating context.",
          "level": "L4"
        },
        {
          "w": "SHOULD",
          "id": "AIC-incident-evidence-lineage",
          "t": "Repositories `SHOULD` cross-link the incident record from the affected guardrail's evidence under §24, so future readers see the lineage from incident to control change.",
          "level": "L4"
        },
        {
          "w": "MAY",
          "id": "AIC-incident-postmortem-cadence",
          "t": "Repositories `MAY` operate a public or internal post-mortem cadence for AI-attributable incidents to share lessons across teams.",
          "level": "—"
        }
      ]
    }
  ]
} as const;
