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
export type ArticleType = {
  id : number,
  headline : string,
  byline : string,
  date : string,
  source : string
};


/* filteringValue initialState
{
  headline : headline,
  date : date,
  country : country
}
*/
export type FilteringValueType = {
  headline? : string,
  date? : string,
  country? : string[]
}


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


export const { setInitialState } = article.actions;
export const { applyFilter } = filteringValue.actions;

export const store = configureStore({
  reducer: {
    article : article.reducer,
    filteringValue : filteringValue.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
