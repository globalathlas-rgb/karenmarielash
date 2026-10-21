import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Instagram, X, ArrowDown } from "lucide-react";
import {
  ABOUT_PHOTO, ADDRESS_CITY, ADDRESS_LINE, HERO_PHOTO, INSTAGRAM_URL, PORTFOLIO, SERVICES,
  mapsLink, serviceMessage, whatsappLink,
} from "@/config/site";

const TITLE = "Karen Marie | Lash Designer em Curitiba";
const DESC =
  "Conheça Karen Marie, Lash Designer em Curitiba. Consulte os procedimentos disponíveis e agende seu horário pelo WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function WhatsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42zm8.03-17.46A11.32 11.32 0 0 0 1.9 17.7L.3 23.5l5.94-1.56a11.3 11.3 0 0 0 5.8 1.48c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.3-8.05z" />
    </svg>
  );
}

const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-xs font-medium tracking-[0.2em] text-primary-foreground uppercase transition-all duration-500 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-lg";
const btnGhost =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-foreground/30 px-7 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:border-accent hover:text-accent";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const NAV = [
  ["Início", "#inicio"], ["Sobre", "#sobre"], ["Serviços", "#servicos"], ["Portfólio", "#portfolio"], ["Contato", "#contato"],
] as const;

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/85 py-3 backdrop-blur-md" : "py-6"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#inicio" className="leading-none">
          <span className="font-display text-2xl italic">Karen Marie</span>
          <span className="eyebrow mt-1 block text-[0.55rem] text-accent">Lash Designer</span>
        </a>
        <nav className="hidden gap-8 text-sm md:flex">
          {NAV.slice(1).map(([l, h]) => (
            <a key={h} href={h} className="transition-colors hover:text-accent">{l}</a>
          ))}
        </nav>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} min-h-10 px-5 text-[0.65rem]`}>
          <WhatsIcon /> <span className="hidden sm:inline">Agendar</span>
        </a>
      </div>
    </header>
  );
}

function PhotoSlot({ src, alt, label, className = "" }: { src: string; alt: string; label: string; className?: string }) {
  if (src) return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  return (
    <div className={`placeholder-pattern flex h-full w-full items-end p-6 ${className}`} aria-label={label}>
      <span className="eyebrow text-[0.6rem] text-muted-foreground">{label}</span>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-32 pb-20 md:min-h-screen md:pt-40">
      <div className="float-slow pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush/40 blur-3xl" />
      <div className="float-slow pointer-events-none absolute bottom-10 left-[8%] h-40 w-40 rounded-full border border-accent/30 [animation-delay:-4s]" />
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <p className="eyebrow rise text-accent [animation-delay:.1s]">Lash Designer · Curitiba</p>
          <h1 className="rise mt-6 text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-tight [animation-delay:.25s]">
            Karen<br /><span className="ml-[12%] italic text-secondary">Marie</span>
          </h1>
          <p className="rise mt-8 font-display text-3xl italic text-primary [animation-delay:.5s]">“Seu olhar, sua essência.”</p>
          <p className="rise mt-4 max-w-md text-muted-foreground [animation-delay:.65s]">
            Realçando sua beleza com delicadeza, cuidado e atenção a cada detalhe.
          </p>
          <div className="rise mt-10 flex flex-wrap gap-4 [animation-delay:.8s]">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={btnPrimary}><WhatsIcon /> Agendar horário</a>
            <a href="#servicos" className={btnGhost}>Conhecer meu trabalho <ArrowDown className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="rise relative md:col-span-5 [animation-delay:.4s]">
          <div className="aspect-[4/5] overflow-hidden rounded-t-full rounded-b-2xl">
            <PhotoSlot src={HERO_PHOTO} alt="Trabalho de Karen Marie" label="Espaço para foto real" />
          </div>
          <span className="eyebrow absolute -bottom-6 -left-4 rounded-full bg-primary px-5 py-3 text-[0.6rem] text-primary-foreground">Lash Design</span>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, light }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="reveal mb-14 max-w-2xl">
      <p className={`eyebrow ${light ? "text-blush" : "text-accent"}`}>{eyebrow}</p>
      <h2 className="mt-4 text-5xl leading-[1.05] md:text-6xl">{title}</h2>
    </div>
  );
}

function About() {
  return (
    <section id="sobre" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-2 md:items-center">
        <div className="reveal aspect-[3/4] overflow-hidden rounded-2xl md:order-1">
          <PhotoSlot src={ABOUT_PHOTO} alt="Karen Marie" label="Espaço para foto da Karen" />
        </div>
        <div className="md:order-2">
          <SectionTitle eyebrow="Sobre" title="Prazer, sou a Karen." />
          <p className="reveal text-lg leading-relaxed text-muted-foreground">
            Estou começando minha jornada no universo do Lash Design com muito carinho, dedicação e vontade de fazer cada
            atendimento ser especial. Acredito que cada olhar tem sua beleza única e quero ajudar você a realçar a sua,
            respeitando seu estilo e sua individualidade.
          </p>
          <p className="reveal mt-8 font-display text-2xl italic text-secondary">— Karen Marie</p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="bg-card py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Serviços" title="Seu próximo olhar começa aqui." />
        {SERVICES.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <article key={s.name} className="reveal group flex flex-col rounded-2xl border border-border bg-background p-8 transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl">
                <h3 className="text-3xl">{s.name}</h3>
                <p className="mt-3 flex-1 text-muted-foreground">{s.description}</p>
                {(s.duration || s.price) && (
                  <div className="mt-6 flex gap-6 text-sm">
                    {s.duration && <span>{s.duration}</span>}
                    {s.price && <span className="text-accent">{s.price}</span>}
                  </div>
                )}
                <a href={whatsappLink(serviceMessage(s.name))} target="_blank" rel="noopener noreferrer" className={`${btnGhost} mt-8`}>
                  Agendar este procedimento
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="reveal flex flex-col items-start gap-6 rounded-2xl border border-dashed border-accent/40 p-10 md:flex-row md:items-center md:justify-between">
            <p className="font-display text-2xl italic">Os procedimentos estão sendo preparados com carinho. Fale comigo para saber mais.</p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} shrink-0`}><WhatsIcon /> Consultar</a>
          </div>
        )}
      </div>
    </section>
  );
}

