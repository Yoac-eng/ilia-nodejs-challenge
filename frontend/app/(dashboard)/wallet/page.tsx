import { WalletOverview } from "@/features/wallet/components/wallet-overview";
import {
  getServerWalletBalance,
  getServerWalletTransactions,
} from "@/features/wallet/server/wallet-server-api";

export default async function WalletPage() {
  // call the server side functions to get the balance and transactions from the wallet service
  // calls are made in here to avoid needing client-side hydration to fetch (keeps SSR)
  const [balance, transactions] = await Promise.all([
    getServerWalletBalance().catch(() => ({ amount: 0 })),
    getServerWalletTransactions().catch(() => []),
  ]);

  return <WalletOverview initialBalance={balance} initialTransactions={transactions} />;
}

