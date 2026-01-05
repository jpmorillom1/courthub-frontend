// Mock data para reportes
const mockReports = [
  {
    id: '1',
    reservationId: '1',
    userId: '2',
    courtName: 'Basketball Court 1',
    issue: 'Broken net on south basket',
    description: 'The net on the south basket is torn and needs replacement.',
    severity: 'Medium',
    status: 'In Progress',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2023-12-20T14:00:00Z',
  },
  {
    id: '2',
    reservationId: '2',
    userId: '2',
    courtName: 'Soccer Field 1',
    issue: 'Light out on northwest corner',
    description: 'One of the floodlights is not working properly.',
    severity: 'High',
    status: 'Pending',
    createdAt: '2023-12-19T15:00:00Z',
    updatedAt: '2023-12-19T15:00:00Z',
  },
  {
    id: '3',
    reservationId: '3',
    userId: '3',
    courtName: 'Tennis Court 1',
    issue: 'Court surface cracking',
    description: 'There are visible cracks on the court surface.',
    severity: 'Low',
    status: 'Scheduled',
    createdAt: '2023-12-18T09:00:00Z',
    updatedAt: '2023-12-18T09:00:00Z',
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportService = {
  async createReport(reportData) {
    await delay(800);
    const newReport = {
      id: String(mockReports.length + 1),
      ...reportData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockReports.push(newReport);
    return newReport;
  },

  async getAllReports() {
    await delay(600);
    return mockReports;
  },

  async getReportById(reportId) {
    await delay(400);
    const report = mockReports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  },

  async updateReportStatus(reportId, status) {
    await delay(500);
    const report = mockReports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      report.updatedAt = new Date().toISOString();
      return report;
    }
    throw new Error('Report not found');
  },

  async getReportsByUser(userId) {
    await delay(500);
    return mockReports.filter((r) => r.userId === userId);
  },
};

