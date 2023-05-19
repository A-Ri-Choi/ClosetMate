import styled from "@emotion/styled"
import HeaderContainer from "../components/Header"
import Divider from "../components/Divider"
import { FavoriteContext } from '../components/Context';
import { useContext } from 'react';
import CodyCard from "../components/CodyCard";
import { FavoriteItem } from '../components/Context';

interface RecommendPageProps {
  userObj: any;
}

const RecommendPage: React.FC<RecommendPageProps> = ({ userObj }) => {
  const { favoriteItems, setFavoriteItems } = useContext(FavoriteContext);

  const handleFavorite = (detailId: string, itemId: string, isFavorite: boolean, detail: { id: string, category: string }) => {
    let updatedFavorites: FavoriteItem[];

    if (isFavorite) {
      const isAlreadyAdded = favoriteItems.some(
        (savedItem) =>
          (savedItem.상의 === detailId && savedItem.하의 === itemId) ||
          (savedItem.상의 === itemId && savedItem.하의 === detailId)
      );

      if (!isAlreadyAdded) {
        const favoriteItem: FavoriteItem =
          detail.category === '상의'
            ? {
                상의: detailId,
                하의: itemId,
              }
            : {
                상의: itemId,
                하의: detailId,
              };
        updatedFavorites = [...favoriteItems, favoriteItem];
      } else {
        updatedFavorites = favoriteItems;
      }
    } else {
      updatedFavorites = favoriteItems.filter(
        (savedItem) =>
          (savedItem.상의 !== detailId || savedItem.하의 !== itemId) &&
          (savedItem.상의 !== itemId || savedItem.하의 !== detailId)
      );
    }

    setFavoriteItems(updatedFavorites);
  };

  const topItem = favoriteItems.length > 0 ? favoriteItems[0].상의 : '';
  const bottomItem = favoriteItems.length > 0 ? favoriteItems[0].하의 : '';

  const isFavorite = Array.isArray(favoriteItems) && favoriteItems.some(
    (favoriteItem) =>
      (favoriteItem.상의 === topItem && favoriteItem.하의 === bottomItem) ||
      (favoriteItem.상의 === bottomItem && favoriteItem.하의 === topItem)
  );

  return (
    <>
      <HeaderContainer userObj={userObj} />
      <RecomContainer>
        <CodyTitle>코디</CodyTitle>
        <Divider />
        {favoriteItems.length > 0 ? (
          <RecomCardList>
            {Array.isArray(favoriteItems) && favoriteItems.map((favoriteItem, index) => (
              <CodyCard
                key={index}
                detail={favoriteItem.상의}
                item={favoriteItem.하의}
                handleFavorite={handleFavorite}
                isFavorite={isFavorite}
              />
            ))}
          </RecomCardList>
        ) : (<NoCodyCon>코디를 추가해 보세요!</NoCodyCon>)}
      </RecomContainer>
    </>
  );
};


const RecomContainer = styled.div`
  width: 80vw;
  margin: 0 auto;
  padding-bottom: 2rem;
  text-align: center;
  color: coral;
`

const RecomCardList = styled.div`
  display: flex;
  width: 70vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 0 auto;
  padding: 2rem;
`

const CodyTitle = styled.div `
  margin-top: 2rem;
  font-size: 1.8rem;
`

const NoCodyCon = styled.div`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-);
`

export default RecommendPage