# Quick Reference Guide

## useRef Hook

### Basic Syntax
```typescript
const myRef = useRef<HTMLButtonElement>(null);
```

### Usage in JSX
```tsx
<button ref={myRef}>Click me</button>
```

### Accessing the Element
```typescript
const element = myRef.current; // HTMLButtonElement | null
const rect = myRef.current?.getBoundingClientRect();
```

### Key Points
- ✅ Persists across re-renders
- ✅ Doesn't trigger re-renders when updated
- ✅ Perfect for DOM element references
- ❌ Don't use for state that affects UI

---

## Filtering Implementation

### Filter Function
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

### Usage
```typescript
const filteredAppointments = getFilteredAppointments();
```

---

## Sorting Implementation

### Sort Function
```typescript
const getSortedAppointments = (appointmentsToSort) => {
  const sorted = [...appointmentsToSort]; // Create copy!
  
  switch (selectedSort) {
    case "patient-name-asc":
      return sorted.sort((a, b) => 
        a.patientName.localeCompare(b.patientName)
      );
    case "patient-name-desc":
      return sorted.sort((a, b) => 
        b.patientName.localeCompare(a.patientName)
      );
    // ... more cases
    default:
      return sorted;
  }
};
```

### Usage
```typescript
const displayedAppointments = getSortedAppointments(filteredAppointments);
```

---

## Empty State

### Conditional Rendering
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

---

## Pagination Count

### Dynamic Count Display
```tsx
<span>
  1 - {Math.min(20, displayedAppointments.length)}{" "}
  <span>of</span>{" "}
  {displayedAppointments.length}
</span>
```

---

## Data Flow Summary

```
appointments (raw data)
    ↓
getFilteredAppointments() → filteredAppointments
    ↓
getSortedAppointments() → displayedAppointments
    ↓
Render in table
```

---

## Common Patterns

### Array Methods Cheat Sheet

```typescript
// Filter - Select items
const filtered = array.filter(item => item.age > 18);

// Map - Transform items
const names = array.map(item => item.name);

// Sort - Reorder items (MUTATES!)
const sorted = [...array].sort((a, b) => a.age - b.age);

// Find - Get first match
const found = array.find(item => item.id === 5);

// Some - Check if any match
const hasAdults = array.some(item => item.age > 18);

// Every - Check if all match
const allAdults = array.every(item => item.age > 18);
```

### String Comparison

```typescript
// Alphabetical sort (A-Z)
array.sort((a, b) => a.name.localeCompare(b.name));

// Reverse alphabetical (Z-A)
array.sort((a, b) => b.name.localeCompare(a.name));

// Case-insensitive
array.sort((a, b) => 
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
);
```

### Number Comparison

```typescript
// Ascending (1, 2, 3...)
array.sort((a, b) => a.age - b.age);

// Descending (3, 2, 1...)
array.sort((a, b) => b.age - a.age);
```

---

## Debugging Tips

### Check Filter Results
```typescript
console.log('Filtered:', filteredAppointments.length);
console.log('Selected clinic:', selectedClinic);
```

### Check Sort Results
```typescript
console.log('First item:', displayedAppointments[0]?.patientName);
console.log('Last item:', displayedAppointments[displayedAppointments.length - 1]?.patientName);
```

### Check Ref Value
```typescript
console.log('Button ref:', clinicButtonRef.current);
console.log('Button position:', clinicButtonRef.current?.getBoundingClientRect());
```

---

## Performance Tips

### Memoization (Future Enhancement)
```typescript
import { useMemo } from 'react';

const displayedAppointments = useMemo(() => {
  const filtered = getFilteredAppointments();
  return getSortedAppointments(filtered);
}, [selectedClinic, selectedSort]);
```

This prevents recalculating on every render!

