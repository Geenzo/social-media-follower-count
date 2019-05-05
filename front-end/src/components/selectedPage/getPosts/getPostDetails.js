import React, { Component } from 'react';
import { Container, Row, Col, Card, Table, TableHead, TableBody, MDBInput, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';

class GetPostDetails extends Component {
    constructor() {
        super();
        this.state = {
            pageName: '',
            pageType: '',
            numberOfPosts: 10,
            postData: [],
            postDataError: false,
            retrievedPosts: false,
            loadingPosts: false,
            postUrl: ''
        };
    }

    componentWillMount() {
        this.setState({
            pageName: this.props.pageName,
            pageType: this.props.pageType,
            postUrl: this.setPageType(this.props.pageName, this.props.pageType),
        })
    }

    numberOfPostsChange(event) {
        this.setState({numberOfPosts: event.target.value});
    }

    setPageType(pageName, pageType) {
        switch(pageType) {
            case 'facebook':
                return `https://www.facebook.com/pg/${pageName}/posts/`;
            case 'twitter':
                return `https://twitter.com/${pageName}`;
            case 'instagram':
                return `https://www.instagram.com/${pageName}`;
            default:
                return 'Error';
        }
    }

    retrievePost() {
        this.setState({ loadingPosts: true });
        
        const pageTypeParsed = this.state.pageType.charAt(0).toUpperCase() + this.state.pageType.slice(1)
        return fetch(`http://localhost:8081/get${pageTypeParsed}Posts`, {
            method: 'POST',
            body: JSON.stringify({ "url": this.state.postUrl, "numberOfPosts": this.state.numberOfPosts}),
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
                postData: parsedResponse.payload,
                retrievedPosts: true,
                loadingPosts: false,
            })
        })
    }

    render() {
        const currentPageType = this.state.pageType

        const twitterPageHeader = () => <tr>
                <th>#</th>
                <th>Copy</th>
                <th>Replies</th>
                <th>Retweets</th>
                <th>Favourites</th>
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
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{post.postCopy}</td>
                <td>{post.postReplies}</td>
                <td>{post.postRetweets}</td>
                <td>{post.postFavourites}</td>
                <td>{post.postDate}</td>
            </tr>) : !this.state.postDataError && currentPageType === 'facebook' ? this.state.postData.map((post, index) => 
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{post.postCopy}</td>
                <td>{post.postLikes}</td>
                <td>{post.postComments}</td>
                <td>{post.postShares}</td>
                <td>{post.postDate}</td>
            </tr>) : !this.state.postDataError && currentPageType === 'instagram' ? this.state.postData.map((post, index) => 
            <tr key={index}>
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
                    <Col md="4">
                    </Col>
                    {this.state.loadingPosts ? 
                    <div className="spinner-border spinner-border-lg text-info" role="status">
                        <span className="sr-only">Loading...</span>
                    </div> : 
                        <MDBCard md="4" style={{ width: "22rem" }}>
                            <MDBCardBody>
                            <MDBCardTitle>Posts to gather</MDBCardTitle>
                            <MDBCardText>
                                
                            </MDBCardText>
                                <MDBInput type="number" label="Number of Posts" onChange={(e) => this.numberOfPostsChange(e)} />
                                <MDBBtn onClick={() => this.retrievePost()}>Submit</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    }
                    <Col md="4">
                    </Col>
                </Row>
                {this.state.retrievedPosts && <div>
                    <Row>
                        <Col md="12">
                            <h1>Posts for {this.state.pageName}</h1>
                            <h3>Number of posts:{this.state.postData.length}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            {this.state.pageDataError ? errorCard : contentTable}
                        </Col>
                    </Row>
                </div>}
            </Container>
        );
    }
}

export default GetPostDetails;
