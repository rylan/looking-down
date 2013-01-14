enyo.kind({
	name: "com.icottrell.looking_down.Privacy", 
	kind: "Control",
	layoutKind: "FittableRowsLayout",   
	classes: "privacy_page",
	events: {
		onBack: ""
	},
	components: [
		{kind:"FittableColumns", components:[
			{fit: true},
			{kind: "Image", src: "assets/images/close32.png", classes:"close_icon", ontap: "doBack"},	
		]},
		{classes:"privacy_header", content:"Privacy Policy" },
		{classes: "privacy_txt", wrap:true, content:"We respect your privacy as such this application does not collect, store or transmit any location data. The 400s application only uses your location to present traffic cameras ordered by their location to you."},
		{content: "Please direct all inquries to dev@icottrell.com.", classes: "privacy_email"},
		
	],
	create: function() {
		this.inherited(arguments);
	},
});