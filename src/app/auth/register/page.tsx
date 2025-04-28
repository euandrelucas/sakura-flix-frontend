"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Define the form validation schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 20;
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 20;
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 20;
    // Number check
    if (/[0-9]/.test(password)) strength += 20;
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    return strength;
  };

  // Handle password input change to update strength indicator
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  // Get strength color and label
  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  // Handle form submission
  async function onSubmit(data: RegisterFormValues) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating account");
      }

      // Show success toast
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your credentials.",
        variant: "success",
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error: any) {
      console.error(error);

      // Show error toast
      toast({
        title: "Registration failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-background/90 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
              SakuraFlix
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Join SakuraFlix</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account to access thousands of anime shows and movies
          </p>
        </div>

        {/* Registration Card */}
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handlePasswordChange(e);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>

                      {/* Password Strength Indicator */}
                      {field.value && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Password strength:</span>
                            <span
                              className={`font-medium ${
                                passwordStrength < 40
                                  ? "text-red-500"
                                  : passwordStrength < 70
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {getStrengthLabel()}
                            </span>
                          </div>
                          <Progress
                            value={passwordStrength}
                            className="h-1"
                            indicatorClassName={getStrengthColor()}
                          />

                          <div className="mt-2 text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              <span>Password must:</span>
                            </div>
                            <ul className="space-y-1 pl-5 list-disc">
                              <li
                                className={
                                  /^.{8,}$/.test(field.value)
                                    ? "text-green-500"
                                    : ""
                                }
                              >
                                Be at least 8 characters long
                              </li>
                              <li
                                className={
                                  /[A-Z]/.test(field.value)
                                    ? "text-green-500"
                                    : ""
                                }
                              >
                                Include at least one uppercase letter
                              </li>
                              <li
                                className={
                                  /[a-z]/.test(field.value)
                                    ? "text-green-500"
                                    : ""
                                }
                              >
                                Include at least one lowercase letter
                              </li>
                              <li
                                className={
                                  /[0-9]/.test(field.value)
                                    ? "text-green-500"
                                    : ""
                                }
                              >
                                Include at least one number
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms and Conditions */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border bg-muted/40">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-primary hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" className="w-full">
                <Image
                  src="/colorful-search-bar.png"
                  alt="Google"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Image
                  src="/facebook-logo-display.png"
                  alt="Facebook"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Facebook
              </Button>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Anime-themed decoration */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Join thousands of anime fans on SakuraFlix
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-150"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
