import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

function AddDataUser() {
  const [photoFile, setPhotoFile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveData = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    setDoc(
      userRef,
      {
        displayName,
        bio,
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      },
      { merge: true }
    )
      .then(() => {
        console.log("Data stored in the 'users' collection successfully");
        setSuccessMessage("Data successfully updated");
      })
      .catch((error) => {
        console.log("Error storing data in the 'users' collection:", error);
      });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);

    const auth = getAuth();
    const user = auth.currentUser;

    const storageRef = ref(getStorage());
    const fileRef = ref(storageRef, `user-photos/${user.uid}/${file.name}`);

    uploadBytes(fileRef, file)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          updateProfile(user, { photoURL: downloadURL })
            .then(() => {
              console.log("Profile photo updated successfully");

              setPhotoFile(downloadURL);

              const db = getFirestore();
              const userRef = doc(db, "users", user.uid);
              setDoc(
                userRef,
                {
                  photoURL: downloadURL,
                  displayName,
                  bio,
                  uid: user.uid,
                  name: user.displayName,
                  email: user.email,
                },
                { merge: true }
              )
                .then(() => {
                  console.log(
                    "Data stored in the 'users' collection successfully"
                  );
                  setSuccessMessage("Data successfully updated");
                })
                .catch((error) => {
                  console.log(
                    "Error storing data in the 'users' collection:",
                    error
                  );
                });
            })
            .catch((error) => {
              console.log("Error updating profile photo:", error);
            });
        });
      })
      .catch((error) => {
        console.log("Error uploading photo:", error);
      });
  };

  return (
    <div className="container mx-auto max-w-sm py-8">
      <h1 className="text-3xl font-bold mb-4">Add Data User</h1>
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {successMessage}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="displayName" className="text-gray-700">
          Display Name:
        </label>
        <input
          type="text"
          id="displayName"
          className="border border-gray-400 p-2 w-full"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="bio" className="text-gray-700">
          Bio:
        </label>
        <textarea
          id="bio"
          className="border border-gray-400 p-2 w-full"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="photoURL" className="text-gray-700">
          Photo:
        </label>
        <input
          type="file"
          id="photoURL"
          className="border border-gray-400 p-2"
          onChange={handlePhotoUpload}
        />
      </div>
      <button
        onClick={handleSaveData}
        className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
      >
        Save Data
      </button>
    </div>
  );
}

export default AddDataUser;
