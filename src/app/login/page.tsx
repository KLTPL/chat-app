import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Login() {
  return (
    <div className="flex items-center justify-center h-[100vh]">
      <form
        className="w-fit flex flex-col gap-3 "
        action={async data => {
          "use server";
          console.log(data);
          // login
        }}
      >
        <h2 className="text-3xl font-semibold text-center">Login</h2>
        <Input type="email" placeholder="Email" className="w-3xl" />
        <Input type="password" placeholder="Password" />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

export default Login;
