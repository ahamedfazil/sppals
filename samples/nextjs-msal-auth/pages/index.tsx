import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import LogIn from '../src/components/LogIn';
import Logout from '../src/components/Logout';
import Welcome from '../src/components/Welcome';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [userName, setUserName] = useState<string>("");
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  useEffect(() => {
    if (activeAccount) {
      setUserName(activeAccount.username);
    } else {
      setUserName("");
    }
  }, [activeAccount]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Welcome />
        {userName ? <>
          <Logout />
        </> : <LogIn />}
      </main>

      <footer className={styles.footer}>
        This is footer
      </footer>
    </div>
  )
}
