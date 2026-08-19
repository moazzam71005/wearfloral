import { BEDSHEET_HIGHLIGHTS, BEDSHEET_SIZE } from "@/lib/constants";

export function BedsheetHighlights({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-stone-500">All bedsheets are {BEDSHEET_SIZE}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {BEDSHEET_HIGHLIGHTS.map((item) => (
          <li
            key={item}
            className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
