# ADR-006: UI language — German, hardcoded

## Status
Accepted

## Context
The project's written outputs — code, identifiers, comments, tests,
documentation, commit messages — are in English. The admin dashboard, however,
is used exclusively by a German-speaking core team, the Google Form columns are
German, and the PayPal payment mails are German.

## Decision
All user-facing strings in the admin dashboard are **German**, hardcoded, with
no i18n framework.

## Rationale
- The only users are German speakers; an English UI would serve no one
- The data the dashboard shows (Google Form columns, PayPal mails) is German
  already
- An i18n framework adds setup and indirection for a single language

## Rejected alternatives
- **English UI**: consistent with the rest of the project, but wrong for the
  actual users
- **i18n framework with German as the only locale**: prepared for more
  languages, but no other language is needed

## Consequences
- This is a deliberate exception to the English-only rule. It covers
  user-facing copy only — code, identifiers, comments, tests and documentation
  stay English
- Adding another language later means extracting the hardcoded strings
