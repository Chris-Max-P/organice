# Team organisation tools: guardrails vs. freedom

*Researched 2026-10-16 from vendor docs, help centres, pricing pages, changelogs
and source repos. Pricing and plan gating change often — re-check before relying
on them. Claims based only on community reports are marked **[experience]**;
the author's own synthesis is marked **[analysis]**.*

## Summary

**1. Which tools do for groups what Notion/Obsidian do for individuals?**
Three families:

- **Flexible workspaces** (Notion, Coda, Airtable, ClickUp, Fibery, AppFlowy,
  AFFiNE, Anytype, Tana, Craft, Nuclino, Outline): the team builds its own
  structure. Of the personal-knowledge tools, Obsidian (shared vaults via Sync),
  Anytype (shared spaces), Tana (shared workspaces) and Logseq (DB version, beta)
  now support groups. Capacities explicitly does not
  ([Capacities facts](https://capacities.io/about/facts)).
- **Knowledge bases with a freshness workflow** (Confluence, Guru, Slite,
  Tettra): fixed doc/space structure plus ownership and verification.
- **Opinionated, fixed-model tools** (Basecamp, Loomio, Spond, Engelsystem):
  the vendor defines the structure; teams switch parts on/off or rename them.

**2. Which offer guardrails *and* leave room for customisation?**
The strongest middle ground is in tools that split **builders from users**:
Airtable (Creator vs. interface-only/field editing permissions), Coda (Doc Maker
vs. Editor, page/table locking), Notion ("Can edit content", database locking,
property access, verification) and ClickUp (admin-only statuses/task types,
required custom fields). Fibery is similar, with a more granular permission
model. In nearly all of them the hard guardrails are **paywalled at
Business/Enterprise level**. Tana and Obsidian lean towards freedom: their
guardrails are advisory or absent. Basecamp, Loomio, Spond and Engelsystem
lean towards guardrails: alignment comes from the fixed model, not from
configuration.

## Comparison

| Tool | Model | Guardrail features | Customisation features | Tier gating of guardrails |
|---|---|---|---|---|
| Notion | Pages + databases in teamspaces | "Can edit content" (no schema changes), lock database/views, property access, page verification + owners, teamspace owner controls, required form questions | Free-form pages, own databases/properties/views, templates incl. repeating | Verification, private teamspaces, property access, "Can create", form logic: Business+; custom teamspace permissions, publish/export blocks: Enterprise |
| Obsidian | Local Markdown vault; Sync shares it | Vault-wide property types; nothing else built in | Everything (plugins, file layout, properties, Bases) | Sharing needs Sync for every collaborator; no roles at all |
| Coda (now "Superhuman Docs") | Docs = pages + tables + formulas | Doc Maker vs. Editor role with admin approval; page/table locking ("interact only", read-only); doc admins control unlocking | Build apps in docs: tables, formulas, buttons, Packs | Locking: Team/Enterprise; maker approval: paid workspaces |
| Airtable | Relational bases + interfaces | Owner/Creator-only schema edits; field and table editing permissions (enforced in API too); interface-only users | Own schema, views, interfaces, automations | Field/table permissions and interface-only access: Team, Business, Enterprise Scale |
| ClickUp | Hierarchy Space > Folder > List > Task | Admin-only status/task-type edits; required custom fields (creation-time); custom roles | Custom statuses, fields, task types, views per level | Required fields: Business+; custom roles: Enterprise (1 on Business Plus); private spaces: Enterprise |
| Fibery | Admin-defined databases + relations in spaces | Space/database/entity access levels, custom access templates, required fields (creation-time) | Build the whole data model and processes | Not checked |
| Confluence | Spaces + page trees | Space/page permissions, admin-curated templates, admin-defined content statuses (max 5), admin key | Pages, space templates, macros/apps | Any permissions: Standard+ (Free = everyone edits everything); admin key: Premium+ |
| Guru | Cards in collections | Named verifier (user/group), verification intervals, owner-only templates, AI quality agents | Collections, card templates | Not stated in docs |
| Slite | Docs in channels | Doc verification with owners, expiry reminders, knowledge-management panel | Docs, templates | Verification: from Basic (lowest paid) |
| Tettra | Wiki pages | Page owners, verification schedule, unowned/stale page reports | Pages, categories | Verification dashboards: Scaling/Professional |
| Outline | Collections of docs (open source) | Collection-level View/Edit/Admin, admins can disable member collection creation | Docs, collection/workspace templates | Admin list of private collections: cloud/licensed only |
| Anytype | Typed objects in shared spaces | Viewer/Editor/Admin/Owner; default object type, default templates per type | User-defined types, properties, templates | Editor seats per plan |
| Tana | Outliner with supertags (typed nodes) | "Required" field = visual warning only | Supertags, fields, options | — |
| Logseq (DB) | Outliner with tags-as-classes | Typed properties on tags (schema, not enforcement) | Same | Collaboration (RTC) paid/invite-only per a secondary source |
| AFFiNE | Docs + whiteboards + databases | Workspace-wide page properties; admin roles | Blocks, databases, canvases | Admin roles: Team plan |
| AppFlowy | Notion-like, open source | Space-level permissions, groups, restricted spaces, guest approval | Pages, databases, formulas | Not stated |
| Craft | Docs in team spaces | Owner vs. Member per space | Docs, collections | Shared spaces: Team/Family plans |
| Nuclino | Wiki items in workspaces | Full/Comment-only/Read-only, template creation limited to full access | Items, templates, boards | Comment-only/read-only roles: paid |
| Basecamp | Fixed per-project tools | Fixed tool set; admins set default tool names; client visibility | Toggle/rename tools, project templates | — |
| Loomio | Discussions + decisions | Admin-curated discussion/poll templates, hide templates, member permissions | Custom templates | — |
| Spond | Club groups/subgroups/events | Admin roles with Manage/Privacy/Publish permissions, club-level control | Custom admin roles | Departments: Spond Club |
| Engelsystem | Volunteer shift planning (open source) | Fixed helper/team/shift model, audit log | Configuration only | — |

## Per-tool notes

### Notion
- **Guardrails:** "Can edit content" lets people edit rows and property values
  but not "the database's structure, properties, views, sorts, or filters"
  ([sharing & permissions](https://www.notion.com/help/sharing-and-permissions)).
  "Lock views"/"Lock database" blocks structural changes, but "anyone with
  editing access can toggle this lock on or off at any time"
  ([intro to databases](https://www.notion.com/help/intro-to-databases)), so it
  prevents accidents, not deliberate changes. Property access sets per-column
  rights from "Can edit property & values" down to "No access"
  ([property access](https://www.notion.com/help/database-property-access)).
  Verified pages carry a blue check, need at least one owner, can expire, and
  owners are notified on expiry
  ([wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages)).
  Teamspace owners control membership, invites and sidebar edits; security
  settings inherit from the workspace
  ([teamspaces](https://www.notion.com/help/intro-to-teamspaces)). Forms can
  require answers and write into a database
  ([forms](https://www.notion.com/help/forms)).
- **Freedom:** database templates are suggestions — after creation "you can make
  any changes you want"; no enforced template is documented
  ([database templates](https://www.notion.com/help/database-templates)).
  No required properties outside forms.
- **Gating:** verification, private teamspaces, "Can create", property access
  and form conditional logic are Business/Enterprise; per-member teamspace
  permissions and publish/guest/export blocks are Enterprise
  ([pricing](https://www.notion.com/pricing),
  [teamspaces](https://www.notion.com/help/intro-to-teamspaces),
  [forms](https://www.notion.com/help/forms)).

### Obsidian
- Shared vaults: only the owner invites, up to 20 users, collaborators have the
  same rights as the owner; fine-grained permissions are "not supported yet";
  every collaborator needs a Sync subscription
  ([collaborate](https://obsidian.md/help/sync/collaborate)).
- The one built-in alignment mechanism: a property name has one type across the
  whole vault ([properties](https://obsidian.md/help/properties)). No required
  properties or validation.
- Publish is a hosted read-oriented site for chosen notes
  ([publish](https://obsidian.md/help/publish)).
- Convention enforcement only via community plugins, e.g. Linter (YAML,
  heading, spacing rules) ([obsidian-linter](https://github.com/platers/obsidian-linter)).
  Plugins are per-device configuration; whether a team keeps them in sync is
  **[experience]**, not documented.

### Coda (rebranded as Superhuman Docs)
- The site banner now reads "Coda is now Superhuman Docs"
  ([locking guide](https://coda.io/resources/guides/locking-in-coda)) — names
  and URLs may change.
- **Guardrails:** page locking (Interact only / Read-only), table locking
  (column management, add/delete/edit data), and doc admins who control
  unlocking; Team/Enterprise only. Coda states locking is not a security
  feature and doesn't stop API access
  ([locking guide](https://coda.io/resources/guides/locking-in-coda)).
  Only Doc Makers create docs/pages; admins choose instant, 7-day-grace or
  manual approval for new makers (paid workspaces)
  ([manage Doc Makers](https://help.coda.io/hc/en-us/articles/39555943452685-Manage-Doc-Makers-in-your-workspace)).
- **Freedom:** docs behave like small apps (tables, formulas, buttons, Packs).

### Airtable
- Changing a field's name, type or options always needs Owner/Creator; field
  editing permissions restrict who changes *values*; table permissions restrict
  record create/delete; these apply in interfaces, mobile, extensions and the
  API ([field & table permissions](https://support.airtable.com/articles/2296468758-airtable-field-and-table-editing-permissions)).
- Interface-only collaborators can view/comment/edit records through an
  interface without base access; there is no interface-only Creator
  ([Interface Designer permissions](https://support.airtable.com/articles/2193541120-interface-designer-permissions)).
- Gating: Team, Business, Enterprise Scale (sources above).

### ClickUp
- Required custom fields (Business+; enforced at task creation only; built-in
  fields like due date can't be required)
  ([required fields](https://help.clickup.com/hc/en-us/articles/30407234676887-Make-Custom-Fields-required),
  [pricing](https://clickup.com/pricing)).
- Statuses cascade from Space to Folder/List and only admins or the Space owner
  edit them ([Space settings](https://help.clickup.com/hc/en-us/articles/33777837994775-Space-Folder-and-List-settings));
  custom task types are edited by owners/admins
  ([custom task types](https://help.clickup.com/hc/en-us/articles/17564381376919-Custom-task-types)).
- Custom roles: one on Business Plus, unlimited on Enterprise
  ([custom role permissions](https://help.clickup.com/hc/en-us/articles/6309195687959-Manage-Custom-Role-permissions)).
- The pricing page showed two price sets when fetched; tier names may be in flux.

### Fibery
- Access levels per space, database and entity, plus custom access templates
  (e.g. "see only what you created") — sourced from community threads
  **[experience]** ([community](https://community.fibery.io/t/permissions-in-fibery-are-hard-to-understand/6723)).
- Required fields shipped Feb 2025, enforced at creation via the Quick Add
  popover per the Fibery team
  ([thread](https://community.fibery.io/t/required-fields-on-the-layout/2011)).
  Validation rules beyond that were still a request.
- Official guide pages weren't reachable for this research; treat as lower
  confidence.

### Confluence
- Free plan: "Permissions aren't customizable"; Standard adds global, space and
  content permissions; Premium adds an admin key to bypass restrictions and
  bulk archiving ([plans](https://support.atlassian.com/confluence-cloud/docs/learn-about-confluence-cloud-plans/)).
- Space admins create/promote space templates
  ([promote a template](https://support.atlassian.com/confluence-cloud/docs/promote-a-template/)).
- Content statuses: space admins enable them, define up to five, and can
  prevent people from adding new ones
  ([content status](https://support.atlassian.com/confluence-cloud/docs/add-a-status-to-your-page-or-blog/)) —
  a small, admin-curated vocabulary.

### Guru, Slite, Tettra (verification-first knowledge bases)
- **Guru:** one verifier per card (person or group), intervals 30 days–1 year or
  "Does not expire" (the default since Jan 2026); unverified cards stay
  searchable; AI Knowledge Agents review content daily and can auto-verify
  ([verification](https://help.getguru.com/docs/verifying-and-unverifying-cards)).
  Only collection owners create templates; templates can't be enforced
  ([card templates](https://help.getguru.com/docs/using-card-templates)).
- **Slite:** doc verification workflow and knowledge-management panel from the
  lowest paid plan ([pricing](https://slite.com/pricing)).
- **Tettra:** pages have owners; reports for unowned (owner deactivated) and
  stale pages; verification on Scaling/Professional only
  ([KM dashboard](https://support.tettra.com/collaborating-on-pages/about-the-knowledge-management-dashboard)).

### Outline
- Collection access View / View+Edit / Admin; admins can stop members creating
  collections ([collections](https://docs.getoutline.com/s/guide/doc/collections-l9o3LD22sV)).
  Templates live in a collection or workspace; no enforcement documented
  ([templates](https://docs.getoutline.com/s/guide/doc/templates-GP6DXgRtxl)).

### Anytype, Tana, Logseq, Capacities, AFFiNE (typed-object / PKM tools)
- **Anytype:** roles Viewer/Editor/Admin/Owner; no per-object permissions —
  everyone in a space sees everything
  ([collaboration](https://doc.anytype.io/anytype/collaborate/collaboration)).
  Types bundle properties, views and templates; a space sets the default type
  ([types](https://doc.anytype.io/anytype/organize/types)). The docs now say
  "channel" in places, suggesting a rename.
- **Tana:** shared-workspace members "can do everything you can do", including
  removing members ([workspaces](https://outliner.tana.inc/learn/features/workspaces)).
  "Required" fields: "The warning is visual only and has no consequence"
  ([fields](https://outliner.tana.inc/learn/features/fields)).
- **Logseq:** DB version is in beta (2.0.1 July 2026, 2.0.2 Oct 2026)
  ([releases](https://github.com/logseq/logseq/releases)). Tags-as-classes with
  typed properties and paid, invite-only real-time collaboration are reported
  only by a secondary source ([Kompozy](https://kompozy.io/news/logseq-2-0-db-version-beta)) — unverified.
- **Capacities:** no collaboration, "none is planned"
  ([facts](https://capacities.io/about/facts)).
- **AFFiNE:** page-info properties "are always global" across the workspace
  ([doc info](https://docs.affine.pro/core-concepts/elements-of-affine/doc-info));
  free cloud tier capped at 3 members; "multiple admin roles" only on Team
  ([pricing](https://affine.pro/pricing)).

### AppFlowy, Craft, Nuclino
- **AppFlowy:** space-level permissions, member groups, restricted spaces with
  page-level exceptions (blog dated 2026-09-03)
  ([update](https://appflowy.com/blog/appflowy-updates-space-permissions-member-groups-database-rollups-and-more)).
- **Craft:** space roles Owner and Member only; no folder sharing per the help
  centre ([team collaboration](https://support.craft.do/hc/en-us/articles/15282983024540-Adding-Members-To-Your-Team-and-Space)).
- **Nuclino:** Full / Comment-only / Read-only workspace roles; only full access
  creates templates ([roles](https://help.nuclino.com/fed9f070-roles-and-permissions)).

### Opinionated group tools (clubs, associations, volunteers)
- **Basecamp:** each project picks from a fixed tool set
  ([features](https://basecamp.com/features)); tools can be renamed per project,
  admins set default names in Adminland, projects can be saved as templates
  ([templates](https://3.basecamp-help.com/article/66-templates)).
- **Loomio:** admins curate discussion/poll templates (preset title, context,
  invitees, suggested polls), can hide them, and can let members create them —
  advising to "agree on naming and review practices before enabling"
  ([discussion templates](https://www.loomio.com/docs/en/user_manual/discussions/templates)).
- **Spond:** admin roles composed of Manage / Privacy / Publish permissions;
  roles can't be limited to one subgroup
  ([group roles](https://help.spond.com/club/en/articles/197487-group-roles),
  [departments & groups](https://help.spond.com/club/en/articles/183008-departments-and-groups)).
- **Engelsystem:** fixed model for helpers, teams, shifts, attendance, with a
  full change log ([engelsystem.de](https://engelsystem.de/),
  [repo](https://github.com/engelsystem/engelsystem)).

## Cross-tool patterns

1. **Builder/user split.** The most common way to align a team without
   removing freedom: a small group may change the structure, everyone else
   may only fill it in (Notion "Can edit content", Airtable Creator vs.
   interface-only, Coda Doc Maker vs. Editor, ClickUp admin-only statuses).
2. **Shared schema as the convention.** Typed properties/types that apply
   everywhere (Obsidian vault-wide property types, AFFiNE global properties,
   Anytype/Tana/Logseq types) make one convention the default without a rule.
3. **Small admin-curated vocabularies.** Confluence's max-5 content statuses,
   ClickUp's cascading statuses, Loomio's curated templates.
4. **Ownership + expiry instead of control.** Guru, Slite, Tettra, Notion
   verification: content has a named owner and decays; reports surface
   unowned/stale items. This handles drift over time rather than up front.
5. **Locks are speed bumps.** Notion and Coda locks can be lifted by editors (or
   via API in Coda); vendors say themselves these prevent accidents, not
   intent.
6. **Enforcement at creation only.** Required fields in ClickUp and Fibery fire
   on create; Tana's are advisory; Notion only in forms.
7. **Fixed models align by subtraction.** Basecamp, Spond, Engelsystem: few
   choices, limited customisation (toggle, rename, template).

## Gaps [analysis]

- **Paywall mismatch.** Hard guardrails sit at Business/Enterprise in Notion,
  ClickUp, Airtable (Team+), Coda (Team+), Confluence (Standard+, Premium for
  admin key). Volunteer groups on free tiers get the most freedom and the
  fewest guardrails.
- **No continuous convention check.** No tool reports where the workspace
  deviates from its own conventions (empty "required" fields after creation,
  near-duplicate tags/properties, items outside the agreed structure). Only
  per-note formatting linters exist (Obsidian community plugin).
- **Verification is for documents, not responsibilities.** Ownership/expiry
  exists for knowledge pages, but no tool surfaces when a *task's*
  responsibility silently changed hands or went unowned — directly relevant to
  organice's "silent handoff" problem.
- **Conventions aren't explained in context.** Templates and locks constrain,
  but none attach the *why* or show a less structured person the next expected
  step; Loomio's advice to agree on naming is a doc note, not a feature.
- **Guardrails are all-or-nothing per role**, not graduated by how structured a
  person is (e.g. guided input for helpers, full freedom for the core team
  beyond role permissions).
- **Cross-tool scatter isn't addressed.** Every tool assumes it is the single
  place; none help a group that already lives across notes apps, drives and
  chats.

## Sources

- Notion: [sharing & permissions](https://www.notion.com/help/sharing-and-permissions) · [intro to databases](https://www.notion.com/help/intro-to-databases) · [property access](https://www.notion.com/help/database-property-access) · [wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages) · [teamspaces](https://www.notion.com/help/intro-to-teamspaces) · [database templates](https://www.notion.com/help/database-templates) · [forms](https://www.notion.com/help/forms) · [pricing](https://www.notion.com/pricing)
- Obsidian: [Sync collaborate](https://obsidian.md/help/sync/collaborate) · [properties](https://obsidian.md/help/properties) · [publish](https://obsidian.md/help/publish) · [Linter plugin](https://github.com/platers/obsidian-linter)
- Coda: [locking guide](https://coda.io/resources/guides/locking-in-coda) · [Doc Makers](https://help.coda.io/hc/en-us/articles/39555943452685-Manage-Doc-Makers-in-your-workspace)
- Airtable: [field & table permissions](https://support.airtable.com/articles/2296468758-airtable-field-and-table-editing-permissions) · [Interface Designer permissions](https://support.airtable.com/articles/2193541120-interface-designer-permissions)
- ClickUp: [required fields](https://help.clickup.com/hc/en-us/articles/30407234676887-Make-Custom-Fields-required) · [Space settings](https://help.clickup.com/hc/en-us/articles/33777837994775-Space-Folder-and-List-settings) · [custom task types](https://help.clickup.com/hc/en-us/articles/17564381376919-Custom-task-types) · [custom roles](https://help.clickup.com/hc/en-us/articles/6309195687959-Manage-Custom-Role-permissions) · [pricing](https://clickup.com/pricing)
- Fibery: [required fields thread](https://community.fibery.io/t/required-fields-on-the-layout/2011) · [permissions thread](https://community.fibery.io/t/permissions-in-fibery-are-hard-to-understand/6723)
- Confluence: [plans](https://support.atlassian.com/confluence-cloud/docs/learn-about-confluence-cloud-plans/) · [promote a template](https://support.atlassian.com/confluence-cloud/docs/promote-a-template/) · [content status](https://support.atlassian.com/confluence-cloud/docs/add-a-status-to-your-page-or-blog/)
- Guru: [verification](https://help.getguru.com/docs/verifying-and-unverifying-cards) · [card templates](https://help.getguru.com/docs/using-card-templates)
- Slite: [pricing](https://slite.com/pricing) · Tettra: [KM dashboard](https://support.tettra.com/collaborating-on-pages/about-the-knowledge-management-dashboard)
- Outline: [collections](https://docs.getoutline.com/s/guide/doc/collections-l9o3LD22sV) · [templates](https://docs.getoutline.com/s/guide/doc/templates-GP6DXgRtxl)
- Anytype: [collaboration](https://doc.anytype.io/anytype/collaborate/collaboration) · [types](https://doc.anytype.io/anytype/organize/types)
- Tana: [workspaces](https://outliner.tana.inc/learn/features/workspaces) · [fields](https://outliner.tana.inc/learn/features/fields)
- Logseq: [GitHub releases](https://github.com/logseq/logseq/releases) · [Kompozy (secondary)](https://kompozy.io/news/logseq-2-0-db-version-beta)
- Capacities: [facts](https://capacities.io/about/facts) · AFFiNE: [doc info](https://docs.affine.pro/core-concepts/elements-of-affine/doc-info) · [pricing](https://affine.pro/pricing)
- AppFlowy: [space permissions update](https://appflowy.com/blog/appflowy-updates-space-permissions-member-groups-database-rollups-and-more) · Craft: [team collaboration](https://support.craft.do/hc/en-us/articles/15282983024540-Adding-Members-To-Your-Team-and-Space) · Nuclino: [roles](https://help.nuclino.com/fed9f070-roles-and-permissions)
- Basecamp: [features](https://basecamp.com/features) · [templates](https://3.basecamp-help.com/article/66-templates) · Loomio: [discussion templates](https://www.loomio.com/docs/en/user_manual/discussions/templates) · Spond: [group roles](https://help.spond.com/club/en/articles/197487-group-roles) · [departments & groups](https://help.spond.com/club/en/articles/183008-departments-and-groups) · Engelsystem: [site](https://engelsystem.de/) · [repo](https://github.com/engelsystem/engelsystem)
