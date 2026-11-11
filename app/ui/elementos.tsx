import type { ReactNode } from "react";
import { Link } from "react-router";

export function PageIntro({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="page-intro">
      <h1>{title}</h1>
      {children}
    </header>
  );
}

export function ActionLink({
  to,
  children,
  primary = false,
}: {
  to: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link className={primary ? "action-link action-link--primary" : "action-link"} to={to}>
      {children}
    </Link>
  );
}
