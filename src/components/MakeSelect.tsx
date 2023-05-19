import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import { FiChevronUp } from "react-icons/fi"

interface MakeSelectProps {
  options: any;
  title: any;
  selectedItems: any;
  setSelectedItems: any;
}

const MakeSelect: React.FC<MakeSelectProps> = ({
  options,
  title,
  selectedItems,
  setSelectedItems,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDropdownItemClick = (item: any) => {
    const { value } = item;
    setSelectedItems((prevSelectedItems: any) => {
      const isItemIncluded = prevSelectedItems.some(
        (selectedItem: any) => selectedItem.value === value
      );
      if (isItemIncluded) {
        return prevSelectedItems.filter(
          (selectedItem: any) => selectedItem.value !== value
        );
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <CustomSelect ref={selectRef}>
      <SelectBox onClick={handleDropdownToggle}>
        <SelectedText>
          <span>{title}</span>
        </SelectedText>
        <StyledSpan isExpanded={isExpanded} selected={false}>
          <FiChevronUp />
        </StyledSpan>
      </SelectBox>
      {isExpanded && (
        <Dropdown>
          {options.map((item: any) => (
            <DropdownItem
              key={item.value}
              selected={selectedItems.some(
                (selectedItem: any) => selectedItem.value === item.value
              )}
              onClick={() => handleDropdownItemClick(item)} isExpanded={false}>
              {item.name}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </CustomSelect>
  );
};


const CustomSelect = styled.div`
  position: relative;
  width: 7rem;
`;

const SelectBox = styled.div`
  display: flex;
  height: 2.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.7rem;
  color: white;
  background: coral;
  border-radius: 5px;
  margin-right: 0.5rem;
  cursor: pointer;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 2.7rem;
  left: 0;
  width: 8.2rem;
  overflow-y: auto;
  list-style: none;
  scrollbar-width: none;
  background-color: #fff;
  border: 0.1rem solid coral;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;
  animation: 0.2s ease-in;
  &::-webkit-scrollbar {
    display: none;
  }
  
`;

interface DropdownItemProps {
  selected: boolean;
  isExpanded: boolean;
}

const DropdownItem = styled.li<DropdownItemProps>`
  margin: 0 auto;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }

  ${({ selected }) =>
    selected &&
    `
    background-color: #e3e3e3;
  `}
`;

const SelectedText = styled.div`
  margin: 0;
`;

const StyledSpan = styled.span<DropdownItemProps>`
width: 1rem;
height: 1rem;
  transition: transform 0.2s ease-out;
  ${({ isExpanded }) =>
    isExpanded &&
    `
    transform: rotate(180deg);
  `}
`;


export default MakeSelect;
