import React, { useContext, useState } from "react";
import { LoginContext } from "./context.js";

const If = props => {
  return !!props.condition ? props.children : null;
};

const Login = props => {
  let [state2, setState2] = useState({});
  const loginContext = useContext(LoginContext);

  const handleChange = e => {
    setState2({...state2, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    loginContext.login(state2.username, state2.password);
  };

  return (
    <>
      <If condition={loginContext.loggedIn}>
        <button onClick={loginContext.logout}>Log Out</button>
      </If>

      <If condition={!loginContext.loggedIn}>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="UserName"
            name="username"
            onChange={handleChange}
          />
          <input
            placeholder="password"
            name="password"
            onChange={handleChange}
          />
          <button>Login</button>
        </form>
      </If>
    </>
  );
};

export default Login;
