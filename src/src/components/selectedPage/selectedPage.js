import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from 'mdbreact';
import facebookImage from '../../images/facebook.png';
import instagramImage from '../../images/instagram.png';
import twitterImage from '../../images/twitter.png';
class selectedPage extends Component {
    constructor() {
        super();
        this.state = {
            pageUrl: '',
            pageType: '',
            pageData: [],
            pageDataError: false,
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
            if (!parsedResponse.success) {
                console.error(`Error: fetching page data - ${parsedResponse.error}`)
                this.setState({
                    pageDataError: true
                })
            }

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

    const pageTypeImg = (currentPageType) => currentPageType === 'twitter' ? twitterImage : currentPageType === 'facebook' ? facebookImage : currentPageType === 'instagram' ? instagramImage : ''

    const allPageData = !this.state.pageDataError ? this.state.pageData.map(page => 
    <Card>
        <CardBody>
           {pageContents(page)}
        </CardBody>
    </Card>) : ''

    const errorCard = <Card>
        <h1 color="red">Error: No Page data was found for this page</h1>
    </Card>

    return (
        <Container>
            <Row>
                <Col md="12">     
                    <h1>{this.state.pageUrl}</h1>
                    <h1>{this.state.pageType}</h1>
                    <img src={pageTypeImg(currentPageType)} height="50px" alt="page type logo"></img>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    {this.state.pageDataError ? errorCard : allPageData }
                </Col>
            </Row>
        </Container>
    );
  }
}

export default selectedPage;
