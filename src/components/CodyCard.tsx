import styled from "@emotion/styled";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

interface CodyCardProps {
  detail: any;
  item: any;
  handleFavorite: any;
  isFavorite: any;
}

const CodyCard = ({ detail, item, handleFavorite, isFavorite }: CodyCardProps) => {
  const toggleFavorite = () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      handleFavorite(detail, item, !isFavorite);
    }
  };
  return (
    <RecomCardContainer>
      <LikeIt onClick={toggleFavorite}>{isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}</LikeIt>
      {detail && <First src={detail} />}
      {item && <Second src={item} />}
    </RecomCardContainer>
  );
};

const RecomCardContainer = styled.div`
  width: 15rem;
  border: 0.15rem solid var(--color-coral);
  margin: 0 auto 2rem;
  padding: 0.5rem 0 1rem 0;
`

const LikeIt = styled.div`
  width: 1rem;
  height: 1rem;
  margin: 0 1rem 1rem auto;
  font-size: 1.3rem;
`

const First = styled.img`
  width: 11rem;
  height: 11rem;
  margin: 0 auto;
  text-align: center;
`

const Second = styled.img`
  width: 11rem;
  height: 11rem;
  margin: 0 auto;
  text-align: center;
`

export default CodyCard