// =======================================
// RAIA CONTENT SCRIPT - CYBER SAMURAI EDITION
// =======================================

let shadowRoot;
let userClosedWarning = false;

function mountOverlay() {
  if (document.getElementById("raia-root")) return;

  const root = document.createElement("div");
  root.id = "raia-root";
  document.body.appendChild(root);

  shadowRoot = root.attachShadow({ mode: "open" });

  shadowRoot.innerHTML = `
    <style>
      :host {
        --neon-green: #00ff9f;
        --neon-red: #ff0033;
        --neon-yellow: #facc15;
        --cyber-black: #0a0f1a;
        --cyber-gray: #1e293b;
        --text-gray: #94a3b8;
        --font-main: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        --transition-speed: 0.4s;
        --ease: cubic-bezier(0.23, 1, 0.32, 1);
      }

      /* WARNING BAR */
      .warning-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: var(--neon-red);
        color: white;
        font-family: var(--font-main);
        font-weight: 800;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-100%);
        opacity: 0;
        transition: transform var(--transition-speed) var(--ease), opacity 0.3s ease;
        z-index: 2147483647;
        text-transform: uppercase;
        box-shadow: 0 5px 25px rgba(255, 0, 51, 0.4);
        border-bottom: 2px solid rgba(255,255,255,0.2);
      }

      .warning-bar.show {
        transform: translateY(0);
        opacity: 1;
        animation: pulse-red 2s infinite;
      }

      .close-btn {
        position: absolute;
        right: 30px;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.5);
        border-radius: 100%;
        color: white;
        width: 28px;
        height: 28px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s;
      }

      .close-btn:hover { background: #c97a7a; border-color: #fff; }

      /* MAIN PANEL */
      .panel {
        position: fixed;
        right: -320px;
        top: 15%;
        width: 280px;
        background: rgba(10, 15, 26, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--neon-green);
        border-right: none;
        color: white;
        padding: 30px 20px;
        border-radius: 4px 0 0 4px;
        transition: right var(--transition-speed) var(--ease), border-color 0.5s;
        z-index: 2147483646;
        font-family: var(--font-main);
        box-shadow: -10px 0 30px rgba(0,0,0,0.5);
      }

      .panel.open { right: 0; }
      .panel.danger { border-color: var(--neon-red); }
      .panel.warning { border-color: var(--neon-yellow); }
      .panel.offline { border-color: var(--text-gray); }

      /* TOGGLE TAB */
      .toggle-btn {
        position: absolute;
        text-align: center;
        left: -40px;
        top: 40px;
        width: 40px;
        height: 120px;
        background: var(--cyber-black);
        border: 1px solid var(--neon-green);
        border-right: none;
        color: var(--neon-green);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 3px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transition: all 0.3s;
        box-shadow: -5px 0 15px rgba(0, 255, 159, 0.2);
      }

      .panel.danger .toggle-btn { 
        border-color: var(--neon-red); 
        color: var(--neon-red);
        box-shadow: -5px 0 15px rgba(255, 0, 51, 0.2);
      }
      
      .panel.offline .toggle-btn { border-color: var(--text-gray); color: var(--text-gray); }

      /* CONTENT UI */
      .label {
        font-size: 10px;
        text-transform: uppercase;
        color: var(--text-gray);
        letter-spacing: 2px;
        margin-bottom: 8px;
      }

      .score-wrap {
        margin-bottom: 25px;
        position: relative;
      }

      .score {
        font-size: 48px;
        font-weight: 900;
        line-height: 1;
        text-shadow: 0 0 15px currentColor;
      }

      .status {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
        margin-top: 5px;
        text-transform: uppercase;
      }

      .divider {
        height: 1px;
        background: linear-gradient(90deg, currentColor, transparent);
        margin: 20px 0;
        opacity: 0.3;
      }

      .reason {
        font-size: 12px;
        line-height: 1.6;
        color: #e2e8f0;
        font-style: italic;
        min-height: 60px;
      }

      .footer {
        margin-top: 25px;
        font-size: 9px;
        color: var(--text-gray);
        letter-spacing: 1px;
        display: flex;
        justify-content: space-between;
      }

      /* COLORS & ANIMATIONS */
      .text-neon { color: var(--neon-green); }
      .text-danger { color: var(--neon-red); }
      .text-warning { color: var(--neon-yellow); }
      .text-offline { color: var(--text-gray); }

      @keyframes pulse-red {
        0% { background: #991b1b; }
        50% { background: #ff0033; }
        100% { background: #991b1b; }
      }

      .panel-glow {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none;
        box-shadow: inset 0 0 30px rgba(0, 255, 159, 0.05);
      }
    </style>

    <div class="warning-bar" id="warningBar">
      <span>Phát hiện mối đe dọa nghiêm trọng // Quyền truy cập bị hạn chế</span>
      <button class="close-btn" id="closeWarning">✕</button>
    </div>

    <div class="panel" id="panel">
      <div class="panel-glow"></div>
      <div class="toggle-btn" id="toggleBtn">RAIA // SYSTEM</div>
      
      <div class="score-wrap">
        <div class="label">CHỈ SỐ MỨC ĐỘ ĐE DỌA</div>
        <div class="score text-neon" id="scoreText">--%</div>
        <div class="status text-neon" id="statusText">INITIALIZING</div>
      </div>

      <div class="divider"></div>

      <div class="label">PHÂN TÍCH HỆ THỐNG</div>
      <div class="reason" id="reasonText">Phân tích luồng dữ liệu...</div>

      <div class="footer">
        <span>RAIA OVERLAY</span>
        <span>V.2.0.4</span>
      </div>
    </div>
  `;

  const panel = shadowRoot.getElementById("panel");
  const toggleBtn = shadowRoot.getElementById("toggleBtn");
  const closeBtn = shadowRoot.getElementById("closeWarning");

  toggleBtn.onclick = () => panel.classList.toggle("open");

  closeBtn.onclick = () => {
    shadowRoot.getElementById("warningBar").classList.remove("show");
    userClosedWarning = true;
  };
}

