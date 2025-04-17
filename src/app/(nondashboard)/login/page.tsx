'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, Facebook, Twitter, Github } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/redux/hook';
import { useLoginMutation } from '@/services/apiAuth';

const AuthPage = () => {
  const navigate = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';
  const defaultTab = isLoginPage ? 'login' : 'register';
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      setIsLoading(true);
      const result = await login({
        usr_email: formData.email,
        usr_password: formData.password
      }).unwrap();

      console.log(result);
      if (result.status && result.statusCode == 200) {
        const { metadata } = result;
        // Dispatch login success action with the token and user data
        toast.success('Login successfully!');
        if (metadata.user.usr_id === 1) navigate.push('/dashboard/manga');
        else navigate.push('/');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <div className="bg-card border-border rounded-xl border p-6 shadow-lg">
        <h1 className="manga-heading mb-6 text-center">
          {isLoginPage ? 'Welcome Back!' : 'Join MangaSphere'}
        </h1>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2">
            <TabsTrigger value="login" onClick={() => navigate.push('/login')}>
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => navigate.push('/register')}
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-manga-400 h-auto p-0"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-manga-600 hover:bg-manga-700 w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="border-border w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card text-muted-foreground px-2">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button type="button" variant="outline" className="w-full">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
