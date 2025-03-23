import Navbar from '@/components/Navbar'
import React, { PropsWithChildren } from 'react'

function layout({children}:PropsWithChildren) {
  return (
      <>
          <Navbar/>

          { children}
      </>
  )
}

export default layout