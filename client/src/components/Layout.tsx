import type { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, FileText, Upload, BarChart3, Shield } from 'lucide-react';

type LayoutProps = {
  children?: ReactNode;
};

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/summary', label: 'Summary', icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoNTksMTMwLDI0NiwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
      </div>
      
      <header className="sticky top-0 z-50 glass-effect border-b shadow-lg">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between"
        >
          <Link to="/" className="group inline-flex items-center gap-3 font-bold text-xl">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Shield className="h-7 w-7 text-blue-600 relative z-10" />
            </motion.div>
            <span className="gradient-text">Clinical Registry Secure</span>
          </Link>
          <nav className="flex items-center gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant={isActive ? 'default' : 'ghost'}
                    className={`relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50' 
                        : 'hover:bg-blue-50/50'
                    }`}
                  >
                    <Link to={item.path} className="flex items-center gap-2 relative z-10">
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
        <Separator />
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
          <Outlet />
        </motion.div>
      </main>
      <footer className="relative z-10 border-t glass-effect text-center text-xs text-slate-600 py-6 mt-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <Shield className="h-4 w-4 text-blue-600" />
          © {new Date().getFullYear()} Dual Digital Twin. Secure Medical Records Management.
        </motion.p>
      </footer>
    </div>
  );
}


