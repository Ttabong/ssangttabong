// components/ImageButton.tsx
'use client';

import Image from 'next/image';

interface ImageButtonProps {
  src: string;
  alt: string;
}

export default function ImageButton({ src, alt }: ImageButtonProps) {
  return (
    <button
      className="overflow-hidden rounded-md shadow-lg border border-white"
      onClick={() => window.open(src, '_blank')}
      aria-label={`${alt} 확대보기`}
    >
      <Image
        src={src}
        alt={alt}
        width={400}
        height={230}
        className="rounded-md object-cover hover:scale-105 transition-transform duration-200"
        style={{ objectFit: 'cover' }}
      />
    </button>
  );
}
