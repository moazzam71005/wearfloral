"use client";

import { LogOut, Menu } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
  const { logout, user } = useAdminAuth();

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
        <h1 className="text-base font-semibold text-stone-900 sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {user?.email && (
          <span className="hidden text-xs text-stone-400 sm:block">{user.email}</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-1.5 text-stone-500 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
