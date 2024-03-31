import React from "react";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PelmeniBlock from "../components/Pelmeni-Block";
import Skeleton from "../components/Skeleton";

const Home = ({ searchValue, setSearchValue }) => {
  console.log(searchValue);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [sortType, setSortType] = React.useState({
    name: "популярности",
    sortProperty: "rating", //изначальные данные, sortProperty - для бэка к запросу, искать по цене, рейтингу, наименованию
  });

  const category = categoryId > 0 ? `category=${categoryId}` : "";
  //если выбранная категория не "Все" - добавляется номер категории от 1 до n - categories.length
  const sort = sortType.sortProperty.replace("-", ""); //удаляет минус, чтобы не было ошибки
  const sortOrder = sortType.sortProperty.includes("-") ? "asc" : "desc"; //проверяет наличие минуса, чтобы выбрать

  React.useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://66028e549d7276a755538691.mockapi.io/items?${category}&sortBy=${sort}&order=${sortOrder}&name${searchValue}`
    )
      .then((res) => {
        return res.json();
      })
      .then((arr) => {
        setItems(arr);
        setIsLoading(false); //два действия нужны - это асинхронная функция, пока рендерятся пиццы, выставляется set(false)
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType]); //при изменении данных элементов, запрос отправляется на бэк

  const skelets = [...new Array(6)].map((_, index) => <Skeleton key={index} />);
  const products = items
    .filter((obj) => {
      if (obj.name.toLowerCase().includes(searchValue)) {
        return true;
      }
      return false;
    })
    .map((obj) => <PelmeniBlock key={obj.id} {...obj} />);

  return (
    <>
      <div className="content__top">
        <Categories
          value={categoryId} //начальное значение принимает ноль, затем отправляется в параметры компонента Category
          onClickCategory={(id) => setCategoryId(id)} //обновляется значение на id, кликнутого элемента
        />
        <Sort value={sortType} onClickSort={(id) => setSortType(id)} />
      </div>
      <h2 className="content__title">Все пельмени</h2>
      <div className="content__items">{isLoading ? skelets : products}</div>
    </>
  );
};

export default Home;