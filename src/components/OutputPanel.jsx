export default function OutputPanel({ message, messageType }) {
  if (!message) {
    return (
      <div className="output-panel empty">
        <p>Output messages will appear here</p>
      </div>
    )
  }

  return (
    <div className={`output-panel ${messageType}`}>
      <p className={`message message-${messageType}`}>
        {message}
      </p>
    </div>
  )
}
