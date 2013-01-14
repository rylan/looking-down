enyo.kind({
	name: "com.icottrell.looking_down.CurrentLocation",
	kind: "Component",
	events: {
		onSuccess: "",
		onFailure: "",
		onLoaded: "",
	},
	create: function() {
		this.inherited(arguments);
		this.doLoaded();
	},
	destroy: function() {
		this.stopTracking();
		this.inherited(arguments);
	},
	stopTracking: function() {
		if (this._watchId) {
			navigator.geolocation.clearWatch(this._watchId);
		}
	},
	go: function() {
		
		this._watchId = navigator.geolocation.watchPosition(
			enyo.bind(this, this.doSuccess),
			enyo.bind(this, this.doFailure),
			{maximumAge: 600, timeout: 10000});
	}
});