enyo.kind({
	name: "com.icottrell.looking_down.App",
	kind: "Control",
	style:"background-color: white;",
	classes: "onyx app enyo-fit",
	components: [
		{name: "store", kind: "com.icottrell.looking_down.LocalStore"}, 
		{kind: "Signals", ondeviceready: "deviceReady", onloading:"showSpinner"},	
		{name: "currentLocation", kind: "com.icottrell.looking_down.CurrentLocation", onSuccess: "currentLocationSuccess", onFailure: "useDefaultLocation"},		
		{kind: "FittableRows", fit:true, style:"height:100%; width:100%;", components:[
			{kind: "FittableColumns", style:"margin-top:0.25em;", components:[
				{content:"The 400s", classes:"app-heading"},
				{name:"spinner", kind: "onyx.Spinner", showing:true, style:"margin-left: 0.25em; width: auto; width: 1em; height: 1em;", classes: "spinner_small"},
				{fit: true},
				{name:"info", kind: "Image", ontap: "openAbout", classes: "bar_top", src:"assets/images/64/info.png"},
				{kind: "Image", ontap: "openSettings", classes:"bar_top", src:"assets/images/64/settings.png"}
			]},
			{kind: "FittableColumns", fit:true, components: [
				{name: "ignore", fit:true, components:[
					{name:"main", kind: "com.icottrell.looking_down.MainPanel", style:"width:100%; height:100%", onLoaded:"loadRoadContent", onRoadwayTap:"loadRoadway", onRoadImgTap:"loadRoad", onMapItemPush:"loadRoad", onUpdateLocation:"getLocation", onUpdated: "hideSpinner"},
					{name: "roadways", kind: "com.icottrell.looking_down.ListRoadways", style:"height:100%", showing: false,  showBack: true, onRoadTap: "loadRoad", onBack:"backToMain", onLoaded:"loadRoadContent", onUpdated: "roadwayUpdate"},
				]},
				{name: "cameraDrawer", orient: "h", kind: "onyx.Drawer", open: false, style:"background-color:black; height:100%;",components: [
					{name:"cameraView", kind: "com.icottrell.looking_down.CameraView", onLoaded:"loadRoadContent", onBack:"closeDrawer"},
				]},
				{name: "aboutDrawer", orient: "h", kind: "onyx.Drawer", open: false, style:"background-color:black; height:100%;",components: [
					{name: "about", kind: "com.icottrell.looking_down.About", onBack: "closeAbout", onPrivacyOpen: "openPrivacy"},
				]},
				{name: "settingsDrawer", orient: "h", kind: "onyx.Drawer", open: false, style:"background-color:black; height:100%;",components: [
					{name:"settings", kind: "com.icottrell.looking_down.SettingsView",  onSettingsChanged:"getLocation", onBack: "closeSettings"},
				]},
				{name: "privacyDrawer", orient: "h", kind: "onyx.Drawer", open: false, style:"background-color:black; height:100%;",components: [
					{name: "privacy", kind: "com.icottrell.looking_down.Privacy", onBack: "closePrivacy"},
				]}
			]}
		]},		
		{name:"cameraData", kind: "com.icottrell.looking_down.CameraData", onLoaded: "setCameraData", onUpdate: "updateRoadways"},
	],
	create: function() {
		this.inherited(arguments);
		this.geo = {};
		this.firstLoad = true;
		this.$.spinner.show();
		this.getLocation();
		this.opendrawers = [];
	},
	showSpinner: function() {
		this.$.spinner.show();
	},
	hideSpinner: function() {
		this.$.spinner.hide();
	},
	openAbout: function () {
		var w, bounds = this.getBounds();
		if(!this.$.aboutDrawer.open) {
			if(this.$.cameraDrawer.open){
				this.opendrawers.push(this.$.cameraDrawer);
				this.$.cameraDrawer.setOpen(!this.$.cameraDrawer.open);
			}
			if(this.$.settingsDrawer.open){
				this.opendrawers.push(this.$.settingsDrawer);
				this.$.settingsDrawer.setOpen(!this.$.settingsDrawer.open);
			}
			if(this.$.privacyDrawer.open){
				this.opendrawers.push(this.$.privacyDrawer);
				this.$.privacyDrawer.setOpen(!this.$.privacyDrawer.open);
			}
			if(bounds.width < 450){
				w = bounds.width - 40;
				this.$.aboutDrawer.addStyles("width:" + w + "px;");
				this.$.about.addStyles("width:" + w + "px;");
			}else {
				this.$.aboutDrawer.addStyles("width:" + 450 + "px;");
				this.$.about.addStyles("width:" + 450 + "px;");

			}
			this.$.about.render();
			this.$.aboutDrawer.setOpen(!this.$.aboutDrawer.open);
			this.$.fittableColumns.render();
		}
	},
	openPrivacy: function () {
		var w, bounds = this.getBounds();
		if(!this.$.privacyDrawer.open) {
			if(this.$.cameraDrawer.open){
				this.opendrawers.push(this.$.cameraDrawer);
				this.$.cameraDrawer.setOpen(!this.$.cameraDrawer.open);
			}
			if(this.$.settingsDrawer.open){
				this.opendrawers.push(this.$.settingsDrawer);
				this.$.settingsDrawer.setOpen(!this.$.settingsDrawer.open);
			}
			if(this.$.aboutDrawer.open){
				this.opendrawers.push(this.$.aboutDrawer);
				this.$.aboutDrawer.setOpen(!this.$.aboutDrawer.open);
			}
			if(bounds.width < 450){
				w = bounds.width - 40;
				this.$.privacyDrawer.addStyles("width:" + w + "px;");
				this.$.privacy.addStyles("width:" + w + "px;");
			}else {
				this.$.privacyDrawer.addStyles("width:" + 450 + "px;");
				this.$.privacy.addStyles("width:" + 450 + "px;");

			}
			this.$.privacy.render();
			this.$.privacyDrawer.setOpen(!this.$.privacyDrawer.open);
			this.$.fittableColumns.render();
		}
	},
	closeAbout: function(){
		var open;
		this.$.aboutDrawer.setOpen(!this.$.aboutDrawer.open);
		if(this.opendrawers){
			open = this.opendrawers.pop();
			open.setOpen(!open.open);
		}
		this.$.fittableColumns.render();
		return true;
	},
	closePrivacy: function(){
		var open;
		this.$.privacyDrawer.setOpen(!this.$.privacyDrawer.open);
		if(this.opendrawers){
			open = this.opendrawers.pop();
			open.setOpen(!open.open);
		}
		this.$.fittableColumns.render();
		return true;
	},
	openSettings: function () {
		var w, bounds = this.getBounds();
		if(!this.$.settingsDrawer.open) {
			if(this.$.cameraDrawer.open){
				this.opendrawers.push(this.$.cameraDrawer);
				this.$.cameraDrawer.setOpen(!this.$.cameraDrawer.open);
			}
			if(this.$.aboutDrawer.open){
				this.opendrawers.push(this.$.aboutDrawer);
				this.$.aboutDrawer.setOpen(!this.$.aboutDrawer.open);
			}
			if(this.$.privacyDrawer.open){
				this.opendrawers.push(this.$.privacyDrawer);
				this.$.privacyDrawer.setOpen(!this.$.privacyDrawer.open);
			}
			if(bounds.width < 450){
				w = bounds.width - 40;
				this.$.settingsDrawer.addStyles("width:" + w + "px;");
				this.$.settings.addStyles("width:" + w + "px;");
			}else {
				this.$.settingsDrawer.addStyles("width:" + 450 + "px;");
				this.$.settings.addStyles("width:" + 450 + "px;");
			}
			this.$.settings.render();
			this.$.settingsDrawer.setOpen(!this.$.settingsDrawer.open);
			this.$.fittableColumns.render();
		}
	},
	closeSettings: function(){
		var open;
		this.$.settingsDrawer.setOpen(!this.$.settingsDrawer.open);
		if(this.opendrawers){
			open = this.opendrawers.pop();
			open.setOpen(!open.open);
		}
		this.$.fittableColumns.render();
		return true;
	},
	loadRoadway: function(inSender, inEvent) {
		this.$.main.hide();
		this.$.roadways.show();
		if(inEvent.children[1]) {
			this.$.spinner.show();
			this.$.roadways.setPageTitle(inEvent.children[1].getContent());
			this.$.roadways.render();
		}
		return true; 
	},
	loadRoad: function(inSender, inEvent) {
		var w, bounds = this.getBounds();
		if(!this.$.cameraDrawer.open) {
			if(this.$.settingsDrawer.open){
				this.opendrawers.push(this.$.settingsDrawer);
				this.$.settingsDrawer.setOpen(!this.$.settingsDrawer.open);
			}
			if(this.$.aboutDrawer.open){
				this.opendrawers.push(this.$.aboutDrawer);
				this.$.aboutDrawer.setOpen(!this.$.aboutDrawer.open);
			}
			
			if(bounds.width < 450){
				w = bounds.width - 40;
				this.$.cameraDrawer.addStyles("width:" + w + "px;");
				this.$.cameraView.addStyles("width:" + w + "px;");
			}else {
				this.$.cameraDrawer.addStyles("width:" + 450 + "px;");
				this.$.cameraView.addStyles("width:" + 450 + "px;");
			}
			this.$.cameraDrawer.setOpen(!this.$.cameraDrawer.open);	
		}
		if(inEvent.camera) {
			this.$.cameraView.setCamera(inEvent.camera, bounds);
		}
		this.$.fittableColumns.render();
		return true;
	},
	loadRoadContent: function(inSender) {
		if(this.$.cameraData) {
			this.$.main.setCameraData(this.$.cameraData);
		} 
	},
	setCameraData: function(inSender) {
		if(this.$.roadways) {
			this.$.roadways.setCameraData(inSender);
		}
		if(this.$.main) {
			this.$.main.setCameraData(inSender);
		}
		if(this.$.cameraView) {
			this.$.cameraView.setCameraData(inSender);
		}
	},
	getLocation: function() {
		var useloc = this.$.store.getSetting("usemylocation");
		this.$.spinner.show();
		if(useloc || useloc === 'undefined' || useloc === null) {
			this.$.currentLocation.go();	
		} else {
			this.useDefaultLocation();
		}
	},
	updateRoadways: function() {
		this.$.main.geoChanged();
	},
	currentLocationSuccess: function(inSender, inData) {
		this.geo = inData.coords;
		this.$.main.setGeo(this.geo);
		this.$.roadways.setGeo(this.geo);
		this.$.main.centreMap();
		inSender.stopTracking();
	},
	useDefaultLocation: function(inSender, inError) {
		this.geo = { latitude : 43.677209539923, 
				     longitude : -79.60722374189 }
		this.$.main.setGeo(this.geo);
		this.$.roadways.setGeo(this.geo);
		this.$.main.centreMap();
		if(inSender) {
			inSender.stopTracking();
		}
		this.$.fittableRows.render();
		return true;
	},	
	backToMain: function(inEvent) {
		
		this.$.roadways.hide();
		if(this.$.cameraDrawer.open){
			this.$.cameraDrawer.setOpen(!this.$.cameraDrawer.open);
		}
		this.$.main.show();

		return true; 
	},
	closeDrawer: function() {
		var open;
		this.$.cameraDrawer.setOpen(!this.$.cameraDrawer.open);
		if(this.opendrawers){
			open = this.opendrawers.pop();
			open.setOpen(true);
		}
		this.$.fittableColumns.render();
		return true;
	},
	roadwayUpdate: function() {
		this.$.roadways.render();
		this.hideSpinner();
	}
});