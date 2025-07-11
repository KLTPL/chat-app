import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { redirect } from "next/navigation";

function Login() {
  return (
    <div className="flex items-center justify-center h-[100vh]">
      <form
        className="w-fit flex flex-col gap-3 "
        action={async formData => {
          "use server";
          await login(formData);
          redirect("/");
        }}
      >
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="w-3xl"
        />
        <Input name="password" type="password" placeholder="Password" />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

export default Login;
