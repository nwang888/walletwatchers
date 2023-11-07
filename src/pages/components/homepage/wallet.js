
import { motion } from 'framer-motion';


export default function Wallet({wallet}) {

    const item = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };


    function generateBackgroundColor() {
        const colors = ["bg-slate-100", "bg-slate-200", "bg-slate-300", "bg-neutral-100", "bg-slate-200", "bg-slate-300"]
        const random = Math.floor(Math.random() * colors.length)
        return colors[random]
    }
    

    return (
        <motion.div 
            className={`flex-2 ${generateBackgroundColor()} rounded-md p-3 m-3 w-[30%]`}
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