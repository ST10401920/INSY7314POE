import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  provider: z.string().min(1, "Provider is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientAccountNumber: z.string().min(1, "Account number is required"),
  swiftCode: z
    .string()
    .min(8, "SWIFT code must be at least 8 characters")
    .max(11, "SWIFT code must not exceed 11 characters"),
});

export default function UserPortal() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      currency: "",
      provider: "",
      recipientName: "",
      recipientAccountNumber: "",
      swiftCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
  const payload = {
    amount: parseFloat(values.amount), 
    currency: values.currency,
    provider: values.provider,
    payeeAccount: values.recipientAccountNumber,
    recipientName: values.recipientName,
    swiftCode: values.swiftCode,
  };

  setLoading(true);

  try{
  const token = localStorage.getItem("token"); // assuming JWT is stored
  const res = await fetch("https://localhost:5400/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

    if (res.ok) {
      setStatusMessage(`Transaction successful: ${data.transaction.amount} ${data.transaction.currency} to ${data.transaction.recipientName}`);
      form.reset();
    } else {
      setStatusMessage(`Transaction failed: ${data.message}`);
    }
  } catch (err) {
    setStatusMessage(`Transaction failed: ${err instanceof Error ? err.message : err}`);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>International Money Transfer</CardTitle>
            <CardDescription>
              Send money securely worldwide with SwiftPay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
                            <SelectItem value="ZAR">
                              ZAR - South African Rand
                            </SelectItem>
                            <SelectItem value="AUD">
                              AUD - Australian Dollar
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Provider</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SWIFT">SWIFT</SelectItem>
                            <SelectItem value="SEPA">Paypal</SelectItem>
                            <SelectItem value="WIRE">Apple Pay</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Ebrahim Seedat" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="swiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT Code</FormLabel>
                        <FormControl>
                          <Input placeholder="SWIFT code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ddb892] hover:bg-[#ddb892]/90 text-white mt-6"
                  disabled={loading}>
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </form>
            </Form>

            {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
