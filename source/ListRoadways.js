 enyo.kind({
	name: "com.icottrell.looking_down.ListRoadways",
	kind: "Control", 
	layoutKind: "FittableRowsLayout", 
	published: {
		geo: "",
		pageTitle: "",
		cameraData: "",
		showBack: true,
	},
	events: {
		onRoadTap: "",
		onBack: "",
		onLoaded: "",
		onUpdated: "",
	},
	components: [
		{kind: "onyx.Toolbar", defaultKind: "onyx.IconButton", style:"background-color:black;", components: [
			{name:"pagetitle", content:"", classes: "titleheader", style:"margin-left:0.5em;"},
			{name:"backbutton", kind: "Image", src:"assets/images/64/back.png", showing: true, classes:"bar_icon bar_icon_right", ontap: "cleanupBeforeBack" },
			{name:"showmore", kind: "Image", showing:true, src:"assets/images/64/showmore.png", classes:"bar_icon bar_icon_right", ontap:"addMoreRoads"}
		]},
		{kind: "Scroller", touch: true, fit: true, classes: "main", ondragfinish:"preventTap", components:[
			{name: "roadimgs"},
		]},
	],
	create: function() {
		this.inherited(arguments);
		this.roadwayCameras = [];
		if(window.device && window.device.platform === "Win32NT"){
			this.$.backbutton.hide();
		}
		this.doLoaded();
	},
	rendered: function() {
		this.inherited(arguments);
	},
	showBackChanged: function() {
		if(this.showBack){
			this.$.backbutton.show();
		} else {
			this.$.backbutton.hide();
		}
	},
	pageTitleChanged: function() {
		var i,
			more,
			length = 0;

		if(window.device && window.device.platform === "Win32NT"){
			this.currentBack = enyo.bind(this, "cleanupBeforeBack");
			document.addEventListener("backbutton", this.currentBack, false);
		}
		enyo.Signals.send("onloading");
		if(!this.showBack) {
			this.$.backbutton.hide();
		}
		
		this.roadwayCameras = this.cameraData.filterByRoadway(this.pageTitle, null, null, this.geo);
		
		this.$.pagetitle.setContent(this.pageTitle);
		
		this.$.roadimgs.destroyClientControls();
		length = this.roadwayCameras.length;
		if(length <= 16) { 
			this.$.showmore.hide();
		} else{
			length = 16;
			this.$.showmore.show();
		}
		this.roadsToRender = length;
		this.flagUpdate = true;
		if(length === 0){
			this.doUpdated();
		}
		for(i=0; i < length; i+=1 ) {
			more = {camera:this.roadwayCameras[i], ontap: "doRoadTap"};
			this.createComponent({kind:"com.icottrell.looking_down.RoadImgItem", container: this.$.roadimgs, onRendered: "updateState"}, more);
		}
		
		this.$.roadimgs.render();
		this.roadwayCameras = this.roadwayCameras.splice(16);
		
	},
	updateState: function(){
		this.roadsToRender--;
		if(this.roadsToRender <= 0 && this.flagUpdate){
			this.flagUpdate = false;
			this.doUpdated();
		}
	},	
	addMoreRoads: function() {
		var length,
			i;

		enyo.Signals.send("onloading");
		if(this.roadwayCameras.length > 16) { 
			length = 16;
			this.$.showmore.show();
		} else {
			this.$.showmore.hide();
			length = this.roadwayCameras.length;
		}
		this.roadsToRender = length;
		this.flagUpdate = true;
		for(i=0; i < length; i+=1 ) {
			more = {camera:this.roadwayCameras[i], ontap: "doRoadTap"};
			this.createComponent({kind:"com.icottrell.looking_down.RoadImgItem", container: this.$.roadimgs, onRendered: "updateState"}, more);
		}
		this.roadwayCameras = this.roadwayCameras.splice(16);
		this.$.roadimgs.render();
	},
	cleanupBeforeBack: function() {
		this.doBack();
		if(window.device && window.device.platform === "Win32NT"){
			document.removeEventListener("backbutton", this.currentBack);
		}
		return true;
	}
});