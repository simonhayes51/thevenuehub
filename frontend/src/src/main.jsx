import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Acts from './pages/Acts.jsx'
import Venues from './pages/Venues.jsx'
import ActDetail from './pages/ActDetail.jsx'
import VenueDetail from './pages/VenueDetail.jsx'
import Join from './pages/Join.jsx'
import Shortlist from './pages/Shortlist.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import './styles.css'
const router = createBrowserRouter([
  { path: '/', element: <Home/> },
  { path: '/acts', element: <Acts/> },
  { path: '/venues', element: <Venues/> },
  { path: '/acts/:id', element: <ActDetail/> },
  { path: '/venues/:id', element: <VenueDetail/> },
  { path: '/join', element: <Join/> },
  { path: '/shortlist', element: <Shortlist/> },
  { path: '/admin', element: <AdminDashboard/> },
])
createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>)