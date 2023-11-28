import { useEffect, useState } from "react";
import TransactionsTable from "./transactions-table";

export default function TransactionsPage({ walletId }) {
	return <TransactionsTable walletId={walletId} />;
}
