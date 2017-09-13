import fetch from 'isomorphic-fetch';
import { showErrorPanel } from './general';

export function setMotorMoving(name, status) {
  return {
    type: 'SET_MOTOR_MOVING', name, status
  };
}

export function setBeamInfo(info) {
  return {
    type: 'SET_BEAM_INFO', info
  };
}

export function setCurrentPhase(phase) {
  return {
    type: 'SET_CURRENT_PHASE', phase
  };
}

export function setImageRatio(clientWidth) {
  return {
    type: 'SET_IMAGE_RATIO', clientWidth
  };
}

export function setOverlay(level) {
  return {
    type: 'SET_OVERLAY', level
  };
}

export function setAperture(size) {
  return {
    type: 'SET_APERTURE', size
  };
}

export function setStepSize(name, value) {
  return {
    type: 'SET_STEP_SIZE', name, value
  };
}

export function showContextMenu(show, shape = { type: 'NONE' }, x = 0, y = 0) {
  return {
    type: 'SHOW_CONTEXT_MENU', show, shape, x, y
  };
}

export function setPixelsPerMm(pixelsPerMm) {
  return {
    type: 'SET_PIXELS_PER_MM', pixelsPerMm
  };
}

export function measureDistance(mode) {
  return {
    type: 'MEASURE_DISTANCE', mode
  };
}

export function addDistancePoint(x, y) {
  return {
    type: 'ADD_DISTANCE_POINT', x, y
  };
}

export function startClickCentring() {
  return {
    type: 'START_CLICK_CENTRING'
  };
}

export function stopClickCentring() {
  return {
    type: 'STOP_CLICK_CENTRING'
  };
}

export function addCentringPoint(x, y) {
  return {
    type: 'ADD_CENTRING_POINT', x, y
  };
}


export function addShape(shape) {
  return {
    type: 'ADD_SHAPE', shape
  };
}

export function updateShape(shape) {
  return {
    type: 'UPDATE_SHAPE', shape
  };
}

export function deleteShape(id) {
  return {
    type: 'DELETE_SHAPE', id
  };
}

export function saveImageSize(width, height, pixelsPerMm) {
  return { type: 'SAVE_IMAGE_SIZE', width, height, pixelsPerMm };
}

export function toggleAutoScale(width = 1) {
  return { type: 'TOGGLE_AUTO_SCALE', width };
}

export function setVideoSize(width, height) {
  return function (dispatch, getState) {
    const { sampleview } = getState();

    if (sampleview.sourceIsScalable) {
      fetch('/mxcube/api/v0.1/sampleview/camera', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ width, height })
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error('Server refused to add line');
        }
        return response.json();
      }).then((json) => {
        dispatch({
          type: 'SAVE_IMAGE_SIZE',
          width: json.imageWidth,
          height: json.imageHeight,
          pixelsPerMm: json.pixelsPerMm,
          beamPosition: json.position
        });
      });
    }
  };
}

export function saveMotorPositions(data) {
  return {
    type: 'SAVE_MOTOR_POSITIONS', data
  };
}

export function saveMotorPosition(name, value) {
  return {
    type: 'SAVE_MOTOR_POSITION', name, value
  };
}

export function updateMotorState(name, value) {
  return {
    type: 'UPDATE_MOTOR_STATE', name, value
  };
}

export function updateShapes(shapes) {
  return {
    type: 'UPDATE_SHAPE_POSITION', shapes
  };
}

export function toggleCinema() {
  return {
    type: 'TOOGLE_CINEMA'
  };
}

export function setGridOverlay(level) {
  return { type: 'SET_GRID_OVERLAY', level };
}

export function toggleDrawGrid() {
  return { type: 'DRAW_GRID' };
}

export function addGridAction(gridData) {
  return { type: 'ADD_GRID', gridData };
}

export function selectGrid(id) {
  return { type: 'SELECT_GRID', id };
}

export function sendStartClickCentring() {
  return function (dispatch, getState) {
    const { queue } = getState();
    if (queue.current.sampleID) {
      fetch('/mxcube/api/v0.1/sampleview/centring/start3click', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
        }
      }).then((response) => {
        if (response.status >= 400) {
          throw new Error('Server refused to start 3click');
        } else {
          dispatch(startClickCentring());
        }
      });
    } else {
      dispatch(showErrorPanel(true, 'There is not a sample mounted! Cannot center.'));
    }};
}

export function sendCentringPoint(x, y) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/centring/click', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ clickPos: { x, y } })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to add point');
      }
    }).then(() => {
      dispatch(addCentringPoint(x, y));
    });
  };
}

export function sendAcceptCentring() {
  return function () {
    fetch('/mxcube/api/v0.1/sampleview/centring/accept', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Centring not accepted');
      }
    });
  };
}

