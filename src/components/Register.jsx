import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Register() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setUser(user);
        console.log(user);

        const db = getFirestore();
        const usersCollection = collection(db, "users");
        const userDoc = doc(usersCollection, user.uid);

        const storage = getStorage();
        const storageRef = ref(storage, `user-photos/${user.uid}`);
        await uploadBytes(storageRef, photo);
        const photoURL = await getDownloadURL(storageRef);

        await setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          photoURL: photoURL,
          age: age,
          location: location,
          interests: interests,
          isPublic: isPublic,
          bio: bio
        });

        console.log("User data added to Firestore");
        navigate("/tinder");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
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
        <div className="mb-4">
          <label htmlFor="photo" className="text-gray-700">
            Photo:
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="text-gray-700">
            Age:
          </label>
          <input
            type="text"
            id="age"
            className="border border-gray-400 p-2"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="text-gray-700">
            Location:
          </label>
          <input
            type="text"
            id="location"
            className="border border-gray-400 p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="interests" className="text-gray-700">
            Interests:
          </label>
          <input
            type="text"
            id="interests"
            className="border border-gray-400 p-2"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isPublic" className="text-gray-700">
            Account Privacy:
          </label>
          <select
            id="isPublic"
            className="border border-gray-400 p-2"
            value={isPublic}
            onChange={(e) => setIsPublic(e.target.value === "true")}
          >
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="text-gray-700">
            Bio:
          </label>
          <textarea
            id="bio"
            className="border border-gray-400 p-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
