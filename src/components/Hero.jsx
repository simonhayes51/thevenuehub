import { motion } from 'framer-motion'

export default function Hero(){
  return(
    <section className='pt-28 text-center'>
      <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className='text-5xl md:text-7xl font-display font-extrabold gradient-text'>
        Book the Future of Entertainment
      </motion.h1>
      <p className='mt-6 text-lg max-w-2xl mx-auto text-sub'>
        Discover the UK's most creative acts, venues & event pros.
      </p>
      <div className='mt-8 flex justify-center gap-4'>
        <button className='btn btn-primary'>Browse Acts</button>
        <button className='btn border-2 border-pink text-pink hover:bg-pink hover:text-white transition'>Join as Provider</button>
      </div>
    </section>
  )
}
