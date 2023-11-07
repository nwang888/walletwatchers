
import { motion } from 'framer-motion';

const item = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};


export default function Wallet({wallet}) {

    function generateBackgroundColor(routing_number) {
        const colors = ["bg-slate-100", "bg-slate-200", "bg-slate-300", "bg-neutral-100", "bg-slate-200", "bg-slate-300"]
        return colors[routing_number % 6]
    }
    

    return (
        <motion.div 
            className={`flex-2 ${generateBackgroundColor(wallet.routing_number)} rounded-md pt-2 px-5 m-2 h-full w-full`}
            variant= {item}
        >
            <h2 className="text-xl">{wallet.account_name}</h2>

            <hr className="py-[1px] my-1 bg-black w-full" />


            <h3 className="mt-2">Total Balance</h3>
            <h2 className="font-bold">${wallet.account_balance}</h2>


            <p className="text-right">{wallet.routing_number}</p>
        </motion.div>
    );
}