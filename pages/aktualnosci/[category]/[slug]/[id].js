// const router = useRouter()
//   const { pid } = router.query

import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsFacebook, BsWhatsapp, BsInstagram } from 'react-icons/bs';
import { FiLink } from 'react-icons/fi';
import { FacebookShareButton, WhatsappShareButton } from 'react-share';
import ArticleListContainer from '../../../../src/components/shared/ArticleListContainer/ArticleListContainer';
import Loader from '../../../../src/components/shared/Loader/Loader';
import { API_UPLOADS_URL, API_URL } from '../../../../src/configs/api';
import { getNavConfig } from '../../../../src/configs/nav';
import styles from './index.module.scss';

const ArticlePage = ({ firstArticle, pageDescription }) => {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArtcile] = useState(firstArticle);
  const [loader, setLoader] = useState(false);

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  function copyTextToClipboard(text) {
    if (typeof navigator !== 'undefined' && !navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text).then(
        function () {
          console.log('Async: Copying to clipboard was successful!');
        },
        function (err) {
          console.error('Async: Could not copy text: ', err);
        }
      );
    }
  }

  useEffect(async () => {
    setLoader(true);
    const data = await axios.get(`${API_URL}/articles/${id}`);
    setArtcile(data.data.data);
    setLoader(false);
  }, [id]);

  const generateTags = (tags) => {
    let result = '';
    tags.map((el) => `#${el} `);
    return result;
  };

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>
          Oyama Karate Katowice - Ligota - Panewniki - Piotrowice - Podlesie,
          oraz Gliwice - Oyama-karate.eu - Aktualno??ci - oyama-karate.eu
        </title>
        <meta
          property='og:title'
          content={`Oyama Karate Katowice - Ligota - Panewniki - Piotrowice - Podlesie,
          oraz Gliwice - Oyama-karate.eu - Aktualno??ci - oyama-karate.eu`}
          key='ogtitle'
        />
        <meta key='robots' name='robots' content='index,follow' />
        <meta key='googlebot' name='googlebot' content='index,follow' />
        <meta name='description' content={pageDescription} />
        <meta
          property='og:description'
          content={pageDescription}
          key='ogdesc'
        />
      </Head>
      {loader && <Loader />}
      {article && (
        <section className={styles.articlePage}>
          <div className={styles.articlePageGridContainer}>
            <div className={styles.container}>
              <article className={styles.articleContainer}>
                <header>
                  <h1>{article.title}</h1>
                  <section className={styles.dateAndShareContainer}>
                    <p className={styles.articleDate}>
                      <span className={styles.paddingRight}>
                        Kategoria: {article.categoryName}
                      </span>
                      |
                      <span className={styles.paddingLeft}>
                        Dodano:{' '}
                        {new Date(
                          article.createdAt.slice(0, 10)
                        ).toLocaleDateString('pl')}
                      </span>
                    </p>
                    <div className={styles.shareContainer}>
                      <FacebookShareButton
                        url={
                          typeof window !== 'undefined' && window.location.href
                        }
                        hashtag={generateTags(article.tags)}
                        quote='Udost??pnij artyku?? przez facebooka!'
                      >
                        <BsFacebook className={styles.mediaIcon} />
                      </FacebookShareButton>
                      <BsInstagram className={styles.mediaIcon} />

                      <WhatsappShareButton
                        url={
                          typeof window !== 'undefined' && window.location.href
                        }
                        hashtag={generateTags(article.tags)}
                        quote='Udost??pnij artyku?? przez facebooka!'
                      >
                        <BsWhatsapp className={styles.mediaIcon} />
                      </WhatsappShareButton>
                      <div
                        onClick={copyTextToClipboard(
                          typeof window !== 'undefined' && window.location.href
                        )}
                      >
                        <FiLink className={styles.mediaIcon} />
                      </div>
                      <a href=''></a>
                    </div>
                  </section>
                  <img
                    src={`${API_UPLOADS_URL}/articles/${article.bigImgUrl}`}
                    alt={article.bigImgAlt}
                    className={styles.articleImage}
                  />
                </header>
                <main>
                  <div className={styles.articleTagsListContainer}>
                    <ul className={styles.articleTagsList}>
                      {article.tags.map((el) => (
                        <li className={styles.articleTag} key={el}>
                          {el}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.articleCategory}></div>
                  <div className={styles.articleText}>
                    <div
                      className='ql-editor'
                      dangerouslySetInnerHTML={{ __html: article.text }}
                    />
                  </div>
                </main>
              </article>
            </div>

            <div className={styles.articleListContainer}>
              <ArticleListContainer currentArticleId={id} />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

// This also gets called at build time
export async function getStaticProps({ params }) {
  const data = await axios.get(`${API_URL}/articles/${params.id}`);
  const navConfig = await getNavConfig();
  let pageDescription = data.data.data.pageDescription;

  if (
    !data.data.data.pageDescription ||
    data.data.data.pageDescription === ''
  ) {
    const pageDesc = await axios.get(`${API_URL}/homepage/description`);
    pageDescription = pageDesc.data.data.defaultPageDescription;
  }

  return {
    props: { firstArticle: data.data.data || {}, navConfig, pageDescription },
    revalidate: 3600
  };
}

export async function getStaticPaths() {
  const data = await axios.get(`${API_URL}/articles`);
  const params = [];
  data.data.data.forEach((el) => {
    params.push({
      params: {
        category: el.categoryName.toString().toLowerCase(),
        slug: el.slug,
        id: el.id
      }
    });
  });

  return {
    paths: params,
    fallback: true // false or 'blocking'
  };
}

export default ArticlePage;
