enyo.kind({
	name: "com.icottrell.looking_down.About", 
	kind: "Control",
	layoutKind: "FittableRowsLayout",   
	classes: "about_page",
	events: {
		onBack: "",
		onPrivacyOpen: ""
	},
	components: [
		{kind:"FittableColumns", components:[
			{fit: true},
			{kind: "Image", src: "assets/images/close32.png", classes:"close_icon", ontap: "doBack"},	
		]},
		{classes:"about_header", content:"About" },				
		{content: "Version 1.5.12", classes: "about_version"},
		{content: "Developed by iCottrell.com", classes: "about_dev"},
		{classes: "about_txt", wrap:true, content:"This application does not collect, store or transmit any location data. Location data is only used to present the traffic cameras ordered by their distance to you."},
		{classes: "about_txt", wrap: true, content:"The Looking Down project is not affiliated with the Ontario Ministry of Transportation (MTO). The MTO traffic cameras can be found at http://www.mto.gov.on.ca"},
		{content: "Please direct all inquries to dev@icottrell.com.", classes: "about_email"},
		{kind: "onyx.Button", content: "Privacy Policy", classes:"onyx-dark", style:"margin-top:0.5em;margin-left:0.25em;", ontap:"doPrivacyOpen"}
		
	],
	create: function() {
		this.inherited(arguments);
	},
});