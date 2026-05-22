/* global React */
// AI helpers — window.claude.complete wrapper + JSON parsing

function _t(key, params) {
  return (window.i18n && window.i18n.t(key, params)) || key;
}
function _locale() {
  return (window.i18n && window.i18n.getLocale()) || "zh-TW";
}

async function callClaude(messages) {
  if (!window.claude?.complete) {
    throw new Error(_t("ai.unavailable"));
  }
  return await window.claude.complete({ messages });
}

function extractJson(text) {
  if (!text) throw new Error(_t("ai.emptyResponse"));

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }

  const firstBrace = text.indexOf("{");
  const lastBrace  = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)); } catch {}
  }

  const firstBr = text.indexOf("[");
  const lastBr  = text.lastIndexOf("]");
  if (firstBr >= 0 && lastBr > firstBr) {
    try { return JSON.parse(text.slice(firstBr, lastBr + 1)); } catch {}
  }

  throw new Error(_t("ai.parseError"));
}

function retroPrompts(locale) {
  if (locale === "en") {
    return {
      sys: `You help the user write a short, natural daily retro in English.
Not a stiff work summary — honest diary tone. One-line retro: 1-2 sentences; good/bad: one line each.
Almost no emoji. Reply ONLY as JSON, no other text.

{
  "text": "one-line retro (1-2 sentences)",
  "good": "what went well (one line)",
  "bad": "what was stuck or disappointing (one line)"
}`,
      userIntro: "Today's data:",
      project: "Project",
      minutes: "Work time",
      minutesUnit: "min",
      done: "Completed",
      stuck: "Stuck on",
      sessions: "AI sessions",
      polish: "User's existing line (polish only)",
      instruction: "Create a JSON retro draft from the data above.",
      goodTag: "good",
      badTag: "meh",
      unnamed: "unnamed",
    };
  }
  return {
    sys: `你協助使用者用繁體中文寫簡短、自然的每日回顧。
不要像生硬的工作報告，要像日記一樣誠實。一行回顧 1-2 句；做得好／卡住各一行。
幾乎不要用 emoji。只回傳 JSON，不要其他說明。

{
  "text": "今日一行回顧（1-2句）",
  "good": "做得好的事（一行）",
  "bad": "卡住或可惜的事（一行）"
}`,
    userIntro: "今日資料：",
    project: "專案",
    minutes: "工作時間",
    minutesUnit: "分鐘",
    done: "完成事項",
    stuck: "卡住的地方",
    sessions: "AI 工作階段",
    polish: "使用者已寫的一行（僅潤飾）",
    instruction: "請依上方資料產生 JSON 回顧草稿。",
    goodTag: "好",
    badTag: "差",
    unnamed: "未命名",
  };
}

async function generateRetroDraft({ project, minutes, doneTodos, stuck, bookmarks, existingText }) {
  const p = retroPrompts(_locale());
  const none = _t("common.none");
  const doneList = doneTodos.length
    ? doneTodos.map(item => `- ${item.text}`).join("\n")
    : none;
  const bmList = bookmarks.length
    ? bookmarks.map(b => `- [${b.ok ? p.goodTag : p.badTag}] ${b.title}${b.note ? ` (${b.note})` : ""}`).join("\n")
    : none;

  const user = `${p.userIntro}
- ${p.project}: ${project?.name ?? p.unnamed}
- ${p.minutes}: ${minutes}${p.minutesUnit}
- ${p.done}:
${doneList}
- ${p.stuck}: ${stuck || none}
- ${p.sessions}:
${bmList}
${existingText ? `\n- ${p.polish}: "${existingText}"` : ""}

${p.instruction}`;

  const raw = await callClaude([{ role: "user", content: `${p.sys}\n\n${user}` }]);
  const parsed = extractJson(raw);
  return {
    text: String(parsed.text || ""),
    good: String(parsed.good || ""),
    bad: String(parsed.bad || ""),
  };
}

function stuckPrompts(locale) {
  if (locale === "en") {
    return {
      sys: `Break the user's stuck problem into 3-5 small next steps in English.
Each item: one line, under ~40 chars, doable today, concrete and actionable.
Reply ONLY as a JSON array of strings, no other text.
["step 1", "step 2", ...]`,
      project: "Project",
      stack: "Stack",
      unspecified: "unspecified",
      stuckLabel: "Stuck on",
      instruction: "Split the stuck point into 3-5 concrete next steps.",
      empty: "Stuck note is empty",
    };
  }
  return {
    sys: `將使用者卡住的問題拆成 3-5 個繁體中文的具體下一步。
每項：一行、約 30 字內、今天可完成、可執行（避免「去檢查一下」這種空話）。
只回傳 JSON 字串陣列，不要其他說明。
["待辦 1", "待辦 2", ...]`,
    project: "專案",
    stack: "技術棧",
    unspecified: "未指定",
    stuckLabel: "卡住的地方",
    instruction: "請將卡住點拆成 3-5 個具體下一步。",
    empty: "卡住事項為空",
  };
}

async function breakdownStuck({ stuck, project }) {
  if (!stuck?.trim()) throw new Error(_t("ai.stuckEmpty"));

  const p = stuckPrompts(_locale());
  const user = `${p.project}: ${project?.name ?? p.unnamed}
${p.stack}: ${project?.stack?.join(", ") || p.unspecified}

${p.stuckLabel}:
"${stuck}"

${p.instruction}`;

  const raw = await callClaude([{ role: "user", content: `${p.sys}\n\n${user}` }]);
  const parsed = extractJson(raw);
  if (!Array.isArray(parsed)) throw new Error(_t("ai.notArray"));
  return parsed.map(s => String(s).trim()).filter(Boolean).slice(0, 8);
}

window.diaryAI = {
  callClaude,
  generateRetroDraft,
  breakdownStuck,
};
