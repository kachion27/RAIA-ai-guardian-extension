// =======================================
// RAIA BACKGROUND SERVICE WORKER
// =======================================

let globalState = {
  score: null,
  reason: "Chưa phân tích",
  enabled: true
};

// ===============================
// GỌI SERVER
// ===============================
async function callServer(url, text) {

  if (!globalState.enabled) {
    return {
      score: null,
      reason: "Realtime Protection đang tắt."
    };
  }

  try {
    const res = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, text })
    });

    const data = await res.json();

    globalState.score = data.score;
    globalState.reason = data.reason;

    broadcastState();

    return data;

  } catch (err) {

    globalState.score = null;
    globalState.reason =
      "Không thể kết nối máy chủ\nKiểm tra server đã chạy chưa";

    broadcastState();

    return {
      score: null,
      reason: globalState.reason
    };
  }
}

// ===============================
// BROADCAST STATE CHO POPUP
// ===============================
function broadcastState() {
  chrome.runtime.sendMessage({
    type: "STATE_UPDATED",
    state: globalState
  });
}

// ===============================
// MESSAGE HANDLER
// ===============================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // Phân tích
  if (msg.type === "ANALYZE_PAGE") {
    callServer(msg.url, msg.text).then(result => {
      sendResponse(result);
    });
    return true;
  }

  // Lấy state
  if (msg.type === "GET_STATE") {
    sendResponse(globalState);
  }

  // Bật / Tắt protection
  if (msg.type === "TOGGLE_ENABLED") {

    globalState.enabled = msg.enabled;

    if (!msg.enabled) {
      globalState.score = null;
      globalState.reason = "Realtime Protection đang tắt.";
    }

    broadcastState();

    // Gửi sang tất cả tab
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: "PROTECTION_CHANGED",
          enabled: msg.enabled
        });
      });
    });

    sendResponse({ success: true });
  }
});