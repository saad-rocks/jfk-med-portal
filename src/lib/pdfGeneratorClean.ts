import LOGO_BASE64 from '../assets/logo.js';
import pdfmake from './pdfmakeClient';
import type { MonthlyReport, TimeEntry } from '../types';

const jfkLogoImage = LOGO_BASE64;

const colors = {
  primary: '#12326b',
  primaryDark: '#0a2150',
  secondary: '#c32148',
  accent: '#f5b342',
  text: '#1f2937',
  textLight: '#6b7280',
  background: '#f8fafc',
  border: '#e2e8f0',
  slate: '#334155',
  white: '#ffffff'
};

const universityInfo = {
  name: 'JOHN F. KENNEDY UNIVERSITY',
  subtitle: 'SCHOOL OF MEDICINE',
  campus: 'Pareraweg 45, Willemstad Curaçao',
  phone: '(5999) 676-1281',
  website: 'www.jfkuniversity.org'
};

const styles = {
  header: {
    fontSize: 24,
    bold: true,
    color: colors.primaryDark,
    alignment: 'right',
    margin: [0, 0, 0, 4]
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    alignment: 'right',
    margin: [0, 0, 0, 12]
  },
  sectionTitle: {
    fontSize: 12,
    bold: true,
    color: colors.primaryDark,
    margin: [0, 18, 0, 8]
  },
  contact: {
    fontSize: 9,
    color: colors.textLight,
    alignment: 'right'
  },
  tableHeader: {
    fontSize: 10,
    bold: true,
    color: colors.white,
    fillColor: colors.primary,
    alignment: 'center',
    margin: [0, 6, 0, 6]
  },
  tableCell: {
    fontSize: 10,
    color: colors.text,
    margin: [0, 6, 0, 6]
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textLight,
    alignment: 'center'
  },
  metricValue: {
    fontSize: 24,
    bold: true,
    color: colors.primaryDark,
    alignment: 'center',
    margin: [0, 4, 0, 0]
  },
  footer: {
    fontSize: 8,
    color: colors.textLight,
    alignment: 'center'
  },
  summaryLabel: {
    fontSize: 11,
    bold: true,
    color: colors.primaryDark,
    margin: [0, 12, 0, 4]
  },
  summaryValue: {
    fontSize: 16,
    bold: true,
    color: colors.secondary
  }
} as const;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const resolveMonthNumber = (report: MonthlyReport, sortedDates: string[]): number => {
  const { month } = report;

  if (month) {
    const trimmed = month.trim();

    if (/^\d{4}-\d{2}$/.test(trimmed)) {
      return Number.parseInt(trimmed.slice(5), 10);
    }

    if (/^\d{1,2}$/.test(trimmed)) {
      return Number.parseInt(trimmed, 10);
    }
  }

  if (sortedDates.length > 0) {
    const inferred = Number.parseInt(sortedDates[0].split('-')[1], 10);
    if (Number.isFinite(inferred)) {
      return inferred;
    }
  }

  return new Date().getMonth() + 1;
};

const buildDailyRows = (entries: TimeEntry[]) => {
  const headerRow: any[] = [
    { text: 'Date', style: 'tableHeader' },
    { text: 'Clock In', style: 'tableHeader' },
    { text: 'Clock Out', style: 'tableHeader' },
    { text: 'Hours', style: 'tableHeader' },
    { text: 'Type', style: 'tableHeader' }
  ];

  const rows = entries.map((entry: TimeEntry) => {
    // Parse date string as local date to avoid timezone issues
    const [year, month, day] = entry.date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const formatted = dateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

    // Format times
    const clockInTime = entry.clockIn ? new Date(entry.clockIn).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }) : 'N/A';
    const clockOutTime = entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }) : 'N/A';
    const hours = entry.totalHours || 0;
    const type = entry.isManual ? 'Manual' : 'Auto';

    return [
      { text: formatted, style: 'tableCell' },
      { text: clockInTime, style: 'tableCell' },
      { text: clockOutTime, style: 'tableCell' },
      { text: `${hours.toFixed(2)} hrs`, style: 'tableCell', alignment: 'right' },
      { text: type, style: 'tableCell', alignment: 'center' }
    ];
  });

  if (rows.length === 0) {
    rows.push([
      {
        text: 'No time entries recorded for this period.',
        style: 'tableCell',
        alignment: 'center',
        colSpan: 5,
        margin: [0, 12, 0, 12]
      } as any,
      { text: '', style: 'tableCell' },
      { text: '', style: 'tableCell' },
      { text: '', style: 'tableCell' },
      { text: '', style: 'tableCell' }
    ]);
  }

  return [headerRow, ...rows] as any;
};

const buildInsights = (
  sortedDates: string[],
  dailyTotals: Record<string, number>,
  dailySessions: Record<string, number>,
  monthName: string,
  year: number,
  totalHours: number
) => {
  if (sortedDates.length === 0) return ['No time entries recorded for this period.'];

  const totals = sortedDates.map(dateStr => {
    // Parse date string as local date to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    return {
      date: new Date(year, month - 1, day),
      hours: dailyTotals[dateStr],
      sessions: dailySessions[dateStr] || 0
    };
  });

  totals.sort((a, b) => b.hours - a.hours);

  const peak = totals[0];
  const totalSessions = totals.reduce((sum, item) => sum + item.sessions, 0);
  const averageSessions = totalSessions / totals.length;

  const insights: string[] = [
    `Highest daily total: ${peak.hours.toFixed(2)} hours on ${peak.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}.`,
    `Average sessions per working day: ${averageSessions.toFixed(1)}.`,
    `Total hours logged in ${monthName} ${year}: ${totalHours.toFixed(2)}.`
  ];

  return insights;
};

