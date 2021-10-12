# customer-ui

## Packages Used

## msw (mock service worker)

    Used for mocking http responses in tests
    npm install msw --save-dev

## redux

    State management
    npm install redux react-redux

## bootstrap

    Used to style components.
    npm install react-bootstrap bootstrap@4.6.0

## font awesome

    Used for UI icons.
    npm i --save @fortawesome/fontawesome-svg-core

npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome

## react-datepicker

    Used to select dates.
    npm install react-datepicker

## stripe

    npm install @stripe/stripe-js @stripe/react-stripe-js

## prettier

    Used to maintain a consistent code style.

## uuid

    Used to create random strings.

## jwt-decode

    npm install jwt-decode

## ant design

    Used for layout components.
    npm install antd

---

## Writing fetch requests to the APIs with CSRF

In order to make requests to the microservices, requests that modify data (PUT, POST, DELETE) will need an additional header: "X-XSRF-TOKEN". You can get a token by calling getCsrfToken() from utils/Login.js.
Many requests will also need the current signed-in user's JWT token, which can be gotten by calling getToken() from utils/Login.js 

---

## Features Added

5/19/2021 (Anthony Sirimarco): Added registration page which makes back end call and creates create a user in the database.
https://the-baristas.atlassian.net/browse/BAR-100

5/25/2021 (Anthony Sirimarco): Added login page and buttons and a basic header which contains a login/logout button.
https://the-baristas.atlassian.net/browse/BAR-106

5/28/2021 (Gabrielle Alexa Noel): Added home page and made edits to header/layout. Set up flight search form inputs (non-functional).
https://the-baristas.atlassian.net/browse/BAR-10
