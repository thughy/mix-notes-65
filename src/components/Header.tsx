
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BarChart, Music, Settings, ChevronRight, Home, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Header = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest('#mobile-menu') && !target.closest('#menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-medium text-blue-700 transition-transform hover:scale-[1.02]"
          onClick={() => setIsMenuOpen(false)}
        >
          <Music className="h-6 w-6" />
          <span className="font-bold">Mix Notes</span>
        </Link>
        
        {isMobile ? (
          <>
            <Button
              id="menu-toggle"
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Mobile menu */}
            {isMenuOpen && (
              <div 
                id="mobile-menu"
                className="fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 p-6 animate-fade-in"
              >
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-5 w-5 text-blue-600" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/new" 
                  className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Music className="h-5 w-5 text-blue-600" />
                  <span>New Mix Entry</span>
                </Link>
                <Link 
                  to="/progress" 
                  className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart className="h-5 w-5 text-blue-600" />
                  <span>Progress Tracker</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>Settings</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-1">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/new" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              New Mix Entry
            </Link>
            <Link 
              to="/progress" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Progress Tracker
            </Link>
            <Button variant="default" className="ml-2" size="sm" onClick={() => navigate('/new')}>
              <Plus className="mr-1 h-4 w-4" />
              <span>New Mix</span>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
