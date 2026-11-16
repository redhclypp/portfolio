import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type ProjectDetails = {
  overview?: string
  problem?: string
  solution?: string
  features?: string[]
  process?: string[]
  challenges?: string[]
  result?: string
  screenshots?: string[]
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProject = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      if (data) setProject(data)
      setLoading(false)
    }
    getProject()
  }, [id])

  if (loading) return (
    <div className="pd-loading">
      <div className="pd-spinner" />
    </div>
  )

  if (!project) return (
    <div className="pd-loading">
      <p>Project tidak ditemukan</p>
      <Link to="/" className="pd-back">← Kembali</Link>
    </div>
  )

  const details: ProjectDetails = project.details || {}
  const detailBlocks = [
    { title: 'Overview', text: details.overview },
    { title: 'Problem', text: details.problem },
    { title: 'Solution', text: details.solution },
  ]
  const gallery = details.screenshots?.length ? details.screenshots : project.demo_files || []
  const hasGithub = Boolean(project.github?.trim())
  const hasDemo = Boolean(project.demo?.trim())

  return (
    <div className="pd-wrap">

      <Link to="/#projects" className="pd-back-btn">← kembali</Link>

      <div className="pd-hero">
        {project.thumbnail
          ? <img src={project.thumbnail} alt={project.title} className="pd-hero-img" />
          : <div className="pd-hero-placeholder" />
        }
        <div className="pd-hero-overlay" />
        <div className="pd-hero-content">
          <div className="pd-type">{project.type}</div>
          <h1 className="pd-title">{project.title}</h1>
          <div className="pd-tags">
            {project.tags?.map((t: string, i: number) => (
              <span key={i} className="pd-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="pd-body">

        <div className="pd-main">
          {(details.overview || details.problem || details.solution) && (
            <div className="pd-card">
              <div className="pd-detail-grid">
                {detailBlocks.map(block => block.text && (
                  <div className="pd-detail-block" key={block.title}>
                    <div className="pd-heading">{block.title}</div>
                    <p className="pd-description">{block.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(details.features?.length || details.process?.length || details.challenges?.length) && (
            <div className="pd-detail-columns">
              {details.features?.length ? <div className="pd-card"><div className="pd-heading">Features</div><ul className="pd-list">{details.features.map((item: string) => <li key={item}>{item}</li>)}</ul></div> : null}
              {details.process?.length ? <div className="pd-card"><div className="pd-heading">Development Process</div><ol className="pd-list pd-process-list">{details.process.map((item: string, index: number) => <li key={`${index}-${item}`}><span>{index + 1}</span>{item}</li>)}</ol></div> : null}
              {details.challenges?.length ? <div className="pd-card"><div className="pd-heading">Challenges</div><ul className="pd-list">{details.challenges.map((item: string) => <li key={item}>{item}</li>)}</ul></div> : null}
            </div>
          )}

          {gallery.length > 0 && (
            <div className="pd-section">
              <div className="pd-heading">Screenshot Gallery</div>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="pd-swiper"
              >
                {gallery.map((file: string, i: number) => {
                  const isVideo = file.includes('.mp4') || file.includes('.webm') || file.includes('.mov')
                  return (
                    <SwiperSlide key={i}>
                      {isVideo
                        ? <video src={file} controls className="pd-demo-img" />
                        : <img src={file} alt={`demo-${i}`} className="pd-demo-img" />
                      }
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          )}

          {details.result && (
            <div className="pd-card">
              <div className="pd-heading">Result</div>
              <p className="pd-description">{details.result}</p>
            </div>
          )}
        </div>

        <aside className="pd-sidebar">
          <div className="pd-card">
            <div className="pd-section-label" style={{ marginBottom: '16px' }}>Tech Stack</div>
            <div className="pd-tags-wrap">
              {project.tags?.map((t: string, i: number) => (
                <span key={i} className="pd-tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="pd-card">
            <div className="pd-section-label" style={{ marginBottom: '16px' }}>Links</div>
            <div className="pd-links">
              {hasGithub && (
                <a href={project.github} target="_blank" rel="noreferrer" className="pd-link-btn">
                  <span className="pd-link-icon">⌥</span>
                  <span>GitHub Repository</span>
                  <span className="pd-link-arrow">↗</span>
                </a>
              )}
              {hasDemo && (
                <a href={project.demo} target="_blank" rel="noreferrer" className="pd-link-btn pd-link-btn-cyan">
                  <span className="pd-link-icon">◈</span>
                  <span>Live Demo</span>
                  <span className="pd-link-arrow">↗</span>
                </a>
              )}
              {!hasGithub && !hasDemo && <span className="pd-link-empty">No links added in Admin</span>}
            </div>
          </div>

          <div className="pd-card pd-card-glow">
            <div className="pd-section-label" style={{ marginBottom: '8px' }}>Type</div>
            <div className="pd-type-big">{project.type}</div>
          </div>
        </aside>

      </div>
    </div>
  )
}