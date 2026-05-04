/*
 * Essent — Aba Massa por Tema
 * Gera múltiplas variações de conteúdo a partir de um tema central
 */
import { useState, useEffect } from 'react';
import { BUS } from '@/lib/data';
import { callClaude, getApiKey } from '@/lib/api';
import { Btn, Card, FormField, Grid2, ResultBox, SectionHeader, SelectField, Toggle, inputClass } from '../EssentUI';

const ABORDAGEM_OPTS = [
  { v: 'Educativa', l: 'Educativa' },
  { v: 'Provocadora', l: 'Provocadora' },
  { v: 'Consultiva', l: 'Consultiva' },
  { v: 'Inspiradora', l: 'Inspiradora' },
  { v: 'Técnica', l: 'Técnica' },
];

export default function MassaTemaTab() {
  const [tema, setTema] = useState('');
  const [selectedBU, setSelectedBU] = useState('');
  const [variacoes, setVariacoes] = useState('3');
  const [abordagem, setAbordagem] = useState('Educativa');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGerar = async () => {
    if (!tema.trim()) { alert('Descreva o tema central.'); return; }
    if (!selectedBU) { alert('Selecione uma BU.'); return; }
    const apiKey = getApiKey();
    if (!apiKey) { setError('Configure sua chave de API nas configurações.'); return; }
    setLoading(true); setError(''); setResult(null);
    const bu = BUS[selectedBU];
    const personasText = bu.personas.map(p => `${p.name} (${p.desc})`).join(' · ');
    const sys = `Você é um copywriter estratégico sênior com 12 anos de experiência em comunicação B2B para o mercado jurídico-contábil brasileiro.

COMPETÊNCIAS:
— Copywriting de resposta direta adaptado ao mercado contábil
— Construção de narrativa orientada à dor do cliente
— Domínio de gatilhos mentais éticos
— Conhecimento profundo das personas
— Capacidade de traduzir técnico em consequência de negócio
— Expertise em formatos digitais

UNIDADE SELECIONADA: Essent ${bu.label}
Dor central: ${bu.dor}
Personas: ${personasText}
Tom: ${bu.tom}
Mensagem central: ${bu.mensagem}

REGRAS DE EXECUÇÃO:
— Primeira linha deve prender em 3 segundos — nunca começar pela empresa
— Conectar o tema a impacto real: crescimento, risco, custo ou perda de oportunidade
— Evitar linguagem institucional, juridiquês e frases que servem para qualquer empresa
— Use linguagem em primeira pessoa do plural ("nós", "com a gente")
— Evite gerúndio — prefira construções diretas no presente ou futuro simples
— Cada variação deve ter ângulo único e diferente`;

    const usr = `Gere ${variacoes} variações de conteúdo sobre o seguinte tema:

Tema central: ${tema}
Abordagem: ${abordagem}

Para cada variação, entregue:
— ÂNGULO (qual é o diferencial dessa variação)
— HOOK (máximo 15 palavras)
— DESENVOLVIMENTO (corpo do conteúdo)
— CTA (call to action)

Separe cada variação com "——————" e numere.`;

    try {
      const text = await callClaude(sys, usr, apiKey);
      setResult(text);
    } catch (e: any) {
      setError(e.message || 'Erro ao gerar variações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Massa por Tema"
        subtitle="Gere múltiplas variações de conteúdo a partir de um tema central com diferentes abordagens."
      />
      <Grid2>
        <Card title="Configuração">
          <div className="space-y-4">
            <FormField label="Tema central">
              <textarea
                value={tema}
                onChange={e => setTema(e.target.value)}
                rows={4}
                placeholder='Ex: "Gestão de fluxo de caixa em períodos de crise" ou "Transformação digital para escritórios contábeis"'
                className={inputClass + ' resize-y'}
              />
            </FormField>

            <FormField label="Unidade de Negócio">
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(BUS).map(([k, v]) => (
                  <Toggle
                    key={k}
                    active={selectedBU === k}
                    onClick={() => setSelectedBU(k)}
                  >
                    {v.icon} {v.label}
                  </Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Quantas variações?">
              <SelectField
                value={variacoes}
                onChange={setVariacoes}
                options={['2', '3', '5', '7', '10']}
              />
            </FormField>

            <FormField label="Abordagem">
              <div className="flex flex-wrap gap-1.5">
                {ABORDAGEM_OPTS.map(o => (
                  <Toggle
                    key={o.v}
                    active={abordagem === o.v}
                    onClick={() => setAbordagem(o.v)}
                  >
                    {o.l}
                  </Toggle>
                ))}
              </div>
            </FormField>

            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Btn variant="accent" full onClick={handleGerar} disabled={loading || !tema.trim() || !selectedBU}>
              {loading ? '⟳ Gerando...' : '🎯 Gerar Variações'}
            </Btn>
          </div>
        </Card>

        <Card title="Variações geradas">
          <ResultBox content={result} loading={loading} placeholder="As variações aparecerão aqui..." minHeight="320px" />
        </Card>
      </Grid2>
    </div>
  );
}
