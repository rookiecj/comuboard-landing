import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Code2,
  Github,
  LayoutGrid,
  Palette,
  Rocket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface Community {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logoUrl: string | null;
  readonly memberCount: number;
}

const MOCK_COMMUNITIES: readonly Community[] = [
  {
    id: "1",
    name: "프론트엔드 개발자 모임",
    description: "React, Vue, Svelte 등 기술을 공부하고 트렌드를 공유합니다.",
    logoUrl: null,
    memberCount: 128,
  },
  {
    id: "2",
    name: "오픈소스 컨트리뷰터",
    description: "오픈소스 프로젝트에 기여하고 싶은 개발자들을 위한 커뮤니티.",
    logoUrl: null,
    memberCount: 85,
  },
  {
    id: "3",
    name: "스타트업 빌더스",
    description: "아이디어부터 MVP까지, 창업 과정을 함께 나누는 커뮤니티.",
    logoUrl: null,
    memberCount: 256,
  },
  {
    id: "4",
    name: "독서 토론 클럽",
    description: "매주 한 권의 책을 읽고 깊이 있는 토론을 나눕니다.",
    logoUrl: null,
    memberCount: 64,
  },
  {
    id: "5",
    name: "UX 디자인 연구소",
    description: "사용자 경험 디자인의 실무 사례를 공유하는 커뮤니티.",
    logoUrl: null,
    memberCount: 112,
  },
  {
    id: "6",
    name: "AI & ML 탐험대",
    description: "머신러닝, LLM 등 최신 AI 논문과 실습을 함께합니다.",
    logoUrl: null,
    memberCount: 198,
  },
];

const API_BASE = "https://comuboard.com";

/**
 * Pick a Lucide icon from community name + description (KO/EN keywords).
 * Used when no logo URL is available.
 */
function resolveCommunityIcon(name: string, description: string): LucideIcon {
  const text = `${name} ${description}`.toLowerCase();

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

  return (
    <div className="flex w-[320px] sm:w-[380px] flex-shrink-0 gap-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-6 backdrop-blur-md transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm dark:shadow-none">
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
        <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
          {community.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {community.description}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
          <Users className="h-4 w-4" />
          <span>{community.memberCount.toLocaleString()}명 멤버</span>
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
        const res = await fetch(
          `${API_BASE}/api/service-landing/public-communities?limit=6`,
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setCommunities(data.data);
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
              src="/community-gathering.png"
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
            활발하게 성장 중인 <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
              커뮤니티
            </span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            개발, 디자인, 스타트업 등 <br className="hidden sm:block" />
            다양한 관심사를 가진 사람들이 모여 이미 ComuBoard에서 폭넓은
            이야기와 지식을 쌓아가고 있습니다.
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
          href="https://comuboard.com/explore"
          className="group inline-flex items-center gap-2 text-base font-bold text-brand-600 dark:text-brand-400 transition hover:text-brand-700 dark:hover:text-brand-300"
        >
          더 많은 커뮤니티 둘러보기
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
