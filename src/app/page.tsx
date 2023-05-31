import { auth } from '@clerk/nextjs';
import LandingPage from './landing';

export default function Home() {
  const { userId, user } = auth();
  const primaryEmail = "mehmet@mehmetfd.dev"

  //const primaryEmail = user?.emailAddresses[0].emailAddress
  return (
    <main >
      {userId ?
        <div className='flex flex-col justify-center items-center pt-8 md:p-8 md:flex-1'>
          <h1 className='text-6xl text-center break-all'>Hello, {primaryEmail}</h1>
          <section className='bg-gray-900 m-2 p-8 lg:mt-12 md:rounded-md w-full md:w-11/12 lg:w-2/3 xl:w-1/2'>
            <h2 className='text-4xl mb-4'>Your Courses</h2>
            <ul className=''>
              <li className='text-2xl'>Course 1</li>
              <li className='text-2xl'>Course 2</li>
              <li className='text-2xl'>Course 3</li>
              <li className='text-2xl'>Course 4</li>
              <li className='text-2xl'>Course 5</li>
            </ul>
          </section>
        </div>
        : LandingPage()}
    </main>
  )
}
