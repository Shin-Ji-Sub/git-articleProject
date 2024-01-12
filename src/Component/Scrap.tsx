import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faCalendarCheck, faMagnifyingGlass, faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { ArticleType } from "../store";
import Modal from "./Modal";
import { FilteringType, KrToEnType } from "../App";

/* Filtering Function List */
/** 1. Headline Filtering */
function headlineFilter(filteringValue :FilteringType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {

  let copyArticleArray :ArticleType[] = [];
  scrappedArticle.map((value) => {
    if(typeof value[1] === 'string'){
      if(value[1].toLowerCase().includes(filteringValue.headline.toLowerCase())){
        copyArticleArray.push(value);
      }
    }
  });
  setScrappedArticle(copyArticleArray);

}

/** 2. Date Filtering */
async function dateFilter(filteringValue :FilteringType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {
  
    const dateValue = filteringValue.date.replaceAll('.', '-');
    let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value[3] === dateValue){
        copyDateArr.push(value);
      }
    });

    setScrappedArticle(copyDateArr);

}

/** 3. Country Filtering */
function countryFilter(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {
  let countryFilterArr :ArticleType[] = [];
  let copyArr = [...filteringValue.country];
  krToEn(copyArr);
  copyArr.map((nation) => {
    for(let i = 0; i < scrappedArticle.length; i++){
      if(scrappedArticle[i][5].includes(nation)){
        countryFilterArr.push(scrappedArticle[i]);
        return
      }
    }
  });

  setScrappedArticle(countryFilterArr);

}

/** 4. Headline + Date */
function headlinePlusDate(filteringValue :FilteringType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>){
  
    const dateValue = filteringValue.date.replaceAll('.', '-');
    let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value[3] === dateValue){
        copyDateArr.push(value);
      }
    });

    let copyArticleArray :ArticleType[] = [];
    copyDateArr.map((value) => {
      if(typeof value[1] === 'string'){
        if(value[1].toLowerCase().includes(filteringValue.headline.toLowerCase())){
          copyArticleArray.push(value);
        }
      }
    });

    setScrappedArticle(copyArticleArray);
  
}

