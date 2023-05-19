import styled from "@emotion/styled"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

interface RecomCardProps {
  detail: any
  item: {
    attachmentUrl: any;
  };
  handleFavorite: (attachmentUrl1: string, attachmentUrl2: string, isFavorite: boolean) => void;
  favoriteItems: {
    상의: string;
    하의: string;
  }[];
}

const RecomCard: React.FC<RecomCardProps> = ({ detail, item, handleFavorite, favoriteItems }) => {
  const isFavorite = favoriteItems.some(
    (favoriteItem) =>
      (favoriteItem.상의 === detail.attachmentUrl && favoriteItem.하의 === item.attachmentUrl) ||
      (favoriteItem.상의 === item.attachmentUrl && favoriteItem.하의 === detail.attachmentUrl)
  );

  const toggleFavorite = () => {
    handleFavorite(detail.attachmentUrl, item.attachmentUrl, !isFavorite);
  };

  return (
    <RecomCardContainer>
      <LikeIt onClick={toggleFavorite}>{isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}</LikeIt>
      {detail.category === '상의' ? (
        <>
          <First src={detail.attachmentUrl} id={detail.attachmentUrl} />
          <Second src={item.attachmentUrl} id={item.attachmentUrl} />
        </>
      ) : (
        <>
          <First src={item.attachmentUrl} id={item.attachmentUrl} />
          <Second src={detail.attachmentUrl} id={detail.attachmentUrl} />
        </>
      )}
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

export default RecomCard
