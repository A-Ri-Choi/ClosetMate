import styled from "@emotion/styled"
import ListCard from "./ListCard"

interface ListContainerProps {
  userObj: {
    uid: any;
  }; 
  selectedItems: any;
  selectedItemData: any;
}

const ListContainer: React.FC<ListContainerProps> = ({ userObj, selectedItems, selectedItemData }) => {
  return (
    <ListCon>
      <List>
        <ListCard userObj={userObj} selectedItems={selectedItems} selectedItemData={selectedItemData} />
      </List>
    </ListCon>
  );
};

const ListCon = styled.div`
    width: 80vw;
`

const List = styled.ul`
  list-style: none;
  padding: 0rem;
  margin: 2rem;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2.2rem;
`


export default ListContainer