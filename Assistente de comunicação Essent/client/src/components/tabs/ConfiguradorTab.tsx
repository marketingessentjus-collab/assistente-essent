/*
 * Essent — Aba Configurador de Calendário
 * Gera prompt para calendário editorial e importa resultado em tabela markdown
 */
import { useState, useEffect, useCallback } from 'react';
import { BUS } from '@/lib/data';
import { Badge, Btn, Card, CopyBtn, Divider, FormField, Grid2, SelectField, Toggle } from '../EssentUI';
import { cn } from '@/lib/utils';
import CalendarContentModal from '../CalendarContentModal';

interface CalRow {
  d: number; o: string; e: string; f: string; m: string; h: string; a: string;
}

interface ConfiguradorTabProps {
  selectedBU: string;
  calRows: CalRow[];
  onCalRowsChange: (rows: CalRow[]) => void;
}

const PERIODO_OPTS = [{ v: '90', l: '90 dias' }, { v: '120', l: '4 meses (120 dias)' }];
const ORIGEM_OPTS = ['Mercado', 'Notícia', 'Cases', 'Cultura', 'Produto'];
const FUNIL_OPTS = ['Topo', 'Meio', 'Fundo'];
const FUNCAO_OPTS = ['Educação', 'Entretenimento', 'Informativo', 'Inspiração', 'Demonstração'];
const FORMATO_OPTS = ['Reels', 'Carrossel', 'Imagem', 'Stories'];
const FMT_FILTER = ['Todos', 'Reels', 'Carrossel', 'Imagem', 'Stories'];

const M_NAMES = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const D_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function fmtClass(m: string) {
  const l = m.toLowerCase();
  if (l.includes('reel')) return 'fmt-r';
  if (l.includes('carros')) return 'fmt-c';
  if (l.includes('imag')) return 'fmt-i';
  return 'fmt-s';
}

