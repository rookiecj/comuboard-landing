import { motion } from "framer-motion";
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
} from "lucide-react";

const pillars = [
  {
    label: "모으다",
    tagline: "이야기를 꺼내다",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    features: [
      {
        title: "소셜 멘션 수집",
        description: "X(Twitter), Slack 등에서 멘션을 감지하여 자동 수집합니다.",
        icon: AtSign,
      },
      {
        title: "RSS 피드 수집",
        description: "관심 있는 블로그, 뉴스 사이트의 새 글을 자동으로 가져옵니다.",
        icon: Rss,
      },
      {
        title: "Email 포워딩",
        description: "전용 주소로 메일을 포워딩하면 즉시 게시글로 변환됩니다.",
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
        description: "긴 링크를 AI가 3줄로 핵심만 요약해 빠르게 파악할 수 있습니다.",
        icon: BrainCircuit,
      },
      {
        title: "투표 & 스레드",
        description: "업보트/다운보트와 깔끔한 중첩 댓글로 양질의 지식이 떠오릅니다.",
        icon: MessageSquare,
      },
      {
        title: "AI 자동 분류",
        description: "게시글 내용에 맞는 태그와 카테고리를 AI가 알아서 제안합니다.",
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
        description: "공유 시점에 예쁜 썸네일을 자동 생성하여 시선을 사로잡습니다.",
        icon: Share2,
      },
      {
        title: "뉴스레터 다이제스트",
        description: "인기 있는 글들을 묶어 정기적인 이메일 뉴스레터로 발송합니다.",
        icon: Newspaper,
      },
      {
        title: "QR코드 보드 접속",
        description: "오프라인 모임에서도 QR코드 하나로 쉽게 커뮤니티에 합류합니다.",
        icon: QrCode,
      },
    ],
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
  return (
    <>
      <section id="features-pillars" className="relative bg-white dark:bg-slate-900 py-24 sm:py-32 transition-colors duration-300 border-t border-slate-200 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            커뮤니티가 자라나는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 font-extrabold">3가지</span> 축
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            애써 글을 쓰지 않아도 알아서 모이고, AI가 핵심만 남기며, 널리 공유됩니다.
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
                  return (
                    <motion.div
                      key={feature.title}
                      variants={itemVariants}
                      className={`group relative rounded-2xl border ${pillar.border} bg-white dark:bg-slate-900/50 p-8 backdrop-blur-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:-translate-y-1 shadow-sm dark:shadow-none`}
                    >
                      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-transparent ${pillar.bg} ring-1 ring-inset ${pillar.border}`}>
                        <Icon className={`h-6 w-6 ${pillar.color}`} />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {feature.description}
                      </p>
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
      <section id="features-bento" className="relative bg-slate-50 dark:bg-slate-950 py-24 sm:py-32 transition-colors duration-300 border-t border-slate-200 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              몰입을 돕는 강력한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 font-extrabold">도구들</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              너무 많은 공간을 차지하지 않고 본질에 집중할 수 있게 해주는 6가지 핵심 엔터프라이즈 기능을 만나보세요.
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-slate-900/80 p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow dark:shadow-none group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-colors" />
              <Layout className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-5 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">완벽한 몰입, Zen 모드</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                Wide, Focus 등 4가지 레이아웃은 물론, 모든 UI를 숨겨 글에만 온전히 몰입하는 Zen 모드를 제공합니다.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-slate-900/80 p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow dark:shadow-none group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-colors" />
              <Presentation className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-5 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">마크다운 프레젠테이션</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                적은 글로 강력한 슬라이드 연출을 지원합니다. :::layer 구문으로 배경과 다용도 오버레이를 자유롭게 추가하세요.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-slate-900/80 p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow dark:shadow-none group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-colors" />
              <SmilePlus className="h-8 w-8 text-orange-500 dark:text-orange-400 mb-5 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">스마트 이모지 추천</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                시간대(오전/야간)와 입력 중인 글의 문맥을 분석하여 상황에 가장 알맞은 다의어 이모지를 자동 추천합니다.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-slate-900/80 p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow dark:shadow-none group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-500/10 blur-2xl group-hover:bg-teal-500/20 transition-colors" />
              <PenTool className="h-8 w-8 text-teal-500 dark:text-teal-400 mb-5 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">강력한 인라인 다이어그램</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                아이디어 스케치를 위한 Excalidraw와 데이터베이스 스키마를 위한 ERD 다이어그램을 기본으로 지원합니다.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-slate-900/80 p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow dark:shadow-none group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
              <Workflow className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mb-5 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">자동화 파이프라인</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                새 글 작성, 멘션 발생 등의 커뮤니티 이벤트 발생 시 메일, 디스코드 등으로 알림을 자동 발송합니다.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-slate-900/80 p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow dark:shadow-none group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
              <ShieldCheck className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mb-5 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">투명한 감사 로그 시스템</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                관리자 제어 내역이 영구적인 감사 로그(Audit Log)로 남으며, 정교한 회원 액세스 및 아카이브 제어를 지원합니다.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
