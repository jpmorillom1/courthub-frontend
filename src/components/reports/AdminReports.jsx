import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { courtIssueService } from "../../services/courtIssueService";
import { ReportsPageSkeleton } from "../common/skeletons/ReportsPageSkeleton";

export function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await courtIssueService.getAllPendingIssues();
        setReports(data);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      case "LOW":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "Critical";
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
      default:
        return severity;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CLOSED":
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "REPORTED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "REPORTED":
        return "Reported";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "REPORTED":
        return "IN_PROGRESS";
      case "IN_PROGRESS":
        return "RESOLVED";
      case "RESOLVED":
        return "CLOSED";
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus) => {
    const next = getNextStatus(currentStatus);
    return next ? getStatusLabel(next) : null;
  };

  if (loading) {
    return <ReportsPageSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-gray-900">Reports & Issues</h2>
        <p className="text-gray-600 mt-1">Manage and track facility issues</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Court
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                  Issue
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">
                  Severity
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const nextStatus = getNextStatus(report.status);
                  const nextLabel = getNextStatusLabel(report.status);

                  return (
                    <tr
                      key={report.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900">
                        Court ID:{" "}
                        {report.courtId
                          ? report.courtId.substring(0, 8)
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {report.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs ${getSeverityColor(report.severity)}`}
                        >
                          {getSeverityLabel(report.severity)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}
                        >
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {nextStatus ? (
                          <button
                            onClick={async () => {
                              try {
                                await courtIssueService.updateIssueStatus(
                                  report.id,
                                  { status: nextStatus },
                                );
                                const updated =
                                  await courtIssueService.getAllPendingIssues();
                                setReports(updated);
                              } catch (error) {
                                alert(
                                  "Error updating report: " +
                                    (error.response?.data?.message ||
                                      error.message),
                                );
                              }
                            }}
                            className="px-4 py-2 text-sm bg-[#003f8f] hover:bg-[#002f6f] text-white rounded-lg transition-colors"
                          >
                            Mark as {nextLabel}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
