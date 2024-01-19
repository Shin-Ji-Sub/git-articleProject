import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import './Style/Modal.css';
import './Style/Scrap.css';
import { useState, useEffect, Dispatch, SetStateAction, lazy, Suspense } from "react";
import { AppDispatch } from "./index";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setInitialState, RootState, ArticleType, idSetting } from "./store";

const Modal = lazy(() => import("./Component/Modal"));
const Scrap = lazy(() => import("./Component/Scrap"));
const Loading = lazy(() => import('./Component/Loading'));


export type KrToEnType = (parameter :string[]) => void

export type FilteringType = {
  headline : string,
  date : string,
  country : string[]
}

/* Filtering Function List */
/** 1. Headline Filtering */
function headlineFilter(filteringValue :FilteringType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {

  let copyArticleArray :ArticleType[] = [];
  stateArticle.map((value) => {
    if(typeof value[1] === 'string'){
      if(value[1].toLowerCase().includes(filteringValue.headline.toLowerCase())){
        copyArticleArray.push(value);
      }
    }
  });

  let idArr :string[] = [];
  copyArticleArray.map((value) => {
    if(typeof value[0] === 'string'){
      idArr.push(value[0]);
    }
  });

  dispatch(idSetting(idArr));

  setArticleArray(copyArticleArray);
  setScrollEvent(false);

}

/** 2. Date Filtering */
async function dateFilter(filteringValue :FilteringType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {
  try{
    const dateValue = filteringValue.date.replaceAll('.', '');
    // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
    // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
    const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
    let arr :ArticleType[] = [];
    for(let i = 0; i < 10; i++){
      arr.push([
        getData.data.response.docs[i]._id.slice(-12), 
        getData.data.response.docs[i].headline.main, 
        getData.data.response.docs[i].byline.original?.slice(3),
        getData.data.response.docs[i].pub_date.slice(0, 10),
        getData.data.response.docs[i].source,
        getData.data.response.docs[i].keywords,
        getData.data.response.docs[i].web_url
      ]);
    }

    let idArr :string[] = [];
    arr.map((value) => {
      if(typeof value[0] === 'string'){
        idArr.push(value[0]);
      }
    });

    dispatch(idSetting(idArr));

    setArticleArray(arr);
    setScrollEvent(false);
  } catch {
    console.log('error');
  } 
}

/** 3. Country Filtering */
function countryFilter(filteringValue :FilteringType, krToEn :KrToEnType, stateArticle :ArticleType[],
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {
  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < stateArticle.length; i++){
      if(stateArticle[i][5].includes(nation)){
        countryFilterArr.push(stateArticle[i]);
        return
      }
    }
  });

  let idArr :string[] = [];
  countryFilterArr.map((value) => {
    if(typeof value[0] === 'string'){
      idArr.push(value[0]);
    }
  });

  dispatch(idSetting(idArr));

  setArticleArray(countryFilterArr);
  setScrollEvent(false);
}

/** 4. Headline + Date */
function headlinePlusDate(filteringValue :FilteringType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch){

  async function getApi(){
    try{
      const dateValue = filteringValue.date.replaceAll('.', '');
      // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
      // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        arr.push([
          getData.data.response.docs[i]._id.slice(-12),
          getData.data.response.docs[i].headline.main,
          getData.data.response.docs[i].byline.original?.slice(3),
          getData.data.response.docs[i].pub_date.slice(0, 10),
          getData.data.response.docs[i].source,
          getData.data.response.docs[i].keywords,
          getData.data.response.docs[i].web_url
        ]);
      }
      
      let copyArticleArray :ArticleType[] = [];
      arr.map((value) => {
        if(typeof value[1] === 'string'){
          if(value[1].toLowerCase().includes(filteringValue.headline.toLowerCase())){
            copyArticleArray.push(value);
          }
        }
      });

      let idArr :string[] = [];
      copyArticleArray.map((value) => {
        if(typeof value[0] === 'string'){
          idArr.push(value[0]);
        }
      });

      dispatch(idSetting(idArr));

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
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch){

  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < stateArticle.length; i++){
      if(stateArticle[i][5].includes(nation)){
        countryFilterArr.push(stateArticle[i]);
        return
      }
    }
  });

  let copyArticleArray :ArticleType[] = [];
  countryFilterArr.map((value) => {
    if(typeof value[1] === 'string'){
      if(value[1].toLowerCase().includes(filteringValue.headline.toLowerCase())){
        copyArticleArray.push(value);
      }
    }
  });

  let idArr :string[] = [];
  copyArticleArray.map((value) => {
    if(typeof value[0] === 'string'){
      idArr.push(value[0]);
    }
  });

  dispatch(idSetting(idArr));

  setArticleArray(copyArticleArray);
  setScrollEvent(false);

} 

