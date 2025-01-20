import { useEffect, useState } from "react";
import { Models, Query } from "appwrite";
import { account, databases } from "../../../appwrite";
import { useNavigate } from "react-router";
import styles from "./dashboard.module.scss";

const databaseID = import.meta.env.VITE_SUPABASE_DATABASE_ID;
const collectionID = import.meta.env.VITE_SUPABASE_COLLECTION_ID;
interface InfoProps {
  name: string;
  country: string;
}
const Dashboard = () => {
  const [user, setUser] = useState<null | Models.User<Models.Preferences>>(
    null
  );
  const [data, setData] = useState<null | Models.Document>(null);
  const [info, setInfo] = useState<InfoProps>({
    name: "",
    country: "",
  });
  const getUserData = async (sessionUser: Models.User<Models.Preferences>) => {
    try {
      const response = await databases.listDocuments(databaseID, collectionID, [
        Query.equal("email", sessionUser.email),
      ]);
      console.log("fired");
      setData(response.documents[0]);
      console.log("data:", response.documents[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const getSession = async () => {
    try {
      const sessionUser = await account.get();
      setUser(sessionUser);
      await getUserData(sessionUser);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };
  const navigate = useNavigate();
  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    navigate("/");
  };

  const handleDataUpdate = async () => {
    try {
      if (user && info.name.length && info.country.length)
        await databases.updateDocument(databaseID, collectionID, user.$id, {
          name: info.name,
          country: info.country,
        });
      await getUserData(user);
    } catch (error) {
      console.log(error);
      alert("Unable to update document");
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  return (
    <>
      {user ? (
        <div className={styles.main}>
          <p className={styles.name}>{data?.name}</p>
          <p className={styles.name}>{data?.email}</p>
          <p className={styles.name}>{data?.country}</p>
          <label htmlFor="Name">Update Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder={data?.name}
            name="Name"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
          <label htmlFor="Country">Country</label>
          <input
            className={styles.input}
            type="text"
            placeholder="country"
            name="Country"
            value={info.country}
            onChange={(e) => setInfo({ ...info, country: e.target.value })}
          />
          <button className={styles.btn} onClick={handleDataUpdate}>
            Update Data
          </button>
          <button className={styles.btn} onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>getting user ...</p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
