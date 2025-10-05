// Advanced Brain Rot Detection with AI Analysis
class AdvancedBrainRotDetector {
  constructor() {
    this.patterns = {
      // Tier 1: Basic brain rot
      basic: [
        'skibidi', 'ohio', 'rizz', 'sigma', 'gyat', 'fanum tax', 
        'mewing', 'sus', 'sussy', 'amogus'
      ],
      // Tier 2: Social media brain rot
      social: [
        'no cap', 'bussin', 'sheesh', 'periodt', 'slay', 'bet',
        'fr fr', 'lowkey', 'highkey', 'mid', 'ratio'
      ],
      // Tier 3: Toxic productivity/alpha culture
      toxic: [
        'sigma male', 'alpha energy', 'grindset', 'hustle culture',
        'toxic productivity', 'rise and grind'
      ],
      // Tier 4: Context-aware patterns
      contextual: [
        /\b(cringe|based)\s+(content|behavior|take)\b/gi,
        /\b(toxic|problematic)\s+(masculinity|femininity|behavior)\b/gi,
        /\b(brain\s*rot|mind\s*numbing|mindless\s*content)\b/gi
      ]
    };

    this.positivePatterns = [
      'educational', 'tutorial', 'learning', 'knowledge', 'insights',
      'analysis', 'research', 'study', 'development', 'growth'
    ];

    this.sessionStartTime = Date.now();
    this.pageStartTime = Date.now();
    this.detectionHistory = [];
    this.wellnessScore = 100;
  }

  // Advanced pattern matching with context
  analyzeContent(text, metadata = {}) {
    const analysis = {
      basic: this.findMatches(text, this.patterns.basic),
      social: this.findMatches(text, this.patterns.social),
      toxic: this.findMatches(text, this.patterns.toxic),
      contextual: this.findContextualMatches(text, this.patterns.contextual),
      positive: this.findMatches(text, this.positivePatterns)
    };

    // Calculate severity score
    const severityScore = this.calculateSeverity(analysis);
    
    // Content quality assessment
    const qualityMetrics = this.assessContentQuality(text, analysis);
    
    // Real-time wellness impact
    this.updateWellnessScore(severityScore);

    return {
      detected: severityScore > 0,
      patterns: analysis,
      severity: severityScore,
      quality: qualityMetrics,
      wellness: this.wellnessScore,
      recommendations: this.generateRecommendations(analysis, qualityMetrics)
    };
  }

  findMatches(text, patterns) {
    const matches = [];
    const lowerText = text.toLowerCase();
    
    patterns.forEach(pattern => {
      if (typeof pattern === 'string') {
        const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
        const found = lowerText.match(regex);
        if (found) matches.push(...found);
      }
    });
    
    return [...new Set(matches)]; // Remove duplicates
  }

  findContextualMatches(text, patterns) {
    const matches = [];
    patterns.forEach(pattern => {
      if (pattern instanceof RegExp) {
        const found = text.match(pattern);
        if (found) matches.push(...found);
      }
    });
    return matches;
  }

  calculateSeverity(analysis) {
    let score = 0;
    score += analysis.basic.length * 2;      // Basic brain rot: 2 points each
    score += analysis.social.length * 1;     // Social media: 1 point each
    score += analysis.toxic.length * 3;      // Toxic content: 3 points each
    score += analysis.contextual.length * 2; // Contextual: 2 points each
    score -= analysis.positive.length * 1;   // Positive content reduces score
    return Math.max(0, score);
  }

  assessContentQuality(text, analysis) {
    const metrics = {
      readability: this.calculateReadability(text),
      engagement: this.calculateEngagement(text),
      educational: analysis.positive.length > 0,
      length: text.length,
      structure: this.assessStructure(text)
    };

    // Overall quality score (0-100)
    let qualityScore = 50; // Base score
    qualityScore += metrics.readability * 0.3;
    qualityScore += metrics.engagement * 0.2;
    qualityScore += metrics.educational ? 20 : 0;
    qualityScore += metrics.structure * 0.1;
    qualityScore -= analysis.basic.length * 5;
    qualityScore -= analysis.toxic.length * 10;

    return {
      ...metrics,
      overall: Math.max(0, Math.min(100, qualityScore))
    };
  }

  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.estimateSyllables(words);
    
