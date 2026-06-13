import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarCheck,
  Code2,
  Github,
  GraduationCap,
  LayoutGrid,
  Megaphone,
  MessagesSquare,
  Palette,
  Rocket,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface Community {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logoUrl: string | null;
  readonly bannerUrl: string;
  readonly memberCount: number;
}

/** Shape returned by GET /api/service-landing → featuredCommunities[] */
interface ApiFeaturedCommunity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly logo: string | null;
  readonly bannerUrl: string;
  readonly description: string | null;
  readonly memberCount: number;
}

const MOCK_COMMUNITIES: readonly Community[] = [
  {
    id: "1",
    name: "동호회 게시판",
    description: "일정·공지를 한곳에 모으고, 행사 참석까지 받아요.",
    logoUrl: null,
    bannerUrl: "",
    memberCount: 128,
  },
  {
    id: "2",
    name: "스터디 Q&A 게시판",
    description: "궁금한 건 바로 질문하고, 가장 좋은 답변을 채택해요.",
    logoUrl: null,
    bannerUrl: "",
    memberCount: 85,
  },
  {
    id: "3",
    name: "수업·과제 게시판",
    description: "과제를 내고 제출받고 채점까지, 수업 운영이 깔끔해져요.",
    logoUrl: null,
    bannerUrl: "",
    memberCount: 256,
  },
  {
    id: "4",
    name: "행사 참석 게시판",
    description: "날짜·장소·정원을 정하고 참석 신청을 실시간으로 모아요.",
    logoUrl: null,
    bannerUrl: "",
    memberCount: 64,
  },
  {
    id: "5",
    name: "중고 장터 게시판",
    description: "사고팔 물건을 올리고 가격·상태를 한눈에 확인해요.",
    logoUrl: null,
    bannerUrl: "",
    memberCount: 112,
  },
  {
    id: "6",
    name: "공지·필독 게시판",
    description: "꼭 봐야 할 소식을 필독 배지로 빠짐없이 전해요.",
    logoUrl: null,
    bannerUrl: "",
    memberCount: 198,
  },
];

import { API_BASE, APP_ROUTES } from "../config";

/**
 * Pick a Lucide icon from community name + description (KO/EN keywords).
 * Used when no logo URL is available.
 */
function resolveCommunityIcon(name: string, description: string): LucideIcon {
  const text = `${name} ${description}`.toLowerCase();

  // Use-case board keywords (board-first repositioning) take priority.
  if (/공지|필독|announcement|notice/.test(text)) {
    return Megaphone;
  }
  if (/행사|참석|이벤트|event|rsvp|모임\s*신청/.test(text)) {
    return CalendarCheck;
  }
  if (/장터|중고|거래|마켓|market|판매|구매/.test(text)) {
    return ShoppingBag;
  }
  if (/수업|과제|클래스|강의|레슨|class|assignment|lesson/.test(text)) {
    return GraduationCap;
  }
  if (/q&a|q\s*&\s*a|질문|답변|qna|문답/.test(text)) {
    return MessagesSquare;
  }
  if (/스터디|study/.test(text)) {
    return BookOpen;
  }
  if (/동호회|동아리|모임|클럽|club|meetup/.test(text)) {
    return Users;
  }

  if (
    /프론트|react|vue|svelte|angular|next\.?js|frontend|javascript|typescript|웹\s*개발|web\s*dev/.test(
      text,
    )
  ) {
    return Code2;
  }
  if (
    /오픈소스|open\s*source|github|깃허브|컨트리뷰|contribut|기여/.test(text)
  ) {
    return Github;
  }
  if (/스타트업|창업|mvp|빌더|startup|founder|엑셀러|투자|사업/.test(text)) {
    return Rocket;
  }
  if (/독서|책\s|책을|book|reading|리딩|문학/.test(text)) {
    return BookOpen;
  }
  if (
    /ux|ui\b|디자인|design|figma|사용자\s*경험|프로토타입|와이어프레임/.test(
      text,
    )
  ) {
    return Palette;
  }
  if (
    /ai\b|ml\b|llm|머신러닝|machine\s*learning|딥러닝|deep\s*learning|neural|gpt|클로드/.test(
      text,
    )
  ) {
    return BrainCircuit;
  }
  if (/개발자|developer|dev\b|코딩|programming|소프트웨어/.test(text)) {
    return Code2;
  }
  if (/커뮤니티|모임|클럽|meetup|forum|네트워크/.test(text)) {
    return LayoutGrid;
  }

  return Users;
}

/**
 * Derive 2~3 capability tags (Korean function labels) from community
 * name + description. Replaces the member-count badge on landing use-case
 * cards: the Showcase sells "what board you can build" (게시판 후크), so a
 * use-case/capability signal reinforces the board-first framing better than
 * a scale signal (멤버수 = 규모/커뮤니티 신호 — brand-positioning §7 원칙 2,
 * 로비에서 노출). Keyword map mirrors resolveCommunityIcon.
 */
