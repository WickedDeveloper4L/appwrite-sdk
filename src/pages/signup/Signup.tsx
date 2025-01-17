import React, { useEffect, useState } from "react";
import styles from "../login/login.module.scss";
import { Link, useNavigate } from "react-router";
import { account } from "../../../appwrite";
import { ID, Models } from "appwrite";
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
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await account.create(
        ID.unique(),
        signupInfo.email,
        signupInfo.password,
        signupInfo.name
      );
      console.log(response);
      await account.createEmailPasswordSession(
        signupInfo.email,
        signupInfo.password
      );
      const userSession = await account.get();
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
