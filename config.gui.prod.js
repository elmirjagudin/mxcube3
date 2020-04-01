module.exports = {
	phaseControl: true,
	focusControlOnCanvas: true,
	apertureControl: true,
	extendedCharacterisationParams: true,
	helpLinks:[
		{url: 'https://www.maxiv.lu.se/', name: 'MAX IV'},
		{url: 'https://www.maxiv.lu.se/accelerators-beamlines/beamlines/biomax/', name: 'BioMAX'},
		{url: 'https://wiki.maxiv.lu.se/index.php/Main_Page', name: 'MAX IV Wiki pages'}
	],
	beamlineCameras: [{
		url: "http://172.16.119.17/mjpg/video.mjpg?streamprofile=mxcube",
		width:"320px",
		height:"180px",
		location:"Experimental Hutch"
		},
		{
		url: "http://172.16.119.9/mjpg/video.mjpg?streamprofile=mxcube",
		width:"320px",
		height:"180px",
		location:"Diffractometer"
	}]
}
