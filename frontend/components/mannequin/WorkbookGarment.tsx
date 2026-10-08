import type { ReactNode } from 'react';

// Each cut keeps its construction while fitting the mannequin's shoulders.
// Court decoration is illustrative: it does not assert a particular rank or reign.
export function workbookCut(kind: string, male: boolean) {
  const shoulder = male ? 55 : 43;
  const waist = male ? 38 : 28;
  const sleeveless = kind === 'ao-yem' || kind === 'tran-thu';
  const narrow = ['co-man', 'vat-ho', 'ngu-lam', 'thu-kham'].includes(kind) || sleeveless;
  return { shoulder, waist, left: 180 - shoulder, right: 180 + shoulder,
    handX: 180 - shoulder - (narrow ? 4 : 28), narrow, sleeveless };
}

function mix(hex: string, target: string, amount: number) {
  const base = /^#[\da-f]{6}$/i.test(hex) ? hex : '#8D3025';
  return '#' + [1, 3, 5].map(i => Math.round(parseInt(base.slice(i, i + 2), 16) * (1 - amount)
    + parseInt(target.slice(i, i + 2), 16) * amount).toString(16).padStart(2, '0')).join('');
}

export function WorkbookGarment({ kind, male, color, id, showCrown = true }: {
  kind: string; male: boolean; color: string; id: string; showCrown?: boolean;
}) {
  const { left: l, right: r, waist, narrow, sleeveless } = workbookCut(kind, male);
  const court = ['bo-tu', 'con-mien', 'hoang-bao', 'mang-bao', 'phuong-bao', 'bien-phuc'].includes(kind);
  const imperial = ['hoang-bao', 'mang-bao', 'phuong-bao'].includes(kind);
  const short = ['tran-thu', 'vat-ho', 'ngu-lam'].includes(kind);
  const hem = kind === 'tran-thu' ? 282 : kind === 'vat-ho' ? 325 : kind === 'ngu-lam' ? 339 : kind === 'thu-kham' ? 443 : 478;
  const flare = short ? 1 : kind === 'thu-kham' ? 12 : court ? 30 : kind === 'doi-kham' ? 25 : 21;
  const hL = l - flare, hR = r + flare;
  const shade = mix(color, '#201A18', .38), deep = mix(color, '#181719', .58);
  const light = mix(color, '#F9EBD1', .2);
  const seam = mix(color, '#2D251E', .48);
  const baseColor = /^#[\da-f]{6}$/i.test(color) ? color : '#8D3025';
  const brightness = parseInt(baseColor.slice(1, 3), 16) * .299 + parseInt(baseColor.slice(3, 5), 16) * .587 + parseInt(baseColor.slice(5, 7), 16) * .114;
  const gold = brightness > 155 ? '#8B6734' : '#CEAD6D';
  const pearl = brightness > 155 ? '#A48143' : '#E7D5A2';
  const fill = (name: string) => `url(#${id}-${name})`;
  // Unlike a fitted ao dai, a robe falls from the shoulder with room at the waist.
  const robe = `M${l} 146Q153 139 165 137Q180 147 195 137Q207 139 ${r} 146C${r + 3} 188 ${r - 2} 223 ${r - 3} 263Q${r + 8} 370 ${hR} ${hem - 4}Q180 ${hem + 13} ${hL} ${hem - 4}Q${l - 8} 370 ${l + 3} 263C${l + 2} 223 ${l - 3} 188 ${l} 146Z`;
  const shortBody = `M${l} 146Q155 138 166 137Q180 148 194 137Q205 138 ${r} 146C${r + 2} 192 ${180 + waist + 7} 225 ${r - 2} ${hem - 6}Q180 ${hem + 7} ${l + 2} ${hem - 6}C${180 - waist - 7} 225 ${l - 2} 192 ${l} 146Z`;
  const vest = `M${l + 9} 147L165 140Q180 166 195 140L${r - 9} 147Q${r - 20} 179 ${r - 5} 200L${r - 4} 278Q180 286 ${l + 4} 278L${l + 5} 200Q${l + 20} 179 ${l + 9} 147Z`;
  const body = kind === 'tran-thu' ? vest : short ? shortBody : robe;
  const sleeve = narrow
    ? `M${l + 8} 146C${l - 10} 144 ${l - 19} 180 ${l - 20} 226L${l - 14} 302Q${l - 3} 307 ${l + 6} 302L${l + 3} 236Q${l + 9} 199 ${l + 16} 164Z`
    : `M${l + 8} 146C${l - 17} 143 ${l - 35} 191 ${l - 48} 233L${l - 59} 278Q${l - 49} 292 ${l - 24} 307Q${l - 16} ${court ? 365 : 344} ${l + 8} ${court ? 376 : 356}L${l + 19} 329Q${l + 8} 233 ${l + 17} 164Z`;
  const cuff = narrow ? `M${l - 13} 294Q${l - 4} 299 ${l + 5} 295` : `M${l - 56} 277Q${l - 45} 292 ${l - 24} 300`;

  function Cloth({ d, children, fabric = 'cloth' }: { d: string; children?: ReactNode; fabric?: string }) {
    return <g><path d={d} fill={fill(fabric)} stroke={seam} strokeWidth=".65" strokeLinejoin="round" /><path d={d} fill={fill('weave')} opacity=".065" />{children}</g>;
  }

  function Folds({ end = hem, top = 251 }: { end?: number; top?: number }) {
    return <g fill="none" strokeLinecap="round">
      {[-.83, -.45, .18, .65, .9].map((n, i) => {
        const x = 180 + n * (r - 180), bottom = 180 + n * (hR - 180 - 5);
        return <g key={n}><path d={`M${x} ${top}C${x - n * 7} ${top + 65} ${bottom - n * 8} ${end - 76} ${bottom} ${end - 3}`} stroke={fill('fold')} strokeWidth={i % 2 ? 6 : 11} opacity=".55" />
          <path d={`M${x + 3} ${top + 8}Q${x + 12} ${end - 102} ${bottom + 3} ${end - 3}`} stroke={light} strokeWidth="1.1" opacity=".4" /></g>;
      })}
    </g>;
  }

  return <g data-workbook-garment={kind} data-sleeve-cut={sleeveless ? 'sleeveless' : narrow ? 'narrow' : 'hanging'}>
    <defs>
      <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2=".1"><stop stopColor={shade} /><stop offset=".2" stopColor={color} /><stop offset=".41" stopColor={light} /><stop offset=".56" stopColor={color} /><stop offset=".84" stopColor={shade} /><stop offset="1" stopColor={color} /></linearGradient>
      <linearGradient id={`${id}-lining`}><stop stopColor="#B7AB91" /><stop offset=".35" stopColor="#EDE3CC" /><stop offset=".58" stopColor="#F9F0DD" /><stop offset="1" stopColor="#C3B49A" /></linearGradient>
      <linearGradient id={`${id}-fold`} x1="0" x2="0" y1="0" y2="1"><stop stopColor={deep} stopOpacity="0" /><stop offset=".35" stopColor={deep} stopOpacity=".25" /><stop offset="1" stopColor={deep} stopOpacity=".65" /></linearGradient>
      <linearGradient id={`${id}-gold`}><stop stopColor="#9B753E" /><stop offset=".3" stopColor="#E2CC91" /><stop offset=".52" stopColor="#F0DCAA" /><stop offset=".75" stopColor="#BE9B54" /><stop offset="1" stopColor="#E1C283" /></linearGradient>
      <pattern id={`${id}-weave`} width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .4H3M.4 0V3" stroke="#FFF4D6" strokeWidth=".3" /></pattern>
      <pattern id={`${id}-damask`} width="31" height="37" patternUnits="userSpaceOnUse"><path d="M15.5 5Q24 13 15.5 23Q7 13 15.5 5ZM10 14Q15.5 10 21 14M15.5 10V20M0 32Q5 28 10 32M21 32Q26 28 31 32" fill="none" stroke={gold} strokeWidth=".55" /></pattern>
      <pattern id={`${id}-quilt`} width="18" height="24" patternUnits="userSpaceOnUse"><path d="M0 12L9 0L18 12L9 24Z" fill="none" stroke={deep} strokeWidth=".8" opacity=".5" /><path d="M1 12L9 1L17 12" fill="none" stroke={light} strokeWidth=".7" /></pattern>
      <pattern id={`${id}-hemband`} width="13" height="38" patternUnits="userSpaceOnUse" patternTransform="rotate(-19)"><path fill="#CCB580" d="M0 0h13v38H0z" /><path stroke="#687D83" strokeWidth="3" d="M2 0V38" /><path stroke="#8F5245" strokeWidth="3" d="M7 0V38" /><path stroke="#EBDBA8" strokeWidth="1" d="M11 0V38" /></pattern>
      <clipPath id={`${id}-body-clip`}><path d={body} /></clipPath>
      <clipPath id={`${id}-sleeve-clip`}><path d={sleeve} /></clipPath>
    </defs>

    {!sleeveless && [false, true].map(mirror => <g key={String(mirror)} transform={mirror ? 'translate(360 0) scale(-1 1)' : undefined} data-garment-piece="sleeve">
      <Cloth d={sleeve} />
      <g clipPath={fill('sleeve-clip')}>
        {court && <path d={sleeve} fill={fill('damask')} opacity=".28" />}
        <path d={narrow ? `M${l - 3} 174Q${l - 16} 234 ${l - 5} 301` : `M${l - 3} 163Q${l - 23} 244 ${l - 39} 285M${l + 8} 186Q${l - 17} 280 ${l + 1} 361`} fill="none" stroke={fill('fold')} strokeWidth="7" />
        <path d={narrow ? `M${l} 181Q${l - 11} 230 ${l - 2} 289` : `M${l + 2} 176Q${l - 12} 246 ${l - 32} 279M${l + 8} 243Q${l - 5} 320 ${l + 7} 346`} fill="none" stroke={light} strokeWidth="1.4" opacity=".7" />
        {imperial && <g transform={`translate(${l - 20} 230) scale(.53)`}>{kind === 'phuong-bao' ? <Phoenix gold={gold} /> : <Dragon gold={gold} claws={kind === 'mang-bao' ? 4 : 5} />}</g>}
      </g>
      <path d={cuff} fill="none" stroke={court ? deep : shade} strokeWidth={court ? 9 : 4} />
      <path d={cuff} fill="none" stroke={court ? gold : light} strokeWidth={court ? 1.8 : .85} />
    </g>)}

    {kind === 'ao-yem' ? <g data-garment-piece="halter">
      {/* Curved side edges and a rounded collar, with narrow neck and back ties. */}
      <path d="M172 130L168 117M188 130L192 117" stroke={shade} strokeWidth="2.5" />
      <Cloth d={`M171 128Q180 140 189 128C194 147 ${180 + waist - 3} 172 ${180 + waist + 7} 191Q${180 + waist + 6} 224 180 280Q${180 - waist - 6} 224 ${180 - waist - 7} 191C${180 - waist + 3} 172 166 147 171 128Z`} />
      <path d={`M172 131Q180 141 188 131M${180 - waist - 5} 196Q${180 - waist + 6} 238 180 272Q${180 + waist - 6} 238 ${180 + waist + 5} 196`} fill="none" stroke={light} strokeWidth="1.2" />
      <path d={`M170 159Q156 194 166 224M193 172Q200 208 183 255`} fill="none" stroke={shade} strokeOpacity=".4" strokeWidth="2" />
      <path d={`M${180 - waist - 6} 196L${l + 3} 206M${180 + waist + 6} 196L${r - 3} 206`} stroke={shade} strokeWidth="2" />
    </g> : kind === 'doi-kham' ? <g data-garment-piece="parallel-panels">
      <Cloth d={`M159 142Q180 132 201 142L${r + 7} 470Q180 489 ${l - 7} 470Z`} fabric="lining" />
      <path d="M169 136L194 176M191 136L172 165" stroke="#BDAC8B" strokeWidth="3" fill="none" />
      <path d={`M${l + 18} 264Q180 274 ${r - 18} 264`} stroke="#907A52" strokeWidth="11" fill="none" />
      {[false, true].map(mirror => <g key={String(mirror)} transform={mirror ? 'translate(360 0) scale(-1 1)' : undefined}>
        <Cloth d={`M${l} 146Q148 139 164 137C166 188 166 230 163 278Q158 374 155 480Q${l - 8} 482 ${hL} 472Q${l - 5} 344 ${l + 3} 263Z`} />
        <path d="M164 138C166 188 166 230 163 278Q158 374 155 478" stroke={shade} strokeWidth="8" fill="none" />
        <path d="M164 138C166 188 166 230 163 278Q158 374 155 478" stroke="#D7BE92" strokeWidth="1.5" fill="none" />
        <path d={`M${l + 9} 200Q${l + 24} 292 ${l - 5} 465`} stroke={fill('fold')} strokeWidth="9" fill="none" />
        <path d={`M${l + 12} 223Q${l + 20} 334 ${l + 1} 466`} stroke={light} strokeWidth="1.2" fill="none" opacity=".65" />
      </g>)}
    </g> : <>
      <Cloth d={body} />
      <g clipPath={fill('body-clip')}>
        {court && <path d={body} fill={fill('damask')} opacity={kind === 'bo-tu' ? .16 : .24} />}
        {kind === 'tran-thu' && <path d={vest} fill={fill('quilt')} />}
        {!short && <Folds />}
        {short && <Folds end={hem} top={193} />}
        {imperial && <>
          <path d={`M${hL} 430Q180 445 ${hR} 430V488H${hL}Z`} fill={fill('hemband')} />
          <path d={`M${hL} 430Q180 445 ${hR} 430`} fill="none" stroke={deep} strokeWidth="5" />
          <path d={`M${hL} 430Q180 445 ${hR} 430`} fill="none" stroke={gold} strokeWidth="1.1" />
          {[-1, 0, 1].map(n => <g key={n} transform={`translate(${180 + n * 45} ${422 - Math.abs(n) * 5})`}><Cloud gold={gold} /><path d="M-18 4Q-9-7 0 4Q9-7 18 4M-14 9Q0 0 14 9" fill="none" stroke={pearl} strokeWidth="1" /></g>)}
        </>}
      </g>

      {kind === 'tran-thu' ? <g data-garment-piece="quilted-vest">
        <path d={vest} fill="none" stroke={shade} strokeWidth="3.7" />
        <path d={`M${l + 7} 200V274M${l + 11} 146L165 142`} fill="none" stroke={light} strokeWidth="1.2" />
        {[211, 234, 257].map(y => <g key={y}><path d={`M${l + 4} ${y}h8`} stroke="#D7CEAD" strokeWidth="2" strokeLinecap="round" /><circle cx={l + 10} cy={y} r="1.4" fill={deep} /></g>)}
        <path d={`M${l + 14} 150l9-3m-6-1l1 5`} stroke="#D7CEAD" strokeWidth="2" />
      </g> : kind === 'thu-kham' ? <g data-garment-piece="center-fastening">
        <path d="M167 131Q180 137 193 131L194 146Q180 153 166 146Z" fill={fill('cloth')} stroke={seam} strokeWidth=".8" />
        <path d="M180 148V440" stroke={shade} strokeWidth="4" /><path d="M181.5 151V440" stroke={light} strokeWidth="1" />
        {[169, 197, 225, 253, 281, 309, 337, 365].map(y => <g key={y}><path d={`M173 ${y}h14`} stroke={light} strokeWidth="2" strokeLinecap="round" /><circle cx="181" cy={y} r="2" fill={shade} stroke={light} strokeWidth=".6" /></g>)}
        <path d="M180 372L169 442M183 373L191 442" stroke={shade} fill="none" strokeWidth="1" />
      </g> : kind === 'vat-ho' || kind === 'ngu-lam' ? <g data-garment-piece="short-side-fastening">
        <path d={`M166 137Q180 155 197 162L${r - 7} 183L${r - 5} ${hem - 10}`} fill="none" stroke={shade} strokeWidth="4" />
        <path d={`M167 136Q180 153 198 161L${r - 6} 181`} fill="none" stroke={kind === 'ngu-lam' ? gold : light} strokeWidth="1.3" />
        {[183, 210, 237].map(y => <g key={y}><path d={`M${r - 10} ${y}h8`} stroke={light} strokeWidth="1.5" /><circle cx={r - 5} cy={y} r="1.8" fill={shade} /></g>)}
        <path d={`M${l + 2} ${hem - 30}l4 22M${r - 2} ${hem - 30}l-4 22`} stroke={shade} strokeWidth="2" />
        {kind === 'ngu-lam' && <><path d={`M${180 - waist - 10} 255Q180 266 ${180 + waist + 10} 255V271Q180 282 ${180 - waist - 10} 271Z`} fill="#493A2E" stroke="#2E2924" /><rect x="172" y="260" width="16" height="13" rx="2" fill="none" stroke={gold} strokeWidth="2" /><path d="M188 264L193 302L186 304L181 268" fill="#493A2E" stroke="#786047" />
          <path d={`M${l + 2} 148Q156 142 167 140M193 140Q204 142 ${r - 2} 148`} stroke={gold} strokeWidth="2" /></>}
      </g> : <>
        {/* Small inner collar shows through, without a long modern scoop neckline. */}
        <path d="M166 133Q180 143 194 133L193 148Q180 162 167 148Z" fill={fill('lining')} stroke="#B5A687" strokeWidth=".6" />
        {kind === 'co-man' ? <><path d="M167 136Q180 157 193 136" fill="none" stroke={shade} strokeWidth="5" /><path d="M167 136Q180 157 193 136" fill="none" stroke={light} strokeWidth="1" /></>
          : <><path d="M165 137C165 162 195 162 195 137" fill="none" stroke={court ? deep : shade} strokeWidth={court ? 6 : 4} /><path d="M165 137C165 162 195 162 195 137" fill="none" stroke={court ? gold : light} strokeWidth="1.2" /></>}
        {['vien-linh', 'bo-tu', 'hoang-bao', 'mang-bao', 'phuong-bao'].includes(kind) && <g data-garment-piece="right-fastening"><path d={`M195 140Q${r - 13} 144 ${r - 6} 171L${r - 5} 228`} stroke={shade} fill="none" strokeWidth="1.4" />{[151, 169, 187].map((y, i) => <circle key={y} cx={r - 10 + i * 1.6} cy={y} r="1.6" fill={court ? gold : light} />)}</g>}

        {kind === 'bo-tu' && <RankBadge gold="#CEAD6D" id={id} />}
        {kind === 'hoang-bao' && <g data-garment-piece="dragon-roundel" transform="translate(180 224)"><circle r="43" fill="none" stroke={gold} strokeWidth="1.3" /><circle r="39" fill="none" stroke={gold} strokeWidth=".6" strokeDasharray="1 3" /><g transform="scale(.9)"><Dragon gold={gold} claws={5} /></g></g>}
        {kind === 'mang-bao' && <g data-garment-piece="mang-roundels">{[[180, 214, .76], [145, 321, .6], [215, 321, .6]].map(([x, y, scale]) => <g key={x} transform={`translate(${x} ${y}) scale(${scale})`}><circle r="43" fill="none" stroke={gold} strokeWidth="1.8" /><circle r="38" fill="none" stroke={gold} strokeWidth=".8" /><Dragon gold={gold} claws={4} /></g>)}</g>}
        {kind === 'phuong-bao' && <g data-garment-piece="phoenix-embroidery"><g transform="translate(180 218) scale(1.12)"><Phoenix gold={gold} /></g>{[false, true].map(mirror => <g key={String(mirror)} transform={`translate(${mirror ? 209 : 151} 331) scale(${mirror ? -.57 : .57} .57)`}><Phoenix gold={gold} /></g>)}</g>}
        {imperial && <>{[[145, 176], [215, 177], [137, 275], [222, 278], [173, 377]].map(([x, y]) => <g key={y} transform={`translate(${x} ${y}) scale(.55)`}><Cloud gold={pearl} /></g>)}</>}
        {kind === 'con-mien' && <g data-garment-piece="ceremonial-layers">
          <path d="M178 159L165 479M183 159L197 479" fill="none" stroke={shade} strokeWidth="5" />
          {[false, true].map(mirror => <g key={String(mirror)} transform={`translate(${mirror ? 211 : 149} 228) scale(${mirror ? -.64 : .64} .8)`}><Dragon gold={gold} claws={5} /></g>)}
          <circle cx="180" cy="190" r="8" fill={fill('gold')} /><path d="M180 176V173M168 185L164 183M192 185L196 183" stroke={gold} />
          <path d={`M${l + 4} 270Q180 280 ${r - 4} 270`} stroke="#BEAC86" strokeWidth="11" fill="none" /><path d={`M${l + 4} 270Q180 280 ${r - 4} 270`} stroke={gold} strokeWidth="1" fill="none" />
          <path d="M158 276H202L214 438Q180 445 146 438Z" fill="#8C4134" stroke={gold} strokeWidth="1.3" /><path d="M164 285H196L206 430Q180 435 154 430Z" fill="none" stroke="#C18459" strokeWidth="1" />
          {[307, 350, 396].map(y => <g key={y} transform={`translate(180 ${y})`}><path d="M-13 0L0-9L13 0L0 9Z M-8 0H8M0-5V5" fill="none" stroke={gold} strokeWidth="1.4" /></g>)}
        </g>}
        {kind === 'bien-phuc' && <g data-garment-piece="celestial-motifs">
          <circle cx="157" cy="187" r="10" fill={fill('gold')} /><path d="M205 176A11 11 0 1 0 205 198A13 13 0 0 1 205 176" fill="#E0D8B7" />
          <path d="M163 226L178 218L193 231L182 246L165 240" fill="none" stroke={gold} strokeWidth=".8" />{[[163,226],[178,218],[193,231],[182,246],[165,240]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="2" fill={gold} />)}
          <path d={`M${l + 5} 269Q180 279 ${r - 5} 269`} fill="none" stroke={shade} strokeWidth="11" /><path d={`M${l + 5} 266Q180 276 ${r - 5} 266`} fill="none" stroke={gold} strokeWidth="1.1" />
          {[331, 388].map(y => <g key={y} transform={`translate(180 ${y})`}><Cloud gold={gold} /></g>)}
        </g>}
        {kind === 'vien-linh' && <path d={`M${l + 4} 270Q180 279 ${r - 4} 270`} fill="none" stroke={shade} strokeWidth="8" />}
        {kind === 'co-man' && <path d={`M${l + 5} 272Q180 278 ${r - 5} 272`} fill="none" stroke={shade} strokeWidth="5" opacity=".8" />}
      </>}
      <path d={`M${short ? l + 3 : hL + 2} ${hem - 9}Q180 ${hem + 5} ${short ? r - 3 : hR - 2} ${hem - 9}`} fill="none" stroke={court ? gold : light} strokeWidth={court ? 1.2 : .8} opacity=".8" />
    </>}
    {kind === 'con-mien' && showCrown && <Crown gold={gold} />}
  </g>;
}

