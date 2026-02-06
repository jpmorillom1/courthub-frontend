import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const bookingSchema = z
  .object({
    court: z.string().min(1, 'Select a court'),
    user: z.string().min(1, 'User or team is required'),
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    status: z.enum(['confirmed', 'pending', 'maintenance']),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

export function AddManualBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      court: '',
      user: '',
      date: '',
      startTime: '',
      endTime: '',
      status: 'confirmed',
    },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('Booking added successfully!');
    navigate('/schedule');
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Court */}
            <div>
              <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-2">
                Court
              </label>
              <select
                id="court"
                name="court"
                {...registerField('court')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              >
                <option value="">Select a court</option>
                <option value="Soccer Field 1">Soccer Field 1</option>
                <option value="Basketball Court 1">Basketball Court 1</option>
                <option value="Basketball Court 2">Basketball Court 2</option>
                <option value="Tennis Court 1">Tennis Court 1</option>
                <option value="Volleyball Court">Volleyball Court</option>
              </select>
              {errors.court?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.court.message}
                </p>
              )}
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
                placeholder="Enter user name or team name"
                {...registerField('user')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              />
              {errors.user?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.user.message}
                </p>
              )}
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
                {...registerField('date')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              />
              {errors.date?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.date.message}
                </p>
              )}
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
                  {...registerField('startTime')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
                {errors.startTime?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  {...registerField('endTime')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
                {errors.endTime?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.endTime.message}
                  </p>
                )}
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
                {...registerField('status')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="maintenance">Maintenance</option>
              </select>
              {errors.status?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.status.message}
                </p>
              )}
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
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