function parseRows(txt: string): CalRow[] {
  const lines = txt.trim().split('\n').map(l => l.trim()).filter(l => l);
  const R: CalRow[] = [];
  for (const l of lines) {
    if (!l.includes('|')) continue;
    if (/^\|[\s\-:|]+\|$/.test(l)) continue;
    const c = l.split('|').map(s => s.trim()).filter((_, i, a) => i > 0 && i < a.length);
    if (c.length < 5) continue;
    const day = parseInt(c[0]); if (isNaN(day)) continue;
    R.push({ d: day, o: c[1] || '', e: c[2] || '', f: c[3] || '', m: c[4] || '', h: (c[5] || '').replace(/^["']|["']$/g, ''), a: (c[6] || '').replace(/^["']|["']$/g, '') });
  }
  return R;
}

interface ModalData { day: number; hook: string; tags: string[]; ang: string; }

interface ModalState extends ModalData {}

export default function ConfiguradorTab({ selectedBU, calRows, onCalRowsChange }: ConfiguradorTabProps) {
  const [periodo, setPeriodo] = useState('90');
  const [origem, setOrigem] = useState('Mercado');
  const [funil, setFunil] = useState('Topo');
  const [funcao, setFuncao] = useState('Educação');
  const [formato, setFormato] = useState('Reels');
  const [promptBox, setPromptBox] = useState('');
  const [importText, setImportText] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [modal, setModal] = useState<ModalData | null>(null);

  const buildPrompt = useCallback(() => {
    const bu = selectedBU ? BUS[selectedBU] : { label: 'Essent', dor: 'Dores contábeis', tom: 'Direto', personas: [{ name: 'Contadores', desc: 'e gestores' }], mensagem: '' };
    const total = parseInt(periodo) || 90;
    const prio = Math.round(total * 0.4);
    return `Gere um calendário editorial de ${total} dias para Instagram em TABELA MARKDOWN.

CONTEXTO DA MARCA:
- Marca: Essent ${bu.label}
- Dor central do público: ${bu.dor}
- Personas: ${bu.personas.map(p => `${p.name} (${p.desc})`).join(' · ')}
- Tom de voz: ${bu.tom}
- Mensagem central: ${bu.mensagem}

COLUNAS OBRIGATÓRIAS:
| Dia | Origem | Funil | Função | Formato | Hook | Angulação |

DISTRIBUIÇÃO (total exato = ${total} posts):
Origem → ${origem}:${prio} | demais divididos igualmente
Funil → ${funil}:${Math.round(total * 0.45)} | demais divididos igualmente
Função → ${funcao}:${prio} | demais divididos igualmente
Formato → ${formato}:${prio} | demais divididos igualmente

REGRAS OBRIGATÓRIAS:
1. Exatamente ${total} linhas (Dia 1 a ${total}) em tabela markdown
2. Hook = máximo 15 palavras, único, forte, no tom indicado
3. Angulação = 1-2 frases com ângulo e desenvolvimento prático
4. Intercale origens/funis/formatos — NUNCA agrupe iguais em sequência
5. Conteúdo alinhado com o posicionamento da Essent: dor → tensão → quebra → clareza → solução → ganho
6. Sem clichês: nunca use "incrível", "fantástico", "transformador" sem substância

Gere a tabela completa agora, sem truncar.`;
  }, [selectedBU, periodo, origem, funil, funcao, formato]);

  useEffect(() => { setPromptBox(buildPrompt()); }, [buildPrompt]);

  const handleImport = () => {
    if (!importText.trim()) { alert('Cole a tabela antes de importar.'); return; }
    const parsed = parseRows(importText);
    if (!parsed.length) { alert('Formato não reconhecido. Use tabela markdown com |.'); return; }
    onCalRowsChange(parsed);
  };

  const handleClearCal = () => {
    if (confirm('Limpar calendário?')) { onCalRowsChange([]); }
  };

  const handleExportXLS = () => {
    if (!calRows.length) return;
    const XLSX = (window as any).XLSX;
    if (!XLSX) { alert('Biblioteca XLSX não carregada.'); return; }
    const data = calRows.map(r => ({ Dia: r.d, Origem: r.o, Funil: r.e, 'Função': r.f, Formato: r.m, Hook: r.h, 'Angulação': r.a }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 8 }, { wch: 14 }, { wch: 10 }, { wch: 45 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Calendário');
    XLSX.writeFile(wb, 'calendário-essent.xlsx');
  };

  // Build calendar display
  const filteredRows = filter === 'Todos' ? calRows : calRows.filter(r => r.m.toLowerCase().includes(filter.toLowerCase()));

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = start.getDay(); start.setDate(start.getDate() - ((dow + 6) % 7));
  const dateMap = calRows.map((r, i) => { const dt = new Date(start); dt.setDate(dt.getDate() + i); return { ...r, date: dt }; });

  const months: Record<string, { y: number; m: number; items: typeof dateMap }> = {};
  dateMap.forEach(r => {
    const k = `${r.date.getFullYear()}-${r.date.getMonth()}`;
    if (!months[k]) months[k] = { y: r.date.getFullYear(), m: r.date.getMonth(), items: [] };
    months[k].items.push(r);
  });

  const topFmt = calRows.length
    ? Object.entries(calRows.reduce((acc, r) => { acc[r.m] = (acc[r.m] || 0) + 1; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0]
    : '-';

  const fmtColors: Record<string, { bg: string; text: string; bar: string }> = {
    'fmt-r': { bg: 'rgba(0,32,96,.12)', text: '#002060', bar: '#002060' },
    'fmt-c': { bg: 'rgba(0,153,255,.15)', text: '#0099ff', bar: '#0099ff' },
    'fmt-i': { bg: 'rgba(16,185,129,.15)', text: '#059669', bar: '#059669' },
    'fmt-s': { bg: 'rgba(245,158,11,.15)', text: '#d97706', bar: '#d97706' },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#002060] mb-1">Configurador de Calendário</h1>
        <p className="text-sm text-[#6b7a99]">Monte e importe um calendário editorial de 90 ou 120 dias gerado por IA.</p>
      </div>

      <Grid2>
        {/* Left: Parameters */}
        <div className="space-y-4">
          <Card title="Parâmetros">
            <div className="space-y-4">
              <FormField label="Período">
                <div className="flex flex-wrap gap-1.5">
                  {PERIODO_OPTS.map(o => (
                    <Toggle key={o.v} active={periodo === o.v} onClick={() => setPeriodo(o.v)}>{o.l}</Toggle>
                  ))}
                </div>
              </FormField>
              <FormField label="Prioridade de Origem">
                <SelectField value={origem} onChange={setOrigem} options={ORIGEM_OPTS} />
              </FormField>
              <FormField label="Prioridade de Funil">
                <SelectField value={funil} onChange={setFunil} options={FUNIL_OPTS} />
              </FormField>
              <FormField label="Prioridade de Função">
                <SelectField value={funcao} onChange={setFuncao} options={FUNCAO_OPTS} />
              </FormField>
              <FormField label="Formato predominante">
                <SelectField value={formato} onChange={setFormato} options={FORMATO_OPTS} />
              </FormField>
              <Btn variant="primary" full onClick={() => setPromptBox(buildPrompt())}>⚡ Atualizar Prompt</Btn>
            </div>
          </Card>
        </div>

        {/* Right: Prompt + Import */}
        <div className="space-y-4">
          <Card title="Prompt gerado">
            <p className="text-[10px] text-[#6b7a99] mb-2">Copie → cole na IA → cole o resultado abaixo.</p>
            <textarea
              value={promptBox}
              readOnly
              rows={12}
              className="w-full px-3 py-2.5 bg-[#f0f6ff] border border-[#cce3ff] rounded-lg text-[11px] font-mono text-[#002060] resize-none focus:outline-none"
            />
            <div className="mt-2">
              <CopyBtn text={promptBox} />
            </div>
          </Card>

          <Card title="📥 Importar resultado">
            <p className="text-[10px] text-[#6b7a99] mb-2">Cole a tabela markdown gerada pela IA.</p>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              rows={6}
              placeholder="| Dia | Origem | Funil | Função | Formato | Hook | Angulação |"
              className="w-full px-3 py-2.5 bg-[#f8faff] border border-[#dce4f5] rounded-lg text-[11px] font-mono text-[#002060] resize-y focus:outline-none focus:border-[#0099ff]"
            />
            <div className="mt-2">
              <Btn variant="accent" full onClick={handleImport}>⚡ Importar e Abrir Calendário</Btn>
            </div>
          </Card>
        </div>
      </Grid2>

      {/* Calendar Area */}
      {calRows.length > 0 && (
        <div className="mt-6 fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {[
              { v: calRows.length, l: 'Posts total' },
              { v: Array.from(new Set(calRows.map(r => r.o))).length, l: 'Origens' },
              { v: topFmt || '-', l: 'Formato top' },
              { v: calRows.filter(r => r.e === 'Topo').length, l: 'Posts de topo' },
            ].map(s => (
              <div key={s.l} className="bg-[#f0f6ff] border border-[#cce3ff] rounded-lg p-3 text-center">
                <span className="block text-xl font-black text-[#002060]">{s.v}</span>
                <span className="text-[10px] text-[#6b7a99] uppercase tracking-wider">{s.l}</span>
              </div>
            ))}
          </div>

          {/* Filters + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex flex-wrap gap-1.5">
              {FMT_FILTER.map(f => (
                <Toggle key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Toggle>
              ))}
            </div>
            <div className="flex gap-2">
              <Btn variant="secondary" onClick={handleExportXLS}>📊 XLS</Btn>
              <Btn variant="danger" onClick={handleClearCal}>🗑️ Limpar</Btn>
            </div>
          </div>

          {/* Calendar months */}
          {Object.entries(months).map(([key, mo]) => (
            <div key={key} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-[#002060]">{M_NAMES[mo.m + 1]} {mo.y}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f0f6ff] text-[#0099ff] font-bold border border-[#cce3ff]">{mo.items.length} posts</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {D_NAMES.map(d => (
                  <div key={d} className="text-center text-[9px] font-bold text-[#6b7a99] uppercase py-1.5">{d}</div>
                ))}
                {/* Empty cells */}
                {Array.from({ length: (mo.items[0].date.getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`e${i}`} style={{ aspectRatio: '1' }} />
                ))}
                {/* Day cells */}
                {mo.items.map((r) => {
                  const fc = fmtClass(r.m);
                  const colors = fmtColors[fc];
                  const dim = filter !== 'Todos' && !r.m.toLowerCase().includes(filter.toLowerCase());
                  return (
                    <div
                      key={r.d}
                      onClick={() => !dim && setModal({ day: r.d, hook: r.h, tags: [r.m, r.o, r.e, r.f], ang: r.a })}
                      className={cn(
                        'relative rounded-lg border border-[#dce4f5] bg-[#f8faff] p-1.5 cursor-pointer transition-all duration-150 overflow-hidden flex flex-col',
                        !dim && 'hover:border-[#0099ff] hover:scale-105 hover:shadow-md hover:z-10',
                        dim && 'opacity-15 pointer-events-none'
                      )}
                      style={{ aspectRatio: '1' }}
                    >
                      <span className="text-[10px] font-bold text-[#6b7a99] leading-none">{r.d}</span>
                      <span className="absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded leading-none" style={{ background: colors.bg, color: colors.text }}>{r.m.slice(0, 3)}</span>
                      <span className="text-[9px] text-[#002060] leading-tight mt-1 overflow-hidden flex-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{r.h}</span>
                      <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: colors.bar }} />
                    </div>
                  );
                })}
                {/* Trailing empty cells */}
                {Array.from({ length: (7 - ((mo.items.length + (mo.items[0].date.getDay() + 6) % 7) % 7)) % 7 }).map((_, i) => (
                  <div key={`t${i}`} style={{ aspectRatio: '1' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Conteúdo */}
      <CalendarContentModal
        open={!!modal}
        onClose={() => setModal(null)}
        day={modal?.day || 0}
        hook={modal?.hook || ''}
        tags={modal?.tags || []}
        angulacao={modal?.ang || ''}
        selectedBU={selectedBU}
      />
    </div>
  );
}
