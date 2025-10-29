export default function Navbar(){
  return(
    <nav className='fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md rounded-2xl shadow-md flex justify-between items-center px-8 py-3 w-[90%] max-w-5xl'>
      <h1 className='font-display text-2xl font-extrabold text-ink'>VenueHub</h1>
      <ul className='flex gap-6 font-display text-ink'>
        <li><a href='#' className='hover:text-pink'>Home</a></li>
        <li><a href='#' className='hover:text-aqua'>Categories</a></li>
        <li><a href='#' className='hover:text-orange'>About</a></li>
      </ul>
      <button className='btn btn-primary text-sm'>Post Your Act</button>
    </nav>
  )
}
