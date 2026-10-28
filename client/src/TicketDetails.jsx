
import { useEffect, useState, useCallback } from "react";

const TICKET_API = "http://localhost:5000/api/tickets";
const MESSAGE_API = "http://localhost:5000/api/messages";

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

  const getToken = () => sessionStorage.getItem("token");

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError("Please log in again to view this ticket.");
          return;
        }

        const response = await fetch(`${TICKET_API}/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load ticket.");
        }

        setTicket(data.ticket);
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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString();
  };

  const InfoItem = ({ label, value }) => (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 break-words font-medium text-gray-800">
        {value || "Not available"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Ticket Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your ticket information and communicate with support.
          </p>

          {loading && (
            <p className="mt-6 text-gray-600">Loading ticket details...</p>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && ticket && (
            <div className="mt-6 space-y-8">
              <section>
                <p className="text-sm text-gray-500">
                  Ticket ID: #{ticket.id}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  {ticket.subject || "Untitled ticket"}
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem label="Category" value={ticket.category} />
                  <InfoItem label="Priority" value={ticket.priority} />
                  <InfoItem label="Status" value={ticket.status} />
                  <InfoItem
                    label="Created At"
                    value={formatDate(ticket.created_at)}
                  />
                </div>

                <h3 className="mt-6 font-semibold text-gray-800">
                  Description
                </h3>

                <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 leading-7 text-gray-700">
                  {ticket.description || "No description provided."}
                </p>
              </section>

              <section className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Ticket Conversation
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Messages related to this support ticket.
                </p>

                {messagesLoading && (
                  <p className="mt-4 text-gray-600">
                    Loading messages...
                  </p>
                )}

                {messagesError && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {messagesError}
                    <button
                      type="button"
                      onClick={fetchMessages}
                      className="ml-2 font-semibold underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {!messagesLoading &&
                  !messagesError &&
                  messages.length === 0 && (
                    <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                      No messages yet. Start the conversation below.
                    </p>
                  )}

                <div className="mt-4 space-y-3">
                  {messages.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          Sender ID: {item.sender_id}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatDate(item.created_at)}
                        </p>
                      </div>

                      <p className="mt-2 whitespace-pre-wrap break-words text-gray-700">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-5">
                  <label
                    htmlFor="ticket-message"
                    className="mb-2 block text-sm font-medium text-gray-700"
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
                    className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    disabled={sending}
                  />

                  {sendError && (
                    <p className="mt-2 text-sm text-red-600">
                      {sendError}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      {newMessage.length}/5000 characters
                    </p>

                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
