/*
 * Essent — Aba Nicho
 * Seleciona a Unidade de Negócio e exibe contexto estratégico
 */
import { BUS, BU_KEYS } from '@/lib/data';
import { Badge, Btn, Card, Divider, FormLabel, Grid2, Grid3, InfoBox, SectionHeader } from '../EssentUI';
import { cn } from '@/lib/utils';

interface NichoTabProps {
  selectedBU: string;
  onSelectBU: (key: string) => void;
  onGoTo: (tab: string) => void;
}

function getBUColor(key: string): string {
  const colors: Record<string, string> = {
    agro: '#19c088',
    empresarial: '#002060',
    inovacao: '#ff0099',
    jus: '#ff0066',
    societaria: '#f5a89d',
    miralabs: '#888888',
    labs: '#ff7300',
  };
  return colors[key] || '#002060';
}

export default function NichoTab({ selectedBU, onSelectBU, onGoTo }: NichoTabProps) {
  const bu = selectedBU ? BUS[selectedBU] : null;

  return (
    <div>
      <SectionHeader
        title="Selecione a Unidade de Negócio"
        subtitle="Escolha a BU para carregar automaticamente o contexto estratégico, personas e tom de voz."
      />

      {/* BU Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
        {BU_KEYS.map(key => {
          const v = BUS[key];
          const selected = selectedBU === key;
          return (
            <button
              key={key}
              onClick={() => onSelectBU(key)}
              className={cn(
                'border-2 rounded-xl py-3 px-2 text-center cursor-pointer transition-all duration-200',
                'flex flex-col items-center gap-1.5',
                selected
                  ? 'border-[#002060] bg-[#002060] text-white shadow-lg shadow-[#002060]/20'
                  : 'border-[#dce4f5] bg-[#f8faff] text-[#002060] hover:border-[#0099ff] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0099ff]/10'
              )}
            >
              <span className={cn(
                'text-[10px] font-bold uppercase tracking-wider leading-tight',
                selected ? 'text-white' : 'text-[#002060]'
              )}>
                {v.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* BU Detail */}
      {bu && (
        <div className="fade-in">
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-[#002060]">Essent {bu.label}</span>
              <Badge variant="blue">{bu.label}</Badge>
            </div>
            <p className="text-xs text-[#6b7a99] mb-5">{bu.desc}</p>

            <Grid3 className="mb-5">
              <div>
                <FormLabel>Dor principal</FormLabel>
                <InfoBox>{bu.dor}</InfoBox>
              </div>
              <div>
                <FormLabel>Persona(s)</FormLabel>
                <InfoBox>
                  {bu.personas.map((p, i) => (
                    <div key={i}><strong>{p.name}</strong> — {p.desc}</div>
                  ))}
                </InfoBox>
              </div>
              <div>
                <FormLabel>Tom de voz</FormLabel>
                <InfoBox>{bu.tom}</InfoBox>
              </div>
            </Grid3>

            <Divider />

            <Grid2 className="mb-5">
              <div>
                <FormLabel>Gatilho de ativação</FormLabel>
                <InfoBox>{bu.gatilho}</InfoBox>
              </div>
              <div>
                <FormLabel>Mensagem central</FormLabel>
                <InfoBox><strong className="text-[#0099ff]">{bu.mensagem}</strong></InfoBox>
              </div>
            </Grid2>

            <Divider />

            <div className="flex flex-wrap justify-end gap-2">
              <Btn variant="accent" onClick={() => onGoTo('conteudo')}>✍️ Gerar Conteúdo →</Btn>
              <Btn variant="primary" onClick={() => onGoTo('cfg')}>📅 Montar Calendário →</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
