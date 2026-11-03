import { useEffect, useState } from "react";
import CreateTicket from "./createTicket";
import TicketDetails from "./TicketDetails";
import LandingPage from "./LandingPage";
import { API_BASE_URL } from "./api";


const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validRoles = ["customer", "agent", "admin"];

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase().replace(/_/g, " ");
}


function getSavedUser() {
  try {
    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (!token || !savedUser) return null;

    const parsedUser = JSON.parse(savedUser);
    const role = String(parsedUser?.role || "").trim().toLowerCase();

    if (validRoles.includes(role)) {
      return { ...parsedUser, role };
    }

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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

function getTicketBreakdown(tickets, field, preferredOrder = []) {
  const counts = tickets.reduce((result, ticket) => {
    const value = String(ticket[field] || "unspecified")
      .trim()
      .toLowerCase()
      .replace(/_/g, " ");
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});

  const order = [
    ...preferredOrder.filter((value) => counts[value]),
    ...Object.keys(counts)
      .filter((value) => !preferredOrder.includes(value))
      .sort(),
  ];

  return order.map((value) => ({ value, count: counts[value] }));
}

function formatAnalyticsLabel(value) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function Breakdown({ title, items, maxCount, colors, emptyMessage }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div key={item.value}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium capitalize text-slate-600">
                  {formatAnalyticsLabel(item.value)}
                </span>
                <span className="font-semibold tabular-nums text-slate-800">
                  {item.count}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="img"
                aria-label={`${formatAnalyticsLabel(item.value)}: ${item.count} tickets`}
              >
                <div
                  className={`h-full rounded-full transition-all ${colors[item.value] || "bg-violet-500"}`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TicketAnalytics({ tickets }) {
  const [today] = useState(() => new Date());
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(12, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return {
      dateKey,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      fullDate: date.toLocaleDateString(),
      count: 0,
    };
  });

  tickets.forEach((ticket) => {
    const createdAt = new Date(ticket.created_at || ticket.createdAt);
    if (Number.isNaN(createdAt.getTime())) return;
    const dateKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}-${String(createdAt.getDate()).padStart(2, "0")}`;
    const day = week.find((item) => item.dateKey === dateKey);
    if (day) day.count += 1;
  });

  const statusBreakdown = getTicketBreakdown(tickets, "status", [
    "open",
    "in progress",
    "resolved",
    "closed",
  ]);
  const priorityBreakdown = getTicketBreakdown(tickets, "priority", [
    "urgent",
    "high",
    "medium",
    "low",
  ]);
  const maxDailyCount = Math.max(...week.map((day) => day.count), 1);
  const maxStatusCount = Math.max(...statusBreakdown.map((item) => item.count), 1);
  const maxPriorityCount = Math.max(...priorityBreakdown.map((item) => item.count), 1);
  const statusColors = {
    open: "bg-amber-500",
    "in progress": "bg-blue-600",
    resolved: "bg-green-500",
    closed: "bg-slate-500",
    unspecified: "bg-slate-400",
  };
  const priorityColors = {
    urgent: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-blue-500",
    low: "bg-slate-400",
    unspecified: "bg-slate-400",
  };

  return (
    <section className="mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Ticket Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          A live overview of ticket volume, status, and priority.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">Tickets created</h3>
              <p className="mt-1 text-sm text-slate-500">Daily activity over the last 7 days</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {week.reduce((total, day) => total + day.count, 0)} this week
            </span>
          </div>

          <div
            className="mt-6 grid h-48 grid-cols-7 gap-2 border-b border-slate-200 bg-[linear-gradient(to_bottom,transparent_24.5%,#e2e8f0_25%,transparent_25.5%,transparent_49.5%,#e2e8f0_50%,transparent_50.5%,transparent_74.5%,#e2e8f0_75%,transparent_75.5%)] sm:gap-4"
            role="img"
            aria-label={`Tickets created over the last 7 days: ${week.map((day) => `${day.fullDate}: ${day.count}`).join(", ")}`}
          >
            {week.map((day) => (
              <div
                key={day.dateKey}
                className="flex min-w-0 flex-col items-center justify-end gap-2"
                title={`${day.fullDate}: ${day.count} tickets`}
              >
                <span className="text-xs font-semibold tabular-nums text-slate-600">
                  {day.count}
                </span>
                <div className="flex h-32 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-blue-700 to-blue-500 transition-all"
                    style={{
                      height: `${day.count ? Math.max((day.count / maxDailyCount) * 100, 8) : 3}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{day.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <Breakdown
            title="By status"
            items={statusBreakdown}
            maxCount={maxStatusCount}
            colors={statusColors}
            emptyMessage="No ticket status data yet."
          />
          <Breakdown
            title="By priority"
            items={priorityBreakdown}
            maxCount={maxPriorityCount}
            colors={priorityColors}
            emptyMessage="No ticket priority data yet."
          />
        </div>
      </div>
    </section>
  );
}

function Dashboard({ user, onLogout, onCreateTicket, onViewTicket }) {
  const [notice, setNotice] = useState("");
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [assigningTicketId, setAssigningTicketId] = useState(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  const role = String(user.role || "customer").trim().toLowerCase();

  useEffect(() => {
    let cancelled = false;

    async function fetchTickets() {
      try {
        setTicketsLoading(true);
        setTicketsError("");

        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Please sign in again.");

        const headers = { Authorization: `Bearer ${token}` };

        const ticketResponse = await fetch(
          `${API_BASE_URL}/api/tickets`,
          { headers }
        );
        const ticketData = await ticketResponse.json().catch(() => ({}));

        if (!ticketResponse.ok) {
          throw new Error(
            ticketData.message || `Unable to fetch tickets (${ticketResponse.status}).`
          );
        }

        if (!cancelled) {
          setTickets(
            Array.isArray(ticketData)
              ? ticketData
              : Array.isArray(ticketData.tickets)
                ? ticketData.tickets
                : []
          );
        }

        if (role === "admin") {
          const agentResponse = await fetch(
            `${API_BASE_URL}/api/tickets/agents`,
            { headers }
          );
          const agentData = await agentResponse.json().catch(() => ({}));

          if (!agentResponse.ok) {
            throw new Error(
              agentData.message || `Unable to fetch agents (${agentResponse.status}).`
            );
          }

          if (!cancelled) {
            setAgents(Array.isArray(agentData.agents) ? agentData.agents : []);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setTicketsError(error.message || "Unable to fetch tickets.");
        }
      } finally {
        if (!cancelled) setTicketsLoading(false);
      }
    }
    fetchTickets();
    return () => { cancelled = true; };
  }, [role]);

  async function handleAssignTicket(ticketId) {
    const agentId = selectedAgents[ticketId];
    const token = sessionStorage.getItem("token");

    if (!token) {
      setAssignmentError("Please sign in again.");
      return;
    }

    if (!agentId) {
      setAssignmentError("Please select an agent first.");
      return;
    }

    setAssigningTicketId(ticketId);
    setAssignmentMessage("");
    setAssignmentError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ agentId: Number(agentId) }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Unable to assign ticket (${response.status}).`);
      }

      setTickets((currentTickets) =>
        currentTickets.filter((ticket) => Number(ticket.id) !== Number(ticketId))
      );
      setSelectedAgents((current) => {
        const updated = { ...current };
        delete updated[ticketId];
        return updated;
      });
      setAssignmentMessage(`Ticket #${ticketId} assigned successfully.`);
    } catch (error) {
      setAssignmentError(error.message || "Unable to assign ticket.");
    } finally {
      setAssigningTicketId(null);
    }
  }

  async function handleStatusChange(ticketId, nextStatus) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setStatusError("Please sign in again.");
      return;
    }

    setUpdatingTicketId(ticketId);
    setStatusMessage("");
    setStatusError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Unable to update status (${response.status}).`);
      }

      const updatedTicket = data.ticket;
      setTickets((currentTickets) => currentTickets.map((ticket) =>
        Number(ticket.id) === Number(ticketId)
          ? { ...ticket, ...(updatedTicket || {}), status: updatedTicket?.status || nextStatus }
          : ticket
      ));
      setStatusMessage(`Ticket #${ticketId} status updated successfully.`);
    } catch (error) {
      setStatusError(error.message || "Unable to update ticket status.");
    } finally {
      setUpdatingTicketId(null);
    }
  }

  const ticketStats = [
    { label: "Total Tickets", value: tickets.length, color: "text-blue-600" },
    {
      label: "Open Tickets",
      value: tickets.filter((ticket) => normalizeStatus(ticket.status) === "open")
        .length,
      color: "text-amber-600",
    },
    {
      label: "In Progress",
      value: tickets.filter(
        (ticket) => normalizeStatus(ticket.status) === "in progress"
      ).length,
      color: "text-violet-600",
    },
    {
      label: "Resolved",
      value: tickets.filter(
        (ticket) => normalizeStatus(ticket.status) === "resolved"
      ).length,
      color: "text-green-600",
    },
  ];

  function getStatusStyle(status) {
    const styles = {
      open: "bg-amber-100 text-amber-700",
      "in progress": "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-slate-100 text-slate-700",
    };
    return styles[normalizeStatus(status)] || "bg-slate-100 text-slate-700";
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
      setActiveSection("tickets");
      setNotice("");
    } else if (role === "agent") {
      // Agents should be taken to their role-filtered assigned tickets list.
      setActiveSection("tickets");
      setNotice("");
    } else {
      onCreateTicket();
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="grid w-full grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-1 bg-slate-950 px-3 py-2 text-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:self-start md:bg-slate-900 md:p-0">
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-2 border-0 px-1 py-1 md:w-full md:gap-3 md:border-b md:border-slate-700 md:px-6 md:py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold md:h-10 md:w-10 md:text-xl">
            S
          </div>
          <span className="truncate text-base font-semibold md:text-xl">SupportDesk</span>
        </div>

        <div className="hidden min-w-0 items-center gap-3 border-0 px-1 py-1 md:flex md:w-full md:justify-self-auto md:border-b md:border-slate-700 md:px-5 md:py-4">
          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold uppercase text-blue-200 md:h-10 md:w-10 md:text-sm"
          >
            {String(user.name || role).charAt(0)}
          </div>
          <div className="min-w-0 md:flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="mt-0.5 hidden truncate text-xs text-slate-400 md:block">{user.email}</p>
            <span className="mt-1 hidden rounded-full bg-blue-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-300 md:mt-2 md:inline-flex">
              {role}
            </span>
          </div>
        </div>

        <nav className="col-span-2 row-start-2 flex min-w-0 gap-2 p-0 md:flex-1 md:flex-col md:p-4">
          <button
            type="button"
            onClick={() => {
              setActiveSection("dashboard");
              setNotice("");
            }}
            className={`flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-medium md:w-full md:flex-none md:justify-start md:gap-3 md:px-4 md:py-3 md:text-base ${
              activeSection === "dashboard"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span aria-hidden="true">▦</span> Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSection("tickets");
              setNotice("");
            }}
            className={`flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-medium md:w-full md:flex-none md:justify-start md:gap-3 md:px-4 md:py-3 md:text-base ${
              activeSection === "tickets"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span aria-hidden="true">▤</span> Tickets
          </button>
        </nav>

        <div className="col-start-2 row-start-1 border-0 p-0 md:mt-auto md:w-full md:border-t md:border-slate-700 md:p-4">
          <button
            type="button"
            onClick={onLogout}
            className="min-h-10 w-auto whitespace-nowrap rounded-lg border border-slate-600 px-2 py-2 text-xs hover:bg-slate-800 md:mt-4 md:w-full md:px-4 md:text-sm"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Workspace / {activeSection === "tickets" ? (role === "agent" ? "Assigned Tickets" : "Tickets") : "Dashboard"}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {activeSection === "tickets" ? (role === "agent" ? "Assigned Tickets" : "All Tickets") : getDashboardTitle(role)}
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
            className="min-h-11 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
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

        {activeSection === "dashboard" && (
        <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 xl:grid-cols-4">
          {ticketStats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className={`mt-3 text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-400">Live ticket data</p>
            </div>
          ))}
        </section>
        )}

        {role === "admin" && activeSection === "dashboard" && !ticketsLoading && !ticketsError && (
          <TicketAnalytics tickets={tickets} />
        )}

        {statusMessage && (
          <p role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {statusMessage}
          </p>
        )}
        {statusError && (
          <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {statusError}
          </p>
        )}
        {assignmentMessage && (
          <p role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {assignmentMessage}
          </p>
        )}
        {assignmentError && (
          <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {assignmentError}
          </p>
        )}

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {activeSection === "tickets"
                  ? role === "agent" ? "Assigned Tickets" : "All Tickets"
                  : role === "admin"
                    ? "All Support Tickets"
                    : "Recent Tickets"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {activeSection === "tickets"
                  ? role === "admin"
                    ? "All tickets across the system"
                    : role === "agent"
                      ? "All tickets assigned to you"
                      : "All tickets created by your account"
                  : role === "admin"
                    ? "Overview of all customer support requests"
                    : "Latest support requests"}
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {role === "customer"
                ? `${tickets.length} tickets`
                : role === "agent"
                  ? `${tickets.length} assigned tickets`
                  : `${tickets.length} tickets`}
            </span>
          </div>

          <p className="border-b border-slate-100 px-5 py-2 text-xs text-slate-400 sm:hidden">
            Swipe horizontally to see all ticket details.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Ticket</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Priority</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  {role === "admin" && (
                    <th className="px-5 py-4 font-medium">Assign Agent</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {ticketsLoading ? (
                  <tr>
                    <td colSpan={role === "admin" ? 5 : 4} className="px-5 py-8 text-center text-slate-500">
                      Loading tickets...
                    </td>
                  </tr>
                ) : ticketsError ? (
                  <tr>
                    <td colSpan={role === "admin" ? 5 : 4} role="alert" className="px-5 py-8 text-center text-red-600">
                      {ticketsError}
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={role === "admin" ? 5 : 4} className="px-5 py-8 text-center text-slate-500">
                      {role === "admin"
                        ? "There are no tickets in the system yet."
                        : role === "agent"
                          ? "No tickets have been assigned to you yet."
                          : "No tickets found. Create your first support ticket."}
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => onViewTicket(ticket.id)}
                          className="text-left font-medium text-blue-600 hover:underline"
                        >
                          {ticket.subject || "Untitled ticket"}
                        </button>
                        <p className="mt-1 text-xs text-slate-400">
                          Ticket #{ticket.id}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {ticket.category || "—"}
                      </td>
                      <td className={`px-5 py-4 font-medium ${getPriorityStyle(ticket.priority)}`}>
                        {ticket.priority || "—"}
                      </td>
                      <td className="px-5 py-4">
                        {role === "agent" ? (
                          <select
                            aria-label={`Update status for ticket ${ticket.id}`}
                            value={normalizeStatus(ticket.status) || "open"}
                            onChange={(event) => handleStatusChange(ticket.id, event.target.value)}
                            disabled={updatingTicketId === ticket.id}
                            className={`rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 disabled:opacity-60 ${getStatusStyle(ticket.status)}`}
                          >
                            <option value="open">Open</option>
                            <option value="in progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(ticket.status)}`}>
                            {ticket.status || "Open"}
                          </span>
                        )}
                      </td>
                      {role === "admin" && (
                        <td className="px-5 py-4">
                          <div className="flex min-w-64 items-center gap-2">
                            <select
                              aria-label={`Select agent for ticket ${ticket.id}`}
                              value={selectedAgents[ticket.id] || ticket.assigned_agent_id || ""}
                              onChange={(event) =>
                                setSelectedAgents((current) => ({
                                  ...current,
                                  [ticket.id]: event.target.value,
                                }))
                              }
                              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                            >
                              <option value="">Select agent</option>
                              {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                  {agent.name} ({agent.email})
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAssignTicket(ticket.id)}
                              disabled={!selectedAgents[ticket.id] || assigningTicketId === ticket.id}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {assigningTicketId === ticket.id ? "Assigning..." : "Assign"}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-6 text-xs text-slate-400">
          {role === "customer"
            ? "Showing tickets created by your account."
            : role === "agent"
              ? "Showing tickets assigned to your account."
              : "Showing all tickets available to your role."}
        </p>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(getSavedUser);
  const [page, setPage] = useState(() => (user ? "dashboard" : "home"));
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

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

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      if (!validRoles.includes(normalizedRole)) {
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
    setPage("home");
  }

  if (page === "create-ticket" && user && user.role === "customer") {
    return (
      <CreateTicket
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "ticket-details" && user) {
  return (
    <TicketDetails
      ticketId={selectedTicketId}
      onBack={() => setPage("dashboard")}
    />
  );
}

  if (page === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onCreateTicket={() => setPage("create-ticket")}
        onViewTicket={(ticketId) => {
          setSelectedTicketId(ticketId);
          setPage("ticket-details");
        }}
      />
    );
  }

  if (page === "home") {
    return (
      <LandingPage
        onLogin={() => switchPage("login")}
        onSignup={() => switchPage("register")}
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
            <button
              type="button"
              onClick={() => switchPage("home")}
              className="mb-8 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              ← Back to SupportDesk
            </button>

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
