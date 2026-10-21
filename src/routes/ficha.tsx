import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QUESTIONS, anamneseSchema, isVisible, missingAnswers, needsReview, REVIEW_FLAGS, type Answers, type QuestionId } from "@/lib/anamnese";
import { SimpleShell, btnPrimaryCls, inputCls } from "@/components/SiteChrome";

const TITLE = "Ficha de Anamnese | Karen Marie Lash Designer";
const DESC = "Preencha sua ficha de anamnese antes do atendimento de extensão de cílios com Karen Marie, em Curitiba.";

export const Route = createFileRoute("/ficha")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FichaPage,
});

type Errors = Record<string, string>;

function FichaPage() {
  const [form, setForm] = useState({ full_name: "", age: "", procedure: "", notes: "" });
  const [answers, setAnswers] = useState<Answers>({});
  const [ack, setAck] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const setAnswer = (id: QuestionId, value: "sim" | "nao") =>
    setAnswers((a) => ({ ...a, [id]: { value, detail: value === "sim" ? a[id]?.detail : undefined } }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = anamneseSchema.safeParse({ ...form, notes: form.notes || undefined, guidelines_ack: ack, privacy_consent: consent });
    const errs: Errors = {};
    if (!parsed.success) parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
    missingAnswers(answers).forEach((id) => (errs[id] = "Selecione Sim ou Não"));
    setErrors(errs);
    if (!parsed.success || Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0]!)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const visible = Object.fromEntries(Object.entries(answers).filter(([id]) => isVisible(id as QuestionId, answers)));
    setStatus("sending");
    const { error } = await supabase.from("anamnese_submissions").insert({
      full_name: parsed.data.full_name, age: parsed.data.age, procedure: parsed.data.procedure,
      notes: parsed.data.notes ?? null, answers: visible, needs_review: needsReview(answers),
      guidelines_ack: true, privacy_consent: true,
    });
    if (error) { setStatus("error"); return; }
    setStatus("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (status === "done")
    return (
      <SimpleShell>
        <div className="rise rounded-2xl bg-card p-10 text-center md:p-14">
          <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
          <h1 className="mt-6 text-5xl">Ficha enviada!</h1>
          <p className="mt-4 text-muted-foreground">Sua ficha foi salva com segurança. A Karen vai analisá-la antes do seu atendimento.</p>
          <p className="mt-6 font-display text-2xl italic text-secondary">Obrigada pela compreensão!</p>
          <Link to="/" className={`${btnPrimaryCls} mt-8`}>Voltar ao site</Link>
        </div>
      </SimpleShell>
    );

  const err = (k: string) => errors[k] && <p className="mt-2 text-sm text-destructive" role="alert">{errors[k]}</p>;

  return (
    <SimpleShell>
      <p className="eyebrow text-accent">Antes do atendimento</p>
      <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">Ficha de Anamnese</h1>
      <p className="mt-4 text-muted-foreground">Leva cerca de 2 minutos. Suas respostas ajudam a garantir um atendimento seguro e confortável.</p>

      <form onSubmit={submit} noValidate className="mt-12 space-y-12">
        <fieldset className="space-y-5">
          <legend className="font-display text-3xl">Informações pessoais</legend>
          <label className="block" id="full_name">
            <span className="mb-2 block text-sm font-medium">Nome completo *</span>
            <input className={inputCls} autoComplete="name" value={form.full_name} maxLength={120} onChange={(e) => setForm({ ...form, full_name: e.target.value })} aria-invalid={!!errors.full_name} />
            {err("full_name")}
          </label>
          <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
            <label className="block" id="age">
              <span className="mb-2 block text-sm font-medium">Idade *</span>
              <input className={inputCls} inputMode="numeric" value={form.age} maxLength={3} onChange={(e) => setForm({ ...form, age: e.target.value.replace(/\D/g, "") })} aria-invalid={!!errors.age} />
              {err("age")}
            </label>
            <label className="block" id="procedure">
              <span className="mb-2 block text-sm font-medium">Técnica aplicada ou procedimento desejado *</span>
              <input className={inputCls} value={form.procedure} maxLength={200} onChange={(e) => setForm({ ...form, procedure: e.target.value })} aria-invalid={!!errors.procedure} />
              {err("procedure")}
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-3xl">Avaliação</legend>
          {QUESTIONS.filter((q) => isVisible(q.id, answers)).map((q, i) => {
            const a = answers[q.id];
            const flagged = a?.value === "sim" && REVIEW_FLAGS.includes(q.id);
            return (
              <div key={q.id} id={q.id} className={`rounded-2xl border p-5 transition-colors ${flagged ? "border-secondary/60 bg-secondary/5" : "border-border"}`}>
                <p className="font-medium"><span className="mr-2 font-display text-xl italic text-accent">{i + 1}.</span>{q.label}</p>
                <div className="mt-4 flex gap-3" role="radiogroup" aria-label={q.label}>
                  {(["sim", "nao"] as const).map((v) => (
                    <button type="button" key={v} role="radio" aria-checked={a?.value === v} onClick={() => setAnswer(q.id, v)}
                      className={`min-h-11 min-w-24 rounded-full border px-6 text-sm transition-all duration-300 ${a?.value === v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-accent"}`}>
                      {v === "sim" ? "Sim" : "Não"}
                    </button>
                  ))}
                </div>
                {err(q.id)}
                {a?.value === "sim" && q.explain && (
                  <input className={`${inputCls} mt-4`} placeholder={q.explain} maxLength={300} value={a.detail ?? ""}
                    onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: { value: "sim", detail: e.target.value } }))} />
                )}
                {q.id === "lentes" && a?.value === "sim" && (
                  <p className="mt-4 flex gap-2 rounded-xl bg-blush/30 p-3 text-sm"><Info className="h-4 w-4 shrink-0 translate-y-0.5" /> Lembre-se de retirar as lentes de contato antes do procedimento.</p>
                )}
                {flagged && (
                  <p className="mt-4 flex gap-2 text-sm text-secondary"><AlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5" /> Esta resposta será avaliada pela Karen antes do atendimento.</p>
                )}
              </div>
            );
          })}
          <label className="block pt-2">
            <span className="mb-2 block text-sm font-medium">Observações adicionais (opcional)</span>
            <textarea className={`${inputCls} min-h-28`} maxLength={2000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
        </fieldset>

        <section className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-10">
          <h2 className="text-4xl">Orientações para o atendimento</h2>
          <ul className="mt-6 space-y-3 text-primary-foreground/85">
            <li>• Tolerância máxima de 10 minutos de atraso.</li>
            <li>• Retirar as lentes de contato antes do procedimento.</li>
            <li>• Caso tenha tido algum problema oftalmológico nos últimos 7 dias, avise antes do atendimento, pois o procedimento poderá precisar ser adiado.</li>
          </ul>
          <p className="mt-6 font-display text-2xl italic text-blush">Obrigada pela compreensão!</p>
        </section>

        <div className="space-y-5">
          <label id="guidelines_ack" className="flex cursor-pointer gap-3">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--color-primary)]" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            <span>Li e estou ciente das orientações para o atendimento. *</span>
          </label>
          {err("guidelines_ack")}

          <div className="rounded-2xl border border-border p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Aviso de privacidade</p>
            <p className="mt-2">Seus dados pessoais e de saúde são usados apenas para avaliar e realizar seu atendimento, ficam armazenados com segurança e só a Karen tem acesso. Você pode solicitar acesso ou exclusão a qualquer momento. <Link to="/privacidade" className="text-accent underline">Saiba mais</Link>.</p>
          </div>
          <label id="privacy_consent" className="flex cursor-pointer gap-3">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--color-primary)]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>Autorizo o tratamento dos meus dados pessoais e de saúde informados nesta ficha, exclusivamente para meu atendimento, conforme a LGPD. *</span>
          </label>
          {err("privacy_consent")}
        </div>

        {status === "error" && <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive" role="alert">Não foi possível enviar sua ficha agora. Verifique sua conexão e tente novamente.</p>}
        {Object.keys(errors).length > 0 && <p className="text-sm text-destructive">Revise os campos destacados acima.</p>}
        <button type="submit" disabled={status === "sending"} className={`${btnPrimaryCls} w-full sm:w-auto`}>
          {status === "sending" ? "Enviando..." : "Enviar ficha"}
        </button>
      </form>
    </SimpleShell>
  );
}
