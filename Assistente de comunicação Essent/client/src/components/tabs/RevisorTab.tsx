/*
 * Essent — Aba Revisor de Conteúdo
 * Revisão crítica de conteúdo com diagnóstico e reescrita sugerida
 */
import { useState } from 'react';
import { callClaude, getApiKey } from '@/lib/api';
import { Btn, Card, FormField, Grid2, ResultBox, SectionHeader, Toggle, inputClass } from '../EssentUI';

const CANAL_OPTS = [
  { v: 'Instagram', l: 'Instagram' },
  { v: 'LinkedIn', l: 'LinkedIn' },
  { v: 'WhatsApp', l: 'WhatsApp' },
  { v: 'E-mail', l: 'E-mail' },
  { v: 'Apresentação', l: 'Apresentação' },
];
const PERSONA_OPTS = [
  { v: 'Camila', l: 'Camila' },
  { v: 'Ricardo', l: 'Ricardo' },
  { v: 'Lucas', l: 'Lucas' },
  { v: 'Renata', l: 'Renata' },
  { v: 'Mariana', l: 'Mariana' },
  { v: 'João', l: 'João' },
  { v: 'Ana Paula', l: 'Ana Paula' },
];
const PROBLEMA_OPTS = [
  { v: 'Hook fraco', l: 'Hook fraco' },
  { v: 'Tom errado', l: 'Tom errado' },
  { v: 'Muito genérico', l: 'Muito genérico' },
  { v: 'CTA ausente', l: 'CTA ausente' },
  { v: 'Muito longo', l: 'Muito longo' },
  { v: 'Não sei', l: 'Não sei' },
];

export default function RevisorTab() {
  const [canal, setCanal] = useState('Instagram');
  const [personas, setPersonas] = useState<string[]>(['Ricardo']);
  const [problema, setProblema] = useState('Não sei');
  const [objetivo, setObjetivo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePersona = (v: string) => {
    setPersonas(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const handleGerar = async () => {
    if (!conteudo.trim()) { alert('Cole o conteúdo para revisar.'); return; }
    const apiKey = getApiKey();
    if (!apiKey) { setError('Configure sua chave de API nas configurações.'); return; }
    setLoading(true); setError(''); setResult(null);
    const sys = `Você é um revisor crítico de conteúdo da Essent Inovação Contábil. Você avalia conteúdo com base no posicionamento estratégico da marca: direto, sem clichê, orientado à dor real do público, com tensão suficiente para provocar movimento.

CRITÉRIOS DE AVALIAÇÃO:
1. Hook/abertura: gera tensão? É específico? Tem máximo 15 palavras?
2. Alinhamento com a persona: fala a língua certa? Resolve a dor real?
3. Tom de voz: condiz com a BU? Evita genéricos?
4. Progressão lógica: dor → tensão → quebra → clareza → solução → ganho
5. CTA: existe? É adequado ao funil?
6. Força da linguagem: evita juridiquês, tecniquês e frases vazias?

FORMATO DO DIAGNÓSTICO:
- Nota geral: X/10
- Pontos fortes (máx 3)
- Problemas identificados (seja direto e específico)
- Reescrita sugerida (entregue versão melhorada)`;
    const usr = `Revise o conteúdo abaixo:

Canal: ${canal}
Persona alvo: ${personas.join(', ')}
Suspeita de problema: ${problema}
Objetivo original: ${objetivo || 'Não informado'}

CONTEÚDO:
${conteudo}`;
    try {
      const text = await callClaude(sys, usr, apiKey);
      setResult(text);
    } catch (e: any) {
      setError(e.message || 'Erro ao revisar conteúdo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Revisor de Conteúdo"
        subtitle="Diagnóstico crítico com base no posicionamento estratégico da Essent."
      />
      <Grid2>
        <Card title="Configuração">
          <div className="space-y-4">
            <FormField label="Canal">
              <div className="flex flex-wrap gap-1.5">
                {CANAL_OPTS.map(o => (
                  <Toggle key={o.v} active={canal === o.v} onClick={() => setCanal(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Persona alvo">
              <div className="flex flex-wrap gap-1.5">
                {PERSONA_OPTS.map(o => (
                  <Toggle key={o.v} active={personas.includes(o.v)} onClick={() => togglePersona(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Suspeita de problema">
              <div className="flex flex-wrap gap-1.5">
                {PROBLEMA_OPTS.map(o => (
                  <Toggle key={o.v} active={problema === o.v} onClick={() => setProblema(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Objetivo original (opcional)">
              <input
                type="text"
                value={objetivo}
                onChange={e => setObjetivo(e.target.value)}
                placeholder='Ex: "Gerar leads para o produto Essent Jus"'
                className={inputClass}
              />
            </FormField>

            <FormField label="Conteúdo para revisar">
              <textarea
                value={conteudo}
                onChange={e => setConteudo(e.target.value)}
                rows={7}
                placeholder="Cole aqui o conteúdo que precisa de revisão..."
                className={inputClass + ' resize-y'}
              />
            </FormField>

            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Btn variant="accent" full onClick={handleGerar} disabled={loading}>
              {loading ? '⟳ Revisando...' : '🔍 Revisar Conteúdo'}
            </Btn>
          </div>
        </Card>

        <Card title="Diagnóstico">
          <ResultBox content={result} loading={loading} placeholder="O diagnóstico aparecerá aqui..." minHeight="360px" />
        </Card>
      </Grid2>
    </div>
  );
}
