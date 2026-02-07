export default function ParkingGrid({ slots }) {
  if (slots.length === 0) {
    return null
  }

  // Sort slots by slot number
  const sortedSlots = [...slots].sort((a, b) => a.slotNo - b.slotNo)

  return (
    <div className="parking-grid-container">
      <div className="grid-header">
        <h3>Parking Lot Overview</h3>
        <div className="grid-legend">
          <div className="legend-item">
            <div className="legend-box available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box occupied"></div>
            <span>Occupied</span>
          </div>
          <div className="legend-item">
            <div className="legend-box ev"></div>
            <span>EV Charging</span>
          </div>
          <div className="legend-item">
            <div className="legend-box covered"></div>
            <span>Covered</span>
          </div>
        </div>
      </div>

      <div className="parking-grid">
        {sortedSlots.map(slot => (
          <div
            key={slot.slotNo}
            className={`parking-slot 
              ${slot.isOccupied ? 'occupied' : 'available'} 
              ${slot.isEVCharging ? 'has-ev' : ''} 
              ${slot.isCovered ? 'has-cover' : ''}`}
            title={`Slot #${slot.slotNo}${slot.isCovered ? ' (Covered)' : ''}${slot.isEVCharging ? ' (EV Charging)' : ''}`}
          >
            <div className="slot-content">
              <div className="slot-number">{slot.slotNo}</div>
              <div className="slot-icons">
                {slot.isEVCharging && <span className="icon-ev" title="EV Charging">⚡</span>}
                {slot.isCovered && <span className="icon-cover" title="Covered">🛡️</span>}
              </div>
              {slot.isOccupied && (
                <div className="vehicle-indicator">
                  <span className="car-icon">🚗</span>
                </div>
              )}
            </div>
            <div className="slot-status">
              {slot.isOccupied ? '✕' : '✓'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
