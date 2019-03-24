import React, { Component } from 'react';
import { Container, Row, Col, Card, Table, TableHead, TableBody } from 'mdbreact';

class GetPostDetails extends Component {
    constructor() {
        super();
        this.state = {
            pageUrl: '',
            pageType: '',
            numberOfPosts: 10,
            postData: [],
            postDataError: false,
        };
    }

    componentWillMount() {
        this.setState({
            pageUrl: this.props.pageUrl,
            pageType: this.props.pageType
        })

        const pageType = this.props.pageType.charAt(0).toUpperCase() + this.props.pageType.slice(1)
        return fetch(`http://localhost:8081/get${pageType}Posts`, {
            method: 'POST',
            body: JSON.stringify({ "url": 'https://www.facebook.com/pg/200StVincentStreet/posts/', "numberOfPosts": this.state.numberOfPosts}),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(parsedResponse => {
            if (!parsedResponse.success) {
                console.error(`Error: fetching page data - ${parsedResponse.error}`)
                this.setState({
                    postDataError: true
                })
            }

            this.setState({
                postData: parsedResponse.payload
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
                <th>Post Copy</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Shares</th>
                <th>Date</th>
            </tr>

        const instagramPageHeader = () => <tr>
                <th>#</th>
                <th>Followers</th>
                <th>Following</th>
                <th>Posts</th>
                <th>Capture Date</th>
            </tr>

        const pageContentsHeader = () => currentPageType === 'twitter' ? twitterPageHeader() : currentPageType === 'facebook' ? facebookPageHeader() : currentPageType === 'instagram' ? instagramPageHeader() : ''

        const allPostData = !this.state.postDataError && currentPageType === 'twitter' ? this.state.postData.map((post, index) => 
            <tr>
                <td>{index + 1}</td>
                <td>{post.Followers}</td>
                <td>{post.Following}</td>
                <td>{post.Likes}</td>
                <td>{post.Tweets}</td>
                <td>{post.captureDate}</td>
            </tr>) : !this.state.postDataError && currentPageType === 'facebook' ? this.state.postData.map((post, index) => 
            <tr>
                <td>{index + 1}</td>
                <td>{post.postCopy}</td>
                <td>{post.postLikes}</td>
                <td>{post.postComments}</td>
                <td>{post.postShares}</td>
                <td>{post.postDate}</td>
            </tr>) : !this.state.postDataError && currentPageType === 'instagram' ? this.state.postData.map((post, index) => 
            <tr>
                <td>{index + 1}</td>
                <td>{post.followers}</td>
                <td>{post.following}</td>
                <td>{post.posts}</td>
                <td>{post.captureDate}</td>
            </tr>) : ''

        const errorCard = <Card>
            <h1 color="red">Error: No post data was found for this page</h1>
        </Card>

        const contentTable = <Table striped>
            <TableHead color="primary-color" textWhite>
                {pageContentsHeader()}
            </TableHead>
            <TableBody>
                { allPostData }
            </TableBody>
        </Table>

        return (
            <Container>
                <Row>
                    <Col md="12">
                        <h1>Posts for {this.state.pageUrl}</h1>
                        <h3>Number of posts:{this.state.postData.length}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        {this.state.pageDataError ? errorCard : contentTable}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default GetPostDetails;
