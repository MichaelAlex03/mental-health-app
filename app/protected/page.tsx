import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
  redirect('/protected/home')
}

export default page