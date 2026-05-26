import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", email);
    // Integrate Supabase auth here in the future
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 mt-16">
        <Card className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="login">
                <CardTitle className="text-2xl mb-2 text-center">Login with a RoleColorAI Account</CardTitle>
                <CardDescription className="mb-6 text-center">
                  Enter your email and password to log in.
                </CardDescription>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <CardTitle className="text-2xl mb-2 text-center">Sign Up</CardTitle>
                <div className="py-12 text-center">
                  <p className="text-muted-foreground text-lg mb-4">Signup blocked</p>
                  <p className="text-sm text-muted-foreground">
                    New account registrations are currently disabled.
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
