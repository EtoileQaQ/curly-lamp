type LinkedInPostMockupProps = {
  initials: string;
  name: string;
  role: string;
  content: string;
  reactions: number;
  comments: string;
};

function LinkedInLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-[#0A66C2]"
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M7 10v11" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
  );
}

export function LinkedInPostMockup({
  initials,
  name,
  role,
  content,
  reactions,
  comments,
}: LinkedInPostMockupProps) {
  return (
    <article className="flex h-full max-w-[480px] flex-col rounded-xl border border-[#e0e0e0] bg-white p-5 shadow-md">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[#111]">{name}</div>
          <div className="text-xs leading-relaxed text-[#666]">
            {role}
            <span className="text-[#999]"> • Vous suit</span>
          </div>
        </div>
        <LinkedInLogo />
      </header>

      <div className="my-4 h-px bg-[#e5e5e5]" />

      <p className="whitespace-pre-line text-sm leading-6 text-[#222]">{content}</p>

      <footer className="mt-auto pt-5 text-xs text-[#666]">
        <div className="flex items-center gap-4 border-t border-[#e5e5e5] pt-3">
          <span className="flex items-center gap-1.5">
            <ThumbIcon />
            {reactions}
          </span>
          <span className="flex items-center gap-1.5">
            <CommentIcon />
            {comments}
          </span>
        </div>
      </footer>
    </article>
  );
}
