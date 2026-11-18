import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Experience = {
  id: string
  date: string
  role: string
  org: string
  description?: string
  image?: string
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    supabase
      .from('experience')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setExperiences(data)
      })
  }, [])

  return (
    <section id="experience">
      <div className="sec-label" data-aos="fade-up">Experience</div>
      <h2 className="sec-title mix-title" data-aos="fade-up" data-aos-delay="80">
        <span className="s">J</span>ourney so far
      </h2>

      <div className="exp-swiper-wrap" data-aos="fade-up">
        <Swiper
          modules={[Navigation, Pagination, FreeMode, Mousewheel]}
          spaceBetween={20}
          slidesPerView={'auto'}
          freeMode={true}
          mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
          simulateTouch
          grabCursor
          threshold={0}
          navigation={{ nextEl: '.exp-next', prevEl: '.exp-prev' }}
          pagination={{ clickable: true, el: '.exp-dots' }}
          className="exp-swiper"
        >
          {experiences.map((e, i) => (
            <SwiperSlide key={e.id} className="exp-slide">
              <div className="exp-card">
                <div className="exp-thumb">
                  {e.image
                    ? <img src={e.image} alt={`${e.role} at ${e.org}`} loading="lazy" />
                    : <div className="exp-thumb-placeholder">{e.role.charAt(0)}</div>}
                </div>
                <div className="exp-meta">
                  <div className="exp-num">0{i + 1}</div>
                  <div className="exp-date">{e.date}</div>
                </div>
                <div className="exp-role">{e.role}</div>
                <div className="exp-org">{e.org}</div>
                {e.description && (
                  <div className="exp-desc">{e.description}</div>
                )}
                <div className="exp-card-glow" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="exp-nav">
          <button className="exp-prev exp-nav-btn">←</button>
          <div className="exp-dots" />
          <button className="exp-next exp-nav-btn">→</button>
        </div>
      </div>
    </section>
  )
}