import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "충주사랑방",
  description: "충주사랑방",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
