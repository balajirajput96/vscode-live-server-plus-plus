# 📊 Google Sheets Templates for n8n Automation

**Complete spreadsheet templates for your AI career automation system**

---

## 📋 Overview

यह Google Sheets template package आपके n8n automation workflows के लिए तैयार किया गया है। इसमें सभी जरूरी sheets हैं जो आपके AI-powered career system को perfect तरीके से manage करती हैं।

---

## 🗂️ Template Structure

### Main Spreadsheet: "Career Automation Master"

#### Sheet 1: Projects
**Purpose:** Store project details for automated content generation

| Column | Header | Data Type | Example |
|--------|--------|-----------|---------|
| A | Project | Text | "Protein Structure Analysis" |
| B | Description | Text | "Machine learning model to predict protein folding patterns" |
| C | Tools | Text | "Python, TensorFlow, BioPython, Pandas" |
| D | Results | Text | "Achieved 87% accuracy in predicting secondary structures" |
| E | Status | Text | "Completed" |
| F | Date Added | Date | "2024-01-15" |
| G | Posted | Boolean | "FALSE" |
| H | Next Post Date | Date | "2024-01-22" |

**Sample Data:**
```
Row 2: Protein Structure Analysis | Machine learning model to predict protein folding patterns | Python, TensorFlow, BioPython, Pandas | Achieved 87% accuracy in predicting secondary structures | Completed | 2024-01-15 | FALSE | 2024-01-22

Row 3: Clinical Data Mining | Patient response prediction for drug efficacy studies | R, SQL, ggplot2, dplyr | Developed model with 78% prediction accuracy | Completed | 2024-01-20 | FALSE | 2024-01-29

Row 4: Gene Expression Analysis | RNA-seq data analysis for cancer biomarker discovery | Python, DESeq2, Matplotlib | Identified 15 potential biomarkers with statistical significance | In Progress | 2024-01-25 | FALSE | 2024-02-05
```

#### Sheet 2: Analytics
**Purpose:** Track automation performance and social media metrics

| Column | Header | Data Type | Example |
|--------|--------|-----------|---------|
| A | Date | Date | "2024-01-15" |
| B | Project | Text | "Protein Structure Analysis" |
| C | Action | Text | "LinkedIn Post Generated" |
| D | Platform | Text | "LinkedIn" |
| E | Status | Text | "Scheduled" |
| F | Engagement | Number | "45" |
| G | Likes | Number | "12" |
| H | Comments | Number | "3" |
| I | Shares | Number | "2" |
| J | Portfolio Clicks | Number | "8" |

#### Sheet 3: Content Calendar
**Purpose:** Plan and schedule future content

| Column | Header | Data Type | Example |
|--------|--------|-----------|---------|
| A | Week Starting | Date | "2024-01-22" |
| B | Project Scheduled | Text | "Clinical Data Mining" |
| C | Content Type | Text | "LinkedIn + Facebook Post" |
| D | AI Tool Used | Text | "ChatGPT + Predis AI" |
| E | Status | Text | "Scheduled" |
| F | Notes | Text | "Focus on healthcare applications" |

#### Sheet 4: Job Applications
**Purpose:** Track job applications for automated follow-ups

| Column | Header | Data Type | Example |
|--------|--------|-----------|---------|
| A | Company | Text | "Sun Pharma" |
| B | Position | Text | "Bioinformatics Scientist" |
| C | Application Date | Date | "2024-01-15" |
| D | Contact Person | Text | "Dr. Priya Sharma" |
| E | Contact Email | Email | "priya.sharma@sunpharma.com" |
| F | Status | Text | "Applied" |
| G | Last Follow-up | Date | "" |
| H | Notes | Text | "Applied through LinkedIn" |
| I | Follow-up Needed | Boolean | "TRUE" |

#### Sheet 5: Network Contacts
**Purpose:** Manage professional networking automation

| Column | Header | Data Type | Example |
|--------|--------|-----------|---------|
| A | Name | Text | "Dr. Rajesh Kumar" |
| B | Company | Text | "Zydus Cadila" |
| C | Position | Text | "Head of Bioinformatics" |
| D | LinkedIn URL | URL | "linkedin.com/in/rajeshkumar" |
| E | Connection Status | Text | "Connected" |
| F | Last Interaction | Date | "2024-01-10" |
| G | Next Contact Date | Date | "2024-02-10" |
| H | Notes | Text | "Met at biotech conference, interested in AI applications" |

---

## 🔧 Setup Instructions

### Step 1: Create the Spreadsheet
```bash
1. Go to sheets.google.com
2. Click "Blank" to create new spreadsheet
3. Rename to "Career Automation Master"
4. Create 5 sheets with names above
```

### Step 2: Setup Column Headers
```bash
For each sheet:
1. Add column headers in Row 1
2. Format headers (Bold, background color)
3. Freeze Row 1 (View → Freeze → 1 row)
4. Set column widths appropriately
```

