import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import LikedPeople from "./LikedPeople.jsx";

function Tinder() {
  const [profileIndex, setProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [likedProfiles, setLikedProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const currentUser = auth.currentUser;

        const profilesCollection = collection(db, "users");

        const profilesQuery = query(profilesCollection, where("uid", "!=", currentUser.uid));

        const profilesSnapshot = await getDocs(profilesQuery);
        const profilesData = profilesSnapshot.docs.map((doc) => doc.data());
        setProfiles(profilesData);
      } catch (error) {
        console.log("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleLike = () => {
    const currentProfile = profiles[profileIndex];

    setLikedProfiles((prevLikedProfiles) => [...prevLikedProfiles, currentProfile]);
    setProfileIndex((prevIndex) => prevIndex + 1);
  };

  const currentProfile = profiles[profileIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Tinder</h1>
        <div className="flex justify-center">
          <img
            src={currentProfile?.photo}
            alt={currentProfile?.name}
            className="w-64 h-64 object-cover rounded-full mb-4"
          />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{currentProfile?.name}</h2>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 mr-4"
              onClick={handleLike}
            >
              Like
            </button>
          </div>
        </div>
      </div>
      <LikedPeople likedProfiles={likedProfiles} />
    </div>
  );
}

export default Tinder;
