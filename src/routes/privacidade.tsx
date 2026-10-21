import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SimpleShell, btnPrimaryCls, inputCls } from "@/components/SiteChrome";

const TITLE = "Privacidade e seus dados | Karen Marie Lash Designer";
const DESC = "Como Karen Marie Lash Designer trata seus dados pessoais e de saúde, e como solicitar acesso ou exclusão.";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacidade,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome").max(120),
  contact: z.string().trim().min(5, "Informe um telefone ou e-mail para retorno").max(160),
  request_type: z.enum(["acesso", "exclusao"]),
  details: z.string().trim().max(1000).optional(),
});

function Privacidade() {
  const [f, setF] = useState({ full_name: "", contact: "", request_type: "acesso" as "acesso" | "exclusao", details: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = schema.safeParse({ ...f, details: f.details || undefined });
    if (!p.success) return setError(p.error.issues[0]!.message);
    setError(""); setStatus("sending");
    const { error } = await supabase.from("data_requests").insert({ ...p.data, details: p.data.details ?? null });
    if (error) { setStatus("idle"); return setError("Não foi possível enviar. Tente novamente."); }
    setStatus("done");
  }

  return (
    <SimpleShell>
      <p className="eyebrow text-accent">LGPD</p>
      <h1 className="mt-4 text-5xl">Privacidade e seus dados</h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>Na ficha de anamnese coletamos nome, idade, procedimento desejado e respostas sobre a saúde dos seus olhos. Esses dados são usados exclusivamente para avaliar e realizar seu atendimento com segurança.</p>
        <p>As fichas ficam armazenadas em ambiente protegido e só podem ser acessadas pela profissional, mediante login. Não compartilhamos seus dados com terceiros.</p>
        <p>Você pode, a qualquer momento, solicitar acesso aos seus dados ou a exclusão deles pelo formulário abaixo.</p>
      </div>

      <form onSubmit={submit} className="mt-12 space-y-5 rounded-2xl bg-card p-8">
        <h2 className="text-3xl">Solicitar acesso ou exclusão</h2>
        {status === "done" ? (
          <p className="text-accent">Solicitação registrada. A Karen entrará em contato pelo contato informado.</p>
        ) : (
          <>
            <input className={inputCls} placeholder="Nome completo" maxLength={120} value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
            <input className={inputCls} placeholder="Telefone ou e-mail para retorno" maxLength={160} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
            <div className="flex gap-3">
              {(["acesso", "exclusao"] as const).map((t) => (
                <button type="button" key={t} onClick={() => setF({ ...f, request_type: t })}
                  className={`min-h-11 rounded-full border px-6 text-sm ${f.request_type === t ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {t === "acesso" ? "Acesso aos dados" : "Exclusão dos dados"}
                </button>
              ))}
            </div>
            <textarea className={`${inputCls} min-h-24`} placeholder="Detalhes (opcional)" maxLength={1000} value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} />
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <button className={btnPrimaryCls} disabled={status === "sending"}>{status === "sending" ? "Enviando..." : "Enviar solicitação"}</button>
          </>
        )}
      </form>
    </SimpleShell>
  );
}