### Step 3: Add Data Validation
```bash
Status columns (Projects Sheet):
- Data → Data validation
- List of items: "Completed,In Progress,Planned"

Posted column (Projects Sheet):
- Data → Data validation  
- Checkbox

Platform column (Analytics Sheet):
- List: "LinkedIn,Facebook,Twitter,GitHub,Portfolio"
```

### Step 4: Add Formulas

#### Auto-calculate Next Post Date:
```excel
In cell H2 (Projects sheet):
=IF(G2=TRUE, "", F2+7)
```

#### Count Analytics by Platform:
```excel
In a summary section:
LinkedIn Posts: =COUNTIF(Analytics!D:D,"LinkedIn")
Facebook Posts: =COUNTIF(Analytics!D:D,"Facebook")
```

#### Follow-up Needed (Job Applications):
```excel
In cell I2:
=IF(AND(F2="Applied",G2="",TODAY()-C2>=7),"TRUE","FALSE")
```

### Step 5: Share with n8n
```bash
1. Click "Share" button
2. Add service account email from Google Cloud
3. Set permission to "Editor"
4. Copy sheet ID from URL
5. Update n8n workflow with sheet ID
```

---

## 📈 Advanced Features

### Conditional Formatting
```bash
1. Select Status column in Projects sheet
2. Format → Conditional formatting
3. Custom formula: =$E2="Completed"
4. Set green background

5. For overdue follow-ups:
6. Select Follow-up Needed column
7. Custom formula: =$I2="TRUE"
8. Set red background
```

### Charts and Dashboards
```bash
1. Insert → Chart
2. Select Analytics data range
3. Chart type: Column chart
4. Show engagement trends over time

5. Create pie chart for platforms
6. Show distribution of posts across platforms
```

### Google Apps Script Automation
```javascript
// Auto-mark posts as published after 24 hours
function markPostsPublished() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  for (let i = 1; i < values.length; i++) {
    const nextPostDate = values[i][7]; // Column H
    const posted = values[i][6]; // Column G
    
    if (!posted && nextPostDate && new Date() > nextPostDate) {
      sheet.getRange(i + 1, 7).setValue(true);
    }
  }
}

// Set up trigger to run daily
function createTrigger() {
  ScriptApp.newTrigger('markPostsPublished')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}
```

---

## 🔍 n8n Integration Points

### Reading Project Data
```json
{
  "node": "Google Sheets",
  "operation": "Read",
  "sheetId": "YOUR_SHEET_ID",
  "range": "Projects!A2:H2",
  "filter": "Posted = FALSE"
}
```

### Writing Analytics Data
```json
{
  "node": "Google Sheets", 
  "operation": "Append",
  "sheetId": "YOUR_SHEET_ID",
  "range": "Analytics!A:J",
  "values": [
    ["{{new Date().toISOString()}}", "{{$json.project}}", "Post Generated", "LinkedIn", "Scheduled", "", "", "", "", ""]
  ]
}
```

### Updating Status
```json
{
  "node": "Google Sheets",
  "operation": "Update", 
  "sheetId": "YOUR_SHEET_ID",
  "range": "Projects!G{{$json.rowNumber}}",
  "values": [["TRUE"]]
}
```

---

## 📊 Reporting Templates

### Weekly Report
```sql
-- Use Google Sheets QUERY function
=QUERY(Analytics!A:J, "SELECT A, COUNT(A) WHERE A >= date '"&TEXT(TODAY()-7,"YYYY-MM-DD")&"' GROUP BY A ORDER BY A")
```

### Monthly Summary
```excel
=SUMIFS(Analytics!F:F, Analytics!A:A, ">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1), Analytics!A:A, "<"&DATE(YEAR(TODAY()),MONTH(TODAY())+1,1))
```

### Engagement Rate
```excel
=AVERAGE(Analytics!F:F)
```

---

## 🔐 Security & Permissions

### Best Practices:
1. **Limited Sharing**: Only share with necessary service accounts
2. **Regular Audits**: Review sharing permissions monthly
3. **Data Backup**: Download copies regularly
4. **Version History**: Use Google Sheets version control

### Service Account Setup:
```bash
1. Go to Google Cloud Console
2. Create service account
3. Download JSON credentials
4. Share sheet with service account email
5. Use credentials in n8n
```

---

## 🚀 Quick Start Checklist

- [ ] Create Google Sheet with 5 tabs
- [ ] Add column headers and data validation
- [ ] Add sample data (3-5 projects)
- [ ] Set up conditional formatting
- [ ] Share with n8n service account
- [ ] Copy sheet ID to n8n workflow
- [ ] Test read/write operations
- [ ] Set up automated triggers

---

## 📞 Support

### Common Issues:
- **Permission Errors**: Check service account sharing
- **Data Not Found**: Verify sheet names and ranges
- **Formula Errors**: Check cell references and syntax

### Resources:
- Google Sheets Help Center
- n8n Google Sheets documentation
- Apps Script reference

---

**🎯 यह template आपके complete automation system का foundation है। Setup करने के बाद सब कुछ automated हो जाएगा!**

---

*Template Version: 2.0*  
*Compatible with: n8n, Google Apps Script, all automation workflows*