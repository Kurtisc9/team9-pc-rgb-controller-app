interface VerificationPillProps {
  label: string;
}

export function VerificationPill({ label }: VerificationPillProps) {
  const className = `verification-pill verification-pill-${label}`;
  return <span className={className}>{label}</span>;
}
