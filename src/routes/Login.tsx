import styled from "@emotion/styled"
import { authService } from "../components/fbase"
import { useState } from "react"
import { Link, useHistory } from 'react-router-dom';
import firebase from "firebase/app";
import "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const  [error, setError] = useState("")
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const history = useHistory()

  const validateEmail = (email: string) => {
    // 이메일 형식 유효성 검사
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // 비밀번호 길이 검사
    return password.length >= 6;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {target: { name, value }} = event
    if (name === "email") {
      setEmail(value);
      setEmailError(validateEmail(value) ? "" : "※ 유효한 이메일을 입력하세요.");
    } else if (name === "password") {
      setPassword(value);
      setPasswordError(validatePassword(value) ? "" : "※ 비밀번호는 최소 6자 이상이어야 합니다.");
    } 
    
  }

  const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setError("");

    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("유효한 이메일을 입력하세요.");
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      valid = false;
    }
    if (!valid) {
      return;
    }
    try {

      const data = await authService.signInWithEmailAndPassword(
          email,
          password
          )
        const user = data.user
      console.log(user)
      history.push('/')
    } catch(error) {
      setError("존재하지 않은 계정입니다.")
    }
  }

  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    let provider: firebase.auth.AuthProvider | null = null;
    if (name === "google") {
      provider = new firebase.auth.GoogleAuthProvider();
    }
    if (provider) {
      try {
        const data = await authService.signInWithPopup(provider);
        console.log(data);
      } catch (error) {
        // Handle error
      }
    }
  }

  return (
    <LoginPage onSubmit={onSubmit}>
      <LoginContainer>
        <Header>반갑습니다!</Header>
        <InputContainer>
          <Input name="email" type="email" placeholder="이메일" required value={email} onChange={onChange} />
          {emailError && <SignP>{emailError}</SignP>}
          </InputContainer>
          <InputContainer>
          <Input name="password" type="password" placeholder="비밀번호" required value={password} onChange={onChange} />
          {passwordError && <SignP>{passwordError}</SignP>}

          </InputContainer>
          <SubmitInput type="submit" value="Log in" />
          {error && <SignPSubmit>{error}</SignPSubmit>}
        <Line>또는</Line>
        <GoogleBtn onClick={onSocialClick} name="google">
          <GoogleImg>
            <svg height="100%" viewBox="0 0 20 20" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"></path><path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"></path><path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"></path><path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"></path></svg>
          </GoogleImg> 
          구글 계정으로 시작하기
        </GoogleBtn>
        <Footer>  
          <ButtonPw>비밀번호를 잊어버렸어요.</ButtonPw>
          <p>아직 계정이 없으신가요?</p>
          <Link to="/SignUpPage">
          <ButtonIn>회원가입하기</ButtonIn>
          </Link>
        </Footer>
      </LoginContainer>
    </LoginPage>
  )
}

const LoginPage = styled.form`
  /* height: 100vh; */
  /* align-items: center; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const LoginContainer = styled.div`
  width: 23rem;
  height: 33rem;
  /* background: #f2f2f2; */
  border: 0.1rem solid coral;
  border-radius: 2rem;
  margin: auto;
`

const Header = styled.h1`
  font-size: 2rem;
  text-align: center;
  padding-top: 1.2rem;
`
const InputContainer =  styled.div`
  text-align: center;
  height: 3.8rem;
  margin-bottom: 0.5rem;
`

const Input = styled.input`
  font-size: 1rem;
  width: 15rem;
  height: 2.5rem;
  /* margin: 0.3rem; */
  padding-left: 0.7rem;
  border: transparent;
  border-bottom: 1px solid rgba(0,0,0, 0.35);
  background: transparent;
`

const SubmitInput = styled.input`
  display: block;
  font-size: 1rem;
  margin: auto;
  margin-top: 1rem;
  width: 15rem;
  height: 2.3rem;
  border-radius: 0.5rem;
  border: transparent;
  background: #ff8d58;
  color: #fff;
`

const Line = styled.div`
  width: 17rem;
  display:flex;
  align-items: center;
  color: rgba(0,0,0, 0.35); 
  margin: auto;
  margin-top: 1.5rem;

  &::before {
    content: "";
    flex-grow: 1;
    margin: 0px 16px;
    background: rgba(0, 0, 0, 0.35); 
    height: 1px;
    /* font-size: 0px; */
    /* line-height: 0px; */
  } 

  &::after {
    content: "";
    flex-grow: 1;
    margin: 0px 16px;
    background: rgba(0, 0, 0, 0.35); 
    height: 1px;
    /* font-size: 0px;
    line-height: 0px; */
  }
`

const GoogleBtn = styled.button`
  display: block;
  margin: auto;
  font-size: 1rem;
  margin-top: 1rem;
  width: 15rem;
  height: 2.3rem;
  border-radius: 0.5rem;
  border: transparent;
  border: 0.1rem solid coral;
  background: #fff;
  color: #000;
  /* line-height: 1rem; */
`

// const GoogleImg = styled.img`
//   width: 1rem;
//   height: 1rem;
//   margin: 2px 5px -2px 0;
//   align-items: center;
//     line-height: 3rem;
//   display: flex;
// `
const GoogleImg = styled.p`
  width: 1rem;
  height: 1rem;
  /* line-height: 3rem; */
  display: inline-block;
  /* display: flex; */
  margin: 2px 5px -2px 0;
  padding-top: 2px;
  /* align-items: center; */
`

// const GoogleP = styled.p`
//   display: inline-block;
//   margin: auto;
//   align-items: center;
// `

const Footer = styled.div`
  margin-top: 1.7rem;
  text-align: center;
  line-height: 0.3rem;
  color: rgba(0, 0, 0, 0.35);
  font-size: 1rem;
`

const ButtonPw = styled.button`
  display: block;
  margin: auto;
  font-size: 0.3rem;
  margin-top: 1rem;
  /* width: 15rem; */
  /* height: 2.3rem; */
  /* border-radius: 0.5rem; */
  border: transparent;
  background: #fff;
  /* color: #000; */
  color: rgba(0, 0, 0, 0.35);
`

const ButtonIn = styled.button`
  display: block;
  margin: auto;
  /* font-size: 1rem; */
  margin-top: 1rem;
  /* width: 15rem; */
  /* height: 2.3rem; */
  /* border-radius: 0.5rem; */
  border: transparent;
  background: #fff;
  color: #ff8d58;
`

const SignP = styled.p`
  font-size: 0.8rem;
  display: flex;
  margin-left: 4rem;
  /* color: rgba(0,0,0, 0.35); */
  color: red;
  /* display: none; */
`
const SignPSubmit = styled.p`
font-size: 0.8rem;
display: flex;
/* margin-left: 4rem; */
/* margin: auto; */
justify-content: center;
/* text-align: center; */
/* color: rgba(0,0,0, 0.35); */
color: red;
/* display: none; */
`

export default Login