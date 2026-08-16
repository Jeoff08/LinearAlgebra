// components/PDFExport.tsx
import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PDFExportProps {
  title: string;
  data: string;
  steps?: string[];
  explanation?: string;
  fileName?: string;
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'a4' | 'letter';
}

const PDFExport: React.FC<PDFExportProps> = ({ 
  title, 
  data, 
  steps, 
  explanation, 
  fileName = 'result',
  orientation = 'portrait',
  paperSize = 'a4'
}) => {
  const exportPDF = () => {
    // Create PDF with specified orientation and paper size
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: paperSize
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPos = margin + 10;
    let sectionGap = 12;

    // --- TITLE ---
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    // --- DATE ---
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 14;

    // --- RESULT SECTION ---
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULT', margin, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const resultLines = data.split('\n').filter(line => line.trim());
    for (const line of resultLines) {
      if (line.trim()) {
        if (yPos > pageHeight - margin - 10) {
          doc.addPage();
          yPos = margin + 10;
        }
        const cleanLine = line.replace(/[\[\]{}]/g, '').trim();
        doc.text(cleanLine, margin + 5, yPos);
        yPos += 7;
      }
    }
    yPos += sectionGap;

    // --- EXPLANATION SECTION ---
    if (explanation) {
      if (yPos > pageHeight - margin - 40) {
        doc.addPage();
        yPos = margin + 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPLANATION', margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      
      const expLines = explanation.split('\n');
      for (const line of expLines) {
        if (line.trim()) {
          if (yPos > pageHeight - margin - 10) {
            doc.addPage();
            yPos = margin + 10;
          }
          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
          if (isBullet) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40, 40, 40);
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
          }
          const wrapped = doc.splitTextToSize(line, maxWidth);
          for (const wLine of wrapped) {
            doc.text(wLine, margin, yPos);
            yPos += 5.5;
          }
        } else {
          yPos += 3;
        }
      }
      yPos += sectionGap;
    }

    // --- STEPS SECTION ---
    if (steps && steps.length > 0) {
      if (yPos > pageHeight - margin - 40) {
        doc.addPage();
        yPos = margin + 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('STEP-BY-STEP SOLUTION', margin, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');

      for (const step of steps) {
        if (!step.trim()) {
          yPos += 3;
          continue;
        }

        if (yPos > pageHeight - margin - 15) {
          doc.addPage();
          yPos = margin + 10;
        }

        const stepLines = step.split('\n');
        for (const line of stepLines) {
          if (!line.trim()) {
            yPos += 2;
            continue;
          }

          const isHeader = /^Step \d+:/.test(line) || /^[📝📊🔄➖✅]/.test(line) || /^Row/.test(line);
          const isMath = /[=+\-×÷√∑∫]/.test(line) && /[0-9]/.test(line);
          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

          if (isHeader) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40, 40, 40);
          } else if (isMath) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
          } else if (isBullet) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40, 40, 40);
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
          }

          const cleanLine = line.replace(/^ {2,}/, '');
          const wrappedLines = doc.splitTextToSize(cleanLine, maxWidth);
          for (const wrappedLine of wrappedLines) {
            if (yPos > pageHeight - margin - 10) {
              doc.addPage();
              yPos = margin + 10;
            }
            doc.text(wrappedLine, margin, yPos);
            yPos += 5;
          }
        }
        yPos += 2;
      }
      yPos += sectionGap;
    }

    // Add footer with page numbers
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }

    doc.save(`${fileName}.pdf`);
  };

  return (
    <button
      onClick={exportPDF}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm flex items-center gap-2 text-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF
    </button>
  );
};

export default PDFExport;