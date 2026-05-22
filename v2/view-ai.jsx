/* global React, diary, Editable, DelBtn */
// ===========================================================
// AI session bookmarks
// ===========================================================
const { useState } = React;

function AIView() {
  const { t } = useI18n();
  const { state, actions } = diary.useDiary();
  const bookmarks = diary.select.bookmarksForCurrent(state);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [ok, setOk] = useState(true);
  const [note, setNote] = useState("");

  const grouped = bookmarks.reduce((acc, b) => {
    (acc[b.date] ??= []).push(b);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const reset = () => { setTitle(""); setOk(true); setNote(""); };
  const submit = () => {
    if (!title.trim()) return;
    actions.addBookmark({ title, ok, note });
    reset(); setAdding(false);
  };

  return (
    <div>
      <ViewHeader
        ttl={t("ai.title")}
        sub={t("ai.subtitle", { count: bookmarks.length })}
      />

      {!adding ? (
        <button onClick={() => setAdding(true)} className="sk-box sk-dashed" style={{
          all: "unset", cursor: "pointer", display: "block", width: "100%",
          padding: "8px 10px", marginBottom: 12, textAlign: "left",
          background: "var(--paper)", borderRadius: 10,
          border: "1.1px dashed var(--ink-2)",
          fontFamily: "var(--hand)", fontSize: 14, color: "var(--ink-2)",
        }}>{t("ai.add")}</button>
      ) : (
        <div className="sk-box" style={{ padding: 10, marginBottom: 12, background: "var(--paper-2)" }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={t("ai.titlePlaceholder")}
            style={inputStyle} />
          <hr className="sk-hr" />
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder={t("ai.notePlaceholder")} rows={2}
            style={{...inputStyle, resize: "vertical", minHeight: 30}} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <button onClick={() => setOk(true)} style={{
              ...btn,
              background: ok ? "var(--ok)" : "var(--paper)",
            }}>{t("ai.good")}</button>
            <button onClick={() => setOk(false)} style={{
              ...btn,
              background: !ok ? "var(--bad)" : "var(--paper)",
            }}>{t("ai.bad")}</button>
            <span style={{ flex: 1 }} />
            <button onClick={() => { reset(); setAdding(false); }} style={btn}>{t("prompt.cancel")}</button>
            <button onClick={submit} style={{...btn, background: "var(--pink)"}}>{t("prompt.save")}</button>
          </div>
        </div>
      )}

      {dates.length === 0 && (
        <div className="sk-cap" style={{ textAlign: "center", padding: 20 }}>
          {t("ai.empty")}
        </div>
      )}

      {dates.map(d => (
        <div key={d} style={{ marginBottom: 14 }}>
          <div className="sk-label" style={{ marginBottom: 6 }}>
            {d === diary.today() ? t("ai.todayPrefix") : ""}{diary.fmtKDateShort(d)}
          </div>
          {grouped[d].map(b => (
            <div key={b.id} className="sk-box" style={{ padding: 8, marginBottom: 6, background: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => actions.updateBookmark(b.id, { ok: !b.ok })}
                  className={"sk-dot " + (b.ok ? "ok" : "bad")}
                  style={{ cursor: "pointer", border: 0, padding: 0, marginRight: 2 }}
                  title={t("ai.toggle")}
                />
                <div style={{ flex: 1 }}>
                  <Editable
                    value={b.title}
                    onChange={(v) => actions.updateBookmark(b.id, { title: v })}
                    style={{ fontFamily: "var(--hand)", fontSize: 15 }}
                  />
                </div>
                <span className="sk-cap" style={{ fontSize: 13 }}>{b.ok ? t("ai.goodLabel") : t("ai.badLabel")}</span>
                <DelBtn onClick={() => actions.removeBookmark(b.id)} />
              </div>
              <Editable
                value={b.note}
                onChange={(v) => actions.updateBookmark(b.id, { note: v })}
                placeholder={t("ai.noteAdd")}
                multiline
                style={{
                  fontFamily: "var(--hand-2)", fontSize: 14, color: "var(--ink-2)",
                  marginTop: 4, marginLeft: 16, lineHeight: 1.25,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  width: "100%", border: 0, outline: "none", background: "transparent",
  fontFamily: "var(--hand)", fontSize: 14, color: "var(--ink)",
  padding: "4px 0",
};
const btn = {
  all: "unset", cursor: "pointer",
  background: "var(--paper)", border: "1.1px solid var(--ink)",
  padding: "2px 10px", borderRadius: 99,
  fontFamily: "var(--hand)", fontSize: 13, color: "var(--ink)",
};

window.AIView = AIView;
