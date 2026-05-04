/**
 * Essent — Utilitário de Exportação para .docx
 * Gera arquivo Word com conteúdo gerado e calendário
 */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow, BorderStyle, WidthType, VerticalAlign, convertInchesToTwip } from 'docx';

interface CalRow {
  d: number;
  o: string;
  e: string;
  f: string;
  m: string;
  h: string;
  a: string;
}

interface ContentItem {
  tipo: string;
  titulo: string;
  conteudo: string;
}

export async function exportToDocx(
  calendarRows: CalRow[],
  contentItems: ContentItem[],
  buName: string = 'Essent'
) {
  const sections = [];

  // Título
  sections.push(
    new Paragraph({
      text: `${buName} — Exportação de Conteúdo`,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
      thematicBreak: false,
    })
  );

  // Data de exportação
  sections.push(
    new Paragraph({
      text: `Gerado em: ${new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
      spacing: { after: 400 },
      style: 'Normal',
    })
  );

  // Seção: Conteúdo Gerado
  if (contentItems.length > 0) {
    sections.push(
      new Paragraph({
        text: '📝 Conteúdo Gerado',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      })
    );

    contentItems.forEach((item, idx) => {
      sections.push(
        new Paragraph({
          text: `${idx + 1}. ${item.tipo} — ${item.titulo}`,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 100 },
        })
      );

      // Quebrar conteúdo em parágrafos
      const lines = item.conteudo.split('\n').filter(l => l.trim());
      lines.forEach(line => {
        sections.push(
          new Paragraph({
            text: line,
            spacing: { after: 100 },
          })
        );
      });

      sections.push(
        new Paragraph({
          text: '',
          spacing: { after: 200 },
        })
      );
    });
  }

  // Seção: Calendário Editorial
  if (calendarRows.length > 0) {
    sections.push(
      new Paragraph({
        text: '📅 Calendário Editorial',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );

    // Tabela do calendário
    const tableRows = [
      // Header
      new TableRow({
        height: { value: 400, rule: 'auto' },
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Dia', run: { bold: true } })],
            shading: { fill: '002060' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Origem', run: { bold: true } })],
            shading: { fill: '002060' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Funil', run: { bold: true } })],
            shading: { fill: '002060' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Função', run: { bold: true } })],
            shading: { fill: '002060' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Formato', run: { bold: true } })],
            shading: { fill: '002060' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Hook', run: { bold: true } })],
            shading: { fill: '002060' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Angulação', run: { bold: true } })],
            shading: { fill: '002060' },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      // Data rows
      ...calendarRows.map(
        row =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(row.d.toString())],
                width: { size: 5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(row.o)],
                width: { size: 12, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(row.e)],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(row.f)],
                width: { size: 14, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(row.m)],
                width: { size: 10, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(row.h)],
                width: { size: 30, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph(row.a)],
                width: { size: 19, type: WidthType.PERCENTAGE },
              }),
            ],
          })
      ),
    ];

    sections.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  }

  // Criar documento
  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  // Gerar arquivo
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `essent-conteudo-${new Date().toISOString().split('T')[0]}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}
