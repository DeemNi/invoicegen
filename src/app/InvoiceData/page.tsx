'use client'

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getInvoiceData } from "@/lib/api/getInvoiceData";

import React from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import DownloadInvoiceButton from "@/components/pdf/DownloadInvoiceButton";

export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

export type Invoice = {
  id: string;
  buyer_name: string;
  buyer_addr: string;
  product_data: ProductItem[];
  created_at: Date;
};

export default function InvoiceData() {

    const [invoices, setInvoices] = React.useState<Invoice[]>([]);
    const [lastDoc, setLastDoc] = React.useState<any>(null);
    const [expanded, setExpanded] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

const fetchInvoices = async () => {
  setLoading(true);
  const { invoices: newInvoicesRaw, lastVisible } = await getInvoiceData(5, lastDoc);

  // Приведемо кожен "сирий" інвойс до типу Invoice
  const newInvoices = newInvoicesRaw.map((inv: any) => ({
    id: inv.id,
    buyer_name: inv.buyerName || inv.buyer_name,
    buyer_addr: inv.buyerAddr || inv.buyer_addr,
    product_data: inv.items || inv.product_data || [],
    created_at: inv.date ? new Date(inv.date) : inv.created_at,
  }));

  setInvoices(prevInvoices => {
    const existingIds = new Set(prevInvoices.map(inv => inv.id));
    const filteredNewInvoices = newInvoices.filter(inv => !existingIds.has(inv.id));
    return [...prevInvoices, ...filteredNewInvoices];
  });

  setLastDoc(lastVisible);
  setLoading(false);
}

    React.useEffect(() => {
        fetchInvoices();
    }, [])

    return (
      <>
        <ProtectedRoute>
          <Header />
          <div className="space-y-4 mr-[2rem] ml-[2rem] mt-[1rem]">
            {invoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="p-4 cursor-pointer border"
                onClick={() => setExpanded(expanded === invoice.id ? null : invoice.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{invoice.buyer_name}</p>
                    <p className="text-sm text-muted-foreground">{invoice.created_at.toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold">
                    Загалом: {invoice.product_data.reduce((acc, item) => acc + item.quantity * item.value, 0).toFixed(2)} грн
                  </p>
                </div>

                {expanded === invoice.id && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Товар:</p>
                    <ul className="space-y-1">
                      {invoice.product_data.map((item, index) => (
                        <li key={item.id || index} className="text-sm">
                          {item.name} — {item.quantity}шт x {item.value.toFixed(2)} грн/шт
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <DownloadInvoiceButton invoice={invoice as any} />
                      <Button onClick={() => console.log(invoice)}> ss </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
            {lastDoc && (
              <Button onClick={fetchInvoices} disabled={loading}>
                {loading ? "Завантаження..." : "Відобразити більше"}
              </Button>
            )}
          </div>
        </ProtectedRoute>
      </>
    );
}
