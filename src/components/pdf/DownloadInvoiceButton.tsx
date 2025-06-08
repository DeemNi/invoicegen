'use client';
import { Button } from '@/components/ui/button';
import { pdf } from '@react-pdf/renderer';
import InvoiceDocument from './InvoiceDocument';

type InvoiceData = {
  id: string;
  client: string;
  amount: number;
  date: string;
};

export default function DownloadInvoiceButton({ invoice }: { invoice: InvoiceData }) {
  const handleDownload = async () => {
    const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `Накладна-${invoice.id}.pdf`;
    link.click();
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      Завантажити PDF
    </Button>
  );
}
