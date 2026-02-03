## Smart Parking Lot System - Code Walkthrough

This document provides a detailed explanation of the codebase for technical interviews.

---

## Core Logic: How the System Works

### 1. Data Flow

```
User Action (Add/Park/Remove)
    ↓
Component Handler (AddSlot/ParkVehicle)
    ↓
App.jsx Handler Function
    ↓
State Update (setSlots)
    ↓
React Re-render
    ↓
UI Updated + Message in OutputPanel
```

### 2. State Management Pattern

```javascript
// App.jsx manages THREE pieces of state:
const [slots, setSlots] = useState([])           // All parking slots
const [message, setMessage] = useState('')       // Current message
const [messageType, setMessageType] = useState('') // 'success' or 'error'

// Components receive:
// - Current state (slots)
// - Handler functions (handleAddSlot, handleParkVehicle, handleRemoveVehicle)

// Flow: Component → Handler → State Update → Component Re-render
```

---

## Component Deep Dive

### App.jsx (125 lines)

**Responsibilities:**
- Manage global state (slots, message, messageType)
- Implement core business logic
- Orchestrate component rendering

**Key Functions:**

#### handleAddSlot(newSlot)
```javascript
// Step 1: Validate - prevent duplicates
if (slots.some(slot => slot.slotNo === newSlot.slotNo)) {
  // Show error message
  return
}

// Step 2: Prepare - add isOccupied = false
const slotWithOccupancy = { ...newSlot, isOccupied: false }

// Step 3: Update state
setSlots([...slots, slotWithOccupancy])

// Step 4: Show success message
setMessage(`✓ Slot #${newSlot.slotNo} added successfully`)
```

#### handleParkVehicle(needsEV, needsCover)
```javascript
// Step 1: Filter available slots
const availableSlots = slots.filter(slot => {
  if (slot.isOccupied) return false              // Must be empty
  if (needsEV && !slot.isEVCharging) return false // EV requirement
  if (needsCover && !slot.isCovered) return false // Cover requirement
  return true
})

// Step 2: Check if any slots match
if (availableSlots.length === 0) {
  setMessage('No slot available')
  return
}

// Step 3: Find nearest slot (LOWEST slotNo)
const nearestSlot = availableSlots.reduce((min, slot) =>
  slot.slotNo < min.slotNo ? slot : min
)

// Step 4: Update slot to occupied
setSlots(slots.map(slot =>
  slot.slotNo === nearestSlot.slotNo
    ? { ...slot, isOccupied: true }  // Mark as occupied
    : slot                            // Keep others unchanged
))

// Step 5: Show success message
setMessage(`✓ Vehicle parked at Slot #${nearestSlot.slotNo}...`)
```

#### handleRemoveVehicle(slotNo)
```javascript
// Step 1: Find the slot
const slot = slots.find(s => s.slotNo === slotNo)

// Step 2: Validate - does slot exist?
if (!slot) {
  setMessage(`Error: Slot #${slotNo} does not exist`)
  return
}

// Step 3: Validate - is slot occupied?
if (!slot.isOccupied) {
  setMessage(`Error: Slot #${slotNo} is already empty`)
  return
}

// Step 4: Update slot to available
setSlots(slots.map(s =>
  s.slotNo === slotNo ? { ...s, isOccupied: false } : s
))

// Step 5: Show success message
setMessage(`✓ Vehicle removed from Slot #${slotNo}`)
```

**Why Immutable Updates?**
```javascript
// ❌ WRONG - mutates existing array
slots[0].isOccupied = true
setSlots(slots)  // React won't detect change

// ✅ RIGHT - creates new array
setSlots(slots.map(slot => 
  slot.slotNo === 1 
    ? { ...slot, isOccupied: true }  // New object
    : slot
))  // React detects change and re-renders
```

---

### AddSlot.jsx (79 lines)

**Purpose:** Form to add new parking slots

**Key Logic:**

```javascript
// State: Only manages form inputs
const [slotNo, setSlotNo] = useState('')
const [isCovered, setIsCovered] = useState(false)
const [isEVCharging, setIsEVCharging] = useState(false)

