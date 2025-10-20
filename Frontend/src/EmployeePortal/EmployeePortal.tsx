import { useEffect, useState } from "react";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const DialogContent = ({ children }: any) => (
  <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
    {children}
  </div>
);

const DialogHeader = ({ children }: any) => <div className="mb-4">{children}</div>;

const DialogTitle = ({ children }: any) => (
  <h3 className="text-lg font-medium">{children}</h3>
);

const DialogDescription = ({ children }: any) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);

const DialogFooter = ({ children }: any) => (
  <div className="mt-4 flex justify-end gap-2">{children}</div>
);

interface Transaction {
  _id: string;
  customerAccount: string;
  payeeAccount: string;
  recipientName: string;
  amount: number;
  currency: string;
  swiftCode: string;
  status: string;
  createdAt: string;
}

export default function EmployeePortal() {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Transaction | null>(
    null
  );
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://localhost:5400/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data: Transaction[] = await response.json();
        setPayments(data);
      } catch (err) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleVerify = (payment: Transaction) => {
    const swiftRegex = /^[A-Z0-9]{8,11}$/;
    if (!swiftRegex.test(payment.swiftCode)) {
      alert("Invalid SWIFT code format.");
      return;
    }

    setTimeout(() => {
      setSelectedPayment(payment);
      setVerifyDialogOpen(true);
    }, 400);
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:5400/transactions/${selectedPayment._id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve transaction");
      }

      setPayments((prev) =>
        prev.map((p) =>
          p._id === selectedPayment._id
            ? { ...p, status: "APPROVED" }
            : p
        )
      );

      setApproveDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error approving transaction");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Employee Transaction Dashboard</CardTitle>
            <CardDescription>
              Verify and approve pending SWIFT transactions
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableCaption>All Customer Transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Account</TableHead>
                  <TableHead>Payee Account</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>SWIFT Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.customerAccount}</TableCell>
                    <TableCell>{payment.payeeAccount}</TableCell>
                    <TableCell>{payment.recipientName}</TableCell>
                    <TableCell>
                      {payment.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>{payment.currency}</TableCell>
                    <TableCell>{payment.swiftCode}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>
                      {payment.status === "PENDING" ? (
                        <Button
                          size="sm"
                          className="bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
                          onClick={() => handleVerify(payment)}
                        >
                          Verify SWIFT
                        </Button>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Approved ✓
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Footer />

      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify SWIFT Code</DialogTitle>
            <DialogDescription>
              SWIFT Code: <strong>{selectedPayment?.swiftCode}</strong> <br />
              Please confirm that this SWIFT code is valid and corresponds to
              the intended recipient bank. Once verified, you can proceed to
              approve the transaction.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setVerifyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
              onClick={() => {
                setVerifyDialogOpen(false);
                setApproveDialogOpen(true);
              }}
            >
              Proceed to Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Final Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to <strong>approve</strong> this
              transaction? <br />
              <span className="text-red-600 font-medium">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
            >
              Confirm Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
