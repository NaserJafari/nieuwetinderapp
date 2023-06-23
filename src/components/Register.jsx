import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

function Register() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        console.log(user);

        const db = getFirestore();
        const usersCollection = collection(db, "users");
        const userDoc = doc(usersCollection, user.uid);
        
        // Set the user data in the "users" collection
        setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
        }).then(() => {
          console.log("User data added to Firestore");
          navigate("/tinder");
        }).catch((error) => {
          console.log("Error adding user data to Firestore:", error);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div className="container mx-auto max-w-sm">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="email" className="text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-400 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="border border-gray-400 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
