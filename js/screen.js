
Screen = Class.extend({
    ctx: null,
    xTiles: 0,
    yTiles: 0,
    tileSize: 0,
    xOffset: 0,
    yOffset: 0,
    w: 0,
    h: 0,
    jobs: [],

    init: function(ctx, xTiles, yTiles, tileSize) {
        this.ctx = ctx;
        this.xTiles = xTiles;
        this.yTiles = yTiles;
        this.tileSize = tileSize;
        this.w = xTiles * tileSize;
        this.h = yTiles * tileSize;
    },

    render: function(sprite, x, y) {
        drawSprite(this.ctx, sprite, x - this.xOffset, y - this.yOffset);
    },

    clearBackground: function() {
        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.xTiles * this.tileSize, this.yTiles * this.tileSize);

        // Restore the transform
        this.ctx.restore();
    },

    setOffset: function(x, y) {
        this.xOffset = x;
        this.yOffset = y;
    },

    setShadow: function(color, ox, oy, blur) {
        this.ctx.shadowColor = color;
        this.ctx.shadowOffsetX = ox;
        this.ctx.shadowOffsetY = oy
        this.ctx.shadowBlur = blur;
    },

    renderText: function(text, x, y, align, baseLine, font) {
        this.ctx.font = font;

        this.ctx.textBaseline = baseLine;
        this.ctx.textAlign = align;

        this.ctx.fillText(text, x, y);
    },

    renderDebugText: function(text, position) {
        // var font = 'bold 12px sans-serif';
        var font = '12px Unibody_8-Bold';
        var align = '';
        var baseLine = '';
        var textX = 0;
        var textY = 0;

        if (position == 'bottom-right') {
            baseLine = 'bottom';
            align = 'right';
            textX = this.xTiles * this.tileSize;
            textY = this.yTiles * this.tileSize;
        } else if (position == 'top-right') {
            baseLine = 'top';
            align = 'right';
            textX = this.xTiles * this.tileSize;
            textY = 0;
        } else if (position == 'bottom-left') {
            baseLine = 'bottom';
            align = 'left';
            textX = 0;
            textY = this.yTiles * this.tileSize;
        } else if (position == 'top-left') {
            baseLine = 'top';
            align = 'left';
            textX = 0;
            textY = 0;
        }

        this.renderText(text, textX, textY, align, baseLine, font);
    },

    renderAnnouncementText: function(text, subtext, progress) {
        var context = this.ctx.save();

        var alpha = 1.0;
        if (progress > 0.7) {
            alpha = (0.3 - (progress - 0.7)) / 0.3;
        } else if (progress < 0.3) {
            alpha = progress / 0.3;
        } else if (progress <= 0) {
            return;
        }

        this.ctx.globalAlpha = alpha;
        this.setShadow('black', 0, 0, 20);
        this.renderText(text, (this.xTiles * this.tileSize) / 2, this.tileSize * 3, 'center', 'top', '30px Unibody_8-Bold');
        this.renderText(subtext, (this.xTiles * this.tileSize) / 2, this.tileSize * 4.5, 'center', 'top', '20px Unibody_8-Bold');

        this.ctx.restore(context);
    },

    addAnnouncementJob: function(text, subtext, time) {
        var job = {
            title: text,
            subtitle: subtext,
            time: time,
            counter: time,
            alpha: 0,
        };

        this.jobs.push(job);
    },

    tick: function(msPerTick) {
        if (this.jobs.length == 0) {
            return;
        }

        var trashJobs = [];
        for (var i = 0; i < this.jobs.length; i++) {
            if (this.jobs[i].counter > 0) {
                this.jobs[i].counter -= msPerTick;
                if (this.jobs[i].counter < 0) {
                    this.jobs[i].counter = 0;
                }

                this.jobs[i].alpha = this.jobs[i].counter / this.jobs[i].time;
            } else {
                trashJobs.push(i);
            }
        }

        for (var i = 0; i < trashJobs.length; i++) {
            this.jobs.splice(i, 1);
        }
    },

    renderJobs: function() {
        // this.renderDebugText(this.jobs.length + " render jobs", 'bottom-left');
        for (var i = 0; i < this.jobs.length; i++) {
            this.renderAnnouncementText(this.jobs[i].title, this.jobs[i].subtitle, this.jobs[i].alpha);
        }
    }
});
