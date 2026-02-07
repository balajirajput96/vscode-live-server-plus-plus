const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('🚀 Starting PDF generation with 2-page layout...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Load the HTML file
    const htmlPath = path.join(__dirname, 'resume', 'Balaji_Rajput_Resume.html');
    console.log('📂 Loading: ' + htmlPath);
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    
    // Hide the no-print buttons
    await page.evaluate(() => {
        const noprint = document.querySelector('.no-print');
        if (noprint) noprint.style.display = 'none';
    });
    
    // Generate PDF with proper page breaks
    const pdfPath = path.join(__dirname, 'resume', 'Balaji_Rajput_Resume.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully!');
    console.log('📄 File saved: ' + pdfPath);
    
    // Get file size
    const stats = fs.statSync(pdfPath);
    console.log('📊 File size: ' + (stats.size / 1024).toFixed(2) + ' KB');
}

generatePDF().catch(console.error);
