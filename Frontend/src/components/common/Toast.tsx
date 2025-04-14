import React from "react";

interface ToastProps {
 message: string;
 isError?: boolean;
 visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isError = false, visible }) => {
 if (!visible) return null;

 return (
  <div
   className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300 ${isError ? "bg-red-500" : "bg-green-500"
    }`}
  >
   {message}
  </div>
 );
};

export default Toast;