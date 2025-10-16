import jsPDF from 'jspdf';
import type { MonthlyReport, TimeEntry } from '../types';

// Footer Text Logo Creation Function
function createFooterTextLogo(doc: jsPDF, colors: any, pageHeight: number): void {
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, pageHeight - 25, 12, 12, 'F');

  doc.setLineWidth(0.5);
  doc.setDrawColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(15, pageHeight - 25, 12, 12);

  doc.setFontSize(7);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('JFK', 17, pageHeight - 18);

  doc.setFontSize(5);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text('U', 24, pageHeight - 18);
}

// Professional Logo Creation Function
function createProfessionalLogo(doc: jsPDF, logo: any, colors: any): void {
  // Create the main logo background
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(logo.x, logo.y, logo.width, logo.height, 'F');

  // Add logo border with gradient effect
  doc.setLineWidth(0.5);
  doc.setDrawColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(logo.x, logo.y, logo.width, logo.height);

  // Add inner accent border
  doc.setLineWidth(0.3);
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(logo.x + 1, logo.y + 1, logo.width - 2, logo.height - 2);

  // Add professional logo text - centered and styled
  doc.setFontSize(14);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('JFK', logo.x + 25, logo.y + 22);

  doc.setFontSize(8);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('UNIVERSITY', logo.x + 17, logo.y + 30);

  doc.setFontSize(6);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL', logo.x + 20, logo.y + 36);

  // Add small decorative elements (corner accents)
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(logo.x + 2, logo.y + 2, 2, 2, 'F'); // Top-left corner accent
  doc.rect(logo.x + logo.width - 4, logo.y + 2, 2, 2, 'F'); // Top-right corner accent
  doc.rect(logo.x + 2, logo.y + logo.height - 4, 2, 2, 'F'); // Bottom-left corner accent
  doc.rect(logo.x + logo.width - 4, logo.y + logo.height - 4, 2, 2, 'F'); // Bottom-right corner accent

  // Add center accent dot
  doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.rect(logo.x + logo.width/2 - 1, logo.y + logo.height/2 - 1, 2, 2, 'F');
}

// Global logo cache to avoid repeated loading
let logoImageCache: string | null = null;
let logoLoadAttempted = false;

// Function to preload and cache the logo
function preloadLogo(): Promise<string | null> {
  return new Promise((resolve) => {
    if (logoLoadAttempted) {
      resolve(logoImageCache);
      return;
    }

    logoLoadAttempted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/png');
        logoImageCache = imgData;
        resolve(imgData);
      } catch (error) {
        resolve(null);
      }
    };

    img.onerror = () => {
      resolve(null);
    };

    // Try different paths
    const paths = [
      '/jfk-logo.png',
      './jfk-logo.png',
      window.location.origin + '/jfk-logo.png',
      window.location.origin + '/public/jfk-logo.png'
    ];

    let pathIndex = 0;
    const tryNextPath = () => {
      if (pathIndex >= paths.length) {
        resolve(null);
        return;
      }

      img.src = paths[pathIndex];
      pathIndex++;
    };

    img.onerror = () => tryNextPath();
    tryNextPath();
  });
}

// University Letterhead Configuration
const LETTERHEAD_CONFIG = {
  logo: {
    path: '/jfk-logo.png',  // Path to public folder logo
    width: 50,
    height: 50,
    x: 15,
    y: 12
  },
  university: {
    name: 'JOHN F. KENNEDY UNIVERSITY SCHOOL OF MEDICINE',
    school: '',
    campus: 'Pareraweg 45, Willemstad Curacao',
    usaOffice: '190 N, Main St. Suite # 202, Natick, MA 01762',
    phone: 'Campus: (5999) 6761281, (5999) 6810527',
    tollFree: 'Toll Free: 1-888-481-9201',
    email: 'info@jfkuniversity.org',
    admissionsEmail: 'admissions@jfkuniversity.org',
    website: 'www.jfkuniversity.org'
  },
  colors: {
    primary: [0, 45, 114],        // Navy blue
    secondary: [198, 12, 48],     // Crimson red
    accent: [255, 140, 0],        // Orange
    text: [60, 60, 60],           // Dark gray
    lightText: [100, 100, 100],   // Light gray
    border: [200, 200, 200],      // Light gray
    background: [248, 249, 250],  // Very light gray
    white: [255, 255, 255]        // White
  }
};

