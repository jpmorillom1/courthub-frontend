import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { courtIssueService } from '../../services/courtIssueService';
import api, { API_ENDPOINTS } from '../../services/api';

export function ReportIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
  });
  const [loading, setLoading] = useState(false);
  const [loadingReservation, setLoadingReservation] = useState(true);
  const [error, setError] = useState('');
  const [courtId, setCourtId] = useState(null);
  const [reservation, setReservation] = useState(null);

  // Load reservation to get courtId
  useEffect(() => {
    const loadReservation = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.BOOKINGS_GET_BY_ID(id));
        setReservation(data);
        setCourtId(data.courtId);
      } catch (err) {
        console.error('Error loading reservation:', err);
        setError('Error loading reservation details');
      } finally {
        setLoadingReservation(false);
      }
    };

    if (id) {
      loadReservation();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!courtId) {
      setError('Court information not available');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await courtIssueService.reportIssue(courtId, {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
      });

      alert('Issue reported successfully!');
      navigate(`/reservations/${id}`);
    } catch (err) {
      setError('Error reporting issue: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Broken net on south basket"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide details about the issue..."
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Severity */}
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
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
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