function updateUI(score, reason) {
  const panel = shadowRoot.getElementById("panel");
  const scoreText = shadowRoot.getElementById("scoreText");
  const statusText = shadowRoot.getElementById("statusText");
  const reasonText = shadowRoot.getElementById("reasonText");
  const warningBar = shadowRoot.getElementById("warningBar");

  // Reset States
  panel.classList.remove("danger", "warning", "offline");
  scoreText.className = "score";
  statusText.className = "status";

  if (score === null) {
    scoreText.textContent = "--%";
    statusText.textContent = "PROTECTION DISABLED";
    reasonText.textContent = reason || "Shields are offline. System vulnerable.";
    
    panel.classList.add("offline");
    scoreText.classList.add("text-offline");
    statusText.classList.add("text-danger");
    warningBar.classList.remove("show");
    return;
  }

  scoreText.textContent = score + "%";
  reasonText.textContent = reason;

  if (score <= 20) {
    panel.classList.add("danger");
    scoreText.classList.add("text-danger");
    statusText.classList.add("text-danger");
    statusText.textContent = "CRITICAL THREAT";
  } else if (score < 50) {
    panel.classList.add("warning");
    scoreText.classList.add("text-warning");
    statusText.classList.add("text-warning");
    statusText.textContent = "SECURITY RISK";
  } else {
    scoreText.classList.add("text-neon");
    statusText.classList.add("text-neon");
    statusText.textContent = "SYSTEM SECURE";
  }

  // Warning Bar Logic
  if (score < 50 && !userClosedWarning) {
    warningBar.classList.add("show");
  } else {
    warningBar.classList.remove("show");
  }
}

function analyzePage() {
  chrome.runtime.sendMessage(
    {
      type: "ANALYZE_PAGE",
      url: location.href,
      text: document.body.innerText
    },
    (response) => {
      if (response) updateUI(response.score, response.reason);
    }
  );
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "FORCE_ANALYZE") {
    userClosedWarning = false;
    analyzePage();
  }

  if (msg.type === "PROTECTION_CHANGED") {
    userClosedWarning = false;
    if (!msg.enabled) {
      updateUI(null, "Realtime Protection is OFF. System integrity at risk.");
      return;
    }
    analyzePage();
  }
});

// Initialization
mountOverlay();
analyzePage();