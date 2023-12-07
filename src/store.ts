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
  keyword : KeywordType[],
  url : string,
  scrap: boolean
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


const articleAfterFiltering = createSlice({
  name : 'articleAfterFiltering',
  initialState : articleValue,
  reducers : {
    afterFilter(state, action :PayloadAction<ArticleType[]>){
      return state = [...action.payload];
    }
  }
});


let idInitialState :string[] = [];

const articleId = createSlice({
  name : 'articleId',
  initialState : idInitialState,
  reducers : {
    idSetting(state, action :PayloadAction<string[]>) {
      return state = [...action.payload];
    }
  }
});


let scrapInitialState :string[] = [];

const scrapArticle = createSlice({
  name : 'scrapArticle',
  initialState : scrapInitialState,
  reducers : {
    settingValue(state, action :PayloadAction<string>){
      let idx = state.findIndex(v => v === action.payload);
      if(idx === -1){
        state.push(action.payload);
      } else {
        state.splice(idx, 1);
      }
    },

    // saveArticle(state, action :PayloadAction<ArticleType>){
    //   let getItem = localStorage.getItem('scrapList');
    //   getItem = JSON.parse(getItem || "");
      
    //   let findIdx = state.findIndex(v => v.id === action.payload.id);
    //   if(findIdx === -1){
    //     let copy = {...action.payload};
    //     copy.scrap = true;
    //     state.push(copy);
    //   } else {
    //     state[findIdx].scrap = !state[findIdx].scrap;
    //   }
    // }
  }
});


export const { setInitialState } = article.actions;
export const { applyFilter } = filteringValue.actions;
export const { afterFilter } = articleAfterFiltering.actions;
export const { idSetting } = articleId.actions;
export const { settingValue } = scrapArticle.actions;

export const store = configureStore({
  reducer: {
    article : article.reducer,
    filteringValue : filteringValue.reducer,
    articleAfterFiltering : articleAfterFiltering.reducer,
    articleId : articleId.reducer,
    scrapArticle : scrapArticle.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
