import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { publicInstance } from "@/axios/interceptor";
import useAuthStore from "@/store/authStore";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const LoginPage = () => {
  const { setAuth } = useAuthStore((state: any) => ({
    setAuth: state.setAuth,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(publicInstance.post("/api/auth/login", values), {
      loading: "Loading...",
      success: (res) => {
        setAuth(res.data.user, res.data.accessToken);
        return "Successfully logged in";
      },
      error: (err) => {
        return err.response?.data?.message || err.message || "Error logging in";
      },
    });
  }

  return (
    <div className="grid gap-4 grid-cols-12">
      <div className="hidden lg:flex lg:col-span-6 bg-zinc-900"></div>

      <div className="col-span-12 lg:col-span-6 h-screen flex items-center justify-center">
        <Form {...form}>
          <form className="w-full p-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-[380px] max-w-full mx-auto space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-center">
                  Welcome back!
                </h2>
                <p className="text-center text-muted-foreground">
                  Login to your account to continue
                </p>
              </div>

              <div className="grid gap-4">
                <FormField
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
