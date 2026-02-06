import { useState, useEffect, useRef } from "react";
import { Bell, X, Loader, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils"; // Importing the project's utility
import {
  getNotificationReport,
  formatNotificationTime,
  getNotificationColor,
} from "../../services/notificationService";

export function NotificationsPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const panelRef = useRef(null);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchNotifications();
    }
  }, [isOpen, user?.id]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await getNotificationReport(user.id);
      setUserData({
        name: report.userName,
        email: report.userEmail,
        totalNotifications: report.totalNotifications,
      });
      setNotifications(report.notifications || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-md transition-colors",
          "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200",
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-80 sm:w-96 z-50 flex flex-col overflow-hidden",
            "bg-white rounded-xl shadow-lg border border-gray-200",
            "animate-in fade-in zoom-in-95 duration-200",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-sm text-gray-900">
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-sm opacity-70 ring-offset-white hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-500">
                <Loader className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 p-4 m-4 text-red-600 bg-red-50 rounded-md border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-gray-100 p-3 rounded-full mb-3">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium text-sm">
                  No notifications
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  You don't have any notifications at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={cn(
                      "px-4 py-3 hover:bg-gray-50/80 transition-colors cursor-pointer",
                      // Using the imported helper, but ensuring it integrates with the border logic
                      getNotificationColor(notification.type),
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium text-gray-900 text-sm capitalize">
                            {notification.type}
                          </p>
                          <time className="text-[10px] text-gray-400 whitespace-nowrap">
                            {formatNotificationTime(notification.timestamp)}
                          </time>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed break-words">
                          {notification.message.length > 140
                            ? `${notification.message.substring(0, 140)}...`
                            : notification.message}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          {/* Status Indicator */}
                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                              notification.success
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-red-50 text-red-700 border-red-100",
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                notification.success
                                  ? "bg-green-500"
                                  : "bg-red-500",
                              )}
                            />
                            {notification.success ? "Success" : "Failed"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm text-xs text-gray-500 flex justify-between items-center">
              <span>{userData?.totalNotifications || 0} Total</span>
              <span className="truncate max-w-[150px]">
                {userData?.name || user?.name}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
