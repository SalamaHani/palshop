import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
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
import { useStorefrontMutation } from "@/hooks/useStorefront";
import { CUSTOMER_CREATE } from "@/graphql/auth";
import { CustomerCreateResponse } from "@/types";
import { User, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

type SignupFormProps = {
  setShowRegister: (show: boolean) => void;
};

export default function SignupForm({ setShowRegister }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useStorefrontMutation<CustomerCreateResponse>();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      const response = await mutate({
        query: CUSTOMER_CREATE,
        variables: {
          input: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          },
        },
        endpointType: "storefront"
      });
      if (response.customerCreate.customerUserErrors.length > 0) {
        throw new Error(response.customerCreate.customerUserErrors[0].message);
      }

      toast.success("Account created! You can now sign in with your email.");
      setShowRegister(false); // Switch to login
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-8 py-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-sm text-gray-500">
          Join palshop to track orders and save your favorites
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="John"
                        {...field}
                        className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      className="pl-10 h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        type="password"
                        {...field}
                        className="pl-10 h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all active:scale-[0.98] mt-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Create Account
                <UserPlus className="w-5 h-5" />
              </span>
            )}
          </Button>

          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-px w-8 bg-gray-200" />
              <span>Already a member?</span>
              <div className="h-px w-8 bg-gray-200" />
            </div>
            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className="text-primary font-bold hover:underline"
            >
              Sign in here
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
