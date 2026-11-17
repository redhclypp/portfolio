import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

type Project = {
  id: string; title: string; type: string
  github: string; demo: string; tags: string[]; thumbnail: string; demo_files: string[]; details?: ProjectDetails
}
type ProjectDetails = { overview?: string; problem?: string; solution?: string; features?: string[]; process?: string[]; challenges?: string[]; result?: string; screenshots?: string[] }
type Experience = {
  id: string; date: string; role: string; org: string; description: string; image?: string
}
type Certificate = {
  id: string; title: string; issuer: string; year: string; image: string
}
type SkillCat = { icon: string; label: string; skills: string[] }

const EMPTY_FORM = { title: '', type: '', github: '', demo: '', tags: '', overview: '', problem: '', solution: '', features: '', process: '', challenges: '', result: '' }
const EMPTY_CERT_FORM = { title: '', issuer: '', year: '' }

const CONTENT_FIELDS: { key: string; label: string; hint?: string; textarea?: boolean }[] = [
  { key: 'hero_name',      label: 'Nama',                    hint: 'Nama yang muncul di hero' },
  { key: 'hero_badge',     label: 'Badge',                   hint: 'Teks badge di atas judul' },
  { key: 'hero_searchbar', label: 'Search Bar Placeholder',  hint: 'Teks di kotak search bawah nama' },
  { key: 'hero_status',    label: 'Status Card Foto',        hint: 'Teks di bawah foto hologram' },
  { key: 'hero_photo',     label: 'URL Foto Hologram',       hint: 'Path foto, misal: /namafoto.jpg' },
  { key: 'hero_cv_url',    label: 'URL Download CV',         hint: 'Link Google Drive / langsung ke file PDF' },
  { key: 'hero_typed',     label: 'Teks Typing (pisahkan |)',hint: 'Web Dev Enthusiast | UI/UX Designer', textarea: true },
  { key: 'about_name',     label: 'Nama',                    hint: 'Nama lengkap di section About' },
  { key: 'about_bio',      label: 'Bio / Deskripsi',         hint: 'Paragraf deskripsi dirimu', textarea: true },
  { key: 'about_stat1_n',  label: 'Stat 1 Angka',            hint: 'Misal: 3.8' },
  { key: 'about_stat1_l',  label: 'Stat 1 Label',            hint: 'Misal: GPA' },
  { key: 'about_stat2_n',  label: 'Stat 2 Angka' },
  { key: 'about_stat2_l',  label: 'Stat 2 Label' },
  { key: 'about_stat3_n',  label: 'Stat 3 Angka' },
  { key: 'about_stat3_l',  label: 'Stat 3 Label' },
  { key: 'contact_email',  label: 'Email' },
  { key: 'contact_linkedin',label: 'LinkedIn URL',           hint: 'https://linkedin.com/in/...' },
  { key: 'contact_github', label: 'GitHub URL',              hint: 'https://github.com/...' },
  { key: 'contact_sub',    label: 'Teks Sub',                hint: "Kalimat kecil di bawah judul Let's Connect", textarea: true },
]

const SECTIONS = [
  { key: 'hero',    label: 'Hero' },
  { key: 'about',   label: 'About' },
  { key: 'contact', label: 'Contact' },
]

const DEFAULT_STACK: SkillCat[] = [
  { icon: '⬡', label: 'Web',            skills: ['Laravel', 'PHP', 'JavaScript', 'HTML/CSS'] },
  { icon: '◈', label: 'Mobile & IoT',   skills: ['Flutter', 'Firebase', 'ESP32', 'IoT'] },
  { icon: '▣', label: 'Database',       skills: ['MySQL', 'Supabase', 'PostgreSQL'] },
  { icon: '✦', label: 'Tools & Design', skills: ['Figma', 'Git', 'Postman', 'VS Code'] },
]

const ICONS = ['⬡','◈','▣','✦','◆','⬢','✿','⊕','⊗','★']

