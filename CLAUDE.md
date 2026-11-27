# FRUNAMI — Agent 開發指引

本檔記錄在 FRUNAMI 專案中開發時必須遵守的規範。新增規範時依主題加章節。

---

## 1. 視覺規範（Brand & Theme）

### 1.1 設計風格

- Modern Enterprise Networking，主色系為 Deep Ocean Blue 與 Cyan。
- 乾淨、專業、簡潔，帶科技感。
- 必須同時支援 Light Mode 與 Dark Mode。
- 避免過度使用漸層、陰影、發光效果。漸層只用在少數品牌重點（Logo、Hero、登入頁背景），不要用在一般按鈕、卡片、表格。
- **禁止紫色系**（indigo / violet / purple，例如 `#4F46E5`、`#A855F7`、`#8B7CF6`）。這是前身專案留下的舊配色，看到就要換成品牌色。

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
- **Token 一覽**（定義在 `index.css`，新顏色先加 token 再用）：
  - 品牌原色：`--primary`、`--primary-dark`、`--primary-light`、`--secondary`、`--mint`（品牌 Accent）、`--cyan`、`--navy`、`--ocean`、`--ice`、`--gradient-primary` / `--gradient-ocean` / `--gradient-bg`。
  - 介面語意：`--bg`、`--surface`、`--surface-sunken`、`--surface-muted`、`--border`、`--border-soft`、`--border-strong`、`--overlay`、`--ink`、`--ink-2`、`--muted`。
  - 互動：`--accent`（主按鈕、填色）、`--accent-hover`、`--accent-ink`（連結與淺底上的強調文字）、`--accent-soft`（選取背景）、`--accent-ring`、`--on-accent`（accent 上的文字）。
  - 圖表：`--chart-1..4`。
  - 深色區塊：`--chrome`、`--chrome-hover`、`--chrome-active`、`--chrome-border`、`--chrome-strong`、`--chrome-text`、`--chrome-muted`、`--chrome-accent`、`--log-info` / `--log-warn` / `--log-err`。
  - 狀態：`--ok` / `--warn` / `--bad` / `--info`，各有 `-ink`、`-bg`；實心危險按鈕用 `--bad-strong` / `--bad-strong-hover`。
  - 已移除：`--violet`、`--brand-1..3`，不可再用。
- **Dark mode：**
  - 在 `:root[data-theme="dark"]` 覆寫變數，與 `prefers-color-scheme` 區塊內容保持一致。
  - 使用者切換由 `src/theme.ts` 的 `useTheme()` 處理（側邊欄的 Light / Dark mode 按鈕），選擇存在 localStorage `frunami-theme`，`index.html` 在首次繪製前套用。
  - 沒有指定時跟隨系統：`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`。
  - Component 不應自己判斷主題，只吃變數。
- **元件一致性：** Sidebar、Navbar、Button、Card、Table、Modal、Input、Chart 都只使用上述 tokens。Sidebar / log viewer 這類 chrome 區塊兩種模式都用深色海洋色系（Deep Ocean / Navy），active 項目用 Primary 或 Cyan 標示。
- **圖表配色順序：** Dashboard 的流量、Throughput、UE 數量、效能圖表依序使用 `--chart-1..4`。Dark mode 為 Primary → Secondary → Cyan → Accent；Light mode 為 Primary `#0088E8` → 深青綠 `#009E8A` → 深青 `#0092B8` → Navy `#063B60`，因為原本的 Secondary / Cyan 在白底只有約 1.6:1，細線會看不清楚。Uplink / Downlink 等成對資料用 `--chart-1` + `--chart-2`。
- **無障礙：** 文字與背景對比需符合 WCAG AA（一般文字 4.5:1、大字與 UI 元件 3:1）。新增顏色組合時要驗證。不能只靠顏色傳達狀態，要搭配文字或圖示。
  - 已知例外：規範指定的 Primary Button `#0088E8` 配白字只有約 3.7:1，未達一般文字 4.5:1。若要完全符合 AA，把 `--accent` 改成 `#0062D6`（約 5.6:1）即可。
  - 連結與淺底上的強調文字一律用 `--accent-ink`，不要用 `--accent`。
- **只改視覺：** 調整 UI / Theme 時，保留既有功能、路由、API 呼叫與操作邏輯。
- **全站一致：** 修改後要搜尋殘留的舊色碼和紫色系，指令如下，結果應只剩 `index.css` 裡的 token 定義：
  `grep -rniE '#[0-9a-f]{3,8}\b|purple|violet|indigo' web/frontend/src --include=*.css --include=*.tsx`

### 1.7 品牌圖片

- 原始檔（高解析度）放在根目錄 `assets/`：`frunami-favicon.png`（圖示，無字）、`frunami-icon.png`（圖示加 FRUNAMI 字樣）、`frunami-main.png`（橫幅，README 使用）。
- 網頁用的是縮小後的版本，不要把原始大圖放進 `web/frontend/public/` 或 `src/assets/`：
  - `public/favicon-32.png`、`public/favicon-192.png`、`public/apple-touch-icon.png`：由 `frunami-favicon.png` 產生。
  - `src/assets/frunami-mark.png`（128px）：側邊欄與登入頁的 `LogoMark`。
  - `src/assets/frunami-banner.webp`（1600px）：登入頁橫幅。
- 更換原始圖時要重新產生上述檔案。
- Docker image 名稱：`alonza0314/frunami`（web console）與 `alonza0314/frunami-tester`（tester）。
- 產品顯示名稱：UI 上一律寫 `FRUNAMI`。
- 程式、指令與設定中的名稱：
  - web console 寫 `frunami`（binary `build/frunami`、Docker 網路 `frunami-*`、路徑 `/var/lib/frunami`）。
  - tester 寫 `frunami-tester`（binary、image、容器路徑 `/frunami-tester`）。
  - 環境變數前綴用 `FRUNAMI_TESTER_`。
- 舊名 `fru-lab` / `frulab` / `fru-tester` / `frutester` 已全面移除，不要再加回來。
