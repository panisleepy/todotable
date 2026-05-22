/* global React, TodayView, TodoView, MailView, PromptView, AIView, RetroView, LanguageSwitcher */
// ===========================================================
// Side dock v2 — diary index tabs + view switching
// ===========================================================

const { useState } = React;

function SideDockV2({ tweaks }) {
  const { t } = useI18n();
  const TABS = [
    { id: "todo",  label: t("tabs.todo"),   glyph: "✓", color: "#d4ecdb", view: () => <TodoView /> },
    { id: "cheat", label: t("tabs.cheat"),  glyph: "❯", color: "#ffe8c8", view: () => <CheatView /> },
    { id: "mail",  label: t("tabs.mail"),   glyph: "✉", color: "#ffe0d2", view: () => <MailView /> },
    { id: "cal",   label: t("tabs.cal"),   glyph: "📅", color: "#d4e6fa", view: () => <CalendarView /> },
  ];

  const [active, setActive] = useState("todo");
  const current = TABS.find(tab => tab.id === active);
  const isPhoto = active === "photo";

  const tabSide  = tweaks?.tabSide  ?? "right";
  const dockSide = tweaks?.dockSide ?? "left";
  const tabStyle = tweaks?.tabStyle ?? "paper";
  const desktopMode = tweaks?.desktopMode ?? false;

  const effectiveTabSide = dockSide === "left" ? tabSide : (tabSide === "right" ? "left" : "right");

  const DOCK_W = 380;

  return (
    <div style={{
      width: "100%", height: "100%",
      position: "relative", overflow: "hidden",
      background: desktopMode ? "transparent" : "#f5e9e2",
    }}>
      {!desktopMode && <FakeIde dockSide={dockSide} dockWidth={DOCK_W} />}

      <div className="dock-body" style={{
        position: "absolute", top: 0, bottom: 0,
        [dockSide]: 0,
        width: DOCK_W,
        background: (isPhoto && desktopMode)
          ? "transparent"
          : "linear-gradient(180deg, #a9cdf5 0%, #cfe2fa 35%, #eaf3fe 70%, #ffffff 100%)",
        borderRight:  dockSide === "left"  ? "1.1px solid var(--ink)" : "none",
        borderLeft:   dockSide === "right" ? "1.1px solid var(--ink)" : "none",
        boxShadow: dockSide === "left"
          ? "2px 0 0 var(--paper-3)"
          : "-2px 0 0 var(--paper-3)",
        display: "flex", flexDirection: "column",
        zIndex: 2,
      }}>
        <div data-tauri-drag-region style={{
          height: 28,
          background: "linear-gradient(180deg, #cfe2fa 0%, #a9cdf5 100%)",
          color: "var(--ink)",
          fontFamily: "var(--hand)", fontSize: 13,
          padding: "5px 10px",
          display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          borderBottom: "1.1px solid var(--ink)",
          userSelect: "none",
        }}>
          <ProjectSwitcher />
          <LanguageSwitcher />
          <div data-tauri-drag-region style={{ flex: 1, alignSelf: "stretch" }} />
        </div>

        <div style={{
          padding: "9px 12px 10px",
          background: (isPhoto && desktopMode) ? "transparent" : "linear-gradient(180deg, #e3eefc 0%, #f4f9ff 100%)",
          borderBottom: "1.1px solid var(--ink)",
          flexShrink: 0,
        }}>
          <HeaderDesktop />
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          {current.view()}
        </div>

      </div>

      <DiaryTabs
        tabs={TABS}
        active={active}
        onSelect={setActive}
        dockSide={dockSide}
        tabSide={effectiveTabSide}
        dockWidth={DOCK_W}
        tabStyle={tabStyle}
      />
    </div>
  );
}

