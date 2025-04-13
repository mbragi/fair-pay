import LandingPage from "./page/landing-page/landing-page";
import HowItWorksSection from "./components/landing-page-component/howitworks-section";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import ClientPage from "./page/client-page/client-page";
import ServiceProviderDashboard from "./page/employees-page/ServiceProviderDashboard";

import {baseSepolia } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



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
          <Route path="/howitworks" element={<HowItWorksSection/>}/>
          <Route path="/clientpage" element={<ClientPage/>}/>
          <Route path="/providerspage" element={<ServiceProviderDashboard/>}/>
      </Route>
    )
  )

  const queryClient = new QueryClient();
  return (
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
  );
}


export default App
