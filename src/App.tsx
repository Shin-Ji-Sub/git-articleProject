import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import './Style/Modal.css';
import { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setInitialState, RootState, ArticleType, FilteringValueType } from "./store";
import { Modal } from "./Component/Modal";


type ArticleComponentType = {
  value : ArticleType
}

// Article Component
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
            typeof value.byline === 'string' && value.byline.length > 20
            ? value.byline.slice(0, 15) + '...'
            : value.byline
            // value.byline.length > 20
            // ? value.byline.slice(0, 20) + '...'
            // : value.byline  
          }</div>
        </li>
        <li className="article-date">{value.date}</li>
      </ul>
    </article>
  )
}


function App() {
  const [headerList, setHeaderList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>])
  let [scrollCount, setScrollCount] = useState(0);
  let [currentUrl, setCurrentUrl] = useState('홈');
  let [modalOn, setModalOn] = useState(false);
  const state = useSelector((state :RootState) => state);
  const dispatch = useDispatch();
  /** Scroll Event Handler Function */
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
    const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
    axios.get(`${PROXY}/svc/search/v2/articlesearch.json?page=${scrollCount}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`)
    .then((result) => {
      // console.log(typeof result.data.response.docs[2].byline.original);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        arr.push({
          id : i,
          headline : result.data.response.docs[i].headline.main,
          byline : result.data.response.docs[i].byline.original?.slice(3),
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

  // Modal On
  useEffect(() => {
    if(modalOn){
      let modalContainer = document.querySelector('.modal-container');
      if(modalContainer instanceof HTMLElement){
        modalContainer.style.zIndex = '100';
        modalContainer.style.opacity = '1';
      }
    }
  }, [modalOn]);

  // Apply Filter Value
  useEffect(() => {

    if(Object.keys(state.filteringValue).length === 0){
      return
    } else {
      let copy = {...state.filteringValue};
      if(state.filteringValue.headline !== undefined &&  copy.date !== undefined && state.filteringValue.date !== undefined && state.filteringValue.country !== undefined){
        if(state.filteringValue.headline.length === 0){
          copy.headline = headerList[0];
        } else {
          copy.headline = state.filteringValue.headline.length > 6 ? state.filteringValue.headline.slice(0, 6) + '...' : state.filteringValue.headline;
          let headerContainerLi = document.querySelector('.li-0');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }
        }

        if(state.filteringValue.date.length === 0){
          copy.date = headerList[1];
        } else {
          let headerContainerLi = document.querySelector('.li-1');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }
        }

        if(state.filteringValue.country.length === 0){
          copy.country = [headerList[2]];
        } else if(state.filteringValue.country.length === 1){
          copy.country = [...state.filteringValue.country];
          let headerContainerLi = document.querySelector('.li-2');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }
        } else {
          copy.country = [`${state.filteringValue.country[0]} 외 ${state.filteringValue.country.length - 1}개`];
          let headerContainerLi = document.querySelector('.li-2');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }
        }
        setHeaderList([copy.headline, copy.date, ...copy.country]);
      }
    }
  }, [state.filteringValue]);

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
                    <li className={`header-li li-${i}`} key={i} onClick={() => {
                      setModalOn(true);
                    }}>{headerListIcon[i]}{value}</li>
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

          <Modal modalOn={modalOn} setModalOn={setModalOn}></Modal>

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
