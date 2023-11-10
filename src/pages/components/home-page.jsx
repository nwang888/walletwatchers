import { useEffect, useState } from "react";
import Wallets from "./homepage/wallets";
import TransactionsTable from "./transactions-table";

export default function HomePage({ setPageNum, setWalletId }) {
	const [accountData, setAccountData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getData = async () => {
			const response = await fetch("/api/account");
			const payload = await response.json();
			setAccountData(payload);
			setIsLoading(false);
		};

		getData();
	}, []);

	if (isLoading) {
		return <div>Fetching Data from DB...</div>;
	}

	return (
		<>
			<div className="flex my-5">
				<div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
					<h1 className="text-xl">Wallets</h1>
					<Wallets
						accountData={accountData}
						setPageNum={setPageNum}
						setWalletId={setWalletId}
					/>
				</div>
				<div className="w-1/3 p-3 bg-slate-50 rounded-md">
					<h1 className="text-xl">Budget</h1>

					<p>insert budget chart here</p>
				</div>
			</div>

			<div className="flex">
				<div className="w-2/3 mr-5 p-3 bg-slate-50 rounded-md">
					<h1 className="text-xl">Transactions</h1>
					<TransactionsTable />
				</div>
				<div className="w-1/3 p-3 bg-slate-50 rounded-md">
					<h1 className="text-xl">Placeholder</h1>

					<p>insert something here</p>
				</div>
			</div>
		</>
	);
}
