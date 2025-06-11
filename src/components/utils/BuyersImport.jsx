import React from "react";
import * as XLSX from "xlsx";
import { db } from "../../lib/api/firebase"; // імпорт твоєї ініціалізації Firestore
import { collection, addDoc } from "firebase/firestore";

export default function BuyersImport() {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Формуємо масив для запису
    const buyersData = jsonData.map((row) => ({
      name: row["Buyer"] || "",
      location: row["Location"] || "",
    }));

    try {
      const collectionRef = collection(db, "buyers_data");
      // Записуємо по одному документу (можна оптимізувати батчем)
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
