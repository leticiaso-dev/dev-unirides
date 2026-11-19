import { useNavigate } from 'react-router-dom'

// Ilustração de mapa do topo das telas: quarteirões e uma rota tracejada
// entre o ponto de saída (verde) e o destino (verde-escuro).
// "voltar" mostra o botão ‹ no canto; "altura" muda o tamanho do mapa.
export default function Mapa({ voltar, altura }) {
  const navigate = useNavigate()
  let h = 220
  if (altura) {
    h = altura
  }

  return (
    <div className="mapa">
      <svg viewBox={'0 0 430 ' + h} preserveAspectRatio="xMidYMid slice">
        <rect width="430" height={h} fill="#d3ece4" />
        <rect x="22" y="20" width="110" height="62" rx="12" fill="#e8f5f0" />
        <rect x="160" y="20" width="120" height="58" rx="12" fill="#e8f5f0" />
        <rect x="22" y="104" width="100" height="78" rx="12" fill="#e8f5f0" />
        <rect x="150" y="122" width="120" height="70" rx="12" fill="#e8f5f0" />
        <rect x="300" y="96" width="100" height="86" rx="12" fill="#e8f5f0" />
        <path d={'M 80 ' + (h - 70) + ' C 200 ' + (h - 70) + ', 300 ' + (h - 90) + ', 330 60'}
          fill="none" stroke="#12a88e" strokeWidth="3" strokeDasharray="10 8" />
        <circle cx="80" cy={h - 70} r="9" fill="#12a88e" stroke="#fff" strokeWidth="3" />
        <circle cx="330" cy="60" r="9" fill="#0f5c4f" stroke="#fff" strokeWidth="3" />
      </svg>
      {voltar && (
        <button className="voltar" onClick={() => navigate(-1)} aria-label="Voltar">‹</button>
      )}
    </div>
  )
}
