import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, Badge as BadgeIcon, BarChart3, Shield, FolderOpen, Plane } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/df2fcca4-4119-4901-b0e9-3709f827b0da/142a9efef25160c783e4a0f352f230c1.png";

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getAvatarSrc = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b45ff&color=fff&size=128`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-purple-600/30 flex flex-col">
      <nav className="glass-effect border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div 
              className="flex items-center flex-shrink-0 cursor-pointer"
              onClick={() => handleNavigation('/')}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={logoUrl} alt="Bolt Visa Express Logo" className="w-8 h-8 sm:w-10 sm:h-10 mr-2 rounded-full object-cover"/>
              <span className="text-sm sm:text-base md:text-xl font-bold gradient-text whitespace-nowrap">Bolt Visa Express</span>
              {isAdmin && (
                <span className="ml-2 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xxs sm:text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full font-semibold whitespace-nowrap">
                  ADMIN
                </span>
              )}
            </motion.div>

            {/* Navigation Links */}
            <motion.div 
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isAdmin ? (
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-purple-500/10 ${location.pathname === '/admin' ? 'bg-purple-500/20' : ''}`}
                  onClick={() => handleNavigation('/admin')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-purple-500/10 ${location.pathname === '/dashboard' ? 'bg-purple-500/20' : ''}`}
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              )}

              {/* VISA SERVICES (New Link) */}
              <Button
                variant="ghost"
                className={`text-white hover:bg-purple-500/10 ${location.pathname === '/services' ? 'bg-purple-500/20' : ''}`}
                onClick={() => handleNavigation('/services')}
              >
                <Plane className="mr-2 h-4 w-4" />
                Visa Services
              </Button>
            </motion.div>

            {/* User Profile Dropdown */}
            <motion.div 
              className="flex items-center space-x-1 sm:space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-white font-semibold text-sm truncate max-w-[150px]">{user?.name}</p>
                  <p className="text-purple-300 text-xs truncate max-w-[150px]">{user?.position}</p>
                  <div className="flex items-center text-xs text-purple-400 truncate max-w-[150px]">
                    <BadgeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    {user?.employeeId}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full flex-shrink-0">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={getAvatarSrc()} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-effect border-purple-500/20" align="end" forceMount>
                  <DropdownMenuItem className="text-white hover:bg-purple-500/10 md:hidden focus:bg-purple-500/20 focus:text-white">
                    <div className="flex flex-col">
                      <span className="font-semibold truncate">{user?.name}</span>
                      <span className="text-xs text-purple-300 truncate">{user?.position} - {user?.employeeId}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="md:hidden bg-purple-500/20"/>

                  {/* Mobile Nav - Admin/User Panel */}
                  {isAdmin ? (
                    <DropdownMenuItem 
                      className="text-white hover:bg-purple-500/10 focus:bg-purple-500/20 focus:text-white md:hidden"
                      onClick={() => handleNavigation('/admin')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="text-white hover:bg-purple-500/10 focus:bg-purple-500/20 focus:text-white md:hidden"
                      onClick={() => handleNavigation('/dashboard')}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}

                  {/* Mobile Nav - VISA SERVICES */}
                  <DropdownMenuItem 
                    className="text-white hover:bg-purple-500/10 focus:bg-purple-500/20 focus:text-white md:hidden"
                    onClick={() => handleNavigation('/services')}
                  >
                    <Plane className="mr-2 h-4 w-4" />
                    <span>Visa Services</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    className="text-white hover:bg-purple-500/10 focus:bg-purple-500/20 focus:text-white"
                    onClick={() => handleNavigation('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white hover:bg-purple-500/10 focus:bg-purple-500/20 focus:text-white"
                    onClick={() => handleNavigation('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-500/20"/>
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/20 focus:text-red-300"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto py-3 sm:py-6 px-2 sm:px-4 lg:px-8 w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
