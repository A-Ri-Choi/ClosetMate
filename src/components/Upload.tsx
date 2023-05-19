import styled from "@emotion/styled"
import { dbService, storageService } from "./fbase"
import React, { useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import AvatarEditor from 'react-avatar-editor';
import axios from "axios";
import nearestColor from 'nearest-color';
import convertRgbToHex from 'rgb-hex';
import { BiX } from 'react-icons/bi'
import { AiOutlinePlusCircle, AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai'

interface RecommendPageProps {
  closeModal: any;
  userObj: any;
}

const Upload = ({ closeModal, userObj }: RecommendPageProps) => {
  // console.log(userObj)
  const [upload, setUpload] = useState("")
  

  const [attachment, setAttachment] = useState("")
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const [scale, setScale] = useState(1);

  const [labels, setLabels] = useState<any>('');
  const [dominantColor, setDominantColor] = useState('');
  const [imageBase64, setImageBase64] = useState<any>(null);
const [color, setColor] = useState<any>(null);

  const readFileAsBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const classifyImage = async (imageBase64:any) => {
    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_APP_GOOGLE_API_KEY}`,
        {
          requests: [
            {
              image: {
                content: imageBase64.split(',')[1], // 이미지 데이터에서 base64 부분 추출
              },
              features: [
                {
                  type: 'LABEL_DETECTION',
                  maxResults: 10,
                },
              ],
            },
          ],
        }
      );

      const descriptions = response.data.responses[0].labelAnnotations.map((label: any) => label.description);
      const labels = classifyssImage(descriptions);
      // console.log(labels);
      setLabels(labels);
    } catch (error) {
      console.error(error);
      setLabels('');
    }
  
  };

  function classifyssImage(descriptions: any) {
    const classificationHierarchy:any = {
      상의: ['Shirt', 'T-shirt', 'Blouse', 'Top', 'Sweater', 'Hoodie', 'Cardigan', 'Sleeve'],
      하의: ['Pants', 'Jeans', 'Trousers', 'Shorts', 'Skirt', 'Leggings'],
      아우터: ['Coat', 'Jacket', 'Blazer', 'Outerwear', 'Parka', 'Windbreaker'],
      신발: ['Shoes', 'Sneakers', 'Boots', 'Sandals', 'Heels', 'Flats'],
      액세서리: ['Hat', 'Cap', 'Scarf', 'Gloves', 'Sunglasses', 'Earrings', 'Necklace', 'Bracelet', 'Watch', 'Bag'],
      원피스: ['Dress', 'Gown', 'Jumpsuit'],
    };
  
    let classifiedImage = '기타';
  
    for (const category in classificationHierarchy) {
      const keywords = classificationHierarchy[category];
      const matchedKeywords = descriptions.filter((description: any) => keywords.includes(description));
  
      if (matchedKeywords.length > 0) {
        classifiedImage = category;
        break;
      }
    }
  
    return classifiedImage;
  }

  const getDominantColors = async (imageUrl: string) => {
    try {
      const response = await axios.post(
        'https://vision.googleapis.com/v1/images:annotate',
        {
          requests: [
            {
              image: {
                content: imageUrl.split(',')[1], // base64 데이터 추출
              },
              features: [
                {
                  type: 'IMAGE_PROPERTIES',
                  maxResults: 10,
                },
              ],
            },
          ],
        },
        {
          params: {
            key: import.meta.env.VITE_APP_GOOGLE_API_KEY,
          },
        }
      );
  
      const colors =
      response.data.responses[0].imagePropertiesAnnotation?.dominantColors?.colors;

    if (!colors || colors.length === 0) {
      console.log('No dominant colors found in the image.');
    }

  
    const { red, green, blue } = colors[0].color;
    const hexColor = convertRgbToHex(red, green, blue);
    const nearest = nearestColor.from({
      빨강: '#FF0000',
      초록: '#00FF00',
      파랑: '#0000FF',
      검정: '#000000',
      하양: '#FFFFFF',
      노랑: '#FFFF00',
      베이지: '#ddcbaa',
      그레이: '#717171',
      브라운: '#876243',
      퍼플: '#460080',
      핑크: '#ff42b0',
    });
    
    const colorName = nearest(hexColor);
    setDominantColor(colorName.name); // 색상 이름만 저장

  } catch (error) {
    console.error(error);
    setDominantColor('');
  }
  };
  
  const editorRef:any = useRef(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageBase64 = await readFileAsBase64(file);
      if (typeof imageBase64 === 'string') {
        setImageBase64(imageBase64);
        const labels = await classifyImage(imageBase64);
        setLabels(labels);
        const color = await getDominantColors(imageBase64);
        setColor(color);
        setSelectedImage(URL.createObjectURL(file));
      }
    }
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
  };

  const handleCropImage = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImage();
      setAttachment(canvas.toDataURL());
      setSelectedImage(null); // 이미지 편집 완료 후 숨김 처리
  
      // 이미지 분류 및 색상 분류 수행
      classifyImage(canvas.toDataURL());
      getDominantColors(canvas.toDataURL());
    }
  };
  

  const fileInputRef = React.createRef<HTMLInputElement>();


  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  let attachmentUrl = ""
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!attachment) {
      setErrorMessage('이미지를 업로드해주세요!');
      return;
    }
    else if (!upload) {
      setErrorMessage('이름을 입력해주세요!');
      return;
    } else {

    const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
    const response = await attachmentRef.putString(attachment, "data_url")
    attachmentUrl = await response.ref.getDownloadURL()
    const uploadObj = {
      text: upload,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
      location: location,
      color: dominantColor,
      category: labels,
    }
    await dbService.collection(`${userObj.uid}`).add(uploadObj)
    setUpload("")
    setAttachment("")
    setLocation("제1옷장");
    closeModal()
  }

  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event

    if (/^[a-zA-Z]+$/.test(value)) {
    if (value.length <= 20) {
      setUpload(value);
    } 
  } else {
    if (value.length <= 13) {
      setUpload(value);
    } 
  }

  }

  const [location, setLocation] = useState('제1옷장');

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };

  const handleClearAttachment = () => {
    setAttachment("");
  };


  return(
    <>
    <UploadContainer onSubmit={onSubmit}>
      <CloseBtn onClick={closeModal}><BiX /></CloseBtn>
      <DetailContainer>
        <DetailImgCon>
          {selectedImage && (
            <EditorCon>
              <AvatarEditor
                ref={editorRef}
                image={selectedImage}
                width={290}
                height={290}
                // border={50}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
                borderRadius={100}
              />
              <CropImageBtn>
                <div>
                <CropBtn onClick={handleZoomIn}><AiOutlineZoomIn /></CropBtn>
                <ZoomBtn onClick={handleZoomOut}><AiOutlineZoomOut /></ZoomBtn>
                </div>
                <div>
                <CropBtn onClick={handleCropImage}>Crop Image</CropBtn>
                </div>
              </CropImageBtn>
            </EditorCon>
          )}
          {!selectedImage && (
            <>
              {attachment && (
                <>
                  <DetailImg src={attachment} />
                  <ClearButton onClick={handleClearAttachment}>Clear</ClearButton>
                </>
              )}
              {!attachment && (
                <PlusButton showButton={!attachment} onClick={handleFileClick}>
                  <AiOutlinePlusCircle />
                </PlusButton>
              )}
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} />
        </DetailImgCon>
        <DetailContent>
          <DetailP>
            이름 : <DetailInput 
            value={upload} 
            type="text" 
            placeholder="멋진 노랑 슬리브"
            onChange={onChange}
            />
          </DetailP>
          <DetailP>
            위치 :
            <DetailSelect value={location} onChange={handleLocationChange}>
              <option value="제1옷장">제1옷장</option>
              <option value="제2옷장">제2옷장</option>
              <option value="제3옷장">제3옷장</option>
            </DetailSelect>
          </DetailP>
          <DetailCon>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <DetailSubmit type="submit" value="업로드" />
          </DetailCon>
        </DetailContent>
      </DetailContainer>
    </UploadContainer>
    </>
  )
}


const ErrorMessage = styled.div`
  text-align: center;
  color: #ff5d5d;
  margin-bottom: 1rem;
`;

const UploadContainer = styled.form`
  position: fixed;
  width: 61vw;
  height: 33rem;
  background: #ffd9cb;
  border-radius: 1rem;
  z-index: 99;
  margin: 0rem auto;
  left: 0;
  right: 0;
`

const CloseBtn =  styled.div`
  width: 1.5rem;
  height: 1.5rem;
  font-size: 2rem;
  margin: 1rem 2rem 1rem auto;
  color: white;
`

const DetailContainer = styled.div`
  width: 53vw;
  display: flex;
  margin: auto;
`

const DetailImgCon = styled.div`
  position: relative;
  width: 25rem;
  height: 25rem;
  border: 0.5rem solid #ffebe3;
`;

const EditorCon = styled.div`
  width: 88%;
  margin: 0 auto;
  justify-content: center;
`

const DetailImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CropImageBtn = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.1rem;
`

const CropBtn = styled.button`
  height: 2rem;
  padding: 0.5rem;
  background: none;
  border: 0.1rem solid gray;
  &:hover {
    background: #ffe2d7;
  }
`

const ZoomBtn = styled.button`
  height: 2rem;
  padding: 0.5rem;
  background: none;
  border: 0.1rem solid gray;
  border-left: none;
  &:hover {
    background: #ffe2d7;
  }
`

const ClearButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.2rem;
  background-color: #ccc;
  color: #fff;
  border: none;
  cursor: pointer;
`;


const PlusButton = styled.label<{ showButton: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: ${(props) => (props.showButton ? 'inline-block' : 'none')};
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
`;

const DetailContent = styled.div`
  width: 16rem;
  height: 23rem;
  margin: auto auto;
  position: relative;
`

const DetailP = styled.div`
  font-size: 1rem;
  padding-top: 2rem;
  margin-bottom: 1rem;
`

const DetailInput = styled.input`
  width: 10rem;
  height: 1.5rem;
  padding-left: 0.3rem;
`

const DetailSelect = styled.select`
  width: 5rem;
  height: 1.5rem;
  padding-left: 0.3rem;
  margin-left: 0.3rem;
`

const DetailCon = styled.div`
  width: 100%;
  padding-top: 2.2rem;
  position: absolute;
  bottom: 1rem;
`

const DetailSubmit = styled.input`
  width: 100%;
  height: 2.2rem;
  border: 0.3rem solid #ffebe3;
  border-radius: 0.8rem;
  color: white;
  background: #ffb69b;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover{
    background: #ff9e7a;
  }
`

export default Upload