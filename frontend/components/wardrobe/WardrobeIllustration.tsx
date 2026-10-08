'use client';

import { useId } from 'react';
import type { CulturalItemResponse } from '@/services/culturalApi';
import { normalizeCulturalText } from '@/lib/cultural';
import { accessoryName, garmentKind } from '@/lib/outfit';
import { workbookVisual } from '@/lib/workbookCatalog';
import { MannequinFigure } from '@/components/mannequin/MannequinFigure';
import { WorkbookAccessory } from '@/components/mannequin/WorkbookLayers';
import { ConicalHat, FoldingFan, WrappedHeadwear } from '@/components/mannequin/TraditionalAccessories';

const garmentColors: Record<string,string> = {
  'nhat-binh':'#8D3025', 'giao-linh':'#365B66', 'ao-tac':'#605075', 'tu-than':'#895B3F',
  'ao-dai':'#A47A91', 'ngu-than':'#1A365D', 'ba-ba':'#7C664E', 'thai-thanh-hoa':'#F1E8D4',
};

/** Studio artwork never loads the museum photo, including for unknown catalog items. */
export function WardrobeIllustration({ item, gender = 'female', color }: {
  item: CulturalItemResponse; gender?: 'female'|'male'; color?: string;
}) {
  const id = `wardrobe-${useId().replace(/:/g,'')}`;
  const name = normalizeCulturalText(item.name);
  const workbook = workbookVisual(name);
  if (item.category === 'GARMENT' && garmentKind(item.name) !== 'other') {
    const hex=color || workbook?.color || garmentColors[garmentKind(item.name)] || '#895B3F';
    return <span className="block h-full w-full p-1.5" data-wardrobe-illustration="garment"><MannequinFigure garment={item.name} gender={gender} accessories={[]} colorHex={hex} colorName={hex} presentation="garment" /></span>;
  }
  const accessory = normalizeCulturalText(accessoryName(item, gender));
  const hat = accessory.includes('non la');
  const fan = accessory.includes('quat');
  const scarf = accessory.includes('khan ran');
  const wrapped = accessory.includes('khan dong') ? 'khan-dong' : /\bman\b/.test(accessory) ? 'man' : undefined;
  const viewBox = workbook?.category === 'ACCESSORY' ? workbook.viewBox : hat ? '94 16 172 132' : fan ? '-73 -73 146 104' : wrapped ? '138 19 84 72' : '0 0 120 120';
  return <svg role="img" aria-label={`Đồ họa ${item.name}`} viewBox={viewBox} className="h-full w-full p-3" data-wardrobe-illustration="accessory">
    {workbook?.category === 'ACCESSORY' ? <WorkbookAccessory kind={workbook.kind} male={gender==='male'} />
      : hat ? <ConicalHat id={id} /> : fan ? <FoldingFan id={id} />
      : wrapped ? <WrappedHeadwear kind={wrapped} fabric={color || '#8D3025'} seam="#692A24" trim="#C7AD79" light="#C87D68" />
      : scarf ? <g data-accessory-drawing="khan-ran">
        <defs><pattern id={`${id}-checks`} width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#EEE8DC" /><path d="M0 2.5H9M2.5 0V9" stroke="#343B35" strokeWidth="4.5" opacity=".72" /></pattern><linearGradient id={`${id}-fold`}><stop stopColor="#242923" stopOpacity=".3" /><stop offset=".45" stopColor="#FFFFFF" stopOpacity=".1" /><stop offset="1" stopColor="#242923" stopOpacity=".25" /></linearGradient></defs>
        <path d="M31 12L80 16L72 106L24 101Z" fill={`url(#${id}-checks)`} stroke="#777668" /><path d="M31 12L50 15L43 104L24 101Z" fill={`url(#${id}-fold)`} /><path d="M80 16L96 91L73 97L59 17Z" fill={`url(#${id}-checks)`} stroke="#777668" />
        {[0,5,10,15,20,25,30,35,40].map(x=><path key={x} d={`M${25+x} ${102+x/9}v7`} stroke="#BEB6A5" strokeWidth="1.2" />)}
      </g> : <g fill="none" stroke="#9B8062" strokeWidth="2.5" strokeLinejoin="round" data-wardrobe-fallback>
        {item.category==='GARMENT' ? <path d="M42 23L18 39L30 58L40 52V98H80V52L90 58L102 39L78 23Q60 40 42 23Z" /> : <><path d="M60 25L87 53L60 91L33 53Z" /><path d="M33 53H87M60 25L49 53L60 91L71 53Z" /></>}
      </g>}
  </svg>;
}
