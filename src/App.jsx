import {createBrowserRouter, createRoutesFromElements, RouterProvider ,Route} from 'react-router-dom';

//Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Investment from './pages/Investment';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';

//Layouts
import BaseLayout from './layouts/BaseLayout';
import GuestLayout from './layouts/GuestLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

//Auth Pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';


//Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import Investments from './pages/Admin/Investments';
import Transactions from './pages/Admin/Transactions';
import Users from './pages/Admin/Users';
import Plans from './pages/Admin/Plans';
import PaymentOptions from './pages/Admin/PaymentOptions';
import FaqManager from './pages/Admin/FaqManager';
import AdminSettings from './pages/Admin/AdminSettings';
import CopyTrade from './pages/Admin/CopyTrade';
import AdminCopytradeInvestments from './pages/Admin/CopytradeInvestments';

//Investors pages
import InvestorDashboard from './pages/Investors/Dashboard';
import InvestorInvestments from './pages/Investors/Investments'
import InvestorTransactions from './pages/Investors/Transactions'
import Deposit from './pages/Investors/Deposit';
import Withdrawal from './pages/Investors/Withdrawal';
import InvestorSettings from './pages/Investors/Settings';
import CopyTradeInvestments from './pages/Investors/CopytradeInvestments';


//Others
import NotFound from './pages/NotFound';
import Error from './components/Error';
import { requireAuth } from './utils/protect';



function App() {

  
  const router = createBrowserRouter(createRoutesFromElements(
    <>

      <Route path='/' element={<BaseLayout />} errorElement={<Error />}>
        <Route index element={<Home />}></Route>
        <Route path='/about_us' element={<About />}></Route>
        <Route path='/services' element={<Services />}></Route>
        <Route path='/investment' element={<Investment />}></Route>
        <Route path='/contact_us' element={<Contact />}></Route>
        <Route path='FAQs' element={<FAQs />}></Route>
      </Route>

      <Route path='/users' element={<GuestLayout />}>
        <Route path='register' element={<Register />}></Route>
        <Route path='login' element={<Login />}></Route>
      </Route>


      <Route path='/manage' element={<AuthenticatedLayout />} errorElement={<Error />}>
        {/* Admin Related Routes */}
        <Route path='admin' loader={async({ request }) => await requireAuth(request, 'admin')}>
          <Route path='dashboard' element={<Dashboard />}></Route>
          <Route path='investments' element={<Investments />}></Route>
          <Route path='transactions' element={<Transactions />}></Route>
          <Route path='users' element={<Users />}></Route>
          <Route path='plans' element={<Plans />}></Route>
          <Route path='payment_options' element={<PaymentOptions />}></Route>
          <Route path='manage_faq' element={<FaqManager />}></Route>
          <Route path='settings' element={<AdminSettings />}></Route>
          <Route path='copy_trade' element={<CopyTrade />}></Route>
          <Route path='copy_trade_investments' element={<AdminCopytradeInvestments />}></Route>
        </Route>

        {/* Investor Related Routes */}
         <Route path='investor' loader={({ request }) => requireAuth(request, 'user')}>
          <Route path='dashboard' element={<InvestorDashboard />}></Route>
          <Route path='investments' element={<InvestorInvestments />}></Route>
          <Route path='copy_trades' element={<CopyTradeInvestments />}></Route>
          <Route path='transactions' element={<InvestorTransactions />}></Route>
          <Route path='deposit' element={<Deposit/>}></Route>
          <Route path='withdrawal' element={<Withdrawal/>}></Route>
          <Route path='settings' element={<InvestorSettings/>}></Route>
        </Route>
       
      
      </Route>
      <Route path="*" element={<NotFound />} />

    </>
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
