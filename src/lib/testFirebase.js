import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
export async function testFirebaseAuth(email, password) {
    try {
        console.log('🧪 Testing Firebase Auth with:', { email, password: password ? 'provided' : 'missing' });
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Firebase Auth test successful:', userCredential.user.uid);
        return userCredential.user;
    }
    catch (error) {
        console.error('❌ Firebase Auth test failed:', error);
        throw error;
    }
}
