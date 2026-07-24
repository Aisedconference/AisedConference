# Academic Participant Dropdown Design

## Goal

Make the academic participant category explicit at the start of the registration form and ensure the displayed and submitted fee always matches the selected category.

## Form Design

For the `Academics / Students / Postgraduate Students` participant route, render a required dropdown immediately above the existing `Title` field.

Label: `Participant category`

Options:

- `Please select`
- `Academician / Educator / Lecturer — RM700`
- `Student / Postgraduate Student — RM500`

The dropdown is part of the form's primary rendering logic. It must not be inserted or repositioned by a separate inline script.

## Pricing Behaviour

- Selecting `Academician / Educator / Lecturer` sets the visible payable amount to `RM700`.
- Selecting `Student / Postgraduate Student` sets the visible payable amount to `RM500`.
- Before a selection, the visible payable amount is `RM0`.
- The hidden `estimated_payable_amount` and `estimated_fee_breakdown` fields update from the same fee mapping used by the visible total.
- Existing HRD Corp Claimable, General Admission, and Government Agencies prices remain unchanged.

## Cleanup

Remove the remaining academic-participant inline form workaround from `registration.html`. The main registration renderer and calculator in `app.js` will be the single source of truth.

## Verification

- Add a regression test for dropdown placement, exact option labels, and the RM700/RM500 mapping.
- Verify JavaScript syntax.
- Exercise both dropdown selections in a browser and confirm the visible and hidden submitted amounts.
- Run the complete existing test suite and report any unrelated pre-existing failure separately.
