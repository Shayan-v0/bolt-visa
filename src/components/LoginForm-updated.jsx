import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/df2fcca4-4119-4901-b0e9-3709f827b0da/142a9efef25160c783e4a0f352f230c1.png";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, 'web');
      toast({
        title: "Login Successful!",
        description: "You don't just log in, you log in to lead, serve, and shine. Let's do this, Bolt Visa Express champions!",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Login Failed",
        description: err.message || "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-purple-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md glass-effect bg-black/40 backdrop-blur-md border border-purple-700 text-white">
          <CardHeader className="text-center">
            <img src={logoUrl} alt="Bolt Visa Express Logo" className="w-32 h-32 mx-auto mb-4 rounded-full object-cover border-4 border-purple-500" />
            <CardTitle className="text-3xl font-bold text-pink-400">Welcome Champion</CardTitle>
            <CardDescription className="text-purple-200">
              Ready to lead, serve, and shine today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-300">Email</Label>
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
                <Label htmlFor="password" className="text-purple-300">Password</Label>
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
                <Button
                  type="submit"
                  className="w-full text-black font-semibold py-3 bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-300 hover:opacity-90"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In & Shine
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-purple-400">
            &copy; {new Date().getFullYear()} Bolt Visa Express. All rights reserved.
          </p>
          <p className="text-sm text-yellow-300 italic">
            "You don't just log in, you log in to lead, serve, and shine. Let's do this, Bolt Visa Express champions!"
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
