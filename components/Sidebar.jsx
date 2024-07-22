import React from 'react'
import Logo from './elements/Logo'
import Navigator from './elements/Navigator'
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../store/userSlice.js";
import app from "../firebase";
import { useRouter } from "next/navigation";
import ChatRooms from './ChatRooms';


const Sidebar = ({children}) => {


  const { push } = useRouter();
  const auth= getAuth(app);
  const dispatch = useDispatch();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {  //user 정보를 가져오고 user에 auth가 바뀔때마다 실행
    if(user) {  //로그인이 되었으며
      push("/");
      // <Link  href={"/"}></Link>

      dispatch(setUser({   // 이 셋 파라미터가 이해가 안간다.??
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL

      })) //userSlice에 액션함수를 생성 후 넣어준다
    } else {
      push("/login");
      dispatch(clearUser());
    }
  })

  return () => {
    unsubscribe();
  }
}, [])

  return (
    <div className='flex flex-row h-full'>
        <nav className='w-[240px] border-r-[1px] border-neutral-600'>
            <div className='p-[24px]'>
                <Logo />
            </div>
            <div>
               <ChatRooms />
                </div>
            {/* navigator가 component화  */}
        </nav>
        <div>
           {children}
        </div>
    </div>
  )
}

export default Sidebar
