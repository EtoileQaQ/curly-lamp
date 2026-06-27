export function PersonaCard({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        selected
          ? "border-[#6c63ff] bg-[#eee9ff] shadow-sm ring-2 ring-[#6c63ff]/20"
          : "border-[#e5e2ff] bg-white hover:border-[#6c63ff]/40"
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
          selected ? "bg-[#6c63ff] text-white" : "bg-[#f8f7ff] text-[#6c63ff]"
        }`}
      >
        {icon}
      </div>
      <div className="mt-4 font-bold text-[#12101f]">{label}</div>
    </button>
  );
}
