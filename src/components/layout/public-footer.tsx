import { YouTubeIcon, TwitterIcon, InstagramIcon } from "@/components/icons";

const socialLinks = [
    { href: "#", icon: YouTubeIcon, label: "YouTube" },
    { href: "#", icon: TwitterIcon, label: "Twitter" },
    { href: "#", icon: InstagramIcon, label: "Instagram" },
];

export default function PublicFooter() {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6 text-center text-gray-500">
        <p>&copy; 2024 Cine Digital. Todos los derechos reservados.</p>
        <div className="mt-4 flex justify-center space-x-6">
          {socialLinks.map((link) => (
             <a key={link.label} href={link.href} className="hover:text-white transition-colors" aria-label={link.label}>
                <link.icon className="h-5 w-5" />
             </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
