import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export async function getProducts() {
    const snapshot = await getDocs(collection(db, 'products_datas'))

    return snapshot.docs.map(doc => {
        const data = doc.data()

        return {
            id: doc.id,
            name: data.sku, // name
            price: data.balance_300, //price
            EAN_code: data.barcode, //ean code
            ...data
        }
    });
}