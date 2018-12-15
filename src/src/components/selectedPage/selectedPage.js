import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from 'mdbreact';

class selectedPage extends Component {
    constructor() {
        super();
        this.state = {
            pageUrl: '',
            pageType: '',
            pageData: []
        };
    }

    componentWillMount() {
        this.setState({
            pageUrl: this.props.location.state.pageUrl,
            pageType: this.props.location.state.pageType
        })

        const currentPageUrl = this.props.location.state.pageUrl
        const pageType = this.props.location.state.pageType.charAt(0).toUpperCase() + this.props.location.state.pageType.slice(1)
        return fetch(`http://localhost:8081/select${pageType}ByURL`, {
            method: 'POST',
            body: JSON.stringify({ "url": currentPageUrl}),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(parsedResponse => {
            console.log('this is hte response', parsedResponse)

            this.setState({
                pageData: parsedResponse.payload
            })
        })
    }
  render() {
    const currentPageType = this.state.pageType

    const twitterPage = (page) => <div>
           <h2>Followers: {page.Followers}</h2>
            <h2>Following: {page.Following}</h2>
            <h2>Likes: {page.Likes}</h2>
            <h2>Tweets: {page.Tweets}</h2>
            <h2>Capture Date: {page.captureDate}</h2>
      </div>

    const facebookPage = (page) => <div>
           <h2>Followers: {page.follow}</h2>
            <h2>Likes: {page.like}</h2>
            <h2>Capture Date: {page.captureDate}</h2>
      </div>

    const instagramPage = (page) => <div>
           <h2>Followers: {page.followers}</h2>
            <h2>Following: {page.following}</h2>
            <h2>Posts: {page.posts}</h2>
            <h2>Capture Date: {page.captureDate}</h2>
      </div>

    const pageContents = (pageDetails) => currentPageType === 'twitter' ? twitterPage(pageDetails) : currentPageType === 'facebook' ? facebookPage(pageDetails) : currentPageType === 'instagram' ? instagramPage(pageDetails) : ''

    const allPageData = this.state.pageData.map(page => 
    <Card>
        <CardBody>
           {pageContents(page)}
        </CardBody>
    </Card>)

    return (
        <Container>
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                        <h3>{this.state.pageUrl}</h3>
                        <h3>{this.state.pageType}</h3>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    {allPageData}
                </Col>
            </Row>
        </Container>
    );
  }
}

export default selectedPage;
