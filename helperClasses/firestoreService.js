import { getDoc } from 'firebase/firestore';

export async function getOrganizerProfile(organizerRef) {
  try {
    const doc = await getDoc(organizerRef);

    if (doc.exists()) {
      const data = doc.data();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}