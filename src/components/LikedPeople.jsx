import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, where, query, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function LikedPeople({ likedProfiles }) {
  const [likedPeopleData, setLikedPeopleData] = useState([]);

  useEffect(() => {
    const fetchLikedPeopleData = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const currentUser = auth.currentUser;

        const likedPeopleCollection = collection(db, "users");
        const likedPeopleQuery = query(likedPeopleCollection, where("uid", "in", likedProfiles.map((profile) => profile.uid)));

        const likedPeopleSnapshot = await getDocs(likedPeopleQuery);
        const likedPeopleData = likedPeopleSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        const likedPeopleWithPrivacyData = await Promise.all(
          likedPeopleData.map(async (person) => {
            if (person.privacy === "public") {
              return person;
            } else {
              const likedPersonRef = doc(db, "users", person.uid);
              const likedPersonSnapshot = await getDoc(likedPersonRef);
              const likedPersonAge = likedPersonSnapshot.get("age");
              return { ...person, age: likedPersonAge };
            }
          })
        );

        setLikedPeopleData(likedPeopleWithPrivacyData);
      } catch (error) {
        console.log("Error fetching liked people:", error);
      }
    };

    fetchLikedPeopleData();
  }, [likedProfiles]);

  return (
    <div className="liked-people">
      <h1>Liked People</h1>
      {likedPeopleData.map((profile) => (
        <div key={profile.uid}>
          <img
            src={profile.photoURL}
            alt={profile.displayName}
            className="w-24 h-24 object-cover rounded-full"
          />
          <p>{profile.privacy === "public" ? profile.displayName : profile.age}</p>
        </div>
      ))}
    </div>
  );
}

export default LikedPeople;
