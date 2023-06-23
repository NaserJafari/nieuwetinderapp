import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const auth = getAuth();
    signOut(auth).then(() => {
    navigate("/");
    }).catch((error) => {
      // An error happened.
    });
    

  return (
    <div>
      <h1>Logout</h1>
    </div>
  );
}

export default Logout;
