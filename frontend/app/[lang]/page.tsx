import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/dictionaries";
import { toLocale } from "@/lib/i18n";

export default async function DashboardPage({
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
    <div className="pt-16">
      <h1 className="text-2xl font-semibold">{dict.dashboard.title}</h1>
    </div>
  );
}

