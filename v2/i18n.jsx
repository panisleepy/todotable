/* global React */
// ===========================================================
// 多語系 — 繁體中文 (zh-TW) / English (en)
// 使用方式：const { t, locale, setLocale } = useI18n();
//          t('todo.addPlaceholder')
// ===========================================================

const LOCALE_KEY = "vibe-diary.locale";

const MESSAGES = {
  "zh-TW": {
    "app.title": "工作桌日記 — 側邊停靠 v2",
    "app.pageTitle": "工作桌日記 — 側邊停靠 v2",
    "lang.zh": "中文",
    "lang.en": "English",
    "lang.switch": "語言",

    "tabs.todo": "待辦",
    "tabs.cheat": "指令",
    "tabs.mail": "詢問",
    "tabs.cal": "日曆",

    "project.defaultName": "我的專案",
    "project.label": "專案",
    "project.menu": "專案選單",
    "project.newPrompt": "新專案名稱",
    "project.renamePrompt": "變更專案名稱",
    "project.deleteConfirm": "確定刪除「{name}」專案？（待辦等資料仍會保留）",
    "project.add": "＋ 新增專案",
    "project.rename": "✎ 重新命名",
    "project.delete": "✕ 刪除「{name}」",
    "project.fallback": "專案",

    "dday.default": "倒數日",
    "dday.settings": "倒數日設定",
    "dday.settingsTitle": "倒數日設定",
    "dday.namePlaceholder": "名稱（例：上線）",
    "dday.clearDate": "清除日期",
    "dday.configure": "設定",
    "dday.dDay": "就是今天",

    "todo.header": "待辦",
    "todo.pending": "待完成 · {count}",
    "todo.done": "已完成 · {count}",
    "todo.addPlaceholder": "新增待辦…",
    "todo.emptyPending": "在下方輸入框寫下待辦事項",
    "todo.emptyDone": "完成的事項會累積在這裡",
    "todo.markDone": "標記為完成",
    "todo.undo": "還原",
    "todo.markHot": "標記為緊急",
    "todo.unmarkHot": "取消緊急",

    "calendar.today": "今天",
    "calendar.gotoToday": "回到今天",
    "calendar.monthly": "月曆",
    "calendar.notePlaceholder": "今日備註 · 寫點日記…",
    "calendar.doneCount": "{count} 項完成",
    "calendar.mailCount": "{count} 封郵件",
    "calendar.inquiry": "詢問",
    "calendar.yearMonth": "{year} 年 {month} 月",
    "calendar.weekdays": ["日", "一", "二", "三", "四", "五", "六"],

    "cheat.frequent": "常用指令 · {count}",
    "cheat.all": "已儲存指令 · {count}",
    "cheat.frequentEmpty": "常用後會出現在這裡（複製時計數）",
    "cheat.addPlaceholder": "新增指令…",
    "cheat.emptyAll": "在上方輸入框寫下指令並儲存",
    "cheat.labelPlaceholder": "（標籤）",
    "cheat.uses": "{count} 次",
    "cheat.copy": "複製",
    "cheat.deleteConfirm": "確定刪除「{name}」？",

    "mail.inbox": "收到的詢問 · {count}",
    "mail.draft": "郵件草稿",
    "mail.pastePlaceholder": "貼上收到的郵件…",
    "mail.add": "加入",
    "mail.replied": "已回覆 · {count}",
    "mail.empty": "貼上收到的郵件試試看",
    "mail.selectHint": "在上方選擇一則詢問，即可在這裡撰寫草稿",
    "mail.noSubject": "（無主旨）",
    "mail.draftFor": "✍️ {subject} — 回覆草稿",
    "mail.draftPlaceholder": "撰寫回覆草稿…",
    "mail.markReplied": "標記為已回覆",
    "mail.unmarkReplied": "標記為未回覆",
    "mail.repliedBtn": "✓ 已回覆",
    "mail.platformPrompt": "此郵件的回覆／平台網址（例：https://mail.google.com/...）",
    "mail.openSite": "開啟網站",
    "mail.linkSite": "連結網站",

    "prompt.searchPlaceholder": "依標題搜尋…",
    "prompt.new": "＋ 儲存新提示詞",
    "prompt.bodyPlaceholder": "常用提示詞內文…",
    "prompt.cancel": "取消",
    "prompt.save": "儲存",
    "prompt.noResults": "沒有搜尋結果",
    "prompt.empty": "尚無提示詞 — 請在上方新增",
    "prompt.uses": "{count} 次使用",
    "prompt.body": "提示詞內文",
    "prompt.copied": "✓ 已複製",
    "prompt.copy": "📋 複製",
    "prompt.deleteConfirm": "確定刪除此提示詞？",

    "ai.title": "AI 工作階段書籤",
    "ai.subtitle": "此專案 · {count} 筆 · 好／差 + 一行備註",
    "ai.add": "＋ 新增書籤",
    "ai.titlePlaceholder": "工作階段一行摘要（例：Auth 流程設計）",
    "ai.notePlaceholder": "備註（選填）",
    "ai.good": "● 好",
    "ai.bad": "○ 差",
    "ai.goodLabel": "好",
    "ai.badLabel": "差",
    "ai.empty": "此專案尚無 AI 工作階段紀錄",
    "ai.todayPrefix": "今天 · ",
    "ai.toggle": "好／差切換",
    "ai.noteAdd": "新增備註…",

    "timer.prev": "上一首",
    "timer.playBtn": "播放",
    "timer.pause": "暫停",
    "timer.next": "下一首",
    "timer.playlist": "播放清單",
    "timer.addYoutube": "貼上 YouTube 連結",
    "timer.youtubeHint": "貼上 YouTube 連結加入曲目",
    "timer.preparing": "準備播放中…",
    "timer.noTrack": "加入 YouTube 連結 ♫",
    "timer.youtubeError": "無法辨識 YouTube 連結",
    "timer.playlistTitle": "播放清單 ♫",
    "timer.playOne": "播放",
    "timer.youtubeTrack": "YouTube 曲目",
    "timer.playing": "播放中…",
    "timer.stretchTips": [
      "轉一下肩膀吧",
      "慢慢左右轉動脖子",
      "挺直腰深吸一口氣",
      "轉動手腕一圈",
      "眨眨眼，望向遠方",
      "站起來伸個懶腰",
      "喝口水吧",
    ],
    "timer.clickPause": "點擊：暫停",
    "timer.clickStart": "點擊：開始／繼續",

    "retro.todayLabel": "今天 · {date}",
    "retro.pastHeader": "過往回顧 · {count}",
    "retro.pastEmpty": "尚無過往回顧 — 每天寫一行就會累積",
    "retro.goodShort": "做得好（選填）",
    "retro.badShort": "卡住的地方（選填）",

    "ai.unavailable": "無法使用 AI（未連接 Claude API）",
    "ai.emptyResponse": "回應為空",
    "ai.parseError": "無法解析回應",
    "ai.stuckEmpty": "卡住事項為空",
    "ai.notArray": "回應格式不是陣列",
    "common.none": "（無）",

    "photo.shapeRect": "基本",
    "photo.shapePolaroid": "拍立得",
    "photo.shapeCircle": "圓形",
    "photo.shapeWide": "寬幅",
    "photo.texWhite": "白色",
    "photo.texYellow": "螢光",
    "photo.texFilm": "底片",
    "photo.texPastel": "粉彩",
    "photo.texMint": "薄荷",
    "photo.captureUnsupported": "此環境不支援擷取 — 請用 Win+Shift+S",
    "photo.pickFullscreen": "請在畫面選擇「整個螢幕」…",
    "photo.captureFail": "擷取失敗",
    "photo.saved": "已儲存 ✓（下載資料夾）",
    "photo.captureErr": "擷取取消／失敗：{msg}",
    "photo.captureBtn": "📸 擷取",
    "photo.hint": "把框移到工作畫面上，按 📸 或 Win+Shift+S",

    "retro.finishTitle": "結束今日工作",
    "retro.todayLine": "今日一行",
    "retro.aiDraft": "✨ AI 草稿",
    "retro.thinking": "思考中…",
    "retro.placeholder": "今天過得如何？一行就夠",
    "retro.good": "👍 做得好的",
    "retro.bad": "👎 卡住的",
    "retro.optional": "（選填）",
    "retro.doneToday": "今日完成",
    "retro.close": "關閉（繼續工作）",
    "retro.finish": "✓ 結束今天",
    "retro.work": "⏱ {minutes}m 工作",
    "retro.doneCount": "✓ {count} 項完成",
    "retro.fail": "失敗",

    "today.summary": "今天 — {date}",
    "today.stats": "工作 {minutes}m · {todos} 項待辦 · {mails} 封未回",

    "common.save": "儲存",
    "common.delete": "刪除",
    "common.cancel": "取消",
    "common.justNow": "剛剛",
    "common.inquiry": "詢問",
    "common.settings": "設定",

    "store.resetConfirm": "確定清除所有資料並還原為初始狀態？",

    "git.connect": "連結 git",
    "git.open": "git 儲存庫",
    "git.prompt": "git 儲存庫網址（例：https://github.com/me/repo）",
    "folder.connect": "連結資料夾",
    "folder.openFail": "無法開啟資料夾：{msg}",
    "folder.desktopOnly": "開啟資料夾僅在桌面版可用",

    "kbd.todo": "新增待辦…（Enter 儲存 · Shift+Enter 換行）",
    "kbd.cheat": "儲存指令…（Enter 儲存 · Shift+Enter 換行）",
    "kbd.mail": "貼上郵件後 Enter…（Shift+Enter 換行）",
    "kbd.cal": "為此日期新增備註…（Enter 儲存）",
    "kbd.add": "新增 (Enter)",

    "fakeIde.hint": "✿ 這是參考用的假 IDE — 用來展示日記停靠的位置",
    "fakeIde.path": "vibe-diary / src / components / Timer.tsx",
    "fakeIde.taskbar": "♡ 日記",
    "fakeIde.stretch": "14:23 · 下次伸展 23m",

    "tweaks.title": "調校",
    "tweaks.layout": "版面",
    "tweaks.desktopMode": "桌面模式（透明）",
    "tweaks.dockSide": "停靠位置",
    "tweaks.dockLeft": "左側",
    "tweaks.dockRight": "右側",
    "tweaks.tabSide": "索引分頁方向",
    "tweaks.tabOutside": "外側",
    "tweaks.tabInside": "內側",
    "tweaks.accent": "強調色",
    "tweaks.pointColor": "重點色",

    "header.sub.todo": "{pending} 項待完成 · {hot} 項緊急",
    "header.sub.cheat": "{project} · {count} 項 · 點擊複製",
    "header.sub.mail": "{count} 封未回 · 標記已回覆後自動整理",
    "header.sub.prompt": "已儲存 {count} 則 · 依常用排序",
    "header.sub.retro": "每日一則 · 自動儲存",
    "header.sub.today": "工作 {minutes}m · {todos} 項待辦 · {mails} 封未回",
    "header.cheat": "指令",
    "header.mail": "客戶詢問",
    "header.prompt": "提示詞庫",
    "header.retro": "回顧",
  },
  en: {
    "app.title": "Working Table Diary — Side Dock v2",
    "app.pageTitle": "Working Table Diary — Side Dock v2",
    "lang.zh": "中文",
    "lang.en": "English",
    "lang.switch": "Language",

    "tabs.todo": "To-do",
    "tabs.cheat": "Commands",
    "tabs.mail": "Inbox",
    "tabs.cal": "Calendar",

    "project.defaultName": "My Project",
    "project.label": "Project",
    "project.menu": "Project menu",
    "project.newPrompt": "New project name",
    "project.renamePrompt": "Rename project",
    "project.deleteConfirm": "Delete project \"{name}\"? (To-dos and other data remain)",
    "project.add": "＋ Add project",
    "project.rename": "✎ Rename",
    "project.delete": "✕ Delete \"{name}\"",
    "project.fallback": "Project",

    "dday.default": "Countdown",
    "dday.settings": "Countdown settings",
    "dday.settingsTitle": "Countdown settings",
    "dday.namePlaceholder": "Name (e.g. Launch)",
    "dday.clearDate": "Clear date",
    "dday.configure": "Set",
    "dday.dDay": "D-DAY",

    "todo.header": "To-do",
    "todo.pending": "Pending · {count}",
    "todo.done": "Done · {count}",
    "todo.addPlaceholder": "Add a task…",
    "todo.emptyPending": "Write your to-do in the box below",
    "todo.emptyDone": "Completed tasks pile up here",
    "todo.markDone": "Mark done",
    "todo.undo": "Undo",
    "todo.markHot": "Mark urgent",
    "todo.unmarkHot": "Unmark urgent",

    "calendar.today": "Today",
    "calendar.gotoToday": "Go to today",
    "calendar.monthly": "Monthly calendar",
    "calendar.notePlaceholder": "Today's note · journal…",
    "calendar.doneCount": "{count} done",
    "calendar.mailCount": "{count} emails",
    "calendar.inquiry": "Inquiry",
    "calendar.yearMonth": "{month}/{year}",
    "calendar.weekdays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    "cheat.frequent": "Frequent commands · {count}",
    "cheat.all": "Saved commands · {count}",
    "cheat.frequentEmpty": "Often-used commands appear here (counted on copy)",
    "cheat.addPlaceholder": "Add command…",
    "cheat.emptyAll": "Type a command above to save",
    "cheat.labelPlaceholder": "(label)",
    "cheat.uses": "{count}×",
    "cheat.copy": "Copy",
    "cheat.deleteConfirm": "Delete \"{name}\"?",

    "mail.inbox": "Inbox · {count}",
    "mail.draft": "Draft",
    "mail.pastePlaceholder": "Paste received email…",
    "mail.add": "Add",
    "mail.replied": "Replied · {count}",
    "mail.empty": "Paste a received email to get started",
    "mail.selectHint": "Select an inquiry above to write a draft here",
    "mail.noSubject": "(no subject)",
    "mail.draftFor": "✍️ {subject} — reply draft",
    "mail.draftPlaceholder": "Write your reply draft…",
    "mail.markReplied": "Mark as replied",
    "mail.unmarkReplied": "Mark as unreplied",
    "mail.repliedBtn": "✓ Replied",
    "mail.platformPrompt": "Reply / platform URL (e.g. https://mail.google.com/...)",
    "mail.openSite": "Open site",
    "mail.linkSite": "Link site",

    "prompt.searchPlaceholder": "Search by title…",
    "prompt.new": "＋ Save new prompt",
    "prompt.bodyPlaceholder": "Prompt body…",
    "prompt.cancel": "Cancel",
    "prompt.save": "Save",
    "prompt.noResults": "No results",
    "prompt.empty": "No prompts yet — add one above",
    "prompt.uses": "Used {count}×",
    "prompt.body": "Prompt body",
    "prompt.copied": "✓ Copied",
    "prompt.copy": "📋 Copy",
    "prompt.deleteConfirm": "Delete this prompt?",

    "ai.title": "AI session bookmarks",
    "ai.subtitle": "This project · {count} · good/bad + one-line note",
    "ai.add": "＋ Add bookmark",
    "ai.titlePlaceholder": "One-line summary (e.g. Auth flow design)",
    "ai.notePlaceholder": "Note (optional)",
    "ai.good": "● Good",
    "ai.bad": "○ Meh",
    "ai.goodLabel": "Good",
    "ai.badLabel": "Meh",
    "ai.empty": "No AI sessions for this project yet",
    "ai.todayPrefix": "Today · ",
    "ai.toggle": "Toggle good/bad",
    "ai.noteAdd": "Add note…",

    "timer.prev": "Previous",
    "timer.playBtn": "Play",
    "timer.pause": "Pause",
    "timer.next": "Next",
    "timer.playlist": "Playlist",
    "timer.addYoutube": "Paste YouTube link",
    "timer.youtubeHint": "Paste a YouTube link to add a track",
    "timer.preparing": "Preparing…",
    "timer.noTrack": "Add a YouTube link ♫",
    "timer.youtubeError": "Could not parse YouTube link",
    "timer.playlistTitle": "Playlist ♫",
    "timer.playOne": "Play",
    "timer.youtubeTrack": "YouTube track",
    "timer.playing": "Playing…",
    "timer.stretchTips": [
      "Roll your shoulders",
      "Slowly turn your neck side to side",
      "Straighten up and take a deep breath",
      "Rotate your wrists",
      "Blink and look into the distance",
      "Stand up and stretch",
      "Have a sip of water",
    ],
    "timer.clickPause": "Click: pause",
    "timer.clickStart": "Click: start / resume",

    "retro.todayLabel": "Today · {date}",
    "retro.pastHeader": "Past retros · {count}",
    "retro.pastEmpty": "No past retros yet — add a line each day",
    "retro.goodShort": "What went well (optional)",
    "retro.badShort": "What was stuck (optional)",

    "ai.unavailable": "AI unavailable (Claude API not connected)",
    "ai.emptyResponse": "Empty response",
    "ai.parseError": "Could not parse response",
    "ai.stuckEmpty": "Stuck note is empty",
    "ai.notArray": "Response was not an array",
    "common.none": "(none)",

    "photo.shapeRect": "Default",
    "photo.shapePolaroid": "Polaroid",
    "photo.shapeCircle": "Circle",
    "photo.shapeWide": "Wide",
    "photo.texWhite": "White",
    "photo.texYellow": "Neon",
    "photo.texFilm": "Film",
    "photo.texPastel": "Pastel",
    "photo.texMint": "Mint",
    "photo.captureUnsupported": "Capture not supported here — use Win+Shift+S",
    "photo.pickFullscreen": "Pick “Entire screen” in the picker…",
    "photo.captureFail": "Capture failed",
    "photo.saved": "Saved ✓ (Downloads)",
    "photo.captureErr": "Capture cancelled/failed: {msg}",
    "photo.captureBtn": "📸 Capture",
    "photo.hint": "Move the frame over your work, then 📸 or Win+Shift+S",

    "retro.finishTitle": "Wrap up today",
    "retro.todayLine": "Today's line",
    "retro.aiDraft": "✨ AI draft",
    "retro.thinking": "Thinking…",
    "retro.placeholder": "How was today? One line is enough",
    "retro.good": "👍 What went well",
    "retro.bad": "👎 What was stuck",
    "retro.optional": "(optional)",
    "retro.doneToday": "Done today",
    "retro.close": "Close (keep working)",
    "retro.finish": "✓ Finish today",
    "retro.work": "⏱ {minutes}m worked",
    "retro.doneCount": "✓ {count} completed",
    "retro.fail": "Failed",

    "today.summary": "Today — {date}",
    "today.stats": "{minutes}m work · {todos} to-dos · {mails} unreplied",

    "common.save": "Save",
    "common.delete": "Delete",
    "common.cancel": "Cancel",
    "common.justNow": "Just now",
    "common.inquiry": "Inquiry",
    "common.settings": "Settings",

    "store.resetConfirm": "Erase all data and reset to initial state?",

    "git.connect": "Link git",
    "git.open": "Git repo",
    "git.prompt": "Git repo URL (e.g. https://github.com/me/repo)",
    "folder.connect": "Link folder",
    "folder.openFail": "Could not open folder: {msg}",
    "folder.desktopOnly": "Open folder works in desktop app only",

    "kbd.todo": "Add to-do… (Enter save · Shift+Enter newline)",
    "kbd.cheat": "Save command… (Enter save · Shift+Enter newline)",
    "kbd.mail": "Paste email, Enter… (Shift+Enter newline)",
    "kbd.cal": "Add note for this date… (Enter save)",
    "kbd.add": "Add (Enter)",

    "fakeIde.hint": "✿ Fake IDE for reference — shows where the diary docks",
    "fakeIde.path": "vibe-diary / src / components / Timer.tsx",
    "fakeIde.taskbar": "♡ Diary",
    "fakeIde.stretch": "14:23 · next stretch 23m",

    "tweaks.title": "Tweaks",
    "tweaks.layout": "Layout",
    "tweaks.desktopMode": "Desktop mode (transparent)",
    "tweaks.dockSide": "Dock side",
    "tweaks.dockLeft": "Left",
    "tweaks.dockRight": "Right",
    "tweaks.tabSide": "Tab direction",
    "tweaks.tabOutside": "Outside",
    "tweaks.tabInside": "Inside",
    "tweaks.accent": "Accent",
    "tweaks.pointColor": "Point color",

    "header.sub.todo": "{pending} pending · {hot} urgent",
    "header.sub.cheat": "{project} · {count} · click to copy",
    "header.sub.mail": "{count} unreplied · mark replied to tidy up",
    "header.sub.prompt": "{count} saved · sorted by use",
    "header.sub.retro": "One per day · auto-saved",
    "header.sub.today": "{minutes}m work · {todos} to-dos · {mails} unreplied",
    "header.cheat": "Commands",
    "header.mail": "Customer inquiries",
    "header.prompt": "Prompt library",
    "header.retro": "Retro",
  },
};

function detectLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved && MESSAGES[saved]) return saved;
  } catch (_) {}
  const lang = (navigator.language || "zh-TW").toLowerCase();
  if (lang.startsWith("en")) return "en";
  return "zh-TW";
}

let _locale = detectLocale();
const _subs = new Set();

function subscribe(fn) {
  _subs.add(fn);
  return () => _subs.delete(fn);
}

function setLocale(loc) {
  if (!MESSAGES[loc] || loc === _locale) return;
  _locale = loc;
  try { localStorage.setItem(LOCALE_KEY, loc); } catch (_) {}
  document.documentElement.lang = loc === "zh-TW" ? "zh-Hant" : "en";
  document.title = t("app.pageTitle");
  if (window.diary && window.diary.applyLocaleToDefaults) {
    window.diary.applyLocaleToDefaults();
  }
  _subs.forEach((fn) => fn());
}

function getLocale() {
  return _locale;
}

function t(key, params = {}) {
  const dict = MESSAGES[_locale] || MESSAGES["zh-TW"];
  let s = dict[key];
  if (s == null) s = MESSAGES["en"][key] ?? key;
  if (Array.isArray(s)) return s;
  if (typeof s !== "string") return String(s);
  return s.replace(/\{(\w+)\}/g, (_, k) =>
    params[k] != null ? String(params[k]) : `{${k}}`
  );
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const days = t("calendar.weekdays");
  const dow = Array.isArray(days) ? days[new Date(y, m - 1, d).getDay()] : "";
  if (_locale === "en") return `${m}/${d} (${dow})`;
  return `${m}月 ${d} 日（${dow}）`;
}

