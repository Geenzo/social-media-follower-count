import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Card, CardBody } from 'mdbreact';

class NewPage extends Component {
  render() {
    return (
        <Container>
            <Row>
                <Col md="6">
                    <Card>
                        <CardBody>
                        <form>
                            <p className="h4 text-center py-4">Add New Page</p>
                            <div className="grey-text">
                            <Input label="URL" icon="user" group type="text" validate error="wrong" success="right"/>
                            </div>
                            <div className="text-center py-4 mt-3">
                            <Button color="blue" type="submit">Register</Button>
                            </div>
                        </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
  }
}

export default NewPage;
