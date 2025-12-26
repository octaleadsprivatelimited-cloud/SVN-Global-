# Test Reports Upload Guide

## How to Add Your Test Reports

### Step 1: Add PDF Files
1. Copy all your test report PDF files to the `frontend/public/` directory
2. Name them descriptively (e.g., `Mica_Test_Report_May_2025.pdf`, `Quartz_Quality_Report_April_2025.pdf`)

### Step 2: Update Test Reports Data
Open `frontend/src/pages/TestReports.jsx` and update the `testReports` array:

```javascript
const testReports = [
  {
    id: 1,
    title: 'Your Report Title',
    category: 'Mica', // or 'Quartz', 'Certifications'
    date: 'June 2025',
    description: 'Description of your test report',
    file: '/Your_Report_Filename.pdf', // Path to file in public folder
    certifications: ['NABL Accredited', 'ISO Certified'], // Add relevant certifications
    parameters: ['Parameter 1', 'Parameter 2', 'Parameter 3'], // Test parameters
  },
  // Add more reports...
]
```

### Step 3: Report Properties

Each test report object should have:
- **id**: Unique number (1, 2, 3, etc.)
- **title**: Report title
- **category**: 'Mica', 'Quartz', or 'Certifications'
- **date**: Month and year (e.g., 'June 2025')
- **description**: Brief description of the report
- **file**: Path to PDF file (starts with `/`)
- **certifications**: Array of certification names
- **parameters**: Array of test parameters covered

### Step 4: Categories
The page supports filtering by:
- All
- Mica
- Quartz
- Certifications

### Example Report Entry

```javascript
{
  id: 7,
  title: 'Electrical Grade Mica - July 2025',
  category: 'Mica',
  date: 'July 2025',
  description: 'Complete quality test report for electrical grade mica covers with dielectric strength analysis and thermal properties testing.',
  file: '/Electrical_Mica_July_2025.pdf',
  certifications: ['ISO 9001', 'IEC Standards', 'NABL Accredited', 'RoHS Compliant'],
  parameters: ['Dielectric Strength', 'Thermal Conductivity', 'Chemical Composition', 'Insulation Resistance'],
}
```

## Features

✅ **Search Functionality**: Users can search reports by title or description
✅ **Category Filtering**: Filter by Mica, Quartz, or Certifications
✅ **Detailed Modal View**: Click any report card to see full details
✅ **Download Links**: Direct download buttons for each report
✅ **Responsive Design**: Works on all devices
✅ **Modern UI**: Professional card-based layout

## File Structure

```
frontend/
├── public/
│   ├── Quartz_Test_Report_June_2025.pdf
│   ├── Mica_Test_Report_May_2025.pdf
│   ├── Your_Report_1.pdf
│   ├── Your_Report_2.pdf
│   └── ... (all your PDF files)
└── src/
    └── pages/
        └── TestReports.jsx (update the testReports array here)
```

## Tips

1. **File Naming**: Use descriptive, consistent naming (e.g., `Product_Type_Date.pdf`)
2. **File Size**: Optimize PDFs if they're very large for faster loading
3. **Descriptions**: Write clear, informative descriptions
4. **Certifications**: List all relevant certifications for each report
5. **Parameters**: Include key test parameters to help users find relevant reports

## Access the Page

Once set up, users can access the Test Reports page at:
- URL: `http://localhost:3000/test-reports`
- Navigation: "Test Reports" link in the header menu

