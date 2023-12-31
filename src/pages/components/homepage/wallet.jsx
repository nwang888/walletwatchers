import { motion } from 'framer-motion';

export default function Wallet({ wallet, index }) {
    function generateBackgroundColor(index) {
      const colors = ["bg-primary-light", "bg-secondary-light", "bg-accent-light"];
      return colors[parseInt(wallet.routing_number) % colors.length];
    }

  // Generate Background Color based on Routing Number
  const backgroundColorClass = generateBackgroundColor(index);

  return (
    <motion.div 
      className={`flex-2 ${backgroundColorClass} rounded-md py-2 px-5 m-2 h-full w-full`}
      whileHover={{ scale: 1.02 }}
      transition={{
          type: "spring",
          duration: 0.3
      }}
    >
      <h2 className="text-xl font-medium">{wallet.account_name}</h2>
      <hr className="py-[1px] my-1 bg-subtext w-full" />
      <h3 className="mt-2">Total Balance</h3>
      <h2 className="font-bold">${wallet.account_balance}</h2>
      <p className="text-right text-sm">{wallet.routing_number}</p>
    </motion.div>
  );
}