export function generateMonthlyTimeReportClean(report: MonthlyReport): void {
  const dailyTotals: Record<string, number> = {};
  const dailySessions: Record<string, number> = {};

  report.dailyEntries.forEach((entry: TimeEntry) => {
    const { date, totalHours = 0 } = entry;
    dailyTotals[date] = (dailyTotals[date] || 0) + totalHours;
    dailySessions[date] = (dailySessions[date] || 0) + 1;
  });

  const sortedDates = Object.keys(dailyTotals).sort();
  const monthNumber = resolveMonthNumber(report, sortedDates);
  const monthIndex = Math.max(0, Math.min(monthNumber - 1, 11));
  const monthName = monthNames[monthIndex];

  // Sort entries by date
  const sortedEntries = [...report.dailyEntries].sort((a, b) => a.date.localeCompare(b.date));

  const dailyRows = buildDailyRows(sortedEntries);
  const insights = buildInsights(sortedDates, dailyTotals, dailySessions, monthName, report.year, report.totalHours);

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 50],
    images: {
      jfkLogo: jfkLogoImage
    },
    content: [
      {
        columns: [
          { image: 'jfkLogo', width: 100 },
          {
            width: '*',
            stack: [
              { text: universityInfo.name, style: 'header' },
              { text: universityInfo.subtitle, style: 'subtitle' },
              { text: universityInfo.campus, style: 'contact' },
              { text: `${universityInfo.phone}  •  ${universityInfo.website}`, style: 'contact' }
            ]
          }
        ],
        margin: [0, 0, 0, 18]
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1.2,
            lineColor: colors.primary
          }
        ],
        margin: [0, 4, 0, 18]
      },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: report.userName, fontSize: 18, bold: true, color: colors.primaryDark },
              {
                text: `Monthly Time Tracking • ${monthName} ${report.year}`,
                color: colors.textLight,
                margin: [0, 3, 0, 10]
              },
              {
                text: `Generated on ${new Date(report.generatedAt).toLocaleDateString()}`,
                style: 'contact',
                alignment: 'left'
              }
            ]
          },
          {
            width: 170,
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    stack: [
                      { text: 'TOTAL HOURS', fontSize: 10, color: colors.textLight, alignment: 'center' },
                      {
                        text: report.totalHours.toFixed(2),
                        fontSize: 28,
                        bold: true,
                        color: colors.primaryDark,
                        alignment: 'center',
                        margin: [0, 6, 0, 4]
                      },
                      { text: 'hours recorded', fontSize: 9, color: colors.textLight, alignment: 'center' }
                    ],
                    margin: [0, 14, 0, 14]
                  }
                ]
              ]
            },
            layout: {
              fillColor: () => colors.background,
              hLineWidth: () => 0,
              vLineWidth: () => 0,
              paddingLeft: () => 12,
              paddingRight: () => 12
            }
          }
        ],
        columnGap: 24,
        margin: [0, 0, 0, 20]
      },
      {
        columns: [
          {
            width: '33%',
            stack: [
              { text: 'Working Days', style: 'metricLabel' },
              { text: sortedDates.length.toString(), style: 'metricValue' }
            ]
          },
          {
            width: '34%',
            stack: [
              { text: 'Average Hours / Day', style: 'metricLabel' },
              {
                text: sortedDates.length > 0 ? (report.totalHours / sortedDates.length).toFixed(2) : '0.00',
                style: 'metricValue'
              }
            ]
          },
          {
            width: '33%',
            stack: [
              { text: 'Sessions Logged', style: 'metricLabel' },
              { text: report.dailyEntries.length.toString(), style: 'metricValue' }
            ]
          }
        ],
        columnGap: 14,
        margin: [0, 0, 0, 26]
      },
      {
        text: 'DAILY PERFORMANCE OVERVIEW',
        style: 'sectionTitle'
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 'auto', 'auto'],
          body: dailyRows
        },
        layout: {
          fillColor: (rowIndex: number) => {
            if (rowIndex === 0) return undefined;
            return rowIndex % 2 === 0 ? '#f1f5f9' : colors.white;
          },
          hLineColor: () => colors.border,
          vLineColor: () => colors.border,
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 6,
          paddingBottom: () => 6
        }
      },
      {
        text: 'KEY INSIGHTS',
        style: 'sectionTitle',
        margin: [0, 18, 0, 6]
      },
      {
        ul: insights,
        fontSize: 10,
        color: colors.slate
      },
      {
        text: 'Monthly Summary',
        style: 'summaryLabel'
      },
      {
        text: `${report.totalHours.toFixed(2)} hours tracked across ${sortedDates.length} documented working days in ${monthName} ${report.year}.`,
        style: 'summaryValue'
      }
    ],
    footer(currentPage: number, pageCount: number) {
      return {
        columns: [
          {
            width: '*',
            text: `Generated ${new Date().toLocaleDateString()}`,
            style: 'footer',
            alignment: 'left',
            margin: [40, 12, 0, 0]
          },
          {
            width: '*',
            text: `© ${new Date().getFullYear()} ${universityInfo.name}`,
            style: 'footer',
            alignment: 'right',
            margin: [0, 12, 40, 0]
          }
        ]
      };
    },
    styles
  };

  pdfmake.createPdf(docDefinition).download(
    `TimeReport-${report.userName.replace(/\s+/g, '-')}-${monthName}-${report.year}.pdf`
  );
}
