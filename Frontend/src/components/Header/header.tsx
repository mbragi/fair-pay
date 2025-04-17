import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ConnectModal from "../modals/connectModal";
import { useAuth } from "../../context/AuthContext";
import AccountDetails from "../AccountDetails";

const Header = () => {
  const { isConnected, address } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (address) setModalOpen(false);
  }, [address]);


  

  return (
    <header className="shadow-md border-b py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        Fair<span className="text-indigo-600">Pay</span>
      </Link>

      <nav className="space-x-6 hidden md:flex">
        <Link to="/features" className="hover:text-blue-600">Features</Link>
        <Link to="/howitworks" className="hover:text-blue-600">How it Works</Link>
      </nav>

      <div className="flex items-center  w-44">
        {isConnected || address ? (
          <AccountDetails />
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get Started
          </button>
        )}
      </div>

      <ConnectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
};

export default Header;