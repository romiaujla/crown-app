# Research: UI Super Admin Dashboard Key Metric Cards

## Decision 1: Reuse the existing protected dashboard overview request

- **Decision**: Keep `DashboardOverviewSection` as the single client-side request path for `/platform`.
- **Why**: The dashboard already fetches the protected overview payload successfully. Reusing that flow avoids duplicate loading and error state logic.
- **Alternatives considered**:
  - Add a second request for metric-card data: rejected because `CROWN-119` already extended the existing overview route.
  - Move the page to server-side fetching: rejected because the current protected-shell implementation and stored access-token flow are already client-oriented.

## Decision 2: Make the requested metric cards the first visual emphasis

- **Decision**: Render the total and trend cards before the supporting tenant-status breakdown.
- **Why**: Jira asks specifically for key metric cards. The dashboard should therefore foreground those metrics instead of leaving them buried behind the earlier status-focused layout.
- **Alternatives considered**:
  - Append the new cards beneath the existing status grid: rejected because it weakens the primary story outcome.
  - Replace the status breakdown entirely: rejected because `CROWN-93` already established that supporting context and it still adds value.

## Decision 3: Group windowed metrics by concept, not by raw API field name

- **Decision**: Present one card family for new-tenant counts and one card family for tenant growth rates, each with week/month/year sub-values.
- **Why**: This keeps the UI readable and understandable without exposing backend-oriented names such as `new_tenant_counts`.
- **Alternatives considered**:
  - Render six separate small cards for every window/value pair: rejected because it increases noise and reduces scanability.
  - Collapse the windows into one sentence: rejected because the dashboard needs clear at-a-glance comparison points.

## Decision 4: Preserve the `CROWN-119` metric semantics in the UI copy

- **Decision**: Label the windows as week, month, and year while describing them as trailing windows in supporting copy.
- **Why**: The API contract already defines the underlying semantics. The UI should explain them clearly without redefining the math.
- **Alternatives considered**:
  - Use calendar-specific labels such as "This month": rejected because that would misstate the contract.
  - Omit explanatory copy entirely: rejected because Jira requires the metric definitions to stay clear enough to avoid ambiguity.

## Decision 5: Format growth-rate values explicitly in the view layer

- **Decision**: Convert numeric growth rates into stable percentage labels in the web client while leaving the API response unchanged.
- **Why**: The dashboard needs readable card text, and formatting belongs in the presentation layer.
- **Alternatives considered**:
  - Reformat values in the API: rejected because `CROWN-119` already defines the response as numeric data.
  - Show raw numbers without a percent sign: rejected because it is less legible and more ambiguous for operators.
