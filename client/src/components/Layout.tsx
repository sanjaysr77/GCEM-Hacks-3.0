import type { ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-6 text-sm">
          <Link className="font-medium hover:text-blue-600" to="/">Home</Link>
          <Link className="font-medium hover:text-blue-600" to="/reports">Reports</Link>
          <Link className="font-medium hover:text-blue-600" to="/upload">Upload</Link>
          <Link className="font-medium hover:text-blue-600" to="/summary">Summary</Link>
        </nav>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        {children}
        <Outlet />
      </main>
      <footer className="border-t text-center text-xs text-slate-500 py-4">© {new Date().getFullYear()}</footer>
    </div>
  );
}


