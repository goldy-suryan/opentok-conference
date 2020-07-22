import React, { Component } from 'react';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
import { withRouter, Link } from "react-router-dom";
import axios from 'axios';

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
            <button id="videoButton" onClick={this.toggleVideo}>
              {publishVideo ? 'Disable' : 'Enable'} Video
              </button>
            <button id="audioButton" onClick={this.toggleAudio}>
              {publishAudio ? 'Disable' : 'Enable'} Audio
              </button>
            <button onClick={this.shareScreen}>{videoSource === true ? 'Share screen' : 'Stop sharing'}</button>
            <OTPublisher
              properties={{ videoSource, publishVideo, publishAudio, width: 100, height: 100 }}
              onPublish={this.onPublish}
              onError={this.onPublishError}
              eventHandlers={this.publisherEventHandlers}
            />
            <button onClick={this.endCall}>End Call</button>
            <OTStreams>
              <OTSubscriber
                properties={{ subscribeAudio, subscribeVideo, width: 100, height: 100 }}
                onSubscribe={this.onSubscribe}
                onError={this.onSubscribeError}
                eventHandlers={this.subscriberEventHandlers}
              />
            </OTStreams>
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