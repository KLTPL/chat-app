"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

function Register() {
  const [state, formAction] = useActionState(register, {
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
        <Input type="email" placeholder="Email" name="email" />
        <Input
          type="text"
          placeholder="Username (must be unique)"
          name="username"
        />
        <Input type="text" placeholder="Name" name="name" />
        <Input type="password" placeholder="Password" name="password" />
        {state.error && (
          <p className="text-red-500 text-sm text-center">{state.error}</p>
        )}
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}

export default Register;
