import { describe, expect, it } from "vitest";
import { missingAnswers, needsReview } from "@/lib/anamnese";

describe("anamnese", () => {
  it("destaca tratamento oftalmológico para avaliação", () => {
    expect(needsReview({ tratamento: { value: "sim" } })).toBe(true);
  });
  it("destaca vermelhidão na última semana", () => {
    expect(needsReview({ irritacao_semana: { value: "sim" } })).toBe(true);
  });
  it("lentes de contato sozinhas não geram destaque", () => {
    expect(needsReview({ lentes: { value: "sim" } })).toBe(false);
  });
  it("pergunta 2 só é exigida se já fez extensão", () => {
    expect(missingAnswers({ ja_fez: { value: "nao" } })).not.toContain("irritacao_anterior");
    expect(missingAnswers({ ja_fez: { value: "sim" } })).toContain("irritacao_anterior");
  });
});
