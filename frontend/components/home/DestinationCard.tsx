'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Destination {
  name: string;
  image: string;
  tag: string;
  rating: number;
}

export function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] bg-gray-200"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-blue-400/20 group-hover:bg-blue-400/10 transition-colors" />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full mb-2">
          {destination.tag}
        </span>
        <h3 className="text-white font-bold text-lg">{destination.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white/90 text-sm">{destination.rating}</span>
        </div>
      </div>
    </motion.div>
  );
}
