import Head from "next/head";
import Nav from "../components/nav";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Home</h1>
      </main>
    </div>
  );
}