    // Simplified Flesch Reading Ease
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  estimateSyllables(words) {
    return words.reduce((total, word) => {
      return total + Math.max(1, word.match(/[aeiouy]+/gi)?.length || 1);
    }, 0) / words.length;
  }

  calculateEngagement(text) {
    const engagementWords = ['why', 'how', 'what', 'when', 'where'];
    const specialChars = ['?', '!'];
    
    let matches = 0;
    
    // Count engagement words
    engagementWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      matches += (text.match(regex) || []).length;
    });
    
    // Count special characters
    specialChars.forEach(char => {
      const escaped = char === '?' ? '\\?' : char === '!' ? '\\!' : char;
      const regex = new RegExp(escaped, 'g');
      matches += (text.match(regex) || []).length;
    });
    
    return Math.min(100, (matches / text.length) * 10000);
  }

  assessStructure(text) {
    let score = 0;
    if (text.includes('\n\n')) score += 20; // Paragraphs
    if (text.match(/^\d+\.|^-|^\*/m)) score += 20; // Lists
    if (text.match(/^#{1,6}\s/m)) score += 20; // Headers
    if (text.includes('http')) score += 10; // Links
    return Math.min(100, score);
  }

  updateWellnessScore(severityScore) {
    if (severityScore > 10) this.wellnessScore -= 2;
    else if (severityScore > 5) this.wellnessScore -= 1;
    else if (severityScore === 0) this.wellnessScore += 0.5;
    
    this.wellnessScore = Math.max(0, Math.min(100, this.wellnessScore));
  }

  generateRecommendations(analysis, quality) {
    const recommendations = [];
    
    if (analysis.basic.length > 5) {
      recommendations.push("Consider taking a break from this type of content");
    }
    if (analysis.toxic.length > 0) {
      recommendations.push("This content contains potentially harmful messaging");
    }
    if (quality.overall < 30) {
      recommendations.push("Look for higher quality, more educational content");
    }
    if (analysis.positive.length > 0) {
      recommendations.push("Great choice! This content appears educational");
    }

    return recommendations;
  }
}

// Enhanced Page Information Extractor
class PageAnalyzer {
  constructor() {
    this.detector = new AdvancedBrainRotDetector();
    this.startTime = Date.now();
    this.interactions = 0;
    this.scrollDepth = 0;
    this.timeSpent = 0;
  }

  extractAdvancedPageInfo() {
    const metadata = this.extractMetadata();
    const content = this.extractContent();
    const behavioral = this.extractBehavioralData();

    return {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname,
      content: content,
      metadata: metadata,
      behavioral: behavioral,
      timestamp: new Date().toISOString(),
      category: this.categorizeContent(content, metadata)
    };
  }

  extractMetadata() {
    const meta = {};
    document.querySelectorAll('meta').forEach(tag => {
      const name = tag.getAttribute('name') || tag.getAttribute('property');
      const content = tag.getAttribute('content');
      if (name && content) meta[name] = content;
    });

    return {
      description: meta['description'] || '',
      keywords: meta['keywords'] || '',
      author: meta['author'] || '',
      ogType: meta['og:type'] || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      wordCount: this.countWords(),
      imageCount: document.querySelectorAll('img').length,
      videoCount: document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length,
      linkCount: document.querySelectorAll('a').length
    };
  }

  extractContent() {
    // Smart content extraction prioritizing main content
    const selectors = [
      'article', 'main', '[role="main"]', '.content', '.post', '.entry',
      '.article-content', '.story-content', '#content', '.main-content'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText.length > 100) {
        return element.innerText;
      }
    }

    // Fallback to body but filter out navigation, ads, etc.
    const bodyClone = document.body.cloneNode(true);
    const removeSelectors = [
      'nav', 'header', 'footer', 'aside', '.sidebar', '.advertisement',
      '.ad', '.social-share', '.comments', '.related-posts', 'script', 'style'
    ];

    removeSelectors.forEach(sel => {
      bodyClone.querySelectorAll(sel).forEach(el => el.remove());
    });

    return bodyClone.innerText || '';
  }

  extractBehavioralData() {
    return {
      timeSpent: Math.floor((Date.now() - this.startTime) / 1000),
      scrollDepth: Math.floor((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) || 0,
      interactions: this.interactions,
      focusTime: this.getFocusTime(),
      readingSpeed: this.estimateReadingSpeed()
    };
  }

  countWords() {
    return (document.body.innerText.match(/\b\w+\b/g) || []).length;
  }

  getFocusTime() {
    // Simplified focus tracking
    return document.hasFocus() ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
  }

  estimateReadingSpeed() {
    const words = this.countWords();
    const timeSpentSeconds = (Date.now() - this.startTime) / 1000;
    const timeSpentMinutes = timeSpentSeconds / 60;
    return timeSpentMinutes > 0 ? Math.floor(words / timeSpentMinutes) : 0;
  }

  categorizeContent(content, metadata) {
    const categories = {
      'education': ['education', 'tutorial', 'learn', 'course', 'study'],
      'entertainment': ['entertainment', 'funny', 'meme', 'comedy', 'viral'],
      'news': ['news', 'breaking', 'report', 'journalism', 'current'],
      'social': ['social', 'twitter', 'facebook', 'instagram', 'tiktok'],
      'productivity': ['productivity', 'work', 'business', 'career', 'professional'],
      'wellness': ['health', 'wellness', 'mental', 'fitness', 'mindfulness']
    };

    const text = (content + ' ' + metadata.description + ' ' + metadata.keywords).toLowerCase();

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }
}

// Advanced Warning System
class AdvancedWarningSystem {
  constructor() {
    this.warningLevels = {
      low: { color: '#4CAF50', icon: '⚠️', title: 'Low Risk Content' },
      medium: { color: '#FF9800', icon: '🔶', title: 'Medium Risk Content' },
      high: { color: '#F44336', icon: '🚨', title: 'High Risk Content' },
      critical: { color: '#9C27B0', icon: '🆘', title: 'Critical - Take a Break!' }
    };
    this.currentWarnings = new Map();
  }

  determineWarningLevel(analysis) {
    if (analysis.severity >= 15) return 'critical';
    if (analysis.severity >= 10) return 'high';
    if (analysis.severity >= 5) return 'medium';
    if (analysis.detected) return 'low';
    return null;
  }

  showAdvancedWarning(analysis, pageInfo) {
    const level = this.determineWarningLevel(analysis);
    if (!level) return;

    this.removeExistingWarning();

    const warningConfig = this.warningLevels[level];
    const warning = this.createWarningElement(warningConfig, analysis, pageInfo);
    
    document.body.appendChild(warning);
    this.currentWarnings.set(window.location.href, warning);

    // Auto-dismiss based on severity
    const dismissTime = level === 'critical' ? 30000 : level === 'high' ? 20000 : 15000;
    setTimeout(() => this.removeExistingWarning(), dismissTime);
  }

  createWarningElement(config, analysis, pageInfo) {
    const wrapper = document.createElement('div');
    wrapper.id = 'brainguard-warning';
    wrapper.className = 'brainguard-warning-wrapper';
    
    wrapper.innerHTML = `
      <div class="brainguard-warning-content" style="
        background: linear-gradient(135deg, ${config.color}dd, ${config.color}aa);
        backdrop-filter: blur(10px);
        border: 2px solid ${config.color};
        border-radius: 16px;
        padding: 20px;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        color: white;
        font-family: 'Segoe UI', -apple-system, sans-serif;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        animation: slideInWarning 0.5s ease-out;
      ">
        <div class="brainguard-header" style="
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          font-weight: bold;
          font-size: 16px;
        ">
          <span style="font-size: 24px; margin-right: 12px;">${config.icon}</span>
          <span>${config.title}</span>
          <button class="brainguard-close" style="
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            margin-left: auto;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            opacity: 0.7;
            transition: opacity 0.2s;
          " onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">×</button>
        </div>
        
        <div class="brainguard-stats" style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 12px;
        ">
          <div style="text-align: center; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <div style="font-weight: bold; font-size: 18px;">${analysis.severity}</div>
            <div>Risk Score</div>
          </div>
          <div style="text-align: center; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <div style="font-weight: bold; font-size: 18px;">${analysis.quality.overall}%</div>
            <div>Quality</div>
          </div>
        </div>

        <div class="brainguard-details" style="
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 16px;
          opacity: 0.9;
        ">
          <strong>Detected patterns:</strong><br>
          ${this.formatPatterns(analysis.patterns)}
          
          ${analysis.recommendations.length > 0 ? `
            <br><br><strong>Recommendations:</strong><br>
            ${analysis.recommendations.slice(0, 2).join('<br>')}
          ` : ''}
        </div>

        <div class="brainguard-actions" style="
          display: flex;
          gap: 8px;
        ">
          <button class="brainguard-action" onclick="window.brainGuardTakeBreak()" style="
            flex: 1;
            padding: 8px 12px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 8px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
          ">Take Break</button>
          <button class="brainguard-action" onclick="window.brainGuardFindBetter()" style="
            flex: 1;
            padding: 8px 12px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 8px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
          ">Find Better</button>
        </div>

        <div class="brainguard-wellness" style="
          margin-top: 12px;
          padding: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          font-size: 11px;
          text-align: center;
        ">
          🧠 Wellness Score: <strong>${analysis.wellness}%</strong>
        </div>
      </div>
    `;

    // Add event listeners
    wrapper.querySelector('.brainguard-close').onclick = () => this.removeExistingWarning();
    
    // Add CSS animations
    if (!document.querySelector('#brainguard-styles')) {
      const styles = document.createElement('style');
      styles.id = 'brainguard-styles';
      styles.textContent = `
        @keyframes slideInWarning {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .brainguard-action:hover {
          background: rgba(255,255,255,0.3) !important;
        }
      `;
      document.head.appendChild(styles);
    }

    return wrapper;
  }

  formatPatterns(patterns) {
    const allPatterns = [
      ...patterns.basic,
      ...patterns.social,
      ...patterns.toxic,
      ...patterns.contextual
    ];
    
    if (allPatterns.length === 0) return 'General content concerns detected';
    
    return allPatterns.slice(0, 5).join(', ') + 
           (allPatterns.length > 5 ? ` +${allPatterns.length - 5} more` : '');
  }

  removeExistingWarning() {
    const existing = document.querySelector('#brainguard-warning');
    if (existing) {
      existing.style.animation = 'slideOutWarning 0.3s ease-in forwards';
      setTimeout(() => existing.remove(), 300);
    }
  }
}

// Initialize systems
const pageAnalyzer = new PageAnalyzer();
const warningSystem = new AdvancedWarningSystem();

// Global functions for warning actions
window.brainGuardTakeBreak = () => {
  const breakSuggestions = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rick Roll for fun
    'https://en.wikipedia.org/wiki/Special:Random',
    'https://www.khanacademy.org',
    'https://www.coursera.org',
    'https://medium.com/topic/self-improvement'
  ];
  window.open(breakSuggestions[Math.floor(Math.random() * breakSuggestions.length)], '_blank');
  warningSystem.removeExistingWarning();
};

