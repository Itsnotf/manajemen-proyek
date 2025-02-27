"use client";
import Cookies from 'js-cookie';
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Login } from "../../../../services/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await Login(email, password);
      if (response.status) {
        Cookies.set("token", response.token, { expires: 7 });
        localStorage.setItem("token", response.token);
        localStorage.setItem("users", JSON.stringify(response.data));      
        const role_id = response.data.role_id;
        if (role_id === 4) {
          router.push("/projects"); 
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm p-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-extrabold">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
              {isLoading ? "Login.." : "Login"}
            </Button>
          </form>
          <p className="text-center text-xs mt-4 text-gray-500">
            © Copy Right Pertamadech
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
