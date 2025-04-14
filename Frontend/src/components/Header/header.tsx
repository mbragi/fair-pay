import { Link } from "react-router-dom";
import { useState } from "react";
import { AccountAddress, AccountAvatar, AccountProvider } from "thirdweb/react";
import ConnectModal from "../modals/connectModal";
import { useAuth } from "../../context/AuthContext";
import { client } from '../../client';
import { shortenAddress } from "thirdweb/utils";

const Header = () => {
  const { isConnected, address, disconnect } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="shadow-md border-b py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        Fair<span className="text-indigo-600">Pay</span>
      </Link>
      <nav className="space-x-6 hidden md:flex">
        <a href="#features" className="hover:text-blue-600">Features</a>
        <Link to="/howitworks" className="hover:text-blue-600">How it Works</Link>
        <a href="#testimonials" className="hover:text-blue-600">Testimonials</a>
      </nav>
      <div className="flex items-center">
        {isConnected ? (
          <div className="flex items-center space-x-2">
            <AccountProvider
              address={address as string} client={client}            >

            <AccountAvatar
              resolverAddress={address}
              loadingComponent={<span>Loading...</span>}
            />
            <AccountAddress
                formatFn={ shortenAddress}
            />
            </AccountProvider>
            <button
              onClick={disconnect}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get Started
          </button>
        )}
      </div>
      <ConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
};

export default Header;
