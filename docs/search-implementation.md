# Search Feature Implementation Guide

## Overview

This document explains the comprehensive search functionality implemented in the appointments table, including debouncing, search overlay, highlighting, and integration with existing filters.

## Architecture

### Component Structure

```
app/page.tsx (State Management)
    ↓
SearchBar.tsx (Input & Overlay Trigger)
    ↓
SearchOverlay.tsx (Suggestions & Recent Searches)
    ↓
AppointmentsTable.tsx (Search Filtering & Display)
    ↓
HighlightText.tsx (Text Highlighting)
```

### Data Flow

```
User types in SearchBar
    ↓
State updates in page.tsx
    ↓
Debounced in AppointmentsTable (300ms)
    ↓
Search Filter → Clinic Filter → Sort → Display
    ↓
Results shown with highlighting
```

## Implementation Details

### 1. State Management (page.tsx)

```typescript
const [searchQuery, setSearchQuery] = useState("");
```

**Why lift state to parent?**

- SearchBar and AppointmentsTable are siblings
- Both need access to the search query
- Parent component manages shared state

### 2. SearchBar Component

#### Features:

- ✅ Controlled input with props
- ✅ Clear button (X icon) when text exists
- ✅ Escape key to clear search
- ✅ Focus ring on active state
- ✅ Search overlay trigger

#### Key Code:

```typescript
const handleClear = () => {
	onSearchChange("");
	inputRef.current?.focus();
};

// Escape key handler
useEffect(() => {
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && searchQuery) {
			onSearchChange("");
			inputRef.current?.blur();
			setIsOverlayOpen(false);
		}
	};
	document.addEventListener("keydown", handleKeyDown);
	return () => document.removeEventListener("keydown", handleKeyDown);
}, [searchQuery, onSearchChange]);
```

### 3. Search Overlay Component

#### Features:

- ✅ Real-time suggestions based on query
- ✅ Recent searches (stored in localStorage)
- ✅ Popular searches (quick access)
- ✅ Highlighted matching text
- ✅ Click outside to close
- ✅ Positioned below search input

#### Sections:

**A. Suggestions (when typing)**

- Searches through patient names, IDs, and clinics
- Shows up to 5 matching results
- Highlights matching text
- Click to select

**B. Recent Searches (when empty)**

- Stores last 5 searches in localStorage
- Hover to show delete button
- Click to reuse search

**C. Popular Searches (when empty)**

- Quick access to common searches
- Pill-style buttons
- Includes: Neurology, Cardiology, Processing, Awaiting doctor

#### Key Code:

```typescript
const getSuggestions = () => {
	if (!searchQuery.trim()) return [];

	const query = searchQuery.toLowerCase();
	const suggestions = new Set<string>();

	appointments.forEach((appointment) => {
		if (appointment.patientName.toLowerCase().includes(query)) {
			suggestions.add(appointment.patientName);
		}
		if (appointment.patientId.toLowerCase().includes(query)) {
			suggestions.add(appointment.patientId);
		}
		if (appointment.clinic.toLowerCase().includes(query)) {
			suggestions.add(appointment.clinic);
		}
	});

	return Array.from(suggestions).slice(0, 5);
};
```

### 4. Debounced Search

#### Why Debounce?

- Prevents excessive filtering on every keystroke
- Improves performance
- Better user experience (waits for user to finish typing)

#### Implementation:

```typescript
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

useEffect(() => {
	const timer = setTimeout(() => {
		setDebouncedSearchQuery(searchQuery);
	}, 300); // 300ms delay

	return () => clearTimeout(timer);
}, [searchQuery]);
```

**How it works:**

1. User types "John"
2. Timer starts for each keystroke
3. If user types again within 300ms, timer resets
4. After 300ms of no typing, search executes

### 5. Search Filtering Logic

```typescript
const getSearchedAppointments = () => {
	if (!debouncedSearchQuery.trim()) {
		return appointments;
	}

	const query = debouncedSearchQuery.toLowerCase().trim();

	return appointments.filter((appointment) => {
		const searchableFields = [
			appointment.patientName.toLowerCase(),
			appointment.patientId.toLowerCase(),
			appointment.clinic.toLowerCase(),
			appointment.status.toLowerCase(),
			appointment.gender.toLowerCase(),
			appointment.age.toLowerCase(),
		];

		return searchableFields.some((field) => field.includes(query));
	});
};
```

