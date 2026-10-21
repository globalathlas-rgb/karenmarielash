import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SimpleShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background/85 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6">
          <Link to="/" className="leading-none">
            <span className="font-display text-2xl italic">Karen Marie</span>
            <span className="eyebrow mt-1 block text-[0.55rem] text-accent">Lash Designer</span>
          </Link>
          <Link to="/" className="text-sm transition-colors hover:text-accent">← Voltar ao site</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-14 md:py-20">{children}</main>
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";
export const btnPrimaryCls =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-xs font-medium tracking-[0.2em] text-primary-foreground uppercase transition-all duration-500 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0";
