import styled from "@emotion/styled"
import { authService } from "../components/fbase";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const validateEmail = (email: string) => {
    // 이메일 형식 유효성 검사
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // 비밀번호 길이 검사
    return password.length >= 6;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
      setEmailError(validateEmail(value) ? "" : "※ 유효한 이메일을 입력하세요.");
    } else if (name === "password") {
      setPassword(value);
      setPasswordError(validatePassword(value) ? "" : "※ 비밀번호는 최소 6자 이상이어야 합니다.");
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      setConfirmPasswordError(value === password ? "" : "※ 비밀번호가 일치하지 않습니다.");
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");


    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("※ 유효한 이메일을 입력하세요.");
      // return
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("※ 비밀번호는 최소 6자 이상이어야 합니다.");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("※ 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!valid) {
      return;
    }

    try {
      // Firebase 회원가입
      const data = await authService.createUserWithEmailAndPassword(
        email,
        password
        )
      const user = data.user;
      console.log(user);
      history.push('/');
    } catch (error) {
      setError("이미 존재하는 계정입니다.");
    }
  };

  return (
    <SignUpPage onSubmit={onSubmit}>
      <SignUpContainer>
        <Header>회원가입</Header>
        <InputContainer>
          <Input 
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          />
          {emailError && <SignP>{emailError}</SignP>}
        </InputContainer>
        <InputContainer>
          <Input 
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          />
          {passwordError && <SignP>{passwordError}</SignP>}
        </InputContainer>
        <InputContainer>
          <Input type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={onChange}/>
          {confirmPasswordError && <SignP>{confirmPasswordError}</SignP>}
        </InputContainer>
        <Button type="submit">가입 및 로그인</Button>
        {error && <SignPSubmit>{error}</SignPSubmit>}
      </SignUpContainer>
    </SignUpPage>
  )
}

const SignUpPage = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const SignUpContainer = styled.div`
  width: 23rem;
  height: 30rem;
  background: #f2f2f2;
  border-radius: 3rem;
  margin: auto;
`

const Header = styled.h1`
  font-size: 2rem;
  text-align: center;
  padding-top: 2rem;
`
const InputContainer =  styled.div`
  text-align: center;
  height: 5rem;
`

const Input = styled.input`
  font-size: 1rem;
  width: 15rem;
  height: 2.5rem;
  padding-left: 0.7rem;
  border: transparent;
  border-bottom: 1px solid rgba(0,0,0, 0.35);
  background: transparent;
`

const Button = styled.button`
  display: block;
  font-size: 1rem;
  margin: auto;
  margin-top: 2rem;
  width: 15rem;
  height: 2.3rem;
  border-radius: 0.5rem;
  border: transparent;
  /* background: #5c6fff; */
  background: #ff8d58;
  color: #fff;
`

const SignP = styled.p`
  font-size: 0.8rem;
  display: flex;
  margin-left: 4rem;
  color: red;
`

const SignPSubmit = styled.p`
font-size: 0.8rem;
display: flex;
justify-content: center;
color: red;
`

export default SignUp