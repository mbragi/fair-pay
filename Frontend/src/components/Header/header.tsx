import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ConnectModal from "../modals/connectModal";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isConnected, address, disconnect } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (address) {
      setModalOpen(false)
    }
  }, [address])

  const getShortAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
        {isConnected || address ? (
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-mono text-sm">
              {getShortAddress(address ?? '')}
            </span>
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
      <ConnectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
};

export default Header;
