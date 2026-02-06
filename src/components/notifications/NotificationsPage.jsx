import { useState, useEffect } from "react";
import { useAuth } from "../../store/authStore";
import {
  getNotificationReport,
  formatNotificationTime,
  getNotificationColor,
} from "../../services/notificationService";
import {
  AlertCircle,
  Loader,
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  AtSign,
  Bell,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { NotificationPageSkeleton } from "../common/skeletons/NotificationSkeleton";

export function NotificationsPage() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, successful, failed

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationReport(user.id);
      setReport(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredNotifications = () => {
    if (!report?.notifications) return [];

    switch (filter) {
      case "successful":
        return report.notifications.filter((n) => n.success);
      case "failed":
        return report.notifications.filter((n) => !n.success);
      default:
        return report.notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return <NotificationPageSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view your notification history.
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            "bg-gray-900 text-white hover:bg-gray-800", // Fallback if primary not defined
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* User Info Card */}
      {report && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              User Statistics
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-base font-semibold text-gray-900 mt-0.5">
                  {report.userName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <AtSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base font-semibold text-gray-900 mt-0.5">
                  {report.userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Notifications
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {report.totalNotifications}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      {!error && report?.notifications && report.notifications.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-100/80 p-1 rounded-lg inline-flex w-full sm:w-auto self-start">
            {[
              { id: "all", label: "All", count: report.notifications.length },
              {
                id: "successful",
                label: "Successful",
                count: report.notifications.filter((n) => n.success).length,
              },
              {
                id: "failed",
                label: "Failed",
                count: report.notifications.filter((n) => !n.success).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-none",
                  filter === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "ml-1.5 py-0.5 px-2 rounded-full text-xs",
                    filter === tab.id
                      ? "bg-gray-100 text-gray-900"
                      : "bg-gray-200 text-gray-600",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No notifications found
                </h3>
                <p className="text-gray-500 mt-1">
                  {filter === "all" && "You have no notification history."}
                  {filter === "successful" &&
                    "You have no successful notifications."}
                  {filter === "failed" && "You have no failed notifications."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={cn(
                    "group bg-white rounded-lg border border-gray-200 p-5 transition-all hover:shadow-md",
                    // Using the notification color helper but applying it as a left border accent
                    "border-l-4",
                    getNotificationColor(notification.type),
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 capitalize">
                          {notification.type}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                          {notification.channel}
                        </span>

                        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                          {notification.success ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Sent
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                              <XCircle className="w-3.5 h-3.5" />
                              Failed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="mb-3">
                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed font-normal">
                          {notification.message}
                        </p>
                      </div>

                      {/* Error Message if exists */}
                      {notification.errorMessage && (
                        <div className="mt-3 mb-3 p-3 bg-red-50 border border-red-100 rounded-md">
                          <p className="text-xs text-red-800 font-medium">
                            Error:{" "}
                            <span className="font-normal">
                              {notification.errorMessage}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
                        <time className="font-medium text-gray-600">
                          {new Date(notification.timestamp).toLocaleString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </time>
                        <span className="text-gray-300">|</span>
                        <span className="font-mono text-[10px] text-gray-400">
                          ID: {notification.notificationId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
