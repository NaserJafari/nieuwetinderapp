import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc, addDoc, getDocs, collection } from "firebase/firestore";

function Profile() {
  const [user, setUser] = useState(null);
  const [isPublic, setIsPublic] = useState(false);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
        fetchPrivacySetting(user.uid);
      } else {
        setUser(null);
        setIsPublic(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);

    try {
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUser((prevUser) => ({
          ...prevUser,
          photoURL: data.photoURL,
          email: data.email,
        }));
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const fetchPrivacySetting = async (uid) => {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);

    try {
      const snapshot = await userRef.get();
      if (snapshot.exists()) {
        const data = snapshot.data();
        setIsPublic(data.isPublic);
      }
    } catch (error) {
      console.log("Error fetching privacy setting:", error);
    }
  };

  const handlePrivacyToggle = async () => {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const db = getFirestore();
    const userRef = doc(db, "users", uid);

    try {
      await updateDoc(userRef, {
        isPublic: !isPublic,
      });
      setIsPublic(!isPublic);
      console.log("Privacy setting updated successfully");
    } catch (error) {
      console.log("Error updating privacy setting:", error);
    }
  };

  // --- POSTS MAKEN ---

  const db = getFirestore();
  const postsCollectionRef = collection(db, "post");

  // States post
  const [postsList, setPostsList] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const getPosts = async () => {
    try {
      const data = await getDocs(postsCollectionRef);
      const filteredData = data.docs.map((doc ) =>({...doc.data(), id: doc.id}))
      setPostsList(filteredData);
    }
      // console.log(filteredData)
    catch (err){
      // console.error(err)
    }
  }
  // useEffect posts
  useEffect(() => {
    getPosts();
  })

  const onSubmitPost = async () => {
    await addDoc(postsCollectionRef, {title: postTitle, content: postContent})
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        {user && (
          <>
            <div className="flex justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-64 h-64 object-cover rounded-full mb-4"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-200 rounded-full mb-4"></div>
              )}
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
              <div className="flex justify-center">
                <button
                  onClick={handlePrivacyToggle}
                  className="mb-3 bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 mr-4"
                >
                  {isPublic ? "Set Private" : "Set Public"}
                </button>
              </div>
              <div className="flex justify-center flex-col">
                <p>Create a post</p>
                <input placeholder="Title" onChange={(e) => setPostTitle(e.target.value)}></input>
                <input placeholder="Content" onChange={(e) => setPostContent(e.target.value)}></input>
                <button className="mt-3 bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 mr-4" onClick={onSubmitPost}>Post</button>
                <p className="pt-6 pb-6">Here are your posts:</p>
                <div>
                  {postsList.map((post) => (
                    <div className="border-2 rounded-sm border-gray-200" key={post.title}>
                      <h1 className="text-2xl pb-2">{post.title}</h1>
                      <p className="text-gray-500 pb-6">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
