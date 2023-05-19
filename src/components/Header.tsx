import styled from "@emotion/styled"
import { authService } from "./fbase"
import { Link, useHistory } from "react-router-dom"
import {FiLogOut} from "react-icons/fi"

interface RecommendPageProps {
  userObj: any;
}

const HeaderContainer: React.FC<RecommendPageProps>  = () => {
  const history = useHistory()
  const onLogOutClick = () => {
    authService.signOut()
    history.push("/")
  }

  return(
    <>
    <Link to="/">
      <Header>
        <Title>ClosetMate</Title>
        <LogoutBtn onClick={onLogOutClick}><FiLogOut /></LogoutBtn>
      </Header>
    </Link>
    </>
  )
}

const Header = styled.div`
  width: 80vw;
  height: 6rem;
  border-bottom: 0.2rem solid coral;
  padding-bottom: 1.5rem;
  margin: 0 auto;
  margin-top: 2rem;
  justify-content: center ;
  align-items: center;
  display: flex;
  position: relative;
`
const Title = styled.div`
  width: 12rem;
  height: 3rem;
  background: coral;
  border-radius: 0.8rem;
  color: #fff7f5;
  margin: 0 auto;
  justify-content: center ;
  align-items: center;
  display: flex;
  font-size: 2rem;
`

const LogoutBtn = styled.p`
  width: 2rem;
  height: 2rem;
  position: absolute;
  right: 3rem;
  font-size: 1.5rem;
  color: coral;
  display: flex;
  justify-content: center ;
  align-items: center;

  &:hover {
    background-color: #f2f2f2;
    border-radius: 0.2rem;
  }
`

export default HeaderContainer