export default function StatsDisplay({ slots }) {
  const total = slots.length
  const occupied = slots.filter(s => s.isOccupied).length
  const available = total - occupied
  const withEV = slots.filter(s => s.isEVCharging).length
  const withCover = slots.filter(s => s.isCovered).length

  const occupancyPercent = total > 0 ? Math.round((occupied / total) * 100) : 0
  const availablePercent = 100 - occupancyPercent

  if (total === 0) return null

  return (
    <div className="stats-display">
      <div className="stat-card occupancy-stat">
        <div className="stat-header">
          <h4>Occupancy</h4>
          <span className="stat-percent">{occupancyPercent}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${occupancyPercent}%` }}
          ></div>
        </div>
        <div className="stat-sublabel">{occupied} / {total} slots occupied</div>
      </div>

      <div className="stat-card availability-stat">
        <div className="stat-header">
          <h4>Available</h4>
          <span className="stat-count">{available}</span>
        </div>
        <div className="stat-icon available-icon">✓</div>
        <div className="stat-sublabel">{availablePercent}% available</div>
      </div>

      <div className="stat-card features-stat">
        <div className="stat-header">
          <h4>Features</h4>
        </div>
        <div className="features-grid">
          <div className="feature-indicator">
            <span className="feature-count">{withEV}</span>
            <span className="feature-label">EV Ready</span>
          </div>
          <div className="feature-indicator">
            <span className="feature-count">{withCover}</span>
            <span className="feature-label">Covered</span>
          </div>
        </div>
      </div>
    </div>
  )
}
