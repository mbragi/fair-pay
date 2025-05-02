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
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 ">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6  lg:px-8 max-w-7xl mx-auto mb-20">
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