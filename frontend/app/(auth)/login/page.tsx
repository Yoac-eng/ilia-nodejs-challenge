import { LoginForm } from "@/features/auth/components/login-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { WalletIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <WalletIcon className="h-10 w-10 mx-auto" />
          <h1 className="text-2xl font-semibold text-center">Sign in with email</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Manage your wallet with ease, transactions made easy. For free.
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}

