/* global React, diary, SplitPane, DelBtn, openExternalUrl */
// ===========================================================
// Inbox / mail drafts
// ===========================================================
const { useState } = React;

function MailView() {
  const { t } = useI18n();
  const { state, actions } = diary.useDiary();
  const mails = state.emails ?? [];
  const unreplied = mails.filter(m => !m.replied);
  const replied = mails.filter(m => m.replied);
  const [selId, setSelId] = useState(null);
  const [paste, setPaste] = useState("");

  const selected = mails.find(m => m.id === selId) || null;

  function addPasted() {
    const body = paste.trim();
    if (!body) return;
    actions.addInquiry({ subject: body.split("\n")[0].slice(0, 60), body });
    setPaste("");
  }

  return (
    <SplitPane
      topLabel={t("mail.inbox", { count: unreplied.length })}
      top={
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <textarea
              value={paste}
              onChange={e => setPaste(e.target.value)}
              placeholder={t("mail.pastePlaceholder")}
              rows={1}
              style={{
                flex: 1, boxSizing: "border-box", resize: "vertical", minHeight: 30,
                border: "1.1px solid var(--ink-soft)", borderRadius: 8, outline: "none",
                background: "var(--paper)", padding: "5px 8px",
                fontFamily: "var(--hand)", fontSize: 14, color: "var(--ink)",
              }}
            />
            <button onClick={addPasted} style={{ ...mailBtn, background: "var(--pink)", flexShrink: 0 }}>{t("mail.add")}</button>
          </div>

          {unreplied.map(m => <InquiryRow key={m.id} m={m} selected={m.id === selId} onPick={() => setSelId(m.id)} actions={actions} />)}
          {replied.length > 0 && (
            <>
              <div className="sk-cap" style={{ margin: "8px 0 4px" }}>{t("mail.replied", { count: replied.length })}</div>
              {replied.map(m => <InquiryRow key={m.id} m={m} selected={m.id === selId} onPick={() => setSelId(m.id)} actions={actions} />)}
            </>
          )}
          {mails.length === 0 && <div className="sk-cap">{t("mail.empty")}</div>}
        </>
      }
      bottomLabel={t("mail.draft")}
      bottom={
        selected
          ? <DraftEditor m={selected} actions={actions} />
          : <div className="sk-cap">{t("mail.selectHint")}</div>
      }
    />
  );
}

function InquiryRow({ m, selected, onPick, actions }) {
  const { t } = useI18n();
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7, padding: "6px 9px", marginBottom: 6,
      borderRadius: 8, border: "1.1px solid var(--ink)",
      background: selected ? "var(--hi-soft)" : (m.replied ? "var(--paper-2)" : "white"),
      boxShadow: selected ? "inset 0 0 0 1.5px var(--ink)" : "none",
      opacity: m.replied && !selected ? 0.85 : 1,
    }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{m.replied ? "📭" : "✉️"}</span>
      <button onClick={onPick} style={{
        all: "unset", cursor: "pointer", flex: 1, minWidth: 0,
        fontFamily: "var(--hand)", fontSize: 14, fontWeight: m.replied ? 400 : 700,
        color: m.replied ? "var(--ink-2)" : "var(--ink)",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{m.subject || m.body?.slice(0, 40) || t("mail.noSubject")}</button>
      <button onClick={() => actions.toggleReplied(m.id)}
        className={"sk-check" + (m.replied ? " done" : "")}
        style={{ cursor: "pointer", flexShrink: 0 }}
        title={m.replied ? t("mail.unmarkReplied") : t("mail.markReplied")} />
      <DelBtn onClick={() => actions.removeEmail(m.id)} />
    </div>
  );
}

function DraftEditor({ m, actions }) {
  const { t } = useI18n();
  function openPlatform() {
    let url = m.platformUrl;
    if (!url) {
      url = prompt(t("mail.platformPrompt")) || "";
      if (!url.trim()) return;
      actions.updateEmail(m.id, { platformUrl: url.trim() });
      url = url.trim();
    }
    openExternalUrl(url);
  }
  return (
    <div>
      <div className="sk-label" style={{ marginBottom: 4 }}>
        {t("mail.draftFor", { subject: m.subject || t("calendar.inquiry") })}
      </div>
      <textarea
        value={m.draft ?? ""}
        onChange={e => actions.updateEmail(m.id, { draft: e.target.value })}
        placeholder={t("mail.draftPlaceholder")}
        rows={4}
        style={{
          width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 70,
          border: "1.1px solid var(--ink-soft)", borderRadius: 8, outline: "none",
          background: "var(--paper)", padding: "8px 10px",
          fontFamily: "var(--hand)", fontSize: 15, color: "var(--ink)", lineHeight: 1.5,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <button onClick={() => actions.toggleReplied(m.id)} style={{
          ...mailBtn, background: m.replied ? "var(--mint)" : "var(--paper)",
        }}>{m.replied ? t("mail.repliedBtn") : t("mail.markReplied")}</button>
        <span style={{ flex: 1 }} />
        <button onClick={openPlatform} title={m.platformUrl || t("mail.linkSite")} style={{
          ...mailBtn, background: m.platformUrl ? "var(--point)" : "var(--paper)",
        }}>📧 {m.platformUrl ? t("mail.openSite") : t("mail.linkSite")}</button>
      </div>
    </div>
  );
}

const mailBtn = {
  all: "unset", cursor: "pointer",
  padding: "4px 12px", borderRadius: 99,
  border: "1.1px solid var(--ink)", background: "var(--paper)",
  fontFamily: "var(--hand)", fontSize: 13, color: "var(--ink)",
};

window.MailView = MailView;
