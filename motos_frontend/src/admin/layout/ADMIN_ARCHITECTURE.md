# Admin Architecture Policy

## Roles and boundaries

### AdminPanel
- Owns shell concerns only:
  - current user session in memory
  - active section
  - mobile sidebar state
  - topbar profile save and logout
- Connects high-level wiring hooks and composers.
- Must not contain domain logic, payload builders, modal logic, or API orchestration.

### AdminSectionRouter
- Resolves and mounts admin pages through declarative registry.
- Accepts `activeSection` and `sectionPropsMap`.
- Must not build domain props inline.
- Must not call services or domain mutations directly.

### AdminModalHost
- Mounts admin modals through declarative registry.
- Accepts `modalPropsMap`.
- Must not own modal state, entity transformations, or side effects.

### Domain hooks (`motos`, `productos`, `usuarios`, `mantenciones`, `configuracion`)
- Own domain state and side effects.
- Own domain API calls.
- Expose explicit input/output contracts for UI composition.
- Must not import each other directly.

### Wiring hooks (`layout/hooks/*`)
- Compose domain hooks and shared hooks.
- Keep cross-domain coordination explicit and minimal.
- Allowed bridge points:
  - `useAdminCatalogBridge` for moto/product meta synchronization
  - `useAdminEntityActions` for entity modal dispatch by section
- Must not leak internal setters between unrelated domains.

## Growth rules

1. New page section:
   - Add props in `useAdminSectionProps`.
   - Register component in `AdminSectionRouter` registry.
   - Avoid conditionals spread across files.

2. New modal:
   - Add props in `useAdminModalProps`.
   - Register modal in `AdminModalHost` registry.
   - Keep open/close/saving/error state in domain/shared hooks, never in host.

3. Cross-domain data sharing:
   - Prefer bridge hooks with explicit contracts.
   - Never pass raw state setters from one domain to another domain hook.

4. Complexity limits:
   - If a wiring hook exceeds one responsibility, split it.
   - If router/host gains repeated branching, move to registries/config.
