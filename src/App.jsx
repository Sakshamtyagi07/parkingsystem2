import { useState } from 'react'
import AddSlot from './components/AddSlot'
import SlotList from './components/SlotList'
import ParkVehicle from './components/ParkVehicle'
import OutputPanel from './components/OutputPanel'

export default function App() {
  const [slots, setSlots] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  /**
   * Adds a new parking slot with validation
   * - Prevents duplicate slot numbers
   * - Sets isOccupied to false by default
   */
  const handleAddSlot = (newSlot) => {
    // Check if slot number already exists
    if (slots.some(slot => slot.slotNo === newSlot.slotNo)) {
      setMessage(`Error: Slot #${newSlot.slotNo} already exists`)
      setMessageType('error')
      return
    }

    const slotWithOccupancy = {
      ...newSlot,
      isOccupied: false
    }

    setSlots([...slots, slotWithOccupancy])
    setMessage(`✓ Slot #${newSlot.slotNo} added successfully`)
    setMessageType('success')
  }

  /**
   * Parks a vehicle by finding the nearest available slot
   * Criteria:
   * - Slot must be unoccupied
   * - If needsEV, must support EV charging
   * - If needsCover, must be covered
   */
  const handleParkVehicle = (needsEV, needsCover) => {
    // Filter available slots based on criteria
    const availableSlots = slots.filter(slot => {
      if (slot.isOccupied) return false
      if (needsEV && !slot.isEVCharging) return false
      if (needsCover && !slot.isCovered) return false
      return true
    })

    if (availableSlots.length === 0) {
      setMessage('No slot available')
      setMessageType('error')
      return
    }

    // Find nearest slot (lowest slotNo)
    const nearestSlot = availableSlots.reduce((min, slot) =>
      slot.slotNo < min.slotNo ? slot : min
    )

    // Mark slot as occupied
    setSlots(slots.map(slot =>
      slot.slotNo === nearestSlot.slotNo
        ? { ...slot, isOccupied: true }
        : slot
    ))

    const features = []
    if (needsEV) features.push('EV Charging')
    if (needsCover) features.push('Covered')

    setMessage(`✓ Vehicle parked at Slot #${nearestSlot.slotNo}${features.length ? ` (${features.join(', ')})` : ''}`)
    setMessageType('success')
  }

  /**
   * Removes a vehicle from a specified slot
   * Handles:
   * - Invalid slot numbers
   * - Already empty slots
   */
  const handleRemoveVehicle = (slotNo) => {
    const slot = slots.find(s => s.slotNo === slotNo)

    if (!slot) {
      setMessage(`Error: Slot #${slotNo} does not exist`)
      setMessageType('error')
      return
    }

    if (!slot.isOccupied) {
      setMessage(`Error: Slot #${slotNo} is already empty`)
      setMessageType('error')
      return
    }

    setSlots(slots.map(s =>
      s.slotNo === slotNo ? { ...s, isOccupied: false } : s
    ))

    setMessage(`✓ Vehicle removed from Slot #${slotNo}`)
    setMessageType('success')
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🅿️ Smart Parking Lot System</h1>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>Add New Parking Slot</h2>
          <AddSlot onAddSlot={handleAddSlot} />
        </section>

        <section className="section">
          <h2>Available Parking Slots</h2>
          <SlotList slots={slots} />
        </section>

        <section className="section">
          <h2>Park or Remove Vehicle</h2>
          <div className="action-grid">
            <ParkVehicle onParkVehicle={handleParkVehicle} />
            <ParkVehicle isRemove onRemoveVehicle={handleRemoveVehicle} />
          </div>
        </section>

        <section className="section">
          <OutputPanel message={message} messageType={messageType} />
        </section>
      </main>
    </div>
  )
}
