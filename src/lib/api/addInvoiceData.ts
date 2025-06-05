'use client'

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app, db } from './firebase';

export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

export interface InvoiceData {
  buyer_name: string;
  buyer_addr: string;
  product_data: ProductItem[];
}

export async function addInvoiceData(invoiceData: InvoiceData) {
    try {
        const docRef = await addDoc(collection(db, 'invoice_data'), invoiceData);
        return {success: true, id: docRef.id};
    } catch (error){
        console.error('Помилка при записі invoice_data:', error);
        return { success: false, error };
    }
}