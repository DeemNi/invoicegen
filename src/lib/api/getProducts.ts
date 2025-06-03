import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export async function getProducts() {
    const snapshot = await getDocs(collection(db, 'products_data'))

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}