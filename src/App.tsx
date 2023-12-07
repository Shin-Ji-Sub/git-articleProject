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
import Modal from "./Component/Modal";
import Scrap from "./Component/Scrap";

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
    if(value.headline.toLowerCase().includes(filteringValue.headline.toLowerCase())){
      copyArticleArray.push(value);
    }
  });

  let idArr :string[] = [];
  copyArticleArray.map((value) => {
    idArr.push(value.id);
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

    let idArr :string[] = [];
    arr.map((value) => {
      idArr.push(value.id);
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
      for(let k = 0; k < stateArticle[i].keyword.length; k++){
        if(stateArticle[i].keyword[k].value.includes(nation)){
          countryFilterArr.push(stateArticle[i]);
          return
        }
      }
    }
  });

  let idArr :string[] = [];
  countryFilterArr.map((value) => {
    idArr.push(value.id);
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

      let idArr :string[] = [];
      copyArticleArray.map((value) => {
        idArr.push(value.id);
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

  let idArr :string[] = [];
  copyArticleArray.map((value) => {
    idArr.push(value.id);
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

        let idArr :string[] = [];
        countryFilterArr.map((value) => {
          idArr.push(value.id);
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

        let idArr :string[] = [];
        countryFilterArr.map((value) => {
          idArr.push(value.id);
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

        let idArr :string[] = [];
        arr.map((value) => {
          idArr.push(value.id);
        });

        dispatch(idSetting(idArr));
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
          headlinePlusDatePlusCountry(filteringValue, krToEn, setArticleArray, setScrollEvent, dispatch);
        } else {
          // Headline + Date
          headlinePlusDate(filteringValue, setArticleArray, setScrollEvent, dispatch);
        }

      } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Headline + Country
        headlinePlusCountry(filteringValue, krToEn, state.article, setArticleArray, setScrollEvent, dispatch);
      } else {
        // Headline
        headlineFilter(filteringValue, state.article, setArticleArray, setScrollEvent, dispatch);
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
      countryFilter(filteringValue, krToEn, state.article, setArticleArray, setScrollEvent, dispatch);
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
    // getItem = JSON.parse(getItem || "");
    if(typeof getItem === 'string'){
      getItem = JSON.parse(getItem);
    }
    if(getItem === null){
      localStorage.setItem('scrapList', JSON.stringify([]));
    } else if(getItem.length !== 0) {
      var timer = setTimeout(() => {
        // @ts-expect-error
        getItem.map((value) => {
          let buttonEl = document.getElementById(`${value.id}`);
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
    if(typeof getItem === 'string'){
      getItem = JSON.parse(getItem);
    }

    // @ts-expect-error
    getItem.map((value) => {
      let findId = state.articleId.find(v => v === value.id);
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
                              window.alert('스크랩 되었습니다.');
                            } else {
                              // @ts-expect-error
                              getItem.splice(idx, 1);
                              if(buttonEl instanceof HTMLButtonElement){
                                buttonEl.style.color = 'var(--main-bg)';
                              }
                              window.alert('스크랩 해제 되었습니다.');
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
