'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { subscribeAction } from '@/app/actions/newsletter';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button 
            type="submit" 
            disabled={pending}
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground flex-shrink-0 font-medium px-6 py-3 h-auto"
        >
            {pending ? 'Suscribiendo...' : 'Suscribirme'}
        </Button>
    );
}

export default function NewsletterSection() {
  const [state, formAction] = useActionState(subscribeAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? '¡Todo listo!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);


  return (
    <section id="newsletter" className="py-20 bg-card/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white">Únete a la Conversación</h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Recibe mi último análisis directamente en tu bandeja de entrada, junto con recomendaciones exclusivas y contenido que no encontrarás en ningún otro lugar.
        </p>
        <form action={formAction} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <Input 
            type="email" 
            name="email"
            placeholder="tu.correo@ejemplo.com" 
            required 
            className="w-full px-4 py-3 rounded-md bg-[#2a2a2a] text-white border-[#444] focus:ring-2 focus:ring-primary focus:outline-none h-auto"
          />
          <SubmitButton />
        </form>
      </div>
    </section>
  );
}
