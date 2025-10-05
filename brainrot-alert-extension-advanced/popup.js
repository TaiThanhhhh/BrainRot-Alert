// Advanced Popup Controller
class PopupController {
  constructor() {
    this.currentTab = null;
    this.analysisData = null;
    this.weeklyReport = null;
    this.init();
  }

  async init() {
    try {
      this.currentTab = await this.getCurrentTab();
      await this.loadAnalysisData();
      this.setupEventListeners();
      this.startRealTimeUpdates();
    } catch (error) {
      this.showErrorState('Failed to initialize BrainGuard AI');
      console.error('Initialization error:', error);
    }
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async loadAnalysisData() {
    if (!this.currentTab || !this.currentTab.url.startsWith('http')) {
      this.showUnsupportedPage();
      return;
    }

    try {
      // Get page analysis
      const response = await this.sendMessageToContent('getPageInfo');
      if (response) {
        this.analysisData = response;
        this.renderAdvancedInterface();
      } else {
        this.showContentScriptError();
      }

      // Get weekly report
      this.weeklyReport = await this.getWeeklyReport();
      
    } catch (error) {
      console.error('Failed to load analysis data:', error);
      this.showContentScriptError();
    }
  }

  sendMessageToContent(action, data = {}) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(this.currentTab.id, { action, ...data }, (response) => {
        if (chrome.runtime.lastError) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }

  async getWeeklyReport() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getWeeklyReport' }, (response) => {
        resolve(response?.report || null);
      });
    });
  }

  renderAdvancedInterface() {
    const { pageInfo, detection, advanced } = this.analysisData;
    
    const content = document.getElementById('content');
    content.innerHTML = this.generateAdvancedHTML(pageInfo, detection, advanced);
    
    this.setupAdvancedEventListeners();
    this.animateElements();
  }

  generateAdvancedHTML(pageInfo, detection, advanced) {
    const wellnessScore = advanced?.wellness || 85;
    const qualityScore = advanced?.quality?.overall || 70;
    const threatLevel = this.getThreatLevel(detection.count);
    
    return `
      <div class="wellness-dashboard">
        <div class="wellness-score ${this.getWellnessClass(wellnessScore)}">${wellnessScore}</div>
        <div class="wellness-label">Wellness Score</div>
      </div>

      <div class="status-grid">
        <div class="status-card">
          <div class="status-value">${qualityScore}%</div>
          <div class="status-label">Content Quality</div>
        </div>
        <div class="status-card">
          <div class="status-value">${detection.count}</div>
          <div class="status-label">Risk Signals</div>
        </div>
      </div>

      <div class="threat-level ${threatLevel.class}">
        <div class="threat-info">
          <div class="threat-title">${threatLevel.title}</div>
          <div class="threat-desc">${pageInfo.domain}</div>
        </div>
        <div class="threat-icon">${threatLevel.icon}</div>
      </div>

      ${this.generateRecommendations(advanced?.recommendations || [])}
      ${this.generateAnalytics()}
      ${this.generateActionsPanel(threatLevel)}
    `;
  }

  getThreatLevel(count) {
    if (count >= 15) return { 
      class: 'critical', 
      title: 'Critical Risk Level', 
      icon: '🆘',
      description: 'Take immediate break recommended'
    };
    if (count >= 10) return { 
      class: 'high', 
      title: 'High Risk Content', 
      icon: '🚨',
      description: 'Consider alternative content'
    };
    if (count >= 5) return { 
      class: 'medium', 
      title: 'Medium Risk Level', 
      icon: '⚠️',
      description: 'Moderate brain rot detected'
    };
    if (count >= 1) return { 
      class: 'low', 
      title: 'Low Risk Content', 
      icon: '🟡',
      description: 'Minor concerns detected'
    };
    return { 
      class: 'safe', 
      title: 'Clean Content', 
      icon: '✅',
      description: 'No brain rot detected'
    };
  }

  getWellnessClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  generateRecommendations(recommendations) {
    if (!recommendations.length) return '';
    
    return `
      <div class="recommendations">
        <h3>🎯 AI Recommendations</h3>
        <div class="recommendation-list">
          ${recommendations.slice(0, 3).map(rec => `
            <div class="recommendation-item">${rec}</div>
          `).join('')}
        </div>
      </div>
    `;
  }

  generateAnalytics() {
    const report = this.weeklyReport;
    if (!report) return '<div class="analytics-section">Loading analytics...</div>';

    return `
      <div class="analytics-section">
        <div class="analytics-header">
          <div class="analytics-title">📊 Weekly Overview</div>
          <div class="analytics-period">Last 7 days</div>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill ${report.improvement >= 0 ? '' : 'warning'}" 
               style="width: ${Math.min(100, Math.abs(report.improvement))}%"></div>
        </div>
        <div style="font-size: 11px; text-align: center; margin-top: 4px; opacity: 0.8;">
          ${report.improvement >= 0 ? '📈' : '📉'} ${Math.abs(report.improvement).toFixed(1)}% improvement
        </div>

        <div class="quick-stats">
          <div class="quick-stat">
            <div class="quick-stat-value">${report.totalSites || 0}</div>
            <div class="quick-stat-label">Sites</div>
          </div>
          <div class="quick-stat">
            <div class="quick-stat-value">${report.totalBrainRot || 0}</div>
            <div class="quick-stat-label">Alerts</div>
          </div>
          <div class="quick-stat">
            <div class="quick-stat-value">${Math.floor((report.avgProductiveTime || 0) / 60)}m</div>
            <div class="quick-stat-label">Focus</div>
          </div>
        </div>
      </div>
    `;
  }

  generateActionsPanel(threatLevel) {
    return `
      <div class="actions-panel">
        <div class="actions-grid">
          <button id="testBtn" class="action-btn btn-test">
            📱 Test Alert
          </button>
          <button id="analyzeBtn" class="action-btn btn-analyze">
            🔍 Re-analyze
          </button>
          ${threatLevel.class !== 'safe' ? `
            <button id="breakBtn" class="action-btn btn-break">
              ⏸️ Take Break
            </button>
            <button id="focusBtn" class="action-btn btn-focus">
              🎯 Focus Mode
            </button>
          ` : `
            <button id="protectBtn" class="action-btn btn-focus">
              🛡️ Stay Protected
            </button>
            <button id="shareBtn" class="action-btn btn-break">
              📤 Share Stats
            </button>
          `}
        </div>
      </div>
    `;
  }

  setupAdvancedEventListeners() {
    // Test button
    const testBtn = document.getElementById('testBtn');
    if (testBtn) {
      testBtn.addEventListener('click', () => this.sendTestMessage());
    }

    // Analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.reAnalyze());
    }

    // Break button
    const breakBtn = document.getElementById('breakBtn');
    if (breakBtn) {
      breakBtn.addEventListener('click', () => this.takeBreak());
    }

    // Focus mode button
    const focusBtn = document.getElementById('focusBtn');
    if (focusBtn) {
      focusBtn.addEventListener('click', () => this.toggleFocusMode());
    }

    // Protection button
    const protectBtn = document.getElementById('protectBtn');
    if (protectBtn) {
      protectBtn.addEventListener('click', () => this.toggleProtection());
    }

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareStats());
    }
  }

  setupEventListeners() {
    // Footer buttons
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    });

    document.getElementById('reportBtn')?.addEventListener('click', () => {
      this.generateDetailedReport();
    });

    document.getElementById('helpBtn')?.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://brainguard-ai.com/help' });
    });
  }

  async sendTestMessage() {
    const btn = document.getElementById('testBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const testMessage = `
🧪 <b>BrainGuard AI - Advanced Test Alert</b>

✅ AI Analysis Engine: Active
📊 Real-time Monitoring: Enabled  
🔔 Telegram Integration: Working
🎯 Content Quality Detection: Ready

📈 <b>Current Session:</b>
• Wellness Score: ${this.analysisData?.advanced?.wellness || 85}%
• Content Quality: ${this.analysisData?.advanced?.quality?.overall || 70}%
• Risk Level: ${this.getThreatLevel(this.analysisData?.detection?.count || 0).title}

🚀 BrainGuard AI is protecting your digital wellness!
⏰ ${new Date().toLocaleString('en-US')}
    `.trim();

    chrome.runtime.sendMessage({
      action: 'sendTelegram',
      message: testMessage
    }, (response) => {
      btn.textContent = response?.status === 'sent' ? '✅ Sent!' : '❌ Failed';
      setTimeout(() => {
        btn.textContent = '📱 Test Alert';
        btn.disabled = false;
      }, 2000);
    });
  }

  async reAnalyze() {
    const btn = document.getElementById('analyzeBtn');
    btn.textContent = 'Analyzing...';
    btn.disabled = true;

    await this.sendMessageToContent('analyze');
    
    setTimeout(async () => {
      await this.loadAnalysisData();
      btn.textContent = '🔍 Re-analyze';
      btn.disabled = false;
    }, 2000);
  }

  takeBreak() {
    const suggestions = [
      'https://www.khanacademy.org',
      'https://www.coursera.org',
      'https://www.ted.com/talks',
      'https://en.wikipedia.org/wiki/Special:Random',
      'https://www.duolingo.com',
      'https://www.codecademy.com'
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    chrome.tabs.create({ url: randomSuggestion });
    window.close();
  }

  async toggleFocusMode() {
    const response = await this.sendMessageToContent('toggleFocus');
    const btn = document.getElementById('focusBtn');
    btn.textContent = response?.enabled ? '🎯 Focus: ON' : '🎯 Focus Mode';
  }

  async toggleProtection() {
    const response = await this.sendMessageToContent('toggleProtection');
    const btn = document.getElementById('protectBtn');
    btn.textContent = response?.enabled ? '🛡️ Protected' : '🛡️ Protection: OFF';
  }

  shareStats() {
    const stats = {
      wellness: this.analysisData?.advanced?.wellness || 0,
      quality: this.analysisData?.advanced?.quality?.overall || 0,
      improvement: this.weeklyReport?.improvement || 0
    };

    const shareText = `🧠 My BrainGuard AI Stats:\n• Wellness: ${stats.wellness}%\n• Content Quality: ${stats.quality}%\n• Weekly Improvement: ${stats.improvement.toFixed(1)}%\n\nProtecting my digital wellness with AI! #BrainGuardAI`;
    
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Stats copied to clipboard!');
    }
  }

  generateDetailedReport() {
    chrome.runtime.sendMessage({ action: 'generateReport' }, (response) => {
      const reportUrl = chrome.runtime.getURL('report.html');
      chrome.tabs.create({ url: reportUrl });
    });
  }

  startRealTimeUpdates() {
    setInterval(async () => {
      if (this.currentTab) {
        const newData = await this.sendMessageToContent('getPageInfo');
        if (newData && JSON.stringify(newData) !== JSON.stringify(this.analysisData)) {
          this.analysisData = newData;
          this.renderAdvancedInterface();
        }
      }
    }, 5000); // Update every 5 seconds
  }

  animateElements() {
    const elements = document.querySelectorAll('.status-card, .threat-level, .recommendations');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  showUnsupportedPage() {
    document.getElementById('content').innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Page Not Supported</h3>
        <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
          BrainGuard AI doesn't work on browser pages, extensions, or local files.
          Please navigate to a website to start protection.
        </p>
      </div>
    `;
  }

  showContentScriptError() {
    document.getElementById('content').innerHTML = `
      <div class="error-state">
        <div class="error-icon">🔄</div>
        <h3>Content Script Loading</h3>
        <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
          Please refresh the page or try re-analyzing to load BrainGuard AI.
        </p>
        <button onclick="location.reload()" style="
          margin-top: 15px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
        ">Retry</button>
      </div>
    `;
  }

  showErrorState(message) {
    document.getElementById('content').innerHTML = `
      <div class="error-state">
        <div class="error-icon">❌</div>
        <h3>Error</h3>
        <p style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
          ${message}
        </p>
      </div>
    `;
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});

// Add achievement notification
function showAchievement(title, description) {
  const badge = document.getElementById('achievementBadge');
  badge.textContent = `🏆 ${title}`;
  badge.style.display = 'block';
  
  setTimeout(() => {
    badge.style.display = 'none';
  }, 5000);
}