function tabHeaderInfo(active, state) {
  const { t } = window.i18n;
  const sel = diary.select;
  const project = sel.currentProject(state);
  switch (active) {
    case "today": {
      const notDone = sel.todosForCurrent(state).filter(x => !x.done).length;
      const minutes = sel.workMinutesToday(state);
      const unreplied = (state.emails ?? []).filter(e => !e.replied).length;
      return {
        ttl: t("today.summary", { date: diary.fmtKDate(diary.today()) }),
        sub: t("header.sub.today", { minutes, todos: notDone, mails: unreplied }),
      };
    }
    case "todo": {
      const items = sel.todosForCurrent(state);
      const notDone = items.filter(x => !x.done).length;
      const hot = items.filter(x => x.hot && !x.done).length;
      return {
        ttl: t("todo.header"),
        sub: t("header.sub.todo", { pending: notDone, hot }),
      };
    }
    case "cheat": {
      const cnt = sel.commandsForCurrent(state).length;
      return {
        ttl: t("header.cheat"),
        sub: t("header.sub.cheat", { project: project?.name ?? t("project.fallback"), count: cnt }),
      };
    }
    case "prompt":
      return {
        ttl: t("header.prompt"),
        sub: t("header.sub.prompt", { count: (state.prompts ?? []).length }),
      };
    case "mail": {
      const unreplied = (state.emails ?? []).filter(e => !e.replied).length;
      return {
        ttl: t("header.mail"),
        sub: t("header.sub.mail", { count: unreplied }),
      };
    }
    case "retro":
      return { ttl: t("header.retro"), sub: t("header.sub.retro") };
    default:
      return { ttl: "", sub: "" };
  }
}

