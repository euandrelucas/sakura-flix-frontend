/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  const user = session?.user

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (!result?.ok) {
        throw new Error(result?.error || "Failed to sign in")
      }

      toast({
        title: "Login successful!",
        description: "Welcome back to SakuraFlix",
        variant: "success",
      })

      return true
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      })

      return false
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => {
    try {
      // Register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Registration failed")
      }

      // Log the user in after successful registration
      const loginResult = await login({
        email: userData.email,
        password: userData.password,
      })

      if (loginResult) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to SakuraFlix",
          variant: "success",
        })

        return true
      }

      return false
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      })

      return false
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        variant: "info",
      })

      router.push("/auth/login")

      return true
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }

  return {
    user,
    session,
    status,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateSession: update,
  }
}