// Professional Letterhead Function
function addUniversityLetterhead(doc: jsPDF, title: string, subtitle?: string): number {
  const { logo, university, colors } = LETTERHEAD_CONFIG;

  // Add professional border around entire page
  doc.setLineWidth(0.8);
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(8, 8, 194, 281); // A4 size with margins

  // Add inner decorative border
  doc.setLineWidth(0.3);
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(10, 10, 190, 277);

  // Add header background with gradient effect
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(11, 11, 188, 70, 'F');

  // Add the actual logo image with improved loading
  try {
    // First, ensure we have a preloaded logo
    if (!logoLoadAttempted) {
      preloadLogo().then((cachedImage) => {
        if (cachedImage) {
          logoImageCache = cachedImage;
        }
      });
    }

    // Use cached logo if available
    if (logoImageCache) {
      try {
        doc.addImage(logoImageCache, 'PNG', logo.x, logo.y, logo.width, logo.height);
      } catch (error) {
        createProfessionalLogo(doc, logo, colors);
      }
    } else {
      // Fallback: Try direct loading

      // Try multiple paths
      const paths = [
        '/jfk-logo.png',
        './jfk-logo.png',
        window.location.origin + '/jfk-logo.png'
      ];

      let success = false;
      for (const path of paths) {
        try {

          // Create a simple synchronous approach
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = path;

          // Wait a short time for image to load
          let attempts = 0;
          const maxAttempts = 50; // ~1 second at 20ms intervals

          const checkImage = () => {
            attempts++;
            if (img.complete && img.naturalHeight !== 0) {
              try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);
                  const imgData = canvas.toDataURL('image/png');
                  doc.addImage(imgData, 'PNG', logo.x, logo.y, logo.width, logo.height);
                  success = true;
                }
              } catch (error) {
              }
            } else if (attempts < maxAttempts) {
              setTimeout(checkImage, 20);
            }
          };

          checkImage();

          // If we got a successful load, break
          if (success) break;

        } catch (error) {
        }
      }

      // If all direct loading failed, use text logo
      if (!success) {
        createProfessionalLogo(doc, logo, colors);
      }
    }

  } catch (error) {
    createProfessionalLogo(doc, logo, colors);
  }

  // University name with enhanced styling
  doc.setFontSize(18);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('georgia', 'bold');
  doc.text(university.name, 75, 26);

  // Contact information with better formatting
  doc.setFontSize(7);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont('georgia', 'normal');

  // Campus Address
  doc.text(`Campus: ${university.campus}`, 75, 40);

  // USA Office Address
  doc.text(`USA Office: ${university.usaOffice}`, 75, 46);

  // Phone Numbers
  doc.text(`${university.phone}`, 75, 52);
  doc.text(`${university.tollFree}`, 75, 58);

  // Website
  doc.text(`Website: ${university.website}`, 75, 64);

  // Email addresses
  doc.text(`Email: ${university.email}`, 75, 70);
  doc.text(`Admissions: ${university.admissionsEmail}`, 140, 70);

  // Add decorative separator lines
  doc.setLineWidth(1);
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.line(75, 76, 195, 76);

  // Document title with enhanced styling
  doc.setFontSize(18);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('georgia', 'bold');
  doc.text(title, 20, 93);

  if (subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.setFont('georgia', 'normal');
    doc.text(subtitle, 20, 103);
  }

  // Add generation date with better positioning
  doc.setFontSize(8);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont('georgia', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 140, 118);

  // Add document reference number
  const referenceNumber = `REF-${Date.now().toString().slice(-6)}`;
  doc.setFontSize(7);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont('georgia', 'normal');
  doc.text(`Reference: ${referenceNumber}`, 20, 126);

  // Return the Y position where content should start
  return 145;
}

