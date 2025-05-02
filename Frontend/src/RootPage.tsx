import { Outlet } from "react-router-dom"
import Header from "./components/Header/header";
import Footer from "./components/footer/footer";

const Root = () => {
  return (
    <div className="">
      <Header />
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 h-full pt-16 md:pt-20">
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
};

export default Root;