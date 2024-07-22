import React from 'react'
import Link from "next/link";

const Navigator = () => {
  return (
    <div>
      <Link href={'/library'} style={{ color: 'gray', textDecoration: 'none'}}>아직 아이디가 없다면...</Link> 
      Navigator
    </div>
  )
}

export default Navigator