export default function Admin() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [demoFiles, setDemoFiles] = useState<File[]>([])
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectSearch, setProjectSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [menu, setMenu] = useState<'projects' | 'experience' | 'certificates' | 'content' | 'stack'>('projects')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [certForm, setCertForm] = useState(EMPTY_CERT_FORM)
  const [certImageFile, setCertImageFile] = useState<File | null>(null)
  const [certImagePreview, setCertImagePreview] = useState<string | null>(null)
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null)
  const [isEditingCert, setIsEditingCert] = useState(false)
  const [content, setContent] = useState<Record<string, string>>({})
  const [savingField, setSavingField] = useState<string | null>(null)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [expForm, setExpForm] = useState({ date: '', role: '', org: '', description: '' })
  const [expImageFile, setExpImageFile] = useState<File | null>(null)
  const [expImagePreview, setExpImagePreview] = useState<string | null>(null)
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null)
  const [isEditingExp, setIsEditingExp] = useState(false)
  const [stack, setStack] = useState<SkillCat[]>(DEFAULT_STACK)
  const [savingStack, setSavingStack] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (!data.session) navigate('/login') })
    fetchProjects(); fetchExperiences(); fetchCertificates(); fetchContent()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
  }
  const fetchExperiences = async () => {
    const { data } = await supabase.from('experience').select('*').order('created_at', { ascending: false })
    if (data) setExperiences(data)
  }
  const fetchCertificates = async () => {
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false })
    if (data) setCertificates(data)
  }
  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('*')
    if (!data) return
    const map: Record<string, string> = {}
    data.forEach(item => { map[item.key] = item.value })
    CONTENT_FIELDS.forEach(f => { if (!(f.key in map)) map[f.key] = '' })
    setContent(map)
    // Load tech stack
    if (map.about_stack) {
      try {
        const parsed = JSON.parse(map.about_stack)
        if (Array.isArray(parsed)) setStack(parsed)
      } catch { /* pakai default */ }
    }
  }

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const uploadFile = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('project-media').upload(fileName, file)
    if (error) { console.error(error); return null }
    const { data } = supabase.storage.from('project-media').getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setThumbnailFile(file)
    if (file) setThumbPreview(URL.createObjectURL(file))
    else setThumbPreview(null)
  }

  const handleSelect = (p: Project) => {
    setSelectedId(p.id); setIsEditing(true)
    setForm({ title: p.title||'', type: p.type||'', github: p.github||'', demo: p.demo||'', tags: p.tags?.join(', ')||'', overview: p.details?.overview || '', problem: p.details?.problem || '', solution: p.details?.solution || '', features: p.details?.features?.join('\n') || '', process: p.details?.process?.join('\n') || '', challenges: p.details?.challenges?.join('\n') || '', result: p.details?.result || '' })
    setThumbPreview(p.thumbnail || null); setThumbnailFile(null); setDemoFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleSelectExperience = (exp: Experience) => {
    setSelectedExpId(exp.id); setIsEditingExp(true)
    setExpForm({ date: exp.date||'', role: exp.role||'', org: exp.org||'', description: exp.description||'' })
    setExpImagePreview(exp.image || null); setExpImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleSelectCertificate = (c: Certificate) => {
    setSelectedCertId(c.id); setIsEditingCert(true)
    setCertForm({ title: c.title||'', issuer: c.issuer||'', year: c.year||'' })
    setCertImagePreview(c.image || null); setCertImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleCertImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setCertImageFile(file)
    if (file) setCertImagePreview(URL.createObjectURL(file))
    else setCertImagePreview(null)
  }
  const handleCancelEditCert = () => {
    setSelectedCertId(null); setIsEditingCert(false); setCertForm(EMPTY_CERT_FORM)
    setCertImagePreview(null); setCertImageFile(null)
  }
  const handleExpImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setExpImageFile(file)
    if (file) setExpImagePreview(URL.createObjectURL(file))
    else setExpImagePreview(null)
  }
  const handleCancelEdit = () => {
    setSelectedId(null); setIsEditing(false); setForm(EMPTY_FORM)
    setThumbPreview(null); setThumbnailFile(null); setDemoFiles([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let thumbnailUrl = thumbPreview
      if (thumbnailFile) thumbnailUrl = await uploadFile(thumbnailFile)
      const uploadedDemoFiles = demoFiles.length > 0
        ? (await Promise.all(demoFiles.map(uploadFile))).filter(Boolean) : []
      const payload: any = {
        title: form.title.trim() || 'Untitled Project',
        type: form.type.trim() || 'Project',
        thumbnail: thumbnailUrl, github: form.github, demo: form.demo,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        details: {
          overview: form.overview.trim(), problem: form.problem.trim(), solution: form.solution.trim(),
          features: form.features.split('\n').map(t => t.trim()).filter(Boolean),
          process: form.process.split('\n').map(t => t.trim()).filter(Boolean),
          challenges: form.challenges.split('\n').map(t => t.trim()).filter(Boolean),
          result: form.result.trim(),
        },
        demo_files: uploadedDemoFiles
      }
      let error
      if (isEditing && selectedId) {
        const res = await supabase.from('projects').update(payload).eq('id', selectedId); error = res.error
      } else {
        const res = await supabase.from('projects').insert([payload]); error = res.error
      }
      if (error && /details|schema cache|column/i.test(error.message)) {
        const { details: _details, ...basicPayload } = payload
        if (isEditing && selectedId) {
          const res = await supabase.from('projects').update(basicPayload).eq('id', selectedId); error = res.error
        } else {
          const res = await supabase.from('projects').insert([basicPayload]); error = res.error
        }
      }
      if (error) { showToast(`Gagal simpan: ${error.message}`, false); return }
      showToast(isEditing ? 'Project berhasil diupdate!' : 'Project berhasil ditambahkan!')
      handleCancelEdit(); fetchProjects()
    } finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus project ini?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) { showToast('Gagal hapus project', false); return }
    setProjects(prev => prev.filter(p => p.id !== id))
    if (selectedId === id) handleCancelEdit()
    showToast('Project berhasil dihapus')
  }

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm('Hapus experience ini?')) return
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (error) { showToast('Gagal hapus experience', false); return }
    setExperiences(prev => prev.filter(e => e.id !== id))
    showToast('Experience berhasil dihapus')
  }

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm('Hapus sertifikat ini?')) return
    const { error } = await supabase.from('certificates').delete().eq('id', id)
    if (error) { showToast('Gagal hapus sertifikat', false); return }
    setCertificates(prev => prev.filter(c => c.id !== id))
    if (selectedCertId === id) handleCancelEditCert()
    showToast('Sertifikat berhasil dihapus')
  }

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certForm.title || !certForm.issuer) { showToast('Judul & penerbit wajib diisi', false); return }
    if (!isEditingCert && !certImageFile) { showToast('Upload gambar sertifikat', false); return }
    setLoading(true)
    try {
      let imageUrl = certImagePreview
      if (certImageFile) imageUrl = await uploadFile(certImageFile)
      const payload: any = { title: certForm.title, issuer: certForm.issuer, year: certForm.year, image: imageUrl }
      let error
      if (isEditingCert && selectedCertId) {
        const res = await supabase.from('certificates').update(payload).eq('id', selectedCertId); error = res.error
      } else {
        const res = await supabase.from('certificates').insert([payload]); error = res.error
      }
      if (error) { showToast('Gagal simpan sertifikat', false); return }
      showToast(isEditingCert ? 'Sertifikat berhasil diupdate!' : 'Sertifikat berhasil ditambahkan!')
      handleCancelEditCert(); fetchCertificates()
    } finally { setLoading(false) }
  }

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expForm.role || !expForm.org) { showToast('Role & organization wajib diisi', false); return }
    setLoading(true)
    try {
      let imageUrl = expImagePreview
      if (expImageFile) imageUrl = await uploadFile(expImageFile)
      const payload = { date: expForm.date, role: expForm.role, org: expForm.org, description: expForm.description, image: imageUrl }
      let error = null
      if (isEditingExp && selectedExpId) {
        const { error: ue } = await supabase.from('experience').update(payload).eq('id', selectedExpId); error = ue
      } else {
        const { error: ie } = await supabase.from('experience').insert([payload]); error = ie
      }
      if (error) { showToast('Gagal simpan experience', false); return }
      showToast(isEditingExp ? 'Experience berhasil diupdate!' : 'Experience berhasil ditambahkan!')
      setExpForm({ date: '', role: '', org: '', description: '' })
      setExpImagePreview(null); setExpImageFile(null)
      setSelectedExpId(null); setIsEditingExp(false)
      await fetchExperiences()
    } finally { setLoading(false) }
  }

  const saveOneField = async (key: string) => {
    const value = content[key] || ''
    setSavingField(key)
    const { error } = await supabase.from('site_content').upsert({ key, value }, { onConflict: 'key' })
    setSavingField(null)
    if (error) showToast('Gagal simpan', false)
    else showToast('Tersimpan ✓')
  }

  const saveSection = async (sectionKey: string, label: string) => {
    const fields = CONTENT_FIELDS.filter(f => f.key.startsWith(sectionKey))
    const rows = fields.map(f => ({ key: f.key, value: content[f.key] || '' }))
    setSavingSection(sectionKey)
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
    setSavingSection(null)
    if (error) showToast('Gagal simpan', false)
    else showToast(`Section ${label} tersimpan ✓`)
  }

  const saveAll = async () => {
    const rows = CONTENT_FIELDS.map(f => ({ key: f.key, value: content[f.key] || '' }))
    setLoading(true)
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
    setLoading(false)
    if (error) showToast('Gagal simpan semua', false)
    else showToast('Semua content tersimpan ✓')
  }

  // Tech Stack helpers
  const saveStack = async () => {
    setSavingStack(true)
    const { error } = await supabase.from('site_content').upsert(
      { key: 'about_stack', value: JSON.stringify(stack) },
      { onConflict: 'key' }
    )
    setSavingStack(false)
    if (error) showToast('Gagal simpan stack', false)
    else showToast('Tech Stack tersimpan ✓')
  }

  const addCat = () => setStack(s => [...s, { icon: '⬡', label: 'New Category', skills: [] }])
  const removeCat = (i: number) => setStack(s => s.filter((_, idx) => idx !== i))
  const updateCat = (i: number, field: keyof SkillCat, val: string) =>
    setStack(s => s.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  const updateSkills = (i: number, val: string) =>
    setStack(s => s.map((c, idx) => idx === i ? { ...c, skills: val.split(',').map(x => x.trim()).filter(Boolean) } : c))

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login') }
  const setField = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const filteredProjects = projects.filter(project =>
    `${project.title} ${project.type} ${(project.tags || []).join(' ')}`
      .toLowerCase()
      .includes(projectSearch.trim().toLowerCase())
  )

  return (
    <div className="admin-wrap">
      {toast && (
        <div className={`admin-toast ${toast.ok ? 'toast-ok' : 'toast-err'}`}>
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <header className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-brand-dot" />
          <div>
            <span className="admin-brand-name">Meysya</span>
            <span className="admin-brand-sub">PORTFOLIO ADMIN</span>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <Link to="/" className="admin-btn-ghost admin-preview-link">Lihat Portfolio <span aria-hidden="true">↗</span></Link>
          <button className="admin-btn-ghost admin-logout-btn" onClick={handleLogout}>Keluar</button>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-nav-heading">MENU UTAMA</div>
          <div className="admin-nav" role="navigation" aria-label="Navigasi admin">
            <button className={`admin-nav-item ${menu === 'projects' ? 'active' : ''}`} aria-pressed={menu === 'projects'} onClick={() => setMenu('projects')}>
              <span className="admin-nav-icon" aria-hidden="true">▣</span><span>Projects</span><span className="admin-nav-count">{projects.length}</span>
            </button>
            <button className={`admin-nav-item ${menu === 'experience' ? 'active' : ''}`} aria-pressed={menu === 'experience'} onClick={() => setMenu('experience')}>
              <span className="admin-nav-icon" aria-hidden="true">⌁</span><span>Experience</span><span className="admin-nav-count">{experiences.length}</span>
            </button>
            <button className={`admin-nav-item ${menu === 'certificates' ? 'active' : ''}`} aria-pressed={menu === 'certificates'} onClick={() => setMenu('certificates')}>
              <span className="admin-nav-icon" aria-hidden="true">◇</span><span>Certificates</span><span className="admin-nav-count">{certificates.length}</span>
            </button>
            <button className={`admin-nav-item ${menu === 'content' ? 'active' : ''}`} aria-pressed={menu === 'content'} onClick={() => setMenu('content')}>
              <span className="admin-nav-icon" aria-hidden="true">◉</span><span>Site Content</span>
            </button>
            <button className={`admin-nav-item ${menu === 'stack' ? 'active' : ''}`} aria-pressed={menu === 'stack'} onClick={() => setMenu('stack')}>
              <span className="admin-nav-icon" aria-hidden="true">✦</span><span>Tech Stack</span>
            </button>
          </div>
          <div className="admin-sidebar-note">
            <span className="admin-status-dot" />
            <span>Dashboard aktif</span>
          </div>
        </aside>

        <main className="admin-body">
        <div className="admin-page-heading">
          <div>
            <div className="admin-panel-label">PORTFOLIO WORKSPACE</div>
            <h1>{menu === 'projects' ? 'Projects' : menu === 'experience' ? 'Experience' : menu === 'certificates' ? 'Certificates' : menu === 'content' ? 'Site Content' : 'Tech Stack'}</h1>
            <p>Kelola konten yang tampil di portfolio kamu.</p>
          </div>
          <span className="admin-page-context">MEYSYA / ADMIN</span>
        </div>

        {menu === 'projects' && (
          <>
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-label">{isEditing ? 'EDIT PROJECT' : 'ADD PROJECT'}</div>
                <h2 className="admin-panel-title">{isEditing ? 'Edit Project' : 'Tambah Project Baru'}</h2>
                {isEditing && <button className="admin-cancel-btn" onClick={handleCancelEdit}>✕ Batal Edit</button>}
              </div>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label className="admin-label">Project Title *</label>
                    <input className="admin-input" type="text" placeholder="e.g. Website Sekolah" value={form.title} onChange={setField('title')} required />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Project Type *</label>
                    <input className="admin-input" type="text" placeholder="e.g. Web Development" value={form.type} onChange={setField('type')} required />
                  </div>
                </div>
                <details className="admin-optional-details" open={isEditing}>
                  <summary><span>Detail project tambahan</span><small>Opsional · isi yang tersedia saja</small></summary>
                  <div className="admin-detail-fields">
                    <div className="admin-field"><label className="admin-label">Overview</label><textarea className="admin-input admin-textarea" placeholder="Gambaran umum project..." value={form.overview} onChange={setField('overview')} /></div>
                    <div className="admin-field"><label className="admin-label">Problem</label><textarea className="admin-input admin-textarea" placeholder="Masalah yang ingin diselesaikan..." value={form.problem} onChange={setField('problem')} /></div>
                    <div className="admin-field"><label className="admin-label">Solution</label><textarea className="admin-input admin-textarea" placeholder="Solusi yang kamu buat..." value={form.solution} onChange={setField('solution')} /></div>
                    <div className="admin-field"><label className="admin-label">Features <span className="admin-field-hint">(satu per baris)</span></label><textarea className="admin-input admin-textarea" placeholder="Login\nDashboard\nExport data" value={form.features} onChange={setField('features')} /></div>
                    <div className="admin-field"><label className="admin-label">Development Process <span className="admin-field-hint">(satu per baris)</span></label><textarea className="admin-input admin-textarea" placeholder="Analisis kebutuhan\nMembuat desain\nTesting" value={form.process} onChange={setField('process')} /></div>
                    <div className="admin-field"><label className="admin-label">Challenges <span className="admin-field-hint">(satu per baris)</span></label><textarea className="admin-input admin-textarea" placeholder="Tantangan selama pengerjaan..." value={form.challenges} onChange={setField('challenges')} /></div>
                    <div className="admin-field"><label className="admin-label">Result</label><textarea className="admin-input admin-textarea" placeholder="Hasil akhir project..." value={form.result} onChange={setField('result')} /></div>
                  </div>
                </details>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label className="admin-label">GitHub Link</label>
                    <input className="admin-input" type="text" placeholder="https://github.com/..." value={form.github} onChange={setField('github')} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Live Demo Link</label>
                    <input className="admin-input" type="text" placeholder="https://..." value={form.demo} onChange={setField('demo')} />
                  </div>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Tags <span style={{ opacity: .5, fontWeight: 400 }}>(pisahkan koma)</span></label>
                  <input className="admin-input" type="text" placeholder="Laravel, MySQL, PHP" value={form.tags} onChange={setField('tags')} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Thumbnail / Video</label>
                  <input type="file" accept="image/*,video/*" onChange={handleThumbChange} className="admin-input" />
                  {thumbPreview && (
                    thumbPreview.match(/\.(mp4|webm|ogg|mov)$/i)
                      ? <video src={thumbPreview} controls className="admin-thumb-preview" style={{ marginTop: '12px' }} />
                      : <img src={thumbPreview} alt="preview" className="admin-thumb-preview" style={{ marginTop: '12px' }} />
                  )}
                </div>
                <button type="submit" className={`admin-submit ${isEditing ? 'editing' : ''}`} disabled={loading}>
                  {loading ? <span className="admin-spinner" /> : isEditing ? '✓ Simpan Perubahan' : '+ Tambah Project'}
                </button>
              </form>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-label">MANAGE</div>
                <h2 className="admin-panel-title">Daftar Project <span className="admin-count">{projects.length}</span></h2>
              </div>
              <label className="admin-search">
                <span aria-hidden="true">⌕</span>
                <input type="search" value={projectSearch} onChange={e => setProjectSearch(e.target.value)} placeholder="Cari nama, kategori, atau tag..." aria-label="Cari project" />
                {projectSearch && <button type="button" onClick={() => setProjectSearch('')} aria-label="Hapus pencarian">×</button>}
              </label>
              <div className="admin-project-list">
                {projects.length === 0 && <div className="admin-empty">Belum ada project. Tambahkan project pertamamu lewat form.</div>}
                {projects.length > 0 && filteredProjects.length === 0 && <div className="admin-empty">Project tidak ditemukan. Coba kata kunci lain.</div>}
                {filteredProjects.map(p => (
                  <div key={p.id} className={`admin-project-item ${selectedId === p.id ? 'selected' : ''}`} onClick={() => handleSelect(p)}>
                    <div className="admin-project-thumb">
                      {p.thumbnail ? <img src={p.thumbnail} alt={p.title} /> : <span>{p.title.charAt(0)}</span>}
                    </div>
                    <div className="admin-project-info">
                      <div className="admin-project-name">{p.title}</div>
                      <div className="admin-project-type">{p.type}</div>
                    </div>
                    <div className="admin-item-actions">
                      <div className="admin-edit-hint">{selectedId === p.id ? '✎ editing' : 'klik edit'}</div>
                      <button className="admin-delete-btn" onClick={e => { e.stopPropagation(); handleDelete(p.id) }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {menu === 'experience' && (
          <>
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-label">{isEditingExp ? 'EDIT EXPERIENCE' : 'ADD EXPERIENCE'}</div>
                <h2 className="admin-panel-title">{isEditingExp ? 'Edit Experience' : 'Tambah Experience'}</h2>
                {isEditingExp && <button className="admin-cancel-btn" onClick={() => { setSelectedExpId(null); setIsEditingExp(false); setExpForm({ date: '', role: '', org: '', description: '' }) }}>✕ Batal Edit</button>}
              </div>
              <form onSubmit={handleExperienceSubmit} className="admin-form">
                <div className="admin-field">
                  <label className="admin-label">Date</label>
                  <input className="admin-input" type="text" placeholder="2024 — now" value={expForm.date} onChange={e => setExpForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Role *</label>
                  <input className="admin-input" type="text" placeholder="Frontend Developer" value={expForm.role} onChange={e => setExpForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Organization *</label>
                  <input className="admin-input" type="text" placeholder="Company / Organization" value={expForm.org} onChange={e => setExpForm(f => ({ ...f, org: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Description</label>
                  <textarea className="admin-input admin-textarea" value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Foto Experience</label>
                  <input type="file" accept="image/*" onChange={handleExpImageChange} className="admin-input" />
                  {expImagePreview && <img src={expImagePreview} alt="preview experience" className="admin-thumb-preview" style={{ marginTop: '12px' }} />}
                </div>
                <button type="submit" className={`admin-submit ${isEditingExp ? 'editing' : ''}`} disabled={loading}>
                  {loading ? <span className="admin-spinner" /> : isEditingExp ? '✓ Save Experience' : '+ Add Experience'}
                </button>
              </form>
            </div>
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-label">EXPERIENCE LIST</div>
                <h2 className="admin-panel-title">Experiences <span className="admin-count">{experiences.length}</span></h2>
              </div>
              <div className="admin-project-list">
                {experiences.length === 0 && <div className="admin-empty">Belum ada experience</div>}
                {experiences.map(exp => (
                  <div key={exp.id} className={`admin-project-item ${selectedExpId === exp.id ? 'selected' : ''}`} onClick={() => handleSelectExperience(exp)}>
                    <div className="admin-project-info">
                      <div className="admin-project-name">{exp.role}</div>
                      <div className="admin-project-type">{exp.org}</div>
                      <div className="admin-edit-hint">{exp.date}</div>
                    </div>
                    <button className="admin-delete-btn" onClick={e => { e.stopPropagation(); handleDeleteExperience(exp.id) }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {menu === 'certificates' && (
          <>
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-label">{isEditingCert ? 'EDIT CERTIFICATE' : 'ADD CERTIFICATE'}</div>
                <h2 className="admin-panel-title">{isEditingCert ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</h2>
                {isEditingCert && <button className="admin-cancel-btn" onClick={handleCancelEditCert}>✕ Batal Edit</button>}
              </div>
              <form onSubmit={handleCertSubmit} className="admin-form">
                <div className="admin-field">
                  <label className="admin-label">Judul Sertifikat *</label>
                  <input className="admin-input" type="text" placeholder="e.g. Belajar Dasar AI" value={certForm.title} onChange={e => setCertForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label className="admin-label">Penerbit *</label>
                    <input className="admin-input" type="text" placeholder="e.g. Dicoding" value={certForm.issuer} onChange={e => setCertForm(f => ({ ...f, issuer: e.target.value }))} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Tahun</label>
                    <input className="admin-input" type="text" placeholder="2026" value={certForm.year} onChange={e => setCertForm(f => ({ ...f, year: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Gambar Sertifikat {!isEditingCert && '*'}</label>
                  <input type="file" accept="image/*" onChange={handleCertImageChange} className="admin-input" />
                  {certImagePreview && (
                    <img src={certImagePreview} alt="preview" className="admin-thumb-preview" style={{ marginTop: '12px' }} />
                  )}
                </div>
                <button type="submit" className={`admin-submit ${isEditingCert ? 'editing' : ''}`} disabled={loading}>
                  {loading ? <span className="admin-spinner" /> : isEditingCert ? '✓ Simpan Perubahan' : '+ Tambah Sertifikat'}
                </button>
              </form>
            </div>
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-label">MANAGE</div>
                <h2 className="admin-panel-title">Certificate List <span className="admin-count">{certificates.length}</span></h2>
              </div>
              <div className="admin-project-list">
                {certificates.length === 0 && <div className="admin-empty">Belum ada sertifikat</div>}
                {certificates.map(c => (
                  <div key={c.id} className={`admin-project-item ${selectedCertId === c.id ? 'selected' : ''}`} onClick={() => handleSelectCertificate(c)}>
                    <div className="admin-project-thumb">
                      {c.image ? <img src={c.image} alt={c.title} /> : <span>{c.title.charAt(0)}</span>}
                    </div>
                    <div className="admin-project-info">
                      <div className="admin-project-name">{c.title}</div>
                      <div className="admin-project-type">{c.issuer} {c.year && `· ${c.year}`}</div>
                    </div>
                    <div className="admin-item-actions">
                      <div className="admin-edit-hint">{selectedCertId === c.id ? '✎ editing' : 'klik edit'}</div>
                      <button className="admin-delete-btn" onClick={e => { e.stopPropagation(); handleDeleteCertificate(c.id) }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {menu === 'content' && (
          <div className="admin-wide-content">
            {SECTIONS.map(sec => {
              const fields = CONTENT_FIELDS.filter(f => f.key.startsWith(sec.key))
              return (
                <div key={sec.key} className="admin-panel admin-content-panel">
                  <div className="admin-panel-header admin-wide-header">
                    <div>
                      <div className="admin-panel-label">{sec.label.toUpperCase()} SECTION</div>
                      <h2 className="admin-panel-title">Edit {sec.label}</h2>
                    </div>
                    <button
                      className="admin-submit admin-action-btn"
                      onClick={() => saveSection(sec.key, sec.label)}
                      disabled={savingSection === sec.key}
                    >
                      {savingSection === sec.key ? <span className="admin-spinner" /> : `Simpan ${sec.label}`}
                    </button>
                  </div>

                  <div className="admin-form">
                    {fields.map(field => (
                      <div key={field.key} className="admin-field">
                        <label className="admin-label">
                          {field.label}
                          {field.hint && (
                            <span style={{ display: 'block', fontWeight: 400, opacity: .5, fontSize: '10px', marginTop: '2px', letterSpacing: '.05em', textTransform: 'none' }}>
                              {field.hint}
                            </span>
                          )}
                        </label>
                        <div className="admin-field-save-row">
                          {field.textarea ? (
                            <textarea
                              className="admin-input admin-textarea"
                              style={{ minHeight: field.key === 'about_bio' ? '100px' : '70px' }}
                              value={content[field.key] || ''}
                              onChange={e => setContent(prev => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          ) : (
                            <input
                              className="admin-input"
                              type="text"
                              value={content[field.key] || ''}
                              onChange={e => setContent(prev => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          )}
                          <button
                            onClick={() => saveOneField(field.key)}
                            disabled={savingField === field.key}
                            className="admin-small-save"
                          >
                            {savingField === field.key ? '...' : 'simpan'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            <div className="admin-save-all-wrap">
              <button className="admin-submit admin-save-all" onClick={saveAll} disabled={loading}>
                {loading ? <span className="admin-spinner" /> : '✓ Simpan Semua Sekaligus'}
              </button>
            </div>
          </div>
        )}

        {menu === 'stack' && (
          <div className="admin-wide-content">
            <div className="admin-panel">
              <div className="admin-panel-header admin-wide-header">
                <div>
                  <div className="admin-panel-label">ABOUT SECTION</div>
                  <h2 className="admin-panel-title">Edit Tech Stack</h2>
                  <p className="admin-panel-description">
                    Edit kategori dan skill yang tampil di section About
                  </p>
                </div>
                <div className="admin-stack-actions">
                  <button
                    onClick={addCat}
                    className="admin-add-category-btn"
                  >
                    + Kategori
                  </button>
                  <button
                    className="admin-submit admin-action-btn"
                    onClick={saveStack}
                    disabled={savingStack}
                  >
                    {savingStack ? <span className="admin-spinner" /> : 'Simpan Stack'}
                  </button>
                </div>
              </div>

              <div className="admin-stack-list">
                {stack.map((cat, i) => (
                  <div key={i} className="admin-stack-card">

                    {/* Delete cat button */}
                    <button
                      onClick={() => removeCat(i)}
                      className="admin-delete-btn admin-stack-delete"
                    >✕</button>

                    <div className="admin-stack-top">
                      {/* Icon picker */}
                      <div className="admin-field">
                        <label className="admin-label">Icon</label>
                        <select
                          value={cat.icon}
                          onChange={e => updateCat(i, 'icon', e.target.value)}
                          className="admin-input admin-stack-select"
                        >
                          {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                      {/* Label */}
                      <div className="admin-field">
                        <label className="admin-label">Nama Kategori</label>
                        <input
                          className="admin-input"
                          type="text"
                          value={cat.label}
                          onChange={e => updateCat(i, 'label', e.target.value)}
                          placeholder="e.g. Web Development"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="admin-field">
                      <label className="admin-label">
                        Skills
                        <span style={{ display: 'block', fontWeight: 400, opacity: .5, fontSize: '10px', marginTop: '2px', letterSpacing: '.05em', textTransform: 'none' }}>
                          Pisahkan dengan koma — misal: Laravel, PHP, JavaScript
                        </span>
                      </label>
                      <input
                        className="admin-input"
                        type="text"
                        value={cat.skills.join(', ')}
                        onChange={e => updateSkills(i, e.target.value)}
                        placeholder="Laravel, PHP, JavaScript, HTML/CSS"
                      />
                      {/* Preview pills */}
                      {cat.skills.length > 0 && (
                        <div className="admin-skill-preview">
                          {cat.skills.map(s => (
                            <span key={s} className="admin-skill-chip">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  )
}