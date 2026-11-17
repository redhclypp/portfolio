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
  const tags = Array.isArray(project.tags)
    ? project.tags.filter((tag: unknown): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : []
  const detailBlocks = [
    { title: 'Overview', text: details.overview },
    { title: 'Problem', text: details.problem },
    { title: 'Solution', text: details.solution },
  ].filter(block => block.text?.trim())
  const features = details.features?.filter(item => item.trim()) || []
  const process = details.process?.filter(item => item.trim()) || []
  const challenges = details.challenges?.filter(item => item.trim()) || []
  const gallery = (details.screenshots?.length ? details.screenshots : project.demo_files || [])
    .filter((file: string) => typeof file === 'string' && file.trim().length > 0)
  const hasGithub = Boolean(project.github?.trim())
  const hasDemo = Boolean(project.demo?.trim())
  const hasLinks = hasGithub || hasDemo
  const hasTags = tags.length > 0
  const hasType = Boolean(project.type?.trim())
  const hasSidebar = hasTags || hasLinks || hasType

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
          {hasType && <div className="pd-type">{project.type}</div>}
          <h1 className="pd-title">{project.title}</h1>
          {hasTags && <div className="pd-tags">
            {tags.map((t: string, i: number) => (
              <span key={i} className="pd-tag">{t}</span>
            ))}
          </div>}
        </div>
      </div>

      <div className={`pd-body ${hasSidebar ? '' : 'pd-body-no-sidebar'}`}>

        <div className="pd-main">
          {detailBlocks.length > 0 && (
            <div className="pd-card">
              <div className="pd-detail-grid">
                {detailBlocks.map(block => (
                  <div className="pd-detail-block" key={block.title}>
                    <div className="pd-heading">{block.title}</div>
                    <p className="pd-description">{block.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(features.length > 0 || process.length > 0 || challenges.length > 0) && (
            <div className="pd-detail-columns">
              {features.length > 0 ? <div className="pd-card"><div className="pd-heading">Features</div><ul className="pd-list">{features.map((item: string) => <li key={item}>{item}</li>)}</ul></div> : null}
              {process.length > 0 ? <div className="pd-card"><div className="pd-heading">Development Process</div><ol className="pd-list pd-process-list">{process.map((item: string, index: number) => <li key={`${index}-${item}`}><span>{index + 1}</span>{item}</li>)}</ol></div> : null}
              {challenges.length > 0 ? <div className="pd-card"><div className="pd-heading">Challenges</div><ul className="pd-list">{challenges.map((item: string) => <li key={item}>{item}</li>)}</ul></div> : null}
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

          {details.result?.trim() && (
            <div className="pd-card">
              <div className="pd-heading">Result</div>
              <p className="pd-description">{details.result}</p>
            </div>
          )}
        </div>

        {hasSidebar && <aside className="pd-sidebar">
          {hasTags && <div className="pd-card">
            <div className="pd-section-label" style={{ marginBottom: '16px' }}>Tech Stack</div>
            <div className="pd-tags-wrap">
              {tags.map((t: string, i: number) => (
                <span key={i} className="pd-tag">{t}</span>
              ))}
            </div>
          </div>}

          {hasLinks && <div className="pd-card">
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
            </div>
          </div>}

          {hasType && <div className="pd-card pd-card-glow">
            <div className="pd-section-label" style={{ marginBottom: '8px' }}>Type</div>
            <div className="pd-type-big">{project.type}</div>
          </div>}
        </aside>}

      </div>
    </div>
  )
}