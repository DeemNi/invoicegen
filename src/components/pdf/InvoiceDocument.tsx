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
    fontSize: 12,
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

  // NEW: column for index
  tableColIndex: {
    flex: 0.5,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 4,
    textAlign: 'center',
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

  tableColName: {
    flex: 3, // Найбільше місця
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 4,
  },
  tableColEAN: {
    flex: 2,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 4,
  },
  tableColSmall: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 4,
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
  footer: {
    marginTop: 20,
    fontSize: 11,
  },
});

export interface ProductItem {
  name: string;
  quantity: number;
  value: number;
  EAN_code: string;
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

  const totalQuantity = invoice.product_data.reduce((sum, item) => sum + item.quantity, 0);

  const mD = Math.floor(Math.random() * 9) + 1; // машрут доставки
  const mP = Math.floor(Math.random() * 9) + 1; // Маршрут позиції

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{dateStr}</Text>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.header}>Заявка по даній формі зміні не підлягає</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={styles.header}>{/* пусто */}</Text>
          <Text style={styles.header}>{invoice.buyer_addr}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.header}>Маршруту доставки № {mD} </Text>
          <Text style={styles.header}>Позиція у маршруті доставки № {mP}</Text>
        </View>

        {/* Таблиця продуктів */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColIndex}>№</Text>
            <Text style={styles.tableColName}>Найменування</Text>
            <Text style={styles.tableColEAN}>Штрих код</Text>
            <Text style={styles.tableColSmall}>Од.вим</Text>
            <Text style={styles.tableColSmall}>Кількість</Text>
            <Text style={styles.tableColSmall}>Ціна, грн з ПДВ</Text>
            <Text style={styles.tableColSmall}>Сума, грн з ПДВ</Text>
          </View>

          {/* Rows */}
{invoice.product_data.map((item, i) => (
  <View key={i} style={styles.tableRow} wrap={false}>
    <Text style={styles.tableColIndex}>{i + 1}</Text>
    <Text style={styles.tableColName}>{item.name}</Text>
    <Text style={styles.tableColEAN}>{item.EAN_code}</Text>
    <Text style={styles.tableColSmall}>пляш</Text>
    <Text style={styles.tableColSmall}>{item.quantity}</Text>
    <Text style={styles.tableColSmall}>{item.value.toFixed(2)}</Text>
    <Text style={[styles.tableColSmall, styles.bold]}>
      {(item.quantity * item.value).toFixed(2)}
    </Text>
  </View>
))}

          {/* Totals row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableColIndex, styles.bold]}>{/* пусто */}</Text>
            <Text style={[styles.tableColName, styles.bold]}>{/* пусто */}</Text>
            <Text style={[styles.tableColEAN, styles.bold]}>{/* пусто */}</Text>
            <Text style={[styles.tableColSmall, styles.bold]}>Всього:</Text>
            <Text style={[styles.tableColSmall, styles.bold]}>{totalQuantity}</Text>
            <Text style={[styles.tableColSmall, styles.bold]}>{/* пусто */}</Text>
            <Text style={[styles.tableColSmall, styles.bold]}>{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Підсумки */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
            marginTop: 20,
          }}
        >
          <Text>Комірник: _________________________</Text>
          <Text>У тому числі ПДВ: {(totalAmount * 0.2).toFixed(2)}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
            marginTop: 15,
          }}
        >
          <Text>Сума</Text>
          <Text>Сума до сплати: {totalAmount.toFixed(2)}</Text>
        </View>

        {/* Підпис */}
        <View style={styles.footer}>
          <Text>Товар перевірено і у повному обсязі прийнято до перевезення</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
            marginTop: 35,
          }}
        >
          <Text>{/* пусто */}</Text>
          <Text>Прийняв(ла): ________________ (підпис) ________________ (ПІБ)</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
