import joyItLogo from "../assets/logo.png";
import joyItBgImage from "../assets/bg-login.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useLoginUser } from "@/utils/api/user-api";
type Props = {};

const formSchema = z.object({
  login: z.string().email().min(1, "email is required"),
  password: z.string().min(6, "password is required"),
});

export type LoginUserFormData = z.infer<typeof formSchema>;

const Login = ({}: Props) => {
  const { isLoading, loginUserRequest } = useLoginUser();

  const form = useForm<LoginUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-row flex-nowrap h-screen w-screen overflow-hidden">
      <div className="flex-1 items-center justify-center relative h-full w-1/2 hidden md:flex">
        <img
          src={joyItBgImage}
          className="w-full h-full object-cover top-0 right-0 absolute"
        />
        <div className="h-full w-full bg-black opacity-40 absolute top-0"></div>
        <img src={joyItLogo} className="w-1/2 z-30" />
      </div>
      <div className="flex-1 flex flex-col justify-center bg-secondary">
        <div className="container p-20 flex flex-col gap-10 justify-center">
          <h1 className="text-4xl font-semibold text-overlay ">Se connecter</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                loginUserRequest as (data: LoginUserFormData) => void
              )}
              className="flex flex-col gap-10 w-full"
            >
              <FormField
                control={form.control}
                name={"login"}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@email.com"
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"password"}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button className="bg-overlay py-2  bg-purple rounded-lg text-white font-bold text-xl outline-none">
                  Se connecter
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
