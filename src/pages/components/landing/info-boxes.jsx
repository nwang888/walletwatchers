import { motion } from 'framer-motion';
import InfoBox from './info-box';

export default function InfoBoxes() {

    const delay = 2;
    const stagger = 0.8;

    const data = {
        "header": ["Connect your accounts", "Track your spending", "Budget your expenses"],
        "text": [
            "Easily link and view the balances of each of your accounts at a glance. Delve deeper into individual account expenses for meticulous financial tracking and improved budget control. ", 
            "View all your transactions across different accounts in one place and filter them as you need. Experience the ease of tracking your spending and take the guesswork out of managing your finances.", 
            "Set customized budgets for various spending categories to keep your expenses in check. Prevent overspending and make budgeting simple, personal, and efficient."
        ],
        "image": ["images/wallets.png", "images/transactions.png", "images/budgets.png"]
    }

    return (
        <motion.div
                className="flex flex-row justify-center items-center"
                initial={{opacity: 0 }}
                animate={{opacity: 1 }}

                transition={{ duration: 0.4, delay: delay }}
              >

                {
                    data.header.map((header, index) => (
                        <InfoBox
                            key={index}
                            header={header}
                            text={data.text[index]}
                            image={data.image[index]}
                            delay={delay + stagger * index}
                        />
                    ))
                }



        </motion.div>
    )
}