import { motion } from 'framer-motion';
import InfoBox from './info-box';

export default function InfoBoxes() {

    const delay = 3;

    return (
        <motion.div
                className="flex flex-row justify-center items-center"
                initial={{opacity: 0 }}
                animate={{opacity: 1 }}

                transition={{ duration: 0.4, delay: 3.5 }}
              >

                <InfoBox 
                    header="Connect your accounts"
                    text="Easily link and view the balances of each of your accounts at a glance. Delve deeper into individual account expenses for meticulous financial tracking and improved budget control. "
                    image="images/wallets.png"
                    delay={delay + 0}
                
                />

                <InfoBox 
                    header="Track your spending"
                    text="View all your transactions across different accounts in one place and filter them as you need. Experience the ease of tracking your spending and take the guesswork out of managing your finances."
                    image="images/transactions.png"
                    delay={delay + 1.3}
                
                />


                <InfoBox 
                    header="Budget your expenses"
                    text="Set customized budgets for various spending categories to keep your expenses in check. Prevent overspending and make budgeting simple, personal, and efficient."
                    image="images/budgets.png"
                    delay={delay + 2.2}
                
                />



        </motion.div>
    )
}