window.brainGuardFindBetter = () => {
  const domain = window.location.hostname;
  const betterAlternatives = {
    'tiktok.com': ['https://www.khanacademy.org', 'https://www.coursera.org'],
    'youtube.com': ['https://www.edx.org', 'https://www.ted.com'],
    'instagram.com': ['https://medium.com', 'https://www.goodreads.com'],
    'twitter.com': ['https://news.ycombinator.com', 'https://www.reddit.com/r/todayilearned'],
    'default': ['https://www.wikipedia.org', 'https://www.coursera.org', 'https://www.khanacademy.org']
  };
  
  const alternatives = betterAlternatives[domain] || betterAlternatives.default;
  window.open(alternatives[Math.floor(Math.random() * alternatives.length)], '_blank');
  warningSystem.removeExistingWarning();
};

// Enhanced main analysis function
async function performAdvancedAnalysis() {
  const pageInfo = pageAnalyzer.extractAdvancedPageInfo();
  const analysis = pageAnalyzer.detector.analyzeContent(pageInfo.content, pageInfo.metadata);
  
  // Compile analytics data
  const analyticsData = {
    domain: pageInfo.domain,
    category: pageInfo.category,
    detectionCount: analysis.severity,
    timeSpent: pageInfo.behavioral.timeSpent,
    qualityScore: analysis.quality.overall,
    wellnessScore: analysis.wellness
  };

  // Send to background for processing
  chrome.runtime.sendMessage({
    action: 'updateAnalytics',
    data: analyticsData
  });

  // Show warning if needed
  if (analysis.detected) {
    warningSystem.showAdvancedWarning(analysis, pageInfo);
    
    // Send advanced Telegram alert
    chrome.runtime.sendMessage({
      action: 'sendAdvancedAlert',
      data: {
        detection: {
          detected: analysis.detected,
          count: analysis.severity,
          keywords: Object.values(analysis.patterns).flat()
        },
        pageInfo: {
          title: pageInfo.title,
          domain: pageInfo.domain,
          url: pageInfo.url,
          category: pageInfo.category
        },
        analytics: {
          sitesVisited: 1, // Will be calculated in background
          brainRotDetections: 1,
          timeSpent: pageInfo.behavioral.timeSpent
        },
        aiInsights: {
          qualityScore: analysis.quality.overall,
          sentiment: { sentiment: 'negative', score: -analysis.severity },
          recommendations: analysis.recommendations
        }
      }
    });
  }

  return { pageInfo, analysis };
}

