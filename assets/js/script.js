// Change url on production
// const apiRootUrl = 'http://localhost:8000';
const apiRootUrl = 'https://crypto-academia.herokuapp.com';

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

const findCourses = async () => {
    const response = await getData(`${apiRootUrl}/course/find-courses-for-sl`, { "Content-Type": "application/json" });
    if (response.code === 200) { 
        const courses = response.data;

        // Render content
        const courseContainer = document.querySelector("#courses-container");
        courseContainer.innerHTML = '';

        for (const course of courses) {
            const promoImage = course.promoImageUrl ? course.promoImageUrl : '/assets/images/LOGO1RTD.PNG';
            // Write path for 'Read more' button
            courseContainer.innerHTML += `<div class="card custom-card">
                <div class="box">
                    <div class="img">
                        <img src="${promoImage}" alt="${course.title}" />
                    </div>
                    <div class="text">
                        <h2 class="card-title">${course.title}</h2>
                        <p>${course.description}</p>
                    </div>
                    <div class="card-action text-center">
                        <a href="#" class="menu-btn1">Read More</a>
                    </div>
                </div>
            </div>`;
        }
    }
};

$(document).ready(async function() {
    initFooterContent();
    // Load data for courses
    await findCourses();

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
    document.getElementById("popup-1")
     .classList.toggle("active");
   }
   function toggleSignupPopup() {
    document.getElementById("popup-2")
     .classList.toggle("active");
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
});

const pageSections = [
    { sectionName: 'home-version2', navLinkId: 'home-nav' },
    { sectionName: 'team', navLinkId: 'team-nav' },
    { sectionName: 'courses', navLinkId: 'course-nav' },
    { sectionName: 'events', navLinkId: 'event-nav' },
    { sectionName: 'contact', navLinkId: 'contact-nav' }
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