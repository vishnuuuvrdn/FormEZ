import { Link } from "react-router-dom";
import iconMap from "../utils/iconMap";
import Badge from "./Badge";

export default function DocumentCard({ document }) {
  const Icon = iconMap[document.icon];
  const { docId, category, info } = document;

  return (
    <Link to={`/document/${docId}`} className="group block focus:outline-none">
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm group-hover:shadow-md group-hover:border-accent/40 group-focus-visible:border-accent/40 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between min-h-[180px]">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-muted flex items-center justify-center text-accent border border-border group-hover:bg-accent/5 transition-colors shrink-0">
              {Icon ? <Icon size={24} strokeWidth={2} /> : null}
            </div>
            <Badge variant="category" value={category} />
          </div>

          <h3 className="text-lg font-serif font-bold text-text-primary mt-4 group-hover:text-accent transition-colors leading-tight">
            {info.title}
          </h3>
          
          {info.tagline && (
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-2.5">
              {info.tagline}
            </p>
          )}

          {info.description && (
            <p className="text-sm text-text-secondary mt-2 leading-relaxed line-clamp-3">
              {info.description}
            </p>
          )}
        </div>

        {/* Dynamic processing and fee tags */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] font-bold text-text-secondary uppercase tracking-widest">
          {info.processingTime ? (
            <span>Time: {info.processingTime}</span>
          ) : (
            <span />
          )}
          {info.fees ? (
            <span>Fees: {info.fees}</span>
          ) : (
            <span />
          )}
        </div>
      </div>
    </Link>
  );
}
