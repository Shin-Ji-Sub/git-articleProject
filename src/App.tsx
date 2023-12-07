import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import './Style/Modal.css';
import './Style/Scrap.css';
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { AppDispatch } from "./index";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setInitialState, RootState, ArticleType, afterFilter, saveArticle } from "./store";
import { Modal } from "./Component/Modal";
import { Scrap } from "./Component/Scrap";

export type KrToEnType = (parameter :string[]) => void

export type FilteringType = {
  headline : string,
  date : string,
  country : string[]
}

/* Filtering Function List */
/** 1. Headline Filtering */
function headlineFilter(filteringValue :FilteringType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>) {

  let copyArticleArray :ArticleType[] = [];
  stateArticle.map((value) => {
    if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
      copyArticleArray.push(value);
    }
  });
  setArticleArray(copyArticleArray);
  setScrollEvent(false);

}

/** 2. Date Filtering */
async function dateFilter(filteringValue :FilteringType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>) {
  try{
    const dateValue = filteringValue.date.replaceAll('.', '');
    const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
    const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
    let arr :ArticleType[] = [];
    for(let i = 0; i < 10; i++){
      arr.push({
        id : getData.data.response.docs[i]._id.slice(-12),
        headline : getData.data.response.docs[i].headline.main,
        byline : getData.data.response.docs[i].byline.original?.slice(3),
        date : getData.data.response.docs[i].pub_date.slice(0, 10),
        source : getData.data.response.docs[i].source,
        keyword : getData.data.response.docs[i].keywords,
        url : getData.data.response.docs[i].web_url,
        scrap : false
      });
    }
    setArticleArray(arr);
    setScrollEvent(false);
  } catch {
    console.log('error');
  } 
}

/** 3. Country Filtering */
function countryFilter(filteringValue :FilteringType, krToEn :KrToEnType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>) {
  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < stateArticle.length; i++){
      for(let k = 0; k < stateArticle[i].keyword.length; k++){
        if(stateArticle[i].keyword[k].value.includes(nation)){
          countryFilterArr.push(stateArticle[i]);
          return
        }
      }
    }
  });

  setArticleArray(countryFilterArr);
  setScrollEvent(false);
}

/** 4. Headline + Date */
function headlinePlusDate(filteringValue :FilteringType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>){

  async function getApi(){
    try{
      const dateValue = filteringValue.date.replaceAll('.', '');
      const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
      const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        arr.push({
          id : getData.data.response.docs[i]._id.slice(-12),
          headline : getData.data.response.docs[i].headline.main,
          byline : getData.data.response.docs[i].byline.original?.slice(3),
          date : getData.data.response.docs[i].pub_date.slice(0, 10),
          source : getData.data.response.docs[i].source,
          keyword : getData.data.response.docs[i].keywords,
          url : getData.data.response.docs[i].web_url,
          scrap : false
        });
      }
      
      let copyArticleArray :ArticleType[] = [];
      arr.map((value) => {
        if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
          copyArticleArray.push(value);
        }
      });
      setArticleArray(copyArticleArray);
      setScrollEvent(false);
    } catch {
      console.log('error');
    }
  }
  getApi();
}

/** 5. Headline + Country */
function headlinePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>){

  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < stateArticle.length; i++){
      for(let k = 0; k < stateArticle[i].keyword.length; k++){
        if(stateArticle[i].keyword[k].value.includes(nation)){
          countryFilterArr.push(stateArticle[i]);
          return
        }
      }
    }
  });

  let copyArticleArray :ArticleType[] = [];
  countryFilterArr.map((value) => {
    if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
      copyArticleArray.push(value);
    }
  });

  setArticleArray(copyArticleArray);
  setScrollEvent(false);

} 

/** 6. Date + Country */
function datePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>) {

    async function getApi(){
      try{
        const dateValue = filteringValue.date.replaceAll('.', '');
        const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
        const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
        let arr :ArticleType[] = [];
        for(let i = 0; i < 10; i++){
          arr.push({
            id : getData.data.response.docs[i]._id.slice(-12),
            headline : getData.data.response.docs[i].headline.main,
            byline : getData.data.response.docs[i].byline.original?.slice(3),
            date : getData.data.response.docs[i].pub_date.slice(0, 10),
            source : getData.data.response.docs[i].source,
            keyword : getData.data.response.docs[i].keywords,
            url : getData.data.response.docs[i].web_url,
            scrap : false
          });
        }

        let countryFilterArr :ArticleType[] = [];
        let copyArr = [...filteringValue.country];
        krToEn(copyArr);
        copyArr.map((nation) => {
          for(let i = 0; i < arr.length; i++){
            for(let k = 0; k < arr[i].keyword.length; k++){
              if(arr[i].keyword[k].value.includes(nation)){
                countryFilterArr.push(arr[i]);
                return
              }
            }
          }
        });

        setArticleArray(countryFilterArr);
        setScrollEvent(false);
        
      } catch {
        console.log('error');
      }
    }
    getApi();

}

