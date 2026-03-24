import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rss,
  Mail,
  AtSign,
  BrainCircuit,
  Tags,
  MessageSquare,
  Newspaper,
  Share2,
  QrCode,
  Layout,
  SmilePlus,
  PenTool,
  Workflow,
  ShieldCheck,
  Presentation,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
}

interface Pillar {
  label: string;
  tagline: string;
  color: string;
  bg: string;
  border: string;
  features: FeatureItem[];
}

const pillars: Pillar[] = [
  {
    label: "모으다",
    tagline: "이야기를 꺼내다",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    features: [
      {
        title: "소셜 멘션 수집",
        description:
          "X(Twitter), Slack 등에서 멘션을 감지하여 자동 수집합니다.",
        detail:
          "RSS 피드 자동 수집, Twitter 멘션 수집, 이메일 포워딩을 통해 다양한 채널의 콘텐츠를 한곳에 모읍니다.",
        icon: AtSign,
      },
      {
        title: "RSS 피드 수집",
        description:
          "관심 있는 블로그, 뉴스 사이트의 새 글을 자동으로 가져옵니다.",
        detail:
          "RSS 피드 자동 수집, Twitter 멘션 수집, 이메일 포워딩을 통해 다양한 채널의 콘텐츠를 한곳에 모읍니다.",
        icon: Rss,
      },
      {
        title: "Email 포워딩",
        description: "전용 주소로 메일을 포워딩하면 즉시 게시글로 변환됩니다.",
        detail:
          "QR코드 하나로 오프라인 게시판과 온라인 커뮤니티를 연결합니다. 모임, 행사, 강의실 어디서든 즉시 참여할 수 있습니다.",
        icon: Mail,
      },
    ],
  },
  {
    label: "다듬다",
    tagline: "이야기가 깊어지다",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    features: [
      {
        title: "AI 요약 파이프라인",
        description:
          "긴 링크를 AI가 3줄로 핵심만 요약해 빠르게 파악할 수 있습니다.",
        detail:
          "LLM 기반 게시글 자동 요약, 카테고리/태그 자동 제안으로 콘텐츠를 체계적으로 정리합니다.",
        icon: BrainCircuit,
      },
      {
        title: "투표 & 스레드",
        description:
          "업보트/다운보트와 깔끔한 중첩 댓글로 양질의 지식이 떠오릅니다.",
        detail:
          "기간 제한 투표, 다중 선택, 결과 차트로 커뮤니티의 의견을 구조화합니다.",
        icon: MessageSquare,
      },
      {
        title: "AI 자동 분류",
        description:
          "게시글 내용에 맞는 태그와 카테고리를 AI가 알아서 제안합니다.",
        detail:
          "자유 태그와 5종 커스텀 필드(텍스트/숫자/선택/날짜/평점)로 콘텐츠를 원하는 대로 분류합니다.",
        icon: Tags,
      },
    ],
  },
  {
    label: "나누다",
    tagline: "이야기가 퍼지다",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-500/20",
    features: [
      {
        title: "공유 OG 이미지",
        description:
          "공유 시점에 예쁜 썸네일을 자동 생성하여 시선을 사로잡습니다.",
        detail:
          "게시글별 고유 URL과 SNS 미리보기를 자동 생성하여 어디서든 멋지게 공유됩니다.",
        icon: Share2,
      },
      {
        title: "뉴스레터 다이제스트",
        description:
          "인기 있는 글들을 묶어 정기적인 이메일 뉴스레터로 발송합니다.",
        detail:
          "카카오톡 리치 메시지 공유, 게시글/커뮤니티 카드로 한국 사용자에게 최적화된 공유 경험을 제공합니다.",
        icon: Newspaper,
      },
      {
        title: "QR코드 보드 접속",
        description:
          "오프라인 모임에서도 QR코드 하나로 쉽게 커뮤니티에 합류합니다.",
        detail:
          "주간 다이제스트로 인기 게시글을 자동 큐레이션하여 이메일 뉴스레터로 발송합니다.",
        icon: QrCode,
      },
    ],
  },
];

interface BentoItem {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  color: string;
  bgBlob: string;
}

