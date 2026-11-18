# Worked Example

**Input (rough idea):** "Customers should be able to see where their order is."

---

## Track order delivery status

**Story points:** 5 *(proposed)*  
**Estimate rationale:** Touches the order UI and API, requires a defined status model, and depends on how delivery updates are recorded.

### Story

```gherkin
Feature: Track order delivery status
  As a returning customer
  I want to see the current delivery status of each of my orders
  So that I know when to expect my items without contacting support

  Background:
    Given I am signed in as a customer with at least one placed order

  Scenario: View status of an in-transit order
    Given my order "A-1001" has the status "Shipped"
    When I open the order details page for "A-1001"
    Then I see the status "Shipped"
    And I see the date the status last changed

  Scenario: View status history as a timeline
    Given my order "A-1001" moved from "Processing" to "Shipped"
    When I open the order details page for "A-1001"
    Then I see each status in chronological order
    And the current status is visually highlighted

  Scenario Outline: Status labels cover the full order lifecycle
    Given my order has the status "<status>"
    When I open the order details page
    Then I see the label "<label>"

    Examples:
      | status     | label                |
      | Processing | Preparing your order |
      | Shipped    | On its way           |
      | Delivered  | Delivered            |
      | Cancelled  | Cancelled            |

  Scenario: Order has no delivery updates yet
    Given my order "A-1002" was placed a moment ago with no delivery updates
    When I open the order details page for "A-1002"
    Then I see the status "Processing"
    And I do not see an error

  Scenario: Attempt to view another customer's order
    Given an order "B-2001" belongs to a different customer
    When I request the order details page for "B-2001"
    Then I am told the order cannot be found
    And no details of "B-2001" are shown
```

### Acceptance Criteria

- [ ] AC1: The order details page shows the current delivery status and the date it last changed. *(Scenario: View status of an in-transit order)*
- [ ] AC2: Status history is listed oldest to newest and the current status is visually distinguished. *(Scenario: View status history as a timeline)*
- [ ] AC3: Statuses Processing, Shipped, Delivered, and Cancelled each map to the labels shown in the Examples table. *(Scenario Outline: Status labels cover the full order lifecycle)*
- [ ] AC4: An order with no delivery updates defaults to "Processing" and shows no error. *(Scenario: Order has no delivery updates yet)*
- [ ] AC5: A customer can only view orders they own; other orders return "not found" without leaking details. *(Scenario: Attempt to view another customer's order)*
- [ ] AC6: The status section meets WCAG 2.1 AA: status is conveyed by text, not color alone.
- [ ] AC7: The order details API responds within 500 ms at p95 under normal load.
- Out of scope: push or email notifications, carrier tracking numbers, and estimated delivery dates.

### Risks and Dependencies

| Type | Item | Impact / Mitigation |
|------|------|---------------------|
| Risk | Delivery updates may be recorded inconsistently, producing out-of-order or missing history | Wrong timeline shown. Sort by timestamp and fall back to the latest known status. |
| Risk | Status values may grow later (for example "Returned") | Labels break. Centralize the status-to-label mapping so new values are a one-line change. |
| Dependency | Existing delivery data on the order API | Story is blocked if status and timestamps are not exposed. Confirm with the API owner before sprint planning. |
| Dependency | UX design for the timeline component | Needed before UI build. Reuse existing design-system components if no new design is available. |

### Assumptions

- Only the four statuses listed are in scope for this release.
- Customers are already authenticated, and the API can identify the order owner.
- Status history timestamps are already stored, or can be derived, per order.

### Open Questions

- [ ] Are partial shipments (one order, several deliveries) in scope? If yes, the estimate likely rises to 8. *(Owner: Product Owner)*
- [ ] Should "Cancelled" orders show the cancellation reason? *(Owner: Product Owner)*
- [ ] Which timezone should status dates display in: customer local or UTC? *(Owner: UX)*
