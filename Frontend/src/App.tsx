import LandingPage from "./page/landing-page/landing-page";
import HowItWorksSection from "./components/landing-page-component/howitworks-section";
import "@rainbow-me/rainbowkit/styles.css";
import ClientPage from "./page/client-page/client-page";
import ServiceProviderDashboard from "./page/employees-page/ServiceProviderDashboard";


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
    // <WagmiProvider config={config}>    <ThirdwebProvider>

      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
    // </WagmiProvider>
  );
}


export default App
