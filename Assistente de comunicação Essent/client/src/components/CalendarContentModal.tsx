/**
 * Essent — Modal de Conteúdo do Calendário
 * Exibe detalhes de um item do calendário e gera conteúdo detalhado via IA
 */
import { useState, useEffect } from 'react';
import { BUS } from '@/lib/data';
import { callClaude, getApiKey } from '@/lib/api';
import { Badge, Btn, LoadingSpinner, ResultBox } from './EssentUI';
import { cn } from '@/lib/utils';

interface CalendarContentModalProps {
  open: boolean;
  onClose: () => void;
  day: number;
  hook: string;
  tags: string[];
  angulacao: string;
  selectedBU: string;
}

interface GeneratedContent {
  legenda_seo: string;
  roteiro_reels: string;
  slides_carrossel: string;
  cta: string;
}

const CONTENT_TYPES = ['Legenda SEO', 'Roteiro de Reels', 'Slides de Carrossel', 'CTA'];

export default function CalendarContentModal({
  open,
  onClose,
  day,
  hook,
  tags,
  angulacao,
  selectedBU,
}: CalendarContentModalProps) {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'gerar'>('detalhes');
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bu = selectedBU ? BUS[selectedBU] : null;
  const formato = tags[0]; // Primeiro tag é o formato (Reels, Carrossel, etc)

  const handleGenerate = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('Configure sua chave API primeiro.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const systemPrompt = `Você é um especialista em criação de conteúdo para redes sociais com foco em formatos específicos.
Gere conteúdo detalhado e pronto para publicar baseado nos parâmetros fornecidos.

ESPECIALISTA ATIVADO: CRIADOR DE CONTEÚDO ESTRATÉGICO
Você tem 10 anos de experiência em produção de conteúdo digital para o mercado jurídico-contábil.
Competências:
— Copywriting para diferentes formatos (reels, carrossel, stories, imagens)
— Otimização para SEO em legendas
— Estruturação de roteiros visuais
— Criação de CTAs que convertem
— Linguagem em primeira pessoa do plural ("nós", "com a gente")
— Evitar gerúndio em CTAs

CONTEXTO DA MARCA:
${bu ? `- Marca: Essent ${bu.label}
- Dor central: ${bu.dor}
- Tom: ${bu.tom}
- Mensagem: ${bu.mensagem}` : 'Essent - Assistente de Comunicação'}

PARÂMETROS DO POST:
- Dia: ${day}
- Hook: "${hook}"
- Formato: ${formato}
- Angulação: ${angulacao}
- Tags: ${tags.join(', ')}

Gere o conteúdo em JSON com as seguintes chaves:
{
  "legenda_seo": "Legenda otimizada para SEO (máx 2200 caracteres) com hashtags relevantes",
  "roteiro_reels": "Roteiro visual detalhado para reels (cenas, transições, duração)",
  "slides_carrossel": "Estrutura de 5-7 slides com títulos e descrições",
  "cta": "Call-to-action claro e direto (máx 20 palavras)"
}

Retorne APENAS o JSON válido, sem markdown ou explicações adicionais.`;

      const userPrompt = `Gere o conteúdo detalhado para este post do calendário editorial.`;

      const response = await callClaude(systemPrompt, userPrompt, apiKey);

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta inválida da IA');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      setGenerated(parsed);
      setActiveTab('gerar');
    } catch (err) {
      setError(`Erro ao gerar conteúdo: ${err instanceof Error ? err.message : 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[#002060]/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#dce4f5]">
          <div>
            <p className="text-[10px] font-bold text-[#0099ff] uppercase tracking-wider mb-1">Dia {day}</p>
            <p className="text-lg font-bold text-[#002060]">{hook}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7a99] hover:text-[#002060] text-xl font-bold bg-transparent border-0 cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-[#dce4f5] px-6">
          {['detalhes', 'gerar'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'detalhes' | 'gerar')}
              className={cn(
                'px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors',
                activeTab === tab
                  ? 'border-[#0099ff] text-[#0099ff]'
                  : 'border-transparent text-[#6b7a99] hover:text-[#002060]'
              )}
            >
              {tab === 'detalhes' ? '📋 Detalhes' : '✨ Gerar Conteúdo'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'detalhes' ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-[#6b7a99] uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <Badge key={t} variant="navy">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#6b7a99] uppercase tracking-wider mb-2">Angulação</p>
                <div className="text-sm text-[#002060] leading-relaxed p-3 bg-[#f8faff] rounded-lg border border-[#dce4f5]">
                  {angulacao || 'Sem angulação definida.'}
                </div>
              </div>

              {bu && (
                <div>
                  <p className="text-[10px] font-bold text-[#6b7a99] uppercase tracking-wider mb-2">Contexto da BU</p>
                  <div className="text-sm text-[#002060] leading-relaxed p-3 bg-[#f0f6ff] rounded-lg border border-[#cce3ff]">
                    <p className="font-bold mb-1">Essent {bu.label}</p>
                    <p className="text-xs mb-2">{bu.desc}</p>
                    <p className="text-xs"><strong>Tom:</strong> {bu.tom}</p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Btn
                  variant="primary"
                  full
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? '⏳ Gerando...' : '✨ Gerar Conteúdo Detalhado'}
                </Btn>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-[#fee2e2] border border-[#fca5a5] rounded-lg text-sm text-[#991b1b]">
                  {error}
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner />
                  <p className="text-sm text-[#6b7a99] mt-3">Gerando conteúdo...</p>
                </div>
              )}

              {generated && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#0099ff] uppercase tracking-wider mb-2">📝 Legenda SEO</p>
                    <ResultBox content={generated.legenda_seo} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#0099ff] uppercase tracking-wider mb-2">🎬 Roteiro de Reels</p>
                    <ResultBox content={generated.roteiro_reels} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#0099ff] uppercase tracking-wider mb-2">🎠 Slides de Carrossel</p>
                    <ResultBox content={generated.slides_carrossel} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#0099ff] uppercase tracking-wider mb-2">🎯 CTA</p>
                    <ResultBox content={generated.cta} />
                  </div>
                </div>
              )}

              {!loading && !generated && !error && (
                <div className="text-center py-12 text-[#6b7a99]">
                  <p className="text-sm">Clique em "Gerar Conteúdo Detalhado" para criar o conteúdo.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
