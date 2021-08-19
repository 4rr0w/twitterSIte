import { Fade } from "react-reveal";
import styles from "./style.module.css";
export const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.rowBanner}>
        <div className={styles.banner}>
          <Fade bottom>
            <h1 className="responsive-headline">Name Here</h1>
          </Fade>
          <Fade bottom duration={1200}>
            <h3>Description here</h3>
          </Fade>
        </div>
      </div>
    </div>
  );
};
