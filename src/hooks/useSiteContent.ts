import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Content = Record<string, string>

export function useSiteContent() {
  const [content, setContent] = useState<Content>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .then(({ data }) => {
        if (data) {
          const map: Content = {}
          data.forEach(row => { map[row.key] = row.value })
          setContent(map)
        }
        setLoading(false)
      })
  }, [])

  return { content, loading }
}