const bentoFeatures: BentoItem[] = [
  {
    title: "완벽한 몰입, Zen 모드",
    description:
      "Wide, Focus 등 4가지 레이아웃은 물론, 모든 UI를 숨겨 글에만 온전히 몰입하는 Zen 모드를 제공합니다.",
    detail:
      "Standard, Wide, Focus, Zen 4가지 레이아웃 모드를 제공합니다. Zen 모드에서는 사이드바, 헤더 등 모든 UI가 사라져 글에만 집중할 수 있습니다.",
    icon: Layout,
    color: "text-blue-500 dark:text-blue-400",
    bgBlob: "bg-blue-500/10 group-hover:bg-blue-500/20",
  },
  {
    title: "마크다운 프레젠테이션",
    description:
      "적은 글로 강력한 슬라이드 연출을 지원합니다. :::layer 구문으로 배경과 다용도 오버레이를 자유롭게 추가하세요.",
    detail:
      "마크다운으로 작성한 글을 슬라이드로 변환합니다. :::layer 구문으로 배경 이미지, 텍스트 오버레이, 다단 레이아웃을 자유롭게 구성할 수 있습니다.",
    icon: Presentation,
    color: "text-purple-500 dark:text-purple-400",
    bgBlob: "bg-purple-500/10 group-hover:bg-purple-500/20",
  },
  {
    title: "스마트 이모지 추천",
    description:
      "시간대(오전/야간)와 입력 중인 글의 문맥을 분석하여 상황에 가장 알맞은 다의어 이모지를 자동 추천합니다.",
    detail:
      "오전에는 커피, 야간에는 달 이모지처럼 시간대에 맞는 이모지를 우선 추천합니다. 글의 감정과 주제를 분석하여 가장 적합한 이모지를 제안합니다.",
    icon: SmilePlus,
    color: "text-orange-500 dark:text-orange-400",
    bgBlob: "bg-orange-500/10 group-hover:bg-orange-500/20",
  },
  {
    title: "강력한 인라인 다이어그램",
    description:
      "아이디어 스케치를 위한 Excalidraw와 데이터베이스 스키마를 위한 ERD 다이어그램을 기본으로 지원합니다.",
    detail:
      "Excalidraw로 자유로운 스케치를, ERD 다이어그램으로 데이터베이스 설계를 게시글 안에서 바로 그릴 수 있습니다. 별도 도구 없이 인라인으로 작성합니다.",
    icon: PenTool,
    color: "text-teal-500 dark:text-teal-400",
    bgBlob: "bg-teal-500/10 group-hover:bg-teal-500/20",
  },
  {
    title: "자동화 파이프라인",
    description:
      "새 글 작성, 멘션 발생 등의 커뮤니티 이벤트 발생 시 메일, 디스코드 등으로 알림을 자동 발송합니다.",
    detail:
      "커뮤니티 이벤트(새 글, 멘션, 가입 등)를 트리거로 이메일, Discord, Slack 알림을 자동 발송합니다. 조건 필터와 템플릿으로 세밀하게 제어합니다.",
    icon: Workflow,
    color: "text-indigo-500 dark:text-indigo-400",
    bgBlob: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
  },
  {
    title: "투명한 감사 로그 시스템",
    description:
      "관리자 제어 내역이 영구적인 감사 로그(Audit Log)로 남으며, 정교한 회원 액세스 및 아카이브 제어를 지원합니다.",
    detail:
      "모든 관리자 작업이 타임스탬프와 함께 영구 기록됩니다. 회원별 접근 권한 제어, 게시글 아카이브/복원 등 세밀한 관리 기능을 제공합니다.",
    icon: ShieldCheck,
    color: "text-emerald-500 dark:text-emerald-400",
    bgBlob: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggle = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <section
        id="features"
        className="relative bg-white dark:bg-slate-900 py-24 sm:py-32 transition-colors duration-300 border-t border-slate-200 dark:border-slate-800/50"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              커뮤니티가 자라나는{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 font-extrabold">
                3가지
              </span>{" "}
              축
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              애써 글을 쓰지 않아도 알아서 모이고, AI가 핵심만 남기며, 널리
              공유됩니다.
            </p>
          </div>

          {/* 3 Pillars Section */}
          <div className="space-y-24">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
              >
                <div className="mb-8 flex items-center justify-center sm:justify-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className={`text-2xl font-bold ${pillar.color}`}>
                    {pillar.label}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {pillar.tagline}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pillar.features.map((feature) => {
                    const Icon = feature.icon;
                    const key = `pillar-${feature.title}`;
                    const isExpanded = expandedKey === key;
                    return (
                      <motion.div
                        key={feature.title}
                        variants={itemVariants}
                        onClick={() => toggle(key)}
                        className={`group relative rounded-2xl border ${pillar.border} bg-white dark:bg-slate-900/50 p-8 backdrop-blur-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm dark:shadow-none cursor-pointer select-none`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-transparent ${pillar.bg} ring-1 ring-inset ${pillar.border}`}
                          >
                            <Icon className={`h-6 w-6 ${pillar.color}`} />
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </div>
                        <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                          {feature.description}
                        </p>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                {feature.detail}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4th Page: Compact Enterprise Features Grid */}
      <section
        id="features-bento"
        className="relative bg-slate-50 dark:bg-slate-950 py-24 sm:py-32 transition-colors duration-300 border-t border-slate-200 dark:border-slate-800/50"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              몰입을 돕는 강력한{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 font-extrabold">
                도구들
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              본질에 집중할 수 있게 해주는 6가지 핵심 기능을 만나보세요.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
          >
            {bentoFeatures.map((feature) => {
              const Icon = feature.icon;
              const key = `bento-${feature.title}`;
              const isExpanded = expandedKey === key;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  onClick={() => toggle(key)}
                  className="rounded-2xl bg-white dark:bg-slate-900/80 p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow dark:shadow-none group relative overflow-hidden cursor-pointer select-none"
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-colors" />
                  <div className="flex items-start justify-between relative z-10">
                    <Icon className={`h-8 w-8 ${feature.color} mb-5`} />
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden relative z-10"
                      >
                        <p className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {feature.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
