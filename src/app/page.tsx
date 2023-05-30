import { auth } from '@clerk/nextjs';
import LandingPage from './landing';

export default function Home() {
  const { userId } = auth();

  return (
    <main >
      {userId ? <>{userId}</> : LandingPage()}
    </main>
  )
}
