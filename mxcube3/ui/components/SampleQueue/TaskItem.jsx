import React, { Component, PropTypes } from 'react';
import { ProgressBar, Button, Collapse, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import { ContextMenuTrigger } from 'react-contextmenu';
import { TASK_UNCOLLECTED,
         TASK_COLLECTED,
         TASK_COLLECT_FAILED,
         TASK_RUNNING } from '../../constants';

export default class TaskItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.showForm = this.showForm.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this.taskHeaderOnClick = this.taskHeaderOnClick.bind(this);
    this.taskHeaderOnContextMenu = this.taskHeaderOnContextMenu.bind(this);
    this.getResult = this.getResult.bind(this);
    this.pointIDString = this.pointIDString.bind(this);
    this.state = {
      overInput: false,
      selected: false
    };
  }

  getResult(state) {
    if (state !== TASK_COLLECTED) {
      return (<span></span>);
    }
    const link = this.props.data.limsResultData ? this.props.data.limsResultData.limsTaskLink : '';

    return (
      <div style={ { borderLeft: '1px solid #DDD',
                     borderRight: '1px solid #DDD',
                     borderBottom: '1px solid #DDD',
                     padding: '0.5em' } }
      >
        <a href={link} target="_blank">View Results in ISPyB</a>
      </div>
    );
  }

  toggleChecked() {
    this.props.toggleChecked(this.props.sampleId, this.props.index);
  }

  taskHeaderOnClick(e) {
    this.props.taskHeaderOnClickHandler(e, this.props.index);
  }

  taskHeaderOnContextMenu(e) {
    this.props.taskHeaderOnContextMenuHandler(e, this.props.index);
  }

  deleteTask(e) {
    e.stopPropagation();
    this.props.deleteTask(this.props.sampleId, this.props.index);
  }


  deleteButton() {
    let content = (<Button bsSize="sm" onClick={this.deleteTask}>Delete</Button>);

    if (this.props.state !== TASK_UNCOLLECTED) {
      content = (<span> </span>);
    }

    return content;
  }

  showForm() {
    const { data, sampleId } = this.props;
    const { type, parameters } = data;
    if (parameters.helical) {
      this.props.showForm('Helical', sampleId, data, parameters.shape);
    } else {
      this.props.showForm(type, sampleId, data, parameters.shape);
    }
  }

  pointIDString(wedges) {
    let res = '';

    wedges.forEach((wedge) => {
      if ((wedge.parameters.shape !== -1) && res.indexOf(`${wedge.parameters.shape}`) < 0) {
        try {
          res += `${this.props.shapes.shapes[wedge.parameters.shape].name}`;
        } catch (e) {
          res += '-';
        }
      }
    });

    return `${res}: `;
  }

  wedgePath(wedge) {
    const parameters = wedge.parameters;
    const value = parameters.fileName;
    const path = parameters.path ? parameters.path : '';

    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        rootClose
        overlay={(<Popover id="wedge-popover" style={{ maxWidth: '600px', width: 'auto' }}>
                    <input
                      type="text"
                      onFocus={(e) => {e.target.select();}}
                      value={path}
                      size={path.length + 10}
                    />
                  </Popover>)}
      >
        <a>
          { value }
        </a>
      </OverlayTrigger>);
  }

  wedgeParameters(wedge) {
    const parameters = wedge.parameters;

    return (
      <tr>
        <td><a>{parameters.osc_start.toFixed(2)}</a></td>
        <td><a>{parameters.osc_range.toFixed(2)}</a></td>
        <td><a>{parameters.exp_time.toFixed(4)}</a></td>
        <td><a>{parameters.num_images}</a></td>
        <td><a>{parameters.transmission.toFixed(2)}</a></td>
        <td><a>{parameters.resolution.toFixed(3)}</a></td>
        <td><a>{parameters.energy.toFixed(4)}</a></td>
        <td><a>{parameters.kappa_phi.toFixed(2)}</a></td>
        <td><a>{parameters.kappa.toFixed(2)}</a></td>
      </tr>);
  }

  progressBar() {
    const state = this.props.state;
    let pbarBsStyle = 'info';

    if (state === TASK_RUNNING) {
      pbarBsStyle = 'info';
    } else if (state === TASK_COLLECTED) {
      pbarBsStyle = 'success';
    } else if (state === TASK_COLLECT_FAILED) {
      pbarBsStyle = 'danger';
    }

    return (
      <span style={{ width: '150px', right: '60px', position: 'absolute' }}>
        <ProgressBar
          bsStyle={pbarBsStyle}
          striped
          style={{ marginBottom: '0px', height: '18px' }}
          min={0}
          max={1}
          active={ this.props.progress < 1 }
          label={ `${(this.props.progress * 100).toPrecision(3)} %` }
          now={this.props.progress}
        />
      </span>);
  }

  render() {
    const { state,
            data,
            show } = this.props;
    let wedges = [];

    if (data.type === 'Interleaved') {
      wedges = data.parameters.wedges;
    } else {
      wedges = [data];
    }


    let delTaskCSS = {
      display: 'flex',
      marginLeft: 'auto',
      alignItems: 'center',
      paddingLeft: '10px',
      paddingRight: '10px',
      color: '#d9534f',
      cursor: 'pointer'
    };

    let taskCSS = this.props.selected ? 'task-head task-head-selected' : 'task-head';

    if (state === TASK_RUNNING) {
      taskCSS += ' running';
    } else if (state === TASK_COLLECTED) {
      taskCSS += ' success';
    } else if (state === TASK_COLLECT_FAILED) {
      taskCSS += ' error';
    }

    return (
      <div className="node node-sample">
      <ContextMenuTrigger id="currentSampleQueueContextMenu">
        <div
          className={taskCSS}
          style={{ display: 'flex' }}
          onClick={this.taskHeaderOnClick}
          onContextMenu={this.taskHeaderOnContextMenu}
        >
          <b>
            <span className="node-name" style={{ display: 'flex' }} >
              {this.pointIDString(wedges)} {data.label}
              { state === TASK_RUNNING ? this.progressBar() : null }
            </span>
          </b>
            { state === TASK_UNCOLLECTED ?
              <i className="fa fa-remove" onClick={this.deleteTask} style={delTaskCSS} /> : null
            }
        </div>
        <Collapse in={Boolean(show)}>
          <div className="task-body">
            { wedges.map((wedge, i) => {
              const padding = i > 0 ? '1em' : '0em';
              return (
              <div key={`wedge-${i}`}>
              <div style={ { borderLeft: '1px solid #DDD',
                             borderRight: '1px solid #DDD',
                             paddingTop: padding } }
              >
                <div style={ { borderTop: '1px solid #DDD',
                               padding: '0.5em' } }
                >
                  <b>Path:</b> { this.wedgePath(wedge) }
                </div>
              </div>
              <Table
                striped
                condensed
                bordered
                hover
                onClick={this.showForm}
                style={{ fontSize: 'smaller', marginBottom: '0px' }}
                className="task-parameters-table"
              >
                <thead>
                  <tr>
                    <th>Start &deg; </th>
                    <th>Osc. &deg; </th>
                    <th>t (s)</th>
                    <th># Img</th>
                    <th>T (%)</th>
                    <th>Res. (&Aring;)</th>
                    <th>E (KeV)</th>
                    <th>&phi; &deg;</th>
                    <th>&kappa; &deg;</th>
                  </tr>
                </thead>
                <tbody>
                  {this.wedgeParameters(wedge)}
                </tbody>
              </Table>
              {this.getResult(state)}
              </div>);
            })}

          </div>
        </Collapse>
      </ContextMenuTrigger>
      </div>);
  }
}
