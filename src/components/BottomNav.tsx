import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Trophy, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/social', icon: Users, label: 'Mur social' },
    { path: '/classement', icon: Trophy, label: 'Classement' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-foreground/10 shadow-lg z-50">
      <div className="max-w-[100rem] mx-auto px-4">
        <div className="flex items-center justify-around h-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 h-full"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center justify-center gap-1 ${
                    isActive ? 'text-accent-green' : 'text-foreground/60'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-paragraph text-xs font-semibold">
                    {item.label}
                  </span>
                </motion.div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent-green rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
