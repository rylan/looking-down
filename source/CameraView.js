enyo.kind({
	name: "com.icottrell.looking_down.CameraView", 
	kind: "Control", 
	layoutKind: "FittableRowsLayout", 
	classes: "cameraview",
	published: {
		camera: "",
		cameraData: "",
	},
	events :{
		onLoaded: "",
		onBack: ""
	},
	placeholder: "assets/images/placeholder320.png",
	components: [
		{name: "store", kind: "com.icottrell.looking_down.LocalStore", store:"My Roads"},
		{name: "close", kind:"FittableColumns", components:[
			{fit: true},
			{kind: "Image", src: "assets/images/64/close.png", classes:"close_icon", ontap: "doBack"},	
		]},
		 		
		{name: "title", kind:"FittableColumns", components:[
			{name:"bookmark", style:"padding-top:0.2em;margin-bottom:0.5em", components:[
				{name:"unstarred", kind: "Image", showing: true, src: "assets/images/64/unstarred.png", style: "height: 1.5em; width: 1.5em;", ontap: "star"},
				{name:"starred", kind: "Image", showing: false, src: "assets/images/64/starred.png", style: "height: 1.5em; width: 1.5em;", ontap: "unstar"}
			]},
			{name: "rtitle", wrap: true, classes: "cameraview_header", content: ""},	
		]},
		{kind: "Scroller", touch: true, horizontal: "hidden", ondragfinish:"preventTap", components: [
				{name:"roadimg", kind:"ImageView", src: this.placeholder, scale: "auto", classes:"cameraview_image", onerror:"insertPlaceHolder"},
				{name: "map", kind: "BingMap", classes:"cameraview_map",  onLoaded:"cameraChanged", onCameraPinClick:"mapItemPushed",
					options: {showDashboard: false, showScalebar: false}, credentials: ""},
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.roadimg.setSrc(this.placeholder);
		this.doLoaded();
	},
	insertPlaceHolder: function(){
		this.$.rtitle.setContent("Failed to load image - check network connection");
		this.$.roadimg.setSrc(this.placeholder);
		this.$.fittableRows.render();
	},
	setCamera: function(inCamera, inBounds) {
		var h, w;
		this.camera = inCamera;

		if(this.camera) {
			this.$.rtitle.setContent(this.camera.description.trim());
			this.$.roadimg.setSrc(this.camera.src);
			if(inBounds) {
				h = inBounds.height - (this.$.rtitle.getBounds().top + this.$.rtitle.getBounds().height)-40;
				this.$.scroller.addStyles("height:" + h + "px;");
				
				if(inBounds.width < 450) {
					w = inBounds.width - 20;
					this.$.roadimg.addStyles("width:" + w + "px;");
					this.$.map.addStyles("width:" + w + "px;");
				}
			}
			try {
				this.$.map.clearAll();
				this.$.map.setCenter(this.camera.geo.latitude, this.camera.geo.longitude);
				this.$.map.setShowTraffic(true);
				this.$.map.showTrafficChanged();
				this.$.map.setZoom(13);
				
				this.$.map.showCurrentPosition(this.camera.geo, "assets/images/pushpin_current.png");
				if(this.cameraData) {
					this.$.map.updateMapCameras(this.cameraData.cameras, this.camera);
				}

			} catch(e){}
			if(this.$.store.containsStarCamera("My Roads", this.camera)){
				this.$.starred.show();
				this.$.unstarred.hide();
			} else {
				this.$.starred.hide();
				this.$.unstarred.show();
			}

		}
	},
	mapItemPushed: function(inSender, inEvent) {
		this.setCamera(inEvent.target.camera);
	},
	star: function(inSender, inEvent) {
		if(this.camera) {
			this.$.store.addStarCamera("My Roads", this.camera, enyo.bind(this, this.addMyRoadSuccess));
		} 
	},
	unstar: function(inSender, inEvent){
		if(this.camera) {
			this.$.store.removeStarCamera("My Roads", this.camera, enyo.bind(this, this.removeMyRoadSuccess));
		}
	},
	addMyRoadSuccess: function(){
		this.$.starred.show();
		this.$.unstarred.hide();
	},
	removeMyRoadSuccess: function() {
		this.$.starred.hide();
		this.$.unstarred.show();
	}
});