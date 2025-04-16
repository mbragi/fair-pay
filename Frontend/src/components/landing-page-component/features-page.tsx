import { motion } from "framer-motion";

// Import icons
import { Shield, Handshake, ClipboardCheck, Scale, MessageCircle, Award } from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Secure Escrow System",
      description:
        "Client funds are securely held in escrow until project completion, protecting both parties from potential fraud or non-payment.",
    },
    {
      icon: <Handshake className="w-8 h-8 text-blue-500" />,
      title: "Trust-Building Platform",
      description:
        "Our platform establishes trust between clients and service providers through transparent contracts and secure payment handling.",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-blue-500" />,
      title: "Clear Contract Terms",
      description:
        "Create detailed contracts with specific deliverables, timelines, and payment terms that both parties agree to before work begins.",
    },
    {
      icon: <Scale className="w-8 h-8 text-blue-500" />,
      title: "Fair Dispute Resolution",
      description:
        "If disagreements arise, our impartial dispute resolution process ensures fair outcomes based on contract terms and submitted evidence.",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
      title: "Integrated Communication",
      description:
        "Built-in messaging keeps all project communication in one place, creating a clear record for both parties.",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-500" />,
      title: "Reputation System",
      description:
        "Build your professional reputation through verified project completions and client/provider reviews.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6" 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Building <span className="text-blue-600">Trust</span> Between Clients and Service Providers
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            FairPay eliminates payment uncertainty with our secure escrow system, ensuring both clients and freelancers can work with confidence.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How FairPay Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our escrow system ensures security and peace of mind for every project.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Step 1 */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-blue-600 p-4 text-white text-center font-bold text-lg">
              STEP 1
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Client Creates Contract</h3>
              <p className="text-gray-600 mb-6">
                Client defines project details, sets milestones, and funds the escrow account with the agreed payment.
              </p>
              <div className="flex justify-center">
                <img 
                  src="/api/placeholder/300/200" 
                  alt="Contract Creation" 
                  className="rounded-lg shadow-md" 
                />
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-blue-600 p-4 text-white text-center font-bold text-lg">
              STEP 2
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Provider Accepts & Works</h3>
              <p className="text-gray-600 mb-6">
                Service provider reviews and accepts the terms, then completes the work according to specifications.
              </p>
              <div className="flex justify-center">
                <img 
                  src="/api/placeholder/300/200" 
                  alt="Provider Working" 
                  className="rounded-lg shadow-md" 
                />
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-blue-600 p-4 text-white text-center font-bold text-lg">
              STEP 3
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Funds Released</h3>
              <p className="text-gray-600 mb-6">
                Upon client approval, funds are released from escrow to the provider. Any disputes trigger our resolution process.
              </p>
              <div className="flex justify-center">
                <img 
                  src="/api/placeholder/300/200" 
                  alt="Payment Release" 
                  className="rounded-lg shadow-md" 
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Spotlight: Escrow System */}
        <motion.div 
          className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-full md:w-1/2 bg-blue-600 p-8 flex items-center justify-center">
            <img 
              src="/api/placeholder/400/320" 
              alt="Secure Escrow System" 
              className="rounded-lg shadow-md" 
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Escrow Protection</h3>
            <p className="text-gray-600 mb-6">
              Our escrow system is the foundation of trust on the FairPay platform. Client funds are securely held until 
              project completion, eliminating payment uncertainty and protecting both parties.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="bg-green-100 p-1 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                Clients know their money won't be released until they're satisfied
              </li>
              <li className="flex items-center text-gray-600">
                <span className="bg-green-100 p-1 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                Service providers can work confidently knowing funds are secured
              </li>
              <li className="flex items-center text-gray-600">
                <span className="bg-green-100 p-1 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                All transactions are secured and transparently tracked
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Feature Spotlight: Dispute Resolution */}
        <motion.div 
          className="flex flex-col md:flex-row-reverse items-center bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-full md:w-1/2 bg-indigo-600 p-8 flex items-center justify-center">
            <img 
              src="/api/placeholder/400/320" 
              alt="Dispute Resolution" 
              className="rounded-lg shadow-md" 
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fair Dispute Resolution</h3>
            <p className="text-gray-600 mb-6">
              When disagreements occur, our structured dispute resolution process ensures fair outcomes based on contract terms
              and submitted evidence from both parties.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="bg-green-100 p-1 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                Impartial review of contract terms and delivered work
              </li>
              <li className="flex items-center text-gray-600">
                <span className="bg-green-100 p-1 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                Clear documentation requirements for resolving disputes
              </li>
              <li className="flex items-center text-gray-600">
                <span className="bg-green-100 p-1 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
                Quick resolution timelines to minimize project delays
              </li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Who Benefits from FairPay
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our platform supports a wide range of service providers and clients.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Providers */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </span>
              For Service Providers
            </h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Graphic Designers</span> - Secure payment for logo designs, web graphics, and branding materials</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Web Developers</span> - Protected milestone payments for website development projects</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Content Creators</span> - Guaranteed compensation for writing, video production, and creative work</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Consultants</span> - Clear payment structure for advisory services and expertise</span>
              </li>
            </ul>
            <p className="text-gray-600 italic">
              "With FairPay, I never worry about chasing payments anymore. The escrow system ensures I get paid when the work is done, every time."
            </p>
          </motion.div>

          {/* Clients */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              For Clients
            </h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Small Businesses</span> - Safely outsource design, development, and marketing needs</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Startups</span> - Budget-friendly access to professional services with payment protection</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Project Managers</span> - Clear milestone tracking and payment structure for outsourced work</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-700"><span className="font-semibold">Individual Clients</span> - Peace of mind when hiring professionals for personal projects</span>
              </li>
            </ul>
            <p className="text-gray-600 italic">
              "FairPay gives me confidence when hiring freelancers. I know exactly what I'm paying for, and the escrow system ensures I only pay for completed work."
            </p>
          </motion.div>
        </div>
      </section>

       
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 sm:text-4xl">
              Ready to Work With Confidence?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
              Join thousands of clients and service providers who trust FairPay for secure, hassle-free transactions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started as Client
              </motion.button>
              <motion.button
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join as Provider
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

    
    </div>
  );
};

export default FeaturesPage;