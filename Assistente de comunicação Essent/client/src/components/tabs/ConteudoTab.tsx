/**
 * Essent — Aba Conteúdo
 * Gerador de PROMPT para copywriting em massa
 * Fluxo: Gera prompt → Você copia → Cola na IA → Recebe tabela markdown → Cola de volta no Configurador
 */
import { useState, useEffect } from 'react';
import { BUS } from '@/lib/data';
import {
  Btn, Card, FormField, Grid2, InfoBox, ResultBox, SectionHeader, Toggle
} from '../EssentUI';

interface ConteudoTabProps {
  selectedBU: string;
}

const TIPO_OPTS = ['Reels', 'Carrossel', 'Legenda', 'Stories', 'LinkedIn', 'Email', 'WhatsApp'];
const PERSONA_OPTS = ['Todas', 'Camila', 'Ricardo', 'Lucas', 'Renata', 'Mariana', 'João', 'Ana Paula'];
const FUNIL_OPTS = ['Topo', 'Meio', 'Fundo', 'Todos'];
const OBJ_OPTS = [
  { v: 'Atrair novos seguidores', l: 'Atrair seguidores' },
  { v: 'Educar o mercado', l: 'Educar mercado' },
  { v: 'Gerar autoridade', l: 'Gerar autoridade' },
  { v: 'Engajar base atual', l: 'Engajar base' },
];
const QTD_OPTS = ['3', '5', '10', '20'];

