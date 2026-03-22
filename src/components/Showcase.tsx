import { useEffect, useState, useRef } from "react";
import { Users, ArrowRight } from "lucide-react";

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
    description:
      "React, Vue, Svelte 등 프론트엔드 기술을 함께 공부하고 최신 트렌드를 공유합니다.",
    logoUrl: null,
    memberCount: 128,
  },
  {
    id: "2",
    name: "오픈소스 컨트리뷰터",
    description:
      "오픈소스 프로젝트에 기여하고 싶은 개발자들을 위한 커뮤니티입니다.",
    logoUrl: null,
    memberCount: 85,
  },
  {
    id: "3",
    name: "스타트업 빌더스",
    description:
      "아이디어부터 MVP까지, 스타트업 창업 과정을 함께 나누는 커뮤니티입니다.",
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
    description:
      "사용자 경험 디자인의 원칙과 실무 사례를 공유하는 디자이너 커뮤니티입니다.",
    logoUrl: null,
    memberCount: 112,
  },
  {
    id: "6",
    name: "AI & ML 탐험대",
    description:
      "머신러닝, 딥러닝, LLM 등 AI 기술의 최신 논문과 실습을 함께합니다.",
    logoUrl: null,
    memberCount: 198,
  },
];

const API_BASE =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://comuboard.com";

function getInitials(name: string): string {
  return name.slice(0, 2);
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
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Avatar */}
      {community.logoUrl ? (
        <img
          src={community.logoUrl}
          alt={`${community.name} 로고`}
          className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${getInitialBgColor(community.name)}`}
        >
          {getInitials(community.name)}
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-gray-900">
          {community.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {community.description}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <Users className="h-3.5 w-3.5" />
          <span>{community.memberCount.toLocaleString()}명</span>
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
        // Graceful fallback to mock data
        setCommunities(MOCK_COMMUNITIES);
      } finally {
        setLoading(false);
      }
    }

    fetchCommunities();
  }, []);

  // Don't render section if no communities and not loading
  if (!loading && communities.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          공개 커뮤니티
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          다양한 주제의 커뮤니티를 탐색하고, 관심 있는 곳에 참여하세요.
        </p>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex gap-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href="https://comuboard.com/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            더 많은 커뮤니티 보기
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
