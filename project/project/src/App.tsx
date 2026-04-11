import { useBootstrap } from './hooks/useBootstrap';

export default function App() {
  const { data, loading, error } = useBootstrap();

  if (loading) return <div style={{ padding: 24 }}>Loading Team9 bootstrap…</div>;
  if (error) return <div style={{ padding: 24 }}>Bootstrap error: {error}</div>;
  if (!data) return <div style={{ padding: 24 }}>No bootstrap state found.</div>;

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Team9 RGB Controller</h1>

      <h2>Mode</h2>
      <p>{data.app.mode}</p>

      <h2>Priority</h2>
      <p>{data.app.priority}</p>

      <h2>Devices</h2>
      <ul>
        {data.devices.map((device) => (
          <li key={device.id}>
            {device.name} — {device.syncTruth}
          </li>
        ))}
      </ul>

      <h2>Pages</h2>
      <ul>
        {data.pages.map((page) => (
          <li key={page}>{page}</li>
        ))}
      </ul>
    </div>
  );
}
