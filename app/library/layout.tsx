import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "충주라이브러리",
  description: "충주라이브러리",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
