/*
 * Essent — Aba Collab
 * Gera conteúdo de colaboração entre duas Unidades de Negócio
 */
import { useState } from 'react';
import { BUS, BU_KEYS } from '@/lib/data';
import { callClaude, getApiKey } from '@/lib/api';
import { Btn, Card, FormField, Grid2, ResultBox, SectionHeader, Toggle, inputClass } from '../EssentUI';
import { cn } from '@/lib/utils';

export default function CollabTab() {
  const [bu1, setBU1] = useState('');
  const [bu2, setBU2] = useState('');
  const [tema, setTema] = useState('');
  const [tempo, setTempo] = useState('30');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGerar = async () => {
    if (!bu1 || !bu2) { alert('Selecione duas BUs diferentes.'); return; }
    if (bu1 === bu2) { alert('Selecione duas BUs diferentes.'); return; }
    const apiKey = getApiKey();
    if (!apiKey) { setError('Configure sua chave de API nas configurações.'); return; }
    setLoading(true); setError(''); setResult(null);

    const buA = BUS[bu1];
    const buB = BUS[bu2];
    const personasA = buA.personas.map(p => `${p.name} (${p.desc})`).join(' · ');
    const personasB = buB.personas.map(p => `${p.name} (${p.desc})`).join(' · ');
    const tempoLabel = tempo === '30' ? '1 mês' : tempo === '60' ? '2 meses' : tempo === '90' ? '3 meses' : '4 meses';

    const sys = `Você é um copywriter estratégico sênior com 12 anos de experiência em comunicação B2B para o mercado jurídico-contábil brasileiro. Trabalhou com escritórios contábeis de pequeno a grande porte em todo o Brasil, desenvolvendo narrativas que transformam serviços técnicos em percepção de valor estratégico.

COMPETÊNCIAS QUE VOCÊ APLICA NESTE MODO:
— Copywriting de resposta direta adaptado ao mercado contábil
— Construção de narrativa orientada à dor do cliente, não ao serviço
— Domínio de gatilhos mentais éticos (autoridade, antecipação, escassez de atenção, prova social)
— Conhecimento profundo das dores de Camila (analista) e Ricardo (gestor/sócio)
— Capacidade de traduzir técnico em consequência de negócio
— Expertise em formatos digitais: carrossel, post, legenda, story, reels, e-mail
— Especialista em criar sinergia entre soluções complementares

MODO: CRIAÇÃO DE CONTEÚDO DE COLABORAÇÃO
Unidade A: Essent ${buA.label}
Unidade B: Essent ${buB.label}
Período: ${tempoLabel}
Contexto: ${tema.trim() ? tema : 'Gerar automaticamente baseado nas correlações entre as BUs'}

CONTEXTO DAS UNIDADES:

ESSENT ${buA.label}
Dor central: ${buA.dor}
Personas: ${personasA}
Tom de voz: ${buA.tom}
Mensagem central: ${buA.mensagem}

ESSENT ${buB.label}
Dor central: ${buB.dor}
Personas: ${personasB}
Tom de voz: ${buB.tom}
Mensagem central: ${buB.mensagem}

LÓGICA DE FUNIL APLICADA:
— Topo: conteúdo que atrai sem vender. CTA leve: salvar, comentar, compartilhar, seguir.
— Meio: conteúdo que qualifica e aprofunda. CTA médio: grupo, material gratuito, inscrição.
— Fundo: conteúdo que converte. CTA direto: reunião, proposta, falar com especialista.

PROCESSO DE RACIOCÍNIO (não exibir):
1. Qual é a dor real por trás do tema?
2. Qual é o risco invisível que essa persona não está vendo?
3. Como essas duas soluções juntas mudam o cenário de negócio?
4. Qual gatilho mental é mais eficaz aqui?
5. Como abrir sem falar da empresa ou do serviço?

REGRAS DE EXECUÇÃO:
— Primeira linha deve prender em 3 segundos — nunca começar pela empresa
— Conectar o tema a impacto real: crescimento, risco, custo ou perda de oportunidade
— Evitar linguagem institucional, juridiquês e frases que servem para qualquer empresa
— Use linguagem em primeira pessoa do plural ("nós", "com a gente")
— Evite gerúndio — prefira construções diretas no presente ou futuro simples
— Mostre como ${buA.label} e ${buB.label} trabalham juntas no ecossistema Essent
— Explique o valor concreto de ter ambas as soluções
— Use exemplos práticos e reais

Entregue apenas o conteúdo final, pronto para publicar.`;

    const usr = `Crie conteúdo de colaboração entre Essent ${buA.label} e Essent ${buB.label} para os próximos ${tempoLabel}.

${tema.trim() ? `Contexto/Tema: ${tema}` : 'Gere conteúdo automaticamente baseado nas correlações naturais entre essas duas BUs dentro do ecossistema Essent. Identifique pontos de sinergia e crie narrativas que mostrem como uma complementa a outra.'}

Entregue:
— ÂNGULO DE COLLAB (por que essas duas BUs fazem sentido juntas no ecossistema)
— HOOK (máximo 15 palavras)
— DESENVOLVIMENTO (como uma complementa a outra e qual o valor concreto)
— EXEMPLO PRÁTICO (situação real onde ambas são necessárias)
— CTA (call to action adequado)

Pronto para publicar.`;

    try {
      const text = await callClaude(sys, usr, apiKey);
      setResult(text);
    } catch (e: any) {
      setError(e.message || 'Erro ao gerar conteúdo de collab.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Collab entre BUs"
        subtitle="Crie conteúdo de colaboração entre duas Unidades de Negócio, mostrando como elas se complementam no ecossistema Essent."
      />
      <Grid2>
        <Card title="Configuração">
          <div className="space-y-4">
            <FormField label="Selecione a 1ª Unidade de Negócio">
              <div className="flex flex-wrap gap-1.5">
                {BU_KEYS.map(k => {
                  const v = BUS[k];
                  return (
                    <button
                      key={k}
                      onClick={() => setBU1(k)}
                      className={cn(
                        'border-2 rounded-lg py-2 px-3 text-center cursor-pointer transition-all duration-200 text-xs font-bold',
                        bu1 === k
                          ? 'border-[#002060] bg-[#002060] text-white'
                          : 'border-[#dce4f5] bg-[#f8faff] text-[#002060] hover:border-[#0099ff]'
                      )}
                    >
                      {v.icon} {v.label}
                    </button>
                  );
                })}
              </div>
            </FormField>

            <FormField label="Selecione a 2ª Unidade de Negócio">
              <div className="flex flex-wrap gap-1.5">
                {BU_KEYS.map(k => {
                  const v = BUS[k];
                  return (
                    <button
                      key={k}
                      onClick={() => setBU2(k)}
                      className={cn(
                        'border-2 rounded-lg py-2 px-3 text-center cursor-pointer transition-all duration-200 text-xs font-bold',
                        bu2 === k
                          ? 'border-[#0099ff] bg-[#0099ff] text-white'
                          : 'border-[#dce4f5] bg-[#f8faff] text-[#002060] hover:border-[#0099ff]'
                      )}
                    >
                      {v.icon} {v.label}
                    </button>
                  );
                })}
              </div>
            </FormField>

            <FormField label="Período de planejamento">
              <div className="flex flex-wrap gap-1.5">
                {['30', '60', '90', '120'].map(v => (
                  <button
                    key={v}
                    onClick={() => setTempo(v)}
                    className={cn(
                      'border-2 rounded-lg py-2 px-3 text-xs font-bold cursor-pointer transition-all duration-200',
                      tempo === v
                        ? 'border-[#0099ff] bg-[#0099ff] text-white'
                        : 'border-[#dce4f5] bg-[#f8faff] text-[#002060] hover:border-[#0099ff]'
                    )}
                  >
                    {v === '30' ? '1 mês' : v === '60' ? '2 meses' : v === '90' ? '3 meses' : '4 meses'}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Contexto ou tema da colaboração (opcional)">
              <textarea
                value={tema}
                onChange={e => setTema(e.target.value)}
                rows={3}
                placeholder='Ex: "Como a Societária pode ajudar a Jus em questões de estrutura jurídica durante crescimento" ou deixe em branco para gerar automaticamente'
                className={inputClass + ' resize-y'}
              />
            </FormField>

            {bu1 && bu2 && (
              <div className="bg-[#f0f6ff] border border-[#cce3ff] rounded-lg p-3 text-xs text-[#002060]">
                <strong>Collab:</strong> {BUS[bu1].label} × {BUS[bu2].label} • {tempo === '30' ? '1 mês' : tempo === '60' ? '2 meses' : tempo === '90' ? '3 meses' : '4 meses'}
              </div>
            )}

            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Btn variant="accent" full onClick={handleGerar} disabled={loading || !bu1 || !bu2 || bu1 === bu2}>
              {loading ? '⟳ Gerando...' : '🤝 Gerar Conteúdo de Collab'}
            </Btn>
          </div>
        </Card>

        <Card title="Conteúdo de Collab">
          <ResultBox content={result} loading={loading} placeholder="O conteúdo de colaboração aparecerá aqui..." minHeight="320px" />
        </Card>
      </Grid2>
    </div>
  );
}
