/* global React, diary, SplitPane, Editable, DelBtn */
// ===========================================================
// Commands cheat sheet
// ===========================================================
const { useState } = React;

function CheatView() {
  const { t } = useI18n();
  const { state, actions } = diary.useDiary();
  const commands = diary.select.commandsForCurrent(state);

  const [copiedId, setCopiedId] = useState(null);
  const onCopy = (id) => {
    actions.copyCommand(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(c => (c === id ? null : c)), 1200);
  };

  const frequent = commands
    .filter(c => (c.uses ?? 0) > 0)
    .slice()
    .sort((a, b) => (b.uses ?? 0) - (a.uses ?? 0))
    .slice(0, 6);

  const all = commands;

  return (
    <SplitPane
      topLabel={t("cheat.frequent", { count: frequent.length })}
      top={
        frequent.length
          ? frequent.map((c, i) => <CmdCard key={c.id} c={c} actions={actions} copiedId={copiedId} onCopy={onCopy} i={i} compact />)
          : <div className="sk-cap">{t("cheat.frequentEmpty")}</div>
      }
      bottomLabel={t("cheat.all", { count: all.length })}
      bottom={
        <>
          <div style={{ marginBottom: 8 }}>
            <InlineAdd placeholder={t("cheat.addPlaceholder")} onAdd={(v) => actions.addCommand({ code: v })} />
          </div>
          {all.length
            ? all.map((c, i) => <CmdCard key={c.id} c={c} actions={actions} copiedId={copiedId} onCopy={onCopy} i={i} />)
            : <div className="sk-cap">{t("cheat.emptyAll")}</div>}
        </>
      }
    />
  );
}

function CmdCard({ c, actions, copiedId, onCopy, compact, i = 0 }) {
  const { t } = useI18n();
  return (
    <div className="tape" style={{
      ...tapeStyle(i), padding: "7px 15px", marginBottom: 7,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ color: "var(--ink-3)", flexShrink: 0, fontFamily: "var(--mono)", fontSize: 12 }}>❯</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        {compact ? (
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.code}</div>
        ) : (
          <Editable
            value={c.code}
            onChange={(v) => actions.updateCommand(c.id, { code: v })}
            style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)" }}
          />
        )}
        {(c.label || !compact) && (
          compact
            ? (c.label && <div style={{ fontFamily: "var(--hand)", fontSize: 11, color: "var(--ink-2)" }}>{c.label}</div>)
            : <Editable
                value={c.label}
                onChange={(v) => actions.updateCommand(c.id, { label: v })}
                placeholder={t("cheat.labelPlaceholder")}
                style={{ fontFamily: "var(--hand)", fontSize: 11, color: "var(--ink-2)" }}
              />
        )}
      </span>
      <span className="sk-cap" style={{ fontSize: 11, flexShrink: 0 }}>{t("cheat.uses", { count: c.uses ?? 0 })}</span>
      <button onClick={() => onCopy(c.id)} title={t("cheat.copy")} style={{
        all: "unset", cursor: "pointer", fontSize: 13, flexShrink: 0,
        color: copiedId === c.id ? "var(--ink)" : "var(--ink-2)",
      }}>{copiedId === c.id ? "✓" : "📋"}</button>
      {!compact && (
        <DelBtn onClick={() => {
          if (confirm(t("cheat.deleteConfirm", { name: c.label || c.code }))) actions.removeCommand(c.id);
        }} />
      )}
    </div>
  );
}

window.CheatView = CheatView;
