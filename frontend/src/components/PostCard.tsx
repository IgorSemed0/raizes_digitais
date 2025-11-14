'use client';

import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface PostCardProps {
  author: {
    name: string;
    avatar: string;
    relationship?: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export function PostCard({ author, content, image, timestamp, likes, comments, isLiked = false }: PostCardProps) {
  return (
    <Card padding="none">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--dark-bg)] overflow-hidden">
            <ImageWithFallback 
              src={author.avatar} 
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-[var(--text-primary)]">{author.name}</h3>
            {author.relationship && (
              <p className="text-sm text-[var(--text-secondary)]">{author.relationship}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-[var(--text-primary)]">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <div className="w-full aspect-video bg-[var(--dark-bg)] overflow-hidden">
          <ImageWithFallback 
            src={image} 
            alt="Post image"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[var(--text-secondary)]">{likes} curtidas</span>
          <span className="text-sm text-[var(--text-secondary)]">{comments} comentários</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            Curtir
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="w-5 h-5" />
            Comentar
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-5 h-5" />
            Compartilhar
          </Button>
        </div>
      </div>
    </Card>
  );
}
