import ParkingGrid from './ParkingGrid'

export default function SlotList({ slots }) {
  if (slots.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🅿️</div>
        <p>No parking slots added yet. Add a slot to get started!</p>
      </div>
    )
  }

  return (
    <div className="slot-list">
      <ParkingGrid slots={slots} />
      <table className="slots-table">
        <thead>
          <tr>
            <th>Slot #</th>
            <th>Covered</th>
            <th>EV Charging</th>
            <th>Occupied</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {slots
            .sort((a, b) => a.slotNo - b.slotNo) // Sort by slot number
            .map(slot => (
              <tr key={slot.slotNo} className={slot.isOccupied ? 'occupied' : 'available'}>
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
            ))}
        </tbody>
      </table>

      <div className="slot-stats">
        <p>
          <strong>Total Slots:</strong> {slots.length}
        </p>
        <p>
          <strong>Available:</strong> {slots.filter(s => !s.isOccupied).length}
        </p>
        <p>
          <strong>Occupied:</strong> {slots.filter(s => s.isOccupied).length}
        </p>
      </div>
    </div>
  )
}
