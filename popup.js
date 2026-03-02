document.addEventListener("DOMContentLoaded", () => {

  loadState();

  document.querySelector("#protectionToggle")
    .addEventListener("change", (e) => {

      chrome.runtime.sendMessage({
        type: "TOGGLE_ENABLED",
        enabled: e.target.checked
      });

    });

  document.querySelector("#scanBtn")
    .addEventListener("click", () => {

      updatePopupUI(null, "Đang phân tích lại...");

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "FORCE_ANALYZE"
        });
      });

    });
});

// ===============================
function loadState() {

  chrome.runtime.sendMessage({ type: "GET_STATE" }, (state) => {

    if (!state) return;

    const toggle = document.querySelector("#protectionToggle");

    // Set toggle trước
    toggle.checked = state.enabled;

    // Sau đó mới update UI
    updatePopupUI(state.score, state.reason);

  });
}

// ===============================
chrome.runtime.onMessage.addListener((msg) => {

  if (msg.type === "STATE_UPDATED") {
    updatePopupUI(msg.state.score, msg.state.reason);
  }

});

// ===============================
function updatePopupUI(score, reason) {

  const scoreText = document.querySelector("#scoreValue");
  const progress = document.querySelector("#progressBar");
  const reasonBox = document.querySelector("#reasonBox");
  const statusDot = document.querySelector("#statusDot");
  const statusText = document.querySelector("#statusText");
  const toggle = document.querySelector("#protectionToggle");

  // Reset dot
  statusDot.className = "status-dot pulse";

  // ===============================
  // PROTECTION OFF
  // ===============================
  if (!toggle.checked) {

    scoreText.textContent = "--%";
    progress.style.width = "0%";
    reasonBox.textContent = "Realtime Protection đang tắt. (NGUY HIỂM CHÚ Ý)";

    statusDot.style.background = "var(--danger)";
    statusDot.style.boxShadow = "0 0 10px var(--danger)";

    statusText.textContent =
      "Hệ thống vô hiệu hóa";

    return;
  }

  // ===============================
  // SERVER LỖI / CHƯA CÓ DATA
  // ===============================
  if (score == null) {

    scoreText.textContent = "--%";
    progress.style.width = "0%";
    reasonBox.textContent = reason || "Không có dữ liệu";

    statusDot.style.background = "#94a3b8";
    statusDot.style.boxShadow = "none";

    statusText.textContent = "Không kết nối máy chủ";

    return;
  }

  // ===============================
  // PROTECTION ON + CÓ ĐIỂM
  // ===============================
  scoreText.textContent = score + "%";
  progress.style.width = score + "%";
  reasonBox.textContent = reason || "Phân tích hoàn tất.";

  statusDot.style.background = "var(--success)";
  statusDot.style.boxShadow = "0 0 10px var(--success)";

  statusText.textContent = "Hệ thống đang hoạt động";
}