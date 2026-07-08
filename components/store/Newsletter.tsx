"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-rose-50 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <Mail className="mx-auto h-8 w-8 text-rose-400" />
        <h2 className="mt-4 text-2xl font-bold text-stone-900">
          Join Our Newsletter
        </h2>
        <p className="mt-2 text-stone-600">
          Be the first to know about new arrivals, exclusive offers, and style
          tips.
        </p>
        {submitted ? (
          <p className="mt-6 text-rose-500 font-medium">
            Thank you for subscribing!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="sm:max-w-xs bg-white"
            />
            <Button
              type="submit"
              className="bg-rose-400 hover:bg-rose-500 text-white"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
