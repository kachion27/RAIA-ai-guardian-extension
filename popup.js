document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.querySelector("#protectionToggle");
  const scanBtn = document.querySelector("#scanBtn");

  // Load trạng thái ban đầu từ background
  loadState();

  // ===============================
  // TOGGLE ON / OFF
  // ===============================
  toggle.addEventListener("change", (e) => {

    chrome.runtime.sendMessage({
      type: "TOGGLE_ENABLED",
      enabled: e.target.checked
    });

  });

  // ===============================
  // QUÉT NGAY
  // ===============================
  scanBtn.addEventListener("click", () => {

    if (!toggle.checked) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;

      chrome.tabs.sendMessage(tabs[0].id, {
        type: "FORCE_ANALYZE"
      });
    });

  });

});


// ===============================
// LOAD STATE TỪ BACKGROUND
// ===============================
function loadState() {

  chrome.runtime.sendMessage({ type: "GET_STATE" }, (state) => {

    if (!state) return;

    const toggle = document.querySelector("#protectionToggle");

    toggle.checked = state.enabled;

    updatePopupUI(state.score);

  });

}


// ===============================
// LISTEN STATE UPDATE
// ===============================
chrome.runtime.onMessage.addListener((msg) => {

  if (msg.type === "STATE_UPDATED") {
    updatePopupUI(msg.state.score);
  }

});


// ===============================
// UPDATE UI
// ===============================
function updatePopupUI(score) {

  const statusDot = document.querySelector("#statusDot");
  const statusText = document.querySelector("#statusText");
  const toggle = document.querySelector("#protectionToggle");

  // Reset
  statusDot.className = "status-dot pulse";
  statusDot.style.boxShadow = "none";

  // ===============================
  // OFF
  // ===============================
  if (!toggle.checked) {

    statusDot.style.background = "var(--danger)";
    statusDot.style.boxShadow = "0 0 10px var(--danger)";

    statusText.textContent =
      "Hệ thống vô hiệu hóa (⚠️CHÚ Ý)";

    return;
  }

  // ===============================
  // SERVER LỖI / CHƯA CÓ DATA
  // ===============================
  if (score == null) {

    statusDot.style.background = "#94a3b8";

    statusText.textContent =
      "Không kết nối máy chủ";

    return;
  }

  // ===============================
  // ON
  // ===============================
  statusDot.style.background = "var(--success)";
  statusDot.style.boxShadow = "0 0 10px var(--success)";

  statusText.textContent =
    "Hệ thống đang hoạt động";

}