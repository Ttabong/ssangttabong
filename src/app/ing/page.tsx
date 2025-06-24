// app/page.tsx
import Image from 'next/image';

export default function Home() {
  return (

      <div className="flex justify-center h-177">
        <Image
          src="/default-image.jpg" // public 폴더 내 이미지 경로
          alt="메인 이미지"
          width={500}
          height={250}
          className="rounded-md shadow-lg items-center"
          priority
        />
      </div>

  );
}