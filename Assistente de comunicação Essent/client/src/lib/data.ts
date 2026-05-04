// Essent — Dados das Unidades de Negócio
export interface BU {
  label: string;
  icon: string;
  desc: string;
  dor: string;
  personas: Array<{ name: string; desc: string }>;
  tom: string;
  gatilho: string;
  mensagem: string;
}

export const BUS: Record<string, BU> = {
  agro: {
    label: 'Agro',
    icon: '🌾',
    desc: 'Especialização em contabilidade rural. Entra quando a complexidade do campo impacta resultado e previsibilidade.',
    dor: 'Falta de previsibilidade financeira entre safras. Medo de pagar mais imposto do que o necessário. Dificuldade em ler relatórios e conectar operação com número.',
    personas: [
      { name: 'João Menezes', desc: 'Produtor rural, 42 anos, RS — soja e milho' },
      { name: 'Ana Paula Martins', desc: 'Contadora, 34 anos, quer se especializar em agro' }
    ],
    tom: 'Próximo, humano e direto. Nunca técnico ou burocrático. Falar de resultado e campo, não de contabilidade.',
    gatilho: 'Quando a complexidade do campo começa a impactar resultado e previsibilidade. Produz bem, mas não sabe quanto sobra.',
    mensagem: '"Previsibilidade garante o lucro da próxima safra." Nós traduzimos contabilidade para a linguagem do campo.'
  },
  empresarial: {
    label: 'Empresarial',
    icon: '📊',
    desc: 'Atua quando o cliente tem dados mas não consegue transformá-los em decisão estratégica.',
    dor: 'Existe esforço e operação, mas falta leitura estratégica. Sensação de estar decidindo no escuro, sem clareza de onde o negócio está.',
    personas: [
      { name: 'Ricardo Mendes', desc: 'Gestor, 40 anos, quer escalar com qualidade' },
      { name: 'Lucas', desc: 'Crescimento desorganizado, precisa de direção' }
    ],
    tom: 'Estratégico, direto e consultivo. O papel é traduzir número em direção — não executar.',
    gatilho: '"Tenho os dados mas não sei o que fazer com eles." Esforço sem resultado visível. Decisões tomadas no escuro.',
    mensagem: '"Seu problema não é contábil. É decisão." Nós transformamos dado em direção.'
  },
  inovacao: {
    label: 'Inovação',
    icon: '🚀',
    desc: 'Comunicação e posicionamento da Essent como ecossistema de inovação contábil.',
    dor: 'Escritórios que ainda operam no modelo tradicional, sem perceber que o mercado está se reorganizando ao redor deles.',
    personas: [
      { name: 'Contadores', desc: 'Gestores de escritórios que precisam se reinventar' },
      { name: 'Gestores', desc: 'Líderes em transformação digital' }
    ],
    tom: 'Visionário, provocador e claro. Gera tensão suficiente para provocar movimento, mas nunca é abstrato.',
    gatilho: 'Percepção de que o modelo atual não vai sustentar os próximos anos.',
    mensagem: '"Nós não vendemos contabilidade. Desenvolvemos capacidade de gestão."'
  },
  jus: {
    label: 'Jus',
    icon: '⚖️',
    desc: 'Aparece quando o crescimento expõe risco. Segurança jurídica para decisões de alto impacto.',
    dor: 'Dúvida: "Posso estar tomando uma decisão que vai gerar problema depois?" Crescimento expôs margem de erro menor.',
    personas: [
      { name: 'Gestores', desc: 'Em fase de crescimento onde decisões têm maior impacto' },
      { name: 'Sócios', desc: 'Buscando segurança jurídica em decisões críticas' }
    ],
    tom: 'Preciso, seguro e respaldado. Nunca alarmista, mas sempre sério.',
    gatilho: '"Esse risco já estava aqui antes. Agora ele ficou maior." Expansão, novo contrato, mudança societária.',
    mensagem: '"Nós somos o respaldo que você precisa para decidir sem risco desnecessário."'
  },
  societaria: {
    label: 'Societária',
    icon: '🏢',
    desc: 'Entra quando a operação começa a falhar sob pressão. Volume, erros e retrabalho crescendo.',
    dor: 'Retrabalho frequente, medo de erros técnicos, falta de suporte especializado e sobrecarga operacional no setor societário.',
    personas: [
      { name: 'Camila Andrade', desc: 'Analista societária, 28 anos, São Paulo' },
      { name: 'Ricardo Mendes', desc: 'Gestor que quer escalar' }
    ],
    tom: 'Direto, técnico e acolhedor. Reforça controle, previsibilidade e segurança — nunca dependência.',
    gatilho: '"Isso está saindo do controle." Volume aumenta, erros aparecem, retrabalho cresce.',
    mensagem: '"Você não perde tempo no societário. Você perde controle." Nós trazemos estrutura sem tirar seu domínio.'
  },
  miralabs: {
    label: 'Mira Labs',
    icon: '💡',
    desc: 'Para fundadores e empreendedores. Não vende aceleração — vende direção e validação de modelos.',
    dor: 'Falta de direção clara. Solidão decisória. Insegurança sobre modelo de negócio. Crescimento sem saber se está no caminho certo.',
    personas: [
      { name: 'Fundadores', desc: 'Em estágio inicial ou crescimento' },
      { name: 'Empreendedores', desc: 'Negócios digitais ou de inovação' }
    ],
    tom: 'Estratégico, provocador e orientador. Clareza antes de velocidade.',
    gatilho: '"Tenho receita, tenho produto, tenho cliente — mas não sei se estou certo." Crescimento sem validação.',
    mensagem: '"Clareza antes de escalar." Nós validamos caminhos e damos direção antes de acelerar.'
  },
  labs: {
    label: 'Labs',
    icon: '🔬',
    desc: 'Entra quando o negócio cresceu mas perdeu clareza. O modelo não sustenta a próxima fase.',
    dor: 'Operação funciona, mas modelo não sustenta crescimento. Avançou mas não sabe como continuar. Excesso de esforço sem resultado proporcional.',
    personas: [
      { name: 'Lucas', desc: 'Crescimento desorganizado' },
      { name: 'Renata', desc: 'Líder em formação' },
      { name: 'Mariana', desc: 'Início confuso' }
    ],
    tom: 'Estruturado, claro e orientador. Não vende inovação — vende estrutura e reorganização.',
    gatilho: '"Já cresci, mas não sei qual o próximo movimento." Crescimento que expôs fragilidade do modelo.',
    mensagem: '"Seu crescimento não se sustenta do jeito que está." Nós redefinimos a estrutura, não só melhoramos a operação.'
  }
};

export const BU_KEYS = Object.keys(BUS) as Array<keyof typeof BUS>;
