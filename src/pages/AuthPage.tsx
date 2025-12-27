import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock, User, AlertCircle, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, registeredUsers } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const [error, setError] = useState<string | null>(null);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signup(signupEmail, signupPassword, signupName);
    
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
    }
    
    setIsLoading(false);
  };

  const hasRegisteredUsers = registeredUsers.length > 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Theme toggle in corner */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsDark(!isDark)}
        className="absolute top-4 right-4 bg-card"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">GearGuard</span>
          </h1>
        </div>

        <Card className="border-border shadow-xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold">Welcome</CardTitle>
            <CardDescription className="text-muted-foreground">
              {activeTab === 'signup' 
                ? 'Create an account to get started'
                : 'Sign in to your account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setError(null); }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
                <TabsTrigger 
                  value="login" 
                  disabled={!hasRegisteredUsers}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10 bg-background border-border focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 bg-background border-border focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 bg-background border-border focus:border-primary"
                        required
                        minLength={4}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 4 characters
                    </p>
                  </div>
                  <Button type="submit" className="w-full shadow-md" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>

                {hasRegisteredUsers && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </TabsContent>

              <TabsContent value="login">
                {!hasRegisteredUsers ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      No accounts registered yet. Please sign up first.
                    </p>
                    <Button onClick={() => setActiveTab('signup')}>
                      Create Account
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 bg-background border-border focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 bg-background border-border focus:border-primary"
                          required
                          minLength={4}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full shadow-md" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                )}

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Enterprise footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Enterprise Maintenance Management Platform
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
