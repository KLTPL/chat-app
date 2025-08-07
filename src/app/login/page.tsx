"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

function Login() {
  const [state, formAction] = useActionState(login, {
    success: false,
    error: undefined,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/");
    }
  }, [state, router]);

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <form className="w-fit flex flex-col gap-3 " action={formAction}>
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="w-3xl"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        {state.error && (
          <p className="text-red-500 text-sm text-center">{state.error}</p>
        )}
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

export default Login;
