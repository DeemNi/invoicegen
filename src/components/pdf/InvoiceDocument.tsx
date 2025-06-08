'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto.ttf',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: 30,
    fontSize: 12,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    backgroundColor: '#EEE',
    padding: 4,
    fontWeight: 'bold',
  },
  tableCol: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export interface ProductItem {
  name: string;
  quantity: number;
  value: number;
}

export interface InvoiceData {
  buyer_name: string;
  buyer_addr: string;
  product_data: ProductItem[];
  created_at: Date | string;
}

const InvoiceDocument = ({ invoice }: { invoice: InvoiceData }) => {
  // Перетворимо дату, якщо це рядок
  const dateStr =
    typeof invoice.created_at === 'string'
      ? new Date(invoice.created_at).toLocaleDateString()
      : invoice.created_at.toLocaleDateString();

  // Загальна сума
  const totalAmount = invoice.product_data.reduce(
    (sum, item) => sum + item.quantity * item.value,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Накладна</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Покупець:</Text>
          <Text style={styles.value}>{invoice.buyer_name}</Text>
          <Text style={styles.value}>{invoice.buyer_addr}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Дата:</Text>
          <Text style={styles.value}>{dateStr}</Text>
        </View>

        {/* Таблиця продуктів */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Назва</Text>
            <Text style={styles.tableColHeader}>Кількість</Text>
            <Text style={styles.tableColHeader}>Ціна за одиницю, грн</Text>
            <Text style={styles.tableColHeader}>Сума, грн</Text>
          </View>

          {invoice.product_data.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.name}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>{item.value.toFixed(2)}</Text>
              <Text style={[styles.tableCol, styles.bold]}>
                {(item.quantity * item.value).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.bold]}>{/* пусто */}</Text>
            <Text style={[styles.tableCol, styles.bold]}>{/* пусто */}</Text>
            <Text style={[styles.tableCol, styles.bold]}>Всього:</Text>
            <Text style={[styles.tableCol, styles.bold]}>{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
