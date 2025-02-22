"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, loadUserFromStorage } from "../../../store/reducer/userSlice";
import { RootState } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(loadUserFromStorage());
    if (isAuthenticated) {
      router.push("/lesson-planner");
    }
  }, [dispatch, isAuthenticated, router]);

  const handleLogin = () => {
    if (email === "demouser" && password === "demopass") {
      dispatch(login(email)); 
      router.push("/lesson-planner");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh] bg-gray-100 dark:bg-gray-900">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full bg-black dark:bg-white" onClick={handleLogin}>Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
