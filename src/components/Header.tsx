
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, SlidersVertical, Settings, Home, Plus, GitCompare, LogOut, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useUser, useClerk } from '@clerk/clerk-react';

const Header = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
          <SlidersVertical className="h-6 w-6" />
          <span className="font-bold uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>MIX NOTES</span>
        </Link>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            {isSignedIn && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/new')}
                className="mr-2"
              >
                <Plus className="mr-1 h-4 w-4" />
                <span>New Mix</span>
              </Button>
            )}
            
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
                
                {isSignedIn ? (
                  <>
                    <Link 
                      to="/progress" 
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <GitCompare className="h-5 w-5 text-blue-600" />
                      <span>Compare Mixes</span>
                    </Link>
                    <Link 
                      to="/account" 
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 text-blue-600" />
                      <span>Account</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5 text-blue-600" />
                      <span>Settings</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs text-left"
                    >
                      <LogOut className="h-5 w-5 text-blue-600" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 px-4 py-3 rounded-md text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full max-w-xs"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Log In</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <nav className="flex items-center gap-1">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Home
            </Link>
            
            {isSignedIn ? (
              <>
                <Link 
                  to="/progress" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  Compare Mixes
                </Link>
                <Link 
                  to="/account" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  Account
                </Link>
                <Button variant="default" className="ml-2" size="sm" onClick={() => navigate('/new')}>
                  <Plus className="mr-1 h-4 w-4" />
                  <span>New Mix</span>
                </Button>
                <Button variant="ghost" className="ml-1" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-1 h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
                <div className="ml-2 px-3 py-1 font-medium text-sm rounded-full bg-blue-100 text-blue-700">
                  {user?.primaryEmailAddress?.emailAddress.split('@')[0]}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
