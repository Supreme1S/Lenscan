import type { ReactNode } from "react";

export function Table({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-slate-200/90 ${className}`}
    >
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-slate-200/90 bg-slate-50/90">
      {children}
    </thead>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-slate-200/80 bg-white/60">{children}</tbody>
  );
}

export function Tr({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}

export function Th({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-3 text-slate-600 ${className}`}>{children}</th>
  );
}

export function Td({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-slate-800 ${className}`}>{children}</td>;
}
