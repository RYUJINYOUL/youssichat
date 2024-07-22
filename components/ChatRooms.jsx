import React, { useEffect, useState } from 'react'
import { FaPlus, FaRegSmileWink } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useDispatch, useSelector } from 'react-redux';
import { getFirestore, collection, doc, setDoc, onSnapshot, query} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import app from '/Users/youssipro/youssi_chat/firebase.js';
import { setCurrentChatRoom, setPrivateChatRoom } from '/Users/youssipro/youssi_chat/store/chatRoomSlice.js';


const ChatRooms = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // const chatRoomsRef = dbRef(db, "chatRooms");  //realtime
  const db2 = getFirestore(app);
  const auth = getAuth(app);

  const [chatRooms, setChatRooms] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [count, setCount] = useState(0);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");

  const { currentUser } = useSelector(state => state.user);
  const { currentChatRoom } = useSelector(state => state.chatRoom);
  // const chatRoomsRef = doc(collection(db2, "chatRooms")); 
  // const chatRoomsRef = doc(db2, "chatRooms", "dkdkdkdkdkdkdk"); 
  const tweetsQuery = query(collection(db2, 'chatRooms'));
  
  const dispatch = useDispatch();
  

  useEffect(() => {
    AddChatRoomsListeners();
    renderChatRooms();
    console.log("rerendering 중 ....")
    // return () => {
    //   off(tweetsQuery)
    // }
  }, [currentChatRoom])  //빈배열 시 mount될 때만 실행

  const handleSubmit = async (e) => {

    const user = auth.currentUser;
   
    e.preventDefault();
    
    if (isFormValid(name, description)) {
      const chatRoomsRef = doc(db2, "chatRooms", name); 
      try{
        await setDoc(chatRoomsRef, {
          id: chatRoomsRef.id,
          name: name,
          description: description,
          typing: [],
          createdBy: {
            name: currentUser.displayName,
            image: currentUser.photoURL
          }
        });
        setName('');
        setDescription('');
        setShow(false);
      } catch(error) {
        alert(error);
      }
}
  }


  const AddChatRoomsListeners = async () => {
    await onSnapshot(tweetsQuery, (snapshot) => { // <----    //onsnapshot을 하면서 데이터가 살아졌다가 다시 제공됨 unmount됨
      const tweetList = snapshot.docs.map((doc) => {          //그렇다면 값이 변하면 unmount되므로 작성중은 어려움
        const { id, name, description, createdBy, typing } = doc.data();
        return {
          id,
          name,
          description,
          createdBy,
          typing
        };
      });
      setChatRooms(tweetList);
      // setName2(tweetList.name)  
      setFirstChatRoom(tweetList);
    });
  };

  const setFirstChatRoom = (chatRooms) => {
    const firstChatRoom = chatRooms[0];
    if (firstLoad && chatRooms.length > 0) {   //
      dispatch(setCurrentChatRoom(firstChatRoom));
      dispatch(setPrivateChatRoom(false));
      setActiveChatRoomId(firstChatRoom.id);   //선택??
  }
  setFirstLoad(false);
  }


  const isFormValid = (name, description) =>  //name과 description이 있는지 유효성 검사 있으면 true
    name && description;

    const changeChatRoom = (room) => {
      dispatch(setCurrentChatRoom(room));
      dispatch(setPrivateChatRoom(false));
      setActiveChatRoomId(room.id);
    }

  const renderChatRooms = () =>
      chatRooms.length > 0 &&
      chatRooms.map(room => (
        <li
                key={room.id}
                style={{
                    backgroundColor: room.id === activeChatRoomId && "#ffffff45"
                }}
                onClick={() => changeChatRoom(room)}
            >
                # {room.name}
            </li>
        ))
    

  return (
    <div>
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}>

      <FaRegSmileWink style={{ marginRight: 3}} />
      CHAT ROOMS {" "}

      <FaPlus 
       style={{ position: 
        'absolute', right: 0, cursor: 'pointer'}}
      onClick={() => setShow(!show)} />  

    </div>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {renderChatRooms()}
        </ul>

    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>채팅 방 생성하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>방 이름</Form.Label>
            <Form.Control
            onChange={(e) => setName(e.target.value)}
            type='text'
            placeholder='채팅 방 이름을 입력하세요'
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>방 이름</Form.Label>
            <Form.Control
            onChange={(e) => setDescription(e.target.value)}
            type='text'
            placeholder='채팅 방 설명을 작성하세요'
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          취소
        </Button>
        <Button variant='primary' onClick={handleSubmit}>
          생성
        </Button>
      </Modal.Footer>
    </Modal>
    
    </div>
  )
}

export default ChatRooms
