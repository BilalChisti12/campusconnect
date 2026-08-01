import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car, LogOut, LayoutDashboard, Users, Shield, QrCode,
  ClipboardList, AlertTriangle, MapPin, UserCheck, Menu, X } from
'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';







const roleNavItems = {
  student: [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> }],

  entrance_security: [
  { label: 'Dashboard', path: '/entrance', icon: <LayoutDashboard size={20} /> },
  { label: 'Verify Vehicle', path: '/entrance/verify', icon: <UserCheck size={20} /> },
  { label: 'Register Student', path: '/entrance/register', icon: <ClipboardList size={20} /> },
  { label: 'Visitor Log', path: '/entrance/visitors', icon: <Users size={20} /> }],

  parking_security: [
  { label: 'Dashboard', path: '/parking', icon: <LayoutDashboard size={20} /> },
  { label: 'QR Scanner', path: '/parking/scanner', icon: <QrCode size={20} /> },
  { label: 'Violations', path: '/parking/violations', icon: <AlertTriangle size={20} /> }],

  admin: [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Requests', path: '/admin/requests', icon: <ClipboardList size={20} /> },
  { label: 'Parking Slots', path: '/admin/slots', icon: <MapPin size={20} /> },
  { label: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  { label: 'Visitors', path: '/admin/visitors', icon: <Shield size={20} /> },
  { label: 'Violations', path: '/admin/violations', icon: <AlertTriangle size={20} /> }]

};

const roleLabels = {
  student: 'Student Portal',
  entrance_security: 'Entrance Security',
  parking_security: 'Parking Security',
  admin: 'Admin Panel'
};

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = roleNavItems[user.role];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Car className="text-primary-foreground" size={28} />
              <div>
                <h1 className="text-primary-foreground font-bold text-lg leading-tight">
                  Smart Campus Parking
                </h1>
                <p className="text-primary-foreground/70 text-xs">
                  {roleLabels[user.role]}
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) =>
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                size="sm"
                className={
                location.pathname === item.path ?
                'text-secondary-foreground' :
                'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                }
                onClick={() => navigate(item.path)}>
                
                  {item.icon}
                  <span className="ml-1.5">{item.label}</span>
                </Button>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-primary-foreground text-sm font-medium">{user.name}</p>
                <p className="text-primary-foreground/60 text-xs">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => {logout();navigate('/');}}>
                
                <LogOut size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-primary-foreground/10">
          
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) =>
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${
              location.pathname !== item.path ?
              'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10' :
              ''}`
              }
              onClick={() => {navigate(item.path);setMobileMenuOpen(false);}}>
              
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
            )}
            </div>
          </motion.div>
        }
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {children}
        </motion.div>
      </main>
    </div>);

};