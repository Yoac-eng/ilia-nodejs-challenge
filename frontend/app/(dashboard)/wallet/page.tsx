import { WalletOverview } from "@/features/transactions/components/wallet-overview";
import {
  getServerWalletBalance,
  getServerWalletTransactions,
} from "@/features/transactions/server/wallet-server-api";

export default async function WalletPage() {
  const [balance, transactions] = await Promise.all([
    getServerWalletBalance().catch(() => ({ amount: 0 })),
    getServerWalletTransactions().catch(() => []),
  ]);

  return <WalletOverview initialBalance={balance} initialTransactions={transactions} />;
}