// Enhanced interaction tracking
let interactionCount = 0;
['click', 'scroll', 'keydown'].forEach(event => {
  document.addEventListener(event, () => {
    interactionCount++;
    pageAnalyzer.interactions = interactionCount;
  }, { passive: true });
});

// Smart re-analysis for dynamic content
let lastAnalysis = 0;
const observer = new MutationObserver((mutations) => {
  const significantChanges = mutations.some(mutation => 
    mutation.addedNodes.length > 0 && 
    Array.from(mutation.addedNodes).some(node => 
      node.nodeType === 1 && node.textContent && node.textContent.length > 50
    )
  );

  if (significantChanges && Date.now() - lastAnalysis > 3000) {
    lastAnalysis = Date.now();
    setTimeout(performAdvancedAnalysis, 1000);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: false
});

// URL change detection for SPAs
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    pageAnalyzer.startTime = Date.now(); // Reset timer
    setTimeout(performAdvancedAnalysis, 2000);
  }
}, 1000);

// Initial analysis
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(performAdvancedAnalysis, 1500);
  });
} else {
  setTimeout(performAdvancedAnalysis, 1500);
}

// Enhanced message handling for popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    performAdvancedAnalysis().then(result => {
      sendResponse({ status: 'analyzed', data: result });
    });
    return true;
  }
  
  if (request.action === 'getPageInfo') {
    performAdvancedAnalysis().then(result => {
      sendResponse({ 
        pageInfo: result.pageInfo, 
        detection: {
          detected: result.analysis.detected,
          count: result.analysis.severity,
          keywords: Object.values(result.analysis.patterns).flat()
        },
        advanced: {
          quality: result.analysis.quality,
          wellness: result.analysis.wellness,
          recommendations: result.analysis.recommendations
        }
      });
    });
    return true;
  }

  if (request.action === 'toggleProtection') {
    // Toggle protection mode
    const isEnabled = !document.body.classList.contains('brainguard-disabled');
    document.body.classList.toggle('brainguard-disabled', isEnabled);
    sendResponse({ enabled: !isEnabled });
  }
});// Brain rot keywords to detect
const BRAIN_ROT_KEYWORDS = [
  'skibidi', 'ohio', 'rizz', 'sigma', 'gyat', 'fanum tax', 
  'mewing', 'sus', 'sussy', 'amogus', 'cringe', 'based',
  'no cap', 'bussin', 'sheesh', 'bet', 'periodt', 'slay'
];

