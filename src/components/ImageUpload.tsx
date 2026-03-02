import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string, mimeType: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (selectedImage) {
    return (
      <div className="relative group aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <img 
          src={selectedImage} 
          alt="Selected" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <button
          onClick={onClear}
          className="absolute top-4 right-4 p-2 bg-white border-2 border-black rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative aspect-square w-full max-w-md mx-auto flex flex-col items-center justify-center border-4 border-dashed rounded-2xl transition-all cursor-pointer
        ${isDragging ? 'border-black bg-emerald-50 scale-[1.02]' : 'border-black/20 bg-white hover:border-black hover:bg-gray-50'}
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />
      <div className="p-6 bg-emerald-400 border-2 border-black rounded-full mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Upload size={32} />
      </div>
      <p className="font-bold text-lg">Drop your photo here</p>
      <p className="text-sm text-black/60 mt-2">or click to browse</p>
      <div className="mt-8 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/40">
        <ImageIcon size={14} />
        <span>JPG, PNG, WEBP supported</span>
      </div>
    </div>
  );
};
