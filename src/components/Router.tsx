import { BrowserRouter, Route, Switch } from "react-router-dom"
import Login from "../routes/Login"
import MainPage from "../routes/MianPage"
import RecommendPage from "../routes/RecommendPage"
import ListDetail from "../routes/ListDetail"
import SignUp from "../routes/SignUp"

interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: {
    uid: string | null;
  }; 
}


const AppRouter: React.FC<AppRouterProps> = ({ isLoggedIn, userObj }) => {

  return (
    <BrowserRouter>
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <MainPage userObj={userObj}/>
            </Route>
            <Route exact path="/recom">
              <RecommendPage userObj={userObj}/>
            </Route>
            <Route path="/item/:id">
              <ListDetail userObj={userObj}/>
            </Route>
          </> 
        )
        
        : ( 
          <>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/SignUpPage">
            <SignUp />
          </Route>
          </>
        )}
      </Switch>
    </BrowserRouter>
  )
}

export default AppRouter