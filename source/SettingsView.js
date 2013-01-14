enyo.kind({
	name: "com.icottrell.looking_down.SettingsView", 
	kind: "Control",
	layoutKind: "FittableRowsLayout",   
	classes: "settings_page",
	events: {
		onBack: "",
		onSettingsChanged: ""
	},
	USE_MY_LOCATION: "usemylocation",
	components: [
		{name: "store", kind: "com.icottrell.looking_down.LocalStore"},  
		{kind:"FittableColumns", components:[
			{fit: true},
			{kind: "Image", src: "assets/images/close32.png", classes:"close_icon", ontap: "doBack"},	
		]},
		{content:"Settings",  classes:"settings_header"},	
		{kind: "onyx.InputDecorator", style: "margin-top: 1em; border: 0px;margin-bottom:1em;", components: [
            {content: "Use my location", classes: "settings_question"},
            {kind:"onyx.ToggleButton", onChange:"toggleChanged", style:"margin-left:15px;"},
        ]},
		{content:"No location data is stored or collected and is only used to order cameras relative to your position. Turning off my location will use Pearson International Airport as the default location for image ordering.", 
			wrap: true, style:"font-size: 0.6em;text-align:justify; margin-left: 0.25em; margin-right: 0.25em;"}
	],
	create: function() {
		this.inherited(arguments);
		var useloc = this.$.store.getSetting(this.USE_MY_LOCATION);
		if(useloc === "undefined" || useloc === null){
			useloc = true;
		}
		this.$.toggleButton.setValue(useloc);
		this.loaded = true;
	},
	toggleChanged: function() {
		if(this.$.store.getSetting(this.USE_MY_LOCATION) !== this.$.toggleButton.getValue() && this.loaded) { 
			this.$.store.setSetting(this.USE_MY_LOCATION, this.$.toggleButton.getValue());
			this.doSettingsChanged();
		}
	},
});