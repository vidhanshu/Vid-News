// 

const cardContainer = document.querySelector('.news-container');

const select = document.querySelector(".form-select");

const mode = document.querySelector(".icon");

const body = document.querySelector(".body")

const countrySelector = document.querySelector(".country")


if (navigator.onLine) {


    window.onload = function() {
        if (select.value === "Select your interest") {
            cardContainer.innerHTML = 'No Category Selected';
        } else {
            xhrRequestMar("general", 'in');
            cardContainer.innerHTML = '<progress></progress>';
        }
    }


    select.addEventListener('change', (event) => {
        cardContainer.innerHTML = `<progress ></progress>`;
        xhrRequestMar(event.target.value, countrySelector.value)
    })

    countrySelector.addEventListener('change', (event) => {
        cardContainer.innerHTML = `<progress ></progress>`;
        xhrRequestMar(select.value, event.target.value)
    })



    function xhrRequestMar(category, country) {

        if (navigator.onLine) {

            if (category === "Select your interest" && country === "Select country") {
                cardContainer.innerText = 'Category And Country Both Are Not Selected';

            } else if (category === "Select your interest" && country !== "Select country") {
                cardContainer.innerText = 'Category is Not Selected';
            } else if (category !== "Select your interest" && country === "Select country") {
                cardContainer.innerText = 'Country is Not Selected';
            } else {
                const newsXHR = new XMLHttpRequest();

                console.log(country)

                newsXHR.open("GET", `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=b24f55ffbca44289a095bd24c2e24aa1`, true);

                newsXHR.onprogress = () => {
                    cardContainer.innerHTML = `<progress></progress>`;
                }

                newsXHR.onload = function() {
                    if (this.status == 200 && this.readyState == 4) {
                        cardContainer.innerHTML = '';
                        const data = JSON.parse(this.responseText);
                        data.articles.map(e => {
                            let time = (new Date(e.publishedAt)).toISOString();
                            const cut = time.lastIndexOf(".");
                            time = time.slice(0, cut);
                            time = time.replace("T", "  ")
                            cardContainer.appendChild(cardCreator((e.urlToImage === null) ? 'https://th.bing.com/th/id/OIP.kqT6XFsG2BTW22Y4st2-KAHaHa?pid=ImgDet&rs=1' :
                                e.urlToImage, e.title, e.description, e.url, time))
                        })
                    }
                    if (this.status == 429) {
                        cardContainer.innerHTML = '<p>Api fetch limit reached!<br>This simply means, Actually the Api i"m using has some limit on fetching data from server since it is paid API <br> That limit is 50/day</p>';
                    }
                }
                newsXHR.send();
            }

        } else {
            cardContainer.innerText = 'Your offline 😭';
        }

    }

    function cardCreator(imgsrc, title, content, btnLink, publishedAt = "00:00") {
        const templateCard = document.createElement('div');
        templateCard.className = "card";
        templateCard.style.width = "18rem";

        const image = document.createElement('img');
        image.src = imgsrc;
        image.style.width = "17rem";

        const cardBody = document.createElement('div');
        cardBody.className = "card-body";


        const heading = document.createElement('h5');
        heading.innerText = title;
        heading.className = "card-title";

        const small = document.createElement('small');
        small.innerText = publishedAt;

        const para = document.createElement('p');
        para.innerText = content;
        heading.className = "card-text";

        const link = document.createElement('a');
        link.href = btnLink;
        link.classList.add('btn', 'btn-primary');
        link.innerText = "Go to news";

        templateCard.appendChild(image);
        cardBody.appendChild(heading);
        cardBody.appendChild(small);
        cardBody.appendChild(para);
        cardBody.appendChild(link);
        templateCard.appendChild(cardBody);
        return templateCard;
    }

    mode.addEventListener('click', toggleDarkLightMode)

    function toggleDarkLightMode() {
        if (mode.innerText == "☀") {
            mode.innerText = "🌙";
            body.style.background = "rgb(24, 24, 24)"
        } else {
            body.style.background = "white"
            mode.innerText = "☀";
        }
    }
} else {

    //this will start checking while the user come back online and as soon as user come back online we will reload the page
    cardContainer.innerText = 'Your offline 😭';
    const key = setInterval(() => {
        if (navigator.onLine) {
            clearInterval(key);
            window.location.reload(true);
        }
        console.log("apple");
    }, 1000);
}