function Portfolio() {
  const [open, setOpen] = useState<number | null>(null);
  const span = { tall: "row-span-2", wide: "md:col-span-2", square: "" };
  return (
    <section id="portfolio" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Portfólio" title="Detalhes que fazem a diferença." />
        {PORTFOLIO.length ? (
          <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3">
            {PORTFOLIO.map((p, i) => (
              <button key={p.src} onClick={() => setOpen(i)} className={`reveal group overflow-hidden rounded-xl ${span[p.ratio ?? "square"]}`}>
                <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>
            ))}
          </div>
        ) : (
          <div className="reveal relative grid min-h-80 place-items-center overflow-hidden rounded-2xl bg-primary px-6 text-center text-primary-foreground">
            <div className="float-slow absolute -left-10 top-6 h-48 w-48 rounded-full border border-blush/30" />
            <div className="float-slow absolute -right-6 bottom-0 h-64 w-64 rounded-full bg-secondary/60 blur-2xl [animation-delay:-3s]" />
            <p className="relative max-w-lg font-display text-4xl italic leading-tight">Em breve, meus primeiros resultados estarão aqui.</p>
          </div>
        )}
      </div>
      {open !== null && (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-foreground/85 p-4" onClick={() => setOpen(null)}>
          <button aria-label="Fechar" className="absolute top-5 right-5 rounded-full bg-background p-3"><X className="h-5 w-5" /></button>
          <img src={PORTFOLIO[open].src} alt={PORTFOLIO[open].alt} className="max-h-[88vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  );
}

function Values() {
  const items = [
    ["Cuidado em cada detalhe", "Atendimento realizado com atenção e carinho."],
    ["Beleza que respeita você", "Uma proposta que valoriza a individualidade de cada olhar."],
    ["Uma experiência especial", "Um espaço para cuidar de si e se sentir bem."],
  ];
  return (
    <section className="bg-primary py-24 text-primary-foreground md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-3">
        {items.map(([t, d], i) => (
          <div key={t} className="reveal border-t border-primary-foreground/20 pt-8" style={{ transitionDelay: `${i * 120}ms` }}>
            <span className="font-display text-5xl italic text-blush">0{i + 1}</span>
            <h3 className="mt-4 text-3xl">{t}</h3>
            <p className="mt-3 text-primary-foreground/70">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contato" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        <div className="reveal rounded-2xl bg-card p-10 md:p-14">
          <p className="eyebrow text-accent">Instagram</p>
          <h2 className="mt-4 text-5xl">Vamos nos conectar?</h2>
          <p className="mt-4 text-muted-foreground">Acompanhe meus trabalhos, novidades e os próximos capítulos dessa jornada.</p>
          {INSTAGRAM_URL ? (
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`${btnGhost} mt-8`}><Instagram className="h-4 w-4" /> Acompanhar no Instagram</a>
          ) : (
            <span className={`${btnGhost} mt-8 cursor-default opacity-60`}><Instagram className="h-4 w-4" /> Perfil em breve</span>
          )}
        </div>
        <div className="reveal rounded-2xl border border-border p-10 md:p-14">
          <p className="eyebrow text-accent">Localização</p>
          <h2 className="mt-4 text-5xl">Onde me encontrar.</h2>
          <p className="mt-6 flex items-start gap-3 text-lg"><MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" /><span>{ADDRESS_LINE}<br /><span className="text-muted-foreground">{ADDRESS_CITY}</span></span></p>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className={`${btnGhost} mt-8`}>Ver como chegar</a>
        </div>
        <div className="reveal flex flex-col items-start gap-6 rounded-2xl bg-secondary p-10 text-secondary-foreground md:col-span-2 md:flex-row md:items-center md:justify-between md:p-14">
          <h2 className="text-4xl md:text-5xl">Pronta para realçar seu olhar?</h2>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-background px-7 text-xs font-medium tracking-[0.2em] text-primary uppercase transition-all duration-500 hover:-translate-y-0.5 hover:bg-blush">
            <WhatsIcon /> Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-4xl italic">Karen Marie</p>
          <p className="eyebrow mt-2 text-[0.6rem] text-blush">Lash Designer</p>
          <p className="mt-6 font-display text-xl italic text-primary-foreground/70">“Seu olhar, sua essência.”</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-blush">{l}</a>)}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-blush">WhatsApp</a>
          {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blush">Instagram</a>}
        </nav>
      </div>
    </footer>
  );
}

function Index() {
  useReveal();
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Values />
      <Contact />
      <Footer />
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Agendar pelo WhatsApp"
        className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-500 hover:scale-110 hover:bg-secondary">
        <WhatsIcon className="h-6 w-6" />
      </a>
    </main>
  );
}
