import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft, AlertCircle } from 'lucide-react';
import { bookingService } from '../../services/bookingService';

export function ReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const data = await bookingService.getReservationById(id);
        setReservation(data);
      } catch (error) {
        console.error('Error loading reservation:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadReservation();
    }
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time, duration) => {
    const [hours, minutes] = time.split(':');
    const start = new Date();
    start.setHours(parseInt(hours), parseInt(minutes), 0);

    const end = new Date(start);
    end.setHours(end.getHours() + duration);

    return `${start.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })} - ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-100 text-green-700">
            Confirmed
          </span>
        );
      case 'past':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700">
            Past
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-red-100 text-red-700">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading reservation details...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Reservation not found</h3>
          <p className="text-gray-600 mb-6">The reservation you're looking for doesn't exist.</p>
          <Link
            to="/reservations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#003f8f] hover:bg-[#002f6f] text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reservations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/reservations"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h2 className="text-gray-900">Reservation Details</h2>
          </div>
          {getStatusBadge(reservation.status)}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Sport and Court */}
            <div>
              <h3 className="text-gray-900 text-xl mb-4 capitalize">{reservation.sport}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{reservation.courtName}</span>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#003f8f]/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#003f8f]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-gray-900 font-semibold">{formatDate(reservation.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#cbab42]/10 rounded-lg">
                  <Clock className="w-5 h-5 text-[#cbab42]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="text-gray-900 font-semibold">
                    {formatTime(reservation.time, reservation.duration)}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Duration</p>
              <p className="text-gray-900 font-semibold">{reservation.duration} hours</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {reservation.status === 'confirmed' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/reservations/${reservation.id}/report`}
                className="flex-1 min-w-[200px] px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-center"
              >
                Report an Issue
              </Link>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to cancel this reservation?')) {
                    try {
                      await bookingService.cancelReservation(reservation.id);
                      navigate('/reservations');
                    } catch (error) {
                      alert('Error cancelling reservation: ' + error.message);
                    }
                  }
                }}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

