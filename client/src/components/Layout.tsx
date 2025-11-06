import type { ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="app-nav" style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/summary">Summary</Link>
        </nav>
      </header>
      <main className="app-main">
        {children}
        <Outlet />
      </main>
      <footer className="app-footer">© {new Date().getFullYear()}</footer>
    </div>
  );
}


