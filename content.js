// =======================================
// RAIA CONTENT SCRIPT
// =======================================

let shadowRoot;
let userClosedWarning = false;

// ===============================
// TẠO OVERLAY
// ===============================
function mountOverlay() {

  if (document.getElementById("raia-root")) return;

  const root = document.createElement("div");
  root.id = "raia-root";
  document.body.appendChild(root);

  shadowRoot = root.attachShadow({ mode: "open" });

  shadowRoot.innerHTML = `
    <style>
      .warning-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: linear-gradient(90deg,#dc2626,#991b1b);
        color: white;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-110%);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.3s ease;
        z-index: 2147483647;
      }

      .warning-bar.show {
        transform: translateY(0);
        opacity: 1;
        box-shadow: 0 4px 20px rgba(220,38,38,0.6);
      }

      .close-btn {
        position: absolute;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
      }

      .panel {
        position: fixed;
        right: -300px;
        top: 120px;
        width: 260px;
        background: #0f172a;
        color: white;
        padding: 20px;
        border-radius: 12px 0 0 12px;
        transition: right 0.4s ease;
        z-index: 999998;
        font-family: Arial;
      }

      .panel.open { right: 0; }

      .toggle-btn {
        position: absolute;
        left: -50px;
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        background: #1e293b;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: bold;
      }

      .status-gray { color: #94a3b8; }
      .status-red { color: #ef4444; }
      .status-yellow { color: #facc15; }
      .status-green { color: #22c55e; }

      .raia-gray { background: #334155; }
      .raia-red { background: #991b1b; }
      .raia-yellow { background: #b45309; }
      .raia-green { background: #065f46; }

      .score { font-size: 32px; font-weight: bold; }
      .status { margin-top: 5px; font-weight: 600; }
      .reason { margin-top: 10px; white-space: pre-line; }
    </style>

    <div class="warning-bar" id="warningBar">
      ⚠️ PHÁT HIỆN LỪA ĐẢO HOẶC NGUY HIỂM, VUI LÒNG CHÚ Ý
      <button class="close-btn" id="closeWarning">✕</button>
    </div>

    <div class="panel" id="panel">
      <div class="toggle-btn" id="toggleBtn">RAIA</div>
      <div class="score" id="scoreText">--%</div>
      <div class="status" id="statusText">ĐANG PHÂN TÍCH</div>
      <div class="reason" id="reasonText">
Đang phân tích nội dung...
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

// ===============================
// UPDATE UI
// ===============================
function updateUI(score, reason) {

  const scoreText = shadowRoot.getElementById("scoreText");
  const statusText = shadowRoot.getElementById("statusText");
  const reasonText = shadowRoot.getElementById("reasonText");
  const warningBar = shadowRoot.getElementById("warningBar");
  const toggleBtn = shadowRoot.getElementById("toggleBtn");

  // Reset class
  scoreText.className = "score";
  toggleBtn.className = "toggle-btn";

  if (score == null) {

    scoreText.textContent = "⚪ --%";
    statusText.textContent = "KHÔNG KẾT NỐI";
    reasonText.textContent = reason;

    scoreText.classList.add("status-gray");
    toggleBtn.classList.add("raia-gray");

    warningBar.classList.remove("show");
    return;
  }

  scoreText.textContent = score + "%";
  reasonText.textContent = reason;

  if (score <= 20) {

    scoreText.textContent = "🔴 " + score + "%";
    statusText.textContent = "CỰC KỲ NGUY HIỂM";

    scoreText.classList.add("status-red");
    toggleBtn.classList.add("raia-red");

  } else if (score <= 50) {

    scoreText.textContent = "🟡 " + score + "%";
    statusText.textContent = "NGUY HIỂM";

    scoreText.classList.add("status-yellow");
    toggleBtn.classList.add("raia-yellow");

  } else {

    scoreText.textContent = "🟢 " + score + "%";
    statusText.textContent = "AN TOÀN";

    scoreText.classList.add("status-green");
    toggleBtn.classList.add("raia-green");
  }

  // Warning bar chỉ hiện khi nguy hiểm
  if (score <= 50 && !userClosedWarning) {
    warningBar.classList.add("show");
  } else {
    warningBar.classList.remove("show");
  }
}

// ===============================
// PHÂN TÍCH
// ===============================
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

// ===============================
// LISTENER
// ===============================
chrome.runtime.onMessage.addListener((msg) => {

  if (msg.type === "FORCE_ANALYZE") {
    userClosedWarning = false;
    analyzePage();
  }

  if (msg.type === "PROTECTION_CHANGED") {

    userClosedWarning = false;

    if (!msg.enabled) {
      updateUI(null, "Realtime Protection đang tắt. (NGUY HIỂM CHÚ Ý)");
      return;
    }

    analyzePage();
  }
});

mountOverlay();
analyzePage();