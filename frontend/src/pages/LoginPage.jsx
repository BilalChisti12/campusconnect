import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Car, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';

const roleRedirects = {
  student: '/student',
  entrance_security: '/entrance',
  parking_security: '/parking',
  admin: '/admin'
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      const saved = JSON.parse(localStorage.getItem('campus_user') || '{}');
      toast.success(`Welcome back, ${saved.name}!`);
      navigate(roleRedirects[saved.role]);
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          
          {/* College Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="src\pages\logo.png"
              alt="College Logo"
              className="h-14 object-contain" />
            
          </div>

          {/* App Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2">
              <Car className="text-primary" size={28} />
              <h1 className="text-2xl font-bold text-foreground">GParking</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Management System
            </p>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xl font-semibold text-card-foreground text-center">
                Sign In
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Enter your credentials to access the system
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required />
                    
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                      onClick={() => setShowPassword(!showPassword)}>
                      
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full transition-smooth"
                  disabled={loading}>
                  
                  <LogIn size={18} className="mr-2" />
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Test Credentials</h3>
            <div className="space-y-1 text-xs text-muted-foreground font-mono">
              <p><span className="font-semibold text-foreground">Admin:</span> admin@campus.edu / admin123</p>
              <p><span className="font-semibold text-foreground">Entrance Security:</span> entrance@campus.edu / entrance123</p>
              <p><span className="font-semibold text-foreground">Parking Security:</span> parking@campus.edu / parking123</p>
              <p><span className="font-semibold text-foreground">Student:</span> student@campus.edu / student123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>);

};

export default LoginPage;