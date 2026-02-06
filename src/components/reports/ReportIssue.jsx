import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { courtIssueService } from "../../services/courtIssueService";
import api, { API_ENDPOINTS } from "../../services/api";

const reportIssueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export function ReportIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingReservation, setLoadingReservation] = useState(true);
  const [error, setError] = useState("");
  const [courtId, setCourtId] = useState(null);
  const [reservation, setReservation] = useState(null);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "MEDIUM",
    },
  });

  // Load reservation to get courtId
  useEffect(() => {
    const loadReservation = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.BOOKINGS_GET_BY_ID(id));
        setReservation(data);
        setCourtId(data.courtId);
      } catch (err) {
        console.error("Error loading reservation:", err);
        setError("Error loading reservation details");
      } finally {
        setLoadingReservation(false);
      }
    };

    if (id) {
      loadReservation();
    }
  }, [id]);

  const onSubmit = async (data) => {
    if (!courtId) {
      setError("Court information not available");
      return;
    }

    setError("");

    try {
      await courtIssueService.reportIssue(courtId, {
        title: data.title,
        description: data.description,
        severity: data.severity,
      });

      alert("Issue reported successfully!");
      navigate(`/reservations/${id}`);
    } catch (err) {
      setError(
        "Error reporting issue: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  if (loadingReservation) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!courtId) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Unable to load reservation</h3>
          <p className="text-gray-600 mb-6">
            Could not find the court information for this reservation.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#003f8f] hover:bg-[#002f6f] text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-gray-900">Report an Issue</h2>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Issue Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Issue Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Broken net on south basket"
                {...registerField("title")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              />
              {errors.title?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Please provide details about the issue..."
                rows={6}
                {...registerField("description")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all resize-none"
              />
              {errors.description?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Severity */}
            <div>
              <label
                htmlFor="severity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Severity
              </label>
              <select
                id="severity"
                name="severity"
                {...registerField("severity")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
              {errors.severity?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.severity.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
