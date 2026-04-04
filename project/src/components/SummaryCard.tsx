import type { ReactNode } from 'react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
}

export function SummaryCard({ label, value, helper, icon }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <div className="summary-card-label-row">
        <span className="summary-card-label">{label}</span>
        {icon ? <span>{icon}</span> : null}
      </div>
      <div className="summary-card-value">{value}</div>
      {helper ? <div className="summary-card-helper">{helper}</div> : null}
    </article>
  );
}
