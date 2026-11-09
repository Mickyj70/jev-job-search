---
name: jev-status
description: Say where the job search stands in a few lines. Use when the user says $jev-status, "where am I", "what happened", "how many did I send", "what is waiting for me", or "what does this cost".
---

# $jev-status

Run these and give one short answer, not four dumps:

```
npx jev status
npx jev doctor
npx jev cost
npx jev schedule status
```

Say, in this order and only what applies:

1. **Sent**: today and in total.
2. **Waiting for you**: each form, what it asks for, and that `$jev-resume`
   picks it up after they have done it in the tool's Chrome window.
3. **Left for you**: how many are on the by-hand list, and the two or
   three most common reasons. `npx jev log --manual` lists them.
4. **Queue**: how many jobs are ready to apply to, and how old the search
   is. Offer `$jev-discover` when it is more than a day old.
5. **Accounts and the daily run**: one line each, only if set up.
6. **Cost**: what JEV has cost. Codex usage depends on their login and is not priced by this tool.
7. **Next step**: the one thing `doctor` names, as a slash command where
   there is one (`$jev-setup`, `$jev-discover`, `$jev-apply`, `$jev-accounts`, `$jev-daily`,
   `$jev-resume`, `$jev-report`).

Never print a path, an id or a number they did not ask for when a sentence
will do. `$jev-report` is the full picture, in a page.
