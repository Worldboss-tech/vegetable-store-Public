import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import classes from './OrderForm.module.css';
import PagesContext from "../../pages/PagesContext";
import cn from "classnames";
import {compact} from "lodash";

export default (props: any) => {

  const cartContext = useContext(PagesContext);

  const cartItems = cartContext?.cartItems;
  const totalCost = cartContext?.totalCost;

  interface dataField {
    value: string,
    placeholder: string,
    required: boolean,
  }

  const initialOrderInfo: { [char: string]: dataField } = {
    fullName: {
      value: '',
      placeholder: 'Ф.И.О',
      required: true,
    },
    cityName: {
      value: '',
      placeholder: 'Город',
      required: true,
    },
    streetName: {
      value: '',
      placeholder: 'Улица',
      required: true,
    },
    homeNumber: {
      value: '',
      placeholder: 'Дом',
      required: true,
    },
    sectionId: {
      value: '',
      placeholder: 'Cт',
      required: false,
    },
    flatNumber: {
      value: '',
      placeholder: 'Кв',
      required: true,
    },
    postalCode: {
      value: '',
      placeholder: 'Индекс',
      required: true,
    },
    phoneNumber: {
      value: '',
      placeholder: 'Телефон',
      required: true,
    },
    email: {
      value: '',
      placeholder: 'Эмэйл',
      required: true,
    },
  }

  const [orderInfo, setOrderInfo] = useState(initialOrderInfo);
  const [submitIsDisabled, setSubmitIsDisabled] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');

  const changeOrderInfo = (e: any) => {
    const newOrderInfo = {...orderInfo};
    newOrderInfo[e?.target?.dataset?.name].value = e?.target?.value;
    setOrderInfo(newOrderInfo);
  }

  useEffect(() => {
    checkDataFilling()
  })

  const checkDataFilling = () => {
    const fields = Object.values(orderInfo);
    setSubmitIsDisabled(false)
    fields.map((field) => {
      !field.value && field.required && setSubmitIsDisabled(true);
    })
  }
  
  const checkData = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        form.reset();
        setOrderInfo(initialOrderInfo)
        setOrderStatus("SUCCESS");
      } else {
        setOrderStatus("ERROR");
      }
    };
    xhr.send(data);
  }

  return (
    <form className={classes.OrderForm}
          onSubmit={(e: any) => checkData(e)}
          action="https://formspree.io/f/xaylkanp"
          method="POST"
    >
      <h2 className={classes.title}>Куда отправлять?</h2>
      <div className={classes.holder}>
        {Object.keys(orderInfo).map((field: string, index: number) => {
          return (
            <input className={cn({[classes.input]: true, [classes.input_filled]: orderInfo[field].value})}
                   key={index}
                   data-name={field}
                   value={orderInfo[field].value}
                   placeholder={orderInfo[field].placeholder}
                   onChange={(e: any) => changeOrderInfo(e)}
                   name={orderInfo[field].placeholder}
            />
          )
        })}
      </div>
      {cartItems?.map((item, index) => {
        const cartItem = item.item;
        return (
          <input type="hidden"
                 key={index}
                 name={`Поз№ ${index + 1}`}
                 value={`${cartItem.item.name} ${cartItem.selectedVolume.volume} ${item.count} шт.`}
          />
        )
      })}
      <input type="hidden"
             name="Стоимость заказа"
             value={`${totalCost} руб.`}
      />
      <button type="submit"
              className={classes.submit}
              disabled={submitIsDisabled}
      >
        Продолжить
      </button>
      {orderStatus === "SUCCESS" && <p className={classes.status}>Ваш заказ успешно принят</p>}
    </form>
  );
};