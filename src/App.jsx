import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Tinder from "./components/Tinder.jsx";
import LikedPeople from "./components/LikedPeople.jsx";
import Logout from "./components/Logout.jsx";
import Profile from "./components/Profile.jsx";
import AddDataUser from "./components/AddDataUser.jsx";
import { auth } from "./config/firebase.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ViewProfile from "./components/ViewProfile.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("user");
      } else {
        setUser(null);
        console.log("no user");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link>
        {user && (
          <>
            <Link to="/tinder">Tinder</Link>
            <Link to="/likedpeople">Liked People</Link>
            <Link to="/addDataUser">Add data</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/logout">Logout</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tinder" element={<Tinder />} />
        <Route path="/viewprofile/:id" element={<ViewProfile />} />
        <Route path="/likedpeople" element={<LikedPeople />} />
        <Route path="/adddatauser" element={<AddDataUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
