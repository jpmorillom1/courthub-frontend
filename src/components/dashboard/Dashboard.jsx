import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Wrench,
  Award,
  AlertCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';

export function Dashboard() {
  const [kpiData, setKpiData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [reservationData, setReservationData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [sanctionsData, setSanctionsData] = useState([]);
  const [topStudentsData, setTopStudentsData] = useState([]);
  const [incidentsData, setIncidentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          kpis,
          faculty,
          reservations,
          heatmap,
          sanctions,
          topStudents,
          incidents,
        ] = await Promise.all([
          dashboardService.getKPIs(),
          dashboardService.getFacultyDistribution(),
          dashboardService.getReservationTrends(),
          dashboardService.getPeakHours(),
          dashboardService.getSanctions(),
          dashboardService.getTopStudents(),
          dashboardService.getIncidents(),
        ]);

        // Agregar iconos a KPIs
        const kpisWithIcons = [
          { ...kpis[0], icon: TrendingUp },
          { ...kpis[1], icon: Users },
          { ...kpis[2], icon: AlertTriangle },
          { ...kpis[3], icon: Wrench },
        ];

        setKpiData(kpisWithIcons);
        setFacultyData(faculty);
        setReservationData(reservations);
        setHeatmapData(heatmap);
        setSanctionsData(sanctions);
        setTopStudentsData(topStudents);
        setIncidentsData(incidents);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getHeatColor = (value) => {
    if (value >= 90) return 'bg-[#003f8f]';
    if (value >= 70) return 'bg-[#cbab42]';
    if (value >= 50) return 'bg-blue-400';
    if (value >= 30) return 'bg-blue-200';
    return 'bg-gray-200';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-1">{kpi.title}</p>
                  <h2 className="text-gray-900 mb-2">{kpi.value}</h2>
                  <p
                    className={`text-sm ${
                      kpi.trend === 'up'
                        ? 'text-green-600'
                        : kpi.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {kpi.change}
                  </p>
                </div>
                <div className={`${kpi.bgColor} ${kpi.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Faculty Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-900 mb-4">Usage by Faculty</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={facultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {facultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours Heatmap */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 xl:col-span-2">
          <h3 className="text-gray-900 mb-4">Peak Usage Hours</h3>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-2 mb-2">
                <div className="w-16"></div>
                {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((time) => (
                  <div key={time} className="w-16 text-center text-xs text-gray-600">
                    {time}
                  </div>
                ))}
              </div>
              {heatmapData.map((row) => (
                <div key={row.day} className="flex gap-2 mb-2">
                  <div className="w-16 text-sm text-gray-600 flex items-center">{row.day}</div>
                  {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((time) => (
                    <div
                      key={time}
                      className={`w-16 h-10 ${getHeatColor(row[time] || 0)} rounded flex items-center justify-center text-xs text-white`}
                      title={`${row.day} ${time}: ${row[time] || 0}%`}
                    >
                      {row[time] || 0}%
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-900 mb-4">Completed Reservations vs Cancellations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reservationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
            <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Operational Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sanctions Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-gray-900">Sanctions & Blocks Ranking</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Student</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Faculty</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">No-Shows</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {sanctionsData.map((student, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-900">{student.name}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{student.faculty}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full">
                        {student.noShows}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${
                          student.status === 'Blocked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Active Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#cbab42]" />
            <h3 className="text-gray-900">Top Active Students</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Student</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Faculty</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Reservations</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {topStudentsData.map((student, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-900">{student.name}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{student.faculty}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#cbab42]/10 text-[#cbab42] rounded-full">
                        {student.reservations}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-gray-900">
                      {student.attendance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Damage & Incident Reports */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5 text-gray-600" />
          <h3 className="text-gray-900">Damage & Incident Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Court</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Issue</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Severity</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Date</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidentsData.map((incident, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{incident.court}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{incident.issue}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        incident.severity === 'High'
                          ? 'bg-red-100 text-red-700'
                          : incident.severity === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">{incident.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        incident.status === 'Resolved'
                          ? 'bg-green-100 text-green-700'
                          : incident.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

