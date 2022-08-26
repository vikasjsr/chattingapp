import React, { useEffect, useRef, useState } from "react";
import {Box, Container,Input,HStack , VStack, Button} from '@chakra-ui/react'
import Message from "./component/Message";
import 
{onAuthStateChanged,
     signOut,
          getAuth, 
            GoogleAuthProvider,
               signInWithPopup} from "firebase/auth"


import {app} from "./firebase"
import {addDoc, 
        collection, 
        getFirestore, 
        serverTimestamp,
        onSnapshot,
      query,
    orderBy  } from "firebase/firestore"

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () =>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}

const logoutHandler = () => signOut(auth);



function App() {


  const [user, setUser] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  useEffect(() =>{

  const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

  const unsubscribe =  onAuthStateChanged(auth, (data) =>{
      setUser(data);
    });

    const unsubscribeForMessage =  onSnapshot(q, (snap)=>{
      setMessages(
        snap.docs.map((item) => {
  
          const id = item.id;
          return {id , ...item.data()}
  
        })
      );
    });

    return ()=>{
      unsubscribe();
      unsubscribeForMessage();
    };
  }, [])

  const submitHandler = async(e) => {
    e.preventDefault();
  
    try {
      await addDoc(collection(db, "Messages"), {
        text : message,
        uid : user.uid,
        uri : user.photoURL,
        createdAt : serverTimestamp()
      })
      setMessage("");
      divForScroll.current.scrollIntoView({behaviour : "smooth"});

    } catch (error) {
      alert(error);
    }
  
  }

  return (
    <Box bg={"red.50"}>
       {
        user ? (
          <Container h={"100vh"} bg ={"purple.100"} >

        <VStack h={"full"} padding={"2"} >
          <Button onClick={logoutHandler} colorScheme={"red"} w = {"full"}>Logout</Button>

          <VStack 
            h={"full"}
            w={"full"}
            overflowY={"auto"}
            css = {{"&::-webkit-scrollbar":{
             display:"none",
          },}}>
            { messages.map((item) =>(
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"} 
                  text ={item.text} 
                  uri ={item.uri} />

              ))}
            <div ref={divForScroll}></div>
          </VStack>

          <form onSubmit={submitHandler} style={{width : "100%"}}>
            <HStack>
              <Input 
                value={message} 
                onChange={(e)=>setMessage(e.target.value)} 
                placeholder="Enter a message"/>
              <Button 
              type="submit" 
              colorScheme={"purple"}>Send</Button>
            </HStack> 
          </form>
        </VStack>
         
       </Container>
        ):(
          <VStack bg={"white"} justifyContent={"center"} h = {"100vh"}>
            <Button onClick={loginHandler} colorScheme={"purple"}>Sign in With Goggle</Button>
          </VStack>
        )
       } 
    </Box>
  );
}

export default App;
