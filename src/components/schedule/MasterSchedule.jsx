import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { bookingService } from '../../services/bookingService';

const hours = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

export function MasterSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setLoading(true);
        const { bookings: loadedBookings, courts: loadedCourts } = await bookingService.getMasterScheduleData(currentDate);
        setBookings(loadedBookings);
        setCourts(loadedCourts.length > 0 ? loadedCourts : [
          'Soccer Field 1',
          'Basketball Court 1',
          'Basketball Court 2',
          'Tennis Court 1',
          'Volleyball Court',
        ]);
      } catch (err) {
        console.error('Error loading schedule data:', err);
        setError('Failed to load schedule data');
        setCourts([
          'Soccer Field 1',
          'Basketball Court 1',
          'Basketball Court 2',
          'Tennis Court 1',
          'Volleyball Court',
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, [currentDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getBookingWidth = (startTime, endTime) => {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    return end - start;
  };

  const getBookingPosition = (startTime) => {
    const hour = parseInt(startTime.split(':')[0]);
    return hour - 8; // 8 AM is position 0
  };

  const getStatusColor = (status) => {
    return 'bg-green-500 border-green-600 text-white';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateDay('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900">{formatDate(currentDate)}</span>
          </div>

          <button
            onClick={() => navigateDay('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-sm text-gray-600">Status Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-gray-700">Confirmed</span>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading schedule...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="min-w-[1200px]">
            {/* Time headers */}
            <div className="flex mb-4">
              <div className="w-48 flex-shrink-0" />
              <div className="flex-1 flex">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 text-center text-xs text-gray-600 border-l border-gray-200 first:border-l-0"
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </div>

            {/* Court rows */}
            {courts.map((court) => {
              const courtBookings = bookings.filter((b) => b.court === court);

              return (
                <div key={court} className="flex mb-2 relative h-20">
                  {/* Court name */}
                  <div className="w-48 flex-shrink-0 pr-4 flex items-center">
                    <span className="text-gray-900">{court}</span>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 relative border border-gray-200 rounded-lg bg-gray-50">
                    {/* Hour dividers */}
                    {hours.map((hour, index) => (
                      <div
                        key={hour}
                        className="absolute top-0 bottom-0 border-l border-gray-200"
                        style={{ left: `${(index / hours.length) * 100}%` }}
                      />
                    ))}

                    {/* Bookings */}
                    {courtBookings.map((booking) => {
                      const position = getBookingPosition(booking.startTime);
                      const width = getBookingWidth(booking.startTime, booking.endTime);
                      const widthPercent = (width / hours.length) * 100;
                      const leftPercent = (position / hours.length) * 100;

                      return (
                        <div
                          key={booking.id}
                          className={`absolute top-2 bottom-2 px-3 py-2 rounded-lg border-2 ${getStatusColor(booking.status)} cursor-pointer hover:opacity-90 transition-opacity flex flex-col justify-center overflow-hidden`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                        >
                          <p className="text-xs truncate">{booking.user}</p>
                          <p className="text-xs opacity-80">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

