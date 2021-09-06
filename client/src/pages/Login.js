import React, { useContext } from 'react'
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext"

function Login() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("");
    
    // Using setAuthState func() from App.js using context api
    const { setAuthState } = useContext(AuthContext)

    let history = useHistory();

    const login = () => {
      const data = { username: username, password: password}
      axios.post("http://localhost:3001/auth/login", data).then((resp) => {
      if(resp.data.error) {
        alert(resp.data.error);
      } else {
        localStorage.setItem("accessToken", resp.data.token);
        setAuthState({ username: resp.data.username, id: resp.data.id, status: true });
         history.push("/");
      }
    });
  }

    return (
      <div className="createPostPage">
        <label>Username:</label>
        <input
          type="text"
          name=""
          id="inputUsername"
          placeholder="(Ex. Maajee...)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          id="inputPost"
          type="password"
          placeholder="Your password.."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} className="btn">
          Login
        </button>
      </div>
    );
}

export default Login
