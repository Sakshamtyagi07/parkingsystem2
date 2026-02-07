export default function ParkingMap({ slots }) {
  if (slots.length === 0) {
    return null
  }

  const sortedSlots = [...slots].sort((a, b) => a.slotNo - b.slotNo)
  
  // Calculate grid dimensions
  const slotsPerRow = Math.ceil(Math.sqrt(sortedSlots.length))
  
  const totalOccupied = sortedSlots.filter(s => s.isOccupied).length
  const totalAvailable = sortedSlots.length - totalOccupied
  const occupancyPercent = Math.round((totalOccupied / sortedSlots.length) * 100)

  return (
    <div className="parking-map-container">
      <div className="map-header">
        <h2>🗺️ Parking Lot Map</h2>
        <div className="map-stats">
          <div className="map-stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{sortedSlots.length}</span>
          </div>
          <div className="map-stat occupied">
            <span className="stat-label">Occupied:</span>
            <span className="stat-value">{totalOccupied}</span>
          </div>
          <div className="map-stat available">
            <span className="stat-label">Available:</span>
            <span className="stat-value">{totalAvailable}</span>
          </div>
          <div className="map-stat occupancy">
            <span className="stat-label">Occupancy:</span>
            <span className="stat-value">{occupancyPercent}%</span>
          </div>
        </div>
      </div>

      <div className="parking-map">
        <svg
          viewBox={`0 0 ${slotsPerRow * 120} ${Math.ceil(sortedSlots.length / slotsPerRow) * 120}`}
          className="map-svg"
        >
          {/* Background */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f8fafc', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ecf0f1', stopOpacity: 1 }} />
            </linearGradient>
            <pattern id="gridPattern" x="120" y="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>

          <rect
            width={`${slotsPerRow * 120}`}
            height={`${Math.ceil(sortedSlots.length / slotsPerRow) * 120}`}
            fill="url(#mapGradient)"
          />
          <rect
            width={`${slotsPerRow * 120}`}
            height={`${Math.ceil(sortedSlots.length / slotsPerRow) * 120}`}
            fill="url(#gridPattern)"
          />

          {/* Parking Slots */}
          {sortedSlots.map((slot, index) => {
            const row = Math.floor(index / slotsPerRow)
            const col = index % slotsPerRow
            const x = col * 120 + 10
            const y = row * 120 + 10
            const slotWidth = 100
            const slotHeight = 100

            return (
              <g key={slot.slotNo}>
                {/* Slot Background */}
                <rect
                  x={x}
                  y={y}
                  width={slotWidth}
                  height={slotHeight}
                  rx="8"
                  fill={slot.isOccupied ? '#fee2e2' : '#dcfce7'}
                  stroke={slot.isOccupied ? '#e11d48' : '#14b8a6'}
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Slot Border Decoration */}
                {slot.isCovered && (
                  <rect
                    x={x + 2}
                    y={y + 2}
                    width={slotWidth - 4}
                    height={slotHeight - 4}
                    rx="6"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )}

                {/* EV Charging Indicator */}
                {slot.isEVCharging && (
                  <circle
                    cx={x + slotWidth - 15}
                    cy={y + 15}
                    r="8"
                    fill="#3b82f6"
                    style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                  />
                )}

                {/* Slot Number */}
                <text
                  x={x + slotWidth / 2}
                  y={y + slotHeight / 2 - 15}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill={slot.isOccupied ? '#991b1b' : '#065f46'}
                  fontFamily="'Syne', sans-serif"
                >
                  #{slot.slotNo}
                </text>

                {/* Vehicle or Check Icon */}
                {slot.isOccupied ? (
                  <text
                    x={x + slotWidth / 2}
                    y={y + slotHeight / 2 + 20}
                    textAnchor="middle"
                    fontSize="30"
                  >
                    🚗
                  </text>
                ) : (
                  <text
                    x={x + slotWidth / 2}
                    y={y + slotHeight / 2 + 20}
                    textAnchor="middle"
                    fontSize="24"
                    fill="#14b8a6"
                  >
                    ✓
                  </text>
                )}

                {/* Features */}
                {(slot.isCovered || slot.isEVCharging) && (
                  <text
                    x={x + slotWidth / 2}
                    y={y + slotHeight - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill={slot.isEVCharging ? '#3b82f6' : '#059669'}
                  >
                    {slot.isEVCharging && '⚡'}
                    {slot.isCovered && slot.isEVCharging && ' '}
                    {slot.isCovered && '🛡️'}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="map-legend">
        <div className="legend-item-large">
          <div className="legend-color available"></div>
          <span>Available Slot</span>
        </div>
        <div className="legend-item-large">
          <div className="legend-color occupied"></div>
          <span>Occupied Slot</span>
        </div>
        <div className="legend-item-large">
          <div className="legend-decor dashed"></div>
          <span>Covered Slot</span>
        </div>
        <div className="legend-item-large">
          <div className="legend-icon">⚡</div>
          <span>EV Charging</span>
        </div>
      </div>
    </div>
  )
}
