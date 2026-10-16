import { Layers3 } from 'lucide-react'
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <span className="brand-symbol">
        <Layers3 size={22} strokeWidth={2.4} />
      </span>
      <span>
        rewards<span className="brand-iq">IQ</span>
        <span className="brand-dot">.</span>
      </span>
    </div>
  )
}
