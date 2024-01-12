import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Filter } from 'http-proxy-middleware';

/* article initialState
[ 
  [id, headline, byline, date, source, [keyword], url],
  [id, headline, byline, date, source, [keyword], url],
  [id, headline, byline, date, source, [keyword], url]
]
*/

export type ArticleType = (string | string[])[];

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


export const { setInitialState } = article.actions;
export const { applyFilter } = filteringValue.actions;
export const { idSetting } = articleId.actions;

export const store = configureStore({
  reducer: {
    article : article.reducer,
    filteringValue : filteringValue.reducer,
    articleId : articleId.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
