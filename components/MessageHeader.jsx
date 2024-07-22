import React, { useState, useEffect, useRef } from 'react'
import { Accordion, FormControl, InputGroup, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import { FaLock } from 'react-icons/fa';
import { FaLockOpen } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { 
    getFirestore, collection, getDocs, doc, setDoc, Timestamp, onSnapshot,
    getDoc, deleteDoc, updateDoc, serverTimestamp, query, arrayUnion, arrayRemove,
    orderBy} from "firebase/firestore";
import app, { db, storage } from '../firebase';

const MessageHeader = ({handleSearchChange}) => {

  const db2 = getFirestore(app);
  const { currentChatRoom } = useSelector(state => state.chatRoom);
  const { isPrivateChatRoom } = useSelector(state => state.chatRoom);
  const [isFavorite, setIsFavorite] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const { userPosts } = useSelector(state => state.chatRoom);  
 

  useEffect(() => {
    if(currentChatRoom.id && currentUser?.uid) {
      addFavoriteListener(currentChatRoom.id, currentUser.uid);
    }
  }, [currentChatRoom.id])


const addFavoriteListener = async (chatRoomId, userId) => {
    const tweetsQuery = doc(db2, "users", userId);
    await onSnapshot(tweetsQuery, (snapshot) => {
    if (snapshot.exists()) {
       const chatRoomIds = snapshot.data().liked;
       const isAlreadyFavorite = chatRoomIds.includes(chatRoomId);
       setIsFavorite(isAlreadyFavorite);         
      } else {
        // docSnap.data() will be undefined in this case
        console.log("문서가 없습니다.");
      }
    });
};
 

const handleFavorite = async () => {      //클릭을 했는데 addFavorite이 작동안함
    const usersRef = doc(db2, "users", currentUser.uid);
    if (isFavorite) {
        setIsFavorite(false);
        await updateDoc(usersRef, {
            liked: arrayRemove(currentChatRoom.id)
          });
    } else {
        setIsFavorite(true);
        await updateDoc(usersRef, {
            liked: arrayUnion(currentChatRoom.id)
          });
    }
}


const renderUserPosts = (userPosts) => 
  Object.entries(userPosts)
.sort((a, b) => b[1].count - a[1].count)
.map(([key, val], i) => (
  <div key={i} style={{ display: 'flex'}}>
    <Image
      style={{ width: 45, height: 45, marginRight:10 }}
      roundedCircle
      src={val.image}
      alt={key}
      />
      <div>
        <h6>{key}</h6>
        <p>
          {val.count}개
        </p>
      </div>
  </div>
))


  return (
    <div style={{
      width: '100%',
      height: '190px',
      border: '.2rem solid #ececec',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem'
  }} >
       <Row>
                <Col>        
                <h2>
                        {isPrivateChatRoom ?
                            <FaLock style={{ marginBottom: '10px' }} />
                            :
                            <FaLockOpen style={{ marginBottom: '10px' }} />
                        }
                        {" "}
                        {currentChatRoom && <span>{currentChatRoom.name}</span>}
                        {" "}
                        {!isPrivateChatRoom &&
                            <span style={{ cursor: 'pointer' }} onClick={handleFavorite}>
                                {isFavorite ?
                                    <MdFavorite style={{ marginBottom: '10px' }} />
                                    :
                                    <MdFavoriteBorder style={{ marginBottom: '10px' }} />
                                }
                            </span>
                        }
                    </h2>
                </Col>

                <Col>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">
                            <AiOutlineSearch />
                        </InputGroup.Text>
                        <FormControl
                            onChange={handleSearchChange}
                            placeholder="Search Messages"
                            aria-label="Search"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </Col>
            </Row>

            {!isPrivateChatRoom &&
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Image
                        src={currentChatRoom?.createdBy.image}
                        style={{ width: '30px', height: '30px', marginRight: 7 }}
                        roundedCircle
                    />{" "}
                    <p>{currentChatRoom?.createdBy.name}</p>
                </div>
            }

        <Row>
          <Col>
          <Accordion>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Description</Accordion.Header>
            <Accordion.Collapse eventKey='0'>
              <Accordion.Body>
                {currentChatRoom?.description}
              </Accordion.Body>
            </Accordion.Collapse>
            </Accordion.Item>
            </Accordion>
            </Col>
            <Col>
          <Accordion>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Posts Count</Accordion.Header>
            <Accordion.Collapse eventKey='0'>
              <Accordion.Body>
                {userPosts && renderUserPosts(userPosts)}
              </Accordion.Body>
            </Accordion.Collapse>
            </Accordion.Item>
            </Accordion>
            </Col>
        </Row>

    </div>
  )
}

export default MessageHeader
