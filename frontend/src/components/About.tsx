import React from 'react'

const About: React.FC = (props) => {

    return(
        <div>
            <h1>About this site</h1>
            <p>This single-page-app will show my CV information and also deliver a simple graphical UI for creating and modifying CV data.</p>
            <p>Almost everything in this site is crafted from scratch (all the way from user authentication to datePicker-components). 
                To make things more simple I have added ready made libraries to help organize things. 
                Biggest impact was done by Formik to make forms on the page to be a bit less painful.</p>
            <p>Please take a look of my source code in my <a href='https://github.com/rampemus/cvapp'>github</a></p>
            <h3>Version 0.2 - 2020/2/26</h3>
            <p>Fixed most of bugs away and bunch tests created for <a href='https://github.com/rampemus/cvapp/tree/master/backend'>backend</a>.</p>
            <h4>Known issues</h4>
            <ul>
                <li>Written values are only validated in backend, and no error handling</li>
                <li>Static server stuff and other resources should be hidden behind login</li>
            </ul>
            <h3>Version 0.1 - 2020/2/5</h3>
            <p>For now, some of the code is not yet nicely organized but things will get better.
                Other bigger changes will be that the tests will be implemented in the future for creating a automated pipeline.
                Many changes will be done for the deployment and for the backend. Therefore, I wish you visit my github for changes.</p>
        </div>
    )
}

export default About
