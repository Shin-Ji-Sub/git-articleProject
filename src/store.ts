import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import { Filter } from 'http-proxy-middleware';

/* article initialState
[ {
  id : _id,
  headline : headline,
  byline : byline.original(except 'By'),
  date : pub_date,
  source : source
  keyword : keywords
} ]
*/
type KeywordType = {
  [key :string] : string
}

export type ArticleType = {
  id : string,
  headline : string,
  byline : string,
  date : string,
  source : string
  keyword : KeywordType[]
};

const articleValue :ArticleType[] = [];

const article = createSlice({
  name : 'article',
  initialState : articleValue,
  reducers : {
    setInitialState(state, action :PayloadAction<ArticleType[]>){
      return state = [...state, ...action.payload];
    }
  }
});


/* filteringValue initialState
{
  headline : headline,
  date : date,
  country : country
}
*/
type FilteringValueType = {
  headline? : string,
  date? : string,
  country? : string[]
}

const filterValue :FilteringValueType = {}

const filteringValue = createSlice({
  name : 'filteringValue',
  initialState : filterValue,
  reducers : {
    applyFilter(state, action :PayloadAction<FilteringValueType>){
      return state = {...action.payload};
    }
  }
});

// type FilteringType = {
//   headline : string,
//   date : string,
//   country : string[]
// }

// const filteringValue :ArticleType[] = [];

// const filtering = createSlice({
//   name : 'filtering',
//   initialState : filteringValue,
//   reducers : {
//     setFiltering(state, action: PayloadAction<ArticleType[]>){
//       return state = [...action.payload];
//     },

//     // filteringFunction 모달에서 실행해야함
//     filteringFunction(state, action :PayloadAction<FilteringType>){
//       // Date Filtering
//       if(action.payload.date !== '전체 날짜' || action.payload.date.length !== 0){
//         let arr :ArticleType[] = [];
//         const dateValue = action.payload.date.replaceAll('.', '');
//         const PROXY = window.location.hostname === 'localhost' ? 'https://api.nytimes.com' : '/proxy';
//         axios.get(`${PROXY}/svc/search/v2/articlesearch.json?begin_date=${dateValue}&end_date=${dateValue}&api-key=vcX7Gz19ajfmaRuAARlHUrclu7mZh46l`)
//         .then((result) => {
//           console.log(result.data.response.docs);
//           let arr :ArticleType[] = [];
//           for(let i = 0; i < 10; i++){
//             // state[i].id = result.data.response.docs[i]._id.slice(-12),
//             // state[i].headline = result.data.response.docs[i].headline.main,
//             // state[i].byline = result.data.response.docs[i].byline.original?.slice(3),
//             // state[i].date = result.data.response.docs[i].pub_date.slice(0, 10),
//             // state[i].source = result.data.response.docs[i].source,
//             // state[i].keyword = result.data.response.docs[i].keywords,
//             // state[i].url = result.data.response.docs[i].web_url
//             arr.push({
//               id : result.data.response.docs[i]._id.slice(-12),
//               headline : result.data.response.docs[i].headline.main,
//               byline : result.data.response.docs[i].byline.original?.slice(3),
//               date : result.data.response.docs[i].pub_date.slice(0, 10),
//               source : result.data.response.docs[i].source,
//               keyword : result.data.response.docs[i].keywords,
//               url : result.data.response.docs[i].web_url
//             });
//           }
//         });
//         return state = [...arr];
//       }
//     }
//   }
// })


const articleAfterFiltering = createSlice({
  name : 'articleAfterFiltering',
  initialState : articleValue,
  reducers : {
    afterFilter(state, action :PayloadAction<ArticleType[]>){
      return state = [...action.payload];
    }
  }
});


type ScrapType = {
  id : string,
  scrap : boolean
}

const scrapInitialState :ScrapType[] = [];

const scrapArticle = createSlice({
  name : 'scrapArticle',
  initialState : scrapInitialState,
  reducers : {
    saveArticle(state, action :PayloadAction<string>){
      let findIdx = state.findIndex(v => v.id === action.payload);
      if(findIdx === -1){
        state.push({
          id : action.payload,
          scrap : true
        });
      } else {
        state[findIdx].scrap = false;
      }
    }
  }
});


export const { setInitialState } = article.actions;
// export const { setFiltering, filteringFunction } = filtering.actions;
export const { applyFilter } = filteringValue.actions;
export const { afterFilter } = articleAfterFiltering.actions;
export const { saveArticle } = scrapArticle.actions;

export const store = configureStore({
  reducer: {
    article : article.reducer,
    // filtering : filtering.reducer,
    filteringValue : filteringValue.reducer,
    articleAfterFiltering : articleAfterFiltering.reducer,
    scrapArticle : scrapArticle.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
