import styled from "@emotion/styled"

const Divider = () => {
  return (
    <DividerHr />
  )
}

const DividerHr = styled.hr`
  border-style: none;
  width: 80vw;
  margin: 2rem auto;
  border-top: 0.15rem solid var(--color-coral);
  text-align: center;
  align-items: center;
`

export default Divider