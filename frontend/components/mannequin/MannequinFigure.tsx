'use client';

import { useId } from 'react';
import { garmentKind } from '@/lib/outfit';
import { normalizeCulturalText } from '@/lib/cultural';

interface Props {
  garment: string;
  colorName: string;
  colorHex: string;
  accessories: string[];
  gender: 'female' | 'male';
}

function tint(hex: string, target: string, amount: number) {
  const base = /^#[\da-f]{6}$/i.test(hex) ? hex : '#C0392B';
  const channel = (offset: number) => Math.round(parseInt(base.slice(offset, offset + 2), 16) * (1 - amount) + parseInt(target.slice(offset, offset + 2), 16) * amount).toString(16).padStart(2, '0');
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

/** A layered fitting illustration: body, undergarment, sleeves, outer garment, accessories. */
export function MannequinFigure({ garment, colorName, colorHex, accessories, gender }: Props) {
  const id = `figure-${useId().replace(/:/g, '')}`;
  const fill = (name: string) => `url(#${id}-${name})`;
  const kind = garmentKind(garment);
  const male = gender === 'male';
  const shoulder = male ? 55 : 43;
  const waist = male ? 38 : 28;
  const left = 180 - shoulder;
  const right = 180 + shoulder;
  const hemLeft = left - 18;
  const hemRight = right + 18;
  const narrowSleeve = kind === 'ao-dai' || kind === 'tu-than';
  const names = accessories.map(normalizeCulturalText);
  const headwear = names.some(name => name.includes('non la')) ? 'non-la' : names.some(name => name.includes('khan dong')) ? 'khan-dong' : names.some(name => /\bman\b/.test(name)) ? 'man' : undefined;
  const necklace = names.some(name => name.includes('vong co') || name.includes('kieng'));
  const fan = names.some(name => name.includes('quat'));
  const light = tint(colorHex, '#FFFFFF', .29);
  const shade = tint(colorHex, '#251D19', .33);
  const seam = tint(colorHex, '#251D19', .45);
  const trim = '#C7AD79';

  const robe = `M${left} 144 Q180 132 ${right} 144 C${right + 3} 190 ${right - 10} 230 ${right - 4} 278 L${hemRight} 474 Q180 486 ${hemLeft} 474 L${left + 4} 278 C${left + 10} 230 ${left - 3} 190 ${left} 144Z`;
  const tunic = `M${left} 144 Q180 132 ${right} 144 C${right + 4} 179 ${180 + waist} 216 ${180 + waist} 250 C${180 + waist + 7} 315 ${right - 1} 401 ${right + 5} 478 Q180 493 ${left - 5} 478 C${left + 1} 401 ${180 - waist - 7} 315 ${180 - waist} 250 C${180 - waist} 216 ${left - 4} 179 ${left} 144Z`;
  const wideSleeve = `M${left + 5} 143 C${left - 18} 145 ${left - 27} 177 ${left - 38} 207 L${left - 64} 270 Q${left - 55} 292 ${left - 28} 305 L${left - 3} 278 Q${left + 7} 217 ${left + 10} 169Z`;
  const slimSleeve = `M${left + 5} 143 C${left - 12} 147 ${left - 19} 184 ${left - 20} 228 L${left - 14} 303 Q${left - 4} 308 ${left + 6} 302 L${left + 3} 238 Q${left + 10} 203 ${left + 13} 163Z`;
  const handX = narrowSleeve ? left - 4 : left - 28;
  const outerLeft = `M${left} 144 Q${left + 12} 139 164 144 C164 183 163 226 177 270 C159 315 ${left + 9} 389 ${left - 5} 465 Q${left - 17} 469 ${hemLeft} 461 L${left + 3} 276 C${left + 8} 226 ${left - 3} 186 ${left} 144Z`;

  function Fabric({ d, className }: { d: string; className?: string }) {
    return <g className={className}><path d={d} fill={fill('cloth')} stroke={seam} strokeWidth=".7" strokeLinejoin="round" /><path d={d} fill={fill('weave')} opacity=".055" /></g>;
  }

  return <svg role="img" aria-label={`Ma-nơ-canh ${male ? 'nam' : 'nữ'} mặc ${garment}, màu ${colorName}`} data-garment-kind={kind} data-color={colorHex} data-fit={gender} viewBox="0 20 360 540" className="h-full w-full">
    <defs>
      <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2=".2">
        <stop stopColor={shade} /><stop offset=".17" stopColor={colorHex} /><stop offset=".4" stopColor={light} /><stop offset=".62" stopColor={colorHex} /><stop offset=".88" stopColor={shade} /><stop offset="1" stopColor={colorHex} />
      </linearGradient>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2=".2"><stop stopColor="#AFA697" /><stop offset=".23" stopColor="#DED7CA" /><stop offset=".5" stopColor="#F1EBDF" /><stop offset=".82" stopColor="#CDC4B4" /><stop offset="1" stopColor="#AFA493" /></linearGradient>
      <radialGradient id={`${id}-head`} cx="34%" cy="30%" r="78%"><stop stopColor="#F8F3E9" /><stop offset=".55" stopColor="#E5DDCE" /><stop offset="1" stopColor="#B7AC98" /></radialGradient>
      <linearGradient id={`${id}-silk`}><stop stopColor="#BDB8AD" /><stop offset=".25" stopColor="#F1EDE4" /><stop offset=".55" stopColor="#FFFCF4" /><stop offset=".85" stopColor="#D9D4C8" /><stop offset="1" stopColor="#B6B0A5" /></linearGradient>
      <linearGradient id={`${id}-skirt`}><stop stopColor="#373A34" /><stop offset=".22" stopColor="#595E50" /><stop offset=".5" stopColor="#727461" /><stop offset=".72" stopColor="#4C5146" /><stop offset="1" stopColor="#30352F" /></linearGradient>
      <linearGradient id={`${id}-sash`}><stop stopColor="#9E7756" /><stop offset=".5" stopColor="#D0AD7C" /><stop offset="1" stopColor="#AE8860" /></linearGradient>
      <linearGradient id={`${id}-stand`} x2="0" y2="1"><stop stopColor="#E4DED1" /><stop offset="1" stopColor="#BDB3A2" /></linearGradient>
      <linearGradient id={`${id}-fold-shadow`} x2="0" y2="1"><stop stopColor={shade} stopOpacity="0" /><stop offset=".3" stopColor={shade} stopOpacity=".65" /><stop offset="1" stopColor={shade} /></linearGradient>
      <linearGradient id={`${id}-fold-light`} x2="0" y2="1"><stop stopColor={light} stopOpacity="0" /><stop offset=".3" stopColor={light} stopOpacity=".7" /><stop offset="1" stopColor={light} /></linearGradient>
      <radialGradient id={`${id}-ground`}><stop stopColor="#6A5C46" stopOpacity=".22" /><stop offset="1" stopColor="#6A5C46" stopOpacity="0" /></radialGradient>
      <pattern id={`${id}-weave`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 .5H4M.5 0V4" stroke="#FFFDF4" strokeWidth=".3" /></pattern>
      <pattern id={`${id}-brocade`} width="24" height="28" patternUnits="userSpaceOnUse"><path d="M12 5Q18 12 12 19Q6 12 12 5ZM8 12H16M12 9V15" fill="none" stroke={trim} strokeWidth=".6" /><circle cx="0" cy="26" r="1.3" fill={trim} /></pattern>
      <clipPath id={`${id}-robe-clip`}><path d={kind === 'ao-dai' ? tunic : robe} /></clipPath>
      <filter id={`${id}-shadow`} x="-30%" y="-15%" width="160%" height="140%"><feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#43382B" floodOpacity=".16" /></filter>
    </defs>

    {/* A quiet plinth anchors the figure without becoming part of the clothing. */}
    <ellipse cx="180" cy="529" rx="107" ry="16" fill={fill('ground')} />
    <path d="M104 515V522C104 538 256 538 256 522V515Z" fill={fill('stand')} />
    <ellipse cx="180" cy="515" rx="76" ry="13" fill="#EAE5DA" stroke="#D5CBBB" strokeWidth=".7" />
    <path d="M177 424H183V514H177Z" fill="#B1A18A" />

    <g filter={fill('shadow')}>
      {/* Both forms share the same matte, featureless display material. */}
      <g data-mannequin-body={gender}>
        <path d={`M${180 - waist} 263Q180 246 ${180 + waist} 263L${male ? 215 : 209} 364L206 491Q196 500 187 491L180 370L173 491Q163 500 154 491L${male ? 145 : 151} 364Z`} fill={fill('body')} />
        <path d="M153 487Q164 491 175 486L175 507Q159 515 144 510Q143 500 153 487Z M185 486Q196 491 207 487L217 505Q219 511 209 512L185 509Z" fill={fill('body')} stroke="#B9AF9E" strokeWidth=".7" />
        <path d={`M169 104L168 135Q${left} 144 ${left - 4} 154L${left + 5} 220L${180 - waist} 263Q180 276 ${180 + waist} 263L${right - 5} 220L${right + 4} 154Q192 144 192 135L191 104Z`} fill={fill('body')} />
        <path d={male ? 'M180 48C198 48 205 61 204 80L201 96Q194 112 180 115Q166 112 159 96L156 80C155 61 162 48 180 48Z' : 'M180 48C195 48 202 61 201 79C200 98 192 113 180 114C168 113 160 98 159 79C158 61 165 48 180 48Z'} fill={fill('head')} stroke="#C9BEAD" strokeWidth=".5" />
        <path d="M166 64Q163 81 169 94" stroke="#FFFCF6" strokeWidth="1.4" strokeLinecap="round" opacity=".55" fill="none" />
      </g>

      {/* Separate trouser legs remain visible below the long outer garment. */}
      <g data-garment-layer="underlayer">
        {kind === 'tu-than' ? <>
          <path d={`M${180 - waist - 6} 259Q180 251 ${180 + waist + 6} 259L${right + 17} 489Q180 504 ${left - 17} 489Z`} fill={fill('skirt')} />
          {[left + 5, left + 23, right - 23, right - 5].map((x, i) => <path key={i} d={`M${180 + (x - 180) * .6} 280Q${x} 390 ${x + (x < 180 ? -7 : 7)} 488`} stroke={i % 2 ? '#BAB8A0' : '#1D241F'} strokeWidth={i % 2 ? 1 : 4} opacity=".22" fill="none" />)}
        </> : <>
          <path d={`M${180 - waist - 7} 263H181L176 490Q${left + 5} 499 ${left - 10} 489L${left - 2} 372Z`} fill={fill('silk')} stroke="#C7C0B2" strokeWidth=".6" />
          <path d={`M179 263H${180 + waist + 7}L${right + 2} 372L${right + 10} 489Q${right - 5} 499 184 490Z`} fill={fill('silk')} stroke="#C7C0B2" strokeWidth=".6" />
          <path d={`M${left + 20} 304Q${left + 12} 409 ${left + 7} 488M${right - 20} 304Q${right - 12} 409 ${right - 7} 488`} stroke="#FFFDF7" strokeWidth="2" opacity=".7" fill="none" />
        </>}
      </g>

      {/* Sleeves and wrists use the same shoulder measurement as the torso. */}
      {[false, true].map(mirror => <g key={String(mirror)} transform={mirror ? 'translate(360 0) scale(-1 1)' : undefined}>
        <path d={`M${handX - 8} 299Q${handX - 11} 312 ${handX - 8} 323L${handX - 3} 335Q${handX} 338 ${handX + 2} 333L${handX + 1} 320Q${handX + 7} 329 ${handX + 9} 323L${handX + 5} 307L${handX + 7} 299Z`} fill={fill('body')} stroke="#C0B5A4" strokeWidth=".6" />
        <Fabric d={narrowSleeve ? slimSleeve : wideSleeve} />
        <path d={narrowSleeve ? `M${left - 11} 296Q${left - 3} 299 ${left + 5} 296` : `M${left - 59} 270Q${left - 47} 288 ${left - 26} 298`} stroke={kind === 'nhat-binh' ? trim : light} strokeWidth={kind === 'nhat-binh' ? 7 : 2} opacity=".8" fill="none" />
        <path d={narrowSleeve ? `M${left - 5} 175Q${left - 14} 232 ${left - 5} 287` : `M${left - 5} 170Q${left - 25} 219 ${left - 44} 273M${left + 3} 186Q${left - 9} 248 ${left - 26} 284`} stroke={shade} strokeWidth="2" opacity=".45" fill="none" />
        {kind === 'nhat-binh' && <path d={`M${left - 56} 276Q${left - 45} 291 ${left - 29} 301`} fill="none" stroke="#9B9E81" strokeWidth="3" />}
      </g>)}

      <g data-garment-cut data-shoulder-width={shoulder * 2}>
        {kind === 'tu-than' ? <>
          <path d={`M168 141Q180 152 192 141L${180 + waist} 188L${180 + waist + 2} 269Q180 282 ${180 - waist - 2} 269L${180 - waist} 188Z`} fill={fill('sash')} />
          <path d="M170 146L180 156L190 146" stroke="#E2CB9E" strokeWidth="2" fill="none" />
          <Fabric d={outerLeft} />
          <g transform="translate(360 0) scale(-1 1)"><Fabric d={outerLeft} /></g>
          <path d={`M164 148C164 206 168 241 177 269M196 148C196 206 192 241 183 269`} stroke={light} strokeWidth="2" opacity=".8" fill="none" />
          <path d={`M${180 - waist - 4} 262Q180 272 ${180 + waist + 4} 262L${180 + waist + 5} 275Q180 288 ${180 - waist - 5} 275Z`} fill={fill('sash')} stroke="#9A7956" strokeWidth=".6" />
          <path d="M178 275Q157 311 157 408L170 414Q168 338 184 279Z M184 275Q200 307 203 391L193 400Q190 334 178 279Z" fill={fill('sash')} stroke="#B29269" strokeWidth=".6" />
          <ellipse cx="180" cy="276" rx="7" ry="5" fill="#C3A174" />
        </> : <>
          <Fabric d={kind === 'ao-dai' ? tunic : robe} />
          <g clipPath={fill('robe-clip')} opacity=".4" fill="none">
            <path d={`M${left + 18} 228C${left + 29} 308 ${left + 7} 388 ${left + 3} 477`} stroke={fill('fold-shadow')} strokeWidth="7" />
            <path d={`M${left + 23} 231C${left + 34} 309 ${left + 14} 389 ${left + 10} 477`} stroke={fill('fold-light')} strokeWidth="2" />
            <path d={`M${right - 17} 228C${right - 27} 329 ${right - 3} 409 ${right + 3} 479`} stroke={fill('fold-shadow')} strokeWidth="8" />
            <path d={`M183 254Q173 367 179 482`} stroke={fill('fold-light')} strokeWidth="3" />
          </g>
          {kind === 'nhat-binh' ? <>
            <path d={robe} fill={fill('brocade')} opacity=".55" />
            <path d="M161 139L161 239Q180 245 199 239L199 139" fill="none" stroke={trim} strokeWidth="11" strokeLinejoin="round" />
            <path d="M161 141V237Q180 243 199 237V141" fill="none" stroke="#EFE1B9" strokeWidth="1.2" />
            <path d="M168 142H192V230Q180 234 168 230Z" fill={shade} />
            <path d="M168 153Q180 164 192 153" fill="none" stroke={trim} strokeWidth="1.5" />
            <circle cx="180" cy="158" r="3" fill="#E6D3A1" />
            <path d={`M${hemLeft + 2} 466Q180 478 ${hemRight - 2} 466`} fill="none" stroke={trim} strokeWidth="4" />
          </> : kind === 'giao-linh' ? <>
            <path d={`M169 135Q172 148 208 198L${right - 3} 265L${hemRight - 3} 472`} fill="none" stroke={shade} strokeWidth="8" opacity=".55" />
            <path d="M191 137L159 191L152 216" fill="none" stroke="#E6D8BC" strokeWidth="8" />
            <path d="M168 137L205 197L212 213" fill="none" stroke="#E6D8BC" strokeWidth="9" />
            <path d="M168 137L205 197L212 213" fill="none" stroke={light} strokeWidth="3" />
            <path d={`M${left + 8} 257Q180 265 ${right - 8} 257L${right - 7} 269Q180 279 ${left + 7} 269Z`} fill={shade} />
            <path d={`M${right - 14} 262Q${right + 8} 282 ${right - 1} 351L${right - 10} 354Q${right - 9} 303 ${right - 22} 270Z`} fill={shade} />
          </> : <>
            <path d="M168 129Q180 134 192 129L195 145Q180 151 165 145Z" fill={fill('cloth')} stroke={seam} strokeWidth=".8" />
            <path d={`M192 147Q${right - 11} 160 ${right - 4} 180L${right - 3} 245`} fill="none" stroke={shade} strokeWidth="1.7" />
            {[0, 1, 2, 3, 4].map(index => <g key={index} transform={`translate(${index < 3 ? 194 + index * (shoulder - 22) / 2 : right - 5} ${151 + index * 16})`}><path d="M-3 0H3" stroke={light} strokeWidth="2" strokeLinecap="round" /><circle r="1.2" fill={seam} /></g>)}
            {kind === 'ao-dai' && <path d={`M${180 - waist} 256Q${left - 2} 371 ${left - 5} 477M${180 + waist} 256Q${right + 2} 371 ${right + 5} 477`} fill="none" stroke={light} strokeWidth="1.1" opacity=".85" />}
          </>}
        </>}
      </g>

      {headwear && <g data-mannequin-accessory="headwear" data-headwear-kind={headwear}>
        {headwear === 'man' ? <><path d="M151 72C143 19 217 19 209 72L201 79C204 38 156 38 159 79Z" fill={fill('cloth')} stroke={seam} strokeWidth=".8" /><path d="M153 66C150 27 210 27 207 66" fill="none" stroke={trim} strokeWidth="2" /><path d="M156 68C153 33 207 33 204 68" fill="none" stroke={light} strokeWidth="1" /></>
          : headwear === 'khan-dong' ? <><path d="M152 53C151 40 209 40 208 53L209 72Q180 84 151 72Z" fill="#353631" stroke="#242622" strokeWidth=".8" /><ellipse cx="180" cy="51" rx="28" ry="8" fill="#52534B" /><path d="M153 56Q180 68 207 56M153 62Q180 74 207 62M154 68Q180 79 206 68" fill="none" stroke="#939385" strokeWidth="1" /><path d="M175 54L181 68L187 55" fill="none" stroke="#A4A18E" strokeWidth="1.4" /></>
          : <><path d="M180 28L125 86Q180 108 235 86Z" fill="#DCC79A" stroke="#A28D66" /><path d="M180 28L144 91M180 28L163 96M180 28V99M180 28L199 96M180 28L216 91" fill="none" stroke="#F6E8C5" strokeWidth="1.3" /><path d="M125 86Q180 102 235 86" fill="none" stroke="#8E7855" strokeWidth="2" /></>}
      </g>}
      {necklace && <path data-mannequin-accessory="necklace" d="M159 149C158 197 202 197 201 149" fill="none" stroke="#E5D9B9" strokeWidth="4" strokeDasharray=".4 4.6" strokeLinecap="round" />}
      {fan && <g data-mannequin-accessory="fan" transform={`translate(${360 - handX} 318) rotate(-22)`}><path d="M0 0L-36-45Q0-72 36-45Z" fill="#E1D0AC" stroke="#9B835B" /><path d="M0 0L-27-49M0 0L-14-55M0 0V-59M0 0L14-55M0 0L27-49" stroke="#AB9370" strokeWidth=".8" /><circle r="2.5" fill="#93764E" /></g>}
    </g>
  </svg>;
}
