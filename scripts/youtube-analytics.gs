/**
 * Google Apps Script - YouTube Analytics Automation
 * YouTube channel के analytics को automatically track करता है
 */

/**
 * Main function to get YouTube analytics and send reports
 */
function getYouTubeAnalytics() {
  try {
    // Get analytics for the last 30 days
    var endDate = new Date();
    var startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    var analytics = YouTube.Analytics.Reports.query({
      'ids': 'channel==MINE',
      'start-date': formatDate(startDate),
      'end-date': formatDate(endDate),
      'metrics': 'views,likes,comments,shares,subscribersGained,estimatedMinutesWatched'
    });
    
    if (analytics.rows && analytics.rows.length > 0) {
      var data = analytics.rows[0];
      var report = {
        views: data[0],
        likes: data[1],
        comments: data[2],
        shares: data[3],
        subscribersGained: data[4],
        watchTimeMinutes: data[5]
      };
      
      // Send report via email
      sendAnalyticsEmail(report, startDate, endDate);
      
      // Save to Google Sheets
      saveToSheet(report, endDate);
      
      // Send WhatsApp notification (if configured)
      sendWhatsAppNotification(report);
      
      console.log('YouTube analytics report generated successfully');
    }
  } catch (error) {
    console.error('Error getting YouTube analytics:', error);
  }
}

/**
 * Send analytics report via email
 */
function sendAnalyticsEmail(report, startDate, endDate) {
  var subject = `YouTube Analytics Report - ${formatDate(startDate)} to ${formatDate(endDate)}`;
  
  var body = `
YouTube Channel Performance Report

📊 Overview (Last 30 Days):
• Views: ${report.views.toLocaleString()}
• Likes: ${report.likes.toLocaleString()}
• Comments: ${report.comments.toLocaleString()}
• Shares: ${report.shares.toLocaleString()}
• New Subscribers: ${report.subscribersGained.toLocaleString()}
• Watch Time: ${Math.round(report.watchTimeMinutes/60).toLocaleString()} hours

📈 Key Metrics:
• Engagement Rate: ${((report.likes + report.comments) / report.views * 100).toFixed(2)}%
• Average View Duration: ${(report.watchTimeMinutes / report.views).toFixed(2)} minutes
• Subscriber Growth Rate: ${report.subscribersGained} new subscribers

🎯 Recommendations:
• Continue creating content similar to your top-performing videos
• Focus on improving engagement through better thumbnails and titles
• Encourage more comments by asking questions in your videos

Generated automatically by YouTube Analytics Automation
  `;
  
  GmailApp.sendEmail(
    Session.getActiveUser().getEmail(),
    subject,
    body
  );
}

/**
 * Save analytics data to Google Sheets
 */
function saveToSheet(report, date) {
  try {
    var spreadsheet = getOrCreateSpreadsheet('YouTube Analytics Dashboard');
    var sheet = getOrCreateSheet(spreadsheet, 'Daily Analytics');
    
    // Set headers if this is a new sheet
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Date', 'Views', 'Likes', 'Comments', 'Shares', 'Subscribers Gained', 'Watch Time (minutes)'
      ]]);
    }
    
    // Add new data
    sheet.appendRow([
      date,
      report.views,
      report.likes,
      report.comments,
      report.shares,
      report.subscribersGained,
      report.watchTimeMinutes
    ]);
    
    console.log('Data saved to Google Sheets successfully');
  } catch (error) {
    console.error('Error saving to sheet:', error);
  }
}

/**
 * Send WhatsApp notification (requires WhatsApp Business API)
 */
function sendWhatsAppNotification(report) {
  try {
    var message = `🚀 YouTube Update!\n\nViews: ${report.views.toLocaleString()}\nLikes: ${report.likes.toLocaleString()}\nNew Subscribers: ${report.subscribersGained}\n\nKeep up the great work! 💪`;
    
    // Replace with your WhatsApp Business API endpoint
    var whatsappApiUrl = 'YOUR_WHATSAPP_API_URL';
    var phoneNumber = 'YOUR_PHONE_NUMBER';
    
    if (whatsappApiUrl !== 'YOUR_WHATSAPP_API_URL') {
      var payload = {
        'phone': phoneNumber,
        'text': message
      };
      
      UrlFetchApp.fetch(whatsappApiUrl, {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
        'payload': JSON.stringify(payload)
      });
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
  }
}

/**
 * Get trending topics for content creation
 */
function getTrendingTopics() {
  try {
    // Get popular videos in your category
    var searchResponse = YouTube.Search.list('snippet', {
      'q': 'trending topics', // Modify based on your niche
      'type': 'video',
      'order': 'viewCount',
      'publishedAfter': formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) + 'T00:00:00Z',
      'maxResults': 10
    });
    
    var topics = [];
    searchResponse.items.forEach(function(item) {
      topics.push({
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        videoId: item.id.videoId
      });
    });
    
    // Save trending topics to sheet
    saveTrendingTopics(topics);
    
    return topics;
  } catch (error) {
    console.error('Error getting trending topics:', error);
    return [];
  }
}

/**
 * Save trending topics for content inspiration
 */
function saveTrendingTopics(topics) {
  try {
    var spreadsheet = getOrCreateSpreadsheet('YouTube Analytics Dashboard');
    var sheet = getOrCreateSheet(spreadsheet, 'Trending Topics');
    
    // Clear previous data and add headers
    sheet.clear();
    sheet.getRange(1, 1, 1, 4).setValues([['Title', 'Channel', 'Published', 'Video ID']]);
    
    // Add trending topics
    topics.forEach(function(topic, index) {
      sheet.getRange(index + 2, 1, 1, 4).setValues([[
        topic.title,
        topic.channel,
        topic.publishedAt,
        topic.videoId
      ]]);
    });
    
    console.log('Trending topics saved successfully');
  } catch (error) {
    console.error('Error saving trending topics:', error);
  }
}

/**
 * Utility functions
 */
function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function getOrCreateSpreadsheet(name) {
  var files = DriveApp.getFilesByName(name);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  } else {
    return SpreadsheetApp.create(name);
  }
}

function getOrCreateSheet(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * Set up daily analytics trigger
 */
function setupYouTubeAutomation() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'getYouTubeAnalytics') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create daily trigger at 9 AM
  ScriptApp.newTrigger('getYouTubeAnalytics')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
    
  // Create weekly trigger for trending topics (Mondays at 10 AM)
  ScriptApp.newTrigger('getTrendingTopics')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(10)
    .create();
    
  console.log('YouTube automation triggers set up successfully');
}

/**
 * Test function to run manually
 */
function testYouTubeAutomation() {
  console.log('Testing YouTube automation...');
  getYouTubeAnalytics();
  getTrendingTopics();
  console.log('Test completed');
}