import { useSiteContent } from '../hooks/useSiteContent'

const DEFAULT_STACK = [
  { icon: '⬡', label: 'Web', skills: ['Laravel', 'PHP', 'JavaScript', 'HTML/CSS'] },
  { icon: '◈', label: 'Mobile & IoT', skills: ['Flutter', 'Firebase', 'ESP32', 'IoT'] },
  { icon: '▣', label: 'Database', skills: ['MySQL', 'Supabase', 'PostgreSQL'] },
  { icon: '✦', label: 'Tools & Design', skills: ['Figma', 'Git', 'Postman', 'VS Code'] },
]

export default function About() {
  const { content } = useSiteContent()

  // Tech stack dari admin: format JSON string yang disimpan di site_content key 'about_stack'
  // Fallback ke DEFAULT_STACK kalau belum diset
  let skillCategories = DEFAULT_STACK
  if (content.about_stack) {
    try {
      const parsed = JSON.parse(content.about_stack)
      if (Array.isArray(parsed) && parsed.length > 0) skillCategories = parsed
    } catch { /* pakai default */ }
  }

  return (
    <section id="about">
      <div className="sec-label" data-aos="fade-up">About Me</div>

      <div className="abt-grid" data-aos="fade-up">

        {/* LEFT */}
        <div className="abt-left">
          <h2 className="abt-title mix-title">
            <span className="s">H</span>ello, I'm<br />
            <span className="abt-name-grad">
              {content.about_name || 'Meysya Indah Calista Putri'}
            </span>
          </h2>

          <p className="abt-bio">
            {content.about_bio || "I'm an Information Technology Student at Brawijaya University interested in Web Development, UI/UX, and IoT."}
          </p>

          <div className="abt-actions">
            <a
              href="https://drive.google.com/file/d/1X2IATWjA2ooheiXC39S1AHBD3QXOhjO-/view?usp=sharing"
              className="abt-btn primary"
            >
              Download CV
            </a>

            <a
              href="#contact"
              className="abt-btn secondary"
            >
              Get In Touch
            </a>
          </div>

          <div className="abt-stats">
            <div className="abt-stat">
              <span className="abt-stat-n">{content.about_stat1_n || '3.8'}</span>
              <span className="abt-stat-l">{content.about_stat1_l || 'GPA'}</span>
            </div>
            <div className="abt-stat-div" />
            <div className="abt-stat">
              <span className="abt-stat-n">{content.about_stat2_n || '2+'}</span>
              <span className="abt-stat-l">{content.about_stat2_l || 'Projects'}</span>
            </div>
            <div className="abt-stat-div" />
            <div className="abt-stat">
              <span className="abt-stat-n">{content.about_stat3_n || 'Smt 4'}</span>
              <span className="abt-stat-l">{content.about_stat3_l || 'Sekarang'}</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Tech Stack */}
        <div className="abt-right">
          <div className="abt-stack-label">Tech Stack</div>
          <div className="abt-skill-grid">
            {skillCategories.map(cat => (
              <div key={cat.label} className="abt-skill-cat">
                <div className="abt-skill-cat-head">
                  <span className="abt-skill-icon">{cat.icon}</span>
                  <span className="abt-skill-cat-name">{cat.label}</span>
                </div>
                <div className="abt-skill-pills">
                  {cat.skills.map(s => (
                    <span key={s} className="abt-skill-pill">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}