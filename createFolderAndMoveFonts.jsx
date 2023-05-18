function createFolderAndMoveFonts() {
  // get the path of the script file
  var scriptFile = File($.fileName);
  var scriptPath = scriptFile.path;

  // create a new folder in the same directory as the script file
  var folder = new Folder(scriptPath + File.fs + "Fonts");
  folder.create();

  // function to loop through all layers and nested compositions
  function processLayer(layer) {
    // if the layer has a text source
    if (layer instanceof TextLayer) {
      var textDocument = layer.property("Source Text").value;

      // get all the used fonts in the text source
      var fonts = textDocument.fonts || [];

      // loop through all the fonts used in the text source
      for (var i = 0; i < fonts.length; i++) {
        var font = fonts[i];

        // get the font file path
        var fontFile = font.file;

        // move the font file to the new folder
        if (fontFile) {
          var newFontFile = new File(folder + File.fs + fontFile.displayName);
          fontFile.copy(newFontFile);
          fontFile.remove();
          alert("Moved font: " + fontFile.displayName + " to " + newFontFile.fsName);
        }
      }
    }
    // if the layer is a composition, process its layers recursively
    else if (layer instanceof AVLayer && layer.source instanceof CompItem) {
      var nestedComp = layer.source;
      for (var j = 1; j <= nestedComp.numLayers; j++) {
        var nestedLayer = nestedComp.layer(j);
        processLayer(nestedLayer);
      }
    }
  }

  // loop through all layers in the active item
  var activeItem = app.project.activeItem;
  for (var k = 1; k <= activeItem.numLayers; k++) {
    var layer = activeItem.layer(k);
    processLayer(layer);
  }
}