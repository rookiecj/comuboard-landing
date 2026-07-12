// STORY-346-10: "게시판을 골라 우리 공간을 완성" 조립 섹션의 정적 게시판 카탈로그.
// 이 섹션은 실 커뮤니티 라이브 데이터가 아닌 "게시판 타입" 카탈로그를 조립 데모로
// 보여준다 (brand-positioning §6 용도별 게시판 카탈로그 근거). 코드 식별자·라우트는
// 건드리지 않고, 사용자 노출 문자열만 3계층 용어(공간/게시판)를 따른다.

export interface ShowcaseBoard {
  /** 조립 상태 관리를 위한 안정 키 (라우트/코드 식별자 아님, UI 전용). */
  readonly key: string;
  /** 사용자 노출 게시판 이름 (Level-2 = "게시판"). */
  readonly name: string;
  /** 타일/공간 헤더 이모지. */
  readonly emoji: string;
  /** 게시판 능력 태그 (2~3개, 규모가 아닌 용도 신호). */
  readonly tags: readonly string[];
  /** "우리 {label} 공간" 용도 수식어 (첫 담은 게시판에서 파생, AC5). */
  readonly spaceLabel: string;
}

/**
 * 항시 표시(고정) 게시판 3종 — 공지·필독 / 자유 게시판 / 스터디 Q&A (AC2).
 * 항상 팔레트 상단에 노출되며 순환 교체 대상이 아니다.
 */
export const FIXED_BOARDS: readonly ShowcaseBoard[] = [
  {
    key: "notice",
    name: "공지·필독",
    emoji: "📢",
    tags: ["공지", "필독", "읽음 확인"],
    spaceLabel: "소식",
  },
  {
    key: "free",
    name: "자유 게시판",
    emoji: "💬",
    tags: ["글쓰기", "댓글", "공유"],
    spaceLabel: "수다",
  },
  {
    key: "qna",
    name: "스터디 Q&A",
    emoji: "📚",
    tags: ["질문", "답변", "채택"],
    spaceLabel: "스터디",
  },
];

/**
 * 순환 노출 풀 — 고정 3종 외 나머지 게시판 (AC3). 팔레트의 순환 슬롯이 이 풀에서
 * 주기적으로 부드럽게 교체되어 "종류가 훨씬 많음"을 체감시킨다.
 */
export const CYCLING_BOARDS: readonly ShowcaseBoard[] = [
  {
    key: "event",
    name: "행사 참석",
    emoji: "🎟️",
    tags: ["일정", "장소·정원", "참석 신청"],
    spaceLabel: "행사",
  },
  {
    key: "market",
    name: "중고 장터",
    emoji: "🛒",
    tags: ["가격", "상태", "거래"],
    spaceLabel: "장터",
  },
  {
    key: "gallery",
    name: "사진 갤러리",
    emoji: "🖼️",
    tags: ["썸네일", "캡션", "그리드"],
    spaceLabel: "갤러리",
  },
  {
    key: "attendance",
    name: "출석 체크",
    emoji: "✅",
    tags: ["출석", "집계", "현황"],
    spaceLabel: "출석",
  },
  {
    key: "assignment",
    name: "수업·과제",
    emoji: "🎓",
    tags: ["과제", "제출", "채점"],
    spaceLabel: "수업",
  },
  {
    key: "poll",
    name: "투표·설문",
    emoji: "🗳️",
    tags: ["선택지", "마감", "결과 차트"],
    spaceLabel: "투표",
  },
  {
    key: "files",
    name: "자료실",
    emoji: "📁",
    tags: ["파일", "정리", "다운로드"],
    spaceLabel: "자료",
  },
  {
    key: "ledger",
    name: "회비 장부",
    emoji: "💰",
    tags: ["수입·지출", "잔액", "투명 공개"],
    spaceLabel: "회비",
  },
  {
    key: "reservation",
    name: "예약·신청",
    emoji: "📅",
    tags: ["날짜", "정원", "신청 접수"],
    spaceLabel: "예약",
  },
  {
    key: "workout",
    name: "운동 기록",
    emoji: "🏃",
    tags: ["기록", "루틴", "달성"],
    spaceLabel: "운동",
  },
  {
    key: "coupon",
    name: "쿠폰·적립",
    emoji: "🎫",
    tags: ["발급", "적립", "사용"],
    spaceLabel: "쿠폰",
  },
  {
    key: "recruit",
    name: "멤버 모집",
    emoji: "📣",
    tags: ["소개", "지원", "선발"],
    spaceLabel: "모집",
  },
];

/** 키 → 게시판 조회용 맵 (담긴 순서 리스트 렌더링에 사용). */
export const BOARD_BY_KEY: ReadonlyMap<string, ShowcaseBoard> = new Map(
  [...FIXED_BOARDS, ...CYCLING_BOARDS].map((b) => [b.key, b]),
);
