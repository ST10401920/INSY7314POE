import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
  Users,
  FileText,
  CreditCard,
  Eye,
  FileCheck,
  UserPlus,
  LogIn,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "SWIFT Integration",
    description:
      "Direct integration with SWIFT network for secure international transfers to over 200 countries worldwide.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description:
      "Advanced encryption and multi-factor authentication protect your sensitive financial information.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description:
      "Process payments instantly with real-time status updates and confirmation notifications.",
  },
  {
    icon: CreditCard,
    title: "Multi-Currency Support",
    description:
      "Support for major international currencies with competitive exchange rates and transparent fees.",
  },
  {
    icon: Users,
    title: "Staff Portal",
    description:
      "Dedicated portal for pre-registered staff to monitor and manage customer payment transactions.",
  },
  {
    icon: FileText,
    title: "Compliance Ready",
    description:
      "Built-in compliance features for international banking regulations and audit requirements.",
  },
];

const securityFeatures = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "All data is encrypted using AES-256 encryption standards",
  },
  {
    icon: Lock,
    title: "Multi-Factor Authentication",
    description: "Additional security layers with SMS and email verification",
  },
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description: "24/7 fraud detection and suspicious activity monitoring",
  },
  {
    icon: FileCheck,
    title: "Regulatory Compliance",
    description: "Fully compliant with international banking regulations",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge
                variant="secondary"
                className="mb-6 inline-flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {"Secure International Payments"}
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                International Payments
                <span className="text-[#ddb892] block">Made Simple</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
                Send secure international payments with SWIFT integration. Our
                platform provides bank-grade security for all your cross-border
                transactions with real-time processing and competitive exchange
                rates.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
                  onClick={() => (window.location.href = "/register")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#ddb892]" />
                  Bank-grade security
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#ddb892]" />
                  Real-time processing
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Everything you need for international payments
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                Our comprehensive platform provides all the tools and security
                features needed for seamless cross-border transactions.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-accent/50 transition-colors"
                >
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ddb892]/10">
                      <feature.icon className="h-6 w-6 text-[#ddb892]" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-6">
                Security First
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Your security is our priority
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                We implement the highest security standards to protect your
                sensitive financial information and ensure safe international
                transactions.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ddb892]/10">
                        <feature.icon className="h-5 w-5 text-[#ddb892]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  Ready to start sending international payments?
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                  Join thousands of customers who trust us with their
                  international transactions.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <Card className="border-border/50 hover:border-accent/50 transition-colors">
                  <CardContent className="p-8 text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-[#ddb892] mb-4" />
                    <h3 className="text-xl font-semibold mb-4">New Customer</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Register for a new account to start making secure
                      international payments. Quick setup with bank-grade
                      security.
                    </p>
                    <Button
                      onClick={() => (window.location.href = "/register")}
                      className="w-full bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
                    >
                      Register Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-accent/50 transition-colors">
                  <CardContent className="p-8 text-center">
                    <LogIn className="mx-auto h-12 w-12 text-[#ddb892] mb-4" />
                    <h3 className="text-xl font-semibold mb-4">
                      Existing Customer
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Access your account to manage payments, view transaction
                      history, and send new international transfers.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/login")}
                      className="w-full bg-transparent"
                    >
                      Customer Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