function Cloud({ gold }: { gold: string }) {
  return <g fill="none" stroke={gold} strokeLinecap="round"><path d="M-20 3Q-28-1-21-6Q-17-9-12-4Q-10-15 0-12Q8-12 9-5Q18-12 22-4Q27 3 18 4H-14Q-19 4-17 0Q-14-3-10 0" strokeWidth="1.3" /><path d="M-9 7H12M-4 10H6" strokeWidth=".8" /></g>;
}

function Dragon({ gold, claws }: { gold: string; claws: number }) {
  return <g fill="none" stroke={gold} strokeLinecap="round" strokeLinejoin="round">
    <path d="M-23 30C8 44 33 20 11 10S-26-6-10-23L2-25L12-21L9-12L0-12C-16-5 12 0 23 11S21 39-1 39Q-15 39-23 30Z" fill={gold} fillOpacity=".08" strokeWidth="2" />
    <path d="M-20 26C1 37 25 24 9 16S-21 1-14-13M-11-24L-18-35L-23-36M-2-26L-3-37L1-40M9-22L20-23L15-16L10-16M0-12L-3-7M12-18Q22-14 25-20" strokeWidth="1.3" />
    <path d="M-12-4L-29-13L-33-22M-5 22L-27 23L-31 13M18 10L31-3L29-12M15 30L30 27L34 15" strokeWidth="1.6" />
    {[[ -33,-22],[-31,13],[29,-12],[34,15]].map(([x,y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${i % 2 ? 150 : -20})`}>{Array.from({length:claws}, (_, n) => <path key={n} d={`M0 0L${(n - (claws - 1) / 2) * 2.8} -5l1.5-2`} strokeWidth=".8" />)}</g>)}
    <circle cx="5" cy="-22" r="1.2" fill={gold} />
    {[-7, 0, 7, 14].map((x, i) => <path key={x} d={`M${x} ${5 + i * 3}q4-4 6 0m-5 1q4-3 5 0`} strokeWidth=".65" />)}
    <path d="M-17 29L-28 31L-31 27M-18-19l-7-1M-18-13l-8 1M-17-7l-6 4" strokeWidth="1" />
  </g>;
}

function Phoenix({ gold }: { gold: string }) {
  return <g fill="none" stroke={gold} strokeLinecap="round" strokeLinejoin="round">
    <path d="M-5 3Q-16-9-34-5Q-21 13-9 12Q-4 20 5 13Q19 7 16-7Q12-17 20-20L27-17L20-14Q26-2 15 10Q8 21-3 13" fill={gold} fillOpacity=".09" strokeWidth="1.7" />
    <path d="M-4 6Q-1-15-18-29Q-23-17-8 5M-7 4Q-9-13-17-21M-10 7Q-22-5-31-3M-11 10L-25 3" strokeWidth="1.4" />
    <path d="M1 15C-14 31-31 27-27 47C-21 35-10 42-5 31M5 17C0 35 18 35 6 53C3 37-5 39 0 26M10 14C17 26 37 25 34 44C23 30 16 40 13 25" strokeWidth="1.6" />
    <path d="M-2 21Q-12 35-24 40M5 24Q11 38 7 46M13 19Q23 28 29 37" strokeWidth=".7" />
    <path d="M15-19L9-27M18-21L18-29M21-21L25-27M-7 12L-19 20M-17 19l-5-1m5 1l-1 5" strokeWidth="1" /><circle cx="20" cy="-18" r=".9" fill={gold} />
  </g>;
}

function RankBadge({ gold, id }: { gold: string; id: string }) {
  return <g data-garment-piece="rank-badge" transform="translate(145 182)">
    <rect width="70" height="76" fill="#343B43" stroke={gold} strokeWidth="2.6" /><rect x="4" y="4" width="62" height="68" fill="none" stroke={gold} strokeWidth=".7" />
    <path d="M7 64Q15 55 22 64T37 64T52 64T63 64M8 68H62" fill="none" stroke={gold} strokeWidth="1" />
    <circle cx="54" cy="16" r="5" fill={`url(#${id}-gold)`} />
    <path d="M32 44Q17 48 12 29Q25 32 31 38Q32 26 24 15Q39 18 38 34Q39 24 47 26L51 29L46 31Q47 43 37 48L34 58M31 48L24 58M22 58H29M31 58H38" fill="none" stroke={gold} strokeWidth="1.4" />
    <path d="M16 33L26 39M18 38L27 42M29 20L33 31" stroke={gold} strokeWidth=".7" />
  </g>;
}

function Crown({ gold }: { gold: string }) {
  return <g data-integrated-crown>
    <path d="M159 58V37Q180 26 201 37V58Z" fill="#2C2B2A" stroke={gold} strokeWidth=".8" /><path d="M143 32L193 24L219 39L166 48Z" fill="#292824" stroke={gold} strokeWidth="1.2" /><path d="M145 33L166 46L217 38" fill="none" stroke="#DEC897" strokeWidth=".6" />
    {[151,162,173,184,195,206].map((x,i)=><g key={x}><path d={`M${x} ${38+i}v47`} stroke={gold} strokeWidth=".55" />{[0,1,2,3,4].map(n=><circle key={n} cx={x} cy={45+i+n*8} r="1.5" fill={n%2?'#DAD1B5':gold} />)}</g>)}
  </g>;
}

/** Workwear uses trousers rather than the wide silk underlayer of a long robe. */
export function WorkbookTrousers({ kind, male, id }: { kind: string; male: boolean; id: string }) {
  const { waist } = workbookCut(kind, male);
  const base = kind === 'tran-thu' ? '#626452' : kind === 'ngu-lam' ? '#44463F' : '#343833';
  return <g data-garment-piece="work-trousers">
    <defs><linearGradient id={`${id}-trousers`}><stop stopColor={mix(base, '#1C1D18', .35)} /><stop offset=".3" stopColor={mix(base, '#D1C2A3', .22)} /><stop offset=".6" stopColor={base} /><stop offset="1" stopColor={mix(base, '#171A16', .3)} /></linearGradient></defs>
    {[false, true].map(mirror => <g key={String(mirror)} transform={mirror ? 'translate(360 0) scale(-1 1)' : undefined}>
      <path d={`M${180 - waist - 5} 262H181L177 364L174 491Q163 496 149 490L${male ? 142 : 147} 364Z`} fill={`url(#${id}-trousers)`} stroke="#30332C" strokeWidth=".7" />
      <path d="M159 323Q155 383 162 482M169 360L166 486" fill="none" stroke="#D5CDBA" strokeWidth="1" strokeOpacity=".18" />
      {kind === 'ngu-lam' && <g data-garment-layer="gaiter"><path d="M148 417Q162 422 176 417L174 491Q162 496 150 490Z" fill="#827A61" stroke="#524F42" strokeWidth=".8" />{[425,435,445,455,465,475,485].map(y => <path key={y} d={`M150 ${y}q12 6 24 0`} fill="none" stroke="#B9AE8B" strokeWidth="1.1" />)}<path d="M166 420L170 486" stroke="#4D4C3D" strokeWidth="1.5" /></g>}
    </g>)}
  </g>;
}
