import React, { useEffect, useState } from "react";
import styles from "./login.module.scss";
import { Link, useNavigate } from "react-router";
import { Models } from "appwrite";
import { account } from "../../../appwrite";

interface LoginProps {
  email: string;
  password: string;
}
const Login = () => {
  const [info, setInfo] = useState<LoginProps>({
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
    setInfo({
      ...info,
      [name]: value,
    });
  };
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await account.createEmailPasswordSession(info.email, info.password);
      const sessionUser = await account.get();
      setUser(sessionUser);
    } catch (error) {
      console.log(error);
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
      <h1>Login</h1>
      <form className={styles.form}>
        <input
          type="text"
          placeholder="johndoe@domain.tls"
          className={styles.input}
          onChange={handleChange}
          name="email"
          value={info.email}
        />
        <input
          type="password"
          placeholder="*********"
          className={styles.input}
          onChange={handleChange}
          name="password"
          value={info.password}
        />
        {isLoading && <p>Signing In...</p>}
        {error && <p>{error}</p>}
        <button onClick={handleSubmit} className={styles.btn}>
          Login
        </button>
        <p>
          No account? <Link to="/register">create account.</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
