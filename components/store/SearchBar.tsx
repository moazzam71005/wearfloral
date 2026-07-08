"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  sticky?: boolean;
}

export function SearchBar({ sticky = false }: SearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <section
      className={`border-y border-stone-200 bg-white py-4 ${
        sticky ? "sticky top-16 z-40" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            type="search"
            placeholder="Search by name, brand, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-stone-200 bg-stone-50"
          />
        </form>
        <Button
          variant="outline"
          className="shrink-0 gap-2"
          onClick={() => router.push("/shop")}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>
    </section>
  );
}
