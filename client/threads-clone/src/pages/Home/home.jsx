import React from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import Feed from "../../components/Feed/feed";
import "../../styles/Main.css";

const Home = () => {
  return (
    <div className="App">
      <body>
        <div className="main-content">
          <Sidebar />
          <div className="new-feeds">
            <Feed />
          </div>
        </div>
      </body>
    </div>
  );
};

export default Home;
