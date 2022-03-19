import Head from 'next/head';
import GroupsAd from '../src/components/shared/GroupsAd/GroupsAd';
// import '../styles/homepage.scss';
import { useEffect, useState } from 'react';
import { BsFillTelephoneFill } from 'react-icons/bs';
// import { useNavigate } from 'react-router-dom';
import { ParallaxBanner, ParallaxProvider } from 'react-scroll-parallax';
import ContactForm from '../src/components/shared/ContactForm/ContactForm';
import InstructorCard from '../src/components/shared/InstructorCard/InstructorCard';
import ArticlesList from '../src/components/shared/ArticlesList/ArticlesList';
import Button from '../src/components/shared/Button/Button';
import karateImg from '../src/assets/karate.jpeg';
import landingPhoto from '../src/assets/landing.jpg';
// import Image from 'next/image'
import styles from './index.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { API_URL } from '../src/configs/api';

export default function Home({ instructors }) {
  const [numOfArticleItems, setNumOfArticleItems] = useState(6);
  //resize handling useEffect
  useEffect(() => {
    const handleResize = () => {
      setNumOfArticleItems(window.innerWidth > 1440 ? 6 : 4);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const description = undefined;

  const pageDescription =
    description ||
    'OYAMA KARATE w Katowicach - strona poświęcona sekcjom Sensei Michała Bodzionego w Katowicach i w Gliwicach';

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>oyama-karate.eu</title>
        <meta property='og:title' content={'oyama-karate.eu'} key='ogtitle' />
        <meta name='description' content={pageDescription} />
        <meta
          property='og:description'
          content={pageDescription}
          key='ogdesc'
        />
      </Head>
      <div className={styles.homepageContent}>
        <section className={styles.landing}>
          <img
            className={styles.landingImage}
            src={landingPhoto.src}
            alt='landing-photo'
          />
          <div className={styles.welcomeCardWrapper}>
            <div className={styles.welcomeCard}>
              <div className={styles.container}>
                <h1>
                  <span>Strona</span> <span>Sekcji</span>{' '}
                  <span>Katowice Ligota, </span> <span>Panewniki, </span>{' '}
                  <span>Podlesie </span> <span>i Gliwice</span>
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.groups}>
          <div className={styles.container}>
            <h2>U nas znajdziesz treningi dla...</h2>
            <GroupsAd />
          </div>
        </section>

        <section className={styles.annoucements}>
          <h1 data-aos='zoom-in'>ZAPISY</h1>
          <h2 className={styles.phone} data-aos='zoom-in'>
            <BsFillTelephoneFill />
            <div>600 - 383 - 727</div>
          </h2>
        </section>

        <section className={styles.contact}>
          <ParallaxProvider>
            <ParallaxBanner
              className={styles.contactParallax}
              layers={[
                {
                  image: karateImg.src,
                  amount: 0.5
                }
              ]}
              style={{
                height: '100%',
                padding: ''
              }}
            >
              <div className={styles.contactContainer}>
                <h1 data-aos='zoom-in'>Skontaktuj się z nami!</h1>
                <ContactForm animation='fade-right' btnAnimation='zoom-in' />
              </div>
            </ParallaxBanner>
          </ParallaxProvider>
        </section>

        <section className={styles.instructor}>
          <div className={styles.container}>
            <h2 data-aos='zoom-in' className={styles.instructorsHeader}>
              Instruktor i pomocnicy
            </h2>
            <div className={styles.instructorsWrapper}>
              {instructors.map((el) => (
                <InstructorCard
                  key={el.id}
                  animation={'zoom-in'}
                  instructor={el}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.newsList}>
          <div className={styles.container}>
            <h2 className={styles.newsH2} data-aos='zoom-in'>
              Aktualności
            </h2>

            <ArticlesList
              className={styles.articlesList}
              numberOfItems={numOfArticleItems}
              animation='zoom-in'
              additionalClass={styles.articlesContainer}
            />

            <div className={styles.newsBtn}>
              <Button
                text='Więcej aktualności'
                onClick={
                  () => {}
                  // navigate('/wszystkie-aktualnosci', { replace: true })
                }
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// This also gets called at build time
export async function getStaticProps() {
  const data = await axios.get(`${API_URL}/instructors`);

  return { props: { instructors: data.data.data || {} }, revalidate: 3600 };
}
