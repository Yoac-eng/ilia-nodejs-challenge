import { RegisterForm } from "@/features/auth/components/register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { UserPlusIcon } from "lucide-react";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <UserPlusIcon className="mx-auto h-10 w-10" />
          <h1 className="text-center text-2xl font-semibold">Create an account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create your wallet in minutes. No credit card required.
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}

