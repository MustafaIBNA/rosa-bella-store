'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        toast({ title: 'Login Successful', description: 'Welcome, admin!' });
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          // If user not found, create a new user
          createUserWithEmailAndPassword(auth, username, password)
            .then(() => {
              toast({ title: 'Account Created', description: 'Welcome, new admin!' });
            })
            .catch((creationError) => {
              toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: creationError.message,
              });
            });
        } else {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message,
          });
        }
      });
  };

  if (isUserLoading) {
    return <main className="flex-1 flex items-center justify-center p-4">Loading...</main>;
  }

  if (user) {
    return <AdminDashboard />;
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard. Use any email and a password of at least 6 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                placeholder="admin@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login or Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
