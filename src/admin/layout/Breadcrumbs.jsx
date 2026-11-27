import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { navItems } from "./navItems";

const labelMap = {};
const parentMap = {};

navItems.forEach(item => {
  if (item.to) {
    labelMap[item.to] = item.label;
  }

  item.children?.forEach(child => {
    labelMap[child.to] = child.label;
    parentMap[child.to] = item.label; 
  });
});

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = [];
  if (labelMap[pathname]) {
    const parent = parentMap[pathname];
    if (parent) crumbs.push(parent); 
    crumbs.push(labelMap[pathname]); 
  }

  if (crumbs.length === 0) return null;

  return (
    <nav className="mb-2.5 w-full overflow-x-auto" aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-1.5 px-1 py-0.5 text-xs sm:text-sm whitespace-nowrap text-[#64748B]">
        <Home size={13} className="text-[#64748B] shrink-0" />

        {crumbs.map((label, index) => (
          <li key={label} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            {index === crumbs.length - 1 ? (
              <span className="font-semibold text-[#7E3540]">{label}</span>
            ) : (
              <span className="text-[#64748B] hover:text-[#1E293B] transition-colors">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
