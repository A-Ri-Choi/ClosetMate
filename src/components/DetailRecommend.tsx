import styled from "@emotion/styled"
import { dbService } from "./fbase"
import { FavoriteContext } from './Context';
import { useState, useEffect, useContext } from 'react';
import RecomCard from "./Recomcard";
import { HiOutlineRefresh } from 'react-icons/hi'

interface DetailRecommendProps {
  detail: {
    attachmentUrl: string;
    text: string;
    location: string;
    color: string;
    category: string;
  };
  userObj: any;
}


const DetailRecommend = ({ detail, userObj }: DetailRecommendProps) => {
const { favoriteItems, setFavoriteItems } = useContext(FavoriteContext);
  const [randomItems, setRandomItems] = useState([]);

  useEffect(() => {
    fetchData();
    fetchFavoriteItems();
  }, [detail, userObj.uid]);


  const fetchData = async () => {
    let categoryToFetch;

    if (detail.category === '상의') {
      categoryToFetch = '하의';
    } else if (detail.category === '하의') {
      categoryToFetch = '상의';
    } else {
      return;
    }

    try {
      const querySnapshot = await dbService
        .collection(`${userObj.uid}`)
        .where('category', '==', categoryToFetch)
        .get();
      
      const filteredItems = querySnapshot.docs.map(doc => doc.data());
      const randomItems = getRandomItems(filteredItems, 3) as any;
      setRandomItems(randomItems);
    } catch (error) {
      console.log('Error fetching random items:', error);
    }
  };

  const fetchFavoriteItems = async () => {
    try {
      const doc = await dbService.collection(`${userObj.uid}`).doc('favorites').get();
    if (doc.exists) {
      const favoriteItemsData = doc.data();
      if (favoriteItemsData) {
        setFavoriteItems(favoriteItemsData.items);
      }
    }
  } catch (error) {
    console.log('Error fetching favorite items:', error);
  }
  };

  const getRandomItems = (items: any, count: number | undefined) => {
    const shuffled = items.sort(() => 0.5 - Math.random());
    const uniqueItems = [...new Set(shuffled)]; // 중복 아이템 제거
    return uniqueItems.slice(0, count);
  };
  
  const handleRefresh = () => {
    fetchData();
  };

  const handleFavorite = (detailId: string, itemId: string, isFavorite: any) => {
    let updatedFavorites;
  
    if (isFavorite) {
      const isAlreadyAdded = favoriteItems.some(
        (savedItem) =>
          (savedItem.상의 === detailId && savedItem.하의 === itemId) ||
          (savedItem.상의 === itemId && savedItem.하의 === detailId)
      );
  
      if (!isAlreadyAdded) {
        const favoriteItem =
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


  

  return (
    
    <RecomContainer>
{randomItems.length > 0 ? (
  <>
    <RecomTitle>추천 코디</RecomTitle>
    <RefreshBtn onClick={handleRefresh}>
      <HiOutlineRefresh />
    </RefreshBtn>
    <RecomCardList>
      {randomItems.map((item, index) => (
        <RecomCard
          key={index}
          detail={detail}
          item={item}
          handleFavorite={handleFavorite}
          favoriteItems={favoriteItems}
        />
      ))}
    </RecomCardList>
  </>
) : (
  <div>추천할 코디가 없습니다.</div>
)}

    </RecomContainer>
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

const RecomTitle = styled.div`
  margin-top: 2rem;
  font-size: 1.8rem;
  color: coral;
`

const RefreshBtn = styled.div`
  color: coral;
  width: 1.7rem;
  height: 1.7rem;
  margin: 1.2rem auto 0 auto;
  font-size: 1.5rem;
  transition: transform 0.2s ease-out;
    &:hover{
    transform: rotate(180deg);
  }
`

export default DetailRecommend
