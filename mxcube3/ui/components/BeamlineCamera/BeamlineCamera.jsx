import React from 'react';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';

import { Popover,
         ButtonToolbar,
         OverlayTrigger,
         Button,
         DropdownButton,
         MenuItem } from 'react-bootstrap';
import config from 'guiConfig';

import './BeamlineCamera.css';

class BeamlineCamera extends React.Component {

  constructor(props) {
    super(props);
    this.selectCamera = this.selectCamera.bind(this);
    this.state = { selectedIndex: 0 };
  }

  selectCamera(evt) {
    this.setState({ selectedIndex: evt.target.id });
  }

  render() {
    const cameraList = this.props.cameras.map((cam, index) =>
      <MenuItem id={index} onClick={this.selectCamera}>{cam.location}</MenuItem>
    );
    const divStyle = {
      marginTop: '5px',
    };

    const popoverLeft = (
      <Popover
        className="camera-popover"
      >
        <DropdownButton
          bsSize="small"
          bsStyle="default"
          title={config.beamlineCameras[this.state.selectedIndex].location}
        >
         {cameraList}
        </DropdownButton>
        <div style={divStyle}>
        <Iframe url={config.beamlineCameras[this.state.selectedIndex].url}
          width={config.beamlineCameras[this.state.selectedIndex].width}
          height={config.beamlineCameras[this.state.selectedIndex].height}
          display="initial"
          position="relative"
        />
        </div>
      </Popover>
    );
    let camstyle;
    if (this.props.observers) {
      camstyle = '0 100px 20px 0';
    } else {
      camstyle = '0 20px 20px 0';
    }

    return (
      <ButtonToolbar className="camera-container" style={{ margin: camstyle }}>
        <OverlayTrigger ref="overlay" trigger="click" placement="top" overlay={popoverLeft}>
          <Button
            className="button-circle text-center"
            bsStyle="success"
          >
          <i className="button-icon fa fa-2x fa-eye" />
          </Button>
        </OverlayTrigger>
      </ButtonToolbar>
    );
  }
}

BeamlineCamera.defaultProps = {
  cameras: {},
  observers: false
};

function mapStateToProps(state) {
  return {
    scState: state.sampleChanger.state,
  };
}

export default connect(
    mapStateToProps,
    null
)(BeamlineCamera);
