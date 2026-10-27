
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/tickets";

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          setError("Please log in again to view this ticket.");
          return;
        }

        const response = await fetch(`${API_URL}/${ticketId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
            View the information for your support ticket.
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
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm text-gray-500">
                  Ticket ID: #{ticket.id}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  {ticket.subject || "Untitled ticket"}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Category"
                  value={ticket.category}
                />

                <InfoItem
                  label="Priority"
                  value={ticket.priority}
                />

                <InfoItem
                  label="Status"
                  value={ticket.status}
                />

                <InfoItem
                  label="Created At"
                  value={formatDate(ticket.created_at)}
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Description
                </h3>
                <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 leading-7 text-gray-700">
                  {ticket.description || "No description provided."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
