"use client";
import React, { ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { db } from "../../lib/api/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function BuyersImport() {
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    const buyersData = jsonData.map(row => ({
      name: String(row["Buyer"] ?? ""),
      location: String(row["Location"] ?? ""),
    }));

    try {
      const collectionRef = collection(db, "buyers_data");
      for (const buyer of buyersData) {
        await addDoc(collectionRef, buyer);
      }
      alert("Дані успішно завантажено в Firestore!");
    } catch (error) {
      console.error("Помилка запису в Firestore:", error);
      alert("Сталася помилка при завантаженні даних");
    }
  };

  return (
    <div>
      <h2>Імпорт покупців у Firestore</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
    </div>
  );
}
