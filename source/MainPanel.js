enyo.kind({
	name: "com.icottrell.looking_down.MainPanel", 
	kind: "Panels",
	arrangerKind: "CardArranger", 
	wrap: false, 
	realtimeFit: true, 
	style: "width:100%; height: 100%;",
	published: {
		geo : { latitude : 43.677209539923, 
				longitude : -79.60722374189},
		cameraData: "",
		showingAds: true, 
	},
	events: {
		onRoadwayTap: "",
		onRoadImgTap: "",
		onUpdateLocation: "",
		onLoaded: "",
		onUpdated: "",
	},
	components: [
		{name: "nearme", classes:"panel-shadow", style:"width100%;", components: [
			{kind: "FittableRows", classes:"enyo-fit", components: [
				{kind: "onyx.Toolbar", defaultKind: "onyx.IconButton", style:"background-color:black;", components: [
					{kind:"Image", classes: "bar_icon", src:"assets/images/64/nearme.png"},
					{content:"NearMe", classes:"titleheader"},					
					{kind:"Image", src:"assets/images/64/roadways.png",  classes: "bar_icon bar_icon_right", ontap:"openRoadwayPanel"},
					{kind:"Image", src:"assets/images/64/map.png", classes: "bar_icon bar_icon_right", ontap:"openMapPanel"}, 
				]},
				{kind: "Scroller", touch:true, fit: true, classes: "main", ondragfinish:"preventTap", components:[
					{name: "roadimgs", classes:"roadimgs"},
				]},
			]},
		]},
		{name: "maparea", classes:"panel-shadow", style:"width:100%;", components: [
			{kind: "FittableRows", classes:"enyo-fit", components: [
				{kind: "onyx.Toolbar", defaultKind: "onyx.IconButton", style:"background-color:black;", components: [
					{kind:"Image", classes:"bar_icon", src:"assets/images/64/map.png"},
					{content:"Map", classes:"titleheader"},
					{kind:"Image", src:"assets/images/64/roadways.png", classes: "bar_icon bar_icon_right", ontap:"openRoadwayPanel"},
					{kind:"Image", src:"assets/images/64/nearme.png", classes: "bar_icon bar_icon_right", ontap:"openNearMePanel"},
					{kind:"Image", src: "assets/images/64/mylocationicon.png", classes: "bar_icon bar_icon_right", ontap: "doUpdateLocation"},
				]},
				{name: "map", kind: "BingMap", showTraffic: true, fit: true, onLoaded:"geoChanged", onCameraPinClick:"pushpinClick",
					options: {showDashboard: false, showScalebar: false}, credentials: ""},
			]},
			
		]},
		{name: "highways", classes: "panel-shadow", style:"width:100%;background-color:white;", components: [
			{kind: "FittableRows", name:"hcont", classes: "enyo-fit", components: [
				{kind: "onyx.Toolbar", defaultKind: "onyx.IconButton", style:"background-color:black;", components: [
					{kind:"Image", classes: "bar_icon", src:"assets/images/64/roadways.png"},
					{content:"Roadways",  classes:"titleheader"},
					{kind:"Image", src:"assets/images/64/nearme.png", classes: "bar_icon bar_icon_right", ontap:"openNearMePanel"},
					{kind:"Image", src:"assets/images/64/map.png", classes: "bar_icon bar_icon_right", ontap:"openMapPanel"}, 
				]},
				{kind: "Scroller", touch:true, fit: true, components:[
					{kind: "Repeater", count: 0,  onSetupItem: "setupItem", components: [
						{name:"item", style:"padding:10px;", ontap:"doRoadwayTap", components :[
							{name:"box", classes: "boxitems"},
							{name: "highway", classes: "highwayitems"}
						]}
					]}
				]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.doLoaded();
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index,
			that = this,
			item = inEvent.item,
			helper = function(ii) { return that.cameraData.highways[ii]},
			roadway = helper(i);
		
		item.$.highway.setContent(roadway);
		return true;
	},
	openMapPanel: function() {
		this.setIndex(1);
	},
	openRoadwayPanel: function() {
		this.setIndex(2);
	},
	openNearMePanel: function () {
		this.setIndex(0);
	},
	roadsChanged: function() {
		this.geoChanged();
	},
	setCameraData: function(inData) {
		this.cameraData = inData;
		if(this.cameraData) {
			this.updateNearMe();
			this.addAllCamerasToRoadsMap();
			this.$.repeater.setCount(this.cameraData.highways.length);
		}
	},
	setGeo: function (inGeo) {
		this.geo = inGeo;
		if(this.$.map.hasMap()) {
			this.$.map.clearAll();
			this.$.map.setShowTraffic(true);
			this.$.map.showTrafficChanged();
			this.$.map.setCenter(this.geo.latitude, this.geo.longitude);
			this.$.map.setZoom(13);
			this.$.map.showCurrentPosition(this.geo);
		}

		if(this.cameraData) {
			this.updateNearMe();
			this.addAllCamerasToRoadsMap();
			this.$.repeater.setCount(this.cameraData.highways.length);
		} 

	},
	addAllCamerasToRoadsMap: function() {
		if(this.cameraData && this.$.map.hasMap) {
			this.$.map.updateMapCameras(this.cameraData.cameras);
		}
	},
	getMyRoads: function() {
		this.$.db.getMyRoads();
	},
	updateNearMe: function(inSender, inResult) {
		var roadwayCameras, 
			i,
			more, 
			defaultNum = 6,
			c = 2, 
			r;
		
		this.$.roadimgs.destroyClientControls(); 
		if(this.cameraData) {
			roadwayCameras = this.cameraData.sortLocation(this.geo);
		} else if(inSender) {
			roadwayCameras = inSender.sortLocation(this.geo);
		}
		if(roadwayCameras) {
			//if(window.screen.availWidth) {
			//	c = Math.floor(window.screen.availWidth  / 160);
			//	r = Math.floor((window.screen.availHeight - 120) / 150);
			//	defaultNum = r * c;
			//}
			//if(defaultNum < 6) {
				defaultNum = 16;
			//	c = 2;
			//}
			this.flagUpdate = true;
			this.roadsToRender = defaultNum;
			for(i=0; i < defaultNum; i+=1 ) {
				more = {camera:roadwayCameras[i], ontap: "doRoadImgTap"};
				this.createComponent({kind:"com.icottrell.looking_down.RoadImgItem", container: this.$.roadimgs, onRendered: "updateState"}, more);
			}

			this.$.roadimgs.render();
		}

	},
	updateState: function(){
		this.roadsToRender--;
		if(this.roadsToRender <= 0 && this.flagUpdate){
			this.flagUpdate = false;
			this.doUpdated();
		}
	},
	pushpinClick: function(inSender, inEvent) {
		this.doRoadImgTap({camera: inEvent.target.camera});
	},
	preventTap: function(inSender, inEvent) {
		inEvent.preventTap();
	},
	centreMap: function() {
		try{
			this.$.map.setCenter(this.geo.latitude, this.geo.longitude);
		} catch(e){}
	},
	settingsPopup: function() {
		this.$.settings.show();
		this.$.settings.render();
	},
});