export default function ConteudoTab({ selectedBU }: ConteudoTabProps) {
  const [tipos, setTipos] = useState<string[]>(['Reels']);
  const [personas, setPersonas] = useState<string[]>([]);
  const [funil, setFunil] = useState('Topo');
  const [objs, setObjs] = useState<string[]>(['Atrair novos seguidores']);
  const [qtd, setQtd] = useState('5');
  const [prompt, setPrompt] = useState<string | null>(null);

  const toggleMulti = (arr: string[], val: string, set: (v: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  // Get personas for selected BU
  const buPersonas = selectedBU && BUS[selectedBU] ? BUS[selectedBU].personas.map(p => p.name) : [];

  // Initialize personas when BU changes
  useEffect(() => {
    if (selectedBU && BUS[selectedBU]) {
      setPersonas([BUS[selectedBU].personas[0].name]);
    }
  }, [selectedBU]);

  const objHint = objs.includes('Atrair novos seguidores')
    ? '💡 <strong>Sugestão:</strong> Priorize Reels com hook forte nos primeiros 3s, conteúdos de polarização viral e posts que geram compartilhamento.'
    : objs.includes('Engajar base atual')
    ? '💡 <strong>Sugestão:</strong> Carrosséis salváveis, enquetes nos Stories, conteúdos de aprofundamento e narrativas magnéticas.'
    : null;

  const handleGerarPrompt = () => {
    const bu = selectedBU ? BUS[selectedBU] : { label: 'Essent', dor: 'Dores contábeis', tom: 'Direto e consultivo', personas: [{ name: 'Contadores', desc: 'e gestores' }], mensagem: '' };
    
    const sys = `Você é um copywriter estratégico sênior com 12 anos de experiência em comunicação B2B para o mercado jurídico-contábil brasileiro. Trabalhou com escritórios contábeis de pequeno a grande porte em todo o Brasil, desenvolvendo narrativas que transformam serviços técnicos em percepção de valor estratégico.

COMPETÊNCIAS QUE VOCÊ APLICA NESTE MODO:
— Copywriting de resposta direta adaptado ao mercado contábil
— Construção de narrativa orientada à dor do cliente, não ao serviço
— Domínio de gatilhos mentais éticos (autoridade, antecipação, escassez de atenção, prova social)
— Conhecimento profundo das dores de Camila (analista) e Ricardo (gestor/sócio)
— Capacidade de traduzir técnico em consequência de negócio
— Expertise em formatos digitais: carrossel, post, legenda, story, reels, e-mail

MODO: CRIAÇÃO DE CONTEÚDO
Tipo: ${tipos.join(', ')}
Persona-alvo: ${personas.join(', ')}
Objetivo: ${objs.join(', ')}
Etapa do funil: ${funil}
Tom desejado: ${bu.tom}
Mensagem central: ${bu.mensagem}

LÓGICA DE FUNIL APLICADA:
— Topo: conteúdo que atrai sem vender. CTA leve: salvar, comentar, compartilhar, seguir.
— Meio: conteúdo que qualifica e aprofunda. CTA médio: grupo, material gratuito, inscrição.
— Fundo: conteúdo que converte. CTA direto: reunião, proposta, falar com especialista.

PROCESSO DE RACIOCÍNIO (não exibir):
1. Qual é a dor real por trás do tema?
2. Qual é o risco invisível que essa persona não está vendo?
3. Como o serviço bem feito muda o cenário de negócio?
4. Qual gatilho mental é mais eficaz aqui?
5. Como abrir sem falar da empresa ou do serviço?

REGRAS DE EXECUÇÃO:
— Primeira linha deve prender em 3 segundos — nunca começar pela empresa
— Conectar o tema a impacto real: crescimento, risco, custo ou perda de oportunidade
— Evitar linguagem institucional, juridiquês e frases que servem para qualquer empresa
— Use linguagem em primeira pessoa do plural ("nós", "com a gente")
— Evite gerúndio — prefira construções diretas no presente ou futuro simples
— Para carrossel: estrutura slide a slide com título, corpo e CTA final
— Para post/legenda: máximo 3 blocos, gancho forte, CTA direto
— Para e-mail: assunto em até 8 palavras, abertura sem clichê, fechamento com ação clara
— Para reels: roteiro pronto, sem muito texto, com promessa de valor evidente, até 1min de vídeo

Entregue APENAS uma TABELA MARKDOWN com as colunas: Dia | Origem | Funil | Função | Formato | Hook | Angulação`;

    const usr = `Gere ${qtd} peças de conteúdo para a Essent ${bu.label}.

Tipos: ${tipos.join(', ')}
Personas alvo: ${personas.join(', ')}
Etapa de funil: ${funil}
Objetivo estratégico: ${objs.join(', ')}

Entregue uma TABELA MARKDOWN com as seguintes colunas:
| Dia | Origem | Funil | Função | Formato | Hook | Angulação |
|-----|--------|-------|--------|---------|------|-----------|

Onde:
- **Dia**: número do dia (1-30)
- **Origem**: tema/assunto da peça
- **Funil**: ${funil}
- **Função**: objetivo da peça (atrair, educar, engajar, converter)
- **Formato**: ${tipos.join(' / ')}
- **Hook**: máximo 15 palavras para prender atenção
- **Angulação**: estratégia/ângulo da peça (1 linha)

Preencha ${qtd} linhas com conteúdo único e estratégico para cada dia.`;

    const fullPrompt = `SISTEMA:\n${sys}\n\nUSUÁRIO:\n${usr}`;
    setPrompt(fullPrompt);
  };

  const handleCopyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      alert('✅ Prompt copiado para a área de transferência!');
    }
  };

  return (
    <div>
      <SectionHeader
        title="Gerador de Prompt"
        subtitle="Fluxo: Gera prompt → Copia → Cola na IA → Recebe tabela markdown → Cola no Configurador"
      />
      <Grid2>
        <div className="space-y-4">
          <Card title="1. Configuração">
            <div className="space-y-4">
              <FormField label="Tipo de conteúdo (selecione um ou mais)">
                <div className="flex flex-wrap gap-1.5">
                  {TIPO_OPTS.map(v => (
                    <Toggle key={v} active={tipos.includes(v)} onClick={() => toggleMulti(tipos, v, setTipos)}>{v}</Toggle>
                  ))}
                </div>
              </FormField>

              <FormField label="Persona alvo">
                <div className="flex flex-wrap gap-1.5">
                  {buPersonas.length > 0 ? (
                    buPersonas.map(v => (
                      <Toggle key={v} active={personas.includes(v)} onClick={() => toggleMulti(personas, v, setPersonas)}>{v}</Toggle>
                    ))
                  ) : (
                    <span className="text-xs text-[#6b7a99]">Selecione uma BU primeiro</span>
                  )}
                </div>
              </FormField>

              <FormField label="Etapa de funil">
                <div className="flex flex-wrap gap-1.5">
                  {FUNIL_OPTS.map(v => (
                    <Toggle key={v} active={funil === v} onClick={() => setFunil(v)}>{v}</Toggle>
                  ))}
                </div>
              </FormField>

              <FormField label="Objetivo estratégico">
                <div className="flex flex-wrap gap-1.5">
                  {OBJ_OPTS.map(o => (
                    <Toggle key={o.v} active={objs.includes(o.v)} onClick={() => toggleMulti(objs, o.v, setObjs)}>{o.l}</Toggle>
                  ))}
                </div>
                {objHint && (
                  <div className="mt-2 bg-[#f0f6ff] border border-[#cce3ff] rounded-lg p-3 text-xs text-[#002060] leading-relaxed" dangerouslySetInnerHTML={{ __html: objHint }} />
                )}
              </FormField>

              <FormField label="Quantidade a gerar">
                <div className="flex flex-wrap gap-1.5">
                  {QTD_OPTS.map(v => (
                    <Toggle key={v} active={qtd === v} onClick={() => setQtd(v)}>{v}</Toggle>
                  ))}
                </div>
              </FormField>

              <InfoBox>
                <strong>BU selecionada:</strong>{' '}
                {selectedBU ? `Essent ${BUS[selectedBU].label}` : 'Nenhuma — vá para a aba Nicho primeiro'}
              </InfoBox>

              <Btn variant="accent" full onClick={handleGerarPrompt} disabled={!selectedBU || personas.length === 0}>
                ✍️ Gerar Prompt
              </Btn>
            </div>
          </Card>
        </div>

        <Card title="Prompt para Copiar">
          <div className="space-y-3">
            <ResultBox content={prompt} loading={false} placeholder="O prompt aparecerá aqui..." minHeight="320px" />
            {prompt && (
              <Btn variant="primary" full onClick={handleCopyPrompt}>
                📋 Copiar Prompt
              </Btn>
            )}
            <div className="bg-[#f0f6ff] border border-[#cce3ff] rounded-lg p-3 text-xs text-[#002060] leading-relaxed">
              <strong>Próximo passo:</strong> Cole este prompt em sua IA (Claude, ChatGPT, etc). Ela retornará uma tabela markdown. Copie a tabela e cole na aba <strong>Configurador</strong> para popular o calendário.
            </div>
          </div>
        </Card>
      </Grid2>
    </div>
  );
}
