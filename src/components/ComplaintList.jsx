export default function ComplaintList({ complaints }) {
  if (complaints.length === 0) {
    return (
      <div className="complaints-empty">
        <p>No complaints filed yet</p>
      </div>
    )
  }

  return (
    <div className="complaints-list">
      {complaints.map((complaint) => (
        <div key={complaint.id} className="complaint-card">
          <div className="complaint-header">
            <div className="complaint-user-info">
              <h4 className="complaint-name">{complaint.name}</h4>
              <p className="complaint-email">{complaint.email}</p>
              <p className="complaint-timestamp">📅 {complaint.timestamp}</p>
            </div>
            {complaint.slotNumber !== 'N/A' && (
              <div className="complaint-slot-badge">
                Slot: {complaint.slotNumber}
              </div>
            )}
          </div>

          <p className="complaint-text">{complaint.complaintText}</p>

          {complaint.image && (
            <div className="complaint-image-container">
              <img 
                src={complaint.image} 
                alt="Complaint proof" 
                className="complaint-image"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
