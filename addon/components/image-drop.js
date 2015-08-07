import Ember from 'ember';
import layout from '../templates/components/image-drop';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ember-image-drop'],
  attributeBindings: ['style'],
  placeholder: "",
  helpText: "Drop your image here, or click to select",
  hideTextOnImage: true,

  textStyle: Ember.computed('image', function() {
    let textStyle = "";
    if (this.get('hideTextOnImage') && this.get('image')) {
      textStyle = "display: none;";
    }
    return Ember.String.htmlSafe(textStyle);
  }),

  image: null,
  style: Ember.computed('image', function() {
    let backgroundStyle = "";
    if (this.get('image')) {
      backgroundStyle =  `background-image: url(${this.get('image')});`;
    }

    return Ember.String.htmlSafe(backgroundStyle);
  }),

  setup: Ember.on('willInsertElement', function() {
    const $input = this.$('input');
    $input.on('change', (event) => {
      var reader = new FileReader();
      reader.onload = (e) => {
        var fileToUpload = e.target.result;
        Ember.run(() => {
          this.set('image', fileToUpload);
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    });
  }),

  dragOver(event) {
    this.noopHandler(event);
  },

  dragExit(event) {
    this.noopHandler(event);
  },

  dragEnter(event) {
    this.noopHandler(event);
  },

  noopHandler(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  drop(event) {
    event.preventDefault();
    let imageUrl = event.dataTransfer.getData('URL');
    this.convertImgToBase64URL(imageUrl, (base64) => {
      this.set('image', base64);
    });
  },

  convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
  }
});
