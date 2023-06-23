import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDocs, collection, query, where } from "firebase/firestore";

function ViewProfile() {
  const [user, setUser] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        fetchUserData();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (currentUserId) => {
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users");
    const usersQuery = query(usersCollectionRef, where("uid", "!=", currentUserId));
  
    try {
      const querySnapshot = await getDocs(usersQuery);
      const userData = [];
  
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          userData.push({
            uid: doc.id,
            photoURL: data.photoURL,
            displayName: data.displayName,
            email: data.email,
            isPublic: data.isPublic,
            bio: data.bio
          });
        }
      });
  
      if (userData.length > 0) {
        setUser(userData[0]);
        setIsPublic(userData[0].isPublic);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        {user && (
          <>
            <div className="flex justify-center">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-64 h-64 object-cover rounded-full mb-4"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{user.displayName}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              {isPublic ? (
                <p className="text-green-500 mb-4">Account is Public</p>
              ) : (
                <p className="text-red-500 mb-4">Account is Private</p>
              )}
              {isPublic && <p className="text-gray-700 mb-6">{user.bio}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewProfile;