export function sendGoToBeam(x, y) {
  return function () {
    fetch('/mxcube/api/v0.1/sampleview/movetobeam', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ clickPos: { x, y } })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused move to beam');
      }
    });
  };
}

export function sendStartAutoCentring() {
  return function () {
    fetch('/mxcube/api/v0.1/sampleview/centring/startauto', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to start autocentring');
      }

      return response.json();
    });
  };
}

export function sendAddShape(shapeData = {}, successCb = null) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/shapes', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ id: -1, shapeData })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to add shape');
      }
      return response.json();
    }).then((json) => {
      dispatch(addShape(json));
      if (successCb !== null) {
        successCb(json);
      }
    });
  };
}

export function sendUpdateShape(id, shapeData) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/shapes', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ id, shapeData })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to update shape');
      }
      return response.json();
    }).then((json) => {
      dispatch(updateShape(json));
    });
  };
}

export function sendDeleteShape(id) {
  return function (dispatch) {
    fetch(`/mxcube/api/v0.1/sampleview/shapes/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to delete line');
      }
    }).then(() => {
      dispatch(deleteShape(id));
    });
  };
}

export function sendZoomPos(level) {
  return function (dispatch) {
    dispatch(setMotorMoving('zoom', 4));
    fetch('/mxcube/api/v0.1/sampleview/zoom', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ level })
    }).then((response) => {
      if (response.status === 406) {
        dispatch(showErrorPanel(true, response.headers.get('msg')));
        throw new Error('Server refused to zoom');
      }
      if (response.status >= 400) {
        throw new Error('Server refused to zoom');
      }
    });
  };
}

export function sendLightOn(name) {
  return function (dispatch) {
    dispatch(saveMotorPosition(name, true));
    fetch(`/mxcube/api/v0.1/sampleview/${name.toLowerCase()}on`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to turn light on'));
      }
    });
  };
}

export function sendLightOff(name) {
  return function (dispatch) {
    dispatch(saveMotorPosition(name, false));
    fetch(`/mxcube/api/v0.1/sampleview/${name.toLowerCase()}off`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to turn light off'));
      }
    });
  };
}

export function sendStopMotor(motorName) {
  return function () {
    fetch(`/mxcube/api/v0.1/sampleview/${motorName}/stop`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to stop motor');
      }
    });
  };
}

export function sendMotorPosition(motorName, value) {
  return function (dispatch) {
    dispatch(setMotorMoving(motorName, 4));
    fetch(`/mxcube/api/v0.1/sampleview/${motorName}/${value}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status === 406) {
        dispatch(showErrorPanel(true, response.headers.get('msg')));
        dispatch(setMotorMoving(motorName, 2));
        throw new Error('Server refused to move motors: out of limits');
      }
      if (response.status >= 400) {
        throw new Error('Server refused to move motors');
      }
    });
  };
}

export function sendAbortCentring() {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/centring/abort', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to abort centring'));
      } else {
        dispatch(stopClickCentring());
      }
    });
  };
}

export function sendGoToPoint(id) {
  return function (dispatch) {
    fetch(`/mxcube/api/v0.1/sampleview/centring/${id}/moveto`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to move to point'));
      }
    });
  };
}

export function sendChangeAperture(pos) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/diffractometer/aperture', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ diameter: pos })
    }).then((response) => {
      if (response.status >= 400) {
        dispatch(showErrorPanel(true, 'Server refused to change Aperture'));
        dispatch(setAperture(pos));
      } else {
        dispatch(setAperture(pos));
      }
    });
  };
}

export function getSampleImageSize() {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/sampleview/camera', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to return image size');
      }
      return response.json();
    }).then((json) => {
      dispatch(saveImageSize(json.imageWidth, json.imageHeight, json.pixelsPerMm[0]));
    });
  };
}

export function getMotorPosition(motor) {
  return function (dispatch) {
    fetch(`/mxcube/api/v0.1/sampleview/${motor}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to get motor position');
      }
      return response.json();
    }).then((json) => {
      dispatch(saveMotorPosition(motor, json[motor].position));
    });
  };
}

export function getMotorPositions() {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/diffractometer/movables/state', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to get motor position');
      }
      return response.json();
    }).then((json) => {
      dispatch(saveMotorPositions(json));
    });
  };
}

export function getPointsPosition() {
  return function (dispatch) {
    fetch('mxcube/api/v0.1/sampleview/centring', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to return points position');
      }
      return response.json();
    }).then((json) => {
      dispatch(updateShapes(json));
    });
  };
}

export function sendCurrentPhase(phase) {
  return function (dispatch) {
    fetch('/mxcube/api/v0.1/diffractometer/phase', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ phase })
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Server refused to set phase');
      } else {
        dispatch(setCurrentPhase(phase));
      }
    });
  };
}