/** 7. Headline + Date + Country */
function headlinePlusDatePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>) {
  async function getApi(){
    try{
      const dateValue = filteringValue.date.replaceAll('.', '');
      const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
      const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        arr.push({
          id : getData.data.response.docs[i]._id.slice(-12),
          headline : getData.data.response.docs[i].headline.main,
          byline : getData.data.response.docs[i].byline.original?.slice(3),
          date : getData.data.response.docs[i].pub_date.slice(0, 10),
          source : getData.data.response.docs[i].source,
          keyword : getData.data.response.docs[i].keywords,
          url : getData.data.response.docs[i].web_url,
          scrap : false
        });
      }
      
      let copyArticleArray :ArticleType[] = [];
      arr.map((value) => {
        if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
          copyArticleArray.push(value);
        }
      });

      let countryFilterArr :ArticleType[] = [];
        let copyArr = [...filteringValue.country];
        krToEn(copyArr);
        copyArr.map((nation) => {
          for(let i = 0; i < copyArticleArray.length; i++){
            for(let k = 0; k < copyArticleArray[i].keyword.length; k++){
              if(copyArticleArray[i].keyword[k].value.includes(nation)){
                countryFilterArr.push(copyArticleArray[i]);
                return
              }
            }
          }
        });

        setArticleArray(countryFilterArr);
        setScrollEvent(false);
      
    } catch {
      console.log('error');
    }
  }
  getApi();
}


