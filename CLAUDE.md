# FRUNAMI — Agent 開發指引

本檔記錄在 FRUNAMI 專案中開發時必須遵守的規範。新增規範時依主題加章節。

---

## 1. 視覺規範（Brand & Theme）

### 1.1 設計風格

- Modern Enterprise Networking，主色系為 Deep Ocean Blue 與 Cyan。
- 乾淨、專業、簡潔，帶科技感。
- 必須同時支援 Light Mode 與 Dark Mode。
- 避免過度使用漸層、陰影、發光效果。漸層只用在少數品牌重點（Logo、Hero、登入頁背景），不要用在一般按鈕、卡片、表格。
- **禁止紫色系**（indigo / violet / purple，例如 `#4F46E5`、`#A855F7`、`#8B7CF6`）。這是 fru-lab 留下的舊配色，看到就要換成品牌色。

### 1.2 品牌色

| Token | 色碼 | 用途 |
| - | - | - |
| Primary | `#0088E8` | 主要按鈕、連結、主要資料系列 |
| Primary Dark | `#0062D6` | Hover / Pressed |
| Primary Light | `#E6F8FF` | Light mode 選取 / Active 背景 |
| Secondary | `#00E5CC` | 第二資料系列、輔助強調 |
| Accent | `#8CFFAA` | 少量點綴（不可當作文字色放在淺底） |
| Cyan | `#00D9F5` | Info、第三資料系列 |
| Navy Blue | `#063B60` | Dark mode 選取背景、深色區塊 |
| Deep Ocean | `#02182F` | Dark mode 背景、Light mode 主文字 |
| Ice White | `#F5FAFF` | Light mode 背景、Dark mode 主文字 |

### 1.3 品牌漸層

- Primary Gradient：`linear-gradient(135deg, #0088E8, #00E5CC)`
- Ocean Gradient：`linear-gradient(135deg, #0062D6, #00D9F5, #8CFFAA)`
- Background Gradient：`linear-gradient(135deg, #063B60, #02182F)`

### 1.4 Light / Dark Mode

| 角色 | Light | Dark |
| - | - | - |
| Background | `#F5FAFF` | `#02182F` |
| Surface / Card | `#FFFFFF` | `#0B2942` |
| Border | `#DCE7F0` | `#16435E` |
| Primary Text | `#02182F` | `#F5FAFF` |
| Secondary Text | `#64748B` | `#94AFC5` |
| Primary Button | `#0088E8` | `#0088E8` |
| Primary Button Hover | `#0062D6` | `#0062D6` |
| Selected / Active Background | `#E6F8FF` | `#063B60` |

### 1.5 狀態色

| 狀態 | 色碼 |
| - | - |
| Success | `#10B981` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |
| Info | `#00D9F5` |

這些狀態色在白底上的文字對比都不足 4.5:1。當文字色使用時，要另外定義較深的 `*-ink` 變體（例如 Success ink `#047857`、Warning ink `#B45309`、Error ink `#B91C1C`、Info ink `#0369A1`），淺底 badge 則用 `*-bg` 變體。原色只用在圖示、圓點、圖表、粗邊框。

### 1.6 實作規則

- **色彩一律走 CSS 變數。** Design tokens 集中定義在 `web/frontend/src/index.css` 的 `:root`。Component 的 `*.module.css` 和 `.tsx` inline style 中不可寫死色碼，只能用 `var(--…)`。圖表顏色（SVG `fill` / `stroke`）也用變數。
- **沿用既有的變數名稱**（`--bg`、`--surface`、`--border`、`--ink`、`--muted`、`--accent`、`--accent-hover`、`--accent-soft`、`--chrome-*`、`--ok` / `--warn` / `--bad` 等），只換數值，避免大量改動 component。紫色語意的名稱（如 `--violet`、`--brand-1..3`）要改成品牌語意（如 `--secondary`、`--cyan`），並同步更新所有引用。
- **Dark mode：**
  - 在 `:root[data-theme="dark"]` 覆寫變數。
  - 沒有指定時跟隨系統：`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`。
  - Component 不應自己判斷主題，只吃變數。
- **元件一致性：** Sidebar、Navbar、Button、Card、Table、Modal、Input、Chart 都只使用上述 tokens。Sidebar / log viewer 這類 chrome 區塊兩種模式都用深色海洋色系（Deep Ocean / Navy），active 項目用 Primary 或 Cyan 標示。
- **圖表配色順序：** Dashboard 的流量、Throughput、UE 數量、效能圖表依序使用 Primary `#0088E8` → Secondary `#00E5CC` → Cyan `#00D9F5` → Navy `#063B60`（dark mode 改用 Accent `#8CFFAA`）。Uplink / Downlink 等成對資料用 Primary + Secondary。
- **無障礙：** 文字與背景對比需符合 WCAG AA（一般文字 4.5:1、大字與 UI 元件 3:1）。新增顏色組合時要驗證。不能只靠顏色傳達狀態，要搭配文字或圖示。
- **只改視覺：** 調整 UI / Theme 時，保留既有功能、路由、API 呼叫與操作邏輯。
- **全站一致：** 修改後要搜尋殘留的舊色碼和紫色系，指令如下，結果應只剩 `index.css` 裡的 token 定義：
  `grep -rniE '#[0-9a-f]{3,8}\b|purple|violet|indigo' web/frontend/src --include=*.css --include=*.tsx`
