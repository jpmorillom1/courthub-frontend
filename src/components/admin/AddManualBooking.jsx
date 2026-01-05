import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AddManualBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    court: '',
    user: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'confirmed',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert('Booking added successfully!');
      navigate('/schedule');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/schedule')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-gray-900">
            {location.state?.bookingId ? 'Edit Booking' : 'Add Manual Booking'}
          </h2>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Court */}
            <div>
              <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-2">
                Court
              </label>
              <select
                id="court"
                name="court"
                value={formData.court}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              >
                <option value="">Select a court</option>
                <option value="Soccer Field 1">Soccer Field 1</option>
                <option value="Basketball Court 1">Basketball Court 1</option>
                <option value="Basketball Court 2">Basketball Court 2</option>
                <option value="Tennis Court 1">Tennis Court 1</option>
                <option value="Volleyball Court">Volleyball Court</option>
              </select>
            </div>

            {/* User */}
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2">
                User/Team
              </label>
              <input
                id="user"
                name="user"
                type="text"
                value={formData.user}
                onChange={handleChange}
                placeholder="Enter user name or team name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/schedule')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

