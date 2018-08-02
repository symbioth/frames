function Frame(settings) {
    var self = this;
    self.w = document.body.clientWidth;
    self.canvas = false;
    self.ctx = false;
    self.listFrames = [
        ['whiteClassic', 'angleTopLeft'],
        ['whiteClassic', 'angleBottomLeft'],
        ['whiteClassic', 'angleTopRight'],
        ['whiteClassic', 'angleBottomRight'],
        ['whiteClassic', 'topPart'],
        ['whiteClassic', 'bottomPart'],
        ['whiteClassic', 'leftPart'],
        ['whiteClassic', 'rightPart'],
        ['blackClassic', 'angleTopLeft'],
        ['blackClassic', 'angleBottomLeft'],
        ['blackClassic', 'angleTopRight'],
        ['blackClassic', 'angleBottomRight'],
        ['blackClassic', 'topPart'],
        ['blackClassic', 'bottomPart'],
        ['blackClassic', 'leftPart'],
        ['blackClassic', 'rightPart'],
        ['whiteAmerican', 'angleTopLeft'],
        ['whiteAmerican', 'angleBottomLeft'],
        ['whiteAmerican', 'angleTopRight'],
        ['whiteAmerican', 'angleBottomRight'],
        ['whiteAmerican', 'topPart'],
        ['whiteAmerican', 'bottomPart'],
        ['whiteAmerican', 'leftPart'],
        ['whiteAmerican', 'rightPart'],
        ['blackAmerican', 'angleTopLeft'],
        ['blackAmerican', 'angleBottomLeft'],
        ['blackAmerican', 'angleTopRight'],
        ['blackAmerican', 'angleBottomRight'],
        ['blackAmerican', 'topPart'],
        ['blackAmerican', 'bottomPart'],
        ['blackAmerican', 'leftPart'],
        ['blackAmerican', 'rightPart'],
    ];

    self.partsCount = self.listFrames.length;
    self.parts = {};
    self.needToPrint = false;
    self.imagesPath = settings.imagesPath;
    self.wrapper = settings.wrapperId;

    self.link = document.createElement('a');
    self.link.setAttribute('id', 'frames_download_link');
    self.link.setAttribute('target', '_blank');

    self.fileInput = document.getElementById(settings.uploadId);
    self.downloadButton = document.getElementById(settings.downloadId);
    self.isBgHidden = settings.isBgHidden;
    self.radios = document.getElementsByClassName(settings.classForSize);
    self.borders = document.getElementsByClassName(settings.frameTypeClass);
    self.views = document.getElementsByClassName(settings.viewOptionClass);
    self.wrapperCanvas = document.getElementById(settings.wrapperId);
    self.borderWidth = 105;
    self.milk = 30;

    self.image = false;
    self.size = 'small';
    self.color = settings.defaultColor;
    self.types = 'small1';
    self.option = settings.defaultView;

    self.padding = 0;
    self.imageWidth = 0;
    self.imageHeight = 0;
    self.widthBorder3d = 2;

    self.init = function() {
        self.canvas = document.createElement('canvas');
        self.canvas2 = document.createElement('canvas');
        self.wrapperCanvas.appendChild(self.canvas);
        self.ctx = self.canvas.getContext('2d');
        self.ctx2 = self.canvas2.getContext('2d');

        self.fileInput.addEventListener('change', self.fileChoose);
        self.downloadButton.addEventListener('click', function () {
            document.getElementsByTagName('body')[0].appendChild(self.link);
            self.link.click();
            self.link.remove();
        });

        for (var i in self.radios) {
            if (typeof self.radios[i] == "object") {
                var size = self.radios[i].dataset.size;
                (function(s) {
                    self.radios[i].addEventListener('click', function() {
                    self.getValue(s);
                }, false);
                })(size);
            }
        }

        for (var i in self.borders) {
            if (typeof self.borders[i] == "object") {
                var size = self.borders[i].dataset.styles;
                (function(s) {
                    self.borders[i].addEventListener('click', function() {
                    self.changeBorder(s);
                }, false);
                })(size);
            }
        }

        for (var i in self.views) {
            if (typeof self.views[i] == "object") {
                var size = self.views[i].dataset.class;
                (function(s) {
                    self.views[i].addEventListener('click', function(e) {
                        self.changeOption(s);
                }, false);
                })(size);
            }
        }

        for (var k in self.listFrames) {
            self.initPart(self.listFrames[k][0], self.listFrames[k][1]);
        }
    };

    self.initPart = function(color, part) {
        self.parts[color] = ! (color in self.parts) ? {} :  self.parts[color];
        self.parts[color][part] = new Image();
        self.parts[color][part].src = self.imagesPath + color + part + '.' + settings.imagesFormat;
        self.parts[color][part].onload = self.loaded;
    };

    self.loaded = function() {
        self.partsCount -= 1;
        if (self.partsCount == 0 && self.needToPrint) {
            self.print();
        }
    };

    self.fileChoose = function(e) {
        file = e.target.files[0];
        self.image = new Image;
        self.image.src = URL.createObjectURL(file);
        self.image.onload = function() {
            if (self.partsCount == 0) {
                self.print(true);
            } else {
                self.needToPrint = true;
            }
        };
    };

    self.getValue = function(size) {
        self.types = size;
        if (self.types == 'small1') {
            self.size = 'small';
        } else if(self.types == 'small2') {
            self.size = 'small';
        } else if(self.types == 'big1') {
            self.size = 'big';
        }

        self.print();
    };

    self.changeBorder = function (color) {
        if (color == 'blackClassic') {
            self.color = 'blackClassic';
        } else if (color == 'whiteClassic'){
            self.color = 'whiteClassic';
        } else if (color == 'whiteAmerican'){
            self.color = 'whiteAmerican';
        } else if (color == 'blackAmerican'){
            self.color = 'blackAmerican';
        } else if (color == 'noBorder') {
            self.color = 'noBorder'
        }
        self.print();
    };

    self.changeOption= function (option) {
        self.option = option;
        self.print();
    };

    self.print = function() {
        self.needToPrint = false;
        self.canvasSize();
        if (self.color != 'noBorder') {
            var angleTopRight = self.parts[self.color].angleTopRight;
            var angleTopLeft = self.parts[self.color].angleTopLeft;
            var angleBottomRight = self.parts[self.color].angleBottomRight;
            var angleBottomLeft = self.parts[self.color].angleBottomLeft;

            var leftPart = self.parts[self.color].leftPart;
            var topPart = self.parts[self.color].topPart;
            var rightPart = self.parts[self.color].rightPart;
            var bottomPart = self.parts[self.color].bottomPart;

            self.canvas2.height = self.canvas.height;
            self.canvas2.width = self.canvas.width;

            self.ctx.fillStyle = "#fff";
            self.ctx2.fillStyle = "#fff";
            self.ctx2.fillRect(0, 0, self.canvas2.height, self.canvas2.width);

            if (!self.isBgHidden) {
                self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
            }

            self.ctx.fillStyle = "#fff";
            self.ctx.fillRect((self.borderWidth / 2) + self.outerX / 2, (self.borderWidth / 2) + self.outerY / 2, self.canvas.width - self.borderWidth - self.outerX, (self.canvas.height - self.borderWidth) - self.outerY);
        };

        self.ctx.imageSmoothingEnabled = true;
        self.imageWidth = (self.canvas.width - self.padding - self.outerX) + (self.widthBorder3d / 2);
        self.imageHeight = (((self.canvas.width - self.padding - self.outerX) / self.image.width) * self.image.height) + (self.widthBorder3d / 2);
        self.ctx.drawImage(self.image, (self.padding / 2) + self.outerX / 2, (self.padding / 2 + self.outerY / 2) - (self.widthBorder3d / 2), self.imageWidth, self.imageHeight);

        //3D

        if(self.size == 'small') {
            // TOP LINE 3D
            self.ctx.beginPath();
            self.ctx.strokeStyle = '#fff';
            self.ctx.lineWidth = self.widthBorder3d;
            self.ctx.moveTo((self.padding / 2 + self.outerX / 2) - (self.widthBorder3d / 2), (self.padding / 2 + self.outerY / 2));
            self.ctx.lineTo(self.imageWidth + (self.padding / 2 + self.outerX / 2) + (self.widthBorder3d / 2), (self.padding / 2 + self.outerY / 2));
            self.ctx.stroke();

            // BOTTOM LINE 3D
            self.ctx.beginPath();
            self.ctx.strokeStyle = '#d6d6d6';
            self.ctx.lineWidth = self.widthBorder3d;
            self.ctx.moveTo((self.padding / 2  + self.outerX / 2), self.imageHeight + (self.padding / 2 + self.outerY / 2));
            self.ctx.lineTo((self.imageWidth + (self.padding / 2  + self.outerX / 2)) - (self.widthBorder3d / 2), self.imageHeight + (self.padding / 2 + self.outerY / 2));
            self.ctx.stroke();

            // LEFT LINE 3D
            self.ctx.beginPath();
            self.ctx.strokeStyle = '#d6d6d6';
            self.ctx.lineWidth = self.widthBorder3d;
            self.ctx.moveTo((self.padding / 2  + self.outerX / 2), (self.padding / 2 + self.outerY / 2) + (self.widthBorder3d / 2));
            self.ctx.lineTo((self.padding / 2 + self.outerX / 2), self.imageHeight + (self.padding / 2 + self.outerY / 2) + (self.widthBorder3d / 2));
            self.ctx.stroke();

            // RIGHT LINE 3D
            self.ctx.beginPath();
            self.ctx.strokeStyle = '#fff';
            self.ctx.lineWidth = self.widthBorder3d;
            self.ctx.moveTo(self.imageWidth + (self.padding / 2 + self.outerX / 2), (self.padding / 2 + self.outerY / 2));
            self.ctx.lineTo(self.imageWidth + (self.padding / 2 + self.outerX / 2), self.imageHeight + (self.padding / 2 + self.outerY / 2) + (self.widthBorder3d / 2));
            self.ctx.stroke();
        }

        if (self.color != 'noBorder') {

            self.ctx.drawImage(angleTopLeft, self.outerX / 2, self.outerY / 2, self.borderWidth, self.borderWidth);
            self.ctx.drawImage(angleTopRight,  self.canvas.width  - (self.borderWidth + self.outerX / 2), self.outerY / 2, self.borderWidth, self.borderWidth);
            self.ctx.drawImage(angleBottomRight,  self.canvas.width  - (self.borderWidth + self.outerX / 2),  self.canvas.height - (self.borderWidth + self.outerY / 2), self.borderWidth, self.borderWidth);
            self.ctx.drawImage(angleBottomLeft, self.outerX / 2, self.canvas.height - (self.borderWidth + self.outerY / 2), self.borderWidth, self.borderWidth);

            self.ctx.drawImage(leftPart, self.outerX / 2, self.borderWidth + self.outerY / 2, self.borderWidth, self.canvas.height - (self.borderWidth + self.borderWidth) - self.outerY);
            self.ctx.drawImage(rightPart, self.canvas.width  - (self.borderWidth + self.outerX / 2), (self.borderWidth + self.outerY / 2), self.borderWidth,  self.canvas.height - (self.borderWidth + self.borderWidth) - self.outerY);

            self.ctx.drawImage(topPart, self.borderWidth + self.outerX / 2, self.outerY / 2,  self.canvas.width - ((self.borderWidth * 2) + self.outerX) , self.borderWidth);
            self.ctx.drawImage(bottomPart, self.borderWidth + self.outerX / 2, self.canvas.height - (self.borderWidth + self.outerY / 2), self.canvas.width - ((self.borderWidth * 2) + self.outerX), self.borderWidth);
        }

        self.ctx2.drawImage(self.canvas, 0, 0);
        var dataUrl =  self.canvas2.toDataURL("image/png");
        self.link.setAttribute('download', 'image -' + new Date() * 1);
        self.link.setAttribute('href', dataUrl);
    };

    self.canvasSize = function() {
        if(self.w <= 1000) {
            self.borderWidth = 52;
            self.milk = (self.image.width / 4.46);
        }

        if (self.option == 'view-small') {
            self.borderWidth = 44;
        }

        self.milkX =  self.size == 'small' ? self.milk * 2 : 0;
        self.milkY = self.size == 'small' ? self.milk * 2 : 0;
        var k = self.image.width / self.image.height;

        if(self.color == 'noBorder') {
            self.padding = 0;
            self.ctx.canvas.style.boxShadow = '0px 0px 25px 5px rgba(0, 0, 0, 0.5)';
        } else if (self.color == 'noBorder' &&  self.size == 'big') {
            self.padding = 0;
        } else if (self.size == 'big') {
            self.padding = self.borderWidth;
            self.ctx.canvas.style.boxShadow = '';
        } else {
            self.padding = self.milkX + self.borderWidth;
            self.ctx.canvas.style.boxShadow = '';
        }

        if(self.option != 'view-small') {
            self.image.width = self.wrapperCanvas.offsetWidth - 200;
        } else {
            if (self.w >= 1200) {
                if (self.types == 'small1') {
                    self.image.width = 100;
                } else if (self.types == 'small2') {
                    self.image.width = 130;
                } else if (self.types == 'big1') {
                    self.image.width = 250;
                }
            } else if (self.w >= 768) {
                if (self.types == 'small1') {
                    self.image.width = 50;
                } else if (self.types == 'small2') {
                    self.image.width = 80;
                } else if (self.types == 'big1') {
                    self.image.width = 150;
                }
            } else if (self.w >= 640) {
                if (self.types == 'small1') {
                    self.image.width = 50;
                } else if (self.types == 'small2') {
                    self.image.width = 80;
                } else if (self.types == 'big1') {
                    self.image.width = 120;
                }
            } else {
                if (self.types == 'small1') {
                    self.image.width = 50;
                } else if (self.types == 'small2') {
                    self.image.width = 60;
                } else if (self.types == 'big1') {
                    self.image.width = 75;
                }
            }

        }

        self.image.height = self.image.width / k;

        if(self.image.height > self.image.width) {
            self.outerX =(self.image.height + self.padding) - (self.image.width + self.padding);
            self.outerY = 0;
        } else {
            self.outerY = (self.image.width + self.padding) - (self.image.height + self.padding);
            self.outerX = 0;
        }

        self.canvas.width = self.image.width +  self.padding + self.outerX;
        self.canvas.height = self.image.height +  self.padding + self.outerY ;
    };

    self.init();
};