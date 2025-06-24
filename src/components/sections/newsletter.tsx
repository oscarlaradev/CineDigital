import { YouTubeIcon, TwitterIcon, InstagramIcon } from "@/components/icons";

const socialLinks = [
    { href: "#", icon: YouTubeIcon, label: "YouTube" },
    { href: "#", icon: TwitterIcon, label: "Twitter" },
    { href: "#", icon: InstagramIcon, label: "Instagram" },
];

export default function NewsletterSection() {
  return (
    <section id="contacto" className="py-20 bg-card/50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white">Sígueme en Redes</h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Conectemos para no perderte ningún análisis, recomendación o contenido exclusivo.
        </p>
        <div className="mt-8 flex justify-center space-x-6 sm:space-x-10">
          {socialLinks.map((link) => (
             <a 
                key={link.label} 
                href={link.href} 
                className="flex flex-col items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                aria-label={link.label}
             >
                <div className="bg-muted p-4 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:scale-110 shadow-lg">
                    <link.icon className="h-8 w-8 transition-colors group-hover:text-primary-foreground" />
                </div>
                <span className="font-medium tracking-wide transition-colors group-hover:text-primary">{link.label}</span>
             </a>
          ))}
        </div>
      </div>
    </section>
  );
}
