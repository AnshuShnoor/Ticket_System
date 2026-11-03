
import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "./api";

const TICKET_API = `${API_BASE_URL}/api/tickets`;
const MESSAGE_API = `${API_BASE_URL}/api/messages`;
const ACTIVITY_API = `${API_BASE_URL}/api/activity`;

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 break-words font-semibold text-slate-800">
        {value || "Not available"}
      </p>
    </div>
  );
}

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Activity History States
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");

  const getToken = () => sessionStorage.getItem("token");

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error("Please log in again to view this ticket.");
        }

        const response = await fetch(`${TICKET_API}/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load ticket.");
        }

        setTicket(data.ticket || data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    } else {
      setError("Ticket ID is missing.");
      setLoading(false);
    }
  }, [ticketId]);

  // Fetch conversation messages
  const fetchMessages = useCallback(async () => {
    try {
      setMessagesLoading(true);
      setMessagesError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${MESSAGE_API}/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load messages.");
      }

      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (err) {
      setMessagesError(err.message || "Unable to load messages.");
    } finally {
      setMessagesLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) {
      fetchMessages();
    }
  }, [ticketId, fetchMessages]);

  // Fetch ticket activity history
  const fetchActivities = useCallback(async () => {
    try {
      setActivityLoading(true);
      setActivityError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${ACTIVITY_API}/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load ticket activity."
        );
      }

      setActivities(
        Array.isArray(data.activities) ? data.activities : []
      );
    } catch (err) {
      setActivityError(
        err.message || "Unable to load ticket activity."
      );
    } finally {
      setActivityLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) {
      fetchActivities();
    }
  }, [ticketId, fetchActivities]);

  // Send a new message
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage || sending) return;

    try {
      setSending(true);
      setSendError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${MESSAGE_API}/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send message.");
      }

      if (data.newMessage) {
        setMessages((previous) => [...previous, data.newMessage]);
      } else {
        await fetchMessages();
      }

      setNewMessage("");
    } catch (err) {
      setSendError(err.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Not available";
    }

    return parsed.toLocaleString();
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusStyle = (status) => {
    const styles = {
      open: "bg-amber-100 text-amber-800 ring-amber-200",
      "in progress": "bg-blue-100 text-blue-800 ring-blue-200",
      resolved: "bg-green-100 text-green-800 ring-green-200",
      closed: "bg-slate-100 text-slate-700 ring-slate-200",
    };
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase()
      .replace(/_/g, " ");
    return styles[normalizedStatus] || "bg-slate-100 text-slate-700 ring-slate-200";
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      low: "bg-slate-100 text-slate-700 ring-slate-200",
      medium: "bg-blue-100 text-blue-800 ring-blue-200",
      high: "bg-orange-100 text-orange-800 ring-orange-200",
      urgent: "bg-red-100 text-red-800 ring-red-200",
    };
    return styles[String(priority || "").trim().toLowerCase()] ||
      "bg-slate-100 text-slate-700 ring-slate-200";
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </button>

        <header className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            SupportDesk / Tickets
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Ticket Details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View your ticket information and communicate with support.
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            <span className="mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            Loading ticket details...
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && ticket && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-900 px-6 py-6 text-white sm:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-blue-300">
                      Ticket #{ticket.id}
                    </p>
                    <h2 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                      {ticket.subject || "Untitled ticket"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(ticket.status)}`}>
                      {formatValue(ticket.status)}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getPriorityStyle(ticket.priority)}`}>
                      {formatValue(ticket.priority)} priority
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoItem label="Category" value={ticket.category} />
                  <InfoItem label="Priority" value={ticket.priority} />
                  <InfoItem label="Status" value={formatValue(ticket.status)} />
                  <InfoItem label="Created At" value={formatDate(ticket.created_at)} />
                </div>

                <div className="mt-7">
                  <h3 className="text-base font-semibold text-slate-900">Description</h3>
                  <p className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700 sm:p-5">
                    {ticket.description || "No description provided."}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Activity History</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Track all updates made to this ticket.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchActivities}
                  disabled={activityLoading}
                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {activityLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {activityLoading && (
                <p className="mt-5 text-sm text-slate-600">Loading activity history...</p>
              )}

              {activityError && (
                <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {activityError}
                  <button
                    type="button"
                    onClick={fetchActivities}
                    className="ml-2 font-semibold underline underline-offset-2"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!activityLoading && !activityError && activities.length === 0 && (
                <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No activity history available yet.
                </p>
              )}

              {!activityLoading && !activityError && activities.length > 0 && (
                <div className="mt-6 space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="relative border-l-2 border-blue-200 pb-1 pl-5 last:pb-0"
                    >
                      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-blue-500 bg-white" />
                      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold text-slate-900">{activity.action}</h3>
                          <span className="text-xs text-slate-500">
                            {formatDate(activity.created_at)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          Performed by:{" "}
                          <span className="font-semibold text-slate-800">
                            {activity.actor_name || `User #${activity.actor_id}`}
                          </span>
                        </p>

                        {(activity.old_value !== null || activity.new_value !== null) && (
                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Previous Value
                              </p>
                              <p className="mt-1 font-medium text-slate-700">
                                {formatValue(activity.old_value)}
                              </p>
                            </div>
                            <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                New Value
                              </p>
                              <p className="mt-1 font-medium text-slate-800">
                                {formatValue(activity.new_value)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ticket Conversation</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Messages related to this support ticket.
                </p>
              </div>

              {messagesLoading && (
                <p className="mt-4 text-sm text-slate-600">Loading messages...</p>
              )}

              {messagesError && (
                <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {messagesError}
                  <button
                    type="button"
                    onClick={fetchMessages}
                    className="ml-2 font-semibold underline underline-offset-2"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!messagesLoading && !messagesError && messages.length === 0 && (
                <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  No messages yet. Start the conversation below.
                </p>
              )}

              <div className="mt-5 space-y-3">
                {messages.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                        Sender ID: {item.sender_id}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words leading-6 text-slate-700">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-6 border-t border-slate-200 pt-5">
                <label
                  htmlFor="ticket-message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Write a message
                </label>
                <textarea
                  id="ticket-message"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  maxLength={5000}
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  disabled={sending}
                />

                {sendError && (
                  <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                    {sendError}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">{newMessage.length}/5000 characters</p>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default TicketDetails;
