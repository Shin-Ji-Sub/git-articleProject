import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faCalendarCheck, faMagnifyingGlass, faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Article } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { ArticleType, RootState } from "../store";
import { Modal } from "./Modal";
import { FilteringType } from "../App";


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
  const dispatch = useDispatch();
  const state = useSelector((state :RootState) => state);

  // Initial Screen
  useEffect(() => {
    let getItem = localStorage.getItem('scrapList');
    let InitialContainer = document.querySelector('.initial-container');
    if(getItem === null){
      if(InitialContainer instanceof HTMLElement){
        InitialContainer.style.visibility = 'visible';
      }
    } else {
      if(getItem === '[]'){
        if(InitialContainer instanceof HTMLElement){
          InitialContainer.style.visibility = 'visible';
        }
      } else {
        if(InitialContainer instanceof HTMLElement){
          InitialContainer.style.visibility = 'hidden';
        }
        getItem = JSON.parse(getItem);
        let copyArr :ArticleType[] = [];
        if(getItem !== null){
          for(let i = 0; i < getItem.length; i++){
            let copyObj :ArticleType = {
              // @ts-expect-error
              id : getItem[i].id,
              // @ts-expect-error
              headline : getItem[i].headline,
              // @ts-expect-error
              byline : getItem[i].byline,
              // @ts-expect-error
              date : getItem[i].date,
              // @ts-expect-error
              source : getItem[i].source,
              // @ts-expect-error
              keyword : getItem[i].keyword,
              // @ts-expect-error
              url : getItem[i].url,
              // @ts-expect-error
              scrap : getItem[i].scrap
            };
            copyArr.push(copyObj);
          }
        }
        setScrappedArticle(copyArr);
      }
    }
  },[location, reRendering]);

  // Scrap UI
  useEffect(() => {
    let getItem = localStorage.getItem('scrapList');
    getItem = JSON.parse(getItem || "");
    // @ts-expect-error
    getItem.map((value) => {
      let buttonEl = document.getElementById(`${value.id}`);
      if(buttonEl instanceof HTMLButtonElement){
        buttonEl.style.color = 'rgb(255, 180, 35)';
      }
    });
  });

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

  return(
    <div className="scrap-container">
      <div className="initial-container">
        <FontAwesomeIcon icon={faFileLines} className="initial-icon" />
        <p>저장된 스크랩이 없습니다.</p>
        <button onClick={() => {
          navigate('/');
        }}>스크랩 하러 가기</button>
      </div>

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
            scrappedArticle.map((value, i) => {
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
                            if(buttonEl.parentElement !== null){
                              if(buttonEl.parentElement.parentElement !== null){
                                buttonEl.parentElement.parentElement.remove();
                              }
                            }
                          }
                        }
                        localStorage.setItem('scrapList', JSON.stringify(getItem));
                        setReRendering(!reRendering);
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
    </div>
  )
}

export {Scrap}
