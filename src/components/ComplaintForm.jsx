import { useState } from 'react'

export default function ComplaintForm({ onSubmitComplaint }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [slotNumber, setSlotNumber] = useState('')
  const [complaintText, setComplaintText] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }

      setImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      alert('Please enter your name')
      return
    }
    if (!email.trim()) {
      alert('Please enter your email')
      return
    }
    if (!complaintText.trim()) {
      alert('Please describe your complaint')
      return
    }

    // Create complaint object
    const complaint = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      slotNumber: slotNumber.trim() || 'N/A',
      complaintText: complaintText.trim(),
      image: imagePreview,
      timestamp: new Date().toLocaleString()
    }

    // Submit complaint
    onSubmitComplaint(complaint)

    // Reset form
    setName('')
    setEmail('')
    setSlotNumber('')
    setComplaintText('')
    setImage(null)
    setImagePreview(null)
    setSubmitted(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  return (
    <div className="complaint-form-container">
      {submitted && (
        <div className="complaint-success-message">
          ✓ Your complaint has been submitted successfully. We'll review it shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label htmlFor="name">Your Name *</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="slotNumber">Parking Slot Number (Optional)</label>
          <input
            id="slotNumber"
            type="text"
            placeholder="e.g., A-12, B-5"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="complaint">Complaint Details *</label>
          <textarea
            id="complaint"
            placeholder="Describe your complaint in detail..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label className="image-label">📸 Upload Proof Image (Optional)</label>
          <div className="image-upload-area">
            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label className="upload-input-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-input"
                />
                <span className="upload-icon">📤</span>
                <span className="upload-text">Click to upload or drag image here</span>
                <span className="upload-hint">(Max 5MB - JPG, PNG, GIF)</span>
              </label>
            )}
          </div>
        </div>

        <button type="submit" className="complaint-submit-btn">
          Submit Complaint
        </button>
      </form>
    </div>
  )
}
