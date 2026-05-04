/*
 * Essent — Modal de Configuração de API Key
 */
import { useState } from 'react';
import { getApiKey, setApiKey } from '@/lib/api';
import { Btn } from './EssentUI';

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ open, onClose }: ApiKeyModalProps) {
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(key.trim());
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[#002060]/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-7 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#6b7a99] hover:text-[#002060] text-lg font-bold bg-transparent border-0 cursor-pointer"
        >
          ✕
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🔑</span>
          <h2 className="text-base font-bold text-[#002060]">Configurar API Key</h2>
        </div>
        <p className="text-xs text-[#6b7a99] mb-4 leading-relaxed">
          Insira sua chave da API Anthropic (Claude) para habilitar a geração de conteúdo com IA.
          A chave é salva localmente no seu navegador e nunca enviada para servidores externos.
        </p>
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-[#002060] mb-1.5 uppercase tracking-wider">
            Anthropic API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full px-3 py-2.5 bg-[#f8faff] border border-[#dce4f5] rounded-lg text-[#002060] text-sm font-mono focus:outline-none focus:border-[#0099ff] focus:ring-2 focus:ring-[#0099ff]/10"
          />
        </div>
        <div className="bg-[#f0f6ff] border border-[#cce3ff] rounded-lg p-3 text-xs text-[#002060] mb-4 leading-relaxed">
          <strong className="text-[#0099ff]">Como obter:</strong> Acesse{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-[#0099ff] underline">
            console.anthropic.com
          </a>{' '}
          → API Keys → Create Key.
        </div>
        <Btn variant="accent" full onClick={handleSave} disabled={!key.trim()}>
          {saved ? '✅ Salvo!' : '💾 Salvar Chave'}
        </Btn>
      </div>
    </div>
  );
}
