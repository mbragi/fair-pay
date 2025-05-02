import React, { useState } from 'react';
import { 
  Handshake, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
    ChevronRight,
  Wallet
} from 'lucide-react';
import Button from "../common/Button";

const HowItWorksSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');
  
  return (
    <div id="how-it-works" className="bg-gradient-to-r from-indigo-50 to-blue-50 py-24">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How FairPay Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform creates a secure environment for work agreements with built-in payment protection for both parties.
          </p>
        </div>
        
        {/* Tab selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('client')}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'client' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              I'm a Client
            </button>
            <button
              onClick={() => setActiveTab('provider')}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'provider' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              I'm a Service Provider
            </button>
          </div>
        </div>
        
        {/* Process steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2 z-0"></div>
          
          {activeTab === 'client' ? (
            // Client flow
            <div className="space-y-12 relative z-10">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right order-2 md:order-1">
                  <div className="inline-flex items-center mb-2 text-blue-600">
                    <span className="font-medium">STEP 1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Create a Contract</h3>
                  <p className="mt-3 text-gray-600">
                    Define your project requirements, deliverables, timeline, and payment terms. 
                    Our smart contract templates make it easy to set up clear expectations.
                  </p>
                  <div className="mt-4 flex md:justify-end">
                    <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                      <FileText className="w-5 h-5 mr-2" /> 
                      Customizable templates available
                    </span>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start order-1 md:order-2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-50 rounded-full z-0"></div>
                    <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100 z-10 max-w-sm">
                      <div className="text-lg font-semibold mb-3">New Contract</div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                          <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">Website Redesign</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                          <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">500 USDC</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                          <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">May 15, 2025</div>
                        </div>
                        <Button
                          variant="primary"
                          fullWidth
                        >
                          Fund Escrow & Create Contract
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center md:justify-end">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-50 rounded-full z-0"></div>
                    <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100 z-10 max-w-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold">Secured Funds</div>
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <Wallet className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <div className="text-sm text-green-800">Funds in Escrow</div>
                            <div className="font-bold text-green-900">500 USDC</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Your payment is secured in escrow and will only be released when you approve the completed work.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="inline-flex items-center mb-2 text-blue-600">
                    <span className="font-medium">STEP 2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Secure Funds in Escrow</h3>
                  <p className="mt-3 text-gray-600">
                    Deposit the agreed payment amount into our secure escrow. 
                    Your funds are locked and protected until you approve the final deliverables.
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                      <Shield className="w-5 h-5 mr-2" /> 
                      100% payment protection
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right order-2 md:order-1">
                  <div className="inline-flex items-center mb-2 text-blue-600">
                    <span className="font-medium">STEP 3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Review & Approve Work</h3>
                  <p className="mt-3 text-gray-600">
                    Once the provider completes the work, review the deliverables against your 
                    contract requirements. Approve to automatically release payment.
                  </p>
                  <div className="mt-4 flex md:justify-end">
                    <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                      <CheckCircle className="w-5 h-5 mr-2" /> 
                      Request revisions if needed
                    </span>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start order-1 md:order-2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-50 rounded-full z-0"></div>
                    <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100 z-10 max-w-sm">
                      <div className="text-lg font-semibold mb-3">Delivery Confirmation</div>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                        <div className="text-sm text-blue-800 mb-1">Project Deliverables</div>
                        <div className="text-blue-900">Website Redesign Files</div>
                        <div className="mt-2 text-xs text-blue-700">Delivered: April 11, 2025</div>
                      </div>
                      <div className="space-y-3">
                        <Button
                          variant="success"
                          fullWidth
                        >
                          Approve & Release Payment
                        </Button>
                        <button className="w-full bg-white text-gray-700 border border-gray-300 py-2 rounded-md font-medium hover:bg-gray-50 transition duration-300">
                          Request Revisions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Optional step */}
              <div className="pt-6">
                <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-100 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-semibold text-amber-800">If Dispute Arises (Optional)</h3>
                  </div>
                  <p className="text-amber-700 mb-4">
                    In case of disagreement, initiate our dispute resolution process. 
                    Funds remain secured in escrow while our community-driven system ensures a fair outcome.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-1">1. Submit Evidence</div>
                      <div className="text-xs text-gray-600">Both parties provide documentation</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-1">2. Review Process</div>
                      <div className="text-xs text-gray-600">Community panel evaluates case</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-1">3. Resolution</div>
                      <div className="text-xs text-gray-600">Fair outcome implemented</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Provider flow
            <div className="space-y-12 relative z-10">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right order-2 md:order-1">
                  <div className="inline-flex items-center mb-2 text-blue-600">
                    <span className="font-medium">STEP 1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Review & Accept Contract</h3>
                  <p className="mt-3 text-gray-600">
                    Review the client's project details, requirements, timeline, and payment terms. 
                    Accept the contract once you're comfortable with all conditions.
                  </p>
                  <div className="mt-4 flex md:justify-end">
                    <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                      <FileText className="w-5 h-5 mr-2" /> 
                      Request modifications if needed
                    </span>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start order-1 md:order-2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-50 rounded-full z-0"></div>
                    <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100 z-10 max-w-sm">
                      <div className="text-lg font-semibold mb-3">Contract Offer</div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Project Details</div>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                            <div className="font-medium">Website Redesign</div>
                            <div className="text-gray-600 mt-1">Complete redesign of company website with 5 pages, mobile responsive, and brand guidelines implementation.</div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-700">Payment</div>
                            <div className="font-medium text-blue-600">500 USDC</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">Due Date</div>
                            <div>May 15, 2025</div>
                          </div>
                        </div>
                        <div className="pt-2 flex gap-2">
                          <button className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
                            Accept
                          </button>
                          <button className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-md font-medium hover:bg-gray-50 transition duration-300">
                            Negotiate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center md:justify-end">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-50 rounded-full z-0"></div>
                    <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100 z-10 max-w-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold">Work Progress</div>
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-600">Homepage design completed</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-600">About page completed</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <Clock className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-600">Service pages in progress</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="inline-flex items-center mb-2 text-blue-600">
                    <span className="font-medium">STEP 2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Complete the Work</h3>
                  <p className="mt-3 text-gray-600">
                    Work on the project knowing your payment is already secured in escrow. 
                    Update progress to keep the client informed along the way.
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                      <Shield className="w-5 h-5 mr-2" /> 
                      Payment guaranteed for completed work
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right order-2 md:order-1">
                  <div className="inline-flex items-center mb-2 text-blue-600">
                    <span className="font-medium">STEP 3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Deliver & Get Paid</h3>
                  <p className="mt-3 text-gray-600">
                    Submit your completed work through the platform. Once the client approves, 
                    payment is automatically released from escrow to your account.
                  </p>
                  <div className="mt-4 flex md:justify-end">
                    <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                      <Wallet className="w-5 h-5 mr-2" /> 
                      Fast, secure payment transfers
                    </span>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start order-1 md:order-2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-green-50 rounded-full z-0"></div>
                    <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100 z-10 max-w-sm">
                      <div className="text-lg font-semibold mb-3">Work Delivery</div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Final Deliverables</div>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                            <div className="font-medium">Website Redesign Package</div>
                            <div className="text-gray-600 mt-1">All design files, HTML/CSS implementation, responsive layouts, and documentation</div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <button className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                            Submit Deliverables
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center text-green-600 mb-2">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <div className="font-medium">Payment Ready</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          500 USDC will be released automatically after client approval
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Optional step */}
              <div className="pt-6">
                <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-100 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-semibold text-amber-800">If Dispute Arises (Optional)</h3>
                  </div>
                  <p className="text-amber-700 mb-4">
                    If the client has concerns about your deliverables, our dispute resolution system protects your right to fair compensation for completed work.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-1">1. Present Evidence</div>
                      <div className="text-xs text-gray-600">Show work completed per contract</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-1">2. Fair Evaluation</div>
                      <div className="text-xs text-gray-600">Neutral community review</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-1">3. Fair Payment</div>
                      <div className="text-xs text-gray-600">Get paid for work completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Call to action */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-blue-50 p-8 rounded-xl">
            <div className="flex items-center justify-center mb-4">
              <Handshake className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Start Working with Confidence</h3>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Join FairPay today and experience the security of guaranteed payments and protected work agreements.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 shadow-lg transition duration-300">
              Get Started - It's Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;