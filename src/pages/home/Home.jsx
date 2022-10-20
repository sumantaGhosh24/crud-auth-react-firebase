import {useEffect} from "react";

import Navbar from "../../components/navbar/Navbar";

const Home = () => {
  useEffect(() => {
    document.title = "TODO - Home";
  }, []);

  return (
    <div className="home">
      <Navbar />
    </div>
  );
};

export default Home;
