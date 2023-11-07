
export default function Wallet({wallet}) {


    function generateBackgroundColor() {
        const colors = ["bg-slate-100", "bg-slate-200", "bg-slate-300", "bg-neutral-100", "bg-slate-200", "bg-slate-300"]
        const random = Math.floor(Math.random() * colors.length)
        return colors[random]
    }
    

    return (
        <div className={`flex-2 ${generateBackgroundColor()} rounded-md p-3 m-3 w-[30%]`}>
            <h2 className="text-xl">{wallet.account_name}</h2>
            <hr className="bg-black w-full" />


            <h3>Total Balance</h3>
            <h2 className="font-bold">${wallet.account_balance}</h2>


            <p className="text-right">{wallet.routing_number}</p>
        </div>
    );
}