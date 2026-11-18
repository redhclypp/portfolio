import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Certificate = {
  id: string
  title: string
  issuer: string
  year: string
  image: string
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [preview, setPreview] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('[Certificates] failed to load from Supabase:', error.message)
          setLoadError(true)
        } else if (data) {
          setCertificates(data)
        }
        setLoading(false)
      })
  }, [])

  // Still loading, or nothing to show and no error: render nothing (previous behavior).
  if (loading) return null
  if (certificates.length === 0 && !loadError) return null

  return (
    <section id="certificates">
      <div className="sec-label" data-aos="fade-up">Certificates</div>
      <h2 className="sec-title mix-title" data-aos="fade-up" data-aos-delay="80">
        <span className="s">P</span>roof of learning
      </h2>

      {loadError && (
        <div className="cert-load-error" data-aos="fade-up">
          Gagal memuat sertifikat dari database. Cek koneksi Supabase atau RLS policy pada tabel <code>certificates</code>.
        </div>
      )}

      <div className="cert-swiper-wrap" data-aos="fade-up">
        <Swiper
          modules={[Navigation, Pagination, FreeMode, Mousewheel]}
          spaceBetween={20}
          slidesPerView={'auto'}
          freeMode={true}
          mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
          simulateTouch
          grabCursor
          threshold={0}
          navigation={{ nextEl: '.cert-next', prevEl: '.cert-prev' }}
          pagination={{ clickable: true, el: '.cert-dots' }}
          className="cert-swiper"
        >
          {certificates.map(c => (
            <SwiperSlide key={c.id} className="cert-slide">
              <div className="cert-card">
                <div className="cert-thumb">
                  <img src={c.image} alt={c.title} loading="lazy" />
                  <button
                    className="cert-preview-btn"
                    onClick={() => setPreview(c)}
                    type="button"
                  >
                    Preview
                  </button>
                </div>
                <div className="cert-body">
                  <div className="cert-year">{c.year}</div>
                  <div className="cert-title">{c.title}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="cert-nav">
          <button className="cert-prev cert-nav-btn">{'\u2190'}</button>
          <div className="cert-dots" />
          <button className="cert-next cert-nav-btn">{'\u2192'}</button>
        </div>
      </div>

      {preview && (
        <div className="cert-lightbox" onClick={() => setPreview(null)}>
          <button className="cert-lightbox-close" onClick={() => setPreview(null)} type="button">
            {'\u2715'}
          </button>
          <img src={preview.image} alt={preview.title} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}