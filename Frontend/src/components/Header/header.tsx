import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ConnectModal from "../modals/connectModal";
import { useAuth } from "../../context/AuthContext";
import AccountDetails from "../AccountDetails";
import Button from "../common/Button";

const Header = () => {
  const { isConnected, address } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (address) setModalOpen(false);
  }, [address]);

  return (
    <div className=" bg-white  fixed inset-x-0 z-50 md:h-20  py-4 px-6 shadow-md border-b">
      <header className=" flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          Fair<span className="text-indigo-600">Pay</span>
        </Link>

        <nav className="space-x-6 hidden md:flex">
          <Link to="/features" className="hover:text-blue-600">
            Features
          </Link>
          <Link to="/howitworks" className="hover:text-blue-600">
            How it Works
          </Link>
          <Link to="/faucet" className="hover:text-blue-600">
            Faucet
          </Link>
        </nav>

        <div className="flex items-center  ">
          {isConnected || address ? (
            <div className="">
              <AccountDetails />
            </div>
          ) : (
            <Button
              onClick={() => setModalOpen(true)}
              variant="primary"
            >
              Get Started
            </Button>
          )}
        </div>

        <ConnectModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </header>
    </div>
  );
};

export default Header;
