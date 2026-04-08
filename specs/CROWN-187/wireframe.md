# CROWN-187 Wireframe Spec

## Surface

- Feature: Dashboard notification defaults and toast enhancement
- Primary user: Platform operator working inside the web2 dashboard shell
- Core task: Understand transient system feedback without losing place, then recover missed messages from a durable notification log
- Approved layout pattern: Standard Admin Page support surface with fixed toast viewport plus an in-flow notification log panel

## Layout Structure

### Toast viewport

- Fixed overlay surface
- Default placement: `top-right`
- Supported placements: `top-left`, `top-middle`, `top-right`, `bottom-left`, `bottom-middle`, `bottom-right`
- Maximum visible toasts: `4`
- Stacking direction: newest first
- Remaining toasts queue until a visible toast exits

### Notification log panel

- In-flow or modal/panel companion surface reachable from the shell
- Title: `Notifications`
- Header actions:
  - Primary: open the full notification center or management surface
  - Secondary: optional maintenance action such as clearing dismissed items
- Sections:
  - Needs attention
  - Recent activity
  - Timestamp and status metadata
  - Aggregated count for repeated events
  - Optional follow-up action link when durable recovery is needed

## Action Hierarchy

- Primary action: contextual action inside the notification when a user can immediately recover or inspect details
- Secondary action: dismiss notification
- Tertiary action: open notification log/panel to review recent events
- Destructive actions are prohibited inside transient success/info toasts

## Required States

### Success

- Auto-dismiss after `5-8` seconds
- Show lifetime progress indicator
- Pause countdown on hover
- If interactive controls are present, prefer persistent behavior instead of short auto-dismiss

### Info

- Same behavior as success
- Used for advisory or informational feedback only

### Warning

- Prefer persistent banner/message-bar treatment when the condition is ongoing
- Toast is allowed only for advisory warnings and should default to persistent dismissal

### Error

- Must not rely on toast-only delivery
- Require durable recovery path and explicit next step messaging
- Toast may exist only as a secondary cue and should be persistent

### Progress / system task

- Persistent while work is in progress
- Use loading affordance instead of countdown
- On completion, update to success/info and auto-dismiss
- Optional `View details` action when result review is useful

### Empty

- Notification log panel shows a clear empty state with supporting copy

## Accessibility Behavior

- Ordinary toasts must not move keyboard focus
- Toast container uses a polite live region for non-error announcements
- Error and warning variants use assertive semantics only when interruption is necessary
- Dismiss and action controls must remain reachable through normal tab order
- Notification log/panel provides a durable recovery path for missed messages
- Close and action controls require visible focus styling
- Active warning and error rows must make the next step explicit without requiring a separate click to infer what to do

## Responsive Behavior

- Desktop: viewport anchored to selected edge with width capped to a readable card
- Tablet: same placements with tighter horizontal offsets
- Mobile: toast width compresses to available viewport width while maintaining readable action controls
- Notification log panel should collapse into a full-width drawer/dialog on narrow screens

## Component Reuse

- Reuse existing `apps/web2/components/ui/button.tsx` for inline toast and panel actions
- Reuse existing `apps/web2/components/ui/card.tsx` for the durable notification log surface
- Reuse existing `apps/web2/components/ui/dialog.tsx` when a modal/drawer presentation is needed for the log on smaller screens
- Build a new reusable notification-center primitive in `apps/web2/components/ui/` on top of shadcn `sonner`
- Support category-level metadata and iconography for at least billing, exports, access, sync, and system notifications

## Design Tokens

- Base surface: `bg-card`, `text-card-foreground`, `border-border`
- Secondary text: `text-muted-foreground`
- Interactive emphasis: `bg-primary`, `text-primary-foreground`
- Soft emphasis and neutral bars: `bg-accent`, `bg-muted`
- Error/destructive cues: `bg-destructive`, `text-destructive-foreground`
- Do not introduce raw hex values; use semantic Tailwind token mappings backed by `apps/web2/app/globals.css`