function TabHeader({ active }) {
  const { state } = diary.useDiary();
  const { ttl, sub } = tabHeaderInfo(active, state);
  return (
    <div>
      <div style={{
        fontFamily: "var(--hand)", fontSize: 15, fontWeight: 700, color: "var(--ink)",
        lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{ttl}</div>
      {sub && (
        <div className="sk-cap" style={{
          fontSize: 12, lineHeight: 1.15, marginTop: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{sub}</div>
      )}
    </div>
  );
}

function DiaryTabs({ tabs, active, onSelect, dockSide, tabSide, dockWidth, tabStyle }) {
  const onLeft = tabSide === "left";

  const containerPos = {};
  if (dockSide === "left") {
    containerPos.left = dockWidth;
  } else {
    containerPos.right = dockWidth;
  }
  const stickRight = dockSide === "left";

  const TAB_W = 32;
  const TAB_H = 70;
  const TAB_GAP = 4;

  return (
    <div style={{
      position: "absolute",
      top: 70,
      ...containerPos,
      display: "flex", flexDirection: "column", gap: TAB_GAP,
      zIndex: 1,
    }}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              all: "unset",
              cursor: "pointer",
              width: TAB_W + (isActive ? 6 : 0),
              height: TAB_H,
              marginLeft: stickRight ? (isActive ? -4 : 0) : 0,
              marginRight: !stickRight ? (isActive ? -4 : 0) : 0,
              background: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1.1px solid var(--ink)",
              borderLeft:  stickRight ? "none" : `1.1px solid var(--ink)`,
              borderRight: stickRight ? `1.1px solid var(--ink)` : "none",
              borderRadius: stickRight
                ? "0 12px 12px 0"
                : "12px 0 0 12px",
              boxShadow: stickRight
                ? "1.5px 1.5px 0 var(--paper-3)"
                : "-1.5px 1.5px 0 var(--paper-3)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 4,
              fontFamily: "var(--hand)",
              transition: "width 0.18s, margin 0.18s, background 0.15s",
              transform: tabStyle === "minimal" ? "none" : "rotate(0deg)",
              filter: isActive ? "none" : "saturate(0.85)",
            }}
            title={tab.label}
          >
            <span style={{ fontSize: 16, color: "var(--ink)" }}>{tab.glyph}</span>
            <span style={{
              writingMode: "vertical-rl",
              transform: stickRight ? "rotate(180deg)" : "none",
              fontSize: 12,
              letterSpacing: "0.04em",
              color: "var(--ink)",
              fontWeight: isActive ? 700 : 400,
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function FakeIde({ dockSide, dockWidth }) {
  const { t } = useI18n();
  const ideStyle = {
    position: "absolute", top: 0, bottom: 24,
    [dockSide === "left" ? "left" : "right"]: dockWidth,
    [dockSide === "left" ? "right" : "left"]: 0,
    background: "var(--paper-2)",
    color: "var(--ink-2)",
    fontFamily: "var(--mono)", fontSize: 11,
    padding: "30px 24px",
    overflow: "hidden",
  };
  return (
    <>
      <div className="fake-ide" style={ideStyle}>
        <div style={{ color: "var(--ink-3)", marginBottom: 16, fontFamily: "var(--hand-2)", fontSize: 15 }}>{t("fakeIde.hint")}</div>
        <div style={{ color: "var(--ink)" }}>{t("fakeIde.path")}</div>
        <pre style={{ color: "var(--ink-2)", lineHeight: 1.65, marginTop: 14 }}>
{`export function Timer({ minutes = 25 }) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    const id = setInterval(() => setLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="timer">
      {format(left)}
    </div>
  );
}`}
        </pre>
      </div>
      <div className="xp-taskbar fake-taskbar" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 24, fontSize: 11, padding: "3px 8px" }}>
        <span className="xp-start" style={{ fontSize: 11, padding: "1px 12px 2px 10px" }}>start ♡</span>
        <span style={{ color: "var(--ink-2)" }}>VS Code</span>
        <span style={{ color: "var(--ink-3)" }}>|</span>
        <span style={{
          background: "var(--pink)", color: "var(--ink)",
          padding: "1px 10px", borderRadius: 99,
          fontFamily: "var(--hand)", fontSize: 11,
          border: "1.1px solid var(--ink)",
        }}>{t("fakeIde.taskbar")}</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-2)" }}>{t("fakeIde.stretch")}</span>
      </div>
    </>
  );
}

function HeaderDesktop() {
  return <Timer />;
}

function KeyboardInput({ active }) {
  const { state, actions } = diary.useDiary();
  const { t } = useI18n();
  const [v, setV] = useState("");

  const CFG = {
    todo:  { ph: t("kbd.todo"),      add: (text) => actions.addTodo(text) },
    cheat: { ph: t("kbd.cheat"),     add: (text) => actions.addCommand({ code: text }) },
    mail:  { ph: t("kbd.mail"),      add: (text) => actions.addInquiry({ subject: text.split("\n")[0].slice(0, 60), body: text }) },
    cal:   { ph: t("kbd.cal"),       add: (text) => actions.appendNote(state.selectedDate || diary.today(), text) },
  };
  const cfg = CFG[active] || CFG.todo;

  const submit = () => {
    const text = v.trim();
    if (!text) return;
    cfg.add(text);
    setV("");
  };
  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
      <div className="kbd-cap" style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: 7, padding: "8px 12px" }}>
        <span style={{ fontSize: 15, color: "var(--ink-2)", flexShrink: 0, marginTop: 2 }}>⌨</span>
        <textarea
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={onKey}
          placeholder={cfg.ph}
          rows={3}
          style={{
            flex: 1, border: 0, outline: "none", background: "transparent", resize: "none",
            fontFamily: "var(--hand)", fontSize: 15, color: "var(--ink)", lineHeight: 1.35,
          }}
        />
      </div>
      <button onClick={submit} className="kbd-cap kbd-enter" title={t("kbd.add")} style={{
        width: 58, display: "grid", placeItems: "center",
        fontFamily: "var(--mono)", fontSize: 15, fontWeight: 700, color: "var(--ink)",
        cursor: "pointer",
      }}>⏎</button>
    </div>
  );
}

if (!document.getElementById("monitor-kbd-css")) {
  const s = document.createElement("style");
  s.id = "monitor-kbd-css";
  s.textContent = `
    .kbd-cap {
      background: linear-gradient(180deg, #ffffff 0%, #e7edf4 100%);
      border: 1.1px solid var(--ink);
      border-radius: 9px;
      box-shadow: 0 2px 0 #97a6b8, inset 0 1px 0 rgba(255,255,255,0.9);
      min-height: 34px;
      transition: transform .04s, box-shadow .04s;
    }
    .kbd-cap:active {
      transform: translateY(2px);
      box-shadow: 0 0 0 #97a6b8, inset 0 1px 0 rgba(255,255,255,0.9);
    }
    .kbd-enter {
      background: linear-gradient(180deg, var(--point-soft) 0%, var(--point) 100%);
    }
  `;
  document.head.appendChild(s);
}

window.HeaderDesktop = HeaderDesktop;
window.KeyboardInput = KeyboardInput;
window.SideDockV2 = SideDockV2;
