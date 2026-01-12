import React, { useState } from "react";
import * as XLSX from "xlsx";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../../lib/api/firebase";

export default function ExcelImport() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const normalizeBarcode = (value) => {
    if (value === null || value === undefined) return "";
    // Вирізаємо все, крім цифр (у файлі інколи може бути пробіл/форматування)
    const digits = String(value).replace(/\D/g, "");
    return digits;
  };

  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    // Підтримка коми як десяткового роздільника
    const s = String(value).replace(/\s/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress({ done: 0, total: 0 });

    try {
const data = await file.arrayBuffer();
const workbook = XLSX.read(data, { cellDates: true });

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Читаємо як таблицю (array of arrays)
const table = XLSX.utils.sheet_to_json(worksheet, {
  header: 1,
  defval: "",
  raw: true, // важливо: числа залишаються числами
});

// нормалізація тексту (прибирає NBSP/зайві пробіли)
const norm = (v) =>
  String(v ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// знаходимо рядок заголовків, де є потрібні колонки
const headerRowIndex = table.findIndex((row) =>
  row.some((cell) => ["скю", "штрих код", "баланс 300"].includes(norm(cell)))
);

if (headerRowIndex === -1) {
  alert("Не знайдено заголовки колонок (СКЮ / Штрих Код / Баланс 300)");
  return;
}

const headers = table[headerRowIndex].map(norm);
const idxSku = headers.indexOf("скю");
const idxBarcode = headers.indexOf("штрих код");
const idxBalance = headers.indexOf("баланс 300");

const normalizeBarcode = (value) =>
  String(value ?? "").replace(/\D/g, "");

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value; // ✅ головне
  const s = String(value)
    .replace(/\u00A0/g, " ")
    .replace(/\s/g, "")
    .replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const round2 = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
};

const transformed = table
  .slice(headerRowIndex + 1)
  .map((row) => {
    const sku = String(row[idxSku] ?? "").trim();
    const barcode = normalizeBarcode(row[idxBarcode]);
    const balance300 = round2(toNumber(row[idxBalance]));

    if (!sku && !barcode && !balance300) return null;

    return { sku, barcode, balance_300: balance300 };
  })
  .filter(Boolean);

      setProgress({ done: 0, total: transformed.length });

      // Запис у Firestore батчами (max 500 операцій на батч)
      const colRef = collection(db, "products_datas");
      const CHUNK = 500;

      for (let i = 0; i < transformed.length; i += CHUNK) {
        const batch = writeBatch(db);
        const chunk = transformed.slice(i, i + CHUNK);

        chunk.forEach((item) => {
          const ref = doc(colRef); // авто-id
          batch.set(ref, item);
        });

        await batch.commit();
        setProgress((p) => ({ ...p, done: Math.min(p.done + chunk.length, p.total) }));
      }

      alert("Дані імпортовані успішно");
    } catch (err) {
      console.error("Помилка імпорту:", err);
      alert("Помилка при імпорті");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />

      {loading && (
        <div>
          <p>Іде імпорт... {progress.total ? `${progress.done}/${progress.total}` : ""}</p>
          {progress.total > 0 && (
            <progress value={progress.done} max={progress.total} style={{ width: "100%" }} />
          )}
        </div>
      )}
    </div>
  );
}