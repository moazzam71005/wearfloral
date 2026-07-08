"use client";

import { useState } from "react";

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
    <section className="bg-stone-900 py-20">
      <div className="mx-auto max-w-xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">
          Stay in the loop
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
          Join Our Newsletter
        </h2>
        <p className="mt-3 text-stone-400">
          Be first to know about new arrivals, exclusive offers, and style tips
          for the modern desi woman.
        </p>

        {submitted ? (
          <p className="mt-8 rounded-2xl bg-rose-500/10 py-4 text-rose-400 font-medium">
            Thank you! You&apos;re on the list.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-full border border-stone-700 bg-stone-800 px-5 py-3 text-sm text-white placeholder:text-stone-500 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
            />
            <button
              type="submit"
              className="rounded-full bg-rose-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
