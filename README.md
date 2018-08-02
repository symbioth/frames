Frames
======================

Pure js library for adding frames to images.

## Installation

Add frames.js tag before your custom scrtipts.
Add images of frame parts into your project.

```
<script type="text/javascript" src="./assets/js/frames.js"></script>
```

## Usage
Initialize frames in your script.
Accepts object with settings for frames

```
  new Frame({
    wrapperId: 'canvas-wrapper',
    uploadElementId: 'input',
    downloadId: 'download',
    imagesPath: 'assets/img/',
    imagesFormat: 'png',
    isBgHidden: true,
    classForSize: 'btn-size-change',
    frameTypeClass: 'btn-type-change',
    viewOptionClass: 'btn-view-change',
    defaultView: 'view-normal',
    defaultColor: 'blackClassic'
  });
```

- wrapperId: string - String, ID of wrapper element, canvas will be created inside it
- uploadElementId - String, ID of upload input
- downloadId - String, After clicking this element framed image will be downloaded
- imagesPath - String, path to images with borders in your project
- imagesFormat - String, Type of images
- isBgHidden - Boolean, if false white background of canvas will be shown
- classForSize - String, this elements must contain data-size attribute
  - data-size="small1" - 20x30
  - data-size="small2" - 28x42
  - data-size="big1" - 60x90
- frameTypeClass - String, this elements must contain data-styles attribute
  - data-styles="blackClassic"
  - data-styles="whiteClassic"
  - data-styles="blackAmerican"
  - data-styles="whiteAmerican"
- viewOptionClass - String, this elements must contain data-class attribute
  - data-class="view-big"
  - data-class="view-small"
- defaultView - String, default view which will be shown first
- defaultColor String, default frame type which will be shown first