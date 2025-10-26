// src/pages/signals/signals.tsx
import React, { useEffect, useRef, useState } from 'react';

type Tool = {
  id: string;
  title: string;
  src: string;
};

const TOOLS: Tool[] = [
  { id: 'signals-scanner', title: 'signals-scanner', src: 'https://signals-scanner.vercel.app/' },
  { id: 'smartanalysistool', title: 'smartanalysistool', src: 'https://smartanalysistool.com/signal-center' },
];

const Signals: React.FC = () => {
  const [selected, setSelected] = useState<string>(TOOLS[0].id);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 900 : false
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0); // force iframe reload when switching

  // responsive detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // compute iframe height so it fills the viewport below this component
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const compute = () => {
      const top = containerRef.current?.getBoundingClientRect().top ?? 0;
      // subtract a small margin (16) so nothing touches the bottom
      const h = Math.max(240, Math.floor(window.innerHeight - top - 16));
      setIframeHeight(h);
    };
    compute();
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    // also recompute shortly after mount (for certain mobile browsers)
    const t = setTimeout(compute, 200);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile, selected]);

  // when user picks a different tool, reset loading / error and force reload
  useEffect(() => {
    setLoading(true);
    setIframeError(false);
    setReloadKey((k) => k + 1);
  }, [selected]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    // allow the parent to control exact height; we still calculate iframe specifically
  };

  const controlBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    flexWrap: 'wrap',
  };

  const btnBase: React.CSSProperties = {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.12)',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    minWidth: 140,
    textAlign: 'center' as const,
  };
  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: 'rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.18)',
    fontWeight: 600,
  };

  const iframeWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: iframeHeight ? iframeHeight : 420,
    minHeight: 240,
    borderRadius: 10,
    overflow: 'hidden',
    background: '#ffffff', // default white background for the iframe container (you can change)
    boxShadow: '0 0 0 1px rgba(0,0,0,0.04) inset',
  };

  const topBarMetaStyle: React.CSSProperties = {
    marginLeft: 'auto',
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
  };

  const currentTool = TOOLS.find((t) => t.id === selected) ?? TOOLS[0];

  // Fallback open-in-new-tab function
  const openInNewTab = () => {
    window.open(currentTool.src, '_blank', 'noopener,noreferrer');
  };

  // handle a possible iframe error — there's no reliable onerror for iframe across browsers,
  // but we can use a timeout or message if the iframe doesn't load. We'll show a fallback
  // button so the user can open the tool in a new tab.
  const onIframeLoad = () => {
    setLoading(false);
    setIframeError(false);
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={controlBarStyle} role="tablist" aria-label="Select tool">
        {/* On very narrow screens show a select to conserve horizontal space */}
        {isMobile ? (
          <>
            <select
              aria-label="Select tool"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.12)',
                minWidth: 160,
                fontSize: 14,
              }}
            >
              {TOOLS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <div style={topBarMetaStyle}>Mobile view</div>
          </>
        ) : (
          <>
            {TOOLS.map((tool) => {
              const active = tool.id === selected;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelected(tool.id)}
                  aria-pressed={active}
                  style={active ? btnActive : btnBase}
                  title={`Open ${tool.title}`}
                >
                  {tool.title}
                </button>
              );
            })}
            <div style={topBarMetaStyle}>Desktop view</div>
          </>
        )}
      </div>

      <div style={iframeWrapperStyle}>
        {/* Loading / error UI overlay */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              marginTop: 12,
              marginLeft: 12,
              zIndex: 20,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              fontSize: 13,
            }}
          >
            Loading {currentTool.title}...
          </div>
        )}

        {/* If we detect an iframe error, show fallback message */}
        {iframeError && (
          <div
            style={{
              padding: 18,
              height: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600 }}>Unable to embed this tool</div>
            <div style={{ color: 'rgba(0,0,0,0.65)', textAlign: 'center', maxWidth: 560 }}>
              Some sites prevent embedding inside an iframe (X-Frame-Options or Content-Security-Policy).
              Click the button below to open the tool in a new tab.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={openInNewTab}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Open {currentTool.title}
              </button>
              <button
                onClick={() => {
                  setIframeError(false);
                  setLoading(true);
                  setReloadKey((k) => k + 1);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* The actual iframe. we key it with reloadKey to force reload on tool switch */}
        {!iframeError && (
          <iframe
            key={`${currentTool.id}--${reloadKey}`}
            src={currentTool.src}
            title={currentTool.title}
            style={{
              width: '100%',
              height: '100%',
              border: '0',
              display: loading ? 'none' : 'block', // hide until load to avoid white flash
              background: 'transparent',
            }}
            onLoad={onIframeLoad}
            // sandbox left empty so site behaves normally; if a site requires sandbox, change here
            // sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            // Allow fullscreen if needed
            allowFullScreen
            // If you find certain sites work only when not setting sandbox, adjust above accordingly.
            onError={() => {
              setLoading(false);
              setIframeError(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Signals;
