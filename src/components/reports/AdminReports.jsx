import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { reportService } from '../../services/reportService';

export function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
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
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Court</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Issue</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">Severity</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">Date</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
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
                reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{report.courtName}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">{report.issue}</p>
                        <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={async () => {
                          const newStatus = report.status === 'Pending' ? 'In Progress' : 'Resolved';
                          try {
                            await reportService.updateReportStatus(report.id, newStatus);
                            const updated = await reportService.getAllReports();
                            setReports(updated);
                          } catch (error) {
                            alert('Error updating report: ' + error.message);
                          }
                        }}
                        className="px-4 py-2 text-sm bg-[#003f8f] hover:bg-[#002f6f] text-white rounded-lg transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

