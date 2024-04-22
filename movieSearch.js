document.addEventListener("DOMContentLoaded", function () {
  let myForm = document.getElementById("form");
  let data;
  let page = 1;
  let lastPage = 1;
  var storedTitleValue = "";
  let storedTypeValue = "";
  let totalResults = 0;

  let arrowRight = document.getElementById("arrowRight");
  let arrowLeft = document.getElementById("arrowLeft");
  let pageNums = document.querySelectorAll(".changePage");
  let buttonDetails = document.querySelectorAll(".getFilmDetails");
  let showPopUp = document.querySelector(".popUp");
  let cancel = document.querySelector(".cancel");
  let notFound = document.querySelector(".notFound");
  let img = new Image();
  img.src = "Materials/dog.jpg";
  
  console.log(buttonDetails);

  function makeRequest(textOfRequest) {
    
    notFound.classList.add("noDisplay");
    let request;
    if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
    } else {
      request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    request.open("GET", textOfRequest);

    request.onload = function () {
      if (request.status === 200) {
        try {
          const responseData = JSON.parse(request.responseText);

          console.log(responseData.Response);
          if (responseData.Response === "False") {
            console.error("Данного фильма нет в базе!");
            
            notFound.classList.remove("noDisplay");
          
          }

          if (responseData && responseData.Search) {
            if (Array.isArray(responseData.Search)) {
              data = responseData.Search;
              totalResults = responseData.totalResults;
              lastPage = Math.ceil(totalResults / 10);
              console.log("Массив объектов:", data);
              console.log("Всего фильмов: ", totalResults);
            } else if (typeof responseData === "object") {
              data = [responseData];
              totalResults = 1;
              console.log("Одиночный объект:", data);
              console.log("Всего фильмов: ", totalResults);
            } else {
              console.error("Некорректный формат данных");
            }
          }
        } catch (error) {
          console.error("Ошибка парсинга JSON:", error);
        }

        console.log(request.responseText);
        console.log("Мой объект:", data);

        if (notFound.classList.contains('noDisplay')) {
        setInfo(data);
        }

        for (let num of pageNums) {
          num.style.color = "initial";
          num.classList.remove("disabled");

          if (num.textContent <= lastPage) {
            num.style.display = "block";
          } else {
            num.classList.add("disabled");
          }
        }
      }
    };

    request.send();
  }

  function setInfo(data) {
    let img = new Image();
    img.src = "Materials/dog.jpg";

    img.onload = function () {
      console.log("Изображение загружено!");

      for (let i = 0; i < data.length; i++) {
        console.log("Объектов:", data.length);

        let showFilm = document.querySelector(`.mov.movie${i}`);
        if (showFilm) {
          showFilm.style.display = "flex";
        }

        let poster = document.querySelector(`.movie${i} .filmPoster`);
        poster.alt = data[i].Title;

        if (data[i].Poster === "N/A" || !data[i].Poster) {
          poster.src = img.src;
        } else {
          poster.src = data[i].Poster;
        }
        let type = document.querySelector(`.movie${i} .filmType`);
        type.textContent = data[i].Type;
        let title = document.querySelector(`.movie${i} .filmName`);
        title.textContent = data[i].Title;
        let year = document.querySelector(`.movie${i} .filmYear`);
        year.textContent = data[i].Year;
      }
    };

    for (let i = data.length; i < 10; i++) {
      let hideFilm = document.querySelector(`.mov.movie${i}`);
      if (hideFilm) {
        hideFilm.style.display = "none";
      }
    }
  }

  let filmsAboutSpace =
    "http://www.omdbapi.com/?i=tt3896198&apikey=c491e1dd&p=100&y=2023&s=space";
  storedTitleValue = "space";
  makeRequest(filmsAboutSpace);
  numbersOfPages();

  myForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let titleValue = document.getElementById("title-inp").value;
    let typeValue = document.getElementById("type-inp").value;

    if (notFound.classList.contains('noDisplay')) {
    storedTitleValue = titleValue;
    storedTypeValue = typeValue;
    }
  
    console.log("Title:", titleValue);
    console.log("Type:", typeValue);

    let textOfRequest =
      "http://www.omdbapi.com/?i=tt3896198&apikey=c491e1dd&p=100" +
      "&s=" +
      storedTitleValue +
      "&type=" +
      storedTypeValue +
      "&page=1";

    console.log(textOfRequest);

    makeRequest(textOfRequest);

   
    let resultTitle = document.querySelector(".result");
    resultTitle.textContent = `Your search result for the word(s) "${storedTitleValue}"`;

    let n = 1;

    for (let num of pageNums) {
      num.textContent = n;

      if (parseInt(num.textContent) <= lastPage) {
        num.style.display = "block";
      } else {
        num.style.display = "none";
      }

      n++;
    }
  });

  function numbersOfPages() {
    let n = 1;

    for (let num of pageNums) {
      num.textContent = n;

      if (parseInt(num.textContent) <= lastPage) {
        num.style.display = "block";
      } else {
        num.style.display = "none";
      }

      n++;
    }
  }

  pageNums.forEach((button) => {
    button.addEventListener("click", function (event) {
      page = parseInt(button.textContent);

      let textOfRequest =
        "http://www.omdbapi.com/?i=tt3896198&apikey=c491e1dd&p=100" +
        "&s=" +
        storedTitleValue +
        "&type=" +
        storedTypeValue +
        "&page=" +
        page;

      makeRequest(textOfRequest);

      let resultTitle = document.querySelector(".result");
      resultTitle.textContent = `Your search result for the word(s) "${storedTitleValue}"`;
    });
  });

  arrowRight.addEventListener("click", function () {
    let firstPage = parseInt(pageNums[0].textContent);

    if (firstPage + 6 > lastPage) {
      return;
    }

    for (let num of pageNums) {
      let numText = parseInt(num.textContent);
      num.textContent = numText + 6;

      if (num.textContent > lastPage) {
        num.classList.add("disabled");
      }
    }
  });

  arrowLeft.addEventListener("click", function () {
    let firstPage = parseInt(pageNums[0].textContent);

    if (firstPage === 1) {
      return;
    }

    for (let num of pageNums) {
      let numText = parseInt(num.textContent);
      num.textContent = Math.max(1, numText - 6);

      num.style.color = "initial";
      num.classList.remove("disabled");
    }
  });

  cancel.addEventListener("click", function () {
    showPopUp.classList.add("noDisplay");
  });

  buttonDetails.forEach((button) => {
    button.addEventListener("click", function (event) {
      showPopUp.classList.remove("noDisplay");
      let movieDiv = event.target.closest('[class*="movie"]');
      let movieId = movieDiv.dataset.movieId;
      console.log("Главный div:", movieId);

      let titleElement = document.querySelector(`.movie${movieId} .filmName`);
      console.log(titleElement.textContent);

      let titleValue = document.querySelector(
        `.movie${movieId} .filmName`
      ).textContent;
      let typeValue = document.querySelector(
        `.movie${movieId} .filmType`
      ).textContent;

      console.log(titleValue, typeValue);
      let textOfRequest =
        "http://www.omdbapi.com/?i=tt3896198&apikey=c491e1dd&p=100" +
        "&t=" +
        titleValue +
        "&type=" +
        typeValue;

      let request = new XMLHttpRequest();

      request.open("GET", textOfRequest);

      request.onload = function () {
        if (request.status === 200) {
          try {
            const responseData = JSON.parse(request.responseText);

            if (responseData && typeof responseData === "object") {
              data = [responseData];

              console.log(data[0].Poster);
              let poster = document.querySelector(".d-poster");

              if (data[0].Poster === "N/A" || !data[0].Poster) {
                poster.src = img.src;
              } else {
                poster.src = data[0].Poster;
              }


              let title = document.querySelector(".d-filmName");
              title.textContent = data[0].Title;

              let released = document.querySelector(".d-released");
              released.textContent = data[0].Released;

              let genre = document.querySelector(".d-genre");
              genre.textContent = data[0].Genre;

              let country = document.querySelector(".d-country");
              country.textContent = data[0].Country;

              let director = document.querySelector(".d-director");
              director.textContent = data[0].Director;

              let writer = document.querySelector(".d-writer");
              writer.textContent = data[0].Writer;

              let actors = document.querySelector(".d-actors");
              actors.textContent = data[0].Actors;

              let awards = document.querySelector(".d-awards");
              awards.textContent = data[0].Awards;

              let plot = document.querySelector(".d-description");
              plot.textContent = data[0].Plot;

              console.log("Одиночный объект:", data);
            } else {
              console.error("Некорректный формат данных");
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.error("JSON response:", request.responseText);
          }
        }
      };

      request.send();
    });
  });
});
