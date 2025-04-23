"use client";

import joyItLogo from "../assets/logo.svg";
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
import { Button } from "@/components/ui/button";
import { useLoginUser } from "@/utils/api/user-api";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  login: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginUserFormData = z.infer<typeof formSchema>;

const Login = () => {
  const { isLoading, loginUserRequest } = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={joyItBgImage || "/placeholder.svg"}
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gray-600/20 flex items-center justify-center">
          <img
            src={joyItLogo || "/placeholder.svg"}
            className="w-1/2 max-w-xs"
            alt="Joy-IT Logo"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <img
              src={joyItLogo || "/placeholder.svg"}
              className="h-16 mx-auto mb-4"
              alt="Joy-IT Logo"
            />
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Connexion</h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  loginUserRequest as (data: LoginUserFormData) => void
                )}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="exemple@email.com"
                            className="pl-10 bg-gray-50 border-gray-200"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-gray-50 border-gray-200"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-purple hover:bg-secondarypurple text-white py-2 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Connexion en cours...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-purple hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Joy-IT. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
