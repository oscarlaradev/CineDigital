import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function subscribeAction(formData: FormData) {
  'use server';
  const email = formData.get('email');
  // Here you would typically handle the subscription logic,
  // e.g., save to a database or call a third-party service.
  console.log(`New subscription from: ${email}`);
  // You could use react-hot-toast or similar to show a success message.
}

export default function NewsletterSection() {
  return (
    <section id="newsletter" className="py-20 bg-card/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white">Únete a la Conversación</h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Recibe mi último análisis directamente en tu bandeja de entrada, junto con recomendaciones exclusivas y contenido que no encontrarás en ningún otro lugar.
        </p>
        <form action={subscribeAction} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <Input 
            type="email" 
            name="email"
            placeholder="tu.correo@ejemplo.com" 
            required 
            className="w-full px-4 py-3 rounded-md bg-[#2a2a2a] text-white border-[#444] focus:ring-2 focus:ring-primary focus:outline-none h-auto"
          />
          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground flex-shrink-0 font-medium px-6 py-3 h-auto"
          >
            Suscribirme
          </Button>
        </form>
      </div>
    </section>
  );
}
