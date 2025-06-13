import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

// Exemplo simples de nav items — você pode usar routing dinâmico ou scroll suave
const navItems = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Como funciona", href: "#how" },
  { label: "Entrar", href: "/login" },
  { label: "Criar conta", href: "/register" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">Hotelis</div>
        <div className="flex gap-4 items-center">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              className="text-sm hover:underline"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          {navItems.slice(2).map((item) => (
            <Link
              key={item.href}
              className={buttonStyles({
                variant: item.href === "/register" ? "solid" : "bordered",
                color: "primary",
                radius: "full",
                class: "text-sm",
              })}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 pt-28 pb-20 px-6 text-center">
        <h1 className={title()}>
          Gestão hoteleira&nbsp;
          <span className={title({ color: "violet" })}>moderna e fácil</span>
        </h1>
        <p className={subtitle({ class: "max-w-2xl mt-4" })}>
          O <strong>Hotelis</strong> é o software ideal para hotéis e pousadas
          que buscam mais controle, organização e produtividade na operação
          diária.
        </p>
        <div className="flex gap-4 mt-6">
          <Link
            className={buttonStyles({
              color: "primary",
              variant: "solid",
              radius: "full",
            })}
            href="/register"
          >
            Comece grátis
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "ghost", radius: "full" })}
            href="https://github.com/seu-repo/hotelis"
          >
            <GithubIcon size={18} />
            GitHub
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted" id="features">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Principais funcionalidades
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-xl font-medium mb-2">
                🔗 Integração com Booking.com
              </h3>
              <p>
                Sincronize reservas automaticamente com plataformas como Booking
                e evite overbooking.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">
                📋 Gestão simplificada
              </h3>
              <p>
                Painel intuitivo com informações essenciais, relatórios e
                controle em tempo real.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">
                🗓️ Calendário de reservas
              </h3>
              <p>
                Visualize ocupações por dia e quarto, com suporte a
                drag-and-drop e status das reservas.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">👥 Equipe e escalas</h3>
              <p>
                Controle a escala de funcionários, funções e turnos com
                facilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" id="how">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Como o Hotelis ajuda sua equipe?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Automatize tarefas repetitivas, tenha controle total do fluxo de
            hóspedes, mantenha sua equipe alinhada e foque no atendimento de
            excelência.
          </p>
          <div className="flex justify-center">
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                size: "lg",
              })}
              href="/register"
            >
              Experimente gratuitamente
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Hotelis. Todos os direitos reservados.
      </footer>
    </main>
  );
}
