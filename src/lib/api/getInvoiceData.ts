import { collection, getDocs, query, limit, startAfter, orderBy } from "firebase/firestore";
import { db } from './firebase'

export async function getInvoiceData(limitCount: number, lastDoc?: any) {
    let q = query(collection(db, 'invoice_data'), orderBy('created_at', 'desc'), limit(limitCount));
    if(lastDoc) {
        q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    const invoices = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        buyerName: data.buyer_name,
        buyerAddr: data.buyer_addr,
        date: data.created_at?.toDate?.() ?? new Date(),
        items: data.product_data ?? []
    };
    });

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { invoices, lastVisible };
}