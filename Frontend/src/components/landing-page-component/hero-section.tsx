import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 h-full md:h-screen ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-10 font-mont">
        <div className="h-screen pt-12 md:pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full pb-24">
            <div className=''>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
                Secure Escrow Payments
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Work with confidence. <br />
                <span className="text-blue-600">Get paid</span> with certainty.
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                FairPay secures your work agreements with smart escrow that protects both sides. Funds are released only when work is completed, guaranteeing payments for providers and quality for clients.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to={"/providerspage"} className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 shadow-lg flex items-center justify-center transition duration-300">
                  I'm a Service Provider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to={"/clientpage"} className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 flex items-center justify-center transition duration-300">
                  I'm a Client
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Secure Escrow</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Transparent Contracts</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Fair Dispute Resolution</p>
                </div>
              </div>
            </div>
            <div className='hidden md:block rounded-full overflow-hidden'>
                <img src="/6168236.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;