/** 5. Headline + Country */
function headlinePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>){

    let countryFilterArr :ArticleType[] = [];
    let copyArr = [...filteringValue.country];
    krToEn(copyArr);
    copyArr.map((nation) => {
      for(let i = 0; i < scrappedArticle.length; i++){
        if(scrappedArticle[i][5].includes(nation)){
          countryFilterArr.push(scrappedArticle[i]);
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

    setScrappedArticle(copyArticleArray);

} 

/** 6. Date + Country */
function datePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {

    const dateValue = filteringValue.date.replaceAll('.', '-');
    let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value[3] === dateValue){
        copyDateArr.push(value);
      }
    });

    let countryFilterArr :ArticleType[] = [];
    let copyArr = [...filteringValue.country];
    krToEn(copyArr);
    copyArr.map((nation) => {
      for(let i = 0; i < copyDateArr.length; i++){
        if(scrappedArticle[i][5].includes(nation)){
          countryFilterArr.push(scrappedArticle[i]);
          return
        }
      }
    });

    setScrappedArticle(countryFilterArr);

}

/** 7. Headline + Date + Country */
function headlinePlusDatePlusCountry(filteringValue :FilteringType, krToEn :KrToEnType, scrappedArticle :ArticleType[],
  setScrappedArticle :Dispatch<SetStateAction<ArticleType[]>>) {
  
  const dateValue = filteringValue.date.replaceAll('.', '-');
  let copyDateArr :ArticleType[] = []; 
    scrappedArticle.map((value) => {
      if(value[3] === dateValue){
        copyDateArr.push(value);
      }
    });

    let countryFilterArr :ArticleType[] = [];
    let copyArr = [...filteringValue.country];
    krToEn(copyArr);
    copyArr.map((nation) => {
      for(let i = 0; i < copyDateArr.length; i++){
        if(scrappedArticle[i][5].includes(nation)){
          countryFilterArr.push(scrappedArticle[i]);
          return
        }
      }
    });

    let copyArticleArray :ArticleType[] = [];
    copyDateArr.map((value) => {
      if(typeof value[1] === 'string'){
        if(value[1].toLowerCase().includes(filteringValue.headline.toLowerCase())){
          copyArticleArray.push(value);
        }
      }
    });

    setScrappedArticle(copyArticleArray);

}


function Scrap(){
  let [filteringValue, setFilteringValue] = useState<FilteringType>({
    headline : '전체 헤드라인',
    date : '전체 날짜',
    country : ['전체 국가']
  });
  const [headerList, setHeaderList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass}/>, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck}/>])
  let [modalOn, setModalOn] = useState(false);
  let [scrappedArticle, setScrappedArticle] = useState<ArticleType[]>([]);
  let [reRendering, setReRendering] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Initial Screen
  useEffect(() => {
    let getItem = localStorage.getItem('scrapList');
    let InitialContainer = document.querySelector('.initial-container');
    let scrapHeader = document.querySelector('.scrap-header');
    if(getItem === null){
      if(InitialContainer instanceof HTMLElement && scrapHeader instanceof HTMLElement){
        InitialContainer.style.visibility = 'visible';
        scrapHeader.style.visibility = 'hidden';
      }
    } else {
      if(getItem === '[]'){
        if(InitialContainer instanceof HTMLElement && scrapHeader instanceof HTMLElement){
          InitialContainer.style.visibility = 'visible';
          scrapHeader.style.visibility = 'hidden';
          setScrappedArticle([]);
        }
      } else {
        if(InitialContainer instanceof HTMLElement && scrapHeader instanceof HTMLElement){
          InitialContainer.style.visibility = 'hidden';
          scrapHeader.style.visibility = 'visible';
        }
        let scrapList :ArticleType[] = JSON.parse(getItem || "");
        let copyArr :ArticleType[] = [];
        for(let i = 0; i < scrapList.length; i++){
          let copyObj :ArticleType = [...scrapList[i]];
          copyArr.push(copyObj);
        }
        setScrappedArticle(copyArr);
      }
    }
  },[location, reRendering]);

  // Modal ON OFF
  useEffect(() => {
    if(modalOn){
      let modalContainer = document.querySelector('.modal-container');
      if(modalContainer instanceof HTMLElement){
        modalContainer.style.zIndex = '100';
        modalContainer.style.opacity = '1';
      }
    }
  }, [modalOn]);

  // Header UI
  useEffect(() => {
    // Date UI
    if(filteringValue.date === '전체 날짜' || filteringValue.date.length === 0){
      filteringValue.date = '전체 날짜';
      let headerContainerLi = document.querySelector('.li-1');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', '');
      }
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
    } else {
      filteringValue.headline = filteringValue.headline.length > 6 ? filteringValue.headline.slice(0, 6) + '...' : filteringValue.headline;
      let headerContainerLi = document.querySelector('.li-0');
      if(headerContainerLi instanceof HTMLLIElement){
        headerContainerLi.setAttribute('id', 'filtering-css');
      }
    }
    
    setHeaderList([filteringValue.headline, filteringValue.date, ...filteringValue.country])
  }, [filteringValue]);

  // Filtering Function
  useEffect(() => {
    // Headline
    if(filteringValue.headline !== '전체 헤드라인' && filteringValue.headline.length !== 0){

      if(filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

        if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
          // Headline + Date + Country
          headlinePlusDatePlusCountry(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
        } else {
          // Headline + Date
          headlinePlusDate(filteringValue, scrappedArticle, setScrappedArticle);
        }

      } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Headline + Country
        headlinePlusCountry(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
      } else {
        // Headline
        headlineFilter(filteringValue, scrappedArticle, setScrappedArticle);
      }

    } else if (filteringValue.date !== '전체 날짜' && filteringValue.date.length !== 0){

      if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
        // Date + Country
        datePlusCountry(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
      } else {
        // Date
        dateFilter(filteringValue, scrappedArticle, setScrappedArticle);
      }

    } else if(filteringValue.country[0] !== '전체 국가' && filteringValue.country.length !== 0){
      // Country
      countryFilter(filteringValue, krToEn, scrappedArticle, setScrappedArticle);
    } else {
      let getItem = localStorage.getItem('scrapList');
      const scrapList = JSON.parse(getItem || "");
      let copyArr = [...scrapList];
      setScrappedArticle(copyArr);
    }

  }, [filteringValue]);

  return(
    <div className="scrap-container">
      <div className="initial-container">
        <FontAwesomeIcon icon={faFileLines} className="initial-icon" />
        <p>저장된 스크랩이 없습니다.</p>
        <button onClick={() => {
          navigate('/');
        }}>스크랩 하러 가기</button>
      </div>

      <header className="scrap-header">
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
            scrappedArticle.map((value, i) => {
              return(
                <a className="scrap-link-article" href={`${value[6]}`} key={i}>
                  <article className="scrap-article">
                    <div className="scrap-article-top">
                      <h1>{value[1]}</h1>
                      <button id={typeof value[0] === 'string' ? value[0] : ''} className="scrap-button" onClick={(e) => {
                        let getItem = localStorage.getItem('scrapList');
                        let scrapList :ArticleType = JSON.parse(getItem || "");
                        let idx = scrapList.findIndex(v => v[0] === value[0]);
                        scrapList.splice(idx, 1);

                        window.alert('스크랩 해제 되었습니다.');
                        localStorage.setItem('scrapList', JSON.stringify(scrapList));
                        setReRendering(!reRendering);
                        e.preventDefault();
                      }}><FontAwesomeIcon icon={faStar} /></button>
                    </div>
                    <div className="scrap-article-bottom">
                      <div className="scrap-article-origin">
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
                      </div>
                      <div className="scrap-article-date">{value[3]}</div>
                    </div>
                  </article>
                </a>
              )
            })
          }
        </div>
      </main>
      <Modal setFilteringValue={setFilteringValue} modalOn={modalOn} setModalOn={setModalOn}></Modal>
    </div>
  )
}

export default Scrap
