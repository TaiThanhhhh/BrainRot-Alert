// Advanced Telegram Config with Multi-Bot Support
const BOT_TOKEN = '7664843004:AAFyvHmsL8uRnNWYqg2ajRkVGKcvy-4ztIk';
const CHAT_ID = '5333667902';

// AI Analysis Engine
class AIAnalysisEngine {
  constructor() {
    this.brainRotPatterns = [
      // Basic patterns
      /\b(skibidi|ohio|rizz|sigma|gyat|fanum\s*tax|mewing|sus|sussy|amogus)\b/gi,
      // Advanced patterns
      /\b(no\s*cap|bussin|sheesh|periodt|slay|based|cringe)\b/gi,
      // Contextual patterns
      /\b(alpha|beta)\s*(male|energy|grindset)\b/gi,
      /\b(toxic|problematic)\s*(behavior|content)\b/gi
    ];
    
    this.productivityKeywords = ['productivity', 'learning', 'education', 'tutorial', 'guide'];
    this.wellnessKeywords = ['wellness', 'mental health', 'mindfulness', 'meditation'];
  }

  // Advanced sentiment analysis
  analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'stupid', 'waste', 'boring'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return {
      score,
      sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  }

  // Content quality scoring
  calculateContentQuality(text, metadata) {
    let qualityScore = 50; // Base score
    
    // Length factor
    if (text.length > 1000) qualityScore += 10;
    if (text.length < 100) qualityScore -= 15;
    
    // Educational content boost
    this.productivityKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) qualityScore += 5;
    });
    
    // Brain rot penalty
    this.brainRotPatterns.forEach(pattern => {
      const matches = (text.match(pattern) || []).length;
      qualityScore -= matches * 3;
    });
    
    // Readability (simple metric)
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence > 20) qualityScore -= 5; // Too complex
    if (avgWordsPerSentence < 5) qualityScore -= 10; // Too simple/fragmented
    
    return Math.max(0, Math.min(100, qualityScore));
  }
}

// Enhanced Analytics System
class AnalyticsEngine {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      sitesVisited: new Set(),
      brainRotDetections: 0,
      totalTimeSpent: 0,
      productiveTime: 0,
      categories: {}
    };
  }

  async saveSessionData() {
    const data = {
      ...this.sessionData,
      sitesVisited: Array.from(this.sessionData.sitesVisited),
      timestamp: Date.now()
    };
    
    // Save to storage
    const existingSessions = await this.getStoredSessions();
    existingSessions.push(data);
    
    // Keep only last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentSessions = existingSessions.filter(s => s.timestamp > thirtyDaysAgo);
    
    chrome.storage.local.set({ sessions: recentSessions });
  }

  async getStoredSessions() {
    const result = await chrome.storage.local.get(['sessions']);
    return result.sessions || [];
  }

  async generateWeeklyReport() {
    const sessions = await this.getStoredSessions();
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weekSessions = sessions.filter(s => s.timestamp > weekAgo);
    
    const report = {
      totalSites: new Set(weekSessions.flatMap(s => s.sitesVisited)).size,
      totalBrainRot: weekSessions.reduce((sum, s) => sum + s.brainRotDetections, 0),
      avgProductiveTime: weekSessions.reduce((sum, s) => sum + s.productiveTime, 0) / weekSessions.length || 0,
      topCategories: this.getTopCategories(weekSessions),
      improvement: this.calculateImprovement(sessions)
    };
    
    return report;
  }

  getTopCategories(sessions) {
    const categories = {};
    sessions.forEach(session => {
      Object.entries(session.categories).forEach(([cat, time]) => {
        categories[cat] = (categories[cat] || 0) + time;
      });
    });
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }

  calculateImprovement(allSessions) {
    if (allSessions.length < 14) return 0;
    
    const recent = allSessions.slice(-7);
    const previous = allSessions.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, s) => sum + s.brainRotDetections, 0) / recent.length;
    const previousAvg = previous.reduce((sum, s) => sum + s.brainRotDetections, 0) / previous.length;
    
    return ((previousAvg - recentAvg) / previousAvg * 100) || 0;
  }
}

// Initialize engines
const aiEngine = new AIAnalysisEngine();
const analytics = new AnalyticsEngine();

