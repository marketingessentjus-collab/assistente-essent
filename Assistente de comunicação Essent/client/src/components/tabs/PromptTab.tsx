/*
 * Essent — Aba Engenharia de Prompt
 * Monta prompts precisos e prontos para uso em qualquer IA generativa
 */
import { useState } from 'react';
import { callClaude, getApiKey } from '@/lib/api';
import { Btn, Card, FormField, Grid2, ResultBox, SectionHeader, Toggle, inputClass } from '../EssentUI';

const SAIDA_OPTS = [
  { v: 'Texto corrido', l: 'Texto' },
  { v: 'Tópicos estruturados', l: 'Tópicos' },
  { v: 'Tabela', l: 'Tabela' },
  { v: 'Roteiro', l: 'Roteiro' },
  { v: 'Código', l: 'Código' },
];
const TOM_OPTS = [
  { v: 'Direto e objetivo', l: 'Direto' },
  { v: 'Formal', l: 'Formal' },
  { v: 'Criativo', l: 'Criativo' },
  { v: 'Técnico', l: 'Técnico' },
  { v: 'Consultivo', l: 'Consultivo' },
];
const DETALHE_OPTS = [
  { v: 'Resumido (essencial)', l: 'Resumido' },
  { v: 'Médio (equilibrado)', l: 'Médio' },
  { v: 'Detalhado (completo)', l: 'Detalhado' },
];

export default function PromptTab() {
  const [tarefa, setTarefa] = useState('');
  const [saida, setSaida] = useState('Texto corrido');
  const [tom, setTom] = useState('Direto e objetivo');
  const [detalhe, setDetalhe] = useState('Médio (equilibrado)');
  const [contexto, setContexto] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGerar = async () => {
    if (!tarefa.trim()) { alert('Descreva a tarefa antes de gerar.'); return; }
    const apiKey = getApiKey();
    if (!apiKey) { setError('Configure sua chave de API nas configurações.'); return; }
    setLoading(true); setError(''); setResult(null);
    const sys = `Você é um especialista em engenharia de prompts para times de comunicação. Você monta prompts precisos, estratégicos e prontos para uso em qualquer IA generativa, com foco em output de alta qualidade.`;
    const usr = `Monte um prompt completo e pronto para uso com base nas informações abaixo:

Tarefa/objetivo: ${tarefa}
Tipo de saída esperada: ${saida}
Tom desejado: ${tom}
Nível de detalhe: ${detalhe}
${contexto ? `Contexto adicional: ${contexto}` : ''}

O prompt deve:
1. Ter uma instrução de sistema clara (quem a IA deve ser)
2. Ter contexto suficiente para que a IA entenda sem dúvidas
3. Especificar o formato exato da saída
4. Incluir restrições (o que NÃO fazer)
5. Ter um exemplo do tipo de output esperado, se ajudar

Entregue o prompt pronto para copiar e usar.`;
    try {
      const text = await callClaude(sys, usr, apiKey);
      setResult(text);
    } catch (e: any) {
      setError(e.message || 'Erro ao gerar prompt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Engenharia de Prompt"
        subtitle="Monte prompts precisos e prontos para uso em qualquer IA generativa."
      />
      <Grid2>
        <Card title="Configuração">
          <div className="space-y-4">
            <FormField label="Tarefa / objetivo">
              <textarea
                value={tarefa}
                onChange={e => setTarefa(e.target.value)}
                rows={4}
                placeholder='Ex: "Criar um post para LinkedIn sobre gestão financeira para pequenas empresas"'
                className={inputClass + ' resize-y'}
              />
            </FormField>

            <FormField label="Tipo de saída esperada">
              <div className="flex flex-wrap gap-1.5">
                {SAIDA_OPTS.map(o => (
                  <Toggle key={o.v} active={saida === o.v} onClick={() => setSaida(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Tom desejado">
              <div className="flex flex-wrap gap-1.5">
                {TOM_OPTS.map(o => (
                  <Toggle key={o.v} active={tom === o.v} onClick={() => setTom(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Nível de detalhe">
              <div className="flex flex-wrap gap-1.5">
                {DETALHE_OPTS.map(o => (
                  <Toggle key={o.v} active={detalhe === o.v} onClick={() => setDetalhe(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Contexto adicional (opcional)">
              <textarea
                value={contexto}
                onChange={e => setContexto(e.target.value)}
                rows={3}
                placeholder='Ex: "A empresa tem 5 anos, atua no setor de saúde, público é gestor de clínicas"'
                className={inputClass + ' resize-y'}
              />
            </FormField>

            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Btn variant="accent" full onClick={handleGerar} disabled={loading}>
              {loading ? '⟳ Gerando...' : '⚙️ Gerar Prompt'}
            </Btn>
          </div>
        </Card>

        <Card title="Prompt gerado">
          <ResultBox content={result} loading={loading} placeholder="O prompt aparecerá aqui..." minHeight="320px" />
        </Card>
      </Grid2>
    </div>
  );
}