function resolveCapabilityTags(name: string, description: string): string[] {
  const text = `${name} ${description}`.toLowerCase();

  if (/공지|필독|announcement|notice/.test(text)) {
    return ["공지", "필독", "읽음 확인"];
  }
  if (/행사|참석|이벤트|event|rsvp|모임\s*신청/.test(text)) {
    return ["일정", "장소·정원", "참석 신청"];
  }
  if (/장터|중고|거래|마켓|market|판매|구매/.test(text)) {
    return ["가격", "상태", "거래"];
  }
  if (/수업|과제|클래스|강의|레슨|class|assignment|lesson/.test(text)) {
    return ["과제", "제출", "채점"];
  }
  if (/q&a|q\s*&\s*a|질문|답변|qna|문답/.test(text)) {
    return ["질문", "답변", "채택"];
  }
  if (/스터디|study/.test(text)) {
    return ["진도", "자료실", "Q&A"];
  }
  if (/동호회|동아리|모임|클럽|club|meetup/.test(text)) {
    return ["회비", "일정", "갤러리"];
  }
  if (/투표|설문|poll|vote/.test(text)) {
    return ["선택지", "마감", "결과 차트"];
  }
  if (/갤러리|사진|작품|gallery|이미지/.test(text)) {
    return ["썸네일", "캡션", "그리드"];
  }
  return ["글쓰기", "댓글", "공유"];
}

function getInitialBgColor(name: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-violet-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function CommunityCard({ community }: { readonly community: Community }) {
  const Icon = resolveCommunityIcon(community.name, community.description);
  const hasBanner = !!community.bannerUrl;

  return (
    <div
      className={`relative flex w-[320px] sm:w-[380px] flex-shrink-0 gap-4 rounded-2xl p-6 transition-all shadow-sm ${
        hasBanner
          ? "bg-cover bg-center text-white"
          : "border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 dark:shadow-none"
      }`}
      style={
        hasBanner
          ? { backgroundImage: `url(${community.bannerUrl})` }
          : undefined
      }
    >
      {hasBanner && (
        <div className="absolute inset-0 rounded-2xl bg-black/40" />
      )}
      <div className={`relative flex gap-4 ${hasBanner ? "z-10" : ""}`}>
        {community.logoUrl ? (
          <img
            src={community.logoUrl}
            alt={`${community.name} 로고`}
            className="h-14 w-14 flex-shrink-0 rounded-xl object-cover ring-1 ring-slate-900/5 dark:ring-white/10"
          />
        ) : (
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-inner ring-1 ring-slate-900/5 dark:ring-white/10 ${getInitialBgColor(community.name)}`}
            aria-hidden
          >
            <Icon
              className="h-7 w-7 shrink-0 opacity-95 drop-shadow-sm"
              strokeWidth={2}
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3
            className={`truncate text-lg font-semibold ${hasBanner ? "text-white" : "text-slate-900 dark:text-white"}`}
          >
            {community.name}
          </h3>
          <p
            className={`mt-1 line-clamp-2 text-sm leading-relaxed ${hasBanner ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}
          >
            {community.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {resolveCapabilityTags(community.name, community.description).map(
              (tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    hasBanner
                      ? "bg-white/20 text-white/90"
                      : "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                  }`}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const [communities, setCommunities] = useState<readonly Community[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchCommunities() {
      try {
        const res = await fetch(`${API_BASE}/api/service-landing`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const featured: ApiFeaturedCommunity[] = data.featuredCommunities ?? [];
        if (featured.length > 0) {
          setCommunities(
            featured.map((c) => ({
              id: c.id,
              name: c.name,
              description: c.description ?? "",
              logoUrl: c.logo ? `${API_BASE}${c.logo}` : null,
              bannerUrl: c.bannerUrl ? `${API_BASE}${c.bannerUrl}` : "",
              memberCount: c.memberCount,
            })),
          );
        } else {
          setCommunities(MOCK_COMMUNITIES);
        }
      } catch {
        setCommunities(MOCK_COMMUNITIES);
      } finally {
        setLoading(false);
      }
    }

    fetchCommunities();
  }, []);

  if (!loading && communities.length === 0) return null;

  // Duplicate for seamless scroll
  const scrollItems = [...communities, ...communities, ...communities];

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 py-24 sm:py-32 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-2 sm:p-4 backdrop-blur-xl shadow-2xl transition-colors duration-300">
            <img
              src={`${import.meta.env.BASE_URL}community-gathering.png`}
              alt="Community Gathering"
              className="w-full h-auto rounded-xl shadow-[0_0_60px_-15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_60px_-15px_rgba(59,130,246,0.3)] ring-1 ring-slate-900/5 dark:ring-white/10 object-cover bg-white"
            />
          </div>
        </motion.div>

        {/* Right: Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            필요한 게시판이 <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
              다 있어요
            </span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            동호회 공지부터 스터디 Q&amp;A, 수업 과제, 행사 참석, 중고 장터까지.{" "}
            <br className="hidden sm:block" />
            용도에 맞는 게시판을 코드 없이 바로 만들고, 쓰다 보면 커뮤니티로
            자라요.
          </p>
        </motion.div>
      </div>

      <div className="relative flex w-full overflow-hidden mb-12 py-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 sm:w-48 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent transition-colors duration-300"></div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 sm:w-48 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent transition-colors duration-300"></div>

        {loading ? (
          <div className="flex gap-6 px-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-shrink-0 w-[320px] sm:w-[380px] gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/30 p-6"
              >
                <div className="h-14 w-14 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex gap-6 px-6"
            animate={{ x: [0, -2000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {scrollItems.map((community, i) => (
              <CommunityCard
                key={`${community.id}-${i}`}
                community={community}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-10 text-center">
        <a
          href={APP_ROUTES.boards}
          className="group inline-flex items-center gap-2 text-base font-bold text-brand-600 dark:text-brand-400 transition hover:text-brand-700 dark:hover:text-brand-300"
        >
          더 많은 게시판 둘러보기
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
