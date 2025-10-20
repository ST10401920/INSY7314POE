"use client";

import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  accountNum?: string;
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setRole(decoded.role || null);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Globe className="h-8 w-8 text-[#ddb892]" />
            <span className="text-xl font-bold text-foreground">SwiftPay</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8"></div>

          <div className="hidden md:flex items-center space-x-4">
            {role === "employee" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/employeeportal")}
              >
                Staff Portal
              </Button>
            )}
            {role === "customer" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/maketransaction")}
              >
                Make a Transaction
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => (window.location.href = "/login")}
              className="bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
            >
              Login
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="flex flex-col space-y-2 pt-4">
              {role === "employee" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.href = "/employeeportal")}
                >
                  Staff Portal
                </Button>
              )}
              {role === "customer" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.href = "/maketransaction")}
                >
                  Make a Transaction
                </Button>
              )}
              <Button
                size="sm"
                className="bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
