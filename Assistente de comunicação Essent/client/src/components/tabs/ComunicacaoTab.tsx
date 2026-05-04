/*
 * Essent — Aba Comunicação Interna
 * Gera comunicados internos estruturados no tom certo para cada destinatário
 */
import { useState } from 'react';
import { callClaude, getApiKey } from '@/lib/api';
import { Btn, Card, FormField, Grid2, ResultBox, SectionHeader, Toggle, inputClass } from '../EssentUI';

const TIPO_OPTS = [
  { v: 'Aviso geral', l: 'Aviso geral' },
  { v: 'Alinhamento de estratégia', l: 'Alinhamento estratégico' },
  { v: 'Resultado / performance', l: 'Resultado' },
  { v: 'Mudança de processo', l: 'Mudança de processo' },
  { v: 'Novo produto / serviço', l: 'Lançamento' },
  { v: 'Reconhecimento de time', l: 'Reconhecimento' },
];
const PARA_QUEM_OPTS = [
  { v: 'Time de comunicação', l: 'Time de comunicação' },
  { v: 'Time comercial', l: 'Time comercial' },
  { v: 'Gestores de BU', l: 'Gestores de BU' },
  { v: 'Sócios / diretoria', l: 'Sócios / diretoria' },
  { v: 'Toda a empresa', l: 'Toda a empresa' },
  { v: 'Time consultores/analistas', l: 'Time consultores/analistas' },
  { v: 'Contabilidades Associadas', l: 'Contabilidades Associadas' },
  { v: 'Trilha de comunicação', l: 'Trilha de comunicação' },
  { v: 'Escritórios acelerados', l: 'Escritórios acelerados' },
  { v: 'Iceberg', l: 'Iceberg' },
  { v: 'Comunidade Lideranças Femininas', l: 'Comunidade Lideranças Femininas' },
];
const CANAL_OPTS = [
  { v: 'WhatsApp', l: 'WhatsApp' },
  { v: 'E-mail', l: 'E-mail' },
  { v: 'Reunião (roteiro)', l: 'Reunião' },
  { v: 'Apresentação (slide)', l: 'Slide' },
];
const TOM_OPTS = [
  { v: 'Direto e objetivo', l: 'Direto' },
  { v: 'Motivador', l: 'Motivador' },
  { v: 'Formal', l: 'Formal' },
  { v: 'Próximo e humano', l: 'Próximo' },
];

export default function ComunicacaoTab() {
  const [tipo, setTipo] = useState('Aviso geral');
  const [paraQuem, setParaQuem] = useState('Time de comunicação');
  const [canal, setCanal] = useState('WhatsApp');
  const [tom, setTom] = useState('Direto e objetivo');
  const [conteudo, setConteudo] = useState('');
  const [acao, setAcao] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGerar = async () => {
    if (!conteudo.trim()) { alert('Descreva o que precisa comunicar.'); return; }
    const apiKey = getApiKey();
    if (!apiKey) { setError('Configure sua chave de API nas configurações.'); return; }
    setLoading(true); setError(''); setResult(null);
    const sys = `Você é responsável pela comunicação interna da Essent Inovação Contábil. Você gera comunicados claros, no tom certo para cada destinatário, sem burocracia e sem enrolação.

REGRAS:
- Adapte o nível de formalidade ao destinatário
- Seja direto: o que é, por que importa, o que se espera
- Para WhatsApp: mais curto, emojis se adequado ao tom
- Para e-mail: estrutura clara com assunto, corpo e encerramento
- Para reunião: roteiro com tempo estimado
- Nunca use jargão corporativo vazio`;
    const usr = `Gere um comunicado com as seguintes configurações:

Tipo: ${tipo}
Para: ${paraQuem}
Canal: ${canal}
Tom: ${tom}
${acao ? `Ação esperada: ${acao}` : ''}

O que precisa ser comunicado:
${conteudo}`;
    try {
      const text = await callClaude(sys, usr, apiKey);
      setResult(text);
    } catch (e: any) {
      setError(e.message || 'Erro ao gerar comunicado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Central de Comunicação Interna"
        subtitle="Gere comunicados internos estruturados e no tom certo para cada destinatário."
      />
      <Grid2>
        <Card title="Configuração">
          <div className="space-y-4">
            <FormField label="Tipo de comunicado">
              <div className="flex flex-wrap gap-1.5">
                {TIPO_OPTS.map(o => (
                  <Toggle key={o.v} active={tipo === o.v} onClick={() => setTipo(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Para quem?">
              <div className="flex flex-wrap gap-1.5">
                {PARA_QUEM_OPTS.map(o => (
                  <Toggle key={o.v} active={paraQuem === o.v} onClick={() => setParaQuem(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Canal de envio">
              <div className="flex flex-wrap gap-1.5">
                {CANAL_OPTS.map(o => (
                  <Toggle key={o.v} active={canal === o.v} onClick={() => setCanal(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="Tom">
              <div className="flex flex-wrap gap-1.5">
                {TOM_OPTS.map(o => (
                  <Toggle key={o.v} active={tom === o.v} onClick={() => setTom(o.v)}>{o.l}</Toggle>
                ))}
              </div>
            </FormField>

            <FormField label="O que precisa comunicar?">
              <textarea
                value={conteudo}
                onChange={e => setConteudo(e.target.value)}
                rows={5}
                placeholder='Ex: "Lançamento do novo produto Essent Jus em maio. Precisamos alinhar o discurso do time comercial e definir os próximos passos."'
                className={inputClass + ' resize-y'}
              />
            </FormField>

            <FormField label="Próximos passos / ação esperada (opcional)">
              <input
                type="text"
                value={acao}
                onChange={e => setAcao(e.target.value)}
                placeholder='Ex: "Responder até sexta" ou "Participar da reunião na quinta"'
                className={inputClass}
              />
            </FormField>

            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Btn variant="accent" full onClick={handleGerar} disabled={loading}>
              {loading ? '⟳ Gerando...' : '📣 Gerar Comunicado'}
            </Btn>
          </div>
        </Card>

        <Card title="Comunicado gerado">
          <ResultBox content={result} loading={loading} placeholder="O comunicado aparecerá aqui..." minHeight="360px" />
        </Card>
      </Grid2>
    </div>
  );
}
