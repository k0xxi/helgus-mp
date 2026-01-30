import { useState } from 'react'
import type { ProductImage } from '../types'

interface ImageGalleryProps {
  images: ProductImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex]

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
        <svg className="w-16 h-16 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  const thumbnails = images.length > 1 && (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => setSelectedIndex(index)}
          className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all ${
            index === selectedIndex
              ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-900'
              : 'opacity-60 hover:opacity-100'
          }`}
          style={{ width: 140, height: 140 }}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden group">
        <img
          src={selectedImage?.url}
          alt={selectedImage?.alt}
          className="w-full h-auto max-h-[600px] object-contain mx-auto"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-900"
            >
              <svg className="w-5 h-5 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-900"
            >
              <svg className="w-5 h-5 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/70 text-white text-sm font-medium rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails - on desktop: right side, on mobile: below */}
      {thumbnails}
    </div>
  )
}
