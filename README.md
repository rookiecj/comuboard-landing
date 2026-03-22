# ComuBoard Landing Page

ComuBoard 서비스 랜딩 페이지. React + TypeScript + Vite + Tailwind CSS v4 기반 정적 사이트.

## 기술 스택

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인)
- nginx (프로덕션 정적 서빙)

## 로컬 개발 환경 설정

### 사전 요구사항

- Node.js >= 20
- npm >= 10

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### Makefile 명령어

```bash
make dev          # 개발 서버
make build        # 프로덕션 빌드
make test         # TypeScript 타입 체크
make fmt          # Prettier 포맷팅
make docker-build # Docker 이미지 빌드
```

## 프로젝트 구조

```
src/
├── components/
│   ├── Hero.tsx        # 히어로 섹션
│   ├── Features.tsx    # 기능 소개 섹션
│   ├── Showcase.tsx    # 스크린샷/데모 섹션
│   ├── Pricing.tsx     # 요금제 섹션
│   └── Footer.tsx      # 푸터
├── App.tsx             # 메인 레이아웃
├── main.tsx            # 엔트리포인트
└── index.css           # Tailwind CSS 임포트
```

## Docker

```bash
# 빌드
docker build -t comuboard-landing .

# 실행
docker run -p 8080:80 comuboard-landing
```

nginx로 정적 파일을 서빙하며, SPA fallback이 설정되어 있습니다.
