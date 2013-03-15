

// We keep a global dictionary of loaded sprite-sheets,
// which are each an instance of our SpriteSheetClass
// below.
//
// This dictionary is indexed by the URL path that the
// atlas is located at. For example, calling:
//
// gSpriteSheets['grits_effects.png'] 
//
// would return the SpriteSheetClass object associated
// to that URL, assuming that it exists.
var gSpriteSheets = {};

//-----------------------------------------
SpriteSheetClass = Class.extend({

	// The Image object that we created for our atlas.
	img: null,

	// The URL path that we grabbed our atlas from.
	url: "",

	// An array of all the sprites in our atlas.
	sprites: new Array(),

	//-----------------------------------------
	init: function () {},

	//-----------------------------------------
	// Load the atlas at the path 'imgName' into memory.
	load: function (imgName) {
	// Store the URL of the spritesheet we want.
	this.url = imgName;
	
	// Create a new image whose source is at 'imgName'.
	var img = new Image();
	img.src = imgName;

	// Store the Image object in the img parameter.
	this.img = img;

	// Store this SpriteSheetClass in our global
	// dictionary gSpriteSheets defined above.
	gSpriteSheets[imgName] = this;
	},

	//-----------------------------------------
	// Define a sprite for this atlas
	defSprite: function (name, x, y, w, h, cx, cy) {
	// We create a new object with:
	//
	// The name of the sprite as a string
	//
	// The x and y coordinates of the sprite in the atlas.
	//
	// The width and height of the sprite in the atlas.
	//
	// The x and y coordinates of the center of the sprite in the atlas. This is
	// so we don't have to do the calculations each time we need this. This might seem
	// minimal, but it adds up!
	var spt = {
		"id": name,
		"x": x,
		"y": y,
		"w": w,
		"h": h,
		"cx": cx == null ? 0 : cx,
		"cy": cy == null ? 0 : cy
	};

	// We push this new object into our array of sprite objects, at the end of the array.
	this.sprites.push(spt);
	},

	//-----------------------------------------
	// Parse the JSON file passed in as 'atlasJSON' that is associated to this atlas.
	parseAtlasDefinition: function (atlasJSON) {
	var parsed = JSON.parse(atlasJSON);

	for(var i = 0; i < parsed.frames.length; i++) {
		var sprite = parsed.frames[i];
		// console.log("Parsing sprite : " + sprite.filename + " ...")

		// Define the center of the sprite as an offset (hence the negative).
		var cx = -sprite.frame.w * 0.5;
		var cy = -sprite.frame.h * 0.5;

		// Define the sprite for this sheet by calling defSprite to store it into the 'sprites' Array.
		this.defSprite(sprite.filename, sprite.frame.x, sprite.frame.y, sprite.frame.w, sprite.frame.h, cx, cy);
	}
	},

	//-----------------------------------------
	// Walk through all the sprite definitions for this atlas, and find which one matches the name.
	getStats: function (name) {
	// For each sprite in the 'sprites' Array...
	for(var i = 0; i < this.sprites.length; i++) {         
		// Check if the sprite's 'id' parameter equals the passed in name...
		if(this.sprites[i].id === name) {
			// and return that sprite if it does.
			return this.sprites[i];
		}
	}

	// If we don't find the sprite, return null.
	return null;
	}

});

function drawSprite(ctx, spriteName, posX, posY) {
	for (var sheetName in gSpriteSheets) {
		var sprite = gSpriteSheets[sheetName].getStats(spriteName);
		if (sprite != null) {
			return __drawSpriteInternal(ctx, sprite, gSpriteSheets[sheetName], posX, posY);
		}
	}

	return;
}

function __drawSpriteInternal(ctx, spt, sheet, posX, posY) {
	if (spt == null || sheet == null) {
	return;
	}

	ctx.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h, posX + spt.cx, posY + spt.cy, spt.w, spt.h);
}

var characterSheet = new SpriteSheetClass();

var xhr = new XMLHttpRequest();
xhr.open("GET", 'res/tileset.json', true);
xhr.onload = function() {
	characterSheet.parseAtlasDefinition(xhr.responseText);
	characterSheet.load('res/img/tileset.png')
};

xhr.send();
