import React from 'react';
import { Sparkles, Palette, Zap, Brush, Camera, PenTool } from 'lucide-react';

export interface StyleOption {
  id: string;
  name: string;
  prompt: string;
  icon: React.ReactNode;
  color: string;
}

export const PRESET_STYLES: StyleOption[] = [
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    prompt: 'Cyberpunk style with neon lights, futuristic city vibes, high contrast, dark blue and magenta tones',
    icon: <Zap size={20} />,
    color: 'bg-fuchsia-400'
  },
  { 
    id: 'oil-painting', 
    name: 'Oil Painting', 
    prompt: 'Classic oil painting style, thick brushstrokes, rich textures, artistic masterpiece',
    icon: <Palette size={20} />,
    color: 'bg-amber-400'
  },
  { 
    id: 'anime', 
    name: 'Anime', 
    prompt: 'Studio Ghibli inspired anime style, vibrant colors, clean lines, whimsical atmosphere',
    icon: <Sparkles size={20} />,
    color: 'bg-sky-400'
  },
  { 
    id: 'sketch', 
    name: 'Sketch', 
    prompt: 'Hand-drawn pencil sketch, black and white, detailed shading, graphite texture',
    icon: <PenTool size={20} />,
    color: 'bg-stone-400'
  },
  { 
    id: '3d-render', 
    name: '3D Render', 
    prompt: 'Pixar style 3D animation render, soft lighting, smooth surfaces, cute and friendly aesthetic',
    icon: <Camera size={20} />,
    color: 'bg-emerald-400'
  },
];

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onStyleSelect: (style: StyleOption) => void;
  customStyle: string;
  onCustomStyleChange: (val: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onStyleSelect,
  customStyle,
  onCustomStyleChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {PRESET_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            className={`flex flex-col items-center gap-3 p-4 border-2 border-black rounded-xl transition-all group
              ${selectedStyleId === style.id 
                ? `${style.color} translate-x-1 translate-y-1 shadow-none` 
                : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <div className={`p-3 border-2 border-black rounded-full transition-transform group-hover:scale-110
              ${selectedStyleId === style.id ? 'bg-white' : style.color}`}>
              {style.icon}
            </div>
            <span className="font-bold text-sm">{style.name}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute -top-3 left-4 bg-white px-2 border-2 border-black font-bold text-xs uppercase tracking-widest">
          Custom Style
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={customStyle}
              onChange={(e) => onCustomStyleChange(e.target.value)}
              placeholder="e.g., Van Gogh style, 19th century vintage photo, voxel art..."
              className="w-full p-4 pl-12 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
            />
            <Brush className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
