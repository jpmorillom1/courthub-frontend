import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft } from 'lucide-react';
import { CourtCard3D } from './CourtCard3D';
import { bookingService } from '../../services/bookingService';

export function BookingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar deportes al montar
  useEffect(() => {
    const loadSports = async () => {
      const data = await bookingService.getSports();
      setSports(data);
    };
    loadSports();
  }, []);

  // Cargar canchas cuando se selecciona un deporte
  useEffect(() => {
    if (selectedSport) {
      const loadCourts = async () => {
        const data = await bookingService.getCourts(selectedSport);
        setCourts(data);
      };
      loadCourts();
    }
  }, [selectedSport]);

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSelectedCourt(null);
    setSelectedTime(null);
    setStep(2);
  };

  const handleCourtSelect = (court) => {
    if (court.available) {
      setSelectedCourt(court);
      setStep(3);
      // Cargar time slots para los próximos 7 días
      const loadTimeSlots = async () => {
        const slots = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dayData = await bookingService.getTimeSlots(date.toISOString());
          slots.push(dayData);
        }
        setTimeSlots(slots);
      };
      loadTimeSlots();
    }
  };

  const handleTimeSelect = (day, time) => {
    setSelectedTime({ day, time });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      await bookingService.createReservation({
        userId: user?.id || '2',
        sport: selectedSport,
        courtId: selectedCourt.id,
        courtName: selectedCourt.name,
        date: new Date().toISOString().split('T')[0],
        time: selectedTime.time,
        duration: 2,
      });

      alert(
        `Reservation confirmed!\nSport: ${selectedSport}\nCourt: ${selectedCourt?.name}\nTime: ${selectedTime?.day} at ${selectedTime?.time}`
      );
      navigate('/reservations');
    } catch (error) {
      alert('Error creating reservation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock unavailable slots
  const unavailableSlots = new Set(['Tue-10:00', 'Tue-14:00', 'Wed-12:00', 'Thu-16:00', 'Sat-18:00']);

  return (
    <div className="p-6">
      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s, index) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step >= s ? 'bg-[#cbab42] text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? <Check className="w-6 h-6" /> : s}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {s === 1 ? 'Select Sport' : s === 2 ? 'Select Court' : 'Select Time'}
                </p>
              </div>
              {index < 2 && (
                <div
                  className={`h-1 flex-1 mx-4 transition-all ${
                    step > s ? 'bg-[#cbab42]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Sport Selection */}
      {step === 1 && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-gray-900 mb-2">Choose Your Sport</h2>
            <p className="text-gray-600">Select the sport you want to play</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sports.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Loading sports...</p>
              </div>
            ) : (
              sports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => handleSportSelect(sport.id)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-[#cbab42]"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-gray-900 text-center">{sport.name}</h3>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Step 2: Court Selection */}
      {step === 2 && selectedSport && (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Sports
            </button>
            <div className="text-center">
              <h2 className="text-gray-900 mb-2">Select a Court</h2>
              <p className="text-gray-600">Choose an available {selectedSport} court</p>
            </div>
            <div className="w-24" />
          </div>

          {/* Visualización 3D de las canchas */}
          <div className="mb-8">
            <CourtCard3D
              courts={courts}
              selectedCourt={selectedCourt}
              onCourtSelect={handleCourtSelect}
              sport={selectedSport}
            />
          </div>

          {/* Lista de canchas como referencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courts.map((court) => (
              <button
                key={court.id}
                onClick={() => handleCourtSelect(court)}
                disabled={!court.available}
                className={`relative bg-white rounded-xl p-6 shadow-md transition-all ${
                  court.available
                    ? 'hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#cbab42] cursor-pointer'
                    : 'opacity-50 cursor-not-allowed border-2 border-gray-200'
                } ${
                  selectedCourt?.id === court.id
                    ? 'border-2 border-[#cbab42] bg-[#cbab42]/5'
                    : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#003f8f] to-[#0052b8] rounded-xl flex items-center justify-center text-white">
                    <span className="text-2xl">
                      {selectedSport === 'soccer' ? '⚽' : selectedSport === 'basketball' ? '🏀' : '🏐'}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-gray-900 font-semibold mb-1">{court.name}</h3>
                    <p className={`text-sm ${court.available ? 'text-green-600' : 'text-red-600'}`}>
                      {court.available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>

                {selectedCourt?.id === court.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#cbab42] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Time Selection */}
      {step === 3 && selectedCourt && (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Courts
            </button>
            <div className="text-center">
              <h2 className="text-gray-900 mb-2">Select Date & Time</h2>
              <p className="text-gray-600">{selectedCourt.name}</p>
            </div>
            <div className="w-24" />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4 mb-8">
              {timeSlots.map((dayData) => (
                <div key={dayData.day} className="text-center">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-gray-900">{dayData.day}</p>
                    <p className="text-gray-500 text-sm">{dayData.month || 'Dec'} {dayData.date}</p>
                  </div>

                  <div className="space-y-2">
                    {dayData.slots.map((time) => {
                      const slotKey = `${dayData.day}-${time}`;
                      const isUnavailable = unavailableSlots.has(slotKey);
                      const isSelected = selectedTime?.day === dayData.day && selectedTime?.time === time;

                      return (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(dayData.day, time)}
                          disabled={isUnavailable}
                          className={`w-full px-3 py-2 rounded-lg text-sm transition-all ${
                            isSelected
                              ? 'bg-[#cbab42] text-white'
                              : isUnavailable
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-50 text-gray-700 hover:bg-[#cbab42]/10 hover:text-[#cbab42]'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            {selectedTime && (
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-4 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  {loading ? 'Confirming...' : 'Confirm Reservation'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

