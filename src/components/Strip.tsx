const techs = ['Web Development','Laravel','MySQL','Figma','JavaScript','UI/UX Design','PHP','IoT','Public Speaking','Problem Solving']

export default function Strip() {
  return (
    <div className="strip">
      <div className="strip-track">
        {[...techs, ...techs].map((t, i) => (
          <span className="strip-item" key={`${t}-${i}`}>
            <span>{t}</span>
            <span className="sep">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}