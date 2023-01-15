import Head from 'next/head'
import styles from '../styles/Home.module.css'
import UserData from '../src/components/UserData'

export default function Home() {
  return (
    <>
      <Head>
        <title>Azure B2C Test</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <UserData />
        </div>
      </main>
    </>
  )
}
