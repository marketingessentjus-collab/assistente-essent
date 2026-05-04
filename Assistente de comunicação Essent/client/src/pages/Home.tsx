/*
 * Essent — Assistente de Comunicação
 * Main page: Header + Nav Tabs + Tab Panels
 * Design: Swiss International Style — Navy #002060 | Blue #0099ff | Blinker font
 */
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getApiKey } from '@/lib/api';
import ApiKeyModal from '@/components/ApiKeyModal';
import NichoTab from '@/components/tabs/NichoTab';
import ConteudoTab from '@/components/tabs/ConteudoTab';
import ConfiguradorTab from '@/components/tabs/ConfiguradorTab';
import ResumoTab from '@/components/tabs/ResumoTab';
import PromptTab from '@/components/tabs/PromptTab';
import RevisorTab from '@/components/tabs/RevisorTab';
import ComunicacaoTab from '@/components/tabs/ComunicacaoTab';
import MassaTemaTab from '@/components/tabs/MassaTemaTa';
import CollabTab from '@/components/tabs/CollabTab';

type TabId = 'nicho' | 'conteudo' | 'cfg' | 'resumo' | 'prompt' | 'revisor' | 'comunicacao' | 'massa' | 'collab';

interface Tab { id: TabId; label: string; icon: string; }

const TABS: Tab[] = [
  { id: 'nicho', label: 'Nicho', icon: '🎯' },
  { id: 'conteudo', label: 'Conteúdo', icon: '✍️' },
  { id: 'cfg', label: 'Configurador', icon: '📅' },
  { id: 'resumo', label: 'Resumo', icon: '📋' },
  { id: 'prompt', label: 'Eng. de Prompt', icon: '⚙️' },
  { id: 'revisor', label: 'Revisor', icon: '🔍' },
  { id: 'comunicacao', label: 'Comunicação', icon: '📣' },
  { id: 'massa', label: 'Massa por Tema', icon: '🎨' },
  { id: 'collab', label: 'Collab', icon: '🤝' },
];

interface CalRow {
  d: number; o: string; e: string; f: string; m: string; h: string; a: string;
}

const CAL_STORAGE_KEY = 'essent-cal';
const BU_STORAGE_KEY = 'essent-bu';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('nicho');
  const [selectedBU, setSelectedBU] = useState('');
  const [calRows, setCalRows] = useState<CalRow[]>([]);
  const [showApiModal, setShowApiModal] = useState(false);

  // Load persisted data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CAL_STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.calRows?.length) setCalRows(d.calRows);
        if (d.bu) setSelectedBU(d.bu);
      }
      const bu = localStorage.getItem(BU_STORAGE_KEY);
      if (bu) setSelectedBU(bu);
    } catch {}
  }, []);

  const handleSelectBU = (key: string) => {
    setSelectedBU(key);
    localStorage.setItem(BU_STORAGE_KEY, key);
  };

  const handleCalRowsChange = (rows: CalRow[]) => {
    setCalRows(rows);
    try {
      localStorage.setItem(CAL_STORAGE_KEY, JSON.stringify({ calRows: rows, bu: selectedBU }));
    } catch {}
  };

  const handleApiKeySaved = () => {
    setShowApiModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f2]" style={{ fontFamily: "'Blinker', sans-serif" }}>

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-[#002060] px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md shadow-[#002060]/20">
        <div className="flex flex-col items-center gap-1">
          <img src="/logo-essent.png" alt="Essent" className="h-10 flex-shrink-0" />
          <span className="text-[10px] font-normal text-white uppercase tracking-widest" style={{ fontFamily: "'Blinker', sans-serif" }}>Assistente de Comunicação</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#002060] bg-[#0099ff] px-2.5 py-1 rounded-full tracking-wider">
            USO INTERNO
          </span>
        </div>
      </header>

      {/* ─── Nav Tabs ────────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b-2 border-[#f2f2f2] overflow-x-auto flex px-2 scrollbar-thin">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-4 py-3.5 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border-0 bg-transparent cursor-pointer uppercase tracking-wider flex items-center gap-1.5',
              activeTab === tab.id
                ? 'text-[#002060] font-bold opacity-100'
                : 'text-[#002060] opacity-50 hover:opacity-80 hover:text-[#0099ff]'
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-[15%] w-[70%] h-[2.5px] bg-[#0099ff] rounded-sm" />
            )}
          </button>
        ))}
      </nav>

      {/* ─── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 py-6 pb-12">
        {activeTab === 'nicho' && (
          <NichoTab
            selectedBU={selectedBU}
            onSelectBU={handleSelectBU}
            onGoTo={(tab) => setActiveTab(tab as TabId)}
          />
        )}
        {activeTab === 'conteudo' && <ConteudoTab selectedBU={selectedBU} />}
        {activeTab === 'cfg' && (
          <ConfiguradorTab
            selectedBU={selectedBU}
            calRows={calRows}
            onCalRowsChange={handleCalRowsChange}
          />
        )}
        {activeTab === 'resumo' && <ResumoTab />}
        {activeTab === 'prompt' && <PromptTab />}
        {activeTab === 'revisor' && <RevisorTab />}
        {activeTab === 'comunicacao' && <ComunicacaoTab />}
        {activeTab === 'massa' && <MassaTemaTab />}
        {activeTab === 'collab' && <CollabTab />}
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#002060] text-white/40 text-center py-3 text-[10px] uppercase tracking-widest">
        Essent Inovação Contábil · Assistente de Comunicação · Uso Interno
      </footer>

      {/* ─── API Key Modal ───────────────────────────────────────────────────── */}
      <ApiKeyModal
        open={showApiModal}
        onClose={() => { setShowApiModal(false); }}
      />
    </div>
  );
}
