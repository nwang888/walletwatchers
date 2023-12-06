import { motion } from 'framer-motion';

export default function InfoBox({ header, text, image, delay }) {

    return (
        <motion.div
            className='flex-1 m-2 w-full h-[45vh] bg-slate-50 rounded-lg'

            initial={{opacity: 0 }}
            animate={{opacity: 1 }}

            transition={{ duration: 0.4, delay: delay }}
        >
            <img className='w-[90%] m-auto mt-3 rounded-md' src={image} />

            <p className='font-bold text-center w-[90%] m-auto mt-3'>{header}</p>
            <p className='text-center w-[90%] m-auto mt-1'>{text}</p>

        </motion.div>
    )
    
}