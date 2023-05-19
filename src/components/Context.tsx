import { createContext, useState, useEffect } from 'react';
import { dbService } from './fbase';

export interface FavoriteItem {
  상의: string;
  하의: string;
}

interface FavoriteContextValue {
  favoriteItems: FavoriteItem[];
  setFavoriteItems: React.Dispatch<React.SetStateAction<FavoriteItem[]>>;
}

interface FavoriteProviderProps {
  userObj: any ;
  children: React.ReactNode;
}

export const FavoriteContext = createContext<FavoriteContextValue>({
  favoriteItems: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFavoriteItems: () => {},
});

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({
  children,
  userObj,
}) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isFavoriteDocExists, setIsFavoriteDocExists] = useState(false);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      try {
        if (userObj) {
          const docRef = dbService.collection(userObj.uid).doc('favorites');
          const doc = await docRef.get();
          if (doc.exists) {
            setIsFavoriteDocExists(true);
            const data = doc.data();
            if (data) {
              setFavoriteItems(data.items as FavoriteItem[]);
            }
          } else {
            await docRef.set({ items: [] });
            setIsFavoriteDocExists(true);
            setFavoriteItems([]);
          }
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchFavoriteItems();
  }, [userObj]);

  const saveFavoriteItems = async () => {
    try {
      const flattenedItems = favoriteItems.flat();
      if (userObj) {
        await dbService.collection(userObj.uid).doc('favorites').set({
          items: flattenedItems,
        });
        console.log('Favorite items saved successfully.');
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (isFavoriteDocExists) {
      saveFavoriteItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteItems]);

  return (
    <FavoriteContext.Provider value={{ favoriteItems, setFavoriteItems }}>
      {children}
    </FavoriteContext.Provider>
  );
};
