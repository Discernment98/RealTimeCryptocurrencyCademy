const protocol = window.location.protocol;
const host = window.location.hostname;
// const apiRootUrl = (protocol === 'http:' || host.includes('localhost')) ? 
//     'http://localhost:8000' : 
//     'https://crypto-academia.herokuapp.com';
const apiRootUrl = 'https://crypto-academia.herokuapp.com';
const dashboardUrl = `https://crypto-academia-dashboard.netlify.app/#`;

const postData = async (url, body, headers) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        return await response.json();
    }
    catch (ex) {
        throw ex;
    }
};

const getData = async (url, headers) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        return await response.json();
    }
    catch (ex) {
        throw ex;
    }
};

// Loads date in the footer
const initFooterContent = () => {
    const footer = document.querySelector("#footer");
    footer.innerHTML = `<span>
        Created By 
        <a href="#">DisTech</a> | <span class="far fa-copyright"></span> ${new Date().getFullYear()} All rights reserved.
        </span>
    `;
};

const formatToCurrency = (amount) => {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    });
};

// Find latest event
const findLatestEvent = async () => {
    try {
        const requestUrl = `${apiRootUrl}/course-event/latest/find-latest-upcoming-event/${new Date()}`;
        const response = await getData(requestUrl, { "Content-Type": "application/json" });
        if (response.code === 200) {
            const { 
                data: { 
                    address, 
                    title, 
                    eventDate, 
                    promotionalImage,
                    eventTime,
                    id: eventId
                },
            } = response;
            const event = new Date(eventDate);
            const dateFormattingOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedEventDate = event.toLocaleDateString('en-US', dateFormattingOptions);

            const container = document.querySelector("#events-card");
            container.innerHTML = '';
            container.innerHTML = `
                <div class="vertical-card-widget">
                    <div class="card-widget-content">
                        <h4 class="widget-sub-title">
                            ${address ? 'Seminar' : 'Webinar'}
                        </h4>
                        <h1 class="text-danger widget-title">
                            ${title}
                        </h1>
                        ${
                            (eventTime) ? ` 
                                <time>
                                    ${formattedEventDate}
                                </time>` : 
                                `<time>
                                    ${formattedEventDate} @ ${eventTime}
                                </time>
                            `
                        }
                    
                        <div class="btn-hold mt-40">
                            <button class="btn btn-large">
                                <a target="_blank" href="${dashboardUrl}/event/:${eventId}" class="inherit-color">
                                    Register Now
                                </a>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="vertical-card-widget hide-md-down">
                    <img src="${promotionalImage}" alt="${title}" />
                </div>
            `;
        } else {
            const footerElement = document.querySelector("#footer");
            const contactElement = document.querySelector("#contact");
            const containerElement = document.querySelector("#events");
            const eventNavLinkElement = document.querySelector("#event-nav-li");
            
            eventNavLinkElement.classList.add('display-none');
            containerElement.classList.add('display-none');
            footerElement.classList.add('bg-black');
            contactElement.classList.add('bg-white');
        }
    }
    catch (ex) {
        throw ex;
    }
}

const findCourses = async () => {
    try {
        const requestUrl = `${apiRootUrl}/course/find-courses-for-sl?fields=code,data(id,title,promoImageUrl,description,pricesForThisCourse(status,price))`;
        const response = await getData(requestUrl, { "Content-Type": "application/json" });
        if (response.code === 200) { 
            let courses = response.data;
            courses = courses.map((course) => {
                const findPrice = course.pricesForThisCourse.find((price) => price.status);
                return {
                    promoImageUrl: course.promoImageUrl,
                    title: course.title,
                    description: course.description,
                    id: course.id,
                    price: `₦${formatToCurrency(findPrice?.price ?? 0)}`
                };
            });

            // Render content
            const courseContainer = document.querySelector("#courses-container");
            courseContainer.innerHTML = '';

            // Reorder courses by basic, master and advanced
            if (courses?.length > 0) {
                if (courses.find(({ title }) => title.toLowerCase().startsWith('basic')) && 
                    courses.find(({ title }) => title.toLowerCase().startsWith('advanced')) && 
                    courses.find(({ title }) => title.toLowerCase().startsWith('master'))
                ) {
                    const reorderedCoursesArray = [];
                    reorderedCoursesArray[0] = courses.find(({ title }) => title.toLowerCase().startsWith('basic'));
                    reorderedCoursesArray[1] = courses.find(({ title }) => title.toLowerCase().startsWith('master'));
                    reorderedCoursesArray[2] = courses.find(({ title }) => title.toLowerCase().startsWith('advanced'));
                    courses = reorderedCoursesArray;
                }
            }

            for (const course of courses) {
                const promoImage = course.promoImageUrl ? course.promoImageUrl : '/assets/images/LOGO1RTD.PNG';
                // Write path for 'Read more' button
                courseContainer.innerHTML += `<div class="card custom-card">
                    <div class="box">
                        <div class="img">
                            <img src="${promoImage}" alt="${course.title}" />
                        </div>
                        <div class="text course-content">
                            <h2 class="card-title">${course.title}</h2>
                            <div class="no-margin course-description">
                                ${course.description}
                            </div>
                        </div>
                        <p class="text-danger course-price-section">${course.price}</p>
                        <div class="card-action text-center">
                            <a href="${dashboardUrl}/course/info/:${course.id}" target="_blank" class="menu-btn1">
                                Join
                            </a>
                        </div>
                    </div>
                </div>`;
            }
        }
    }
    catch (ex) {
        throw ex;
    }
};

