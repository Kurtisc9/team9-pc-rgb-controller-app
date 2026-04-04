import { NavLink, Outlet } from 'react-router-dom';
import { useAppStore } from '@/app/store/useAppStore';

const navigation = [
  { label: 'Home', path: '/home' },
  { label: 'LCD / Media', path: '/lcd-media' },
  { label: 'Library', path: '/library' },
  { label: 'RGB (Advanced)', path: '/rgb' },
  { label: 'Settings', path: '/settings' },
] as const;

export function AppShell() {
  const backendHealth = useAppStore((state) => state.backendHealth);
  const backendIssueCount = Object.values(backendHealth).filter(
    (backend) => !backend.available,
  ).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="eyebrow">Team9</div>
          <h1 className="sidebar-title">PC RGB Controller App</h1>
          <p className="sidebar-copy">
            Truthful local control center. LCD / Media first. RGB second.
          </p>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-item nav-item-active' : 'nav-item'
              }
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-status">
          <div className="sidebar-status-label">Backend attention</div>
          <div className="sidebar-status-value">{backendIssueCount}</div>
          <div className="sidebar-status-copy">
            Hidden engineering detail stays in Settings.
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
