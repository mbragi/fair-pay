import LandingPage from "./page/landing-page/landing-page";
import HowItWorksSection from "./components/landing-page-component/howitworks-section";
import FeaturesPage from "./components/landing-page-component/features-page";
import "@rainbow-me/rainbowkit/styles.css";
import ClientPage from "./page/client-page/client-page";
import ServiceProviderDashboard from "./page/employees-page/ServiceProviderDashboard";
import FaucetPage from "./page/faucet-page/faucet-page";
import { ThirdwebProvider } from "thirdweb/react"
import { AuthProvider } from "./context/AuthContext";
// set up sonner 
import { Toaster } from "sonner";

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Root from "./RootPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<LandingPage />} />
        <Route path="/howitworks" element={<HowItWorksSection />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/clientpage" element={<ClientPage />} />
        <Route path="/providerspage" element={<ServiceProviderDashboard />} />
        <Route path="/faucet" element={<FaucetPage />} />
      </Route>
    )
  )


  return (

    <ThirdwebProvider >
      <AuthProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="dark"
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThirdwebProvider>
  );
}


export default App
