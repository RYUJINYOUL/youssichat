import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "충주사랑방",
  description: "충주사랑방",
};

const layout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
