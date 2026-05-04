/**
 * Essent — Validador de Tabela Markdown
 * Detecta e sugere correções para erros de formatação
 */

export interface ValidationError {
  type: 'header' | 'separator' | 'row' | 'column' | 'day' | 'format';
  line: number;
  message: string;
  suggestion?: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  stats: {
    totalLines: number;
    headerLine: number;
    separatorLine: number;
    dataRows: number;
    columns: number;
  };
}

export function validateMarkdownTable(text: string): ValidationResult {
  const lines = text.trim().split('\n').map(l => l.trim());
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  let headerLine = -1;
  let separatorLine = -1;
  let columnCount = 0;
  let dataRows = 0;

  // Find header
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('|') && !lines[i].match(/^\|[\s\-:|]+\|$/)) {
      headerLine = i;
      break;
    }
  }

  if (headerLine === -1) {
    errors.push({
      type: 'header',
      line: 1,
      message: 'Cabeçalho não encontrado',
      suggestion: 'Primeira linha deve ser: | Dia | Origem | Funil | Função | Formato | Hook | Angulação |',
      severity: 'error',
    });
    return {
      valid: false,
      errors,
      warnings,
      stats: { totalLines: lines.length, headerLine, separatorLine, dataRows, columns: 0 },
    };
  }

  // Parse header
  const headerCells = lines[headerLine].split('|').map(s => s.trim()).filter((_, i, a) => i > 0 && i < a.length);
  columnCount = headerCells.length;

  const expectedHeaders = ['Dia', 'Origem', 'Funil', 'Função', 'Formato', 'Hook', 'Angulação'];
  if (columnCount !== 7) {
    errors.push({
      type: 'column',
      line: headerLine + 1,
      message: `Esperado 7 colunas, encontrado ${columnCount}`,
      suggestion: `Colunas esperadas: ${expectedHeaders.join(' | ')}`,
      severity: 'error',
    });
  }

  // Validate header names
  expectedHeaders.forEach((expected, idx) => {
    if (headerCells[idx] && !headerCells[idx].toLowerCase().includes(expected.toLowerCase())) {
      warnings.push({
        type: 'header',
        line: headerLine + 1,
        message: `Coluna ${idx + 1}: esperado "${expected}", encontrado "${headerCells[idx]}"`,
        severity: 'warning',
      });
    }
  });

  // Find separator
  for (let i = headerLine + 1; i < lines.length; i++) {
    if (lines[i].match(/^\|[\s\-:|]+\|$/)) {
      separatorLine = i;
      break;
    }
  }

  if (separatorLine === -1) {
    errors.push({
      type: 'separator',
      line: headerLine + 2,
      message: 'Linha separadora não encontrada',
      suggestion: 'Adicione: |---|---|---|---|---|---|---|',
      severity: 'error',
    });
  }

  // Parse data rows
  const dataStart = separatorLine !== -1 ? separatorLine + 1 : headerLine + 1;
  const daySet = new Set<number>();

  for (let i = dataStart; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.includes('|')) continue;

    const cells = line.split('|').map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length);

    if (cells.length === 0) continue;
    dataRows++;

    // Validate column count
    if (cells.length < 7) {
      errors.push({
        type: 'row',
        line: i + 1,
        message: `Linha ${dataRows}: esperado 7 colunas, encontrado ${cells.length}`,
        severity: 'error',
      });
      continue;
    }

    if (cells.length > 7) {
      warnings.push({
        type: 'row',
        line: i + 1,
        message: `Linha ${dataRows}: encontrado ${cells.length} colunas (esperado 7)`,
        suggestion: 'Verifique se há pipes extras ou espaçamento incorreto',
        severity: 'warning',
      });
    }

    // Validate day (first column)
    const dayStr = cells[0];
    const day = parseInt(dayStr);
    if (isNaN(day)) {
      errors.push({
        type: 'day',
        line: i + 1,
        message: `Linha ${dataRows}: coluna "Dia" deve ser um número, encontrado "${dayStr}"`,
        severity: 'error',
      });
    } else if (day < 1 || day > 365) {
      errors.push({
        type: 'day',
        line: i + 1,
        message: `Linha ${dataRows}: dia deve estar entre 1 e 365, encontrado ${day}`,
        severity: 'error',
      });
    } else if (daySet.has(day)) {
      errors.push({
        type: 'day',
        line: i + 1,
        message: `Linha ${dataRows}: dia ${day} duplicado`,
        severity: 'error',
      });
    } else {
      daySet.add(day);
    }

    // Validate required fields
    if (!cells[1] || cells[1].length === 0) {
      warnings.push({
        type: 'format',
        line: i + 1,
        message: `Linha ${dataRows}: coluna "Origem" está vazia`,
        severity: 'warning',
      });
    }

    if (!cells[5] || cells[5].length === 0) {
      warnings.push({
        type: 'format',
        line: i + 1,
        message: `Linha ${dataRows}: coluna "Hook" está vazia`,
        severity: 'warning',
      });
    }

    // Validate hook length
    if (cells[5] && cells[5].split(' ').length > 15) {
      warnings.push({
        type: 'format',
        line: i + 1,
        message: `Linha ${dataRows}: Hook com mais de 15 palavras (${cells[5].split(' ').length} encontradas)`,
        suggestion: 'Hook deve ter no máximo 15 palavras para prender atenção',
        severity: 'warning',
      });
    }
  }

  if (dataRows === 0) {
    errors.push({
      type: 'row',
      line: dataStart + 1,
      message: 'Nenhuma linha de dados encontrada',
      suggestion: 'Adicione linhas após a linha separadora',
      severity: 'error',
    });
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    warnings,
    stats: {
      totalLines: lines.length,
      headerLine,
      separatorLine,
      dataRows,
      columns: columnCount,
    },
  };
}

export function formatValidationMessage(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.valid) {
    lines.push('✅ Tabela válida!');
  } else {
    lines.push('❌ Tabela com erros:');
  }

  lines.push(`📊 Estatísticas: ${result.stats.dataRows} linhas, ${result.stats.columns} colunas`);

  if (result.errors.length > 0) {
    lines.push('\n🔴 Erros:');
    result.errors.forEach(err => {
      lines.push(`  Linha ${err.line}: ${err.message}`);
      if (err.suggestion) lines.push(`    💡 ${err.suggestion}`);
    });
  }

  if (result.warnings.length > 0) {
    lines.push('\n🟡 Avisos:');
    result.warnings.forEach(warn => {
      lines.push(`  Linha ${warn.line}: ${warn.message}`);
      if (warn.suggestion) lines.push(`    💡 ${warn.suggestion}`);
    });
  }

  return lines.join('\n');
}