let timesRun = 0;
let interval = setInterval(function(){
    timesRun += 1;
    if(timesRun === 10){
        clearInterval(interval);
    }
    //do whatever here..
    const startHtml = '<i class="fa fa-plus"></i>&nbsp;&nbsp;';
    document.querySelectorAll(".course-content").forEach((element) => { 
        element.querySelectorAll('ul li').forEach((element) => { 
            const currentHtml = element.innerHTML;
            const newHtml = currentHtml.startsWith(startHtml) ? currentHtml : `<i class="fa fa-plus"></i>&nbsp;&nbsp; ${currentHtml}`;
            element.innerHTML = newHtml;
        });
    });
}, 2000);

$(document).ready(async function() {
    initFooterContent();
    // Load data for courses
    await findCourses();

    // Load latest event
    await findLatestEvent();

    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    const typerSelector = document.querySelector('.typer');
    if (typerSelector) {
        // typing text animation script
        var typed = new Typed(".typing", {
            strings: [ "Front-End Developer", "UI/UX Designer", "Freelancer"],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });

        var typed = new Typed(".typing-2", {
            strings: [ "Front-End Developer", "UI/UX Designer", "Freelancer"],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });
    
});

function toggleSigninPopup() {
    document.getElementById("popup-1").classList.toggle("active");
}

function toggleSignupPopup() {
    document.getElementById("popup-2").classList.toggle("active");
}

// Make navbar sticky on scroll, change bgColor on the navbar
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", (e) => {
    if (window.scrollY > 300) {
        navbar.classList.add("navbar-dark");
    } else {
        navbar.classList.remove("navbar-dark");
    }
});

// Handle contact form submission
const contactMessageForm = document.querySelector("#contact-message-form");
contactMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.querySelector("#first-name").value;
    const lastName = document.querySelector("#last-name").value;
    const emailAddress = document.querySelector("#email-address").value;
    const message = document.querySelector("#contact-message").value;
    
    try {
        if (firstName && lastName && emailAddress && message) {
            const response = await postData(`${apiRootUrl}/contact-message`, 
                {
                    firstName,
                    lastName,
                    email: emailAddress,
                    message,
                },
                { "Content-Type": "application/json" }
            );
            if (response?.code === 201) {
                // Display toast modal
                mdtoast(response.message, { 
                    type: 'success',
                    position: 'top right',
                });
                contactMessageForm.reset();
            }
        } else {
            mdtoast("Please fill all the fields", {
                type: 'error',
                position: 'top right',
            });
            // throw new Error("Please fill all the fields");
        }
    }
    catch (ex) {
        throw ex;
    }
});

const pageSections = [
    { sectionName: 'home', navLinkId: 'home-nav' },
    { sectionName: 'team', navLinkId: 'team-nav' },
    { sectionName: 'courses', navLinkId: 'course-nav' },
    { sectionName: 'events', navLinkId: 'event-nav' },
    { sectionName: 'contact', navLinkId: 'contact-nav' },
    { sectionName: 'about-us', navLinkId: 'about-nav' },
];
// Use intersection observer to track page scroll and add "active" class to navbar item
pageSections.forEach((section) => { 
    const el = document.querySelector(`#${section.sectionName}`)
    const observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            document.querySelector(`#${section.navLinkId}`).classList.add('navbar-active');
            return;
        }
        document.querySelector(`#${section.navLinkId}`).classList.remove('navbar-active');
    }, {
        root: null,
        threshold: 0.1, // set offset 0.1 means trigger if at least 10% of element in viewport
    })
    observer.observe(el);
});


let slideIndex = 1;
let slides;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("slide-dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" slide-active", "");
    }
    slides[slideIndex-1].style.display = "block";
}

// Run slider by timer
setInterval(() => {
    if (slides.length > 0) { 
        if (slideIndex < slides.length - 1) {
            plusSlides(1);
        }
        else {
            plusSlides(-1);
        }   
    }
}, 10000);