<!DOCTYPE html>
<html lang="vi">
<body>

<div align="center">
  <img src="https://github.com/kachion27/RAIA-ai-guardian-extension/blob/main/img/popup.png?raw=true" alt="RAIA Logo" width="300" />
  <h1>🛡️ RAIA – Real-time AI Anti-Scam</h1>
  <p><i>Lá chắn Trí tuệ Nhân tạo thời gian thực sử dụng Gemini 3 để bảo vệ bạn khỏi lừa đảo kỹ thuật số.</i></p>

  <img src="https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/AI_Model-Gemini--3--Flash-7b2eff?style=for-the-badge" alt="Model">
  <img src="https://img.shields.io/badge/SDK-@google/genai-orange?style=for-the-badge" alt="SDK">
  <img src="https://img.shields.io/badge/Status-Beta-red?style=for-the-badge" alt="Status">
</div>

<hr />

<h2>🚀 Giới thiệu dự án</h2>
<p>
  <b>RAIA</b> là Chrome Extension bảo mật thế hệ mới sử dụng <b>Gemini 3 Flash</b> để phân tích nội dung website theo thời gian thực.
  Không phụ thuộc vào blacklist truyền thống, RAIA đọc hiểu ngữ nghĩa toàn bộ trang web và đánh giá mức độ rủi ro bằng AI tiên tiến.
</p>

<hr />

<h2>🧠 Công nghệ sử dụng</h2>

<table>
  <tr>
    <td><b>Browser Engine</b></td>
    <td>Manifest V3, JavaScript (ES6+), CSS3</td>
  </tr>
  <tr>
    <td><b>AI Model</b></td>
    <td>Gemini 3 Flash (Google Generative AI)</td>
  </tr>
  <tr>
    <td><b>AI SDK</b></td>
    <td>@google/genai</td>
  </tr>
  <tr>
    <td><b>Backend Bridge</b></td>
    <td>Node.js + Express</td>
  </tr>
  <tr>
    <td><b>Communication</b></td>
    <td>REST API (localhost:3000)</td>
  </tr>
</table>

<hr />

<h2>🏗 Kiến trúc hệ thống</h2>

<ul>
  <li><b><code>content.js</code>:</b> Quét DOM, hiển thị overlay cảnh báo và panel phân tích.</li>
  <li><b><code>background.js</code>:</b> State Manager + điều phối request tới server.</li>
  <li><b><code>popup.js</code>:</b> Giao diện người dùng, hiển thị điểm rủi ro và điều khiển bật/tắt.</li>
  <li><b><code>server.js</code>:</b> Bridge Server gọi Gemini 3 Flash qua @google/genai.</li>
  <li><b>Gemini 3:</b> Phân tích nội dung website bằng Prompt Engineering nâng cao.</li>
</ul>

<pre>
Extension (MV3)
   ↓
Background Service Worker
   ↓
Node.js Bridge Server
   ↓
Gemini 3 Flash (Google GenAI)
</pre>

<hr />

<h2>🔥 Tính năng chính</h2>

<ul>
  <li>✅ <b>AI Phishing Detection:</b> Phát hiện nội dung giả mạo, yêu cầu cung cấp OTP, thông tin ngân hàng.</li>
  <li>✅ <b>Real-time Risk Scoring:</b> Chấm điểm rủi ro từ 0 → 100.</li>
  <li>✅ <b>Smart Warning Overlay:</b> Thanh cảnh báo nổi không che header website.</li>
  <li>✅ <b>Live State Sync:</b> Đồng bộ trạng thái giữa Website và Popup.</li>
  <li>✅ <b>Toggle Protection:</b> Tắt/mở bảo vệ tức thì.</li>
  <li>✅ <b>Manual Scan:</b> Quét lại trang ngay lập tức.</li>
</ul>

<hr />

<h2>⚙️ Cài đặt & Chạy Local</h2>

<h3>1️⃣ Cài đặt Backend</h3>

<pre>
<code>
cd server
npm install
</code>
</pre>

Tạo file `.env`:

<pre>
<code>
GEMINI_API_KEY=YOUR_API_KEY
PORT=3000
</code>
</pre>

Chạy server:

<pre>
<code>
node server.js
</code>
</pre>

<h3>2️⃣ Cài đặt Extension</h3>

<ul>
  <li>Mở <code>chrome://extensions/</code></li>
  <li>Bật <b>Developer Mode</b></li>
  <li>Chọn <b>Load unpacked</b></li>
  <li>Trỏ tới thư mục <code>/extension</code></li>
</ul>

<hr />

<h2>🤖 Cấu hình Gemini 3</h2>

RAIA sử dụng SDK chính thức:

<pre>
<code>
npm install @google/genai
</code>
</pre>

Ví dụ gọi Gemini 3:

<pre>
<code>
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Analyze website risk level"
});
</code>
</pre>

<hr />

<h2>📂 Cấu trúc thư mục</h2>

<pre>
raia-project/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── style.css
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
</pre>

<hr />

<h2>🛡 Bảo mật & Quyền riêng tư</h2>

<p align="justify">
RAIA không lưu trữ lịch sử duyệt web.
Chỉ gửi nội dung trang web đến server local của bạn (localhost).
Gemini 3 chỉ nhận nội dung cần thiết để phân tích rủi ro.
Không thu thập cookie, mật khẩu hoặc dữ liệu cá nhân.
</p>

<hr />

<h2>🗺 Roadmap</h2>

<ul>
  <li>[ ] AI Deepfake Image Detection</li>
  <li>[ ] Scam Pattern Learning</li>
  <li>[ ] Hybrid Cloud Mode</li>
  <li>[ ] Chrome Web Store Publish</li>
  <li>[ ] Community Threat Intelligence</li>
</ul>

<hr />

<h2>👨‍💻 Tác giả</h2>

<p>
Dự án được phát triển bởi <b>NHUDANGKOCHO</b> – <b>27NETTEAM</b>.<br>
Powered by Gemini 3.
</p>

<div align="center">
  <p><b>🛡 RAIA – AI Guardian Powered by Gemini 3</b></p>
</div>

</body>
</html>
