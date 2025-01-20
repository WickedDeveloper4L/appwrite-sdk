import React, { useEffect, useState } from "react";
import styles from "../login/login.module.scss";
import { Link, useNavigate } from "react-router";
import { account, databases } from "../../../appwrite";
import { ID, Models } from "appwrite";
const databaseID = import.meta.env.VITE_SUPABASE_DATABASE_ID;
const collectionID = import.meta.env.VITE_SUPABASE_COLLECTION_ID;

interface SignupProps {
  name: string;
  email: string;
  password: string;
}
const Signup = () => {
  const [signupInfo, setSignupInfo] = useState<SignupProps>({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [user, setUser] = useState<null | Models.User<Models.Preferences>>(
    null
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value,
    });
  };
  const createProfile = async (id: string) => {
    try {
      await databases.createDocument(databaseID, collectionID, id, {
        email: signupInfo.email,
        name: signupInfo.name,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await account.create(
        ID.unique(),
        signupInfo.email,
        signupInfo.password,
        signupInfo.name
      );

      await account.createEmailPasswordSession(
        signupInfo.email,
        signupInfo.password
      );

      const userSession = await account.get();
      const { $id } = userSession;
      await createProfile($id);
      setUser(userSession);
      setIsLoading(false);
    } catch (error) {
      console.log("authError", error);
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);
  useEffect(() => {
    const checkIfUser = async () => {
      const user = await account.get();
      if (user) {
        navigate("/dashboard");
      }
    };
    checkIfUser();
  }, []);
  return (
    <div className={styles.main}>
      <h1>Signup</h1>
      <form className={styles.form}>
        <input
          type="text"
          placeholder="John Doe"
          className={styles.input}
          onChange={handleChange}
          name="name"
          value={signupInfo.name}
        />
        <input
          type="text"
          placeholder="johndoe@domain.tls"
          className={styles.input}
          onChange={handleChange}
          name="email"
          value={signupInfo.email}
        />
        <input
          type="password"
          placeholder="*********"
          className={styles.input}
          onChange={handleChange}
          name="password"
          value={signupInfo.password}
        />
        {isLoading && <p>creating account...</p>}
        {error && <p>{error}</p>}
        <button onClick={handleSubmit} className={styles.btn}>
          SignUp
        </button>
        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
