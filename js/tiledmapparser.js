
var TILEDMapClass = Class.extend({
    // This is where we store the full parsedJSON of the map.json file.
    currMapData: null,

    // tilesets stores each individual tileset from the map.json's 'tilesets' Array.
    // The structure of each entry of this Array is explained below in the parseAtlasDefinition method.
    tilesets[],
    
    // Boolean flag we set once our map atlas has finished loading.
    fullyLoaded: false,

    // This is where we store the width and height of the map in tiles. This is
    // in the 'width' and 'height' fields of map.json, respectively.
    numXTiles: 100,
    numYTiles: 100,

    // The size of each individual map tile, in pixels. This is in the
    // 'tilewidth' and 'tileheight' fields of map.json, respectively.
    tileSize: {
        "x": 64,
        "y": 64
    },

    // The size of the entire map, in pixels. This is calculated
    // based on the 'numXTiles', 'numYTiles', and 'tileSize' parameters.
    pixelSize: {
        "x": 64,
        "y": 64
    },

    // Counter to keep track of how many tile images we have successfully loaded.
    imgLoadCount: 0,

  //-----------------------------------------
  // Load the json file at the url 'map' into memory.
  load: function (map) {
    xhrGet(map, function(data) { this.parseMapJSON(data.responseText); });
  },

  imageLoadCountUpdater: function() {
  },

  //---------------------------
  parseMapJSON: function (mapJSON) {
    this.currMapData = JSON.parse(mapJSON);
    var map = this.currMapData;

    // Set the above properties of our TILEDMap based on the various properties in 'currMapData'.    
    this.numXTiles = map.width;
    this.numYTiles = map.height;

    this.tileSize.x = map.tilewidth;
    this.tileSize.y = map.tileheight;

    this.pixelSize.x = this.tileSize.x * this.numXTiles;
    this.pixelSize.y = this.tileSize.y * this.numYTiles;

    for(var i = 0; i < map.tilesets.length; i++) {
      var img = new Image();
      img.onload = function() {
        if (++gMap.imgLoadCount == gMap.tilesets.length) {
          gMap.fullyLoaded = true;
        }
      };
      img.src = "../data/" + map.tilesets[i].image.replace(/^.*[\\\/]/, '');

      var tileset = {
        "firstgid": map.tilesets[i].firstgid,
        "image": img,
        "imageheight": map.tilesets[i].imageheight,
        "imagewidth": map.tilesets[i].imagewidth,
        "name": map.tilesets[i].name,
        "numXTiles": Math.floor(map.tilesets[i].imagewidth / this.tileSize.x),
        "numYTiles": Math.floor(map.tilesets[i].imageheight / this.tileSize.y)
      };

      this.tilesets.push(tileset);
    }
  },

  //-----------------------------------------
  // Grabs a tile from our 'layer' data and returns the 'pkt' object for the layer we want to draw.
  // It takes as a parameter 'tileIndex', which is the id of the tile we'd like to draw in our layer data.
  getTilePacket: function (tileIndex) {
    var pkt = {
        "img": null,
        "px": 0,
        "py": 0
    };

    var ts = null;
    for (var i = 0; i < this.tilesets.length; i++) {
      if (this.tilesets[i].firstgid < tileIndex) {
        continue;
      }

      ts = this.tilesets[i];
    }

    if (ts == null) {
      return null;
    }

    pkt.img = ts.img;

    var tileLocalId = tileIndex - ts.firstgid;
    var tileX = Math.floor(tileLocalId % ts.numXTiles);
    var tileY = Math.floor(tileLocaId / ts.numXTiles);
    pkt.px = tileX * this.tileSize.x;
    pkt.py = tileY * this.tileSize.y;

    return pkt;
  },

  //-----------------------------------------
  // Draws all of the map data to the passed-in canvas context, 'ctx'.
  draw: function (ctx) {
    if (!this.fullyLoaded) return;

    // Now, for every single layer in the 'layers' Array
    // of 'currMapData', we need to:
    for (var i = 0; i < this.currMapData.layers.length; i++) {
      var layer = this.currMapData.layers[i];

      if (layer.type != "tilelayer") {
        continue;
      }

      for (var tileIndex = 0; tileIndex < layer.data.length; tileIndex++) {
        var tileId = layer.data[tileIndex];
        if (tileId == 0) {
          continue;
        }

        var pkt = this.getTilePacket(tileId);

        var canvasX = Math.floor(tileIndex % this.numXTiles) * this.tileSize.x;
        var canvasY = Math.floor(tileIndex / this.numXTiles) * this.tileSize.y;

        ctx.drawImage(pkt.img, pkt.px, pkt.py, this.tileSize.x, this.tileSize.y, canvasX, canvasY, this.tileSize.x, this.tileSize.y);
      }
    }
  }
});

// We define a single global instance of our map for the rest of our game code to access.
var gMap = new TILEDMapClass();

