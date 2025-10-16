import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export async function testFirebaseAuth(email: string, password: string) {
  try {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}
