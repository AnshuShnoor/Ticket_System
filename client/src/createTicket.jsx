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
    <main className="min-h-screen bg-slate-100 p-5 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Dashboard
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Create Support Ticket
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Describe your issue so our support team can help.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              role="status"
              className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="subject"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                maxLength={150}
                required
                placeholder="e.g. Unable to login"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={5000}
                required
                rows={5}
                placeholder="Explain your issue..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Submit Ticket"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
