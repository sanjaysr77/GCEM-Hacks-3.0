import type { ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Activity } from 'lucide-react';

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <Activity className="h-5 w-5 text-blue-600" /> Clinical Registry Secure System
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost"><Link to="/">Home</Link></Button>
            <Button asChild variant="ghost"><Link to="/reports">Reports</Link></Button>
            <Button asChild variant="ghost"><Link to="/upload">Upload</Link></Button>
            <Button asChild variant="ghost"><Link to="/summary">Summary</Link></Button>
          </nav>
        </div>
        <Separator />
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        {children}
        <Outlet />
      </main>
      <footer className="border-t text-center text-xs text-slate-500 py-4">© {new Date().getFullYear()} Dual Digital Twin</footer>
    </div>
  );
}