function fmtDateShort(iso) {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}/${d}`;
}

function useI18n() {
  const [, tick] = React.useState(0);
  React.useEffect(() => subscribe(() => tick((x) => x + 1)), []);
  return { t, locale: _locale, setLocale, fmtDate, fmtDateShort };
}

function LanguageSwitcher({ style = {} }) {
  const { locale, setLocale, t: tr } = useI18n();
  return (
    <div style={{ display: "inline-flex", gap: 2, flexShrink: 0, ...style }} title={tr("lang.switch")}>
      {["zh-TW", "en"].map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          style={{
            all: "unset",
            cursor: "pointer",
            padding: "1px 7px",
            borderRadius: 99,
            border: "1px solid var(--ink)",
            fontFamily: "var(--hand)",
            fontSize: 11,
            fontWeight: locale === loc ? 700 : 400,
            background: locale === loc ? "var(--point)" : "rgba(255,255,255,0.5)",
            color: "var(--ink)",
          }}
        >
          {loc === "zh-TW" ? tr("lang.zh") : tr("lang.en")}
        </button>
      ))}
    </div>
  );
}

document.documentElement.lang = _locale === "zh-TW" ? "zh-Hant" : "en";

window.i18n = {
  t,
  setLocale,
  getLocale,
  fmtDate,
  fmtDateShort,
  useI18n,
  LanguageSwitcher,
  subscribe,
  MESSAGES,
};
