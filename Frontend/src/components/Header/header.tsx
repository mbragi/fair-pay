import { useState } from "react";
import { Link } from "react-router-dom";
import ConnectModal from "../modal/connectModal";

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <nav className="flex items-center justify-between py-6 px-4 sm:px-6 lg:px-8 border-b">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-900">
            Fair<span className="text-blue-600">Pay</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Features
          </a>
          <Link
            to="/howitworks"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            How it Works
          </Link>
          <a
            href="#testimonials"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Testimonials
          </a>
        </div>

        {/* Get Started Button */}
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Connect Modal */}
      <ConnectModal open={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
};

export default Header;
