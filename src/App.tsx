import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, RefreshCw, Download, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { StyleSelector, PRESET_STYLES, type StyleOption } from './components/StyleSelector';
import { transformImage } from './services/gemini';

export default function App() {
  const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [customStyle, setCustomStyle] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async () => {
    if (!image) return;
    
    const prompt = customStyle || selectedStyle?.prompt;
    if (!prompt) {
      setError('Please select a style or enter a custom one.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await transformImage(image.base64, image.mimeType, prompt);
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to transform image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResultImage(null);
    setError(null);
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `stylemorph-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Marquee Header */}
      <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap border-b-2 border-black">
        <div className="flex animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-4 font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} className="text-emerald-400" />
              Transform your reality with StyleMorph AI
              <Sparkles size={12} className="text-emerald-400" />
            </span>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-12 space-y-12">
        {/* Hero Section */}
        <header className="space-y-4">
          <div className="inline-block px-3 py-1 bg-emerald-400 border-2 border-black rounded-full font-bold text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Powered by Gemini 2.5
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
            STYLE<br />
            <span className="text-emerald-500 italic">MORPH</span>
          </h1>
          <p className="text-xl text-black/60 max-w-xl font-medium">
            Upload a photo and instantly transform it into any artistic style you can imagine.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Controls */}
          <div className="space-y-10">
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">1</span>
                Upload Photo
              </div>
              <ImageUpload 
                onImageSelect={(base64, mimeType) => setImage({ base64, mimeType })}
                selectedImage={image?.base64 || null}
                onClear={() => {
                  setImage(null);
                  setResultImage(null);
                }}
              />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">2</span>
                Choose Style
              </div>
              <StyleSelector 
                selectedStyleId={selectedStyle?.id || null}
                onStyleSelect={(style) => {
                  setSelectedStyle(style);
                  setCustomStyle('');
                }}
                customStyle={customStyle}
                onCustomStyleChange={(val) => {
                  setCustomStyle(val);
                  setSelectedStyle(null);
                }}
              />
            </section>

            <button
              onClick={handleTransform}
              disabled={!image || (!selectedStyle && !customStyle) || isLoading}
              className={`w-full py-6 rounded-2xl border-4 border-black font-bold text-2xl flex items-center justify-center gap-4 transition-all
                ${!image || (!selectedStyle && !customStyle) || isLoading
                  ? 'bg-gray-200 text-black/20 cursor-not-allowed'
                  : 'bg-emerald-400 hover:bg-emerald-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'}`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  MORPHING...
                </>
              ) : (
                <>
                  <Wand2 />
                  GENERATE STYLE
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-100 border-2 border-red-500 text-red-700 rounded-xl font-bold flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">!</div>
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Result */}
          <div className="lg:sticky lg:top-12">
            <AnimatePresence mode="wait">
              {resultImage ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="relative aspect-square w-full border-4 border-black rounded-2xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(16,185,129,1)]">
                    <img 
                      src={resultImage} 
                      alt="Transformed" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                       <button 
                        onClick={downloadImage}
                        className="flex-1 bg-white border-2 border-black p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                       >
                         <Download size={18} />
                         SAVE
                       </button>
                       <button 
                        onClick={reset}
                        className="bg-black text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black/80 shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                       >
                         <RefreshCw size={18} />
                         NEW
                       </button>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Sparkles className="text-emerald-500" size={20} />
                      Transformation Complete
                    </h3>
                    <p className="text-black/60 text-sm">
                      Your image has been reimagined using the <strong>{customStyle || selectedStyle?.name}</strong> style. 
                      The composition was preserved while applying new artistic textures and lighting.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-square w-full border-4 border-dashed border-black/20 rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-white/50"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-2 border-black/10">
                    <ArrowRight size={40} className="text-black/20" />
                  </div>
                  <h3 className="text-2xl font-bold text-black/40">Your creation will appear here</h3>
                  <p className="text-black/30 mt-2">Select a photo and style to begin the morphing process.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black p-8 mt-12 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-emerald-400 border-2 border-black rounded-lg"></div>
            StyleMorph AI
          </div>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500">About</a>
            <a href="#" className="hover:text-emerald-500">Privacy</a>
            <a href="#" className="hover:text-emerald-500">Terms</a>
          </div>
          <div className="text-xs font-mono text-black/40">
            © 2026 STYLEMORPH LABS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
