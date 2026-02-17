import { notFound } from "next/navigation";

import { WalletOverview } from "@/features/wallet/components/wallet-overview";
import {
  getServerWalletBalance,
  getServerWalletTransactions,
} from "@/features/wallet/server/wallet-server-api";
import { getDictionary } from "@/lib/dictionaries";
import { toLocale } from "@/lib/i18n";

export default async function WalletPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  if (!locale) {
    notFound();
  }

  const [dict, balance, transactions] = await Promise.all([
    getDictionary(locale),
    getServerWalletBalance().catch(() => ({ amount: 0 })),
    getServerWalletTransactions().catch(() => []),
  ]);

  return (
    <WalletOverview
      initialBalance={balance}
      initialTransactions={transactions}
      copy={dict.wallet}
    />
  );
}