// Extract page information
function extractPageInfo() {
  return {
    url: window.location.href,
    title: document.title,
    domain: window.location.hostname,
    text: document.body.innerText.toLowerCase(),
    timestamp: new Date().toISOString()
  };
}

// Check for brain rot content
function detectBrainRot(pageInfo) {
  const foundKeywords = [];
  
  BRAIN_ROT_KEYWORDS.forEach(keyword => {
    if (pageInfo.text.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });
  
  return {
    detected: foundKeywords.length > 0,
    keywords: foundKeywords,
    count: foundKeywords.length
  };
}

// Send notification to Telegram
function sendBrainRotAlert(pageInfo, detection) {
  const message = `
🚨 <b>Brain Rot Content Detected!</b>

📄 <b>Page:</b> ${pageInfo.title}
🔗 <b>URL:</b> ${pageInfo.url}
🏷️ <b>Keywords found:</b> ${detection.keywords.join(', ')}
📊 <b>Count:</b> ${detection.count}
⏰ <b>Time:</b> ${new Date().toLocaleString()}
  `.trim();

  chrome.runtime.sendMessage({
    action: 'sendTelegram',
    message: message
  });
}

// Main analysis function
function analyzePage() {
  const pageInfo = extractPageInfo();
  const detection = detectBrainRot(pageInfo);
  
  // Send data to background script
  chrome.runtime.sendMessage({
    action: 'pageAnalyzed',
    data: {
      pageInfo: pageInfo,
      detection: detection
    }
  });
  
  // If brain rot detected, send alert
  if (detection.detected) {
    console.log('Brain rot detected:', detection.keywords);
    sendBrainRotAlert(pageInfo, detection);
    
    // Show visual warning on page
    showPageWarning(detection);
  }
}

// Show warning overlay on page
function showPageWarning(detection) {
  // Remove existing warning if any
  const existingWarning = document.getElementById('brain-rot-warning');
  if (existingWarning) {
    existingWarning.remove();
  }
  
  // Create warning overlay
  const warning = document.createElement('div');
  warning.id = 'brain-rot-warning';
  warning.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ff6b6b, #ffd93d);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    max-width: 300px;
    cursor: pointer;
    animation: slideIn 0.5s ease-out;
  `;
  
  warning.innerHTML = `
    🧠⚠️ Brain Rot Detected!<br>
    <small>Keywords: ${detection.keywords.slice(0, 3).join(', ')}</small><br>
    <small style="opacity: 0.8;">Click to dismiss</small>
  `;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Add click to dismiss
  warning.onclick = () => warning.remove();
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (warning.parentNode) {
      warning.remove();
    }
  }, 10000);
  
  document.body.appendChild(warning);
}

// Run analysis when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', analyzePage);
} else {
  analyzePage();
}

// Re-analyze when page content changes (for SPAs)
let lastUrl = window.location.href;
const urlChangeObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    setTimeout(analyzePage, 1000); // Delay to let content load
  }
});

urlChangeObserver.observe(document, {
  childList: true,
  subtree: true
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    analyzePage();
    sendResponse({ status: 'analyzed' });
  }
  
  if (request.action === 'getPageInfo') {
    const pageInfo = extractPageInfo();
    const detection = detectBrainRot(pageInfo);
    sendResponse({ pageInfo, detection });
  }
});