/** 6. Date + Country */
function datePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType,
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {

    async function getApi(){
      try{
        const dateValue = filteringValue.date.replaceAll('.', '');
        // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
        // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
        const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
        let arr :ArticleType[] = [];
        for(let i = 0; i < 10; i++){
          arr.push([
            getData.data.response.docs[i]._id.slice(-12),
            getData.data.response.docs[i].headline.main,
            getData.data.response.docs[i].byline.original?.slice(3),
            getData.data.response.docs[i].pub_date.slice(0, 10),
            getData.data.response.docs[i].source,
            getData.data.response.docs[i].keywords,
            getData.data.response.docs[i].web_url
          ]);
        }

        let countryFilterArr :ArticleType[] = [];
        let copyArr = [...filteringValue.country];
        krToEn(copyArr);
        copyArr.map((nation) => {
          for(let i = 0; i < arr.length; i++){
            if(arr[i][5].includes(nation)){
              countryFilterArr.push(arr[i]);
              return
            }
          }
        });

        let idArr :string[] = [];
        countryFilterArr.map((value) => {
          if(typeof value[0] === 'string'){
            idArr.push(value[0]);
          }
        });

        dispatch(idSetting(idArr));

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
  setArticleArray :Dispatch<SetStateAction<ArticleType[]>>, setScrollEvent :Dispatch<SetStateAction<boolean>>, dispatch :AppDispatch) {
  async function getApi(){
    try{
      const dateValue = filteringValue.date.replaceAll('.', '');
      // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
      // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        arr.push([
          getData.data.response.docs[i]._id.slice(-12),
          getData.data.response.docs[i].headline.main,
          getData.data.response.docs[i].byline.original?.slice(3),
          getData.data.response.docs[i].pub_date.slice(0, 10),
          getData.data.response.docs[i].source,
          getData.data.response.docs[i].keywords,
          getData.data.response.docs[i].web_url
        ]);
      }
      
      let copyArticleArray :ArticleType[] = [];
      arr.map((value) => {
        if(typeof value[1] === 'string'){
          if(value[1].toLowerCase().includes(filteringValue.headline.toLowerCase())){
            copyArticleArray.push(value);
          }
        }
      });

      let countryFilterArr :ArticleType[] = [];
        let copyArr = [...filteringValue.country];
        krToEn(copyArr);
        copyArr.map((nation) => {
          for(let i = 0; i < copyArticleArray.length; i++){
            if(copyArticleArray[i][5].includes(nation)){
              countryFilterArr.push(copyArticleArray[i]);
              return
            }
          }
        });

        let idArr :string[] = [];
        countryFilterArr.map((value) => {
          if(typeof value[0] === 'string'){
            idArr.push(value[0]);
          }
        });

        dispatch(idSetting(idArr));
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
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>]);
  let [articleArray, setArticleArray] = useState<ArticleType[]>([]);
  let [scrollCount, setScrollCount] = useState(0);
  let [modalOn, setModalOn] = useState(false);
  let [scrollEvent, setScrollEvent] = useState(true);
  let navigate = useNavigate();
  let location = useLocation();
  const articleState = useSelector((state :RootState) => state.article);
  const articleIdState = useSelector((state :RootState) => state.articleId);
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
        // const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
        // const getData = await axios.get(`${PROXY}/svc/search/v2/articlesearch.json?page=${scrollCount}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);
        const getData = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?page=${scrollCount}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`);

        let arr :ArticleType[] = [];
        for(let i = 0; i < 10; i++){
          arr.push([
            getData.data.response.docs[i]._id.slice(-12),
            getData.data.response.docs[i].headline.main,
            getData.data.response.docs[i].byline.original?.slice(3),
            getData.data.response.docs[i].pub_date.slice(0, 10),
            getData.data.response.docs[i].source,
            getData.data.response.docs[i].keywords,
            getData.data.response.docs[i].web_url
          ]);
        }

        let idArr :string[] = [];
        arr.map((value) => {
          if(typeof value === 'string'){
            idArr.push(value[0]);
          }
        });

        dispatch(idSetting(idArr));
        dispatch(setInitialState(arr));
        setArticleArray(arr);
      } catch {
        console.log('Error');
      }
    }
    getApi();
  }, [scrollCount]);

  useEffect(() => {
    setArticleArray(articleState);
  }, [articleState]);

  // Header UI
  useEffect(() => {
    setHeaderList(['전체 헤드라인', '전체 날짜', '전체 국가']);
    setArticleArray(articleState);
  }, [location]);

  useEffect(() => {
    // Date UI
    if(filteringValue.date === '전체 날짜' || filteringValue.date.length === 0){
      filteringValue.date = '전체 날짜';
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(articleState);
      setScrollEvent(true);
    } else {
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }

    // Country UI
    if(filteringValue.country[0] === '전체 국가' || filteringValue.country.length === 0){
      filteringValue.country = ['전체 국가'];
      let headerContainerLi = document.querySelector('.li-2');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
      setArticleArray(articleState);
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
      setArticleArray(articleState);
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
          headlinePlusDatePlusCountry(filteringValue, krToEn, setArticleArray, setScrollEvent, dispatch);
        } else {
          // Headline + Date
          headlinePlusDate(filteringValue, setArticleArray, setScrollEvent, dispatch);
        }

      } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Headline + Country
        headlinePlusCountry(filteringValue, krToEn, articleState, setArticleArray, setScrollEvent, dispatch);
      } else {
        // Headline
        headlineFilter(filteringValue, articleState, setArticleArray, setScrollEvent, dispatch);
      }

    } else if (filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

      if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Date + Country
        datePlusCountry(filteringValue, krToEn, setArticleArray, setScrollEvent, dispatch);
      } else {
        // Date
        dateFilter(filteringValue, setArticleArray, setScrollEvent, dispatch);
      }

    } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
      // Country
      countryFilter(filteringValue, krToEn, articleState, setArticleArray, setScrollEvent, dispatch);
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
  useEffect(() => {
    let getItem = localStorage.getItem('scrapList');
    if(getItem === null){
      localStorage.setItem('scrapList', JSON.stringify([]));
    } else {
      let scrapList :ArticleType[] = JSON.parse(getItem || "");
      var timer = setTimeout(() => {
        scrapList.map((value) => {
          let buttonEl = document.getElementById(`${value[0]}`);
          if(buttonEl instanceof HTMLButtonElement){
            buttonEl.style.color = 'rgb(255, 180, 35)';
          }
        });
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    }
  }, [location, articleArray]);

  useEffect(() => {

    let buttonsEl = Array.from(document.querySelectorAll('.scrap-button')) as HTMLElement[];
    buttonsEl.map((value, i) => {
      value.style.color = 'var(--main-bg)';
    });

    let getItem = localStorage.getItem('scrapList');
    let scrapList :ArticleType[] = JSON.parse(getItem || "");
    scrapList.map((value) => {
      let findId = articleIdState.find(v => v === value[0]);
      if(findId !== undefined){
        let buttonEl = document.getElementById(`${findId}`);
        if(buttonEl instanceof HTMLButtonElement){
          buttonEl.style.color = 'rgb(255, 180, 35)';
        }
      }
    });

  }, [articleArray]);


  return (
    <div className="App">
      <Suspense fallback={<Loading></Loading>}>
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
                    <a className="link-article" href={`${value[1]}`} key={i}>
                      <article>
                        <div className="article-top">
                          <h1>{value[1]}</h1>
                          <button id={typeof value[0] === 'string' ? value[0] : ''} aria-label="scrapButton" className="scrap-button" onClick={(e) => {
                            let buttonEl = document.getElementById(`${value[0]}`);
                            let getItem = localStorage.getItem('scrapList');
                            let scrapList :ArticleType[] = JSON.parse(getItem || "");
                            let idx = scrapList.findIndex(v => v[0] === value[0]);
                            if(idx === -1){
                              scrapList.push(value);
                              if(buttonEl instanceof HTMLButtonElement){
                                buttonEl.style.color = 'rgb(255, 180, 35)';
                              }
                              window.alert('스크랩 되었습니다.');
                            } else {
                              scrapList.splice(idx, 1);
                              if(buttonEl instanceof HTMLButtonElement){
                                buttonEl.style.color = 'var(--main-bg)';
                              }
                              window.alert('스크랩 해제 되었습니다.');
                            }
                            localStorage.setItem('scrapList', JSON.stringify(scrapList));
                            e.preventDefault();
                          }}><FontAwesomeIcon icon={faStar} /></button>
                        </div>

                        <ul className="article-bottom">
                          <li className="article-origin">
                            <div>{
                              typeof value[4] === 'string' && value[4].length > 15
                              ? value[4].slice(0, 15) + '...'
                              : value[4]  
                            }</div>
                            <div>{
                              typeof value[2] === 'string' && value[2].length > 15
                              ? value[2].slice(0, 15) + '...'
                              : value[2]
                            }</div>
                          </li>
                          <li className="article-date">{value[3]}</li>
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
      </Suspense>
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

export default App;
