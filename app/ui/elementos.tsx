import type { ReactNode } from "react";
import { Link } from "react-router";

export function PageIntro({ title, kicker, children }: { title: string; kicker?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-intro">
      {kicker}
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

export function Arrow({ back = false }: { back?: boolean }) {
  return <span className="link-arrow" aria-hidden="true">{back ? "←" : "→"}</span>;
}

export function TextLink({ to, children, back = false, label }: {
  to: string;
  children: ReactNode;
  back?: boolean;
  label?: string;
}) {
  return (
    <Link className="text-link" to={to} aria-label={label}>
      {back && <Arrow back />}
      <span className="text-link__label">{children}</span>
      {!back && <Arrow />}
    </Link>
  );
}
