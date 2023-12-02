import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setInitialState, RootState, articleType } from "./store";

type ArticleComponentType = {
  value : articleType
}

function Article ({value} :ArticleComponentType) {
  return(
    <article>
      <div className="article-top">
        <h1>{value.headline}</h1>
        <button><FontAwesomeIcon icon={faStar} /></button>
      </div>
      <ul className="article-bottom">
        <li className="article-origin">
          <div>{value.source}</div>
          <div>{
            value.byline.length > 20
            ? value.byline.slice(0, 20) + '...'
            : value.byline  
          }</div>
        </li>
        <li className="article-date">{value.date}</li>
      </ul>
    </article>
  )
}

function App() {
  const [headerList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>])
  let [scrollCount, setScrollCount] = useState(0);
  let [currentUrl, setCurrentUrl] = useState('홈');
  const state = useSelector((state :RootState) => state);
  const dispatch = useDispatch();
  // Scroll Event Handler Function
  const scrollHandle = () => {
    let html = document.querySelector('html');
    if(html instanceof HTMLHtmlElement){
      let scrollValue = html.scrollTop;
      let heightValue = html.scrollHeight;
      let contentValue = html.clientHeight;

      if(scrollValue + contentValue >= heightValue) {
        return setScrollCount(scrollCount + 1);
      }
    }
  }

  // Get API
  useEffect(() => {
    axios.get('https://api.nytimes.com/svc/archive/v1/2019/1.json?api-key=hVAYrCA3bAakTA6nZKdr28zIJPEGU1Dr').then((result) => {
      let arr :articleType[] = [];
      for(let i = scrollCount; i < scrollCount + 10; i++){
        arr.push({
          id : i,
          headline : result.data.response.docs[i].headline.main,
          byline : result.data.response.docs[i].byline.original.slice(3),
          date : result.data.response.docs[i].pub_date.slice(0, 10),
          source : result.data.response.docs[i].source
        });
      }
      dispatch(setInitialState(arr));
    });
  }, [scrollCount]);

  // Scroll Event
  useEffect(() => {
    const timer = setInterval(() => {
      window.addEventListener('scroll', scrollHandle);
    }, 100);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', scrollHandle);
    }
  });

  // Footer UI
  useEffect(() => {
    if(currentUrl === '홈'){
      let footerHome = document.querySelector('.footer-home');
      let footerScrap = document.querySelector('.footer-scrap');
      if(footerHome instanceof HTMLLIElement && footerScrap instanceof HTMLLIElement){
        footerScrap.style.opacity = '0.5';
        footerHome.style.opacity = '1';
      }
    } else {
      let footerHome = document.querySelector('.footer-home');
      let footerScrap = document.querySelector('.footer-scrap');
      if(footerScrap instanceof HTMLLIElement && footerHome instanceof HTMLLIElement){
        footerHome.style.opacity = '0.5';
        footerScrap.style.opacity = '1';
      }
    }
  }, [currentUrl]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <>
          <header>
            <ul className='header-container'>
              {
                headerList.map((value, i) => {
                  return(
                    <li onClick={() => {
                      console.log(state.article);
                    }} key={i}>{headerListIcon[i]}{value}</li>
                  )
                })
              }
            </ul>
          </header>
          <main>
            <div className="main-container">
              {
                state.article.map((value, i) => {
                  return(
                    <Article value={value} key={i}></Article>
                  )
                })
              }
            </div>
          </main>
          <footer>
            <ul className="footer-container">
              <li className="footer-home" onClick={(e) => {
                if(typeof e.currentTarget.textContent === 'string'){
                  setCurrentUrl(e.currentTarget.textContent);
                }
              }}><FontAwesomeIcon className="footer-icon" icon={faHouse} />홈</li>
              <li className="footer-scrap" onClick={(e) => {
                if(typeof e.currentTarget.textContent === 'string'){
                  setCurrentUrl(e.currentTarget.textContent);
                }
              }}><FontAwesomeIcon className="footer-icon" icon={faFileLines} />스크랩</li>
            </ul>
          </footer>
          </>
        }></Route>
      </Routes>
    </div>
  );
}

export default App;
