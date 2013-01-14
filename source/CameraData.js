enyo.kind({
	name: "com.icottrell.looking_down.CameraData",
	kind: "Component",
	published: {
		fileUrl:"assets/road_data_sample.json",
	},
	events: {
		onLoaded:"",
        onUpdate:"",
	},
	components:[
		{name: "store", kind: "com.icottrell.looking_down.LocalStore"},
	],
	create: function() {
		this.inherited(arguments);
		this.cameras = [];
		this.highways = [];
		this.roadCache = {};
		this.loadDataFile();	
	},
	loadDataFile: function() {
		var request = new enyo.Ajax({
			url: this.fileUrl,
			handleAs: "json"
		});

		request.response(enyo.bind(this, "processDataFile"));
		request.go();
	},
	processDataFile: function (inRequest, inResponse) {
		if(!inResponse) return; //not found

		this.cameras = inResponse.cameras;
		if(this.cameras)
		{
			this.processHighways();
		}
		this.doLoaded();
	},
	sortLocation: function (inGeo) {
		var that = this;
		return this.cameras.sort(function(a,b){
			return that.distanceBetween(inGeo, a.geo) - that.distanceBetween(inGeo, b.geo);
		});
	},
	processHighways: function() {
		var i, 
			j, 
			k, 
			flag;

       this.highways.push("My Roads");
		for(i=0; i < this.cameras.length; i+=1) {
			for(j=0; j < this.cameras[i].locations.length; j+=1) {
				if(!this.highways) {
					this.highways.push(this.cameras[i].locations[j].location);
				} else {
					flag = true;
					for(k=0; k< this.highways.length; k+=1) {
						if(this.cameras[i].locations[j].location === this.highways[k]){
							flag = false;
							break;
						}
					}
					if(flag) {
						this.highways.push(this.cameras[i].locations[j].location);
					}
				}
			} 
		}
	},
	distanceBetween: function(geo1, geo2) {
		var r = 6371000000,
			dLat = (geo2.latitude - geo1.latitude) * Math.PI / 180,
			dLon = (geo2.longitude-geo1.longitude) * Math.PI / 180,
   			a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(geo1.latitude * Math.PI / 180 ) * Math.cos(geo2.latitude * Math.PI / 180 ) * Math.sin(dLon/2) * Math.sin(dLon/2),
   			c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
   			d = r * c;
   		return Math.abs(Math.round(d));
	},
	filterByRoadway: function(inRoadway, inTake, inStart, inGeo) {
		var roadway = [],
			i, 
			j,
			that = this;

        if(inRoadway && inRoadway === "My Roads") {
        	this.$.store.retrieveItem("My Roads", function(inSender, inResult){roadway = inResult;}, null);
        } else {
		  for(i=0; i < this.cameras.length; i+=1) {
		      for(j=0; j < this.cameras[i].locations.length; j+=1) {
			     if(this.cameras[i].locations[j].location === inRoadway) {
					roadway.push(this.cameras[i]);
			 	}
			 }
            }
		}
		
		roadway.sort(function(a,b){
			return that.distanceBetween(inGeo, a.geo) - that.distanceBetween(inGeo, b.geo);
		});
		if(inTake && inStart) {
			return roadway.slice(inStart, inStart+inTake);
		} else {
			return roadway;
		}
	},
	myRoadways: function(inTake, inStart, inGeo) {
		var roadway = [],
			i, 
			j,
			that = this;

		for(i=0; i < this.cameras.length; i+=1) {
			if(this.cameras[i].myroad) {
				roadway.push(this.cameras[i]);
			}	
		}

		roadway.sort(function(a,b){
			return that.distanceBetween(inGeo, a.geo) - that.distanceBetween(inGeo, b.geo);
		});
		
		if(inTake && inStart) {
			return roadway.slice(inStart, inStart+inTake);
		} else {
			return roadway;
		}
	},
});

	