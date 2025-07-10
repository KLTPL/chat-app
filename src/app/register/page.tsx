import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Register() {
  return (
    <div>
      <form
        action={async data => {
          "use server";
          console.log(data);
          // login
        }}
      >
        <Input type="email" placeholder="Email" />
        <Input type="text" placeholder="Name" />
        <Input type="password" placeholder="Password" />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}

export default Register;
