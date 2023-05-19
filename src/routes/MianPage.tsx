import styled from "@emotion/styled"
import Divider from "../components/Divider"
import ListContainer from "../components/ListContainer"
import HeaderContainer from "../components/Header"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Upload from "../components/Upload"
import MakeSelect from "../components/MakeSelect";
import { dbService } from '../components/fbase';
import { AiOutlinePlus, AiFillHeart } from 'react-icons/ai'

export const ClosetOption = [
  { field: "location", value: "제1옷장", name: "제1옷장" },
  { field: "location", value: "제2옷장", name: "제2옷장" },
  { field: "location", value: "제3옷장", name: "제3옷장" }
];

export const Category = [
  { field: "category", value: "상의", name: "상의" },
  { field: "category", value: "하의", name: "하의" },
  { field: "category", value: "원피스", name: "원피스" },
  { field: "category", value: "아우터", name: "아우터" },
  { field: "category", value: "신발", name: "신발" },
  { field: "category", value: "액세서리", name: "액세서리" },
];

export const Color = [
  { field: "color", value: "빨강", name: "빨강" },
  { field: "color", value: "노랑", name: "노랑" },
  { field: "color", value: "초록", name: "초록" },
  { field: "color", value: "파랑", name: "파랑" },
  { field: "color", value: "검정", name: "검정" },
  { field: "color", value: "하양", name: "하양" },
  { field: "color", value: "베이지", name: "베이지" },
  { field: "color", value: "그레이", name: "그레이" },
  { field: "color", value: "브라운", name: "브라운" },
  { field: "color", value: "퍼플", name: "퍼플" },
  { field: "color", value: "핑크", name: "핑크" },
];

interface RecommendPageProps {
  userObj: any;
}


const MainPage: React.FC<RecommendPageProps>  = ({ userObj }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [data, setData] = useState<{ id: string; text: string }[]>([]);
  const [filteredData, setFilteredData] = useState<{ id: string; text: string }[]>([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedItemData, setSelectedItemData] = useState<{ id: string; text: string } | null>(null);

  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const handleResetClick = () => {
    setSelectedItems([]);
    setSelectedItemData(null);
  };

  useEffect(() => {
    setSelectedItemData(null);
  }, [selectedItems]);

  useEffect(() => {
    const unsubscribe = dbService
      .collection(`${userObj?.uid}`)
      .onSnapshot((snapshot) => {
        const dataArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as { id: string; text: string }[];
        setData(dataArray);
      });
    return () => unsubscribe();
  }, [userObj?.uid]);

  useEffect(() => {
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      const regex = new RegExp(searchWord, "i");
      const newFilter = data.filter((value) =>
        regex.test(value.text)
      );
      setFilteredData(newFilter);
    }
  }, [data, searchWord]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
  };

  const handleItemClick = async (id: string) => {
    const docRef = dbService.collection(`${userObj?.uid}`).doc(id);
    const doc = await docRef.get();
    const data = {
      id: doc.id,
      ...doc.data(),
    } as { id: string; text: string };
    setSelectedItemData(data);
    console.log(data);
    setSearchWord("");
  };

  return (
    <>
      {isModalOpen && (
        <ModalContainer>
          <Upload closeModal={closeModal} userObj={userObj} />
        </ModalContainer>
      )}
      <HeaderContainer userObj={userObj}/>
      <MainContainer>
        <MainNav>
          <SelectContainer>
            <MakeSelect
              options={ClosetOption}
              title="옷장"
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
            <MakeSelect
              options={Category}
              title="카테고리"
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
            <MakeSelect
              options={Color}
              title="색상"
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
            <ResetBtn onClick={handleResetClick}>ALL</ResetBtn>
          </SelectContainer>
          <SelectContainer>
            <Link to="/recom">
              <CodyBtn><AiFillHeart /></CodyBtn>
            </Link>
            <div>
              <InputDiv>
                <InputCon type="text" placeholder="검색하세요~" value={searchWord} onChange={handleInputChange} />
                {filteredData.length !== 0 && (
                  <FilteredInput>
                    {filteredData.map((value) => (
                      <div key={value.id}>
                        <FilteredItem onClick={() => handleItemClick(value.id)}>
                          {value.text}
                        </FilteredItem>
                      </div>
                    ))}
                  </FilteredInput>
                )}
              </InputDiv>
            </div>
            <PlusItemBtn onClick={openModal}><AiOutlinePlus /></PlusItemBtn>
          </SelectContainer>
        </MainNav>
        <Divider />
        <ListContainer userObj={userObj} selectedItems={selectedItems} selectedItemData={selectedItemData} />
      </MainContainer>
    </>
  )
};

const MainContainer = styled.div`
  width: 80vw;
  margin: 0 auto;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MainNav = styled.div`
  display: flex;
  justify-content: space-between;
`

const SelectContainer = styled.div`
  margin-top: 4rem;
  display: flex;
`
const ResetBtn = styled.button`
  border: 0.1rem solid coral;
  border-radius: 0.8rem;
  color: coral;
  background: white;
  width: 2.5rem;
  height: 2.5rem;
  &:hover{
    color: var(--color-coral);
    border: 0.1rem solid var(--color-coral);
  }
`

const PlusItemBtn = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 0.1rem solid coral;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: coral;
  &:hover{
    color: var(--color-coral);
    border: 0.1rem solid var(--color-coral);
  }
`

const CodyBtn = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 0.1rem solid coral;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5rem;
  color: coral;
  &:hover{
    color: var(--color-coral);
    border: 0.1rem solid var(--color-coral);
  }
`

const InputDiv = styled.div`
  position: relative;
`

const InputCon = styled.input`
  border-radius: 5px;
  width: 11rem;
  height: 2.5rem;
  border: 0.1rem solid coral;
  padding-left: 10px;
  margin-right: 0.5rem;
  &:focus {
    outline: none;
  }
`

const FilteredInput = styled.ul`
  position: absolute;
  top: 2.7rem;
  left: 0;
  width: 11rem;
  max-height: 15rem;
  overflow-y: auto; 
  list-style: none;
  scrollbar-width: none;
  background-color: #fff;
  border: 1px solid #979797;
  padding: 0;
  margin: 0;
  &::-webkit-scrollbar {
    display: none;
  } 
`

const FilteredItem = styled.li`
  margin: 0 auto;
  padding: 0.6rem 0.9rem;
  color: #979797;
  font-size: 14px;
  cursor: pointer;
  &:hover {
  background-color: #f0f0f0;
  }
`
export default MainPage