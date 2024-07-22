// eslint-disable-next-line no-unused-vars
"use client"
import React, { useEffect, useState, useRef } from 'react';
import MessageHeader from '../../components/MessageHeader.jsx';
import MessageForm from '../../components/MessageForm.jsx';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import app from '../../firebase.js';
import Message from '../../components/Message.jsx'
import { getFirestore, collection, doc, setDoc, onSnapshot, query} from "firebase/firestore";
import { setUserPosts } from '../../store/chatRoomSlice.js';


const Page = () => {
  const db2 = getFirestore(app);
  // const tweetsQuery = query(collection(db2, "chatRooms", "인내", "messages"));

  const [message, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const { currentChatRoom } = useSelector(state => state.chatRoom);
  const { currentUser } = useSelector(state => state.user)
  const messageEndRef = useRef(null);
  const { isPrivateChatRoom } = useSelector(state => state.chatRoom);
  const dispatch = useDispatch();

  useEffect(() => {
    messageEndRef.current.scrollIntoView();
  })

  useEffect(() => {
    if(currentChatRoom.id) {
      addMessagesListener(currentChatRoom.id)
      addTypingListeners(currentChatRoom.id)
    }

    return () => {
      // off(tweetsQuery);
    }
  }, [currentChatRoom.id])

  const addTypingListeners = async (chatRoomId) => {
    const typingQuery = doc(db2, "typing", chatRoomId);
    await onSnapshot(typingQuery, (snapshot) => { // <---- 
      if (snapshot.data().typing.length > 0) {
        const chatRoomIds = snapshot.data().typing;
        setTypingUsers(chatRoomIds); 
       } else {
         // docSnap.data() will be undefined in this case
         setTypingUsers([]); 
       }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);

    handleSearchMessage(event.target.value)
  }

  const handleSearchMessage = (searchTerm) => {
    const chatRoomMessages = [...message];
    const regex = new RegExp(searchTerm, 'gi');
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if(
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setSearchLoading(false); 
  }

  const addMessagesListener = async (chatRoomId) => {
    const tweetsQuery = !isPrivateChatRoom
    ? query(collection(db2, "chatRooms", chatRoomId, "messages"))
    : query(collection(db2, "direct", chatRoomId, "messages"));
    await onSnapshot(tweetsQuery, (snapshot) => { // <---- 
      const tweetList = snapshot.docs.map((doc) => {
        const { image, content, timestamp, user } = doc.data();
        return {
          image,
          content,
          timestamp,
          user
        };
      });
        setMessages(tweetList);
        setMessagesLoading(false);
        userPostsCount(tweetList);
    });
  };


  const userPostsCount = (messages) => {
    const userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1
        }
      }
      return acc;
    }, {})
    dispatch(setUserPosts(userPosts))
  }

  const renderMessages = (messages) => {
    return messages.length > 0 && messages.map((message) => (
      <Message
         key={message.timestamp}
         message={message}
         user={currentUser}
         />
    ))
  }

  const renderTypingUsers = (typingUsers) =>
    typingUsers.length > 0 &&
    typingUsers.map(users => (
      <span key={users}>
        {users}님이 채팅을 입력하고 있습니다...
      </span>
    ))


  // const renderMessageSkeleton = (loading) => 
  // loading && (
  //   <>
  //   {[...Array(13)].map((_, i) => (
  //      <Skeleton key={i} />
  //   ))}
  //   </>
  // )

  return (
    <div style={{ padding: '2rem 2rem 0 2rem' }}>
      <MessageHeader handleSearchChange={handleSearchChange}/>

      <div style={{
                width: '100%',
                height: '567px',
                border: '.2rem solid #ececec',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem',
                overflowY: 'auto'
            }}>
       {/* {renderMessageSkeleton(messagesLoading)}
       {searchLoading && <div>loading...</div>} */}

       {searchTerm ? renderMessages(searchResults) : renderMessages(message)}
       {renderTypingUsers(typingUsers)}
       <div ref={messageEndRef} />
      </div>


      <MessageForm />
    </div>
  )
}

export default Page;
