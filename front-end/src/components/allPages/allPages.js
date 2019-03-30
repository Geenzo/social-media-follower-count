import React, { Component } from 'react';
import { Container, Button, Card, CardBody, NavLink } from 'mdbreact';
import './allPages.css';

import facebookImage from '../../images/facebook.png';
import twitterImage from '../../images/twitter.png';
import instagramImage from '../../images/instagram.png';

class AllPages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: []
        };
    }

    componentDidMount() {
        console.log('mounted');
        fetch('http://localhost:8081/allPages')
        .then(response => response.json())
        .then(parsedResponse => {
            if (!parsedResponse.success) {
                console.error(`Error: fetching pages - ${parsedResponse.error}`)
            }

            this.setState({
                pages: parsedResponse.payload  
            });
            console.log('this is parsed response', parsedResponse);
            console.log('this is state pages', this.state.pages);
        })

    }
    render() {

        const pageTypeImg = (currentPageType) => currentPageType === 'twitter' ? twitterImage : currentPageType === 'facebook' ? facebookImage : currentPageType === 'instagram' ? instagramImage : ''

        const allPages = this.state.pages.map((page, index) => 
            <Card key={index}>
                <CardBody>
                <div>
                    <img src={pageTypeImg(page.type)} height="30px" alt="page type logo"/>
                    <p>URL: {page.url}</p>
                    <p>Capture Date: {page.captureDate}</p>
                   
                    <NavLink to={{ pathname: '/selectedPage', state: { pageUrl: page.url, pageType: page.type }}}><Button>View Page Data</Button></NavLink>
                </div>
                </CardBody>
            </Card>
        );

        return (
            <div className="container-fluid">
                <h1>All Pages</h1>
                <Container className="pageGallery">
                    { allPages }
                </Container>
            </div>
        );
    }
}

export default AllPages;
