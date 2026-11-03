import { useState } from "react";

const API_URL = "http://localhost:5000/api/tickets";

const initialForm = {
  subject: "",
  description: "",
  category: "Technical",
  priority: "medium",
};

export default function CreateTicket({ onBack }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Please sign in again before creating a ticket.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          subject: form.subject.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data.message || `Could not create ticket (${response.status}).`
        );
      }

      const ticketId = data.ticket?.id;
      const message = ticketId
        ? `Ticket created successfully (Ticket ID: ${ticketId}).`
        : "Ticket created successfully.";

      setSuccess(message);
      setForm(initialForm);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Something went wrong. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7ff] px-4 py-6 sm:px-8 sm:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between sm:mb-8">
          <a href="#" onClick={(event) => { event.preventDefault(); onBack(); }} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200">
              S
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">SupportDesk</span>
          </a>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-700 sm:px-4"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M12.5 4.167 6.667 10l5.833 5.833M7.5 10h8.333" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </button>
        </header>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_28px_90px_-40px_rgba(47,54,102,0.35)] ring-1 ring-slate-200/80 lg:grid lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div aria-hidden="true" className="absolute -right-28 -top-20 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                We’re here to help
              </span>
              <h2 className="mt-8 text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
                Let’s get this
                <span className="block text-indigo-300">sorted out.</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                Share a few details and our support team will get back to you as soon as possible.
              </p>
            </div>

            <div className="relative mt-12 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m5 7 7 5 7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold">What happens next?</p>
                  <p className="mt-1 text-xs text-slate-400">Your ticket goes straight to our team.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-[10px] font-bold text-emerald-300">1</span>
                  We’ll review your request
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-slate-300">2</span>
                  A specialist will follow up
                </div>
              </div>
            </div>
            <p className="relative mt-8 text-xs text-slate-500">Good support is just around the corner.</p>
          </aside>

          <div className="p-6 sm:p-9 lg:p-10 xl:p-12">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Support request</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Create a ticket
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tell us what’s going on. The more detail you share, the faster we can help.
              </p>
            </div>

            {error && (
              <p role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <span aria-hidden="true" className="font-bold">!</span>
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
                <span aria-hidden="true" className="font-bold">✓</span>
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="subject" className="text-sm font-semibold text-slate-800">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs tabular-nums text-slate-400">{form.subject.length}/150</span>
                </div>
                <input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  placeholder="e.g. I can’t access my account"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="description" className="text-sm font-semibold text-slate-800">
                    How can we help? <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs tabular-nums text-slate-400">{form.description.length}/5000</span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={5000}
                  required
                  rows={5}
                  placeholder="Describe what happened and what you’ve tried so far..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
                <p className="mt-1.5 text-xs text-slate-400">Please don’t include passwords or other sensitive information.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-800">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Account">Account</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="mb-2 block text-sm font-semibold text-slate-800">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm capitalize text-slate-800 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/70 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Creating your ticket..." : "Submit ticket"}
                  {!loading && (
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-slate-400">Our team will follow up with you as soon as possible.</p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
