
import { Github, Twitter, Linkedin, Mail, Shield, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-600 text-white">
      <div className=" mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-indigo-300 mr-2" />
              <h2 className="text-2xl font-bold text-white">FairPay</h2>
            </div>
            <p className="text-indigo-200 mb-6">
              Securing fair compensation for freelancers and service providers through blockchain-powered escrow smart contracts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">For Employers</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">For Freelancers</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Smart Contracts</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Job Marketplace</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Dispute Resolution</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Community Forum</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Press Kit</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Partners</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-indigo-800">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-indigo-300 text-sm">
                &copy; {currentYear} FairPay. All rights reserved.
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <a href="#" className="text-indigo-300 hover:text-white text-sm mb-2 md:mb-0">
                Terms of Service
              </a>
              <a href="#" className="text-indigo-300 hover:text-white text-sm mb-2 md:mb-0">
                Privacy Policy
              </a>
              <a href="#" className="text-indigo-300 hover:text-white text-sm mb-2 md:mb-0">
                Cookie Policy
              </a>
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-indigo-300 mr-1" />
                <select className="bg-transparent text-indigo-300 text-sm border-none focus:ring-0">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-indigo-400 text-xs">
            FairPay is built on secure blockchain technology. All transactions are transparent and permanently recorded.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;