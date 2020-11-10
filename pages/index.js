import Head from 'next/head'
import Nav from '../components/nav'
import styles from '../styles/Home.module.css'

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Nav></Nav>
      <main className={styles.main}>
        <h1 className={styles.title}>
         Home
        </h1>
        
      </main>

      
    </div>
  )
}
