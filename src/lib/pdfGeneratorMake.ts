import pdfmake from './pdfmakeClient';
import type { MonthlyReport, TimeEntry } from '../types';

// Professional color scheme
const colors = {
  primary: '#003366',    // Navy blue
  secondary: '#8B0000',  // Dark red
  accent: '#FFD700',     // Gold
  text: '#333333',       // Dark gray
  lightText: '#666666',  // Medium gray
  background: '#F8F9FA', // Light gray background
  white: '#FFFFFF',
  border: '#E0E0E0'
};

// Professional typography
const fonts = {
  header: {
    fontSize: 18,
    bold: true,
    color: colors.primary,
    font: 'Helvetica'
  },
  subheader: {
    fontSize: 14,
    bold: true,
    color: colors.secondary
  },
  body: {
    fontSize: 11,
    color: colors.text
  },
  caption: {
    fontSize: 9,
    color: colors.lightText
  }
};

// University information
const universityInfo = {
  name: 'JOHN F. KENNEDY UNIVERSITY SCHOOL OF MEDICINE',
  campus: 'Pareraweg 45, Willemstad Curacao',
  usaOffice: '190 N, Main St. Suite # 202, Natick, MA 01762',
  phone: 'Campus: (5999) 6761281, (5999) 6810527',
  tollFree: 'Toll Free: 1-888-481-9201',
  website: 'www.jfkuniversity.org',
  email: 'info@jfkuniversity.org',
  admissionsEmail: 'admissions@jfkuniversity.org'
};

// Professional document styles
const styles = {
  header: {
    fontSize: 18,
    bold: true,
    color: colors.primary,
    alignment: 'center',
    margin: [0, 10, 0, 5]
  },
  subheader: {
    fontSize: 14,
    bold: true,
    color: colors.secondary,
    margin: [0, 5, 0, 3]
  },
  universityName: {
    fontSize: 16,
    bold: true,
    color: colors.primary,
    alignment: 'center',
    margin: [0, 5, 0, 2]
  },
  address: {
    fontSize: 10,
    color: colors.text,
    margin: [0, 2, 0, 1]
  },
  contact: {
    fontSize: 9,
    color: colors.lightText,
    margin: [0, 1, 0, 1]
  },
  tableHeader: {
    fontSize: 11,
    bold: true,
    color: colors.white,
    fillColor: colors.primary,
    margin: [5, 5, 5, 5]
  },
  tableCell: {
    fontSize: 10,
    margin: [5, 3, 5, 3]
  },
  summaryBox: {
    fontSize: 12,
    bold: true,
    color: colors.primary,
    margin: [0, 5, 0, 5]
  },
  footer: {
    fontSize: 8,
    color: colors.lightText,
    alignment: 'center',
    margin: [0, 10, 0, 0]
  }
};

// Generate professional letterhead
function generateLetterhead(): any[] {
  return [
    {
      columns: [
        {
          width: 60,
          text: '',
          margin: [0, 0, 10, 0]
          // Logo would be added here if we have base64 data
        },
        {
          width: '*',
          stack: [
            {
              text: universityInfo.name,
              style: 'universityName'
            },
            {
              text: `Campus: ${universityInfo.campus}`,
              style: 'address'
            },
            {
              text: `USA Office: ${universityInfo.usaOffice}`,
              style: 'address'
            },
            {
              text: `${universityInfo.phone} | ${universityInfo.tollFree}`,
              style: 'contact'
            },
            {
              text: `Website: ${universityInfo.website}`,
              style: 'contact'
            },
            {
              columns: [
                {
                  width: '50%',
                  text: `Email: ${universityInfo.email}`,
                  style: 'contact'
                },
                {
                  width: '50%',
                  text: `Admissions: ${universityInfo.admissionsEmail}`,
                  style: 'contact'
                }
              ]
            }
          ]
        }
      ],
      margin: [0, 0, 0, 15]
    },
    // Decorative line
    {
      canvas: [
        {
          type: 'line',
          x1: 0, y1: 5,
          x2: 515, y2: 5,
          lineWidth: 1,
          lineColor: colors.accent
        }
      ],
      margin: [0, 0, 0, 10]
    }
  ];
}

