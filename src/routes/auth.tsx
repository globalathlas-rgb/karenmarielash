import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleShell, btnPrimaryCls, inputCls } from "@/components/SiteChrome";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Área da profissional | Karen Marie" },
      { name: "description", content: "Acesso restrito às fichas de anamnese." },
      { property: "og:title", content: "Área da profissional | Karen Marie" },
      { property: "og:description", content: "Acesso restrito às fichas de anamnese." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("E-mail ou senha incorretos, ou e-mail ainda não confirmado.");
      nav({ to: "/fichas" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } });
      setBusy(false);
      setMsg(error ? error.message : "Conta criada. Confirme pelo link enviado ao seu e-mail e depois entre.");
    }
  }

  return (
    <SimpleShell>
      <div className="mx-auto max-w-md">
        <p className="eyebrow text-accent">Acesso restrito</p>
        <h1 className="mt-4 text-5xl">Área da profissional</h1>
        <form onSubmit={submit} className="mt-10 space-y-4">
          <input className={inputCls} type="email" required placeholder="E-mail" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputCls} type="password" required minLength={8} placeholder="Senha (mín. 8 caracteres)" autoComplete={mode === "in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          {msg && <p className="text-sm text-muted-foreground" role="status">{msg}</p>}
          <button className={`${btnPrimaryCls} w-full`} disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</button>
        </form>
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-6 text-sm text-accent underline">
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </div>
    </SimpleShell>
  );
}
