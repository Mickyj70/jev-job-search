# Using this fork with Codex

## Requirements and setup

Use a Mac with Google Chrome, Node 22 or newer, and a current Codex CLI
installed and signed in (`codex login`). The writer starts the `codex` executable,
including when your conversation is in the Codex app; the app alone is not enough.
You need access to the model configured as `WRITER.codexModel` in `src/config.ts`.
The default is `gpt-5.4`; change it to a model your account supports if necessary.

Run `npm ci`, copy `.env.example` to `.env`, and set `WRITER_BACKEND=codex`.
Enter your OpenRouter key in that file yourself. JEV still uses OpenRouter.
An Anthropic key and Claude installation are not required for this backend.
Without the explicit backend setting the original Claude selection is retained.
Codex charges or plan limits depend on your Codex login; JEV cost reporting does
not estimate Codex charges or token counts.

## Workflows

Open the repository in Codex. `AGENTS.md` supplies project rules and
`.agents/skills/jev-*/SKILL.md` supplies the workflows. Ask in plain language,
or select `$jev-setup`, `$jev-discover`, `$jev-apply`, `$jev-accounts`,
`$jev-daily`, `$jev-resume`, `$jev-status`, `$jev-inbox`, `$jev-report`,
`$jev-profile`, `$jev-tailor`, `$jev-expand` or `$jev-add-source`.
These are project skills, not Codex built-in slash commands.

The skills are adapted from the upstream workflows. Setup may describe a local
Mac dialog, Keychain, AppleScript or browser action. Those actions need the user's
Mac; a Linux cloud workspace can develop and test but cannot replace it.
The user enters secrets and completes sign-ins and human checks locally.
Development must never send a real application. Existing daily-run policy,
account authorization, truthfulness and submission guards remain in force.

Check the installation with `npx jev doctor`. `npx jev doctor --online` also
makes a small paid JEV request and a Codex request to verify model access.

## Writer implementation

The writer uses `codex exec --ephemeral --sandbox read-only` in a temporary
folder outside the repository, with the facts and instructions supplied on stdin.
It asks for no tool use. Read-only is a filesystem sandbox, not a guarantee that
all tools or inherited MCP integrations are disabled. Use a dedicated Codex CLI
configuration without external integrations for the writer if you have them set up.
The final message goes to a temporary file that is removed after the call.
Candidate facts are not placed in command arguments or copied into progress logs.
The same JSON schemas, unsupported-claim checks and browser read-back checks apply
to Codex answers. Failures stop the writer rather than falling back to Claude.

Offline tests use fake processes and fictional data. End-to-end Codex authentication,
model access, macOS integration and real forms require local validation.
