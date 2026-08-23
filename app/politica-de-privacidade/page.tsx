import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTACT, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/politica-de-privacidade" },
  title: "Política de Privacidade",
  description: "Saiba como o site da Vecorion trata (ou não) dados dos visitantes.",
};

const UPDATED_AT = "07 de agosto de 2026";

export default function PoliticaDePrivacidadePage() {
  return (
    <section className="section-y">
      <Container className="mx-auto flex max-w-3xl flex-col gap-10">
        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Transparência"
          title="Política de Privacidade"
          description={`Última atualização: ${UPDATED_AT}`}
        />

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink/80">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-ink">1. Resumo em linguagem simples</h2>
            <p>
              Este site é institucional e estático: ele apresenta a {SITE.name} e seus serviços,
              mas <strong>não possui cadastro, login, banco de dados ou formulário que armazene
              informações</strong>. Os botões de contato apenas abrem o WhatsApp ou o aplicativo
              de e-mail do seu dispositivo, com uma mensagem pré-preenchida — nada é enviado para
              ou guardado em nossos servidores a partir deste site.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-ink">2. Quais dados este site coleta</h2>
            <p>
              Diretamente, nenhum. O site não usa cookies de rastreamento, não possui formulário
              com envio para servidor e não integra ferramentas de analytics no momento. Caso
              isso mude no futuro (por exemplo, com a adição de uma ferramenta de estatísticas de
              acesso), esta página será atualizada para refletir a mudança antes de entrar em
              vigor.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-ink">3. Formulário de contato</h2>
            <p>
              O formulário da página de Contato roda inteiramente no seu navegador: os campos que
              você preenche (nome e mensagem) são usados apenas para montar o link do WhatsApp ou
              do e-mail que será aberto. Nenhum dado desse formulário é transmitido para ou
              armazenado pela Vecorion antes de você optar por enviá-lo pelo WhatsApp ou e-mail.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-ink">4. Serviços de terceiros</h2>
            <p>
              Ao clicar em &ldquo;Falar no WhatsApp&rdquo;, você é direcionado ao WhatsApp (Meta)
              ou ao seu aplicativo de e-mail — serviços com políticas de privacidade próprias, que
              não controlamos. Recomendamos consultar as políticas do WhatsApp/Meta para entender
              como essas plataformas tratam suas mensagens. O mesmo vale para as redes sociais
              linkadas neste site (como o Instagram).
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-ink">5. Seus direitos (LGPD)</h2>
            <p>
              Como este site não coleta nem armazena dados pessoais, não há um banco de dados
              nosso para consultar, corrigir ou excluir. Se você tiver qualquer dúvida sobre
              privacidade ou sobre como suas informações são tratadas depois que uma conversa é
              iniciada pelo WhatsApp ou e-mail, pode falar diretamente com a gente pelos canais
              abaixo.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-ink">6. Alterações a esta política</h2>
            <p>
              Esta política pode ser atualizada conforme o site evoluir (por exemplo, se
              recursos como cadastro de clientes ou automações forem adicionados futuramente). A
              data no topo desta página sempre indica a versão mais recente.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-ink">7. Contato</h2>
            <p>
              Dúvidas sobre esta política podem ser enviadas pelo WhatsApp {CONTACT.phoneDisplay}
              {CONTACT.email ? ` ou pelo e-mail ${CONTACT.email}` : ""}.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
