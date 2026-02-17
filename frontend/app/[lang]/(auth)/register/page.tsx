import { UserPlusIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { RegisterForm } from "@/features/auth/components/register-form";
import { getDictionary } from "@/lib/dictionaries";
import { toLocale } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default async function RegisterPage({
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
          <UserPlusIcon className="mx-auto h-10 w-10" />
          <h1 className="text-center text-2xl font-semibold">{dict.auth.registerTitle}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {dict.auth.registerSubtitle}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm
          locale={locale}
          copy={{
            accountCreatedTitle: dict.auth.accountCreatedTitle,
            accountCreatedDescription: dict.auth.accountCreatedDescription,
            firstNameLabel: dict.auth.firstNameLabel,
            firstNamePlaceholder: dict.auth.firstNamePlaceholder,
            lastNameLabel: dict.auth.lastNameLabel,
            lastNamePlaceholder: dict.auth.lastNamePlaceholder,
            emailLabel: dict.auth.emailLabel,
            emailPlaceholder: dict.auth.emailPlaceholder,
            passwordLabel: dict.auth.passwordLabel,
            createPasswordPlaceholder: dict.auth.createPasswordPlaceholder,
            confirmPasswordLabel: dict.auth.confirmPasswordLabel,
            confirmPasswordPlaceholder: dict.auth.confirmPasswordPlaceholder,
            creatingAccount: dict.auth.creatingAccount,
            getStarted: dict.auth.getStarted,
            alreadyHaveAccount: dict.auth.alreadyHaveAccount,
            signIn: dict.auth.signIn,
          }}
        />
      </CardContent>
    </Card>
  );
}

