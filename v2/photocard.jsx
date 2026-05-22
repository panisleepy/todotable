/* global React */
// Photocard mode — transparent frame overlay for screenshots

(function () {
  const state = { shape: "rect", texture: "white" };
  const subs = new Set();
  const emit = () => { for (const fn of subs) fn(); };

  window.photocard = {
    getState() { return state; },
    set(patch) { Object.assign(state, patch); emit(); },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
  };
})();

function pcSetAlwaysOnTop(v) {
  try {
    const w = window.__TAURI__ && window.__TAURI__.window;
    if (w && w.getCurrentWindow) w.getCurrentWindow().setAlwaysOnTop(!!v);
  } catch (_) {}
}

function usePhotocard() {
  const [, f] = React.useState(0);
  React.useEffect(() => window.photocard.subscribe(() => f(x => x + 1)), []);
  return window.photocard;
}

function getPcShapes(t) {
  return [
    { id: "rect",     label: t("photo.shapeRect") },
    { id: "polaroid", label: t("photo.shapePolaroid") },
    { id: "circle",   label: t("photo.shapeCircle") },
    { id: "wide",     label: t("photo.shapeWide") },
  ];
}
function getPcTextures(t) {
  return [
    { id: "white",  label: t("photo.texWhite"),  color: "#ffffff" },
    { id: "yellow", label: t("photo.texYellow"), color: "#fdff85" },
    { id: "film",   label: t("photo.texFilm"),   color: "#1c1c1c" },
    { id: "pastel", label: t("photo.texPastel"), color: "#ffd6e0" },
    { id: "mint",   label: t("photo.texMint"),   color: "#c6ecd7" },
  ];
}

function pcFrameBorder(shape) {
  if (shape === "polaroid") return "18px 18px 56px 18px";
  if (shape === "wide")     return "44px 18px";
  if (shape === "circle")   return "26px";
  return "22px";
}
function pcRadius(shape) {
  if (shape === "circle") return "50%";
  return 18;
}

async function pcCapture(innerEl, setMsg) {
  const tr = (k, p) => (window.i18n && window.i18n.t(k, p)) || k;
  if (!innerEl) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    setMsg(tr("photo.captureUnsupported"));
    return;
  }
  let stream;
  try {
    const rect = innerEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    let originX = (window.screenX || 0) * dpr;
    let originY = (window.screenY || 0) * dpr;
    try {
      const T = window.__TAURI__;
      if (T && T.window && T.window.getCurrentWindow) {
        const pos = await T.window.getCurrentWindow().outerPosition();
        if (pos && typeof pos.x === "number") { originX = pos.x; originY = pos.y; }
      }
    } catch (_) {}

    const sx = Math.round(originX + rect.left * dpr);
    const sy = Math.round(originY + rect.top * dpr);
    const sw = Math.max(1, Math.round(rect.width * dpr));
    const sh = Math.max(1, Math.round(rect.height * dpr));

    setMsg(tr("photo.pickFullscreen"));
    stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 2 }, audio: false });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    await video.play();
    await new Promise(r => setTimeout(r, 350));

    const canvas = document.createElement("canvas");
    canvas.width = sw; canvas.height = sh;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    canvas.toBlob((blob) => {
      if (!blob) { setMsg(tr("photo.captureFail")); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `photocard-${Date.now()}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setMsg(tr("photo.saved"));
    }, "image/png");
  } catch (e) {
    setMsg(tr("photo.captureErr", { msg: e && e.message ? e.message : e }));
  } finally {
    if (stream) stream.getTracks().forEach(t => t.stop());
  }
}

function PhotocardView() {
  const { t } = useI18n();
  const pc = usePhotocard();
  const s = pc.getState();
  const PC_SHAPES = getPcShapes(t);
  const PC_TEXTURES = getPcTextures(t);
  const tex = PC_TEXTURES.find(x => x.id === s.texture) || PC_TEXTURES[0];
  const innerRef = React.useRef(null);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    pcSetAlwaysOnTop(true);
    return () => pcSetAlwaysOnTop(false);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div data-tauri-drag-region style={{
        position: "absolute", inset: 0, boxSizing: "border-box",
        background: "transparent",
        borderStyle: "solid",
        borderColor: tex.color,
        borderWidth: pcFrameBorder(s.shape),
        borderRadius: pcRadius(s.shape),
        boxShadow: "inset 0 0 0 1.4px rgba(0,0,0,.28), 0 10px 28px rgba(0,0,0,.22)",
      }}>
        <div ref={innerRef} data-tauri-drag-region style={{ width: "100%", height: "100%" }} />
      </div>

      <div style={{
        position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", justifyContent: "center",
        background: "rgba(255,255,255,0.96)", border: "1.1px solid var(--ink)",
        borderRadius: 99, padding: "5px 8px", maxWidth: "94%",
        boxShadow: "0 4px 14px rgba(0,0,0,.22)",
      }}>
        {PC_SHAPES.map(o => (
          <button key={o.id} onClick={() => pc.set({ shape: o.id })} style={{
            all: "unset", cursor: "pointer", padding: "2px 8px", borderRadius: 99,
            border: "1.1px solid var(--ink)",
            background: s.shape === o.id ? "var(--point)" : "var(--paper)",
            fontFamily: "var(--hand)", fontSize: 12, color: "var(--ink)",
          }}>{o.label}</button>
        ))}
        <span style={{ width: 1, height: 16, background: "var(--ink-soft)" }} />
        {PC_TEXTURES.map(o => (
          <button key={o.id} onClick={() => pc.set({ texture: o.id })} title={o.label} style={{
            all: "unset", cursor: "pointer",
            width: 18, height: 18, borderRadius: "50%",
            background: o.color, border: s.texture === o.id ? "2px solid var(--ink)" : "1px solid var(--ink)",
            boxShadow: s.texture === o.id ? "0 0 0 2px var(--point)" : "none",
          }} />
        ))}
        <span style={{ width: 1, height: 16, background: "var(--ink-soft)" }} />
        <button onClick={() => pcCapture(innerRef.current, setMsg)} style={{
          all: "unset", cursor: "pointer", padding: "2px 10px", borderRadius: 99,
          border: "1.1px solid var(--ink)",
          background: "linear-gradient(180deg, var(--point-soft), var(--point))",
          fontFamily: "var(--hand)", fontWeight: 700, fontSize: 12, color: "var(--ink)",
        }}>{t("photo.captureBtn")}</button>
      </div>

      <div style={{
        position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)",
        maxWidth: "90%", textAlign: "center",
        background: "rgba(255,255,255,0.92)", border: "1px solid var(--ink-soft)",
        borderRadius: 99, padding: "2px 10px",
        fontFamily: "var(--hand)", fontSize: 11, color: "var(--ink-2)",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        {msg || t("photo.hint")}
      </div>
    </div>
  );
}

window.PhotocardView = PhotocardView;
window.usePhotocard = usePhotocard;
