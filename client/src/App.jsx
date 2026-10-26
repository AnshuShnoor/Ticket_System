import { useEffect, useState } from "react";
import CreateTicket from "./CreateTicket";


const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};


function getSavedUser() {
  try {
    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const role = String(parsedUser?.role || "").trim().toLowerCase();

      if (["customer", "agent", "admin"].includes(role)) {
        return { ...parsedUser, role };
      }

      // Clear stale/incomplete session data so the user can sign in again.
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
  } catch {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }

  return null;
}

function getDashboardTitle(role) {
  if (role === "admin") return "Admin Dashboard";
  if (role === "agent") return "Agent Dashboard";
  return "Customer Dashboard";
}

function Dashboard({ user, onLogout, onCreateTicket }) {
  const [notice, setNotice] = useState("");
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  const role = String(user.role || "customer").toLowerCase();

  useEffect(() => {
    let cancelled = false;

    async function fetchTickets() {
      if (role !== "customer") {
        setTicketsLoading(false);
        return;
      }

      try {
        setTicketsLoading(true);
        setTicketsError("");
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Please sign in again.");

        const response = await fetch("http://localhost:5000/api/tickets/my-tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || `Unable to fetch tickets (${response.status}).`);
        }
        if (!cancelled) setTickets(Array.isArray(data.tickets) ? data.tickets : []);
      } catch (error) {
        if (!cancelled) setTicketsError(error.message || "Unable to fetch tickets.");
      } finally {
        if (!cancelled) setTicketsLoading(false);
      }
    }

    fetchTickets();
    return () => { cancelled = true; };
  }, [role]);

  const ticketStats = [
    { label: "Total Tickets", value: tickets.length, color: "text-blue-600" },
    { label: "Open Tickets", value: tickets.filter(t => String(t.status || "").toLowerCase() === "open").length, color: "text-amber-600" },
    { label: "In Progress", value: tickets.filter(t => String(t.status || "").toLowerCase() === "in progress").length, color: "text-violet-600" },
    { label: "Resolved", value: tickets.filter(t => String(t.status || "").toLowerCase() === "resolved").length, color: "text-green-600" },
  ];

  function getStatusStyle(status) {
    const styles = {
      open: "bg-amber-100 text-amber-700",
      "in progress": "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-slate-100 text-slate-700",
    };
    return styles[String(status || "").toLowerCase()] || "bg-slate-100 text-slate-700";
  }

  function getPriorityStyle(priority) {
    const styles = {
      low: "text-slate-500",
      medium: "text-blue-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };
    return styles[String(priority || "").toLowerCase()] || "text-slate-500";
  }

  function handleCreateTicket() {
    if (role === "admin") {
      setNotice("Admin workspace is ready.");
    } else if (role === "agent") {
      setNotice("Agent workspace is ready.");
    } else {
      onCreateTicket();
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="flex w-full flex-col bg-slate-900 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold">
            S
          </div>
          <span className="text-xl font-semibold">SupportDesk</span>
        </div>

        <nav className="flex gap-2 p-4 md:flex-1 md:flex-col">
          <button
            type="button"
            onClick={() => setNotice("")}
            className="flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-left font-medium"
          >
            <span>▦</span> Dashboard
          </button>

          <button
            type="button"
            onClick={() => setNotice("")}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-slate-800"
          >
            <span>▤</span> Tickets
          </button>
        </nav>

        <div className="border-t border-slate-700 p-4">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
            {role}
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-4 w-full rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">Workspace / Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {getDashboardTitle(role)}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Welcome back, {user.name}.
            </p>
            <span className="mt-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
              Logged in as: {role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCreateTicket}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            {role === "admin"
              ? "Manage Tickets"
              : role === "agent"
                ? "View Assigned Tickets"
                : "+ Create Ticket"}
          </button>
        </header>

        {notice && (
          <div
            role="status"
            className="mt-5 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="ml-3 font-semibold"
            >
              Close
            </button>
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ticketStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className={`mt-3 text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-400">Live ticket data</p>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Tickets
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest support requests
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {role === "customer" ? `${tickets.length} tickets` : "Role-specific tickets"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Ticket</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Priority</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {role !== "customer" ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    Ticket listing for {role} accounts will be connected to its role-specific API next.
                  </td></tr>
                ) : ticketsLoading ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">Loading your tickets...</td></tr>
                ) : ticketsError ? (
                  <tr><td colSpan={4} role="alert" className="px-5 py-8 text-center text-red-600">{ticketsError}</td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">No tickets found. Create your first support ticket.</td></tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">{ticket.subject}</p>
                        <p className="mt-1 text-xs text-slate-400">Ticket #{ticket.id}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{ticket.category}</td>
                      <td className={`px-5 py-4 font-medium ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(ticket.status)}`}>
                          {ticket.status || "Open"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-6 text-xs text-slate-400">
          {role === "customer" ? "Ticket information is  from my database account." : "Role-specific ticket data will be connected in a later step."}
        </p>
      </main>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(() =>
    getSavedUser() ? "dashboard" : "login"
  );
  const [user, setUser] = useState(() => getSavedUser());
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  function switchPage(nextPage) {
    setPage(nextPage);
    setForm(initialForm);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (loading) return;

    if (page === "register") {
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint =
        page === "login" ? "/api/auth/login" : "/api/auth/register";

      const body =
        page === "login"
          ? { email: form.email.trim(), password: form.password }
          : {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
            };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      if (page === "register") {
        setForm(initialForm);
        setPage("login");
        setError("Account created successfully. Please sign in.");
        return;
      }

      if (!data.token || !data.user) {
        setError("Login response is incomplete. Please try again.");
        return;
      }

    
      const normalizedRole = String(data.user.role || "").trim().toLowerCase();
      if (!["customer", "agent", "admin"].includes(normalizedRole)) {
        setError(
          "Your login response does not include a valid role. Check that the backend returns the user's database role."
        );
        return;
      }

      const loggedInUser = { ...data.user, role: normalizedRole };
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(loggedInUser));

      setUser(loggedInUser);
      setForm(initialForm);
      setPage("dashboard");
    } catch {
      setError("Cannot connect to the server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    setForm(initialForm);
    setError("");
    setPage("login");
  }

  if (page === "create-ticket" && user && user.role === "customer") {
    return (
      <CreateTicket
        onBack={() => setPage("dashboard")}
        onCreated={() => {
        
        }}
      />
    );
  }

  if (page === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onCreateTicket={() => setPage("create-ticket")}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-slate-900 p-12 text-white md:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold">
                S
              </div>
              <span className="text-xl font-semibold">SupportDesk</span>
            </div>

            <h2 className="mt-20 text-4xl font-bold leading-tight">
              Customer support,
              <br />
              made simpler.
            </h2>

            <p className="mt-5 max-w-sm leading-7 text-slate-300">
              Manage tickets, track requests and keep customer conversations
              organized in one place.
            </p>
          </div>

          <p className="text-sm text-slate-400">
            Customer Support Ticket Management System
          </p>
        </section>

        <section className="flex items-center p-7 sm:p-12">
          <div className="w-full">
            <div className="mb-8 md:hidden">
              <span className="text-xl font-bold text-slate-900">
                SupportDesk
              </span>
            </div>

            <p className="text-sm font-semibold text-blue-600">
              {page === "login" ? "WELCOME BACK" : "GET STARTED"}
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              {page === "login"
                ? "Sign in to your account"
                : "Create an account"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {page === "login"
                ? "Enter your details to access your workspace."
                : "Fill in your details to get started with SupportDesk."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {page === "register" && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    page === "login" ? "current-password" : "new-password"
                  }
                  placeholder={
                    page === "login"
                      ? "Enter your password"
                      : "At least 8 characters"
                  }
                  value={form.password}
                  onChange={handleChange}
                  minLength={page === "register" ? 8 : undefined}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {page === "register" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className={`text-sm ${
                    error.startsWith("Account created")
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : page === "login"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              {page === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  switchPage(page === "login" ? "register" : "login")
                }
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                {page === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
