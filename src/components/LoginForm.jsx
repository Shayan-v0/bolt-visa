import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, AlertCircle, User, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/df2fcca4-4119-4901-b0e9-3709f827b0da/142a9efef25160c783e4a0f352f230c1.png";

  const handleSubmit = async () => {
    // e.preventDefault();
    console.log('Form submitted!');
    setError('');
    try {
      console.log('About to call login with:', email, password);
      await login(email, password, 'web');
      console.log('Login successful!');
      toast({
        title: "Login Successful!",
        description: "You don't just log in, you log in to lead, serve, and shine. Let's do this, Bolt Visa Express champions!",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      console.log('Login error:', err);
      setError(err.message);
      toast({
        title: "Login Failed",
        description: err.message || "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900/20 to-purple-600/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md glass-effect">
          <CardHeader className="text-center">
            <img src={logoUrl} alt="Bolt Visa Express Logo" className="w-32 h-32 mx-auto mb-4 rounded-full object-cover" />
            <CardTitle className="text-3xl font-bold gradient-text">Welcome Champion</CardTitle>
            <CardDescription className="text-purple-300">
            Ready to lead, serve, and shine today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1 text-purple-300">
                <User className="h-4 w-4" />Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bolt.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-purple-900/30 border-purple-500/50 text-white placeholder-purple-400/70 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1 text-purple-300">
                <Lock className="h-4 w-4" />
                Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-purple-900/30 border-purple-500/50 text-white placeholder-purple-400/70 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 text-purple-300 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-3 text-sm text-red-400 bg-red-500/10 rounded-md border border-red-500/30"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white font-bold py-2 px-4 rounded-md shadow-md hover:brightness-110 transition-all duration-300">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign in & Shine
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
        {/* <p className="text-center text-xs text-purple-400 mt-6">
          &copy; {new Date().getFullYear()} Bolt Visa Express. All rights reserved.
        </p> */}
        <p className="text-center text-mds text-purple-300 mt-6">
        You don't just log in, you log in to lead, serve, and shine…
        </p>
      </motion.div>
    </div>
  );
};

export default LoginForm;