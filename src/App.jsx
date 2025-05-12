import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/api/auth/session", {
      method: "GET",
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          dispatch(
            login({
              uid: data.id,
              email: data.email,
            })
          );
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => {
        console.error("Session check error:", err);
        dispatch(logout());
      });
  }, [dispatch]);

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Switch>
            <Route path="/profile">
              <ProfileScreen />
            </Route>
            <Route exact path="/">
              <HomeScreen />
            </Route>
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;
