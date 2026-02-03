import { useState } from 'react'

export default function AddSlot({ onAddSlot }) {
  const [slotNo, setSlotNo] = useState('')
  const [isCovered, setIsCovered] = useState(false)
  const [isEVCharging, setIsEVCharging] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation: slot number must be provided
    if (!slotNo || slotNo.trim() === '') {
      alert('Please enter a slot number')
      return
    }

    const slotNumber = parseInt(slotNo, 10)

    // Validation: slot number must be a positive integer
    if (isNaN(slotNumber) || slotNumber <= 0) {
      alert('Slot number must be a positive integer')
      return
    }

    // Call parent handler
    onAddSlot({
      slotNo: slotNumber,
      isCovered,
      isEVCharging
    })

    // Reset form
    setSlotNo('')
    setIsCovered(false)
    setIsEVCharging(false)
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="slotNo">Slot Number:</label>
        <input
          id="slotNo"
          type="number"
          min="1"
          value={slotNo}
          onChange={(e) => setSlotNo(e.target.value)}
          placeholder="e.g., 1, 2, 3..."
          required
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={isCovered}
            onChange={(e) => setIsCovered(e.target.checked)}
          />
          <span>Covered Slot</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={isEVCharging}
            onChange={(e) => setIsEVCharging(e.target.checked)}
          />
          <span>EV Charging Available</span>
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        Add Slot
      </button>
    </form>
  )
}
