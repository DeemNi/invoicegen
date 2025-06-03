import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export async function getBuyer() {
    const snapshot = await getDocs(collection(db, 'buyers_data'))


    return snapshot.docs.map(doc => {
        const data = doc.data()

        return {
            id: doc.id,
            name: data.name,
            ...data
        }
    });
}