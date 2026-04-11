import { useMemo, useState } from 'react';
import { getBridge } from './lib/getBridge';
import { useBootstrap } from './hooks/useBootstrap';

const modeOptions = ['image', 'video', 'clock', 'system', 'off'];

export default function App() {
  const { data, loading, error, reload } = useBootstrap();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const selectedDevice = useMemo(() => {
    if (!data) return null;
    return data.devices.find((device) => device.id === data.selectedDisplayId) ?? null;
  }, [data]);

  async function handleImportFiles() {
    try {
      setBusy('import');
      setMessage('');
      await getBridge().importLibraryFiles();
      await reload();
      setMessage('Library import complete.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Library import failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleSelectDisplay(deviceId: string) {
    try {
      setBusy(`display:${deviceId}`);
      setMessage('');
      await getBridge().setSelectedDisplay(deviceId);
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Display selection failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleSetMode(deviceId: string, mode: string) {
    try {
      setBusy(`mode:${deviceId}`);
      setMessage('');
      await getBridge().setDisplayMode(deviceId, mode);
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Mode update failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleSelectAsset(assetId: string) {
    try {
      setBusy(`asset:${assetId}`);
      setMessage('');
      await getBridge().selectLibraryAsset(assetId);

      if (data?.selectedDisplayId) {
        await getBridge().assignAssetToDisplay(data.selectedDisplayId, assetId);
      }

      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Asset selection failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleToggleFavorite(assetId: string) {
    try {
      setBusy(`favorite:${assetId}`);
      setMessage('');
      await getBridge().toggleLibraryFavorite(assetId);
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Favorite toggle failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleDeleteAsset(assetId: string) {
    try {
      setBusy(`delete:${assetId}`);
      setMessage('');
      await getBridge().deleteLibraryAsset(assetId);
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleRunDiagnostics() {
    try {
      setBusy('diagnostics');
      setMessage('');
      const result = await getBridge().refreshBackendHealth();
      setMessage(result?.note || 'Diagnostics refresh complete.');
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Diagnostics refresh failed.');
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <div style={styles.page}>Loading Team9 controller…</div>;
  }

  if (error) {
    return <div style={styles.page}>Bootstrap error: {error}</div>;
  }

  if (!data) {
    return <div style={styles.page}>No bootstrap state found.</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Team9 RGB Controller</h1>
          <div style={styles.subtle}>
            {data.app.mode} · {data.app.priority}
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={reload} disabled={busy !== null} style={styles.button}>
            Refresh
          </button>
          <button onClick={handleImportFiles} disabled={busy !== null} style={styles.button}>
            Import Media
          </button>
          <button onClick={handleRunDiagnostics} disabled={busy !== null} style={styles.button}>
            Refresh Diagnostics
          </button>
        </div>
      </div>

      {message ? <div style={styles.notice}>{message}</div> : null}

      <div style={styles.grid}>
        <section style={styles.panel}>
          <h2 style={styles.h2}>Displays</h2>
          <div style={styles.stack}>
            {data.devices.map((device) => {
              const isSelected = device.id === data.selectedDisplayId;

              return (
                <div
                  key={device.id}
                  style={{
                    ...styles.card,
                    border: isSelected ? '1px solid #5d7899' : '1px solid #293241',
                  }}
                >
                  <div style={styles.rowBetween}>
                    <div>
                      <div style={styles.cardTitle}>{device.name}</div>
                      <div style={styles.subtle}>
                        {device.subtitle || 'No subtitle'} · {device.syncTruth}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectDisplay(device.id)}
                      disabled={busy !== null}
                      style={styles.button}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>

                  <div style={styles.metaRow}>
                    <span>Display: {device.displayPath}</span>
                    <span>RGB: {device.rgbPath}</span>
                    <span>Status: {device.status || 'unknown'}</span>
                  </div>

                  <div style={styles.modeRow}>
                    {modeOptions.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleSetMode(device.id, mode)}
                        disabled={busy !== null}
                        style={{
                          ...styles.chip,
                          opacity: device.mode === mode ? 1 : 0.7,
                        }}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.h2}>Selected Display</h2>
          {selectedDevice ? (
            <div style={styles.card}>
              <div style={styles.cardTitle}>{selectedDevice.name}</div>
              <div style={styles.subtle}>{selectedDevice.subtitle}</div>
              <div style={styles.metaColumn}>
                <span>Mode: {selectedDevice.mode || 'image'}</span>
                <span>Assigned Asset: {selectedDevice.assignedAssetId || 'none'}</span>
                <span>Sync Truth: {selectedDevice.syncTruth}</span>
              </div>
            </div>
          ) : (
            <div style={styles.subtle}>No display selected.</div>
          )}

          <h2 style={{ ...styles.h2, marginTop: 24 }}>Diagnostics</h2>
          <div style={styles.card}>
            <div style={styles.metaColumn}>
              <span>Backend: {data.diagnostics.backend}</span>
              <span>Sync: {data.diagnostics.sync}</span>
            </div>
          </div>
        </section>
      </div>

      <section style={{ ...styles.panel, marginTop: 20 }}>
        <h2 style={styles.h2}>Library</h2>
        {data.library.length === 0 ? (
          <div style={styles.subtle}>No media imported yet.</div>
        ) : (
          <div style={styles.libraryGrid}>
            {data.library.map((asset) => {
              const selected = data.selectedAssetId === asset.id;

              return (
                <div
                  key={asset.id}
                  style={{
                    ...styles.card,
                    border: selected ? '1px solid #5d7899' : '1px solid #293241',
                  }}
                >
                  <div style={styles.cardTitle}>{asset.name}</div>
                  <div style={styles.subtle}>
                    {asset.type} · {asset.favorite ? 'favorite' : 'standard'}
                  </div>
                  <div style={styles.assetPath}>{asset.path}</div>

                  <div style={styles.rowWrap}>
                    <button
                      onClick={() => handleSelectAsset(asset.id)}
                      disabled={busy !== null}
                      style={styles.button}
                    >
                      Select
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(asset.id)}
                      disabled={busy !== null}
                      style={styles.button}
                    >
                      Favorite
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      disabled={busy !== null}
                      style={styles.button}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0b0f14',
    color: '#e7edf5',
    padding: 24,
    fontFamily: 'Inter, Segoe UI, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  h1: {
    margin: 0,
    fontSize: 28,
  },
  h2: {
    marginTop: 0,
    fontSize: 18,
  },
  subtle: {
    color: '#95a4b8',
    fontSize: 13,
  },
  actions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    background: '#18212c',
    color: '#e7edf5',
    border: '1px solid #2b3645',
    borderRadius: 10,
    padding: '10px 14px',
    cursor: 'pointer',
  },
  chip: {
    background: '#121922',
    color: '#d5dfeb',
    border: '1px solid #2b3645',
    borderRadius: 999,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  notice: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    background: '#121922',
    border: '1px solid #2b3645',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: 20,
  },
  panel: {
    background: '#10161e',
    border: '1px solid #222c38',
    borderRadius: 16,
    padding: 20,
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  card: {
    background: '#121922',
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 6,
  },
  rowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  rowWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    color: '#a8b5c6',
    fontSize: 13,
  },
  metaColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 12,
    color: '#a8b5c6',
    fontSize: 13,
  },
  modeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  libraryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 14,
  },
  assetPath: {
    marginTop: 8,
    color: '#8d9caf',
    fontSize: 12,
    wordBreak: 'break-all',
  },
};
