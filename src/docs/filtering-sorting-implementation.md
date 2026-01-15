# Filtering and Sorting Implementation Guide

## Overview
This document explains how the filtering and sorting functionality works in the AppointmentsTable component.

## Architecture

### Data Flow
```
Raw Data (appointments)
    ↓
Filter by Clinic (getFilteredAppointments)
    ↓
Sort by Criteria (getSortedAppointments)
    ↓
Display in Table (displayedAppointments)
```

## Implementation Details

### 1. Filtering by Clinic

```typescript
const getFilteredAppointments = () => {
  if (selectedClinic === "All clinics") {
    return appointments;
  }
  return appointments.filter(
    (appointment) => appointment.clinic === selectedClinic
  );
};
```

**How it works:**
- If "All clinics" is selected, return all appointments
- Otherwise, filter appointments where `clinic` matches `selectedClinic`
- Uses JavaScript's `filter()` method to create a new array

**Example:**
- User selects "Neurology"
- Only appointments with `clinic: "Neurology"` are shown
- Other appointments are hidden

### 2. Sorting Appointments

```typescript
const getSortedAppointments = (appointmentsToSort) => {
  const sorted = [...appointmentsToSort]; // Create a copy
  
  switch (selectedSort) {
    case "patient-name-asc":
      return sorted.sort((a, b) => a.patientName.localeCompare(b.patientName));
    // ... other cases
  }
};
```

**How it works:**
- Takes the filtered appointments as input
- Creates a copy using spread operator `[...]` to avoid mutating original
- Uses `switch` statement to handle different sort criteria
- Returns the sorted array

**Sort Options:**

1. **Patient Name A-Z**: `localeCompare()` for alphabetical sorting
2. **Patient Name Z-A**: Reverse alphabetical (b compared to a)
3. **Patient ID Ascending**: Sorts IDs in ascending order
4. **Patient ID Descending**: Sorts IDs in descending order
5. **Gender Male**: Filters to show only male patients
6. **Gender Female**: Filters to show only female patients

### 3. Combining Filter and Sort

```typescript
const filteredAppointments = getFilteredAppointments();
const displayedAppointments = getSortedAppointments(filteredAppointments);
```

**Order matters!**
1. First, filter by clinic
2. Then, sort the filtered results

**Example:**
- User selects "Neurology" clinic
- User selects "Patient name: A-Z" sort
- Result: Only Neurology appointments, sorted alphabetically

### 4. Empty State Handling

```tsx
{displayedAppointments.length === 0 ? (
  <tr>
    <td colSpan={8} className="px-4 py-16 text-center">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="text-6xl opacity-20">📋</div>
        <p className="text-lg font-semibold text-gray-600">
          No appointments found
        </p>
        <p className="text-sm text-gray-500">
          {selectedClinic !== "All clinics"
            ? `No appointments for ${selectedClinic}`
            : "Try adjusting your filters"}
        </p>
      </div>
    </td>
  </tr>
) : (
  // Display appointments
)}
```

**Features:**
- Shows when `displayedAppointments.length === 0`
- Uses `colSpan={8}` to span all table columns
- Displays different messages based on filter state
- Maintains table structure (header stays visible)

### 5. Pagination Count Update

```tsx
<span className="text-[#677597] text-base font-medium">
  1 - {Math.min(20, displayedAppointments.length)}{" "}
  <span className="text-[#051438] mx-2">of</span>{" "}
  {displayedAppointments.length}
</span>
```

**How it works:**
- Shows "1 - X of Y" where:
  - X = minimum of 20 or total appointments (for pagination)
  - Y = total filtered/sorted appointments
- Updates automatically when filters/sorts change

## Key Concepts

### Why Create Copies?

```typescript
const sorted = [...appointmentsToSort];
```

**Reason:** JavaScript's `sort()` mutates the original array
- Without copy: Would modify the original `appointments` data
- With copy: Original data stays intact, only the copy is sorted

### localeCompare() Method

```typescript
a.patientName.localeCompare(b.patientName)
```

**What it does:**
- Compares strings in a locale-aware manner
- Returns: -1 (a before b), 0 (equal), 1 (a after b)
- Handles special characters and accents correctly

**Example:**
```javascript
"Alice".localeCompare("Bob")  // -1 (Alice comes first)
"Bob".localeCompare("Alice")  // 1 (Bob comes after)
```

### Filter vs Map vs Sort

| Method | Purpose | Returns | Mutates? |
|--------|---------|---------|----------|
| `filter()` | Select items | New array (subset) | ❌ No |
| `map()` | Transform items | New array (same length) | ❌ No |
| `sort()` | Reorder items | Same array | ✅ Yes |

## Testing the Implementation

### Test Case 1: Filter Only
1. Select "Neurology" from clinic dropdown
2. Expected: Only Neurology appointments shown
3. Pagination updates to show correct count

### Test Case 2: Sort Only
1. Select "Patient name: A-Z" from sort dropdown
2. Expected: All appointments sorted alphabetically
3. First patient name starts with A, last with Z

### Test Case 3: Filter + Sort
1. Select "Neurology" clinic
2. Select "Patient name: Z-A" sort
3. Expected: Only Neurology appointments, sorted Z to A

### Test Case 4: Empty State
1. Select a clinic with no appointments
2. Expected: Empty state message appears
3. Table header remains visible

### Test Case 5: Gender Filter
1. Select "Gender: Male" from sort dropdown
2. Expected: Only male patients shown
3. Note: This is actually a filter, not a sort!

## Common Issues and Solutions

### Issue: Sorting doesn't work
**Solution:** Make sure to create a copy before sorting
```typescript
const sorted = [...appointmentsToSort]; // ✅ Correct
const sorted = appointmentsToSort;      // ❌ Wrong
```

### Issue: Filter and sort conflict
**Solution:** Always filter first, then sort
```typescript
const filtered = getFilteredAppointments();
const sorted = getSortedAppointments(filtered); // ✅ Correct order
```

### Issue: Empty state not showing
**Solution:** Check the condition
```typescript
{displayedAppointments.length === 0 ? ... } // ✅ Correct
{!displayedAppointments ? ... }              // ❌ Wrong
```

## Future Enhancements

Potential improvements:
1. **Pagination**: Implement actual page navigation
2. **Multi-sort**: Sort by multiple criteria (e.g., clinic then name)
3. **Search**: Add text search for patient names/IDs
4. **Persist filters**: Save filter state to localStorage
5. **Reset filters**: Add a "Clear all filters" button