// Enhanced Telegram messaging with rich formatting
async function sendAdvancedTelegramMessage(alertData) {
  const { detection, pageInfo, analytics: pageAnalytics, aiInsights } = alertData;
  
  const message = `
🧠 <b>BrainGuard AI Alert</b>

🚨 <b>Threat Level:</b> ${getThreatLevel(detection.count)}
📊 <b>Content Quality:</b> ${aiInsights.qualityScore}/100
😊 <b>Sentiment:</b> ${aiInsights.sentiment.sentiment.toUpperCase()}

📄 <b>Page:</b> ${pageInfo.title}
🔗 <b>Domain:</b> ${pageInfo.domain}
🏷️ <b>Keywords:</b> ${detection.keywords.join(', ')}
📈 <b>Count:</b> ${detection.count}

📊 <b>Session Stats:</b>
• Sites visited today: ${pageAnalytics.sitesVisited}
• Brain rot detections: ${pageAnalytics.brainRotDetections}
• Time spent: ${formatTime(pageAnalytics.timeSpent)}

💡 <b>AI Recommendation:</b> ${getAIRecommendation(aiInsights)}

⏰ ${new Date().toLocaleString('vi-VN')}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    
    if (response.ok) {
      console.log('Advanced alert sent successfully');
      // Send follow-up with chart/data if needed
      sendDataVisualization(alertData);
    }
  } catch (error) {
    console.error('Error sending advanced alert:', error);
  }
}

// Helper functions
function getThreatLevel(count) {
  if (count >= 10) return '🔴 CRITICAL';
  if (count >= 5) return '🟡 HIGH';
  if (count >= 2) return '🟠 MEDIUM';
  return '🟢 LOW';
}

function getAIRecommendation(insights) {
  if (insights.qualityScore < 30) return 'Consider finding higher quality content';
  if (insights.sentiment.score < -2) return 'This content may be affecting your mood negatively';
  if (insights.qualityScore > 70) return 'Great choice! This appears to be quality content';
  return 'Content quality is moderate - be mindful of your consumption';
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

async function sendDataVisualization(alertData) {
  // Create simple ASCII chart for Telegram
  const weeklyData = await analytics.generateWeeklyReport();
  const chartMessage = `
📈 <b>Weekly Analytics Dashboard</b>

🎯 <b>Improvement Score:</b> ${weeklyData.improvement.toFixed(1)}%
📊 <b>Sites Analyzed:</b> ${weeklyData.totalSites}
⚠️ <b>Total Alerts:</b> ${weeklyData.totalBrainRot}

🏆 <b>Top Categories:</b>
${weeklyData.topCategories.map(([cat, time], i) => 
  `${i + 1}. ${cat}: ${formatTime(time)}`
).join('\n')}

${generateSimpleChart(weeklyData.topCategories)}
  `.trim();

  setTimeout(() => {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: chartMessage,
        parse_mode: 'HTML'
      })
    });
  }, 2000);
}

function generateSimpleChart(categories) {
  const maxTime = Math.max(...categories.map(([, time]) => time));
  return categories.map(([cat, time]) => {
    const barLength = Math.floor((time / maxTime) * 20);
    const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
    return `${cat}: ${bar}`;
  }).join('\n');
}

// Enhanced message handling with debugging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Received message:', request.action, request);
  
  if (request.action === 'sendAdvancedAlert') {
    console.log('🚨 Sending advanced alert...');
    sendAdvancedTelegramMessage(request.data)
      .then(() => {
        console.log('✅ Alert sent successfully');
        sendResponse({ status: 'sent' });
      })
      .catch(error => {
        console.error('❌ Failed to send alert:', error);
        sendResponse({ status: 'error', error: error.message });
      });
    return true; // Keep channel open
  }
  
  if (request.action === 'sendTelegram') {
    console.log('📤 Sending simple telegram message...');
    sendTelegramMessage(request.message)
      .then(() => {
        console.log('✅ Simple message sent');
        sendResponse({ status: 'sent' });
      })
      .catch(error => {
        console.error('❌ Failed to send simple message:', error);
        sendResponse({ status: 'error', error: error.message });
      });
    return true;
  }
  
  if (request.action === 'updateAnalytics') {
    console.log('📊 Updating analytics:', request.data);
    // Update session analytics
    analytics.sessionData.brainRotDetections += request.data.detectionCount || 0;
    analytics.sessionData.sitesVisited.add(request.data.domain);
    analytics.saveSessionData();
    sendResponse({ status: 'updated' });
  }
  
  if (request.action === 'getWeeklyReport') {
    console.log('📈 Generating weekly report...');
    analytics.generateWeeklyReport().then(report => {
      sendResponse({ report });
    });
    return true; // Keep channel open for async response
  }
});

// Periodic analytics saving
chrome.alarms.create('saveAnalytics', { delayInMinutes: 5, periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'saveAnalytics') {
    analytics.saveSessionData();
  }
});

// Tab tracking for time analytics
let tabStartTimes = {};
chrome.tabs.onActivated.addListener((activeInfo) => {
  tabStartTimes[activeInfo.tabId] = Date.now();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabStartTimes[tabId];
});

// Debug Telegram connection
async function testTelegramConnection() {
  console.log('🔧 Testing Telegram connection...');
  
  // Test bot info
  try {
    const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const botData = await botResponse.json();
    console.log('🤖 Bot info:', botData);
    
    if (!botData.ok) {
      console.error('❌ Invalid bot token');
      return false;
    }
  } catch (error) {
    console.error('❌ Bot connection failed:', error);
    return false;
  }
  
  // Test simple message
  try {
    const testMessage = '🔧 Connection Test - ' + new Date().toLocaleString();
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: testMessage
      })
    });
    
    const result = await response.json();
    console.log('📤 Test message result:', result);
    
    if (result.ok) {
      console.log('✅ Telegram connection working!');
      return true;
    } else {
      console.error('❌ Telegram API error:', result);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Send test message failed:', error);
    return false;
  }
}

// Test connection when extension starts
chrome.runtime.onStartup.addListener(() => {
  setTimeout(testTelegramConnection, 2000);
});

chrome.runtime.onInstalled.addListener(() => {
  setTimeout(testTelegramConnection, 2000);
});

// Legacy support
async function sendTelegramMessage(message) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
}