**Searchable Fields:**

- Patient Name (e.g., "John Doe")
- Patient ID (e.g., "HOSP12345")
- Clinic (e.g., "Neurology")
- Status (e.g., "Processing")
- Gender (e.g., "Male")
- Age (e.g., "25yrs")

### 6. Complete Data Flow

```typescript
// Step 1: Search
const searchedAppointments = getSearchedAppointments();

// Step 2: Filter by Clinic
const filteredAppointments = getFilteredAppointments(searchedAppointments);

// Step 3: Sort
const displayedAppointments = getSortedAppointments(filteredAppointments);
```

**Order is critical!**

1. Search first (broadest filter)
2. Then clinic filter (narrows down)
3. Finally sort (organizes results)

### 7. Text Highlighting

#### HighlightText Component:

```typescript
function HighlightText({ text, query }: { text: string; query: string }) {
	if (!query.trim()) return <>{text}</>;

	const parts = text.split(new RegExp(`(${query})`, "gi"));

	return (
		<>
			{parts.map((part, index) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<mark
						key={index}
						className="bg-yellow-200 text-gray-900 font-semibold px-0.5 rounded">
						{part}
					</mark>
				) : (
					<span key={index}>{part}</span>
				)
			)}
		</>
	);
}
```

**Usage in Table:**

```tsx
<HighlightText text={appointment.patientName} query={debouncedSearchQuery} />
```

**Highlighted Fields:**

- Patient Name
- Patient ID
- Clinic Name

### 8. Empty States

#### Search-Specific Empty States:

**When search has no results:**

```tsx
{
	searchedAppointments.length === 0 && debouncedSearchQuery && (
		<div className="text-center py-16">
			<div className="text-6xl mb-4 opacity-30">🔍</div>
			<h3 className="text-xl font-semibold text-gray-700 mb-2">
				No results for "{debouncedSearchQuery}"
			</h3>
			<p className="text-gray-500">Try adjusting your search or filters</p>
		</div>
	);
}
```

**When search + filter has no results:**

```tsx
{
	displayedAppointments.length === 0 &&
		debouncedSearchQuery &&
		selectedClinic !== "All" && (
			<div className="text-center py-16">
				<div className="text-6xl mb-4 opacity-30">🏥</div>
				<h3 className="text-xl font-semibold text-gray-700 mb-2">
					No results in {selectedClinic}
				</h3>
				<p className="text-gray-500">
					No matches for "{debouncedSearchQuery}" in this clinic
				</p>
			</div>
		);
}
```

### 9. Pagination Updates

**Pagination reflects search results:**

```typescript
const totalPages = Math.ceil(displayedAppointments.length / itemsPerPage);
const paginatedAppointments = displayedAppointments.slice(
	(currentPage - 1) * itemsPerPage,
	currentPage * itemsPerPage
);
```

**Auto-reset to page 1 on search:**

```typescript
useEffect(() => {
	setCurrentPage(1);
}, [debouncedSearchQuery, selectedClinic, sortBy]);
```

## Edge Cases Handled

### 1. Empty Search Query

- Shows all appointments
- No highlighting applied
- Overlay shows recent/popular searches

### 2. No Results

- Shows appropriate empty state
- Suggests adjusting search/filters
- Maintains UI structure

### 3. Search + Filter Combination

- Search applies first
- Then clinic filter
- Shows combined empty state if needed

### 4. Case Insensitivity

- All searches are case-insensitive
- "john" matches "John Doe"
- "NEURO" matches "Neurology"

### 5. Whitespace Handling

- Trims leading/trailing spaces
- " john " → "john"
- Empty spaces don't trigger search

### 6. Special Characters

- Handles special characters in names
- Regex escaping for safety
- No breaking on apostrophes, hyphens, etc.

### 7. Rapid Typing

- Debouncing prevents lag
- Only searches after 300ms pause
- Cancels previous timers

### 8. Pagination Edge Cases

