import React, { Component } from 'react';
import { Container, Button, Card, CardBody } from 'mdbreact';
import './allPages.css';

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
        const allPages = this.state.pages.map((page) => 
            <Card>
                <CardBody>
                <div>
                    <p>Type: {page.type}</p>
                    <p>URL: {page.url}</p>
                    <p>Capture Date: {page.captureDate}</p>
                    <Button>View Data</Button>
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
