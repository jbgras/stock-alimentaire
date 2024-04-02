import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDQbjNHCL7TtYLSmbqIZI3a8w19W-xbnk",
  authDomain: "la-boussole-vancouver.firebaseapp.com",
  projectId: "la-boussole-vancouver",
  storageBucket: "la-boussole-vancouver.appspot.com",
  messagingSenderId: "305758368045",
  appId: "1:305758368045:web:a0420abb77215d03d9a3a4",
  measurementId: "G-8CXML2B1VH",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//connectFirestoreEmulator(db, 'localhost', 8080); // emulator

//CREATE hook (post new article to api)
export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newArticleInfo) => {
      queryClient.setQueryData(["article"], (prevArticles) => [
        ...prevArticles,
        {
          ...newArticleInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
  });
}

//READ hook (get articles from api)
export function useGetArticles() {
  return useQuery({
    queryKey: ["article"],
    queryFn: async () => {
      const inventoryCol = collection(db, "articles");
      const inventorySnapshot = await getDocs(inventoryCol);
      let inventoryList = inventorySnapshot.docs.map((doc) => {
        const inventory = doc.data();

        return {
          ...inventory,
          entryDate: !!inventory.entryDate
            ? new Date(inventory.entryDate.seconds * 1000)
                .toISOString()
                .substring(0, 10)
            : null,
        };
      });
      return inventoryList;
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put article in api)
export function useUpdateArticles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newArticles) => {
      queryClient.setQueryData(["article"], (prevArticles) =>
        prevArticles?.map((article) => {
          const newArticle = newArticles.find((u) => u.GTIN === article.GTIN);
          return newArticle ? newArticle : article;
        })
      );
    },
  });
}

//DELETE hook (delete article in api)
export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (articleId) => {
      queryClient.setQueryData(["article"], (prevArticles) =>
        prevArticles?.filter((article) => article.GTIN !== articleId)
      );
    },
  });
}
