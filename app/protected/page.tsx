import { redirect } from 'next/navigation'

const page = () => {
  redirect('/protected/home')
}

export default page