function App() {
  let [filteringValue, setFilteringValue] = useState<FilteringType>({
    headline : '전체 헤드라인',
    date : '전체 날짜',
    country : ['전체 국가']
  });
  const [headerList, setHeaderList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>])
  let [articleArray, setArticleArray] = useState<ArticleType[]>([]);
  let [scrollCount, setScrollCount] = useState(0);
  let [modalOn, setModalOn] = useState(false);
  let [scrollEvent, setScrollEvent] = useState(true);
  let navigate = useNavigate();
  let location = useLocation();
  const state = useSelector((state :RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
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
  // type KrToEnType = (parameter :string[]) => void
  const krToEn :KrToEnType= (parameter :string[]) => {
    parameter.map((value, i, arr) => {
      switch (value) {
        case '대한민국': 
          arr[i] = 'South Korea'; 
          break;
        case '중국': 
          arr[i] = 'China'; 
          break;
        case '일본': 
          arr[i] = 'Japan'; 
          break;
        case '미국': 
          arr[i] = 'US'; 
          break;
        case '북한': 
          arr[i] = 'North Korea'; 
          break;
        case '러시아': 
          arr[i] = 'Russia'; 
          break;
        case '프랑스': 
          arr[i] = 'France'; 
          break;
        case '영국': 
          arr[i] = 'England'; 
          break;
      }
    });
  }

  // Get API
  useEffect(() => {
    async function getApi(){
      try{
        const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
        const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?page=${scrollCount}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
        let arr :ArticleType[] = [];
        for(let i = 0; i < 10; i++){
          arr.push({
            id : getData.data.response.docs[i]._id.slice(-12),
            headline : getData.data.response.docs[i].headline.main,
            byline : getData.data.response.docs[i].byline.original?.slice(3),
            date : getData.data.response.docs[i].pub_date.slice(0, 10),
            source : getData.data.response.docs[i].source,
            keyword : getData.data.response.docs[i].keywords,
            url : getData.data.response.docs[i].web_url,
            scrap : false
          });
        }
        dispatch(setInitialState(arr));
        setArticleArray(arr);
      } catch {
        console.log('error');
      }
    }
    getApi();
  }, [scrollCount]);

  useEffect(() => {
    setArticleArray(state.article);
  }, [state.article]);

  // Header UI
  useEffect(() => {
    setHeaderList(['전체 헤드라인', '전체 날짜', '전체 국가']);
    setArticleArray(state.article);
  }, [location]);

  useEffect(() => {
    // Date UI
    if(filteringValue.date === '전체 날짜' || filteringValue.date.length === 0){
      filteringValue.date = '전체 날짜';
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(state.article);
      setScrollEvent(true);
    } else {
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }

    // Country UI
    if(filteringValue.country[0] === '전체 국가' || filteringValue.country.length === 0){
      // filteringValue.date = filteringValue.date === '' ? '전체 날짜' : filteringValue.date 
      filteringValue.country = ['전체 국가'];
      let headerContainerLi = document.querySelector('.li-2');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(state.article);
      setScrollEvent(true);
    } else {
      filteringValue.country = filteringValue.country.length === 1
      ? filteringValue.country
      : [`${filteringValue.country[0]} 외 ${filteringValue.country.length - 1}개`];
      let headerContainerLi = document.querySelector('.li-2');
      if(headerContainerLi instanceof HTMLLIElement){
      headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }

    // Headline UI
    if(filteringValue.headline === '전체 헤드라인' || filteringValue.headline.length === 0){
      filteringValue.headline = '전체 헤드라인';
      let headerContainerLi = document.querySelector('.li-0');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(state.article);
      setScrollEvent(true);
    } else {
      filteringValue.headline = filteringValue.headline.length > 6 ? filteringValue.headline.slice(0, 6) + '...' : filteringValue.headline;
      let headerContainerLi = document.querySelector('.li-0');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }
    
    setHeaderList([filteringValue.headline, filteringValue.date, ...filteringValue.country]);
  }, [filteringValue]);

  // Filtering Function
  useEffect(() => {
    // Headline
    if(filteringValue.headline !== '전체 헤드라인' && filteringValue.headline.length !== 0){

      if(filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

        if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
          // Headline + Date + Country
          headlinePlusDatePlusCountry(filteringValue, krToEn, setArticleArray, setScrollEvent);
        } else {
          // Headline + Date
          headlinePlusDate(filteringValue, setArticleArray, setScrollEvent);
        }

      } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Headline + Country
        headlinePlusCountry(filteringValue, krToEn, state.article, setArticleArray, setScrollEvent);
      } else {
        // Headline
        headlineFilter(filteringValue, state.article, setArticleArray, setScrollEvent);
      }

    } else if (filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

      if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Date + Country
        datePlusCountry(filteringValue, krToEn, setArticleArray, setScrollEvent);
      } else {
        // Date
        dateFilter(filteringValue, setArticleArray, setScrollEvent);
      }

    } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
      // Country
      countryFilter(filteringValue, krToEn, state.article, setArticleArray, setScrollEvent);
    }

  }, [filteringValue]);

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
    if(location.pathname === '/'){
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
  }, [location.pathname]);

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

  // Scrap UI
  // 리렌더링 되면 로컬에 저장된 데이터에 따라 버튼 색깔이 달라져야하는데,
  // let buttonEl = document.getElementById(`${value.id}`); element를 빨리 찾지 못함
  // null null null element 몇번 리렌더링 되야 찾음 그래서 바로 적용이 안됨.
  // 로컬에 저장된 id 값이랑 같은지 조건을 넣어야할거같음.
  // setTimeout 사용해보자, 아 아니면 setInterval
  useEffect(() => {
    let getItem = localStorage.getItem('scrapList');
    if(typeof getItem === 'string'){
      getItem = JSON.parse(getItem);
    }
    if(getItem === null){
      localStorage.setItem('scrapList', JSON.stringify([]));
    } else {
      // @ts-expect-error
      getItem.map((value) => {
        let buttonEl = document.getElementById(`${value.id}`);
        if(buttonEl instanceof HTMLButtonElement){
          buttonEl.style.color = 'rgb(255, 180, 35)';
        }
      });
    }
  }, []);


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
                    <a className="link-article" href={`${value.url}`} key={i}>
                      <article>
                        <div className="article-top">
                          <h1>{value.headline}</h1>
                          <button id={value.id} className="scrap-button" onClick={(e) => {
                            let buttonEl = document.getElementById(`${value.id}`);
                            let getItem = localStorage.getItem('scrapList');
                            getItem = JSON.parse(getItem || "");
                            // @ts-expect-error
                            let idx = getItem.findIndex(v => v.id === value.id);
                            if(idx === -1){
                              // @ts-expect-error
                              getItem.push(value);
                              if(buttonEl instanceof HTMLButtonElement){
                                buttonEl.style.color = 'rgb(255, 180, 35)';
                              }
                            } else {
                              // @ts-expect-error
                              getItem.splice(idx, 1);
                              if(buttonEl instanceof HTMLButtonElement){
                                buttonEl.style.color = 'var(--main-bg)';
                              }
                            }
                            localStorage.setItem('scrapList', JSON.stringify(getItem));
                            e.preventDefault();
                          }}><FontAwesomeIcon icon={faStar} /></button>
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
                    </a>
                  )
                })
              }
            </div>
          </main>

          <Modal setFilteringValue={setFilteringValue} modalOn={modalOn} setModalOn={setModalOn}></Modal>
          </>
        }></Route>
        <Route path="/scrap" element={<Scrap />}></Route>
      </Routes>
      <footer>
        <ul className="footer-container">
          <li className="footer-home" onClick={() => {
            navigate('/');
            }}><FontAwesomeIcon className="footer-icon" icon={faHouse} />홈</li>
          <li className="footer-scrap" onClick={() => {
            navigate('/scrap');
          }}><FontAwesomeIcon className="footer-icon" icon={faFileLines} />스크랩</li>
        </ul>
      </footer>
    </div>
  );
}

// export { Article }

export default App;
