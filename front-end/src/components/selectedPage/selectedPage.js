import React, { Component } from 'react';
import { Container, Row, Col, Card, Table, TableHead, TableBody } from 'mdbreact';
import facebookImage from '../../images/facebook.png';
import instagramImage from '../../images/instagram.png';
import twitterImage from '../../images/twitter.png';
import GetPostDetails from './getPosts/getPostDetails';

class selectedPage extends Component {
    constructor() {
        super();
        this.state = {
            pageName: '',
            pageUrl: '',
            pageType: '',
            pageData: [],
            pageDataError: false,
        };
    }

    
    parseURL = (url) => {
        // turns url into array and gets the pages name from the url which is the [3]rd index
        const pageName = url.split('/')[3];
        return pageName;
    }

    componentWillMount = () => {
        this.setState({
            pageUrl: this.props.location.state.pageUrl,
            pageType: this.props.location.state.pageType,
            pageName: this.parseURL(this.props.location.state.pageUrl)
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

    const twitterPageHeader = () => <tr>
            <th>#</th>
            <th>Followers</th>
            <th>Following</th>
            <th>Likes</th>
            <th>Tweets</th>
            <th>Capture Date</th>
        </tr>

    const facebookPageHeader = () => <tr>
            <th>#</th>
            <th>Followers</th>
            <th>Likes</th>
            <th>Capture Date</th>
        </tr>

    const instagramPageHeader = () => <tr>
            <th>#</th>
            <th>Followers</th>
            <th>Following</th>
            <th>Posts</th>
            <th>Capture Date</th>
        </tr>

    const pageContentsHeader = () => currentPageType === 'twitter' ? twitterPageHeader() : currentPageType === 'facebook' ? facebookPageHeader() : currentPageType === 'instagram' ? instagramPageHeader() : ''

    const pageTypeImg = (currentPageType) => currentPageType === 'twitter' ? twitterImage : currentPageType === 'facebook' ? facebookImage : currentPageType === 'instagram' ? instagramImage : ''

    const allPageData = !this.state.pageDataError && currentPageType === 'twitter' ? this.state.pageData.map((page, index) => 
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{page.Followers}</td>
            <td>{page.Following}</td>
            <td>{page.Likes}</td>
            <td>{page.Tweets}</td>
            <td>{page.captureDate}</td>
        </tr>) : !this.state.pageDataError && currentPageType === 'facebook' ? this.state.pageData.map((page, index) => 
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{page.follow}</td>
            <td>{page.like}</td>
            <td>{page.captureDate}</td>
        </tr>) : !this.state.pageDataError && currentPageType === 'instagram' ? this.state.pageData.map((page, index) => 
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{page.followers}</td>
            <td>{page.following}</td>
            <td>{page.posts}</td>
            <td>{page.captureDate}</td>
        </tr>) : ''

    const errorCard = <Card>
        <h1 color="red">Error: No Page data was found for this page</h1>
    </Card>

    const contentTable = <Table striped>
        <TableHead color="primary-color" textWhite>
            {pageContentsHeader()}
        </TableHead>
        <TableBody>
            { allPageData }
        </TableBody>
    </Table>

    return (
        <Container>
            <Row>
                <Col md="3">
                    <img src={pageTypeImg(currentPageType)} height="50px" alt="page type logo"></img>
                </Col>
                <Col md="9">
                    <h1>{this.state.pageName}</h1>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    {this.state.pageDataError ? errorCard : contentTable}
                </Col>
            </Row>

            <Row>
                <GetPostDetails pageName={this.state.pageName} pageType={this.state.pageType}/>
            </Row>
        </Container>
    );
  }
}

export default selectedPage;
