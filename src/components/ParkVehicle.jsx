import { useState } from 'react'

export default function ParkVehicle({ isRemove, onParkVehicle, onRemoveVehicle }) {
  const [needsEV, setNeedsEV] = useState(false)
  const [needsCover, setNeedsCover] = useState(false)
  const [slotNo, setSlotNo] = useState('')

  const handleParkSubmit = (e) => {
    e.preventDefault()
    onParkVehicle(needsEV, needsCover)
    setNeedsEV(false)
    setNeedsCover(false)
  }

  const handleRemoveSubmit = (e) => {
    e.preventDefault()

    if (!slotNo || slotNo.trim() === '') {
      alert('Please enter a slot number')
      return
    }

    const slotNumber = parseInt(slotNo, 10)

    if (isNaN(slotNumber) || slotNumber <= 0) {
      alert('Slot number must be a positive integer')
      return
    }

    onRemoveVehicle(slotNumber)
    setSlotNo('')
  }

  if (isRemove) {
    return (
      <form onSubmit={handleRemoveSubmit} className="form">
        <h3>Remove Vehicle</h3>
        <div className="form-group">
          <label htmlFor="removeSlotNo">Enter Slot Number:</label>
          <input
            id="removeSlotNo"
            type="number"
            min="1"
            value={slotNo}
            onChange={(e) => setSlotNo(e.target.value)}
            placeholder="e.g., 1, 2, 3..."
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Remove Vehicle
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleParkSubmit} className="form">
      <h3>Park Vehicle</h3>
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={needsEV}
            onChange={(e) => setNeedsEV(e.target.checked)}
          />
          <span>Needs EV Charging</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={needsCover}
            onChange={(e) => setNeedsCover(e.target.checked)}
          />
          <span>Needs Covered Slot</span>
        </label>
      </div>

      <button type="submit" className="btn btn-success">
        Find & Park Vehicle
      </button>
    </form>
  )
}
