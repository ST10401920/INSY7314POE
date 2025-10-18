import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  role: z.enum(["customer", "employee"])
    .refine(val => val === "customer" || val === "employee", {
      message: "Select a role",
    }),
  username: z.string()
    .min(3, "Username too short")
    .max(30, "Username too long")
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
  identifier: z.string().min(12).max(36), // AccountNum (12) or EmployeeNumber (UUID, up to 36)
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, 
           "Password must contain uppercase, lowercase, number, and special character"),
});



export default function Login() {
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    role: "customer",
    username: "",
    identifier: "",
    password: "",
  } as z.infer<typeof formSchema>,
});


  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // Build payload depending on role
      const payload: any = {
        username: values.username,
        password: values.password,
      };
      if (values.role === "customer") payload.accountNum = values.identifier;
      else payload.employeeNumber = values.identifier;

      const endpoint = values.role === "customer" 
        ? "https://localhost:5400/login" 
        : "https://localhost:5400/employee-login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        // Redirect based on role
        window.location.href = values.role === "customer" ? "/userportal" : "/employeeportal";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your SwiftPay account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Role Selector */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login as</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full p-2 border rounded">
                          <option value="customer">Customer</option>
                          <option value="employee">Employee</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.getValues("role") === "customer" ? "Account Number" : "Employee Number"}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={form.getValues("role") === "customer" ? "12-digit account number" : "Employee UUID"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
                  disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-[#ddb892] hover:underline">
                    Create Account
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
