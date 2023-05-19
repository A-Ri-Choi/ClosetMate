import styled from "@emotion/styled"
import HeaderContainer from "../components/Header"
import Divider from "../components/Divider"
import DetailRecommend from "../components/DetailRecommend"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { dbService } from "../components/fbase"
import { Category, ClosetOption, Color } from "./MianPage"

interface Detail {
  attachmentUrl: string;
  text: string;
  location: string;
  color: string;
  category: string;
}

interface Props {
  userObj: {
    uid: any;
  };
}

const ListDetail: React.FC<Props> = ({ userObj }) => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchData = async () => {
      try {
        const idData = await dbService.collection(`${userObj.uid}`).doc(id).get();
        if (idData.exists) {
          const data = idData.data();
          if (data) {
            setDetail(data as Detail);
            setNewName(data.text);
            setNewLocation(data.location);
            setNewColor(data.color);
            setNewCategory(data.category);
          } else {
            console.log("Document data is null or undefined!");
          }
        } else {
          console.log("Document not found!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [id, userObj.uid]);

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dbService.doc(`${userObj.uid}/${id}`).update({
      text: newName,
      location: newLocation,
      color: newColor,
      category: newCategory,
    });
    setEditing(false);

    setDetail((prev) => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...prev!,
      text: newName,
      location: newLocation,
      color: newColor,
      category: newCategory,
    }));
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^[a-zA-Z]+$/.test(value)) {
      if (value.length <= 20) {
        setNewName(value);
      }
    } else {
      if (value.length <= 13) {
        setNewName(value);
      }
    }
  };

  const onLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setNewLocation(value);
  };

  const onColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setNewColor(value);
  };

  const onCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setNewCategory(value);
  };

  return (
    <>
      <HeaderContainer userObj={userObj} />
      {editing ? (
        <>
          <DetailContainer>
            <>
            {detail ? (
                <>
                  <DetailImg src={detail.attachmentUrl} />
                </>
              ) : (
                <div></div>
              )}
              <DetailContent>
                <form onSubmit={onSubmit}>
                <FixDetail>이름 : <FixInput type="text" value={newName} onChange={onNameChange} required /></FixDetail>
                  <FixDetail>카테고리 : <FixSelect value={newCategory} onChange={onCategoryChange}>
                    {Category.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </FixSelect>
                  </FixDetail>
                  <FixDetail>색상 : <FixSelect value={newColor} onChange={onColorChange}>
                    {Color.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </FixSelect>
                  </FixDetail>
                  <FixDetail>
                  옷장 : <FixSelect value={newLocation} onChange={onLocationChange}>
                    {ClosetOption.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </FixSelect>
                  </FixDetail>
                  <FixCon>
                  <FixSubmit type="submit" value="완료" />
                  </FixCon>
                </form>
              </DetailContent>
            </>
          </DetailContainer>
        </>
      ) : (
        <>
          <DetailContainer>
            {detail ? (
              <>
                <DetailImg src={detail.attachmentUrl} />
                <DetailContent>
                  <ItemText>{detail.text}</ItemText>
                  <ItemDetail>카테고리 : {detail.category}</ItemDetail>
                  <ItemDetail>색상 : {detail.color}</ItemDetail>
                  <ItemDetail>옷장 : {detail.location}</ItemDetail>
                  <FixCon>
                  <FixBtn onClick={toggleEditing}>수정하기</FixBtn>
                  </FixCon>
                </DetailContent>
              </>
            ) : (
              <>
                <LoadingDetail>loading...</LoadingDetail>
              </>
            )}
          </DetailContainer>
        </>
      )}
      <Divider />
      {(detail && (detail.category === '상의' || detail.category === '하의')) && (
        <DetailRecommend detail={detail} userObj={userObj} />
      )}
    </>
  );
};


const DetailContainer = styled.div`
  width: 50rem;
  display: flex;
  padding-top: 3.5rem;
  margin: 0 auto;
`

const DetailImg = styled.img`
  width: 25rem;
  height: 25rem;
  margin-right: 3rem;
`

const DetailContent = styled.div`
  width: 23rem;
  height: 23rem;
  margin: auto auto;
  position: relative;
`

const ItemText = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
`

const ItemDetail = styled.p`
  font-size: 1rem;
  padding-top: 1rem;
`

const FixDetail = styled.p`
  font-size: 1rem;
  padding-top: 0.3rem;
`

const FixSelect = styled.select`
  width: 5rem;
  height: 1.5rem;
  padding-left: 0.3rem;
`

const FixInput = styled.input`
  width: 10rem;
  height: 1.5rem;
  padding-left: 0.3rem;
`

const FixCon = styled.div`
  border-top: 0.15rem solid #50505033;
  width: 100%;
  padding-top: 2.2rem;
  position: absolute;
  bottom: 1rem;
`

const FixSubmit = styled.input`
  border: 0.15rem solid coral;
  border-radius: 0.8rem;
  color: coral;
  background: white;
  width: 7rem;
  height: 2.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover{
    color: white;
    border: 0.15rem solid white;
    background: coral;
  }
`

const FixBtn = styled.button`
  border: 0.15rem solid coral;
  border-radius: 0.8rem;
  color: coral;
  background: white;
  width: 7rem;
  height: 2.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover{
    color: white;
    border: 0.15rem solid white;
    background: coral;
  }
`
const LoadingDetail = styled.div`
  padding: 5rem;
  color: coral;
  display: flex;
  margin: 0 auto;
`


export default ListDetail