import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Wrench,
  Award,
  CheckCircle,
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
import { analyticsService } from '../../services/analyticsService';

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await analyticsService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getHeatColor = (value, maxValue = 10) => {
    if (maxValue === 0) return 'bg-gray-100';
    
    const percentage = (value / maxValue) * 100;
    
    if (percentage >= 80) return 'bg-[#003f8f] text-white';
    if (percentage >= 60) return 'bg-[#1e5ba8] text-white';
    if (percentage >= 40) return 'bg-[#cbab42] text-gray-900';
    if (percentage >= 20) return 'bg-blue-300 text-gray-900';
    if (percentage >= 10) return 'bg-blue-200 text-gray-900';
    if (percentage > 0) return 'bg-blue-100 text-gray-900';
    return 'bg-gray-100 text-gray-900';
  };

  const getMaxHeatmapValue = () => {
    if (!heatmapData || heatmapData.length === 0) return 0;
    
    let max = 0;
    heatmapData.forEach(day => {
      Object.entries(day).forEach(([key, value]) => {
        if (key !== 'day' && typeof value === 'number') {
          max = Math.max(max, value);
        }
      });
    });
    return max;
  };

  const getKPIs = () => {
    if (!dashboardData?.kpis) return [];
    
    const { kpis } = dashboardData;
    
    return [
      {
        title: "Occupation Rate",
        value: `${kpis.occupationRate.toFixed(1)}%`,
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Total Students",
        value: kpis.totalStudents.toLocaleString(),
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Maintenance Issues",
        value: kpis.maintenanceIssues,
        icon: Wrench,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      {
        title: "Critical Issues",
        value: kpis.criticalIssues,
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        title: "Resolved Issues",
        value: kpis.resolvedIssues,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
    ];
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 mb-2">Error loading dashboard</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const kpiData = getKPIs();
  const facultyData = dashboardData.facultyUsage || [];
  const reservationData = dashboardData.reservationsHistory || [];
  const heatmapData = Object.entries(dashboardData.heatmap?.dayHourMatrix || {}).map(([day, hours]) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(),
    ...hours
  }));
  const topStudentsData = dashboardData.topActiveStudents || [];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
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
                label={({ faculty, bookingCount }) => `${faculty}: ${bookingCount}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="bookingCount"
                nameKey="faculty"
              >
                {facultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.faculty]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours Heatmap */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 xl:col-span-2">
          <h3 className="text-gray-900 mb-4">Peak Usage Hours</h3>
          {heatmapData.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {(() => {
                  const maxValue = getMaxHeatmapValue();
                  const hours = heatmapData[0] ? Object.keys(heatmapData[0]).filter(key => key !== 'day').sort((a, b) => {
                    return parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]);
                  }) : [];
                  
                  return (
                    <>
                      <div className="flex gap-2 mb-2">
                        <div className="w-16"></div>
                        {hours.map((hour) => (
                          <div key={hour} className="w-16 text-center text-xs text-gray-600">
                            {hour}
                          </div>
                        ))}
                      </div>
                      {heatmapData.map((row) => (
                        <div key={row.day} className="flex gap-2 mb-2">
                          <div className="w-16 text-sm text-gray-600 flex items-center font-medium">{row.day.substring(0, 3)}</div>
                          {hours.map((hour) => (
                            <div
                              key={hour}
                              className={`w-16 h-10 ${getHeatColor(row[hour] || 0, maxValue)} rounded flex items-center justify-center text-xs font-semibold transition-colors`}
                              title={`${row.day} ${hour}: ${row[hour] || 0} bookings`}
                            >
                              {row[hour] || 0}
                            </div>
                          ))}
                        </div>
                      ))}
                      <div className="mt-4 flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-4 bg-gray-100"></div>
                          <span>None</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-4 bg-blue-100"></div>
                          <span>Low</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-4 bg-blue-300"></div>
                          <span>Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-4 bg-[#cbab42]"></div>
                          <span>High</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-4 bg-[#003f8f]"></div>
                          <span>Peak</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No heatmap data available</p>
          )}
        </div>
      </div>

      {/* Reservations Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-900 mb-4">Completed Reservations vs Cancellations</h3>
        {reservationData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                tickFormatter={(value, index) => {
                  const item = reservationData[index];
                  return item ? `${value} '${String(item.year).slice(-2)}` : value;
                }}
              />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value, name) => {
                  const label = name === 'completedCount' ? 'Completed' : 'Cancelled';
                  return [value, label];
                }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'completedCount' ? 'Completed' : 'Cancelled';
                }}
              />
              <Bar dataKey="completedCount" fill="#10b981" name="completedCount" radius={[8, 8, 0, 0]} />
              <Bar dataKey="cancelledCount" fill="#ef4444" name="cancelledCount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No reservation data available</p>
        )}
      </div>

      {/* Top Active Students */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#cbab42]" />
          <h3 className="text-gray-900">Top Active Students</h3>
        </div>
        {topStudentsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Student</th>
                  <th className="text-left py-3 px-2 text-sm text-gray-600">Faculty</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Bookings</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Hours</th>
                  <th className="text-center py-3 px-2 text-sm text-gray-600">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {topStudentsData.map((student, index) => (
                  <tr key={student.userId || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-900">{student.userName}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{student.faculty}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#cbab42]/10 text-[#cbab42] rounded-full">
                        {student.totalBookings}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-gray-900">
                      {student.totalHours}h
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-gray-900">
                      {student.attendanceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No student data available</p>
        )}
      </div>
    </div>
  );
}

