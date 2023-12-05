import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import './Style/Modal.css';
import './Style/Scrap.css';
import { useState, useEffect } from "react";
import { AppDispatch } from "./index";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setInitialState, RootState, ArticleType, afterFilter, saveArticle } from "./store";
import { Modal } from "./Component/Modal";
import { Scrap } from "./Component/Scrap";

// Article Component
type ArticleComponentType = {
  value : ArticleType,
  idValue : string,
  dispatch : AppDispatch
}

function Article ({value, idValue, dispatch} :ArticleComponentType) {
  return(
    <article>
      <div className="article-top">
        <h1>{value.headline}</h1>
        <button id={idValue} className="scrap-button" onClick={(e) => {
          dispatch(saveArticle(e.currentTarget.id));
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
  )
}


export type FilteringType = {
  headline : string,
  date : string,
  country : string[]
}

function App() {
  /** 할 수 있다는 믿음 */
  let [filteringValue, setFilteringValue] = useState<FilteringType>({
    headline : '전체 헤드라인',
    date : '전체 날짜',
    country : ['전체 국가']
  });
  /** /////////////////////////////////////////////////////// */
  const [headerList, setHeaderList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>])
  const [articleUrl, setArticleUrl] = useState<string[]>([]);
  let [articleArray, setArticleArray] = useState<ArticleType[]>([]);
  let [scrollCount, setScrollCount] = useState(0);
  let [currentUrl, setCurrentUrl] = useState('홈');
  let [modalOn, setModalOn] = useState(false);
  let [scrollEvent, setScrollEvent] = useState(true);
  let navigate = useNavigate();
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
          arr[i] = 'US'; 
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
      // console.log(result.data.response.docs);
      let arr :ArticleType[] = [];
      for(let i = 0; i < 10; i++){
        let copy = [...articleUrl];
        copy.push(result.data.response.docs[i].web_url);
        setArticleUrl(copy);

        arr.push({
          id : result.data.response.docs[i]._id.slice(-12),
          headline : result.data.response.docs[i].headline.main,
          byline : result.data.response.docs[i].byline.original?.slice(3),
          date : result.data.response.docs[i].pub_date.slice(0, 10),
          source : result.data.response.docs[i].source,
          keyword : result.data.response.docs[i].keywords
        });
      }
      dispatch(setInitialState(arr));
      setArticleArray(arr);
    });
  }, [scrollCount]);

  useEffect(() => {
    setArticleArray(state.article);
  }, [state.article]);

  /**!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
  // useEffect(() => {
  //   setArticleArray(state.filtering);
  //   let copy :string[] = [];
  //   for(let i = 0; i < state.filtering.length; i++){
  //     copy.push(state.filtering[i].url);
  //   }
  //   setArticleUrl(copy);
  //   console.log(state.filtering);
  // }, [state.filtering]);

  // // Header UI
  // useEffect(() => {
  //   // Date UI
  //   if(filteringValue.date === '전체 날짜' || filteringValue.date.length === 0){
  //     filteringValue.date = '전체 날짜';
  //     let headerContainerLi = document.querySelector('.li-1');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //       headerContainerLi.setAttribute('id', '');
  //     }
  //     setArticleArray(state.article);
  //     setScrollEvent(true);
  //   } else {
  //     let headerContainerLi = document.querySelector('.li-1');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //       headerContainerLi.setAttribute('id', 'filtering-css');
  //     }
  //   }

  //   // Country UI
  //   if(filteringValue.country[0] === '전체 국가' || filteringValue.country.length === 0){
  //     // filteringValue.date = filteringValue.date === '' ? '전체 날짜' : filteringValue.date 
  //     filteringValue.country = ['전체 국가'];
  //     let headerContainerLi = document.querySelector('.li-2');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //       headerContainerLi.setAttribute('id', '');
  //     }
  //     // setArticleArray(state.article);
  //     setScrollEvent(true);
  //   } else {
  //     filteringValue.country = filteringValue.country.length === 1
  //     ? filteringValue.country
  //     : [`${filteringValue.country[0]} 외 ${filteringValue.country.length - 1}개`];
  //     let headerContainerLi = document.querySelector('.li-2');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //     headerContainerLi.setAttribute('id', 'filtering-css');
  //     }
  //   }

  //   // Headline UI
  //   if(filteringValue.headline === '전체 헤드라인' || filteringValue.headline.length === 0){
  //     filteringValue.headline = '전체 헤드라인';
  //     let headerContainerLi = document.querySelector('.li-0');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //       headerContainerLi.setAttribute('id', '');
  //     }
  //     // setArticleArray(state.article);
  //     setScrollEvent(true);
  //   } else {
  //     filteringValue.headline = filteringValue.headline.length > 6 ? filteringValue.headline.slice(0, 6) + '...' : filteringValue.headline;
  //     let headerContainerLi = document.querySelector('.li-0');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //       headerContainerLi.setAttribute('id', 'filtering-css');
  //     }
  //   }
    
  //   setHeaderList([filteringValue.headline, filteringValue.date, ...filteringValue.country])
  // }, [filteringValue]);


  // Apply Filter
  useEffect(() => {
    let copyFilteringValue = {...filteringValue};

    // Date Filtering
    if(copyFilteringValue.date === '전체 날짜' || copyFilteringValue.date.length === 0){
      copyFilteringValue.date = '전체 날짜';
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
      const dateValue = copyFilteringValue.date.replaceAll('.', '');
      const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
      axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`)
      .then((result) => {
        console.log(result.data.response.docs);
        let arr :ArticleType[] = [];
        for(let i = 0; i < 10; i++){
          let copy :string[] = [];
          copy.push(result.data.response.docs[i].web_url);
          setArticleUrl(copy);

          arr.push({
            id : result.data.response.docs[i]._id.slice(-12),
            headline : result.data.response.docs[i].headline.main,
            byline : result.data.response.docs[i].byline.original?.slice(3),
            date : result.data.response.docs[i].pub_date.slice(0, 10),
            source : result.data.response.docs[i].source,
            keyword : result.data.response.docs[i].keywords
          });
        }
        console.log('꺾인 마음');
        dispatch(afterFilter(arr));
        setArticleArray(arr);
        setScrollEvent(false);
      });
    }
    setHeaderList([copyFilteringValue.headline, copyFilteringValue.date, ...copyFilteringValue.country])
  }, [filteringValue]);

  // Country Filtering
  // useEffect(() => {
  //   let copyFilteringValue = {...filteringValue};
  //   if(copyFilteringValue.country[0] === '전체 국가' || copyFilteringValue.country.length === 0){
  //     copyFilteringValue.date = copyFilteringValue.date === '' ? '전체 날짜' : copyFilteringValue.date 
  //     copyFilteringValue.country = ['전체 국가'];
  //     let headerContainerLi = document.querySelector('.li-2');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //       headerContainerLi.setAttribute('id', '');
  //     }
  //     setArticleArray(state.article);
  //   } else {
  //     // 날짜 값이 있나?
  //     if(filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){
  //       // 있다.
  //       let countryFilterArr :ArticleType[] = [];
  //       let copyArr = [...copyFilteringValue.country];
  //       krToEn(copyArr);
  //       copyArr.map((nation) => {
  //         for(let i = 0; i < state.articleAfterFiltering.length; i++){
  //           for(let k = 0; k < state.articleAfterFiltering[i].keyword.length; k++){
  //             if(state.articleAfterFiltering[i].keyword[k].value.includes(nation)){
  //               countryFilterArr.push(state.articleAfterFiltering[i]);
  //               return
  //             }
  //           }
  //         }
  //       });
  //       // dispatch(afterFilter(countryFilterArr));
  //       setArticleArray(countryFilterArr);
  //       setScrollEvent(false);
  //     } else {
  //       // 없다.
  //       copyFilteringValue.date = '전체 날짜';
  //       let countryFilterArr :ArticleType[] = [];
  //       let copyArr = [...copyFilteringValue.country];
  //       krToEn(copyArr);
  //       copyArr.map((nation) => {
  //         for(let i = 0; i < state.article.length; i++){
  //           for(let k = 0; k < state.article[i].keyword.length; k++){
  //             if(state.article[i].keyword[k].value.includes(nation)){
  //               countryFilterArr.push(state.article[i]);
  //               return
  //             }
  //           }
  //         }
  //       });
  //       // dispatch(setInitialState(countryFilterArr));
  //       setArticleArray(countryFilterArr);
  //       setScrollEvent(false);
  //     }

  //     copyFilteringValue.country = copyFilteringValue.country.length === 1
  //     ? copyFilteringValue.country
  //     : [`${copyFilteringValue.country[0]} 외 ${copyFilteringValue.country.length - 1}개`];
  //     let headerContainerLi = document.querySelector('.li-2');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //     headerContainerLi.setAttribute('id', 'filtering-css');
  //     }
  //   }

  //   setHeaderList([copyFilteringValue.headline, copyFilteringValue.date, ...copyFilteringValue.country])
  // }, [filteringValue, state.articleAfterFiltering]);

  // Headline Filtering
  // useEffect(() => {
  //   let copyFilteringValue = {...filteringValue};
  //   if(copyFilteringValue.headline.length === 0 || copyFilteringValue.headline === '전체 헤드라인'){
  //     if(copyFilteringValue.country.length === 0){
  //       copyFilteringValue.country = ['전체 국가']
  //     } 
  //     if(copyFilteringValue.date.length === 0){
  //       copyFilteringValue.date = '전체 날짜'
  //     }
  //     copyFilteringValue.headline = '전체 헤드라인';
  //     let headerContainerLi = document.querySelector('.li-0');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //       headerContainerLi.setAttribute('id', '');
  //     }
  //     setArticleArray(state.article);
  //     setScrollEvent(true);
  //   } else {
  //     // 날짜 값이 있나?
  //     if(copyFilteringValue.date !== '전체 날짜' && copyFilteringValue.date.length !== 0){
  //       // 날짜 있음
  //       // 국가 값이 있나?
  //       if(copyFilteringValue.country[0] !== '전체 국가' && copyFilteringValue.country.length !== 0){
  //         // 국가 있음 헤드+날짜+국가
  //         let filterValueArr :ArticleType[] = [];
  //         state.article.map((value) => {
  //           if(typeof copyFilteringValue.headline === 'string'){
  //             if(value.headline.toLowerCase().includes(copyFilteringValue.headline.toLowerCase())){
  //               filterValueArr.push(value);
  //             }
  //           }
  //         });
  //         setArticleArray(filterValueArr);
  //         setScrollEvent(false);
  //       } else {
  //         // 국가 없음 헤드+날짜
  //         let filterValueArr :ArticleType[] = [];
  //         state.articleAfterFiltering.map((value) => {
  //           if(typeof copyFilteringValue.headline === 'string'){
  //             if(value.headline.toLowerCase().includes(copyFilteringValue.headline.toLowerCase())){
  //               filterValueArr.push(value);
  //             }
  //           }
  //         });
  //         setArticleArray(filterValueArr);
  //         setScrollEvent(false);
  //       }
  //     } else {
  //       // 날짜 없음
  //       let filterValueArr :ArticleType[] = [];
  //       state.article.map((value) => {
  //         if(typeof copyFilteringValue.headline === 'string'){
  //           if(value.headline.toLowerCase().includes(copyFilteringValue.headline.toLowerCase())){
  //             filterValueArr.push(value);
  //           }
  //         }
  //       });
  //       setArticleArray(filterValueArr);
  //       setScrollEvent(false);
  //     }
  //     copyFilteringValue.headline = copyFilteringValue.headline.length > 6 ? copyFilteringValue.headline.slice(0, 6) + '...' : copyFilteringValue.headline;
  //     let headerContainerLi = document.querySelector('.li-0');
  //     if(headerContainerLi instanceof HTMLLIElement){
  //     headerContainerLi.setAttribute('id', 'filtering-css');
  //     }
  //     if(copyFilteringValue.country.length === 0){
  //       copyFilteringValue.country = ['전체 국가']
  //     } 
  //     if(copyFilteringValue.date.length === 0){
  //       copyFilteringValue.date = '전체 날짜'
  //     }
  //   }

  //   setHeaderList([copyFilteringValue.headline, copyFilteringValue.date, ...copyFilteringValue.country])
  // }, [filteringValue, state.articleAfterFiltering]);


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

  // // Apply Filter Value
  // useEffect(() => {
  //   if(Object.keys(state.filteringValue).length === 0){
  //     return
  //   } else {
  //     // Headline filter
  //     let copy = {...state.filteringValue};
  //     if(state.filteringValue.headline !== undefined &&  copy.date !== undefined && state.filteringValue.date !== undefined && state.filteringValue.country !== undefined){
  //       if(state.filteringValue.headline.length === 0){
  //         copy.headline = '전체 헤드라인';
  //         let headerContainerLi = document.querySelector('.li-0');
  //         if(headerContainerLi instanceof HTMLLIElement){
  //           headerContainerLi.setAttribute('id', '');
  //         }
  //         setArticleArray(state.article);
  //         setScrollEvent(true);
  //       } else {
  //         copy.headline = state.filteringValue.headline.length > 6 ? state.filteringValue.headline.slice(0, 6) + '...' : state.filteringValue.headline;
  //         let headerContainerLi = document.querySelector('.li-0');
  //         if(headerContainerLi instanceof HTMLLIElement){
  //           headerContainerLi.setAttribute('id', 'filtering-css');
  //         }

  //         let filterValueArr :ArticleType[] = [];
  //         state.article.map((value) => {
  //           if(typeof state.filteringValue.headline === 'string'){
  //             if(value.headline.toLowerCase().includes(state.filteringValue.headline.toLowerCase())){
  //               filterValueArr.push(value);
  //             }
  //           }
  //         });
  //         dispatch(afterFilter(filterValueArr));
  //         setArticleArray(filterValueArr);
  //         setScrollEvent(false);
  //       }

  //       // Date filter
  //       if(state.filteringValue.date.length === 0){
  //         copy.date = '전체 날짜';
  //         let headerContainerLi = document.querySelector('.li-1');
  //         if(headerContainerLi instanceof HTMLLIElement){
  //           headerContainerLi.setAttribute('id', '');
  //         }
  //         setScrollEvent(true);
  //       } else {
  //         let headerContainerLi = document.querySelector('.li-1');
  //         if(headerContainerLi instanceof HTMLLIElement){
  //           headerContainerLi.setAttribute('id', 'filtering-css');
  //         }
  //         // Date API
  //         const dateValue = copy.date.replaceAll('.', '');
  //         const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
  //         axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`)
  //         .then((result) => {
  //           let arr :ArticleType[] = [];
  //           for(let i = 0; i < 10; i++){
  //             let copy :string[] = [];
  //             copy.push(result.data.response.docs[i].web_url);
  //             setArticleUrl(copy);

  //             arr.push({
  //               id : result.data.response.docs[i]._id.slice(-12),
  //               headline : result.data.response.docs[i].headline.main,
  //               byline : result.data.response.docs[i].byline.original?.slice(3),
  //               date : result.data.response.docs[i].pub_date.slice(0, 10),
  //               source : result.data.response.docs[i].source,
  //               keyword : result.data.response.docs[i].keywords
  //             });
  //           }
  //           if(copy.headline !== undefined){
  //             if(copy.headline.length === 0 || copy.headline ==='전체 헤드라인'){
  //               dispatch(afterFilter(arr));
  //               setArticleArray(arr);
  //               setScrollEvent(false);
  //             } else {
  //               let arrFilter :ArticleType[] = [];
  //               arr.map((value) => {
  //                 if(typeof copy.headline === 'string'){
  //                   if(value.headline.toLowerCase().includes(copy.headline.toLowerCase())){
  //                     arrFilter.push(value);
  //                   }
  //                 }
  //               });
  //               setArticleArray(arrFilter);
  //               dispatch(afterFilter(arrFilter));
  //               setScrollEvent(false);
  //             }
  //           } 
  //         });
  //       }

  //       // Country filter
  //       if(state.filteringValue.country.length === 0){
  //         copy.country = ['전체 국가'];
  //         let headerContainerLi = document.querySelector('.li-2');
  //         if(headerContainerLi instanceof HTMLLIElement){
  //           headerContainerLi.setAttribute('id', '');
  //         }
  //       } else if(state.filteringValue.country.length === 1){
  //         copy.country = [...state.filteringValue.country];
  //         let headerContainerLi = document.querySelector('.li-2');
  //         if(headerContainerLi instanceof HTMLLIElement){
  //           headerContainerLi.setAttribute('id', 'filtering-css');
  //         }

  //         let countryFilterArr :ArticleType[] = [];
  //         let copyArr = [...copy.country];
  //         krToEn(copyArr);
  //         state.article.map((value) => {
  //           for(let i = 0; i < value.keyword.length; i++){
  //             if(value.keyword[i].value.toLowerCase().includes(copyArr[0])){
  //               countryFilterArr.push(value);
  //               return
  //             }
  //           }
  //         });
  //         console.log(countryFilterArr);
  //         dispatch(afterFilter(countryFilterArr));
  //         setArticleArray(countryFilterArr);
  //         setScrollEvent(false);
  //       } else {
  //         copy.country = [`${state.filteringValue.country[0]} 외 ${state.filteringValue.country.length - 1}개`];
  //         let headerContainerLi = document.querySelector('.li-2');
  //         if(headerContainerLi instanceof HTMLLIElement){
  //           headerContainerLi.setAttribute('id', 'filtering-css');
  //         }

  //         let countryFilterArr :ArticleType[] = [];
  //         let copyArr = [...state.filteringValue.country];
  //         krToEn(copyArr);
  //         copyArr.map((nation) => {
  //           state.article.map((value) => {
  //             for(let i = 0; i < value.keyword.length; i++){
  //               if(value.keyword[i].value.toLowerCase().includes(nation)){
  //                 countryFilterArr.push(value);
  //                 return
  //               }
  //             }
  //           });
  //         });
  //         setArticleArray(countryFilterArr);
  //         dispatch(afterFilter(countryFilterArr));
  //         setScrollEvent(false);
  //       }
  //       setHeaderList([copy.headline, copy.date, ...copy.country]);
  //     }
  //   }
  // }, [state.filteringValue]);

  useEffect(() => {
    state.scrapArticle.map((value) => {
      let buttonEl = document.getElementById(`${value.id}`);
      if(buttonEl instanceof HTMLButtonElement){
        if(value.scrap){
          buttonEl.style.color = 'rgb(255, 180, 35)';
        } else {
          buttonEl.style.color = 'var(--main-bg)';
        }
      }
    });
  },[state.scrapArticle]);

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
                    <Link className="link-article" to={`${articleUrl[i]}`} key={i}>
                      <Article dispatch={dispatch} idValue={value.id} value={value}></Article>
                    </Link>
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
          <li className="footer-home" onClick={(e) => {
            if(typeof e.currentTarget.textContent === 'string'){
              setCurrentUrl(e.currentTarget.textContent);
            }
            navigate('/');
            }}><FontAwesomeIcon className="footer-icon" icon={faHouse} />홈</li>
          <li className="footer-scrap" onClick={(e) => {
            if(typeof e.currentTarget.textContent === 'string'){
              setCurrentUrl(e.currentTarget.textContent);
            }
            navigate('/scrap');
          }}><FontAwesomeIcon className="footer-icon" icon={faFileLines} />스크랩</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
