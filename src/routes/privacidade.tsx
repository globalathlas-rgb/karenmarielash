import { createFileRoute } from "@tanstack/react-router";
import { SimpleShell } from "@/components/SiteChrome";
import { ANAMNESE_URL, whatsappLink } from "@/config/site";

const TITLE = "Privacidade e seus dados | Karen Marie Lash Designer";
const DESC = "Como Karen Marie Lash Designer trata seus dados pessoais e como solicitar acesso ou exclusão.";

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

function Privacidade() {
  return (
    <SimpleShell>
      <p className="eyebrow text-accent">LGPD</p>
      <h1 className="mt-4 text-5xl">Privacidade e seus dados</h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>
          A ficha de anamnese é preenchida pelo{" "}
          <a href={ANAMNESE_URL} target="_blank" rel="noopener noreferrer" className="text-accent underline">Google Forms</a>.
          As informações são usadas exclusivamente para avaliar e realizar seu atendimento com segurança, e não são compartilhadas com terceiros.
        </p>
        <p>
          Você pode, a qualquer momento, solicitar acesso aos seus dados ou a exclusão deles pelo{" "}
          <a href={whatsappLink("Olá, Karen! Gostaria de solicitar acesso ou exclusão dos meus dados da ficha de anamnese.")} target="_blank" rel="noopener noreferrer" className="text-accent underline">WhatsApp</a>.
        </p>
      </div>
    </SimpleShell>
  );
}
