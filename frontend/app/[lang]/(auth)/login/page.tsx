import { WalletIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { getDictionary } from "@/lib/dictionaries";
import { toLocale } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  if (!locale) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <WalletIcon className="h-10 w-10 mx-auto" />
          <h1 className="text-2xl font-semibold text-center">{dict.auth.loginTitle}</h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {dict.auth.loginSubtitle}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm
          locale={locale}
          copy={{
            emailLabel: dict.auth.emailLabel,
            emailPlaceholder: dict.auth.emailPlaceholder,
            passwordLabel: dict.auth.passwordLabel,
            passwordPlaceholder: dict.auth.passwordPlaceholder,
            signingIn: dict.auth.signingIn,
            getStarted: dict.auth.getStarted,
            dontHaveAccount: dict.auth.dontHaveAccount,
            signUp: dict.auth.signUp,
          }}
        />
      </CardContent>
    </Card>
  );
}

