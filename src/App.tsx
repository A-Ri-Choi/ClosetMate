import { useEffect, useState } from 'react'
import './App.css'
import AppRouter from './components/Router'
import { authService } from './components/fbase'
import { FavoriteProvider } from './components/Context'
import styled from '@emotion/styled'

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<any>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          // displayName : user.displayName as string,
          uid: user.uid,
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <FavoriteProvider userObj={userObj}>
          <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
        </FavoriteProvider>
      ) : (
        <Loading>로딩중...</Loading>
      )}
    </>
  );
}


const Loading = styled.div `
  padding: 3rem;
  color: coral;
`

export default App
