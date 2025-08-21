/**
 * Google Apps Script - Gmail Auto-Organization
 * सभी emails को automatically categories में sort करता है
 */

function organizeEmails() {
  try {
    // Get unread emails
    var threads = GmailApp.search('is:unread', 0, 50);
    console.log(`Processing ${threads.length} unread emails`);
    
    threads.forEach(function(thread) {
      var firstMessage = thread.getMessages()[0];
      var sender = firstMessage.getFrom();
      var subject = firstMessage.getSubject();
      
      // Create labels if they don't exist
      createLabelIfNotExists('Work');
      createLabelIfNotExists('Personal');
      createLabelIfNotExists('GitHub');
      createLabelIfNotExists('LinkedIn');
      createLabelIfNotExists('Bills');
      createLabelIfNotExists('Shopping');
      
      // Auto-categorize based on sender and subject
      if (sender.includes('@github.com') || subject.includes('[GitHub]')) {
        thread.addLabel(GmailApp.getUserLabelByName('GitHub'));
      } else if (sender.includes('@linkedin.com') || subject.includes('LinkedIn')) {
        thread.addLabel(GmailApp.getUserLabelByName('LinkedIn'));
      } else if (isWorkEmail(sender)) {
        thread.addLabel(GmailApp.getUserLabelByName('Work'));
      } else if (isBillEmail(sender, subject)) {
        thread.addLabel(GmailApp.getUserLabelByName('Bills'));
      } else if (isShoppingEmail(sender, subject)) {
        thread.addLabel(GmailApp.getUserLabelByName('Shopping'));
      } else {
        thread.addLabel(GmailApp.getUserLabelByName('Personal'));
      }
    });
    
    console.log('Email organization completed successfully');
  } catch (error) {
    console.error('Error organizing emails:', error);
  }
}

function createLabelIfNotExists(labelName) {
  try {
    GmailApp.getUserLabelByName(labelName);
  } catch (e) {
    GmailApp.createLabel(labelName);
  }
}

function isWorkEmail(sender) {
  var workDomains = ['company.com', 'organization.org']; // Add your work domains
  return workDomains.some(domain => sender.includes(domain));
}

function isBillEmail(sender, subject) {
  var billKeywords = ['bill', 'invoice', 'payment', 'statement', 'due', 'credit card'];
  var billSenders = ['bank', 'electricity', 'phone', 'internet'];
  
  return billKeywords.some(keyword => subject.toLowerCase().includes(keyword)) ||
         billSenders.some(sender_keyword => sender.toLowerCase().includes(sender_keyword));
}

function isShoppingEmail(sender, subject) {
  var shoppingSites = ['amazon', 'flipkart', 'myntra', 'zomato', 'swiggy'];
  var shoppingKeywords = ['order', 'delivery', 'shipped', 'discount', 'sale'];
  
  return shoppingSites.some(site => sender.toLowerCase().includes(site)) ||
         shoppingKeywords.some(keyword => subject.toLowerCase().includes(keyword));
}

/**
 * Set up trigger to run every 30 minutes
 * Run this function once to set up automatic email organization
 */
function setupEmailAutomation() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'organizeEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger
  ScriptApp.newTrigger('organizeEmails')
    .timeBased()
    .everyMinutes(30)
    .create();
    
  console.log('Email automation trigger set up successfully');
}

/**
 * Smart Reply Generator
 * Automatically suggests replies for common emails
 */
function generateSmartReplies() {
  var drafts = GmailApp.getDrafts();
  
  drafts.forEach(function(draft) {
    var message = draft.getMessage();
    var subject = message.getSubject();
    var body = message.getBody();
    
    // Generate smart reply suggestions
    var suggestions = generateReplySuggestions(subject, body);
    
    // Add suggestions as a comment (you can modify this to suit your needs)
    console.log(`Smart reply suggestions for "${subject}":`, suggestions);
  });
}

function generateReplySuggestions(subject, body) {
  var suggestions = [];
  
  if (subject.toLowerCase().includes('meeting')) {
    suggestions.push("I'm available for the meeting. Please send me the agenda.");
    suggestions.push("Let me check my calendar and get back to you.");
  }
  
  if (subject.toLowerCase().includes('interview')) {
    suggestions.push("Thank you for the opportunity. I'm excited to discuss this role.");
    suggestions.push("I'm available for the interview at your convenience.");
  }
  
  if (body.toLowerCase().includes('thank you')) {
    suggestions.push("You're welcome! Happy to help.");
    suggestions.push("Glad I could assist. Let me know if you need anything else.");
  }
  
  return suggestions;
}