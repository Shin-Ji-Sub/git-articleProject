import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import './Style/Modal.css';
import { useState, useEffect } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setInitialState, RootState, ArticleType, afterFilter } from "./store";
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
          <div>{
            typeof value.source === 'string' && value.source.length > 15
            ? value.source.slice(0, 15) + '...'
            : value.source  
          }</div>
          <div>{
            typeof value.byline === 'string' && value.byline.length > 15
            ? value.byline.slice(0, 15) + '...'
            : value.byline
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
  const [articleUrl, setArticleUrl] = useState<string[]>([]);
  let [articleArray, setArticleArray] = useState<ArticleType[]>([]);
  let [scrollCount, setScrollCount] = useState(0);
  let [currentUrl, setCurrentUrl] = useState('홈');
  let [modalOn, setModalOn] = useState(false);
  let [scrollEvent, setScrollEvent] = useState(true);
  // let scrollEvent = useRef(true);
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

  /** Korean to English Funtion */
  const krToEn = (parameter :string[]) => {
    parameter.map((value, i, arr) => {
      switch (value) {
        case '대한민국': 
          arr[i] = 'southkorea'; 
          break;
        case '중국': 
          arr[i] = 'china'; 
          break;
        case '일본': 
          arr[i] = 'japan'; 
          break;
        case '미국': 
          arr[i] = 'us'; 
          break;
        case '북한': 
          arr[i] = 'northkorea'; 
          break;
        case '러시아': 
          arr[i] = 'russia'; 
          break;
        case '프랑스': 
          arr[i] = 'france'; 
          break;
        case '영국': 
          arr[i] = 'england'; 
          break;
      }
    });
  }

  // Get API
  useEffect(() => {
    const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
    axios.get(`${PROXY}/svc/search/v2/articlesearch.json?page=${scrollCount}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`)
    .then((result) => {
      console.log(result.data.response.docs);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        let copy = [...articleUrl];
        copy.push(result.data.response.docs[i].web_url);
        setArticleUrl(copy);

        arr.push({
          id : result.data.response.docs[i]._id,
          headline : result.data.response.docs[i].headline.main,
          byline : result.data.response.docs[i].byline.original?.slice(3),
          date : result.data.response.docs[i].pub_date.slice(0, 10),
          source : result.data.response.docs[i].source,
          keyword : result.data.response.docs[i].keywords
        });
      }
      dispatch(setInitialState(arr));
    });
  }, [scrollCount]);

  useEffect(() => {
    setArticleArray(state.article);
  }, [state.article]);

  // Scroll Event
  useEffect(() => {
    const timer = setInterval(() => {
      if(scrollEvent){
        window.addEventListener('scroll', scrollHandle);
      } else {
        return
      }
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
      // Headline filter
      let copy = {...state.filteringValue};
      if(state.filteringValue.headline !== undefined &&  copy.date !== undefined && state.filteringValue.date !== undefined && state.filteringValue.country !== undefined){
        if(state.filteringValue.headline.length === 0){
          copy.headline = '전체 헤드라인';
          let headerContainerLi = document.querySelector('.li-0');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', '');
          }
          setArticleArray(state.article);
          setScrollEvent(true);
        } else {
          copy.headline = state.filteringValue.headline.length > 6 ? state.filteringValue.headline.slice(0, 6) + '...' : state.filteringValue.headline;
          let headerContainerLi = document.querySelector('.li-0');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }

          let filterValueArr :ArticleType[] = [];
          state.article.map((value) => {
            if(typeof state.filteringValue.headline === 'string'){
              if(value.headline.toLowerCase().includes(state.filteringValue.headline.toLowerCase())){
                filterValueArr.push(value);
              }
            }
          });
          dispatch(afterFilter(filterValueArr));
          setArticleArray(filterValueArr);
          setScrollEvent(false);
        }

        // Date filter
        if(state.filteringValue.date.length === 0){
          copy.date = '전체 날짜';
          let headerContainerLi = document.querySelector('.li-1');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', '');
          }
          setScrollEvent(true);
        } else {
          let headerContainerLi = document.querySelector('.li-1');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }
          // Date API
          const dateValue = copy.date.replaceAll('.', '');
          const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
          axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`)
          .then((result) => {
            let arr :ArticleType[] = [];
            for(let i = 0; i < 10; i++){
              let copy :string[] = [];
              copy.push(result.data.response.docs[i].web_url);
              setArticleUrl(copy);

              arr.push({
                id : result.data.response.docs[i]._id,
                headline : result.data.response.docs[i].headline.main,
                byline : result.data.response.docs[i].byline.original?.slice(3),
                date : result.data.response.docs[i].pub_date.slice(0, 10),
                source : result.data.response.docs[i].source,
                keyword : result.data.response.docs[i].keywords
              });
            }
            if(copy.headline !== undefined){
              if(copy.headline.length === 0 || copy.headline ==='전체 헤드라인'){
                dispatch(afterFilter(arr));
                setArticleArray(arr);
                setScrollEvent(false);
              } else {
                let arrFilter :ArticleType[] = [];
                arr.map((value) => {
                  if(typeof copy.headline === 'string'){
                    if(value.headline.toLowerCase().includes(copy.headline.toLowerCase())){
                      arrFilter.push(value);
                    }
                  }
                });
                setArticleArray(arrFilter);
                dispatch(afterFilter(arrFilter));
                setScrollEvent(false);
              }
            } 
          });
        }

        // Country filter
        if(state.filteringValue.country.length === 0){
          copy.country = ['전체 국가'];
          let headerContainerLi = document.querySelector('.li-2');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', '');
          }
        } else if(state.filteringValue.country.length === 1){
          copy.country = [...state.filteringValue.country];
          let headerContainerLi = document.querySelector('.li-2');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }

          let countryFilterArr :ArticleType[] = [];
          let copyArr = [...copy.country];
          krToEn(copyArr);
          state.article.map((value) => {
            for(let i = 0; i < value.keyword.length; i++){
              if(value.keyword[i].value.toLowerCase().includes(copyArr[0])){
                countryFilterArr.push(value);
                return
              }
            }
          });
          console.log(countryFilterArr);
          dispatch(afterFilter(countryFilterArr));
          setArticleArray(countryFilterArr);
          setScrollEvent(false);
        } else {
          copy.country = [`${state.filteringValue.country[0]} 외 ${state.filteringValue.country.length - 1}개`];
          let headerContainerLi = document.querySelector('.li-2');
          if(headerContainerLi instanceof HTMLLIElement){
            headerContainerLi.setAttribute('id', 'filtering-css');
          }

          let countryFilterArr :ArticleType[] = [];
          let copyArr = [...state.filteringValue.country];
          krToEn(copyArr);
          copyArr.map((nation) => {
            state.article.map((value) => {
              for(let i = 0; i < value.keyword.length; i++){
                if(value.keyword[i].value.toLowerCase().includes(nation)){
                  countryFilterArr.push(value);
                  return
                }
              }
            });
          });
          setArticleArray(countryFilterArr);
          dispatch(afterFilter(countryFilterArr));
          setScrollEvent(false);
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
                articleArray.map((value, i) => {
                  return(
                    <Link className="link-article" to={`${articleUrl}`} key={i}>
                      <Article value={value}></Article>
                    </Link>
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