// Validation Steps:
handleSubmit(e) {
  e.preventDefault()  // Prevent page reload

  // 1. Check if slotNo is not empty
  if (!slotNo || slotNo.trim() === '') {
    alert('Please enter a slot number')
    return
  }

  // 2. Parse string to integer
  const slotNumber = parseInt(slotNo, 10)

  // 3. Validate is a positive number
  if (isNaN(slotNumber) || slotNumber <= 0) {
    alert('Slot number must be a positive integer')
    return
  }

  // 4. Pass to parent component
  onAddSlot({
    slotNo: slotNumber,
    isCovered,
    isEVCharging
  })

  // 5. Reset form
  setSlotNo('')
  setIsCovered(false)
  setIsEVCharging(false)
}
```

**Form Inputs:**
- Number input for slot number
- Checkbox for covered status
- Checkbox for EV charging status

---

### SlotList.jsx (55 lines)

**Purpose:** Display all parking slots in a sortable table

**Key Features:**

```javascript
// 1. Empty state handling
if (slots.length === 0) {
  return <div>No parking slots added yet...</div>
}

// 2. Sort slots by number (ascending)
slots.sort((a, b) => a.slotNo - b.slotNo)

// 3. Render table with visual indicators
<tr className={slot.isOccupied ? 'occupied' : 'available'}>
  <td className="slot-number">#{slot.slotNo}</td>
  <td>{slot.isCovered ? '✓' : '✗'}</td>
  <td>{slot.isEVCharging ? '⚡' : '✗'}</td>
  <td>{slot.isOccupied ? 'Yes' : 'No'}</td>
  <td>
    <span className={`status-badge ${slot.isOccupied ? 'occupied' : 'available'}`}>
      {slot.isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
    </span>
  </td>
</tr>

// 4. Display statistics
<p><strong>Total Slots:</strong> {slots.length}</p>
<p><strong>Available:</strong> {slots.filter(s => !s.isOccupied).length}</p>
<p><strong>Occupied:</strong> {slots.filter(s => s.isOccupied).length}</p>
```

**CSS Classes for Styling:**
- `slots-table` - Main table container
- `occupied` - Row styling for occupied slots
- `available` - Row styling for available slots
- `status-badge` - Status indicator styling

---

### ParkVehicle.jsx (86 lines)

**Purpose:** Two-in-one component for parking and removing vehicles

**Key Pattern:**

```javascript
// Single component, different behavior based on prop
export default function ParkVehicle({ 
  isRemove,           // Boolean: are we removing or parking?
  onParkVehicle,      // Callback for parking
  onRemoveVehicle     // Callback for removing
}) {
  // Render different form based on isRemove prop
  if (isRemove) {
    return <RemoveVehicleForm />
  }
  return <ParkVehicleForm />
}

// In App.jsx:
<ParkVehicle onParkVehicle={handleParkVehicle} />
<ParkVehicle isRemove onRemoveVehicle={handleRemoveVehicle} />
```

**Park Vehicle Form:**
```javascript
const [needsEV, setNeedsEV] = useState(false)
const [needsCover, setNeedsCover] = useState(false)

// On submit, pass requirements to parent
handleSubmit(e) {
  e.preventDefault()
  onParkVehicle(needsEV, needsCover)  // Pass criteria
  setNeedsEV(false)   // Reset form
  setNeedsCover(false)
}
```

**Remove Vehicle Form:**
```javascript
const [slotNo, setSlotNo] = useState('')

// On submit, pass slot number to parent
handleSubmit(e) {
  e.preventDefault()
  const slotNumber = parseInt(slotNo, 10)
  onRemoveVehicle(slotNumber)
  setSlotNo('')  // Reset form
}
```

---

### OutputPanel.jsx (20 lines)

**Purpose:** Display success/error messages to user

**Key Logic:**

```javascript
// Show empty state if no message
if (!message) {
  return <div className="output-panel empty">Output messages will appear here</div>
}

// Show message with type-specific styling
<div className={`output-panel ${messageType}`}>
  <p className={`message message-${messageType}`}>
    {message}
  </p>
</div>

// CSS Classes:
// - .output-panel.success → Green styling
// - .output-panel.error → Red styling
// - .message-success → Green text
// - .message-error → Red text
```

---

## Algorithm Explanation

### The "Nearest Slot" Algorithm

**Problem:** Find the lowest-numbered available slot that meets criteria

**Solution: Three-Step Approach**

```javascript
// STEP 1: FILTER - Get slots that match criteria
const availableSlots = slots.filter(slot => {
  // Slot must be unoccupied
  if (slot.isOccupied) return false
  
  // If EV charging needed, slot must support it
  if (needsEV && !slot.isEVCharging) return false
  
  // If cover needed, slot must be covered
  if (needsCover && !slot.isCovered) return false
  
  // All criteria met
  return true
})

// STEP 2: CHECK - Verify at least one slot exists
if (availableSlots.length === 0) {
  return "No slot available"
}

// STEP 3: FIND MINIMUM - Get slot with lowest number
const nearestSlot = availableSlots.reduce((min, slot) => {
  // Return the slot with smaller number
  return slot.slotNo < min.slotNo ? slot : min
})
```

**Complexity Analysis:**
- **Time:** O(n) - single pass through array
- **Space:** O(k) - filtered array where k ≤ n
- **Why efficient:** Linear scan is acceptable for parking lots

**Interview Question:**
> "How would you optimize this for 100,000 slots?"

**Answer:**
1. Keep sorted index of slots by number (O(log n) lookup)
2. Maintain BST or sorted linked list
3. For typical lot, O(n) is fine
4. Trade-off: Faster reads vs. slower writes

---

## State Update Patterns

### Pattern 1: Adding Item
```javascript
// Add new slot to array
setSlots([...slots, newSlot])
// Creates new array with additional item
```

### Pattern 2: Updating Item
```javascript
// Update specific slot
setSlots(slots.map(slot =>
  slot.slotNo === targetSlotNo
    ? { ...slot, isOccupied: true }  // Update this slot
    : slot                            // Keep others unchanged
))
// Uses map to create new array with updated item
```

### Pattern 3: Filtering Items
```javascript
// Keep only matching slots
availableSlots = slots.filter(slot => !slot.isOccupied)
// Creates new array with filtered items
```

---

## UI/UX Patterns

### 1. Form Handling
```javascript
// 1. Collect input from form
const [value, setValue] = useState('')

// 2. Update on change
onChange={(e) => setValue(e.target.value)}

// 3. Validate on submit
if (!value) alert('Required field')

// 4. Pass to handler
onSubmit(value)

// 5. Reset form
setValue('')
```

### 2. Message Display
```javascript
// 1. Store message in state
const [message, setMessage] = useState('')
const [type, setType] = useState('')

// 2. Update after action
setMessage('Success message')
setMessageType('success')

// 3. Display in UI
{message && <OutputPanel message={message} messageType={type} />}

// 4. Clear after action
// (Currently manual - could auto-clear after delay)
```

### 3. Conditional Rendering
```javascript
// Show different UI based on condition
if (isRemove) {
  return <RemoveForm />
}
return <ParkForm />

// Or using ternary in JSX
<button className={isOccupied ? 'occupied' : 'available'}>
  {isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
</button>
```

---

## Testing Approach

### Unit Test Ideas

```javascript
// Test: Duplicate prevention
test('Should prevent adding duplicate slot number', () => {
  const result = addSlot(1, true, true)
  const result2 = addSlot(1, false, false)
  expect(result2).toBe('Error: Slot already exists')
})

// Test: Nearest slot selection
test('Should park at lowest available slot', () => {
  addSlot(5)
  addSlot(2)
  addSlot(8)
  const result = parkVehicle(false, false)
  expect(result.slotNo).toBe(2)
})

// Test: Filter criteria
test('Should respect EV charging requirement', () => {
  addSlot(1, false, false)  // No EV
  addSlot(2, false, true)   // Has EV
  const result = parkVehicle(true, false)  // Needs EV
  expect(result.slotNo).toBe(2)
})
```

---

## Interview Tips

### Explain the Architecture
1. **State location:** "All state lives in App.jsx for single source of truth"
2. **Data flow:** "Components dispatch actions to App, which updates state, triggers re-render"
3. **Component roles:** "Each component has one responsibility"

### Explain the Algorithm
1. **Approach:** "Filter available slots, then find minimum"
2. **Complexity:** "O(n) time, which is acceptable"
3. **Optimization:** "Could use indexed structures if needed"

### Discuss Edge Cases
1. "What if no slots match?" → Error message
2. "What if slot already occupied?" → Error message
3. "What if invalid slot number?" → Error message

### Discuss Scalability
1. "Current system works for 10,000+ slots"
2. "For 1M+ slots, could use different data structure"
3. "State management could be moved to Redux if needed"

---

## Key Takeaways

✅ **Clean Architecture** - Separation of concerns across components
✅ **Immutable Updates** - React requires immutable state changes
✅ **Algorithm Clarity** - Easy to explain and debug
✅ **Error Handling** - All edge cases covered
✅ **Interview Ready** - Code tells a story, easy to explain