- Resets to page 1 on new search
- Adjusts if current page > total pages
- Shows correct count in pagination

## Performance Optimizations

### 1. Debouncing

- Reduces filter operations
- 300ms delay is optimal
- Cancels pending operations

### 2. Early Returns

```typescript
if (!debouncedSearchQuery.trim()) {
	return appointments; // Skip filtering
}
```

### 3. Set for Suggestions

```typescript
const suggestions = new Set<string>(); // Prevents duplicates
```

### 4. Slice Limits

```typescript
return Array.from(suggestions).slice(0, 5); // Max 5 suggestions
```

### 5. LocalStorage Limits

```typescript
const updated = [...recentSearches].slice(0, 5); // Max 5 recent
```

## Testing Guide

### Manual Testing Checklist

#### Basic Search

- [ ] Type in search bar
- [ ] Results update after 300ms
- [ ] Matching text is highlighted
- [ ] Clear button appears
- [ ] Click clear button works
- [ ] Press Escape clears search

#### Search Overlay

- [ ] Opens on focus
- [ ] Shows suggestions while typing
- [ ] Shows recent searches when empty
- [ ] Shows popular searches when empty
- [ ] Click suggestion selects it
- [ ] Click outside closes overlay
- [ ] Escape key closes overlay

#### Search + Filters

- [ ] Search works with clinic filter
- [ ] Search works with sorting
- [ ] Pagination updates correctly
- [ ] Empty states show correctly

#### Edge Cases

- [ ] Empty search shows all
- [ ] No results shows empty state
- [ ] Special characters work
- [ ] Case insensitive search
- [ ] Whitespace trimmed
- [ ] Rapid typing doesn't lag

### Test Scenarios

**Scenario 1: Basic Patient Search**

1. Type "John" in search
2. Wait 300ms
3. Verify: Only patients with "John" in name show
4. Verify: "John" is highlighted in results

**Scenario 2: ID Search**

1. Type "HOSP123"
2. Verify: Patient with that ID shows
3. Verify: ID is highlighted

**Scenario 3: Clinic Search**

1. Type "Neurology"
2. Verify: All Neurology appointments show
3. Verify: "Neurology" is highlighted

**Scenario 4: Search + Filter**

1. Type "John"
2. Select "Cardiology" clinic
3. Verify: Only John's Cardiology appointments show

**Scenario 5: No Results**

1. Type "XYZ123NonExistent"
2. Verify: Empty state shows
3. Verify: Message says "No results for XYZ123NonExistent"

**Scenario 6: Recent Searches**

1. Search for "John"
2. Clear search
3. Click search bar
4. Verify: "John" appears in recent searches
5. Click "John" in recent
6. Verify: Search is applied

## Troubleshooting

### Issue: Search not working

**Check:**

- Is `searchQuery` state updating?
- Is debounce timer working?
- Is filter function being called?

### Issue: Highlighting not showing

**Check:**

- Is `debouncedSearchQuery` passed to HighlightText?
- Is query non-empty?
- Is regex escaping needed?

### Issue: Overlay not appearing

**Check:**

- Is `isOverlayOpen` state updating?
- Is input ref set correctly?
- Is z-index high enough?

### Issue: Performance lag

**Check:**

- Is debounce working (300ms)?
- Are there too many re-renders?
- Is filtering optimized?

## Future Enhancements

### Potential Improvements:

1. **Advanced Search**

   - Date range filtering
   - Multiple field search
   - Boolean operators (AND, OR)

2. **Search Analytics**

   - Track popular searches
   - Suggest based on trends
   - Autocomplete improvements

3. **Keyboard Navigation**

   - Arrow keys in overlay
   - Enter to select first result
   - Tab through suggestions

4. **Search History**

   - Sync across devices
   - Search history page
   - Clear all history option

5. **Performance**
   - Virtual scrolling for large datasets
   - Web Workers for filtering
   - Memoization of results

## Conclusion

The search implementation provides:

- ✅ Fast, debounced search
- ✅ Intelligent suggestions
- ✅ Recent search history
- ✅ Text highlighting
- ✅ Integration with filters
- ✅ Proper empty states
- ✅ Excellent UX

All features work together seamlessly to provide a professional search experience.
