/*
 * Essent — Aba Resumo
 * Gerador de resumos estruturados para diferentes públicos internos
 */
import { useState } from 'react';
import { callClaude, getApiKey } from '@/lib/api';
import { Btn, Card, FormField, Grid2, ResultBox, SectionHeader, Toggle, inputClass } from '../EssentUI';

const PARA_QUEM_OPTS = [
  { v: 'Para mim (uso pessoal)', l: 'Para mim' },
  { v: 'Para uma Unidade de Negócio', l: 'Para BU' },
  { v: 'Para sócios', l: 'Para sócios' },
  { v: 'Para gestores', l: 'Para gestores' },
  { v: 'Para o time', l: 'Para o time' },
];
const TIPO_OPTS = [
  { v: 'Resumir reunião em tópicos', l: 'Resumir reunião' },
  { v: 'Organizar ideias', l: 'Organizar ideias' },
  { v: 'Entender o problema', l: 'Entender problema' },
  { v: 'Comunicar para o time', l: 'Comunicar time' },
  { v: 'Comunicar internamente', l: 'Comunicar internamente' },
];

export default function ResumoTab() {
  const [paraQuem, setParaQuem] = useState('Para mim (uso pessoal)');
  const [tipo, setTipo] = useState('Resumir reunião em tópicos');
  const [conteudo, setConteudo] = useState('');
  const [instrucao, setInstrucao] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGerar = async () => {
    if (!conteudo.trim()) { alert('Cole o conteúdo que precisa ser resumido.'); return; }
    const apiKey = getApiKey();
    if (!apiKey) { setError('Configure sua chave de API nas configurações.'); return; }
    setLoading(true); setError(''); setResult(null);
    const sys = `Você é um assistente estratégico da Essent Inovação Contábil, especializado em comunicação interna clara e objetiva. Você gera resumos estruturados que reduzem incerteza e facilitam decisão.

REGRAS:
- Tom: direto, sem enrolação
- Estruture com tópicos claros quando for para gestores/sócios
- Destaque: o que foi decidido, o que está em aberto, próximos passos
- Nunca use linguagem burocrática ou frases genéricas`;
    const usr = `Crie um resumo do tipo: "${tipo}"
Para: ${paraQuem}
${instrucao ? `Instrução adicional: ${instrucao}` : ''}

Conteúdo bruto:
${conteudo}`;
    try {
      const text = await callClaude(sys, usr, apiKey);
      setResult(text);
    } catch (e: any) {
      setError(e.message || 'Erro ao gerar resumo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Gerador de Resumo"
        subtitle="Transforme informações brutas em resumos estruturados para diferentes públicos internos."
      />
      <Grid2>
        <Card title="Configuração">
          <div className="space-y-4">
            <FormField label="Para quem é o resumo?">
              <div className="flex flex-wrap gap-1.5">
                {PARA_QUEM_OPTS.map(o => (
                  <Toggle key={o.v} active={paraQuem === o.v} onClick={() => setParaQuem(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Tipo de resumo">
              <div className="flex flex-wrap gap-1.5">
                {TIPO_OPTS.map(o => (
                  <Toggle key={o.v} active={tipo === o.v} onClick={() => setTipo(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Conteúdo bruto">
              <textarea
                value={conteudo}
                onChange={e => setConteudo(e.target.value)}
                rows={8}
                placeholder="Cole aqui o conteúdo que precisa ser resumido (transcrição de reunião, anotações, e-mail, etc.)..."
                className={inputClass + ' resize-y'}
              />
            </FormField>

            <FormField label="Instrução adicional (opcional)">
              <input
                type="text"
                value={instrucao}
                onChange={e => setInstrucao(e.target.value)}
                placeholder='Ex: "Destaque apenas os próximos passos" ou "Foco nos riscos identificados"'
                className={inputClass}
              />
            </FormField>

            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Btn variant="accent" full onClick={handleGerar} disabled={loading}>
              {loading ? '⟳ Gerando...' : '📋 Gerar Resumo'}
            </Btn>
          </div>
        </Card>

        <Card title="Resumo gerado">
          <ResultBox content={result} loading={loading} placeholder="O resumo aparecerá aqui..." minHeight="320px" />
        </Card>
      </Grid2>
    </div>
  );
}
