import React, { useEffect, useState } from "react";
import { Models } from "appwrite";
import { account } from "../../../appwrite";
import { useNavigate } from "react-router";
const Dashboard = () => {
  const [user, setUser] = useState<null | Models.User<Models.Preferences>>(
    null
  );

  const getSession = async () => {
    try {
      const sessionUser = await account.get();
      setUser(sessionUser);
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
  useEffect(() => {
    getSession();
  }, []);

  return (
    <>
      {user ? (
        <div>
          <p>{user?.name}</p>
          <button onClick={logout}>Logout</button>
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
