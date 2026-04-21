import Image from 'next/image'
import { FaFacebookSquare, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { FooterLegalDialog } from './legal-dialog'
import { SocialTooltip } from './social-tooltip'

export function Footer() {
  return (
    <footer className="rounded-t-[32px] bg-primary py-12 sm:rounded-t-[48px] sm:py-16 lg:rounded-t-[60px] lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:text-left">
          <div className="flex w-full max-w-[280px] justify-center lg:max-w-[400px] lg:justify-start">
            <Image
              src="/assets/logo-caama-white.png"
              alt="Logo"
              width={400}
              height={100}
              quality={100}
              priority
              className="h-auto w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[340px]"
            />
          </div>

          <div className="grid w-full max-w-3xl gap-8 text-white sm:grid-cols-2 sm:gap-10 lg:flex lg:w-auto">
            <div>
              <h1 className="mb-3 font-semibold text-base sm:text-lg">Entre em contato</h1>

              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-center justify-center gap-2 sm:justify-start">
                  <span>•</span>
                  <span>Telefone: (98) 99103-0017</span>
                </li>

                <li className="flex items-center justify-center gap-2 sm:justify-start">
                  <span>•</span>
                  <span className="break-all sm:break-normal">Email: gabinete@caama.org.br</span>
                </li>
              </ul>
            </div>

            <div>
              <h1 className="mb-3 font-semibold text-base sm:text-lg">Privacidade</h1>

              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex justify-center sm:justify-start">
                  <FooterLegalDialog
                    title="Termo de Uso"
                    description="Condições gerais para utilização da plataforma de convênios e benefícios da CAAMA."
                  >
                    <p>
                      Este Termo de Uso estabelece as condições para acesso e utilização da plataforma de convênios da Caixa de
                      Assistência dos Advogados do Maranhão (CAAMA). Ao navegar na plataforma, o usuário declara que leu e
                      concorda com as disposições abaixo.
                    </p>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">1. Finalidade da plataforma</h3>
                      <p>
                        A plataforma tem como objetivo divulgar empresas conveniadas, benefícios, descontos e informações de
                        contato destinados aos advogados e advogadas vinculados à CAAMA, facilitando o acesso aos parceiros e às
                        vantagens oferecidas.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">2. Regras de uso</h3>
                      <p>
                        O usuário compromete-se a utilizar a plataforma de maneira ética, lícita e de acordo com sua finalidade,
                        abstendo-se de praticar atos que possam comprometer a segurança, a disponibilidade ou a integridade das
                        informações disponibilizadas.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">3. Informações sobre convênios</h3>
                      <p>
                        A CAAMA busca manter os dados atualizados, porém descontos, condições comerciais, horários de atendimento
                        e disponibilidade de serviços podem ser alterados pelas empresas conveniadas sem aviso prévio.
                        Recomenda-se confirmar as condições diretamente com o estabelecimento antes da contratação ou utilização
                        do benefício.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">4. Responsabilidades</h3>
                      <p>
                        A CAAMA não se responsabiliza por negociações, atendimentos, produtos ou serviços prestados diretamente
                        pelas empresas parceiras, cabendo a cada conveniada responder por suas próprias ofertas, práticas
                        comerciais e obrigações legais.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">5. Propriedade intelectual</h3>
                      <p>
                        Textos, marcas, logotipos, imagens e demais conteúdos exibidos na plataforma são protegidos pela
                        legislação aplicável e não podem ser reproduzidos, copiados ou utilizados sem autorização prévia, salvo
                        quando permitido por lei.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">6. Alterações</h3>
                      <p>
                        A CAAMA poderá atualizar este Termo de Uso a qualquer momento para refletir mudanças operacionais,
                        institucionais, legais ou tecnológicas. A versão vigente será aquela publicada na própria plataforma.
                      </p>
                    </div>

                    <div className="mb-8 space-y-2">
                      <h3 className="font-semibold text-foreground">7. Contato</h3>
                      <p>
                        Em caso de dúvidas sobre este Termo de Uso, entre em contato pelo telefone (98) 99103-0017 ou pelo e-mail
                        gabinete@caama.org.br.
                      </p>
                    </div>
                  </FooterLegalDialog>
                </li>

                <li className="flex justify-center sm:justify-start">
                  <FooterLegalDialog
                    title="Política de Privacidade"
                    description="Informações sobre coleta, uso e proteção de dados pessoais no ambiente da plataforma."
                  >
                    <p>
                      Esta Política de Privacidade explica como a CAAMA trata dados pessoais eventualmente coletados durante a
                      navegação e uso da plataforma de convênios, observando os princípios da Lei Geral de Proteção de Dados
                      Pessoais (LGPD).
                    </p>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">1. Dados que podem ser tratados</h3>
                      <p>
                        Dependendo da forma de uso da plataforma, podem ser tratados dados como endereço IP, data e hora de
                        acesso, páginas visitadas, informações de navegação, dados informados voluntariamente em formulários e
                        outros dados estritamente necessários para funcionamento, segurança e atendimento.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">2. Finalidades do tratamento</h3>
                      <p>
                        Os dados podem ser utilizados para viabilizar o funcionamento da plataforma, melhorar a experiência do
                        usuário, atender solicitações, cumprir obrigações legais, proteger a segurança do ambiente digital e
                        apoiar a gestão dos convênios disponibilizados.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">3. Compartilhamento</h3>
                      <p>
                        A CAAMA não comercializa dados pessoais. O compartilhamento poderá ocorrer apenas quando necessário para o
                        cumprimento de obrigações legais, atendimento de requisições de autoridades competentes, operação de
                        serviços essenciais da plataforma ou proteção de direitos da instituição e dos usuários.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">4. Armazenamento e segurança</h3>
                      <p>
                        São adotadas medidas técnicas e administrativas razoáveis para proteção dos dados contra acessos não
                        autorizados, destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou
                        ilícito.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">5. Direitos do titular</h3>
                      <p>
                        O titular dos dados poderá solicitar, nos termos da legislação aplicável, confirmação do tratamento,
                        acesso, correção, anonimização, bloqueio, eliminação de dados desnecessários, bem como informações sobre
                        compartilhamento e revisão de consentimento, quando aplicável.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">6. Cookies e tecnologias similares</h3>
                      <p>
                        A plataforma pode utilizar cookies e tecnologias semelhantes para melhorar desempenho, lembrar
                        preferências, gerar estatísticas e oferecer uma navegação mais eficiente. O uso dessas tecnologias pode
                        ser gerenciado pelo navegador do usuário, conforme os recursos disponíveis.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">7. Atualizações desta política</h3>
                      <p>
                        Esta Política de Privacidade poderá ser revisada periodicamente para refletir alterações legais, técnicas
                        ou institucionais. A versão atualizada estará sempre disponível na plataforma.
                      </p>
                    </div>

                    <div className="mb-8 space-y-2">
                      <h3 className="font-semibold text-foreground">8. Canal de contato</h3>
                      <p>
                        Para dúvidas, solicitações ou exercício de direitos relacionados à privacidade e proteção de dados, entre
                        em contato com a CAAMA pelo telefone (98) 99103-0017 ou pelo e-mail gabinete@caama.org.br
                      </p>
                    </div>
                  </FooterLegalDialog>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid w-full max-w-[220px] grid-cols-4 place-content-end gap-3 sm:max-w-none sm:grid-cols-4 lg:w-auto">
            <SocialTooltip label="Instagram" link="https://www.instagram.com/caama.oabma/?utm_medium=copy_link">
              <FaInstagram className="size-5 text-white sm:size-6" />
            </SocialTooltip>

            <SocialTooltip label="WhatsApp" link="https://wa.link/me34le">
              <FaWhatsapp className="size-5 text-white sm:size-6" />
            </SocialTooltip>

            <SocialTooltip label="Facebook" link="https://www.facebook.com/caama.oabma">
              <FaFacebookSquare className="size-5 text-white sm:size-6" />
            </SocialTooltip>

            <SocialTooltip label="Youtube" link="https://www.youtube.com/user/oabma">
              <FaYoutube className="size-5 text-white sm:size-6" />
            </SocialTooltip>
          </div>
        </div>
      </div>
    </footer>
  )
}
