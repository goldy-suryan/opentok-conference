import React, { Component } from 'react';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
import { withRouter, Link } from "react-router-dom";
import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';

class Room extends Component {
  constructor(props) {
    super(props);
    this.url = 'http://localhost:4000/';
    this.otSession = React.createRef();
    this.state = {
      error: null,
      connection: 'Connecting',
      publishVideo: true,
      publishAudio: true,
      subscribeAudio: true,
      subscribeVideo: true,
      videoSource: true,
      credentials: this.props.location.state
    };

    this.sessionEventHandlers = {
      sessionConnected: () => {
        this.setState({ connection: 'Connected' });
      },
      sessionDisconnected: () => {
        this.setState({ connection: 'Disconnected' });
      },
      sessionReconnected: () => {
        this.setState({ connection: 'Reconnected' });
      },
      sessionReconnecting: () => {
        this.setState({ connection: 'Reconnecting' });
      },
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source');
      },
      streamCreated: () => {
        console.log('Publisher stream created');
      },
      streamDestroyed: ({ reason }) => {
        console.log(`Publisher stream destroyed because: ${reason}`);
      },
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('Subscriber video enabled');
      },
      videoDisabled: () => {
        console.log('Subscriber video disabled');
      },
    };
  }

  async componentDidMount() {
    this.credentials = await this.getSubscriber();
    this.setState({ credentials: this.credentials });
  }

  getSubscriber = async () => {
    let urlArr = window.location.href.split('room/');
    let encoded = urlArr[urlArr.length - 1];
    let credentials = await axios.get(`${this.url}room/${encoded}`)
    return credentials.data.credentials;
  }

  onSessionError = error => {
    this.setState({ error });
  };

  onPublish = () => {
    console.log('Publish Success');
  };

  onPublishError = error => {
    // this.setState();
    console.log(error)
  };

  onSubscribe = () => {
    console.log('Subscribe Success');
  };

  onSubscribeError = error => {
    this.setState({ error });
  };

  toggleVideo = () => {
    this.setState(state => ({
      publishVideo: !state.publishVideo,
    }));
  };

  toggleAudio = () => {
    this.setState(state => ({
      publishAudio: !state.publishAudio,
    }));
  };

  subscribeToAudio = () => {
    this.setState(state => ({
      subscribeAudio: !state.subscribeAudio
    }));
  }

  subscribeToVideo = () => {
    this.setState(state => ({
      subscribeVideo: !state.subscribeVideo
    }));
  }

  endCall = () => {
    this.otSession.current.sessionHelper.disconnect();
  }

  shareScreen = () => {
    this.setState(state => ({
      videoSource: state.videoSource === true ? 'screen' : true
    }));
  }

  render() {
    if (this.state.credentials) {
      const { apiKey, sessionId, token } = this.state.credentials;
      const { error, connection, publishVideo, publishAudio, subscribeAudio, subscribeVideo, videoSource } = this.state;
      return (
        <div>
          <div id="sessionStatus">Session Status: {connection}</div>
          {error ? (
            <div className="error">
              <strong>Error:</strong> {error.message}
            </div>
          ) : null}
          <OTSession
            ref={this.otSession}
            apiKey={apiKey}
            sessionId={sessionId}
            token={token}
            onError={this.onSessionError}
            eventHandlers={this.sessionEventHandlers}
          >
            <ButtonGroup className="mr-2" aria-label="Basic example">
              <Button variant="primary" onClick={this.toggleVideo}>{publishVideo ? 'Disable' : 'Enable'} Video</Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2" aria-label="Basic example">
              <Button variant="primary" onClick={this.toggleAudio}>{publishAudio ? 'Disable' : 'Enable'} Audio</Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2" aria-label="Basic example">
              <Button variant="primary" onClick={this.shareScreen}>{videoSource === true ? 'Share screen' : 'Stop sharing'}</Button>
            </ButtonGroup>
            <ButtonGroup className="mr-2" aria-label="Basic example">
              <Button variant="primary" onClick={this.endCall}>End Call</Button>
            </ButtonGroup>
            <div className="grid-container">
              <div className="main-page">
                <OTPublisher
                  properties={{ videoSource, publishVideo, publishAudio }}
                  onPublish={this.onPublish}
                  onError={this.onPublishError}
                  eventHandlers={this.publisherEventHandlers}
                />
              </div>
              <div className="new">
                <OTStreams>
                  <OTSubscriber
                    properties={{ subscribeAudio, subscribeVideo }}
                    onSubscribe={this.onSubscribe}
                    onError={this.onSubscribeError}
                    eventHandlers={this.subscriberEventHandlers}
                  />
                </OTStreams>
              </div>
            </div>
          </OTSession>
        </div>
      );
    } else {
      return (
        <div style={{ 'textAlign': 'center' }}>
          <h1>Not in the correct Room</h1>
          Go to<Link to="/">login</Link>
        </div>
      );
    }
  }
}

export default Room = withRouter(Room);