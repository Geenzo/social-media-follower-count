import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Card, CardBody } from 'mdbreact';

class NewPage extends Component {
    constructor() {
        super();
        this.state = {
            urlInput: '',
            urlValidation: null,
            saveSuccessfull: null
        };
    }
    
    update = (e) => {
        const urlRegex = /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/ig

        let urlRegexTest = urlRegex.test(e.target.value);

        if (!urlRegexTest) {
            return this.setState({ urlValidation: 'please provide a valid url for a facebook, twitter or instagram page' })
        }

        return this.setState({ 
            urlValidation: null, 
            urlInput: e.target.value
        })
    }

    newPage = (event) => {
        event.preventDefault();

        return fetch('http://localhost:8081/addNewPage', {
            method: 'POST',
            body: JSON.stringify({ url: this.state.urlInput }),
            headers:{
                'Content-Type': 'application/json'
              }
        })
        .then(response => response.json())
        .then(parsedResponse => {
            if (!parsedResponse.success) {
                return this.setState({ 
                    urlValidation: `${parsedResponse.error}`
                })
            }

            return this.setState({
                saveSuccessfull: 'Page Successfully Saved!'
            })
        })
    }
  render() {
    let validatedURLMessage = this.state.urlValidation;
    let saveSuccessfull = this.state.saveSuccessfull;
    let validation;

    if(validatedURLMessage !== null) {
        validation = <div style={{color: 'red'}}>{validatedURLMessage}</div>
    } else if (saveSuccessfull !== null) {
        validation = <div style={{color: 'green'}}>{saveSuccessfull}</div>    
    } else {
        validation = <div></div>;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                        <form className='needs-validation' onSubmit={this.newPage} noValidate>
                            <p className="h4 text-center py-4">Add New Page</p>
                            <div className="grey-text">
                                <Input label="URL" type="text" onChange={event => this.update(event)}/>
                                {validation}
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
