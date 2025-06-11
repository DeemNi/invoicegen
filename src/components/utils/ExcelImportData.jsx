import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../lib/api/firebase'; // твій файл з ініціалізацією Firebase

export default function ExcelImport() {
  const [loading, setLoading] = useState(false);

function formatEAN(ean) {
  if (!ean) return "";
  const digits = ean.toString().replace(/\D/g, "");
  // Розбиваємо на групи: 1 цифра, а потім групи по 3 цифри
  return digits.replace(/^(\d)(\d{3})(\d{3})(\d{3})(\d*)$/, (_, g1, g2, g3, g4, g5) => {
    return [g1, g2, g3, g4, g5].filter(Boolean).join(" ");
  });
}

  const handleFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setLoading(true);
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Трансформуємо дані у потрібний формат
  const transformedData = jsonData.map(item => ({
    EAN_code: formatEAN(item["Код ЕАН"] || ""),
    name: item["Название"] || "",
    price: Number((Number(item["ціна"]) || 0).toFixed(2)),
    uktzed_code: (item['Код УКТЗЭД'] || "").toString().replace(/\s/g, ""),
  }));

  try {
    for (const item of transformedData) {
      await addDoc(collection(db, "products_data"), item);
    }
    alert("Дані імпортовані успішно");
  } catch (err) {
    console.error("Помилка імпорту", err);
    alert("Помилка при імпорті");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
      {loading && <p>Іде імпорт...</p>}
    </div>
  );
}
