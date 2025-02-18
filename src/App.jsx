import { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import { auth } from "./firebase";
function App() {
  const [count, setCount] = useState(0);
  const user = null;
  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged(userAuth =>{
      if (userAuth) {
        //Logged in
        console.log(userAuth);
      } else{
        //Logged out
      }
    });

    return unsubscribe;
  })
  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Switch>
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
