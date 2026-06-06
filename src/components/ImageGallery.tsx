import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const placeholder = (i: number) =>
    `https://placehold.co/800x450/111111/222222?text=${encodeURIComponent(title + " " + (i + 1))}`;

  const prev = () => setActive(a => (a - 1 + images.length) % images.length);
  const next = () => setActive(a => (a + 1) % images.length);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-[#111] rounded-xl flex items-center justify-center text-gray-600">
        No images available
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div className="relative group">
        <div
          className="relative aspect-video bg-[#111] rounded-xl overflow-hidden cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <img
            src={errors[active] ? placeholder(active) : images[active]}
            alt={`${title} screenshot ${active + 1}`}
            onError={() => setErrors(e => ({ ...e, [active]: true }))}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <ZoomIn className="text-white/80" size={32} />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              data-testid={`button-thumb-${i}`}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-red-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={errors[i] ? placeholder(i) : img}
                alt={`Thumb ${i + 1}`}
                onError={() => setErrors(e => ({ ...e, [i]: true }))}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg bg-[#222] text-white hover:bg-red-500/20 transition-colors"
          >
            <X size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-[#222] text-white hover:bg-red-500/20 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-[#222] text-white hover:bg-red-500/20 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <img
            src={errors[active] ? placeholder(active) : images[active]}
            alt={`${title} ${active + 1}`}
            onClick={e => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
          />
          <div className="absolute bottom-4 text-gray-400 text-sm">
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
