import Image from 'next/image';
import type { Post } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="bg-[#1E1E1E] border-[#2a2a2a] overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/50">
      <CardHeader className="p-0">
        <Image
          src={post.imageUrl || 'https://placehold.co/600x400/1E1E1E/E0E0E0?text=Imagen'}
          alt={`Imagen para ${post.title}`}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint="movie still"
        />
      </CardHeader>
      <CardContent className="p-6">
        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 capitalize">{post.category}</Badge>
        <CardTitle className="mt-2 text-xl font-bold text-white">{post.title}</CardTitle>
        <CardDescription className="mt-2 text-gray-400 text-sm line-clamp-3">{post.summary}</CardDescription>
      </CardContent>
    </Card>
  );
}
