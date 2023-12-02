import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faMagnifyingGlass, faHouse, faFileLines, faStar } from "@fortawesome/free-solid-svg-icons";
import './App.css';
import { useState, useEffect } from "react";
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
  const [headerList, setHeaderList] = useState(['전체 헤드라인', '전체 날짜', '전체 국가']);
  const [headerListIcon, setHeaderListIcon] = useState([<FontAwesomeIcon className="header-icon" icon={faMagnifyingGlass} />, <FontAwesomeIcon className="header-icon" icon={faCalendarCheck} />])
  const state = useSelector((state :RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('https://api.nytimes.com/svc/archive/v1/2019/1.json?api-key=hVAYrCA3bAakTA6nZKdr28zIJPEGU1Dr').then((result) => {
      console.log(result.data.response.docs[0].byline.person[0].lastname);
      let arr :articleType[] = [];
      // i 부분 스크롤 이벤트가 발생할 때마다 바꿔줘야 함!!!!!!
      for(let i = 0; i < 10; i++){
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
  }, []);

  return (
    <div className="App">
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
          <li><FontAwesomeIcon className="footer-icon" icon={faHouse} />홈</li>
          <li><FontAwesomeIcon className="footer-icon" icon={faFileLines} />스크랩</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
