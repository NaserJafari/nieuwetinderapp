import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Tinder() {
  const [profileIndex, setProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filterAgeMin, setFilterAgeMin] = useState("");
  const [filterAgeMax, setFilterAgeMax] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const currentUser = auth.currentUser;

        const profilesCollection = collection(db, "users");

        let profilesQuery = query(profilesCollection, where("uid", "!=", currentUser.uid));

        if (searchInput !== "") {
          profilesQuery = query(profilesCollection, where("interests", "==", searchInput));
        }

        if (filterAgeMin !== "" && filterAgeMax !== "") {
          profilesQuery = query(profilesCollection, where("age", ">=", parseInt(filterAgeMin)), where("age", "<=", parseInt(filterAgeMax)));
        }

        const profilesSnapshot = await getDocs(profilesQuery);
        const profilesData = profilesSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setProfiles(profilesData);
      } catch (error) {
        console.log("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [searchInput, filterAgeMin, filterAgeMax]);

  const handleLike = () => {
    const currentProfile = profiles[profileIndex];

    setLikedProfiles((prevLikedProfiles) => [...prevLikedProfiles, currentProfile]);
    setProfileIndex((prevIndex) => prevIndex + 1);
  };

  const handleViewUser = (uid) => {
    navigate(`/viewprofile/${uid}`);
  };

  const currentProfile = profiles[profileIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        <label htmlFor="search" className="text-gray-700">
          Search by Interests:
        </label>
        <input
          type="text"
          id="search"
          className="border border-gray-400 p-2"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="flex mb-4">
        <div className="mr-4">
          <label htmlFor="ageFilterMin" className="text-gray-700">
            Min Age:
          </label>
          <input
            type="number"
            id="ageFilterMin"
            className="border border-gray-400 p-2"
            value={filterAgeMin}
            onChange={(e) => setFilterAgeMin(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ageFilterMax" className="text-gray-700">
            Max Age:
          </label>
          <input
            type="number"
            id="ageFilterMax"
            className="border border-gray-400 p-2"
            value={filterAgeMax}
            onChange={(e) => setFilterAgeMax(e.target.value)}
          />
        </div>
      </div>
      {profiles.length === 0 ? (
        <p className="text-xl font-bold mb-4">No other users available.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-4">Tinder</h1>
          <div className="flex justify-center">
            <img
              src={currentProfile?.photoURL}
              alt={currentProfile?.displayName}
              className="w-64 h-64 object-cover rounded-full mb-4"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{currentProfile?.displayName}</h2>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 mr-4"
                onClick={handleLike}
              >
                Like
              </button>
              <button
                className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600"
                onClick={() => handleViewUser(currentProfile?.uid)}
              >
                View User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tinder;
