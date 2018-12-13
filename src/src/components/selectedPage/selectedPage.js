import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from 'mdbreact';

class selectedPage extends Component {
    constructor() {
        super();
        this.state = {
            pageUrl: '',
        };
    }

    componentWillMount() {
        this.setState({
            pageUrl: this.props.location.state.pageUrl
        })
    }
  render() {
    return (
        <Container>
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                        <h3>{this.state.pageUrl}</h3>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
  }
}

export default selectedPage;