// Professional Footer Function
function addUniversityFooter(doc: jsPDF, pageNumber: number = 1, totalPages: number = 1): void {
  const pageHeight = doc.internal.pageSize.height;
  const { colors, university } = LETTERHEAD_CONFIG;

  // Add footer background with professional styling
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(11, pageHeight - 30, 188, 19, 'F');

  // Add decorative top border
  doc.setLineWidth(0.8);
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.line(11, pageHeight - 30, 199, pageHeight - 30);

  // Add accent line
  doc.setLineWidth(0.3);
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.line(11, pageHeight - 28, 199, pageHeight - 28);

  // Add small logo in footer with improved loading
  try {
    // Use cached logo if available
    if (logoImageCache) {
      try {
        // Scale down the cached logo for footer
        doc.addImage(logoImageCache, 'PNG', 15, pageHeight - 25, 12, 12);
      } catch (error) {
        createFooterTextLogo(doc, colors, pageHeight);
      }
    } else {
      // Fallback: Try direct loading for footer
      const paths = [
        '/jfk-logo.png',
        './jfk-logo.png',
        window.location.origin + '/jfk-logo.png'
      ];

      let success = false;
      for (const path of paths) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = path;

          let attempts = 0;
          const maxAttempts = 30; // ~0.6 seconds

          const checkImage = () => {
            attempts++;
            if (img.complete && img.naturalHeight !== 0) {
              try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);
                  const imgData = canvas.toDataURL('image/png');
                  doc.addImage(imgData, 'PNG', 15, pageHeight - 25, 12, 12);
                  success = true;
                }
              } catch (error) {
              }
            } else if (attempts < maxAttempts) {
              setTimeout(checkImage, 20);
            }
          };

          checkImage();

          if (success) break;

        } catch (error) {
        }
      }

      if (!success) {
        createFooterTextLogo(doc, colors, pageHeight);
      }
    }
  } catch (error) {
    createFooterTextLogo(doc, colors, pageHeight);
  }

  // Footer information
  doc.setFontSize(7);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont('helvetica', 'normal');

  // University name and school
  const universityText = `${university.name} - ${university.school}`;
  doc.text(universityText, 30, pageHeight - 23);

  // Contact information
  doc.text(`${university.website} | ${university.email}`, 30, pageHeight - 18);

  // Confidentiality notice
  doc.setFontSize(6);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.text('CONFIDENTIAL - For Authorized Personnel Only', 30, pageHeight - 13);

  // Page number with better styling
  doc.setFontSize(8);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  const pageText = `Page ${pageNumber}`;
  if (totalPages > 1) {
    const pageTextFull = `Page ${pageNumber} of ${totalPages}`;
    doc.text(pageTextFull, 170, pageHeight - 20);
  } else {
    doc.text(pageText, 175, pageHeight - 20);
  }

  // Add document generation timestamp
  doc.setFontSize(6);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.setFont('helvetica', 'normal');
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${timestamp}`, 140, pageHeight - 13);
}

// Professional Section Header
function addSectionHeader(doc: jsPDF, title: string, yPosition: number): number {
  const { colors } = LETTERHEAD_CONFIG;

  // Section background with gradient effect
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(15, yPosition - 3, 180, 14, 'F');

  // Section border - top and bottom
  doc.setLineWidth(0.8);
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.line(15, yPosition - 3, 195, yPosition - 3); // Top border

  doc.setLineWidth(0.3);
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.line(15, yPosition + 11, 195, yPosition + 11); // Bottom accent line

  // Section title with enhanced styling
  doc.setFontSize(12);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 20, yPosition + 5);

  // Add small decorative element
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(15, yPosition - 1, 3, 12, 'F');

  return yPosition + 20;
}

export function generateMonthlyTimeReport(report: MonthlyReport): void {
  const doc = new jsPDF();

  // Add professional university letterhead
  const contentStartY = addUniversityLetterhead(
    doc,
    'Monthly Time Report',
    'Employee Time Tracking Summary'
  );

  // Group entries by date
  const entriesByDate = report.dailyEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  // Calculate summary statistics
  const totalWorkingDays = Object.keys(entriesByDate).length;
  const avgHoursPerDay = totalWorkingDays > 0 ? report.totalHours / totalWorkingDays : 0;

  // Add employee information box with enhanced styling
  let yPosition = contentStartY;
  const { colors } = LETTERHEAD_CONFIG;

  // Employee info background with border
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(15, yPosition, 180, 30, 'F');

  doc.setLineWidth(0.5);
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, yPosition, 180, 30);

  // Header bar for employee info
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, yPosition, 180, 8, 'F');

  doc.setFontSize(9);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYEE INFORMATION', 20, yPosition + 6);

  // Employee details
  doc.setFontSize(10);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${report.userName}`, 25, yPosition + 15);
  doc.text(`Period: ${report.month}/${report.year}`, 25, yPosition + 22);
  doc.text(`Report Generated: ${new Date(report.generatedAt).toLocaleDateString()}`, 110, yPosition + 22);

  yPosition += 40;

  // Add summary statistics section
  yPosition = addSectionHeader(doc, 'Summary Statistics', yPosition);

  // Create enhanced statistics table
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(15, yPosition, 180, 25, 'F');

  doc.setLineWidth(0.5);
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, yPosition, 180, 25);

  // Vertical lines for table with better styling
  doc.setLineWidth(0.3);
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.line(75, yPosition, 75, yPosition + 25);
  doc.line(135, yPosition, 135, yPosition + 25);

  // Headers with enhanced styling
  doc.setFontSize(10);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');

  doc.text('Total Hours', 25, yPosition + 10);
  doc.text('Working Days', 85, yPosition + 10);
  doc.text('Avg Hours/Day', 145, yPosition + 10);

  // Values with enhanced styling
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(report.totalHours.toFixed(2), 35, yPosition + 18);
  doc.text(totalWorkingDays.toString(), 95, yPosition + 18);
  doc.text(avgHoursPerDay.toFixed(2), 155, yPosition + 18);

  yPosition += 35;

  // Daily breakdown section
  yPosition = addSectionHeader(doc, 'Daily Time Breakdown', yPosition);

  // Sort dates and display each day's summary
  Object.entries(entriesByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, entries]) => {
      const dailyTotal = entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
      // Parse date string as local date to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const dateStr = localDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Check if we need a new page
      if (yPosition > 230) {
        addUniversityFooter(doc, 1, 1);
        doc.addPage();
        yPosition = addUniversityLetterhead(doc, 'Monthly Time Report (Continued)', 'Employee Time Tracking Summary');
        yPosition = addSectionHeader(doc, 'Daily Time Breakdown (Continued)', yPosition);
      }

      // Enhanced day entry box
      const boxHeight = 20 + (entries.length * 7);
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.rect(15, yPosition, 180, boxHeight, 'F');

      doc.setLineWidth(0.5);
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(15, yPosition, 180, boxHeight);

      // Header bar for the day
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(15, yPosition, 180, 10, 'F');

      doc.setLineWidth(0.3);
      doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.line(15, yPosition + 10, 195, yPosition + 10);

      // Date and total with enhanced styling
      doc.setFontSize(11);
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(dateStr, 20, yPosition + 7);

      doc.setFontSize(10);
      doc.text(`${dailyTotal.toFixed(2)} hours`, 140, yPosition + 7);

      // Session details with better formatting
      doc.setFontSize(9);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont('helvetica', 'normal');

      entries.forEach((entry, index) => {
        const clockIn = new Date(entry.clockIn).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        const clockOut = entry.clockOut
          ? new Date(entry.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Active';
        const hours = entry.totalHours?.toFixed(2) || '0.00';
        const type = entry.isManual ? 'Manual' : 'Auto';

        const sessionText = `Session ${index + 1}: ${clockIn} - ${clockOut} | ${hours}h | ${type}`;
        doc.text(sessionText, 25, yPosition + 17 + (index * 7));

        // Add small indicator for session type
        const indicatorColor = entry.isManual ? colors.secondary : colors.accent;
        doc.setFillColor(indicatorColor[0], indicatorColor[1], indicatorColor[2]);
        doc.rect(20, yPosition + 14 + (index * 7), 2, 2, 'F');
      });

      yPosition += boxHeight + 8;
    });

  // Add professional footer
  addUniversityFooter(doc, 1, 1);

  // Save the PDF
  const fileName = `time-report-${report.userName.replace(/\s+/g, '-')}-${report.month}-${report.year}.pdf`;
  doc.save(fileName);
}

