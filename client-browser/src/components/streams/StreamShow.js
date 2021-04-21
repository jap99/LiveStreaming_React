import React from 'react';
import flv from 'flv.js';
import { connect } from 'react-redux';
import { fetchStream } from '../../actions';

// don't attempt to build the video player until get the stream 

class StreamShow extends React.Component {
  
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchStream(id);
    this.buildPlayer();
  };

  componentDidUpdate() {
    this.buildPlayer();
  };

  componentWillUnmount() {
    this.player.destroy();
  };

  buildPlayer() {
    if (this.player || !this.props.stream) {  // if we already created a player  ||  don't have a stream yet
      return;
    };
    const { id } = this.props.match.params;
    this.player = flv.createPlayer({
      type: 'flv',
      url: `http://localhost:8000/live/${id}.flv`       // ----------- TODO ----------- don't show this URL here on the client side if possible
    });
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
    // flvPlayer.play( ) gets the video playing automatically, .load() only plays it after it's pressed
  };

  render() {
    if (!this.props.stream) {   
      // if we don't have access to our stream we're not creating the video element or passing the ref to it
      return <div>Loading...</div>;
    };
    const { title, description } = this.props.stream;
    return (
      <div>
        <video ref={ this.videoRef } style={{ width: '100%' }} controls />
        <h1>{ title }</h1>
        <h5>{ description }</h5>
      </div> 
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return { stream: state.streams[ownProps.match.params.id] };
};

export default connect(mapStateToProps, { fetchStream })(StreamShow);
