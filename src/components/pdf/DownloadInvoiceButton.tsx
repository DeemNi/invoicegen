'use client';
import { Button } from '@/components/ui/button';
import { pdf } from '@react-pdf/renderer';
import InvoiceDocument, { InvoiceData } from './InvoiceDocument';

interface DownloadInvoiceButtonProps {
  invoice: InvoiceData & { id?: string }; // id необов’язковий, якщо є
}

export default function DownloadInvoiceButton({ invoice }: DownloadInvoiceButtonProps) {
  const handleDownload = async () => {
    const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();

    const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const link = document.createElement('a');

    // Ім'я файлу: якщо є id — використовуємо його, інакше дату у форматі YYYYMMDD
    const fileName = invoice.id
      ? `Накладна-${invoice.id}.pdf`
      : `Накладна-${new Date(invoice.created_at).toISOString().slice(0, 10)}.pdf`;

    link.href = url;
    link.download = fileName;
    link.click();

    // Чистимо URL після завантаження
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      Завантажити PDF
    </Button>
  );
}
