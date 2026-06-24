import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-slate-900">
      
      {/* 
        [상단 헤더 영역]
        - 컴포넌트 분리 팁: 이 헤더는 나중에 'components/Header.tsx'로 분리하기 좋습니다.
        // 여기에 새로운 글로벌 네비게이션 컴포넌트를 추가하세요
      */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-grow">
        
        {/* 
          [Hero Section]
          - 컴포넌트 분리 팁: 이 섹션은 나중에 'components/Hero.tsx'로 분리할 수 있습니다.
          // 여기에 새로운 배너나 대화형 우주 지도 등의 요소를 추가해보세요.
        */}
        <Hero />

        {/* 
          [추가 기능 확장 공간]
          - 이곳에 추가적인 교육 콘텐츠 카드, 퀴즈 섹션, 학습 로드맵 등을 추가할 수 있습니다.
          // 여기에 새로운 학습 콘텐츠 컴포넌트를 추가하세요 (예: components/CardList.tsx)
        */}
        <ContentPlaceholder />
        
      </main>

      {/* 
        [하단 푸터 영역]
        - 컴포넌트 분리 팁: 이 푸터는 'components/Footer.tsx'로 분리하기 편리합니다.
        // 여기에 새로운 소셜 링크나 사이트 맵을 추가하세요
      */}
      <Footer />

    </div>
  );
}

// ==========================================
// 1. Header Component (헤더 컴포넌트)
// ==========================================
function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 cursor-pointer">
            지구최강 🌍
          </span>
        </div>

        {/* 네비게이션 공간 (PC 화면에서는 보이고 모바일에서는 심플하게 반응형 처리 가능) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-emerald-400 transition-colors">홈</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">지구 탐구</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">우주 탐구</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">대기/해양</a>
          <Link
            href="/quiz"
            className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition-colors font-bold"
          >
            🧠 OX 퀴즈
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/quiz"
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 shadow-lg shadow-yellow-500/20"
          >
            🎮 OX 퀴즈 도전
          </Link>
        </div>

      </div>
    </header>
  );
}

// ==========================================
// 2. Hero Component (메인 히어로 섹션)
// ==========================================
function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* 백그라운드 우주 효과 데코레이션 */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 뱃지 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium mb-6 animate-pulse">
          🚀 지구과학의 신세계를 만나다
        </div>

        {/* 환영 문구 */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          <span className="block text-slate-100">지구를 넘어 우주까지,</span>
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
            지구과학쌈싸먹기
          </span>
        </h1>

        {/* 간단 설명 */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed mb-10">
          복잡한 천체 운동부터 신비로운 판 구조론까지, 어렵기만 했던 지구과학 개념들을 
          한눈에 이해하기 쉽게 쌈싸먹듯 정복해 보세요!
        </p>

        {/* 기능 추가를 위한 가짜(Placeholder) 버튼 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="w-full sm:w-auto px-8 py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95">
            지금 학습 시작하기
          </button>
          
          {/* 
            // 여기에 새로운 대화형 버튼이나 다른 탐색 경로용 버튼을 추가할 수 있습니다.
          */}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. Content Placeholder (확장용 가짜 섹션)
// ==========================================
function ContentPlaceholder() {
  return (
    <section className="py-16 sm:py-24 bg-slate-900/50 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 가이드 라인 텍스트 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-200">
            학습 카테고리
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            지구과학을 완벽하게 마스터하기 위한 맞춤 코스입니다.
          </p>
        </div>

        {/* 컴포넌트 확장 플레이스홀더 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 가짜 카드 1 */}
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">🌋</div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">고체지구</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              판 구조론, 지각 변동, 화성암과 지층 등 발밑에서 일어나는 역동적인 지구의 이야기를 학습합니다.
            </p>
          </div>

          {/* 가짜 카드 2 */}
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">🌊</div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">대기와 해양</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              기압과 날씨 변화, 해류의 순환, 엘니뇨와 라니냐 등 지구의 기후를 움직이는 유체의 흐름을 파헤칩니다.
            </p>
          </div>

          {/* 가짜 카드 3 */}
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">✨</div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">우주와 은하</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              우주 탐사, 별의 일생, 허블의 법칙과 외계 행성 탐사 등 광활한 우주의 신비를 탐구합니다.
            </p>
          </div>

          {/* OX 퀴즈 카드 */}
          <Link
            href="/quiz"
            className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-yellow-400/50 transition-all duration-300 group block no-underline"
            style={{ textDecoration: 'none' }}
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">🧠</div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">OX 퀴즈 도전!</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              지구과학 핵심 개념 10문제를 OX로 풀어보고 리더보드에 이름을 올려보세요!
            </p>
            <span className="inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900">
              지금 도전 →
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}

// ==========================================
// 4. Footer Component (푸터 컴포넌트)
// ==========================================
function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs sm:text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-2">🌍 지구최강 교육용 서비스 - 지구과학쌈싸먹기</p>
        <p>© {new Date().getFullYear()} Earth Science Master Corp. All rights reserved.</p>
        
        {/* // 여기에 새로운 컴포넌트를 추가하세요 (예: 개인정보처리방침, 고객센터 링크 등) */}
      </div>
    </footer>
  );
}
