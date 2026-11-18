import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Project = {
  id: string
  title: string
  type: string
  preview: string
  thumbnail: string
  tags: string[]
}

const palettes = [
  { from: '#1246ff', to: '#00d4ff' },
  { from: '#7c3aed', to: '#c026d3' },
  { from: '#059669', to: '#0ea5e9' },
  { from: '#dc2626', to: '#ea580c' },
  { from: '#0891b2', to: '#1246ff' },
  { from: '#7c3aed', to: '#2563eb' },
]

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const pal = palettes[index % palettes.length]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -10
    const rotY = ((x - cx) / cx) * 10
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`
    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,212,255,0.22) 0%, rgba(18,70,255,0.12) 40%, transparent 70%)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)'
    glow.style.background = 'transparent'
  }

  return (
    <Link to={`/project/${p.id}`} className="project-link-wrap">
      <div
        ref={cardRef}
        className="project-card-new"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-holo-layer" />
        <div ref={glowRef} className="card-glow-follow" />

        <div className="card-preview-new">
          {p.thumbnail ? (
            <img src={p.thumbnail} alt={p.title} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, ${pal.from}55 0%, ${pal.to}55 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'rgba(255,255,255,.2)', fontStyle: 'italic' }}>
                {p.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="card-preview-bg" />
          <div className="card-preview-content">
            <div className="card-preview-icon">↗</div>
            <span className="card-preview-text">open project</span>
          </div>
          <div className="card-corner tl" />
          <div className="card-corner tr" />
          <div className="card-corner bl" />
          <div className="card-corner br" />
        </div>

        <div className="card-body-new">
          <div className="card-type-new">{p.type}</div>
          <div className="card-title-new">{p.title}</div>
          <div className="card-tags-new">
            {p.tags?.map(t => (
              <span key={t} className="card-tag-new">{t}</span>
            ))}
          </div>
          <div className="card-link-new">
            <span>lihat project</span>
            <span className="card-link-arrow">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const { content } = useSiteContent()

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setProjects(data) })
  }, [])

  return (
    <section id="projects">
      <div className="projects-header">
        <div>
          <div className="sec-label" data-aos="fade-up">Projects</div>
          <h2 className="sec-title mix-title" data-aos="fade-up" data-aos-delay="80">
            <span className="s">P</span>rojects i've worked on
          </h2>
        </div>
        <a
          href={content.contact_github || 'https://github.com/redhclypp'}
          target="_blank"
          rel="noreferrer"
          className="view-all"
        >
          lihat di github →
        </a>
      </div>

      <div className="proj-swiper-wrap" data-aos="fade-up">
        <Swiper
          modules={[Navigation, Pagination, FreeMode]}
          spaceBetween={24}
          slidesPerView={'auto'}
          freeMode={true}
          simulateTouch
          grabCursor
          threshold={0}
          navigation={{ nextEl: '.proj-next', prevEl: '.proj-prev' }}
          pagination={{ clickable: true, el: '.proj-dots' }}
          className="proj-swiper"
        >
          {projects.map((p, i) => (
            <SwiperSlide key={p.id} className="proj-slide">
              <ProjectCard p={p} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="proj-nav">
          <button className="proj-prev proj-nav-btn">←</button>
          <div className="proj-dots" />
          <button className="proj-next proj-nav-btn">→</button>
        </div>
      </div>
    </section>
  )
}