'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
});

export async function subscribeAction(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors[0].message,
      success: false,
    };
  }

  const { email } = validatedFields.data;

  if (!db) {
    return { message: 'La base de datos no está configurada.', success: false };
  }

  try {
    const subscribersRef = collection(db, "subscribers");
    const q = query(subscribersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return { message: 'Este correo electrónico ya está suscrito.', success: true };
    }

    await addDoc(collection(db, 'subscribers'), {
      email: email,
      subscribedAt: serverTimestamp(),
    });
    return { message: '¡Gracias por suscribirte! Recibirás nuestro próximo análisis.', success: true };
  } catch (error) {
    console.error("Failed to save subscriber", error);
    return { message: 'Hubo un error al procesar tu solicitud. Inténtalo de nuevo.', success: false };
  }
}
