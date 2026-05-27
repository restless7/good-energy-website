"use client";

import { PenSquare, Plus, Search, Eye, Calendar } from 'lucide-react';
import { useState } from 'react';

const mockPosts = [
  { id: '1', title: 'El futuro de la energía solar en Colombia', status: 'Publicado', date: '2026-05-15', views: 234 },
  { id: '2', title: 'Cómo funciona tu inversión en paneles solares', status: 'Publicado', date: '2026-04-28', views: 512 },
  { id: '3', title: 'Rendimientos Q1 2026: Resultados', status: 'Borrador', date: '2026-05-20', views: 0 },
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockPosts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Blog / Contenido</h1>
          <p className="text-[#8CB4BC] text-sm mt-1">Gestiona artículos y actualizaciones</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#D8DA00] hover:bg-[#D8DA00]/90 text-[#0D4651] font-semibold rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Nuevo Artículo
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
        <input type="text" placeholder="Buscar artículos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm" />
      </div>

      <div className="space-y-3">
        {filtered.map((post) => (
          <div key={post.id} className="bg-[#0E4D58] p-5 rounded-2xl border border-[#1A6B78]/50 hover:border-[#D8DA00]/30 transition-all duration-300 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#FFFDF0]">{post.title}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-xs text-[#8CB4BC]">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8CB4BC]">
                  <Eye className="w-3 h-3" />
                  {post.views} vistas
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  post.status === 'Publicado' ? 'bg-[#D8DA00]/10 text-[#D8DA00]' : 'bg-[#8CB4BC]/10 text-[#8CB4BC]'
                }`}>{post.status}</span>
              </div>
            </div>
            <button className="p-2 hover:bg-[#1A6B78]/30 rounded-lg transition-colors">
              <PenSquare className="w-4 h-4 text-[#8CB4BC]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
