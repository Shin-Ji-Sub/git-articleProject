import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

/* article initialState
[ {
  id : index,
  headline : headline,
  byline : byline.original(except 'By'),
  date : pub_date,
  source : source
} ]
*/
type KeywordType = {
  [key :string] : string
}

export type ArticleType = {
  id : number,
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


const articleAfterFiltering = createSlice({
  name : 'articleAfterFiltering',
  initialState : articleValue,
  reducers : {
    afterFilter(state, action :PayloadAction<ArticleType[]>){
      return state = [...action.payload];
    }
  }
});


export const { setInitialState } = article.actions;
export const { applyFilter } = filteringValue.actions;
export const { afterFilter } = articleAfterFiltering.actions;

export const store = configureStore({
  reducer: {
    article : article.reducer,
    filteringValue : filteringValue.reducer,
    articleAfterFiltering : articleAfterFiltering.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
