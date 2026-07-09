"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/format";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUsersPage() {
  const { customers, refreshCustomers } = useData();
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">City</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-stone-500">
                  No customers yet
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <p className="font-medium">{customer.name || "—"}</p>
                    <p className="text-xs text-stone-500 md:hidden">{customer.phone}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{customer.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.city}</TableCell>
                  <TableCell>{customer.orderCount}</TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
