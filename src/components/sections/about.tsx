import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24">
      <div className="container mx-auto px-6">
        <div className="md:grid md:grid-cols-3 md:gap-12 items-center">
          <div className="md:col-span-1 flex justify-center">
             <Avatar className="w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-primary">
                <AvatarImage src="https://placehold.co/400x400.png" alt="Foto del creador" data-ai-hint="portrait filmmaker" />
                <AvatarFallback>CD</AvatarFallback>
            </Avatar>
          </div>
          <div className="md:col-span-2 mt-8 md:mt-0">
            <h2 className="text-3xl font-bold text-white">Hola, soy Cine Digital</h2>
            <p className="mt-4 text-gray-300">
              Desde que vi "2001: A Space Odyssey" en un cine de barrio, supe que las películas eran algo más que simple entretenimiento. Para mí, son la forma de arte más poderosa del siglo XX y XXI, un lenguaje universal capaz de encapsular toda la complejidad de la experiencia humana.
            </p>
            <p className="mt-4 text-gray-300">
              Creé este espacio para compartir esa pasión y para investigar junto a ustedes el "porqué" y el "cómo" del cine. No soy un crítico tradicional; me considero un traductor, un explorador que intenta descifrar los mensajes ocultos en la luz, la sombra y el sonido. Gracias por acompañarme en este viaje.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
