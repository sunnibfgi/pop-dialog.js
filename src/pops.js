//pops.js
;(function() {
  'use strict';

  function popDialog(el, options) {
    if (!(this instanceof popDialog)) {
      return new popDialog(el, options)
    }
    this.el = el
    this.body = $(document.body)
    this.window = $(window)
    this.fullHeight = 0
    this.options = $.extend({}, this.options)
    $.extend(!0, this.options, options)
    this.init()
  }
  popDialog.prototype = {
    constructor: popDialog,
    options: {
      overlay: '#overlay-layer',
      showCallback: function() {},
      hideCallback: function() {}
    },
    init: function() {
      var $this = this.el
      this.body.on('click', $.proxy(function(e) {
        this.clickHandler($this, e)
      }, this))
    },
    resizeHeight: function(uid) {
      var overlay = this.options.overlay;
      this.window.on('resize', $.proxy(function() {
        this.fullHeight = this._fullHeight()
        if (uid && !$(overlay).hasClass('hide')) {
          $(this.options.overlay).css({
            height: this.fullHeight
          })
        }
      }, this))
    },
    _fullHeight: function() {
      return this.body.height() > this.window.height() ? this.body.height() : this.window.height()
    },
    clickHandler: function(el, e) {
      var target = e.target
      if (target == el[0]) {
        e.preventDefault()
        $.each(el, $.proxy(function(i, el) {
          this.show()
        }, this))
      }
      if ($(target).closest(this.options.overlay).length || $(target).data('close') != undefined) {
        e.preventDefault()
        this.hide()
      }
    },
    setOverlay: function(uid) {
      var overlay = this.options.overlay;
      this.fullHeight = !uid ? 0 : this._fullHeight()
      $(overlay).css({
        position: 'absolute',
        width: '100%',
        top: 0,
        height: this.fullHeight
      })[uid ? 'removeClass' : 'addClass']('hide')
    },
    adjustPosition: function() {
      var $this = this.el
      var id = $this.data('id')
      var idElement = $('#' + id)
      var width = idElement.outerWidth()
      var height = idElement.outerHeight()
      idElement.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginLeft: '-' + width / 2 + 'px',
        marginTop: '-' + height / 2 + 'px',
        zIndex: 100000000000000000
      })
    },
    show: function() {
      var $this = this.el
      var id = $('#' + $this.data('id'))
      id.removeClass('hide')
      this.setOverlay(1)
      this.resizeHeight(1)
      this.adjustPosition()
      this.options.showCallback.call(this, id, this)
    },
    hide: function() {
      var $this = this.el
      var id = $('#' + $this.data('id'))
      id.addClass('hide')
      this.setOverlay(0)
      this.fullHeight = 0
      this.options.hideCallback.call(this, id, this)
    }
  }
  $.fn.popDialog = function(options) {
    return this.each(function() {
      var $this = $(this)
      popDialog($this, options)
    })
  }
  window.popDialog = popDialog
})()