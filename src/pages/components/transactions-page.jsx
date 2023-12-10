import { useEffect, useState } from "react";
import TransactionsTable from "./transactions-table";
import Histogram from "./transactions/histogram"

export default function TransactionsPage({ walletId }) {
	return (
		<div>
			<Histogram />
			<TransactionsTable walletId={walletId} />
		</div>
	)
}
