import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QUESTIONS, type Answers } from "@/lib/anamnese";
import { SimpleShell } from "@/components/SiteChrome";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/fichas")({
  head: () => ({
    meta: [
      { title: "Fichas de anamnese | Karen Marie" },
      { name: "description", content: "Fichas recebidas — acesso restrito." },
      { property: "og:title", content: "Fichas de anamnese | Karen Marie" },
      { property: "og:description", content: "Fichas recebidas — acesso restrito." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Fichas,
});

function Fichas() {
  const nav = useNavigate();
  const [state, setState] = useState<"loading" | "forbidden" | "ok">("loading");
  const [rows, setRows] = useState<Tables<"anamnese_submissions">[]>([]);
  const [reqs, setReqs] = useState<Tables<"data_requests">[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
    if (!isAdmin) return setState("forbidden");
    const [a, b] = await Promise.all([
      supabase.from("anamnese_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("data_requests").select("*").order("created_at", { ascending: false }),
    ]);
    setRows(a.data ?? []); setReqs(b.data ?? []); setState("ok");
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Excluir esta ficha definitivamente?")) return;
    await supabase.from("anamnese_submissions").delete().eq("id", id);
    load();
  }
  async function signOut() { await supabase.auth.signOut(); nav({ to: "/auth" }); }

  return (
    <SimpleShell>
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-5xl">Fichas recebidas</h1>
        <button onClick={signOut} className="text-sm text-accent underline">Sair</button>
      </div>
      {state === "loading" && <p className="mt-10 text-muted-foreground">Carregando...</p>}
      {state === "forbidden" && <p className="mt-10 text-muted-foreground">Esta conta não tem permissão para ver as fichas.</p>}
      {state === "ok" && (
        <>
          {rows.length === 0 && <p className="mt-10 text-muted-foreground">Nenhuma ficha recebida ainda.</p>}
          <div className="mt-10 space-y-3">
            {rows.map((r) => {
              const answers = r.answers as Answers;
              return (
                <div key={r.id} className="rounded-2xl border border-border">
                  <button onClick={() => setOpen(open === r.id ? null : r.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                    <span>
                      <span className="font-medium">{r.full_name}</span>, {r.age} anos — {r.procedure}
                      <span className="block text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")}</span>
                    </span>
                    {r.needs_review && <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs text-secondary"><AlertTriangle className="h-3 w-3" /> Avaliar</span>}
                  </button>
                  {open === r.id && (
                    <div className="space-y-3 border-t border-border p-5 text-sm">
                      {QUESTIONS.filter((q) => answers[q.id]).map((q) => (
                        <p key={q.id}><span className="text-muted-foreground">{q.label}</span><br />
                          <strong>{answers[q.id]!.value === "sim" ? "Sim" : "Não"}</strong>{answers[q.id]!.detail ? ` — ${answers[q.id]!.detail}` : ""}</p>
                      ))}
                      {r.notes && <p><span className="text-muted-foreground">Observações</span><br />{r.notes}</p>}
                      <button onClick={() => remove(r.id)} className="text-destructive underline">Excluir ficha</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {reqs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl">Solicitações de dados (LGPD)</h2>
              <ul className="mt-6 space-y-3 text-sm">
                {reqs.map((q) => (
                  <li key={q.id} className="rounded-xl border border-border p-4">
                    <strong>{q.request_type === "acesso" ? "Acesso" : "Exclusão"}</strong> — {q.full_name} ({q.contact})
                    {q.details && <p className="mt-1 text-muted-foreground">{q.details}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString("pt-BR")}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </SimpleShell>
  );
}
