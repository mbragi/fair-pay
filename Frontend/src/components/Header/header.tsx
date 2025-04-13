import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const Header = () => {
  return (
    <div>
      <nav className="flex items-center justify-between py-6 border-b-2 shadow-lg px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to={"/"} className="text-2xl font-bold text-blue-900">
            Fair<span className="text-blue-600">Pay</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Features
          </a>
          <Link to={"/howitworks"}  className="text-gray-600 hover:text-blue-600 font-medium">
          How it Works
          </Link>
         
          <a
            href="#testimonials"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Testimonials
          </a>
        </div>

        <div className="flex items-center space-x-4">
        <div className="bg-blue-600 text-white px-8 py-3 rounded-lg  transition-all shadow-lg ml-5">
            <ConnectButton.Custom>
              {({ account, openAccountModal, openConnectModal, mounted }) => {
                const connected = mounted && account;

                return (
                  <div>
                    {connected ? (
                      <button
                        onClick={openAccountModal}
                        className="flex items-center"
                      >
                        <span className="text-white font-medium">
                          {account.displayName}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={openConnectModal}
                        className="flex items-center"
                      >
                        <span className="text-white font-medium">
                          Connect Wallet
                        </span>
                      </button>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
