import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from './pages/Login';
import Registration from './pages/Registration';
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios"
import PageNotFound from "./pages/PageNotFound";
import { useHistory } from "react-router-dom";
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

function App() {
  const[authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  })
  let history = useHistory();
  
  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth", {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    }).then((response) => {
      if(response.data.error) {
        setAuthState({...authState, status: false})
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    })
  }, [authState])

  const logOut = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username:"", id: 0 ,status: false });
    // history.push("/login");
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
              </>
            ) : (
              <>
                <Link to="/createpost">Create a post</Link>
                <Link to="/">Go to Homepage</Link>
                <h2 className="welcome">{`Welcome ${authState.username}!`}</h2>

                <button className="logout" onClick={logOut}>
                  Logout
                </button>
              </>
            )}
          </div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/createpost" component={CreatePost} />
            <Route path="/post/:id" component={Post} />
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/profile/:id" component={Profile} />
            <Route path="/changepassword" component={ChangePassword} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
