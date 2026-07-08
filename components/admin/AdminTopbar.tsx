"use client";

import { Menu, LogOut } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
  const { logout } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="gap-2 text-stone-500 hover:text-red-500"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </header>
  );
}
