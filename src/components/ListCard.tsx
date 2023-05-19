import styled from "@emotion/styled"
import { dbService, storageService } from "./fbase"
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineMinusSquare } from "react-icons/ai"

interface ListContainerProps {
  userObj: {
    uid: any;
  };
  selectedItems: any;
  selectedItemData: any;
}

const ListCard= ({ userObj, selectedItems, selectedItemData }: ListContainerProps) => {
  const [uploads, setUploads] = useState<any>([]);

  useEffect(() => {
    const unsubscribe = dbService
      .collection(`${userObj.uid}`)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const uploadArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any;
        setUploads(uploadArray);
      });

    return () => {
      unsubscribe(); // cleanup 함수에서 unsubscribe를 호출하여 리스너를 정리
    };
  }, [userObj.uid]);

  useEffect(() => {
    const query = dbService.collection(`${userObj.uid}`).orderBy("createdAt", "desc");
    let unsubscribe: any;

    if (selectedItems.length === 0) {
      // selectedItems가 빈 배열인 경우, 한 번만 데이터를 가져옴
      query.get().then((querySnapshot) => {
        const uploadArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any;
        setUploads(uploadArray);
      });
    } else {
      // selectedItems에 값이 있는 경우, onSnapshot을 사용하여 실시간 업데이트
      unsubscribe = query.onSnapshot((snapshot) => {
        const filteredArray = snapshot.docs.filter((doc) => {
          const data = doc.data();

          // 필터링을 위한 조건 함수
          const filterCondition = (selectedItem: any) => {
            const { field, value } = selectedItem;
            return data[field] === value;
          };

          // selectedItems를 field로 그룹화하여 필터링
          const groupedItems = selectedItems.reduce((grouped: { [x: string]: any[] }, selectedItem: { field: any }) => {
            const { field } = selectedItem;
            if (!grouped[field]) {
              grouped[field] = [];
            }
            grouped[field].push(selectedItem);
            return grouped;
          }, {});

          // 필터링 조건을 모두 충족하는지 확인
          const isFiltered = Object.values(groupedItems).every((items) => {
            return (items as any[]).some(filterCondition);
          });
          return isFiltered;
        });

        const uploadArray = filteredArray.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any;
        setUploads(uploadArray);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe(); // cleanup 함수에서 unsubscribe를 호출하여 리스너를 정리
      }
    };
  }, [userObj.uid, selectedItems]);

  const onDeleteClick = async (upload: any) => {
    const ok = window.confirm("정말로 삭제하시겠습니까?");
    if (ok) {
      try {
        await dbService.collection(`${userObj.uid}`).doc(upload.id).delete();
        await storageService.refFromURL(upload.attachmentUrl).delete();
      } catch (error) {
        console.error("데이터 삭제 중에 오류가 발생했습니다:", error);
      }
    }
  };


  return (
    <>
      {selectedItemData ? (
        <Item key={selectedItemData.id}>
          <Link to={`/item/${selectedItemData.id}`}>
            <Header src={selectedItemData.attachmentUrl} alt="" />
            <Body>
              <p>{selectedItemData.text}</p>
            </Body>
          </Link>
          <Footer>
            <DeleteBtn onClick={() => onDeleteClick(selectedItemData)}><AiOutlineMinusSquare /></DeleteBtn>
          </Footer>
        </Item>
      ) : uploads.length > 0 ? (
        uploads.map((upload: { id: Key | null | undefined; attachmentUrl: string | undefined; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined }) => (
          <Item key={upload.id}>
            <Link to={`/item/${upload.id}`}>
              <Header src={upload.attachmentUrl} alt="" />
              <Body>
                <p>{upload.text}</p>
              </Body>
            </Link>
            <Footer>
              <DeleteBtn onClick={() => onDeleteClick(upload)}><AiOutlineMinusSquare /></DeleteBtn>
            </Footer>
          </Item>
        ))
      ) : (
        <RecomContainer>
        <NoCodyCon>아이템이 없습니다!</NoCodyCon>
        </RecomContainer>
      )}
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

const NoCodyCon = styled.div`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-);
`

const Item = styled.li`
  display: flex;
  flex-direction: column;
  width: 15rem;
  height: 18.5rem;
  border-radius: 0.3rem;
  overflow: hidden;
  box-shadow: 1px 1px 3px 1px #ffd8d8;
  cursor: pointer;
  &:active {
    background-color: ${props => props.color};
    opacity: 0.8;
    transition: background-color 0s;
  }
`

const Header = styled.img`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 15rem;
  margin: 0;
`
const Body = styled.section`
  display: flex;
  width: 80%;
  height: 1rem;
  margin-left: 1rem;
  color: #313131;
`
const Footer = styled.section`
  display: flex;
  margin-left: auto;
  margin-right: 1rem;
`

const DeleteBtn = styled.div`
  font-size: 1.3rem;
  color: #ffbfa8;
  &:hover {
    color: coral;
  }
`

export default ListCard