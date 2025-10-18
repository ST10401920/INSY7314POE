import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useState } from "react";

// Mock data for pending payments
const pendingPayments = [
  {
    id: 1,
    senderAccount: "123456789",
    recipientAccount: "987654321",
    recipientName: "John Smith",
    bankName: "Chase Bank",
    amount: 5000,
    currency: "USD",
    swiftCode: "CHASUS33",
    status: "pending",
    verified: false,
  },
  {
    id: 2,
    senderAccount: "456789123",
    recipientAccount: "321654987",
    recipientName: "Maria Garcia",
    bankName: "Deutsche Bank",
    amount: 3500,
    currency: "EUR",
    swiftCode: "DEUTDEFF",
    status: "pending",
    verified: false,
  },
  {
    id: 3,
    senderAccount: "789123456",
    recipientAccount: "654987321",
    recipientName: "James Wilson",
    bankName: "Barclays",
    amount: 7500,
    currency: "GBP",
    swiftCode: "BARCGB22",
    status: "pending",
    verified: false,
  },
];

export default function EmployeePortal() {
  const [payments, setPayments] = useState(pendingPayments);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);

  const handleVerify = (paymentId: number) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId ? { ...payment, verified: true } : payment
      )
    );
    setSelectedPayments([...selectedPayments, paymentId]);
  };

  const handleUnverify = (paymentId: number) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId ? { ...payment, verified: false } : payment
      )
    );
    setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
  };

  const handleSubmitToSwift = () => {
    const verifiedPayments = payments.filter((payment) =>
      selectedPayments.includes(payment.id)
    );
    console.log("Submitting to SWIFT:", verifiedPayments);
    // Add actual SWIFT submission logic here
  };

  // Function to validate SWIFT code format
  const isValidSwiftCode = (code: string) => {
    // SWIFT code format: 4 letters (bank code) + 2 letters (country code) + 2 characters (location code) + optional 3 characters (branch code)
    const swiftFormat = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    return swiftFormat.test(code);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>SWIFT Payment Verification Dashboard</CardTitle>
            <CardDescription>
              Verify account information and SWIFT codes before submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                Transactions Pending SWIFT Verification
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender Account</TableHead>
                  <TableHead>Recipient Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>SWIFT Code</TableHead>
                  <TableHead>Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className={payment.verified ? "bg-green-50" : undefined}
                  >
                    <TableCell>{payment.senderAccount}</TableCell>
                    <TableCell>{payment.recipientAccount}</TableCell>
                    <TableCell>
                      {payment.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>{payment.currency}</TableCell>
                    <TableCell>{payment.swiftCode}</TableCell>
                    <TableCell>
                      {payment.verified ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleUnverify(payment.id)}
                        >
                          Verified ✓
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleVerify(payment.id)}
                        >
                          Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-[#ddb892] hover:bg-[#ddb892]/90 text-white"
                disabled={selectedPayments.length === 0}
                onClick={handleSubmitToSwift}
              >
                Submit Verified Payments to SWIFT
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
