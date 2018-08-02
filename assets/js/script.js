window.onload = function() {
  new Frame({
    uploadId: 'input',
    downloadId: 'download',
    imagesPath: 'assets/img/',
    imagesFormat: 'png',
    isBgHidden: true,
    wrapperId: 'canvas-wrapper',
    classForSize: 'btn-size-change',
    frameTypeClass: 'btn-type-change',
    viewOptionClass: 'btn-view-change',
    defaultView: 'view-normal',
    defaultColor: 'blackClassic'
  });
}