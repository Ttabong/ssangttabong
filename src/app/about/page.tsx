import Image from 'next/image';

export default function Home() {
  return (
    <main
      style={{
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        padding: '0 2rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* 상단 히어로 영역 */}
      <section
        style={{
          position: 'relative',
          marginTop: '2rem',
          height: '320px',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(243, 156, 18, 0.4)',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/images/about2.jpg"
          alt="모던한 밤 집 이미지"
          fill
          style={{ objectFit: 'cover', filter: 'brightness(0.7)' }}
          priority
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '2rem',
            transform: 'translateY(-50%)',
            color: '#f39c12',
            textShadow: '0 0 10px rgba(0,0,0,0.7)',
          }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            수 부동산
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '400px', lineHeight: '1.5' }}>
            믿음과 신뢰를 바탕으로
            <br />
            성실하게 중개해드립니다.
          </p>
        </div>
      </section>

      {/* 하단 2단 레이아웃 */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.8rem',
          margin: '1rem auto',
        }}
      >
        {/* 왼쪽: 소개 섹션 */}
        <div
          style={{
            flex: '1 1 300px',
            backgroundColor: '#222',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 0 15px rgba(243, 156, 18, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 5vw, 1.7rem)',
              fontWeight: '700',
              color: '#f39c12',
              paddingTop: '5rem',
              marginBottom: '1.5rem',
            }}
          >
            우리는 이렇게 일합니다.
          </h2>
          <ul
            style={{
              color: '#ddd',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              listStylePosition: 'inside',
              paddingLeft: 0,
            }}
          >
            <li>✔ 정직하고 투명한 중개</li>
            <li>✔ 고객 맞춤형 매물 추천</li>
            <li>✔ 지역 전문가의 분석</li>
            <li>✔ 계약부터 사후관리까지 책임 중개</li>
          </ul>
        </div>

        {/* 오른쪽: 약도 + 오시는 길 */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(243, 156, 18, 0.4)',
            }}
          >
            <Image
              src="/images/map.jpg"
              alt="약도 이미지"
              width={600}
              height={300}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              priority
            />
          </div>

          <div
            style={{
              backgroundColor: '#222',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 0 15px rgba(243, 156, 18, 0.4)',
            }}
          >
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#f39c12',
                marginBottom: '1rem',
              }}
            >
              찾아오시는 길
            </h2>
            <p style={{ color: '#ddd', fontSize: '1.1rem', lineHeight: '1.6' }}>
              서울시 ㅇㅇ구 ㅇㅇ동 123-4번지
              <br />
              지하철 ○○역 도보 3분 거리
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
