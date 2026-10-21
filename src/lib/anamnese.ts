import { z } from "zod";

export type QuestionId = "ja_fez" | "irritacao_anterior" | "lacrimeja" | "irritacao_semana" | "lentes" | "sensiveis" | "tratamento";

export const QUESTIONS: { id: QuestionId; label: string; explain?: string; dependsOn?: QuestionId }[] = [
  { id: "ja_fez", label: "Já fez aplicação de extensão de cílios anteriormente?" },
  { id: "irritacao_anterior", label: "Se sim, teve alguma irritação?", explain: "Conte o que aconteceu", dependsOn: "ja_fez" },
  { id: "lacrimeja", label: "Lacrimeja com frequência?" },
  { id: "irritacao_semana", label: "Teve irritação ou vermelhidão nos olhos na última semana?", explain: "Descreva brevemente" },
  { id: "lentes", label: "Usa lentes de contato?" },
  { id: "sensiveis", label: "Tem olhos sensíveis?", explain: "Explique, se quiser" },
  { id: "tratamento", label: "Está fazendo tratamento oftalmológico, utilizando colírios ou outros medicamentos relacionados à saúde dos olhos?", explain: "Qual tratamento ou medicamento?" },
];

/** Respostas que a profissional deve avaliar antes do atendimento (nunca decide sozinho). */
export const REVIEW_FLAGS: QuestionId[] = ["irritacao_anterior", "irritacao_semana", "tratamento"];

export type Answer = { value: "sim" | "nao"; detail?: string };
export type Answers = Partial<Record<QuestionId, Answer>>;

export function isVisible(id: QuestionId, answers: Answers) {
  const q = QUESTIONS.find((x) => x.id === id)!;
  return !q.dependsOn || answers[q.dependsOn]?.value === "sim";
}

export function needsReview(answers: Answers) {
  return REVIEW_FLAGS.some((id) => isVisible(id, answers) && answers[id]?.value === "sim");
}

export const anamneseSchema = z
  .object({
    full_name: z.string().trim().min(2, "Informe seu nome completo").max(120),
    age: z.coerce.number({ invalid_type_error: "Informe sua idade" }).int("Idade inválida").min(12, "Idade inválida").max(110, "Idade inválida"),
    procedure: z.string().trim().min(2, "Informe a técnica ou procedimento").max(200),
    notes: z.string().trim().max(2000).optional(),
    guidelines_ack: z.literal(true, { errorMap: () => ({ message: "Confirme que leu as orientações" }) }),
    privacy_consent: z.literal(true, { errorMap: () => ({ message: "O consentimento é necessário para enviar a ficha" }) }),
  });

export function missingAnswers(answers: Answers): QuestionId[] {
  return QUESTIONS.filter((q) => isVisible(q.id, answers) && !answers[q.id]).map((q) => q.id);
}
