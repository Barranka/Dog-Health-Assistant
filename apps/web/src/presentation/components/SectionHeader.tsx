import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  action?: string;
  actionTo?: string;
}

export function SectionHeader({ title, action, actionTo }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold">{title}</h2>
      {action && actionTo ? (
        <Link className="text-sm font-medium text-[var(--app-link)]" to={actionTo}>
          {action}
        </Link>
      ) : null}
      {action && !actionTo ? (
        <span className="text-sm font-medium text-[var(--app-link)]">{action}</span>
      ) : null}
    </div>
  );
}
