import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DisplayPosts from "./Components/DisplayPosts";
import { Switch, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route path="/:server" component={DisplayPosts} />
        <Route exact path="/" component={HomePage} />
      </Switch>

      <Footer />
    </div>
  );
}

export default App;
