import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Eye } from "lucide-react";
import { ReservationListSkeleton } from "../common/skeletons/ReservationCardSkeleton";
import { useMyReservations } from "../../hooks/queryHooks";

export function MyReservations() {
  const userId = useMemo(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return user?.id || "2";
  }, []);

  const { data: reservations = [], isLoading } = useMyReservations(userId);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const isReservationPast = (reservation) => {
    const [year, month, day] = reservation.date.split("-").map(Number);
    const [hours, minutes] = reservation.time.split(":").map(Number);

    const reservationDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(reservationDate);
    endDate.setHours(endDate.getHours() + reservation.duration);

    return endDate < new Date();
  };

  const getSportImage = (sport) => {
    const images = {
      basketball:
        "https://images.unsplash.com/photo-1710378844976-93a6538671ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnQlMjBpbmRvb3J8ZW58MXx8fHwxNzY2NTI0MTA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      soccer:
        "https://images.unsplash.com/photo-1641029185333-7ed62a19d5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZCUyMGFlcmlhbHxlbnwxfHx8fDE3NjY1MjQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      volleyball:
        "https://images.unsplash.com/photo-1671706466693-28fb04684694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xsZXliYWxsJTIwY291cnQlMjBzcG9ydHxlbnwxfHx8fDE3NjY1MjQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    };
    return images[sport] || images.basketball;
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time, duration) => {
    const [hours, minutes] = time.split(":");
    const start = new Date();
    start.setHours(parseInt(hours), parseInt(minutes), 0);

    const end = new Date(start);
    end.setHours(end.getHours() + duration);

    return `${start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const validReservations = reservations.filter(
    (r) => r.status !== "pending_payment" && r.status !== "payment_failed",
  );

  const upcomingReservations = validReservations.filter(
    (r) => r.status === "confirmed" && !isReservationPast(r),
  );
  const pastReservations = validReservations.filter(
    (r) =>
      r.status === "cancelled" ||
      (r.status === "confirmed" && isReservationPast(r)),
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
          <ReservationListSkeleton count={3} />
        </div>

        <div>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <ReservationListSkeleton count={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Quick Action */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Your Reservations</h2>
          <p className="text-gray-600 mt-1">
            Manage your upcoming and past bookings
          </p>
        </div>
        <Link
          to="/booking"
          className="px-6 py-3 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-lg transition-colors"
        >
          New Reservation
        </Link>
      </div>

      {/* Upcoming Reservations */}
      <div>
        <h3 className="text-gray-900 mb-4">Upcoming</h3>
        {upcomingReservations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No upcoming reservations
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={getSportImage(reservation.sport)}
                    alt={reservation.sport}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-gray-900 mb-1 capitalize">
                        {reservation.sport}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.courtName}</span>
                      </div>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(reservation.time, reservation.duration)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/reservations/${reservation.id}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#003f8f] hover:bg-[#002f6f] text-white rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Reservations */}
      <div>
        <h3 className="text-gray-900 mb-4">Past & Cancelled</h3>
        {pastReservations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No past reservations</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={getSportImage(reservation.sport)}
                    alt={reservation.sport}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-gray-900 mb-1 capitalize">
                        {reservation.sport}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.courtName}</span>
                      </div>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(reservation.time, reservation.duration)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/reservations/${reservation.id}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
