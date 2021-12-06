$(document).ready(function(){
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

// Change on production
const apiRootUrl = 'http://localhost:8000';

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