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

export interface articleType  {
  id : number,
  headline : string,
  byline : string,
  date : string,
  source : string
};

const articleValue :articleType[] = [];

const article = createSlice({
  name : 'article',
  initialState : articleValue,
  reducers : {
    setInitialState(state, action :PayloadAction<articleType[]>){
      return state = [...action.payload];
    }
  }
});


export const { setInitialState } = article.actions;

export const store = configureStore({
  reducer: {
    article : article.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