export function generateTimeSheet(entries: TimeEntry[], userName: string, startDate: string, endDate: string): void {
  const doc = new jsPDF();

  // Add professional university letterhead
  const contentStartY = addUniversityLetterhead(
    doc,
    'Time Sheet Report',
    'Detailed Time Tracking Records'
  );

  // Calculate summary statistics
  const totalHours = entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
  const totalSessions = entries.length;
  const workingDays = [...new Set(entries.map(entry => entry.date))].length;
  const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;

  // Add report information box
  let yPosition = contentStartY;
  doc.setFillColor(250, 250, 250);
  doc.rect(15, yPosition, 180, 30, 'F');

  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 45, 114);
  doc.rect(15, yPosition, 180, 30);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORT INFORMATION', 20, yPosition + 8);

  doc.setFont('helvetica', 'normal');
  doc.text(`Employee: ${userName}`, 25, yPosition + 15);
  doc.text(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, 25, yPosition + 20);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 110, yPosition + 25);

  yPosition += 40;

  // Add summary statistics
  yPosition = addSectionHeader(doc, 'Summary Statistics', yPosition);

  // Create statistics table
  doc.setFillColor(248, 249, 250);
  doc.rect(15, yPosition, 180, 25, 'F');
  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, yPosition, 180, 25);

  // Vertical lines for table
  doc.line(60, yPosition, 60, yPosition + 25);
  doc.line(105, yPosition, 105, yPosition + 25);
  doc.line(150, yPosition, 150, yPosition + 25);

  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');

  // Headers
  doc.text('Total Hours', 20, yPosition + 8);
  doc.text('Sessions', 65, yPosition + 8);
  doc.text('Working Days', 110, yPosition + 8);
  doc.text('Avg/Day', 155, yPosition + 8);

  // Values
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 45, 114);
  doc.setFontSize(10);
  doc.text(totalHours.toFixed(2), 25, yPosition + 18);
  doc.text(totalSessions.toString(), 75, yPosition + 18);
  doc.text(workingDays.toString(), 120, yPosition + 18);
  doc.text(avgHoursPerDay.toFixed(2), 160, yPosition + 18);

  yPosition += 35;

  // Detailed time entries section
  yPosition = addSectionHeader(doc, 'Detailed Time Entries', yPosition);

  // Group entries by date for better organization
  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  // Sort dates and display entries
  Object.entries(entriesByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, dayEntries]) => {
      // Parse date string as local date to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const dateStr = localDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Check if we need a new page
      if (yPosition > 220) {
        addUniversityFooter(doc, 1, 1);
        doc.addPage();
        yPosition = addUniversityLetterhead(doc, 'Time Sheet Report (Continued)', 'Detailed Time Tracking Records');
        yPosition = addSectionHeader(doc, 'Detailed Time Entries (Continued)', yPosition);
      }

      // Day entry box
      const boxHeight = 15 + (dayEntries.length * 8);
      doc.setFillColor(255, 255, 255);
      doc.rect(15, yPosition, 180, boxHeight, 'F');

      doc.setLineWidth(0.3);
      doc.setDrawColor(230, 230, 230);
      doc.rect(15, yPosition, 180, boxHeight);

      // Date header
      doc.setFontSize(10);
      doc.setTextColor(0, 45, 114);
      doc.setFont('helvetica', 'bold');
      doc.text(dateStr, 20, yPosition + 8);

      // Individual sessions
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'normal');
      dayEntries
        .sort((a, b) => a.clockIn - b.clockIn)
        .forEach((entry, index) => {
          const clockIn = new Date(entry.clockIn).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          const clockOut = entry.clockOut
            ? new Date(entry.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Active';
          const hours = entry.totalHours?.toFixed(2) || '0.00';
          const type = entry.isManual ? 'Manual' : 'Auto';

          const entryText = `${index + 1}. ${clockIn} - ${clockOut} | ${hours}h | ${type}`;
          doc.text(entryText, 25, yPosition + 15 + (index * 8));

          // Add notes if available
          if (entry.notes) {
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text(`   Note: ${entry.notes}`, 25, yPosition + 20 + (index * 8));
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
          }
        });

      yPosition += boxHeight + 5;
    });

  // Add summary section at the bottom
  const pageHeight = doc.internal.pageSize.height;

  // Check if we need a new page for summary
  if (yPosition > pageHeight - 45) {
    addUniversityFooter(doc, 1, 1);
    doc.addPage();
    yPosition = 30;
  }

  // Add final summary box
  doc.setFillColor(248, 249, 250);
  doc.rect(15, pageHeight - 40, 180, 30, 'F');

  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 45, 114);
  doc.rect(15, pageHeight - 40, 180, 30);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('PERIOD SUMMARY', 20, pageHeight - 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Total Hours: ${totalHours.toFixed(2)}h`, 25, pageHeight - 20);
  doc.text(`Working Days: ${workingDays}`, 100, pageHeight - 20);
  doc.text(`Average per Day: ${avgHoursPerDay.toFixed(2)}h`, 25, pageHeight - 12);
  doc.text(`Total Sessions: ${totalSessions}`, 100, pageHeight - 12);

  // Add professional footer
  addUniversityFooter(doc, 1, 1);

  // Save the PDF
  const fileName = `timesheet-${userName.replace(/\s+/g, '-')}-${startDate.replace(/-/g, '')}-to-${endDate.replace(/-/g, '')}.pdf`;
  doc.save(fileName);
}

// Generic University Document Generator
export interface UniversityDocumentOptions {
  title: string;
  subtitle?: string;
  recipientName?: string;
  recipientInfo?: string[];
  contentSections: {
    title: string;
    content: string[];
    tableData?: any[][];
    tableHeaders?: string[];
  }[];
  signatureRequired?: boolean;
  confidential?: boolean;
}

export function generateUniversityDocument(options: UniversityDocumentOptions): void {
  const doc = new jsPDF();

  // Add professional university letterhead
  const contentStartY = addUniversityLetterhead(
    doc,
    options.title,
    options.subtitle
  );

  let yPosition = contentStartY;

  // Add recipient information if provided
  if (options.recipientName || options.recipientInfo) {
    doc.setFillColor(250, 250, 250);
    doc.rect(15, yPosition, 180, 20 + (options.recipientInfo?.length || 0) * 6, 'F');

    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 45, 114);
    doc.rect(15, yPosition, 180, 20 + (options.recipientInfo?.length || 0) * 6);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIPIENT', 20, yPosition + 8);

    if (options.recipientName) {
      doc.setFont('helvetica', 'normal');
      doc.text(options.recipientName, 25, yPosition + 15);
    }

    if (options.recipientInfo) {
      options.recipientInfo.forEach((info, index) => {
        doc.text(info, 25, yPosition + 21 + (index * 6));
      });
    }

    yPosition += 30 + (options.recipientInfo?.length || 0) * 6;
  }

  // Add content sections
  options.contentSections.forEach((section, sectionIndex) => {
    // Check if we need a new page
    if (yPosition > 220) {
      addUniversityFooter(doc, 1, 1);
      doc.addPage();
      yPosition = addUniversityLetterhead(doc, `${options.title} (Continued)`, options.subtitle);
    }

    yPosition = addSectionHeader(doc, section.title, yPosition);

    // Add section content
    section.content.forEach((line) => {
      if (yPosition > 250) {
        addUniversityFooter(doc, 1, 1);
        doc.addPage();
        yPosition = addUniversityLetterhead(doc, `${options.title} (Continued)`, options.subtitle);
        yPosition = addSectionHeader(doc, `${section.title} (Continued)`, yPosition);
      }

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(line, 20, yPosition);
      yPosition += 8;
    });

    // Add table if provided
    if (section.tableData && section.tableHeaders) {
      yPosition += 5;

      // Table header
      doc.setFillColor(248, 249, 250);
      doc.rect(15, yPosition, 180, 12, 'F');
      doc.setLineWidth(0.3);
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, yPosition, 180, 12);

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'bold');

      section.tableHeaders.forEach((header, index) => {
        const xPos = 20 + (index * 55);
        doc.text(header, xPos, yPosition + 8);
      });

      yPosition += 15;

      // Table rows
      section.tableData.forEach((row, rowIndex) => {
        if (yPosition > 250) {
          addUniversityFooter(doc, 1, 1);
          doc.addPage();
          yPosition = addUniversityLetterhead(doc, `${options.title} (Continued)`, options.subtitle);
          yPosition = addSectionHeader(doc, `${section.title} (Continued)`, yPosition);
        }

        doc.setFillColor(rowIndex % 2 === 0 ? 255 : 250, 250, 250);
        doc.rect(15, yPosition - 2, 180, 10, 'F');
        doc.setLineWidth(0.3);
        doc.rect(15, yPosition - 2, 180, 10);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        row.forEach((cell, cellIndex) => {
          const xPos = 20 + (cellIndex * 55);
          doc.text(cell.toString(), xPos, yPosition + 5);
        });

        yPosition += 12;
      });

      yPosition += 10;
    }

    // Add space between sections
    if (sectionIndex < options.contentSections.length - 1) {
      yPosition += 5;
    }
  });

  // Add signature section if required
  if (options.signatureRequired) {
    const pageHeight = doc.internal.pageSize.height;

    if (yPosition > pageHeight - 60) {
      addUniversityFooter(doc, 1, 1);
      doc.addPage();
      yPosition = 30;
    }

    yPosition = pageHeight - 50;

    // Signature lines
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 45, 114);
    doc.line(40, yPosition, 120, yPosition);
    doc.line(140, yPosition + 20, 180, yPosition + 20);

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signature', 50, yPosition + 8);
    doc.text('Date', 150, yPosition + 28);
  }

  // Add confidentiality notice if required
  if (options.confidential) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'italic');
    doc.text('CONFIDENTIAL - For Authorized Personnel Only', 20, pageHeight - 15);
  }

  // Add professional footer
  addUniversityFooter(doc, 1, 1);

  // Generate filename
  const fileName = `${options.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// Transcript Generator (Example usage)
export function generateTranscript(studentInfo: {
  name: string;
  id: string;
  program: string;
  courses: {
    code: string;
    name: string;
    grade: string;
    credits: number;
    semester: string;
  }[];
}): void {
  const totalCredits = studentInfo.courses.reduce((sum, course) => sum + course.credits, 0);
  const gpa = calculateGPA(studentInfo.courses);

  const options: UniversityDocumentOptions = {
    title: 'Academic Transcript',
    subtitle: 'Official Student Record',
    recipientName: studentInfo.name,
    recipientInfo: [
      `Student ID: ${studentInfo.id}`,
      `Program: ${studentInfo.program}`,
      `Total Credits: ${totalCredits}`,
      `GPA: ${gpa.toFixed(2)}`
    ],
    contentSections: [
      {
        title: 'Academic Record',
        content: [
          'This transcript certifies the academic record of the above-named student.',
          'All courses and grades listed are official and cannot be altered without authorization.'
        ],
        tableHeaders: ['Course Code', 'Course Name', 'Grade', 'Credits', 'Semester'],
        tableData: studentInfo.courses.map(course => [
          course.code,
          course.name,
          course.grade,
          course.credits.toString(),
          course.semester
        ])
      }
    ],
    signatureRequired: true,
    confidential: true
  };

  generateUniversityDocument(options);
}

// Helper function to calculate GPA
function calculateGPA(courses: { grade: string; credits: number }[]): number {
  const gradePoints: { [key: string]: number } = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const points = gradePoints[course.grade] || 0;
    totalPoints += points * course.credits;
    totalCredits += course.credits;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

// Test function to generate a sample document with your actual logo
export function generateLogoTestDocument(): void {
  const doc = new jsPDF();

  // Add the letterhead with your actual logo and updated information
  const contentStartY = addUniversityLetterhead(doc, 'Logo Test Document', 'Testing JFK University School of Medicine');

  // Add some test content
  let yPosition = contentStartY;
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont('georgia', 'normal');
  doc.text('This document tests the updated JFK University School of Medicine branding.', 20, yPosition);
  yPosition += 10;

  doc.text('Your PNG logo should appear in the header with the correct university information.', 20, yPosition);
  yPosition += 10;

  doc.text('The header now displays the complete university name and contact details.', 20, yPosition);
  yPosition += 10;

  doc.text('Georgia font is used throughout the header for professional appearance.', 20, yPosition);
  yPosition += 15;

  // Add a section header
  yPosition = addSectionHeader(doc, 'University Information Test', yPosition);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.setFont('georgia', 'normal');
  doc.text('✓ University: JOHN F. KENNEDY UNIVERSITY SCHOOL OF MEDICINE', 25, yPosition);
  yPosition += 8;
  doc.text('✓ Campus: Pareraweg 45, Willemstad Curacao', 25, yPosition);
  yPosition += 8;
  doc.text('✓ USA Office: 190 N, Main St. Suite # 202, Natick, MA 01762', 25, yPosition);
  yPosition += 8;
  doc.text('✓ Phone: (5999) 6761281, (5999) 6810527 | Toll Free: 1-888-481-9201', 25, yPosition);
  yPosition += 8;
  doc.text('✓ Website: www.jfkuniversity.org', 25, yPosition);

  // Add footer with your logo
  addUniversityFooter(doc, 1, 1);

  // Save the test document
  doc.save('jfk-university-test-document.pdf');
}

// Initialize logo cache on app startup
function initializeLogoCache(): Promise<void> {
  return new Promise((resolve) => {
    if (logoLoadAttempted) {
      resolve();
      return;
    }

    preloadLogo().then((result) => {
      if (result) {
      } else {
      }
      resolve();
    });
  });
}

// Quick logo test function that can be called from browser console
function testLogoInBrowser(): void {

  // Try to load the logo image
  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    generateLogoTestDocument();
  };

  img.onerror = () => {
    generateLogoTestDocument();
  };

  img.src = window.location.origin + '/jfk-logo.png';
}

// Debug function to check logo cache status
function debugLogoStatus(): void {

  if (logoImageCache) {
  } else {
  }

  // Test current logo URL accessibility
  fetch('/jfk-logo.png')
    .then(response => {
      if (response.ok) {
      } else {
      }
    })
    .catch(error => {
    });
}

// Auto-initialize logo cache when module is loaded
if (typeof window !== 'undefined') {
  initializeLogoCache().then(() => {
  });
}

// Export functions for external use
export {
  addUniversityLetterhead,
  addUniversityFooter,
  addSectionHeader,
  LETTERHEAD_CONFIG,
  initializeLogoCache,
  testLogoInBrowser,
  debugLogoStatus
};
