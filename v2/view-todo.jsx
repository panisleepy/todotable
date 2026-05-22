/* global React, diary, SplitPane, InlineAdd, DelBtn */
// ===========================================================
// To-do — add / check / urgent toggle / delete
// ===========================================================

function TodoView() {
  const { t } = useI18n();
  const { state, actions } = diary.useDiary();
  const items = diary.select.todosForCurrent(state);
  const hot   = items.filter(x => !x.done && x.hot);
  const rest  = items.filter(x => !x.done && !x.hot);
  const done  = items.filter(x => x.done);

  const todoCount = hot.length + rest.length;
  return (
    <SplitPane
      topLabel={t("todo.pending", { count: todoCount })}
      top={
        <>
          <div style={{ marginBottom: 8 }}>
            <InlineAdd placeholder={t("todo.addPlaceholder")} onAdd={(v) => actions.addTodo(v)} />
          </div>
          {hot.map((item, i) => <TodoRow key={item.id} t={item} actions={actions} i={i} hot />)}
          {rest.map((item, i) => <TodoRow key={item.id} t={item} actions={actions} i={hot.length + i} />)}
          {todoCount === 0 && <div className="sk-cap">{t("todo.emptyPending")}</div>}
        </>
      }
      bottomLabel={t("todo.done", { count: done.length })}
      bottom={
        <>
          {done.map((item, i) => <TodoRow key={item.id} t={item} actions={actions} i={i} />)}
          {done.length === 0 && <div className="sk-cap">{t("todo.emptyDone")}</div>}
        </>
      }
    />
  );
}

function TodoRow({ t: item, actions, hot, i = 0 }) {
  const { t } = useI18n();
  return (
    <div className="tape" style={{
      ...tapeStyle(i),
      display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
      marginBottom: 7,
    }}>
      <button
        onClick={() => actions.toggleTodo(item.id)}
        className={"sk-check" + (item.done ? " done" : "")}
        style={{ cursor: "pointer" }}
        title={item.done ? t("todo.undo") : t("todo.markDone")}
      />
      <span style={{
        fontFamily: "var(--hand)", fontSize: 15, flex: 1,
        color: item.done ? "var(--ink-3)" : "var(--ink)",
        textDecoration: item.done ? "line-through" : "none",
      }}>{item.text}</span>
      {!item.done && (
        <button onClick={() => actions.toggleHot(item.id)}
          title={item.hot ? t("todo.unmarkHot") : t("todo.markHot")}
          style={{
            all: "unset", cursor: "pointer", fontSize: 14,
            color: item.hot ? "var(--ink)" : "var(--ink-3)",
            padding: "0 4px",
          }}>!</button>
      )}
      <DelBtn onClick={() => actions.removeTodo(item.id)} />
    </div>
  );
}

window.TodoView = TodoView;