// Generate time tracking report
export function generateMonthlyTimeReportMake(report: MonthlyReport): void {
  // Calculate derived statistics
  const workingDays = report.dailyEntries.length;
  const averageHoursPerDay = workingDays > 0 ? report.totalHours / workingDays : 0;

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: fonts.body,
    styles: styles,

    header: function(currentPage: number, pageCount: number) {
      return [
        ...generateLetterhead(),
        {
          text: `Monthly Time Report - ${report.month} ${report.year}`,
          style: 'header'
        },
        {
          text: `Employee: ${report.userName} | Generated on ${new Date(report.generatedAt).toLocaleDateString()} | Page ${currentPage} of ${pageCount}`,
          style: 'caption',
          alignment: 'center',
          margin: [0, 5, 0, 10]
        }
      ];
    },

    footer: function(currentPage: number, pageCount: number) {
      return {
        text: `© ${new Date().getFullYear()} ${universityInfo.name} | Confidential Document`,
        style: 'footer'
      };
    },

    content: [
      // Summary Section
      {
        text: 'TIME TRACKING SUMMARY',
        style: 'subheader',
        margin: [0, 15, 0, 10]
      },

      // Summary statistics in a nice layout
      {
        columns: [
          {
            width: '33%',
            stack: [
              {
                text: 'Total Hours',
                style: 'summaryBox',
                decoration: 'underline'
              },
              {
                text: `${report.totalHours.toFixed(2)} hours`,
                fontSize: 14,
                bold: true,
                color: colors.secondary,
                margin: [0, 5, 0, 0]
              }
            ]
          },
          {
            width: '33%',
            stack: [
              {
                text: 'Working Days',
                style: 'summaryBox',
                decoration: 'underline'
              },
              {
                text: `${workingDays} days`,
                fontSize: 14,
                bold: true,
                color: colors.secondary,
                margin: [0, 5, 0, 0]
              }
            ]
          },
          {
            width: '34%',
            stack: [
              {
                text: 'Avg Hours/Day',
                style: 'summaryBox',
                decoration: 'underline'
              },
              {
                text: `${averageHoursPerDay.toFixed(2)} hours`,
                fontSize: 14,
                bold: true,
                color: colors.secondary,
                margin: [0, 5, 0, 0]
              }
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },

      // Detailed breakdown
      {
        text: 'DAILY TIME BREAKDOWN',
        style: 'subheader',
        margin: [0, 15, 0, 10]
      },

      // Table with professional styling
      {
        table: {
          headerRows: 1,
          widths: ['25%', '20%', '20%', '20%', '15%'],
          body: [
            // Header row
            [
              { text: 'Date', style: 'tableHeader', fillColor: colors.primary },
              { text: 'Clock In', style: 'tableHeader', fillColor: colors.primary },
              { text: 'Clock Out', style: 'tableHeader', fillColor: colors.primary },
              { text: 'Hours', style: 'tableHeader', fillColor: colors.primary },
              { text: 'Type', style: 'tableHeader', fillColor: colors.primary }
            ],
            // Data rows
            ...report.dailyEntries.map((entry: TimeEntry) => {
              // Parse date string as local date to avoid timezone issues
              const [year, month, day] = entry.date.split('-').map(Number);
              const localDate = new Date(year, month - 1, day);

              return [
                {
                  text: localDate.toLocaleDateString(),
                  style: 'tableCell'
                },
              {
                text: entry.clockIn ? new Date(entry.clockIn).toLocaleTimeString() : 'N/A',
                style: 'tableCell'
              },
              {
                text: entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString() : 'N/A',
                style: 'tableCell'
              },
              {
                text: entry.totalHours ? `${entry.totalHours.toFixed(2)} hrs` : 'N/A',
                style: 'tableCell',
                bold: true
              },
                {
                  text: entry.isManual ? 'Manual' : 'Auto',
                  style: 'tableCell'
                }
              ];
            })
          ]
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex % 2 === 0) ? colors.background : colors.white,
          hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => colors.border,
          vLineColor: () => colors.border
        } as any,
        margin: [0, 0, 0, 20]
      },

      // Notes section if any
      {
        text: 'ADDITIONAL NOTES',
        style: 'subheader',
        margin: [0, 15, 0, 5]
      },
      {
        text: 'This report provides a comprehensive overview of time tracking activities for the specified period. All times are recorded in local timezone.',
        style: 'caption',
        margin: [0, 0, 0, 10]
      }
    ]
  };

  // Generate and download the PDF
  pdfmake.createPdf(docDefinition).download(`time-report-${report.userName}-${report.month}.pdf`);
}

// Generate time sheet
export function generateTimeSheetMake(entries: TimeEntry[], userName: string, startDate: string, endDate: string): void {
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: fonts.body,
    styles: styles,

    header: function(currentPage: number, pageCount: number) {
      return [
        ...generateLetterhead(),
        {
          text: `Time Sheet - ${userName}`,
          style: 'header'
        },
        {
          text: `Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
          style: 'subheader',
          margin: [0, 5, 0, 5]
        }
      ];
    },

    footer: function(currentPage: number, pageCount: number) {
      return {
        text: `Generated on ${new Date().toLocaleDateString()} | Page ${currentPage} of ${pageCount} | © ${new Date().getFullYear()} ${universityInfo.name}`,
        style: 'footer'
      };
    },

    content: [
      {
        text: 'DETAILED TIME ENTRIES',
        style: 'subheader',
        margin: [0, 15, 0, 10]
      },

      // Group entries by date
      ...Object.entries(
        entries.reduce((groups: any, entry) => {
          // Parse date string as local date to avoid timezone issues
          const [year, month, day] = entry.date.split('-').map(Number);
          const localDate = new Date(year, month - 1, day);
          const date = localDate.toLocaleDateString();
          if (!groups[date]) groups[date] = [];
          groups[date].push(entry);
          return groups;
        }, {})
      ).map(([date, dayEntries]: [string, any]) => [
        {
          text: date,
          style: 'summaryBox',
          margin: [0, 10, 0, 5]
        },
        {
          table: {
            headerRows: 1,
            widths: ['20%', '20%', '25%', '20%', '15%'],
            body: [
              [
                { text: 'Clock In', style: 'tableHeader' },
                { text: 'Clock Out', style: 'tableHeader' },
                { text: 'Duration', style: 'tableHeader' },
                { text: 'Type', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' }
              ],
              ...dayEntries.map((entry: any) => [
                {
                  text: entry.clockIn ? new Date(entry.clockIn).toLocaleTimeString() : 'N/A',
                  style: 'tableCell'
                },
                {
                  text: entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString() : 'N/A',
                  style: 'tableCell'
                },
                {
                  text: entry.duration ? `${entry.duration.toFixed(2)} hrs` : 'N/A',
                  style: 'tableCell',
                  bold: true
                },
                {
                  text: entry.type || 'Regular',
                  style: 'tableCell'
                },
                {
                  text: entry.clockOut ? 'Completed' : 'In Progress',
                  style: 'tableCell',
                  color: entry.clockOut ? colors.secondary : colors.primary
                }
              ])
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0) ? colors.primary : (rowIndex % 2 === 1) ? colors.background : colors.white
          } as any,
          margin: [0, 0, 0, 15]
        }
      ])
    ]
  };

  pdfmake.createPdf(docDefinition).download(`timesheet-${userName}-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Test function for the new PDF generator
export function testPdfMakeGenerator(): void {
  const sampleReport: MonthlyReport = {
    userId: 'test-user',
    userName: 'John Doe',
    month: '2024-01',
    year: 2024,
    totalHours: 160.5,
    dailyEntries: [
      {
        id: '1',
        userId: 'test-user',
        date: new Date().toISOString().split('T')[0],
        clockIn: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
        clockOut: Date.now(),
        totalHours: 8.0,
        isManual: false,
        notes: 'Sample work day',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ],
    generatedAt: Date.now()
  };

  console.log('🧪 Testing pdfmake PDF generator...');
  generateMonthlyTimeReportMake(sampleReport);
  console.log('✅ pdfmake PDF generated successfully!');
}

// Export the functions
export {
  generateLetterhead,
  colors,
  fonts,
  styles
};
