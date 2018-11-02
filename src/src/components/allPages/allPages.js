import React, { Component } from 'react';

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
         <div>
             <p>Type: {page.type}</p>
             <p>Url: {page.url}</p>
             <p>Capture Date: {page.captureDate}</p>
             <button>View Data</button>
         </div>
        );

        return (
            <div className="container-fluid">
                <h1>All Pages</h1>

                <div>
                    { allPages }
                </div>
            </div>
        );
    }
}

export default AllPages;
