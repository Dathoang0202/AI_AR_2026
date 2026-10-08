/** Shared drawings for the wardrobe, the mannequin and saved outfits. */
export function ConicalHat({ id }: { id: string }) {
  const fill = (name: string) => `url(#${id}-${name})`;
  const cone = 'M178 24Q176 23 174 26L103 78Q180 108 257 78Z';
  return <g data-accessory-drawing="non-la">
    <defs>
      <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2=".45"><stop stopColor="#BEA36C" /><stop offset=".32" stopColor="#F1E3B4" /><stop offset=".6" stopColor="#E8D6A1" /><stop offset="1" stopColor="#C3A36D" /></linearGradient>
      <linearGradient id={`${id}-inside`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#AF8F57" /><stop offset=".65" stopColor="#D5B97E" /><stop offset="1" stopColor="#E9D5A3" /></linearGradient>
      <linearGradient id={`${id}-ribbon`}><stop stopColor="#544659" /><stop offset=".5" stopColor="#A6879F" /><stop offset="1" stopColor="#69536B" /></linearGradient>
      <clipPath id={`${id}-cone`}><path d={cone} /></clipPath>
    </defs>
    {/* The silk strap passes beside the head and hangs beneath the chin. */}
    <path data-hat-strap d="M139 82C143 108 154 127 178 133C201 137 219 109 222 82" fill="none" stroke="#493D4B" strokeWidth="3.5" />
    <path d="M140 83C145 109 155 126 178 131C201 135 216 109 221 83" fill="none" stroke={fill('ribbon')} strokeWidth="2.6" />
    <path d="M203 121Q216 115 215 126Q211 131 203 124L211 142L205 139L201 124Q194 137 190 129Q190 123 203 121Z" fill={fill('ribbon')} stroke="#675366" strokeWidth=".6" />
    <ellipse data-hat-brim cx="180" cy="78" rx="77" ry="16" fill={fill('inside')} stroke="#937543" strokeWidth="1.2" />
    <ellipse cx="180" cy="79" rx="62" ry="11.3" fill="none" stroke="#AA8A50" strokeWidth=".7" />
    <path d={cone} fill={fill('leaf')} stroke="#A48A58" strokeWidth=".7" strokeLinejoin="round" />
    <g clipPath={fill('cone')} fill="none">
      {/* Fine circular bamboo hoops, not umbrella-like thick radial panels. */}
      {[.18,.28,.38,.48,.58,.68,.78,.88,.97].map(t => {
        const x=178-75*t, y=24+54*t;
        return <g key={t}><path d={`M${x} ${y}Q180 ${y+31*t} ${178+79*t} ${y}`} stroke="#A78953" strokeWidth=".6" opacity=".5" /><path d={`M${x} ${y-1}Q180 ${y+31*t-1} ${178+79*t} ${y-1}`} stroke="#FFF1C6" strokeWidth=".55" opacity=".75" /></g>;
      })}
      {[113,132,151,172,193,213,233,250].map(x => <path key={x} d={`M177 25Q${178+(x-178)*.4} 53 ${x} ${93-Math.abs(x-180)*.15}`} stroke="#AA9160" strokeWidth=".45" opacity=".4" />)}
    </g>
    <path d="M103 78Q180 108 257 78" fill="none" stroke="#8F7446" strokeWidth="2" />
    <path d="M105 77Q180 105 255 77" fill="none" stroke="#F6E8BD" strokeWidth="1.2" />
    <path d="M172 28Q177 25 182 29" fill="none" stroke="#F6E8BD" strokeWidth=".9" />
  </g>;
}

export function FoldingFan({ id }: { id: string }) {
  const polar = (angle: number, radius: number) => {
    const a = angle * Math.PI / 180;
    return [Math.sin(a)*radius, -Math.cos(a)*radius];
  };
  const point = (angle: number, radius: number) => polar(angle,radius).map(n=>n.toFixed(2)).join(' ');
  const sector = (from: number, to: number) => `M${point(from,64)}A64 64 0 0 1 ${point(to,64)}L${point(to,24)}A24 24 0 0 0 ${point(from,24)}Z`;
  return <g data-accessory-drawing="quat-xep">
    <defs><linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#F6EAD0" /><stop offset=".65" stopColor="#E4CFA4" /><stop offset="1" stopColor="#C9AF7C" /></linearGradient></defs>
    {/* A broad folding fan: open bamboo sticks below the paper's inner arc. */}
    <path d={sector(-78,78)} fill={`url(#${id}-paper)`} stroke="#9B8050" strokeWidth=".8" />
    {Array.from({length:18},(_,i)=>-78+i*(156/18)).map((a,i)=><path key={i} d={sector(a,a+156/18)} fill={i%2?'#FFF5DD':'#947340'} opacity={i%2?.28:.12} />)}
    {Array.from({length:19},(_,i)=>-78+i*(156/18)).map((a,i)=><g key={i}><path d={`M0 0L${point(a,62.5)}`} stroke="#9B8155" strokeWidth=".55" opacity=".7" /><path data-fan-rib d={`M0 0L${point(a,24)}`} stroke="#B99C68" strokeWidth="2.3" /><path d={`M0 0L${point(a,24)}`} stroke="#F0DCB5" strokeWidth=".85" /></g>)}
    <path d={`M${point(-78,63)}A63 63 0 0 1 ${point(78,63)}`} fill="none" stroke="#CCB280" strokeWidth="2" />
    {/* A restrained botanical motif keeps the pleats readable at thumbnail size. */}
    <g fill="none" stroke="#6F7A60" strokeWidth=".9" opacity=".7"><path d="M-29-30Q-13-34-6-52M-15-39Q-23-49-26-45M-11-44Q-6-45-1-43" /><path d="M-19-36Q-29-42-32-36Q-25-32-19-36M-13-41Q-21-50-22-43Q-17-38-13-41M-9-47Q-4-57-2-51Q-3-46-9-47" fill="#8F9978" /></g>
    {[-78,78].map(a=><path key={a} d={`M0 1L${point(a,65)}`} stroke="#856337" strokeWidth="2.5" strokeLinecap="round" />)}
    <circle cy="0" r="3.2" fill="#AC8650" stroke="#6E522C" strokeWidth=".7" /><circle cy="0" r="1" fill="#E6CD9D" />
    <path d="M1 4Q10 11 5 16" stroke="#866753" fill="none" strokeWidth="1" /><path d="M3 15L1 24M5 16V26M7 15L9 24" stroke="#B48D6F" strokeWidth="1.3" />
  </g>;
}

export function WrappedHeadwear({ kind, fabric, seam, trim, light }: {
  kind:'man'|'khan-dong'; fabric:string; seam:string; trim:string; light:string;
}) {
  return kind === 'man' ? <g data-accessory-drawing="man"><path d="M151 72C143 19 217 19 209 72L201 79C204 38 156 38 159 79Z" fill={fabric} stroke={seam} strokeWidth=".8" /><path d="M153 66C150 27 210 27 207 66" fill="none" stroke={trim} strokeWidth="2" /><path d="M156 68C153 33 207 33 204 68" fill="none" stroke={light} strokeWidth="1" /></g>
    : <g data-accessory-drawing="khan-dong"><path d="M152 53C151 40 209 40 208 53L209 72Q180 84 151 72Z" fill="#353631" stroke="#242622" strokeWidth=".8" /><ellipse cx="180" cy="51" rx="28" ry="8" fill="#52534B" /><path d="M153 56Q180 68 207 56M153 62Q180 74 207 62M154 68Q180 79 206 68" fill="none" stroke="#939385" strokeWidth="1" /><path d="M175 54L181 68L187 55" fill="none" stroke="#A4A18E" strokeWidth="1.4" /></g>;
}
