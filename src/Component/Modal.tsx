import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FilteringType } from '../App';


// Filtering Modal
type ModalType = {
  modalOn : boolean,
  setModalOn : Dispatch<SetStateAction<boolean>>,
  setFilteringValue : Dispatch<SetStateAction<FilteringType>>
}

function Modal ({modalOn, setModalOn, setFilteringValue} : ModalType) {
  const [startDate, setStartDate] = useState(new Date());
  const [placeholderValue, setPlaceholderValue] = useState(false);
  const [country, setCountry] = useState([
    {nation : '대한민국', click : false},
    {nation : '중국', click : false},
    {nation : '일본', click : false},
    {nation : '미국', click : false},
    {nation : '북한', click : false},
    {nation : '러시아', click : false},
    {nation : '프랑스', click : false},
    {nation : '영국', click : false}
  ]);
  let [buttonClick, setButtonClick] = useState<HTMLButtonElement>();

  // Country Button UI
  useEffect(() => {
    let index = Number(buttonClick?.id);
    if(buttonClick instanceof HTMLButtonElement){
      if(country[index].click){
        buttonClick.style.backgroundColor = 'rgb(107, 157, 237)';
        buttonClick.style.color = 'white';
      } else {
        buttonClick.style.backgroundColor = 'white';
        buttonClick.style.color = 'black';
      }
      setButtonClick(undefined);
    }
  }, [buttonClick]);

  // Modal OFF
  useEffect(() => {
    if(modalOn === false){
      let modalContainer = document.querySelector('.modal-container');
      if(modalContainer instanceof HTMLElement){
        modalContainer.style.opacity = '0';
        modalContainer.style.zIndex = '-10';
      }
    }
  }, [modalOn])

  return(
    <div className="modal-container">
      <div className="filter-container">
        <ul>
          <li>
            <label htmlFor="headline">헤드라인</label>
            <input type="text" id="headline" name="headline" placeholder="검색하실 헤드라인을 입력해주세요." />
          </li>
          <li>
            <label htmlFor="date">날짜</label>
            <div className='datepicker-container'>  
              <DatePicker
                dateFormat='yyyy.MM.dd'
                shouldCloseOnSelect
                maxDate={new Date()}
                placeholderText={"날짜를 선택해주세요."}
                selected={placeholderValue ? startDate : null}
                onChange={(date :Date) => {
                  setStartDate(date)
                  setPlaceholderValue(true);
                }}
                className='calendar-input'
              >
              </DatePicker>
              <span className="datepicker-icon">
                <FontAwesomeIcon className='calendar-icon' icon={faCalendarCheck}/>
              </span>
            </div>
          </li>
          <li>
            <div>국가</div>
            <div className="country-button-container">
              {
                country.map((value, i) => {
                  return(
                    <button className='country-button' id={`${i}`} onClick={(e) => {
                      let copy = [...country];
                      copy[i].click = !copy[i].click;
                      setCountry(copy);
                      setButtonClick(e.currentTarget);
                    }} key={i}>{value.nation}</button>
                  )
                })
              }
            </div>
          </li>
          <li>
            <button className="filter-button" onClick={() => {
              const headlineValue = document.querySelector('#headline');
              const dateValue = document.querySelector('.calendar-input');
              if(headlineValue instanceof HTMLInputElement && dateValue instanceof HTMLInputElement){
                let countryValue :string[] = [];
                country.map((value) => {
                  if(value.click){
                    countryValue.push(value.nation);
                  }
                });
                setFilteringValue({
                  headline : headlineValue.value,
                  date : dateValue.value,
                  country : countryValue
                });
                setModalOn(false);
              }
            }}>필터 적용하기</button>
          </li>
        </ul>
      </div>
    </div>
  )
}


export default Modal
