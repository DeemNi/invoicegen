// 'use client';

// import React, { useState } from 'react';
// import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
// import { Invoice } from '@/app/InvoiceData/page'; // твій тип Invoice

// type Props = {
//   invoice: Invoice;
// };

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 12,
//     fontFamily: 'Helvetica',
//   },
//   section: {
//     marginBottom: 10,
//   },
//   table: {
//     width: 'auto',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableColHeader: {
//     width: '16.6%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     backgroundColor: '#EEE',
//     padding: 4,
//     fontWeight: 'bold',
//   },
//   tableCol: {
//     width: '16.6%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     padding: 4,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
// });

// const InvoiceDocument = ({ invoice }: { invoice: Invoice }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text>Дата: {new Date(invoice.date).toLocaleDateString()}</Text>
//         <Text>Покупець: {invoice.buyerName}</Text>
//       </View>

//       <View style={styles.table}>
//         <View style={styles.tableRow}>
//           <Text style={styles.tableColHeader}>Найменування</Text>
//           <Text style={styles.tableColHeader}>Штрих-код</Text>
//           <Text style={styles.tableColHeader}>Од.вим.</Text>
//           <Text style={styles.tableColHeader}>Кількість</Text>
//           <Text style={styles.tableColHeader}>Сума, грн</Text>
//           <Text style={styles.tableColHeader}>Ціна, грн</Text>
//         </View>

//         {invoice.items.map((item, i) => (
//           <View style={styles.tableRow} key={i}>
//             <Text style={styles.tableCol}>{item.name}</Text>
//             <Text style={styles.tableCol}>–</Text>
//             <Text style={styles.tableCol}>шт</Text>
//             <Text style={styles.tableCol}>{item.quantity}</Text>
//             <Text style={styles.tableCol}>{(item.quantity * item.value).toFixed(2)}</Text>
//             <Text style={[styles.tableCol, styles.bold]}>{item.value.toFixed(2)}</Text>
//           </View>
//         ))}
//       </View>
//     </Page>
//   </Document>
// );

// export const InvoiceDownloadButton = ({ invoice }: Props) => {
//   if (!invoice || !invoice.items || invoice.items.length === 0) {
//     return <p>Інвойс порожній або некоректний</p>;
//   }

//   return (
//     <PDFDownloadLink
//       document={<InvoiceDocument invoice={invoice} />}
//       fileName={`Invoice_${invoice.buyerName}_${new Date(invoice.date).toLocaleDateString()}.pdf`}
//       style={{
//         textDecoration: 'none',
//         padding: '8px 16px',
//         color: '#fff',
//         backgroundColor: '#0070f3',
//         borderRadius: 4,
//         display: 'inline-flex',
//         alignItems: 'center',
//         gap: 8,
//       }}
//     >
//       {({ loading }) => (loading ? 'Генерація...' : 'Завантажити PDF')}
//     </PDFDownloadLink>
//   );
// };


'use client';

import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
// import InvoiceDocument from './InvoiceDocument'; // твій компонент з PDF Document

type Invoice = {
  buyerName: string;
  date: Date;
  items: { name: string; quantity: number; value: number }[];
};

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 10 },
  table: { width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '16.6%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#EEE', padding: 4, fontWeight: 'bold' },
  tableCol: { width: '16.6%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 4 },
  bold: { fontWeight: 'bold' },
});

const InvoiceDocument = ({ invoice }: { invoice: Invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Дата: {invoice.date.toLocaleDateString()}</Text>
        <Text>Покупець: {invoice.buyerName}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Найменування</Text>
          <Text style={styles.tableColHeader}>Штрих-код</Text>
          <Text style={styles.tableColHeader}>Од.вим.</Text>
          <Text style={styles.tableColHeader}>Кількість</Text>
          <Text style={styles.tableColHeader}>Сума, грн</Text>
          <Text style={styles.tableColHeader}>Ціна, грн</Text>
        </View>

        {invoice.items.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.tableCol}>{item.name}</Text>
            <Text style={styles.tableCol}>–</Text>
            <Text style={styles.tableCol}>шт</Text>
            <Text style={styles.tableCol}>{item.quantity}</Text>
            <Text style={styles.tableCol}>{(item.quantity * item.value).toFixed(2)}</Text>
            <Text style={[styles.tableCol, styles.bold]}>{item.value.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export const InvoiceDownloadButton = ({ invoice }: { invoice: Invoice }) => {
  const handleDownload = async () => {
    const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
    saveAs(blob, `Invoice_${invoice.buyerName}_${new Date(invoice.date).toLocaleDateString()}.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: '8px 16px',
        backgroundColor: '#0070f3',
        color: '#fff',
        borderRadius: 4,
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Завантажити PDF
    </button>
  );
};
