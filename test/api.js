describe('Testing api', function(){
  // testing basic api
  var assert = require("chai").assert;
  GLOBAL.document = require('jsdom').jsdom('<html lang="en-US"></html>');
  GLOBAL.window = GLOBAL.document.defaultView;
  GLOBAL.$ = require('jquery');
  var $ul;
  var sortable = require("../src/html.sortable.src.js");
  var resetSortable = function(){
    $('body').html('').append('<ul class="sortable">'+
      '<li class="item">Item 1</li>'+
      '<li class="item">Item 2</li>'+
      '<li class="item">Item 3</li>'+
      '</ul>');
    $ul = $('.sortable');
    $lis = $ul.find('li');
  };

  describe('Initialization ', function(){
    beforeEach(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder',
        draggingClass: 'test-dragging'
      });
      $li = $ul.find('li').first();
    });

    it('should have a data-opts object', function(){
      assert.typeOf($ul.data('opts'),"object");
    });

    it('should have correct options set on options object', function(){
      var opts = $ul.data('opts');
      assert.equal(opts.items,"li");
      assert.equal(opts.connectWith,".test");
      assert.equal(opts.placeholderClass,"test-placeholder");
      assert.equal(opts.draggingClass,"test-dragging");
    });

    it('should have a aria-dropeffect attribute', function(){
      assert.equal($ul[0].getAttribute('aria-dropeffect'),"move");
    });

    it('should have a data-items object', function(){
      assert.typeOf($ul.data('items'),"string");
    });

    it('should have a data-connectWith object', function(){
      assert.typeOf($ul.data('connectWith'),"string");
    });

    it('should have aria-grabbed attributes', function(){
      $lis.each(function(){
        assert.equal(this.getAttribute('aria-grabbed'), "false");
      });
    });

    it('should have draggable attribute', function(){
      $lis.each(function(){
        assert.equal(this.getAttribute('draggable'), "true");
      });
    });

    it('sortable should have correct event attached', function(){
      // general jQuery event object
      assert.isDefined(jQuery._data($ul[0], 'events'));
      // individual events
      assert.isDefined(jQuery._data($ul[0], 'events').hasOwnProperty('dragover'));
      assert.isDefined(jQuery._data($ul[0], 'events').hasOwnProperty('dragenter'));
      assert.isDefined(jQuery._data($ul[0], 'events').hasOwnProperty('drop'));
    });

    it('sortable item should have correct event attached', function(){
      // general jQuery event object
      assert.isDefined($._data($li[0], 'events'));
      // individual events
      assert.isDefined($._data($li[0], 'events').hasOwnProperty('dragover'));
      assert.isDefined($._data($li[0], 'events').hasOwnProperty('dragenter'));
      assert.isDefined($._data($li[0], 'events').hasOwnProperty('drop'));
      assert.isDefined($._data($li[0], 'events').hasOwnProperty('dragstart'));
      assert.isDefined($._data($li[0], 'events').hasOwnProperty('dragend'));
      assert.isDefined($._data($li[0], 'events').hasOwnProperty('selectstart'));
    });

  });

  describe('Destroy', function(){
    beforeEach(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li',
        'connectWith': '.test'
      });
      $ul.sortable('destroy');
    });

    it('should not have a data-opts object', function(){
      assert.typeOf($ul.data('opts'),"undefined");
    });

    it('should not have a aria-dropeffect attribute', function(){
      assert.isNull($ul[0].getAttribute('aria-dropeffect'));
    });

    it('should not have a data-items object', function(){
      assert.isUndefined($ul.data('items'));
    });

    it('should not have a data-connectWith object', function(){
      assert.isUndefined($ul.data('connectWith'));
    });

    it('should not have an aria-grabbed attribute', function(){
      $lis.each(function(){
        assert.isNull(this.getAttribute('aria-grabbed'));
      });
    });

    it('should not have draggable attribute', function(){
      $lis.each(function(){
        assert.isNull(this.getAttribute('draggable'));
      });
    });

  });

  describe('Reload', function(){
    before(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      });
      $ul.sortable('reload');
    });

    it('should keep the options of the sortable', function(){
      var opts = $ul.data('opts');
      assert.equal(opts.items,'li:not(.disabled)');
      assert.equal(opts.connectWith,'.test');
      assert.equal(opts.placeholderClass,'test-placeholder');
    });

    it('should keep items attribute of the sortable', function(){
      var items = $ul.data('items');
      assert.equal(items,'li:not(.disabled)');
    });

    it('should keep connectWith attribute of the sortable', function(){
      var connectWith = $ul.data('connectWith');
      assert.equal(connectWith,'.test');
    });

  });

  describe('Disable', function(){
    before(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      });
      $ul.sortable('disable');
    });

    it('should remove attributes from sortable', function(){
      var opts = $ul.data('opts');
      assert.equal($ul.attr('aria-dropeffect'), 'none');
    });

    it('should set handles to draggable = false', function(){
      var handle = $ul.find($ul.data('items')).first();
      assert.equal(handle.attr('draggable'), 'false');
    });

    it('should remove mousedown event', function(){
      var handle = $ul.find($ul.data('items')).first();
      assert.isDefined($._data(handle[0], 'events'));
      assert.isFalse($._data(handle[0], 'events').hasOwnProperty('mousedown'));
      assert.isFalse($._data(handle[0], 'events').hasOwnProperty('mousedown.h5s'));
    });

  });

  describe('Enable', function(){
    before(function(){
      resetSortable();
      $ul.sortable({
        'items': 'li:not(.disabled)',
        'connectWith': '.test',
        placeholderClass: 'test-placeholder'
      });
      $ul.sortable('disable');
      $ul.sortable('enable');
    });

    it('should readd attributes to sortable', function(){
      var opts = $ul.data('opts');
      assert.equal($ul.attr('aria-dropeffect'), 'move');
    });

    it('should set handles to draggable = true', function(){
      var handle = $ul.find($ul.data('items')).first();
      assert.equal(handle.attr('draggable'), 'true');
    });

    it('should remove mousedown event', function(){
      var handle = $ul.find($ul.data('items')).first();
      assert.isDefined($._data(handle[0], 'events'));
      assert.isDefined($._data(handle[0], 'events').hasOwnProperty('mousedown'));
      assert.isDefined($._data(handle[0], 'events').hasOwnProperty('mousedown.h5s'));
    });

  });

});
