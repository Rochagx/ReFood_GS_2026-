
export default function HeroIlustracao({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 440"
      className={className}
      role="img"
      aria-label="Ilustração de uma máquina ReFood com alimentos nas prateleiras e um celular mostrando o QR Code de retirada"
    >
      <circle cx="250" cy="220" r="200" fill="#ecfdf3" />
      <circle cx="402" cy="86" r="34" fill="#fff4ec" />

      <rect x="150" y="40" width="210" height="370" rx="20" fill="#15803d" />
      <rect x="150" y="40" width="210" height="44" rx="20" fill="#166534" />
      <rect x="150" y="64" width="210" height="20" fill="#166534" />
      <text x="255" y="70" textAnchor="middle" fill="#fff" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="20">
        ReFood
      </text>

      <rect x="166" y="98" width="128" height="232" rx="10" fill="#f7fdf9" />
      {[156, 214, 272].map((y) => (
        <rect key={y} x="166" y={y} width="128" height="5" fill="#bbe5cb" />
      ))}

      <ellipse cx="196" cy="140" rx="20" ry="13" fill="#f59e0b" />
      <path d="M184 136q6-6 12 0M196 136q6-6 12 0" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="252" cy="142" rx="24" ry="11" fill="#fbbf24" />

      <circle cx="188" cy="198" r="12" fill="#ef4444" />
      <circle cx="214" cy="200" r="11" fill="#84cc16" />
      <circle cx="238" cy="198" r="12" fill="#f97316" />
      <circle cx="265" cy="200" r="11" fill="#ef4444" />
      <path d="M188 186v-5M214 189v-5M238 186v-5M265 189v-5" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />

      <rect x="180" y="226" width="16" height="44" rx="5" fill="#38bdf8" />
      <rect x="184" y="219" width="8" height="9" rx="2" fill="#0284c7" />
      <rect x="206" y="240" width="30" height="30" rx="6" fill="#fde68a" />
      <rect x="206" y="236" width="30" height="8" rx="3" fill="#f59e0b" />
      <rect x="246" y="230" width="34" height="40" rx="6" fill="#fda4af" />

      <path d="M180 320l22-30 22 30z" fill="#fcd34d" />
      <path d="M232 320l22-30 22 30z" fill="#fcd34d" />
      <path d="M186 312h32M238 312h32" stroke="#84cc16" strokeWidth="4" />

      <rect x="168" y="102" width="40" height="18" rx="9" fill="#ea580c" />
      <text x="188" y="115" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10">
        -50%
      </text>

      <rect x="304" y="98" width="42" height="56" rx="8" fill="#0f1f17" />
      <g fill="#86efac">
        <rect x="312" y="106" width="8" height="8" />
        <rect x="330" y="106" width="8" height="8" />
        <rect x="312" y="138" width="8" height="8" />
        <rect x="322" y="122" width="6" height="6" />
        <rect x="330" y="134" width="8" height="8" />
      </g>
      {[0, 1, 2].map((linha) =>
        [0, 1, 2].map((col) => (
          <circle key={linha + "-" + col} cx={313 + col * 12} cy={176 + linha * 14} r="4" fill="#bbf7d0" />
        )),
      )}
      <rect x="306" y="230" width="38" height="8" rx="4" fill="#0f1f17" />

      {/* gaveta de retirada */}
      <rect x="166" y="346" width="180" height="44" rx="10" fill="#0f1f17" />
      <rect x="178" y="358" width="156" height="8" rx="4" fill="#1f3a2c" />

      {/* celular com QR */}
      <g transform="rotate(-8 105 330)">
        <rect x="52" y="236" width="104" height="186" rx="16" fill="#0f1f17" />
        <rect x="60" y="250" width="88" height="158" rx="10" fill="#fff" />
        <rect x="70" y="262" width="68" height="68" rx="4" fill="#ecfdf3" />
        <g fill="#0f1f17">
          <rect x="76" y="268" width="18" height="18" />
          <rect x="114" y="268" width="18" height="18" />
          <rect x="76" y="306" width="18" height="18" />
          <rect x="100" y="290" width="8" height="8" />
          <rect x="114" y="306" width="8" height="8" />
          <rect x="124" y="316" width="8" height="8" />
          <rect x="100" y="306" width="6" height="14" />
        </g>
        <rect x="72" y="342" width="64" height="8" rx="4" fill="#bbe5cb" />
        <rect x="72" y="358" width="64" height="26" rx="8" fill="#15803d" />
        <text x="104" y="375" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10">
          Retirar
        </text>
      </g>

      {/* selo de impacto */}
      <g>
        <rect x="330" y="300" width="128" height="56" rx="14" fill="#fff" stroke="#e3e9e6" />
        <circle cx="356" cy="328" r="14" fill="#ecfdf3" />
        <path d="M350 329l4 4 8-9" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="378" y="324" fill="#0f1f17" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12">
          Alimento
        </text>
        <text x="378" y="340" fill="#5b6b63" fontFamily="Inter, sans-serif" fontSize="11">
          salvo!
        </text>
      </g>
    </svg>
  );
}
