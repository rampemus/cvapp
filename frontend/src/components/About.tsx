import React from 'react'

const About: React.FC = (props) => {


    return(
        <div>
            <h1>About this site</h1>
            <p>This single page app will show my CV information and also deliver a simple graphical UI for creating and modifying CV data.</p>
            <p>Almost everything in this site is crafted from scratch (all the way from user authentication to datePicker-components). 
                To make things more simple I have added ready made libraries to help organize things. 
                Biggest impact was done Formik to make forms on the page to be a bit more less painful.</p>
            <h3>Version 0.1</h3>
            <p>Please take a look at my source code in my <a href='https://github.com/rampemus/cvapp'>github</a>. 
                For now some of the code is not yet nicely organized but things will get better.
                Other bigger changes will be that the tests will be implemented in the future for creating a usable pipeline.
                Many changes will be done for the deployment and for the backend so I wish you visit my github for following the version control.</p>
            <h3>Known issues</h3>
            <ul>
                <li>Refreshing CVForm page will not read language-level pairs properly</li>
                <li>Attachment title doesn't overflow additional text correctly in small screen sizes</li>
                <li>Printing the site includes background pictures with wrong background color</li>
                <li>Written values are only validated in backend, and no error handling</li>
                <li>Many buttons still have no style or function (like that language and logout button in the upper right corner)</li>
            </ul>
        </div>
    )
}

export default About
