/**
 * Essent — Modal de Validação de Tabela Markdown
 * Mostra erros e avisos com sugestões de correção
 */
import { useState } from 'react';
import { validateMarkdownTable, formatValidationMessage, ValidationResult } from '@/lib/tableValidator';
import { Btn, Card } from './EssentUI';
import { cn } from '@/lib/utils';

interface TableValidatorModalProps {
  open: boolean;
  tableText: string;
  onClose: () => void;
  onConfirm: (text: string) => void;
}

export default function TableValidatorModal({ open, tableText, onClose, onConfirm }: TableValidatorModalProps) {
  const [editText, setEditText] = useState(tableText);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = () => {
    const validation = validateMarkdownTable(editText);
    setResult(validation);
  };

  const handleConfirm = () => {
    if (result?.valid) {
      onConfirm(editText);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#002060] text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Validador de Tabela Markdown</h2>
          <button onClick={onClose} className="text-2xl leading-none opacity-70 hover:opacity-100">×</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Editor */}
          <div>
            <label className="block text-sm font-bold text-[#002060] mb-2">Cole sua tabela markdown:</label>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={10}
              placeholder="| Dia | Origem | Funil | Função | Formato | Hook | Angulação |"
              className="w-full px-3 py-2.5 bg-[#f8faff] border-2 border-[#dce4f5] rounded-lg text-[11px] font-mono text-[#002060] resize-y focus:outline-none focus:border-[#0099ff]"
            />
          </div>

          {/* Validate Button */}
          <Btn variant="primary" full onClick={handleValidate}>
            🔍 Validar Tabela
          </Btn>

          {/* Validation Result */}
          {result && (
            <Card title={result.valid ? '✅ Tabela Válida' : '❌ Erros Encontrados'}>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#f0f6ff] border border-[#cce3ff] rounded p-2">
                    <span className="text-xs text-[#6b7a99]">Linhas de dados</span>
                    <span className="block text-lg font-bold text-[#002060]">{result.stats.dataRows}</span>
                  </div>
                  <div className="bg-[#f0f6ff] border border-[#cce3ff] rounded p-2">
                    <span className="text-xs text-[#6b7a99]">Colunas</span>
                    <span className="block text-lg font-bold text-[#002060]">{result.stats.columns}</span>
                  </div>
                </div>

                {/* Errors */}
                {result.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h3 className="font-bold text-red-700 mb-2">🔴 Erros ({result.errors.length})</h3>
                    <div className="space-y-2">
                      {result.errors.map((err, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="text-red-700 font-semibold">
                            Linha {err.line}: {err.message}
                          </p>
                          {err.suggestion && (
                            <p className="text-red-600 text-xs mt-1">💡 {err.suggestion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <h3 className="font-bold text-amber-700 mb-2">🟡 Avisos ({result.warnings.length})</h3>
                    <div className="space-y-2">
                      {result.warnings.map((warn, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="text-amber-700 font-semibold">
                            Linha {warn.line}: {warn.message}
                          </p>
                          {warn.suggestion && (
                            <p className="text-amber-600 text-xs mt-1">💡 {warn.suggestion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {result.valid && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-emerald-700 font-semibold">✅ Tabela pronta para importar!</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#f8faff] border-t border-[#dce4f5] px-6 py-4 flex gap-2 justify-end">
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn
            variant="accent"
            onClick={handleConfirm}
            disabled={!result?.valid}
            className={cn(!result?.valid && 'opacity-50 cursor-not-allowed')}
          >
            ✅ Importar Tabela
          </Btn>
        </div>
      </div>
    </div>
  );
}
