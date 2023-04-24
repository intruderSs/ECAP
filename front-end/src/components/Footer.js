import React from "react";

function Footer () {

    const currentYear = new Date().getFullYear();

    return (
        
            <footer>
                <p>Made with <span role="img" aria-label="heart">❤️</span> by Shahil, Copyright © {currentYear}</p>
            </footer>
        

    )



}

export default Footer;