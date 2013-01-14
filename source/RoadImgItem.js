enyo.kind({
	name: "com.icottrell.looking_down.RoadImgItem",
	classes: "roadimg",
	published: {
		camera: "",
	},
	events: {
		onRoadImgClick : "",
		onRendered: ""
	},
	placeHolder: "assets/images/placeholder.png",
	components: [
		{classes:"roadimg_topbar", components:[
			{name:"roadtitle"}
		]},
		{classes:"img_holder", components:[
			{name:"roadimg", kind:"Image", classes:"img_item", onerror:"insertPlaceHolder", onload:"doRendered"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.roadimg.setSrc(this.placeHolder);
		this.cameraChanged();
		this.previousClass = this.useClass;
	},
	
	cameraChanged: function() {
		this.inherited(arguments);
		if(this.camera) {
			this.$.roadtitle.setContent(this.camera.description);
			this.$.roadimg.setSrc(this.camera.src);
		}
	},
	insertPlaceHolder: function(){
		this.$.roadimg.setSrc(this.placeHolder);
	}
});