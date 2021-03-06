//pop-dialog.js

;(function($, undefined) {
  'use strict';

  function popDialog(el, options) {
    if (!(this instanceof popDialog)) {
      return new popDialog(el, options)
    }
    this.el = el
    this.body = $(document.body)
    this.window = $(window)
    this.fullHeight = this.fullWidth = 0
    this.timer = null
    this.options = $.extend({}, this.options)
    $.extend(!0, this.options, options)
    this.init()
  }

  popDialog.prototype = {
      constructor: popDialog,
      options: {
        overlay: $('<div id="overlay-layer" class="overlay-layer"></div>'),
        zindex: 10000,
        maxHeight: 200,
        hasScroll: false,
        closeZone: 'all',
        showCallback: function() {},
        hideCallback: function() {}
      },

      init: function() {
        var $el = this.el
        $(document).on('click touchstart', $.proxy(function(e) {
          this.clickHandler($el, e)
        }, this))
      },

      resizeElement: function(uid) {
        var overlay = this.options.overlay
        this.fullHeight = this._fullHeight()
        this.fullWidth = this._fullWidth()
        if (uid && !$(overlay).hasClass('hide')) {
          this.timer && clearTimeout(this.timer)
          this.timer = setTimeout($.proxy(function() {
            $(overlay).css({
              height: this.fullHeight,
              width: this.fullWidth
            })
            this.adjustPosition()
          }, this), 2e1)
        }
      },

      resizeHandler: function(uid) {
        this.window.on('resize', $.proxy(function() {
          this.resizeElement(uid)
        }, this))
      },

      _fullHeight: function() {
        return Math.max(this.window.height(), this.body[0].scrollHeight)
      },
      _fullWidth: function() {
        return Math.max(this.window.width(), this.body[0].scrollWidth)
      },

      clickHandler: function(el, e) {
        var target = $(e.target)
        if (el === undefined) return;
        if (target.closest(el).length) {
          e.preventDefault()
          $.each(el, $.proxy(function(i, el) {
            this.show()
            this.options.showCallback.apply(this, [$(el), $('#' + $(el).data('id')), this])
            this.$el = $(el)
          }, this))
        }

        if ((target.closest(this.options.overlay).length &&
            this.options.closeZone === 'all') ||
          target.data('close') != undefined) {
          e.preventDefault()
          if (this.$el) {
            this.hide()
            this.options.hideCallback.apply(this, [this.$el, $('#' + this.$el.data('id')), this])
            delete this.$el
          }
        }
      },

      setOverlay: function(uid) {
        var overlay = this.options.overlay;
        this.fullHeight = !uid ? 0 : this._fullHeight()
        this.fullWidth = !uid ? 0 : this._fullWidth()
        overlay.css({
            position: 'absolute',
            zIndex: this.options.zindex,
            width: this.fullWidth,
            top: 0,
            left: 0,
            height: this.fullHeight
          })[uid ? 'removeClass' : 'addClass']('hide')
          .appendTo(this.body)
      },

      adjustPosition: function() {
        var $el = this.el
        var idElement = $('#' + $el.data('id'))
        var width = idElement['outerWidth' in $.fn ? 'outerWidth' : 'width']()
        var height, effect
        if (!this.options.hasScroll) {
          height = Math.max(idElement[0].scrollHeight, idElement['outerHeight' in $.fn ? 'outerHeight' : 'height']())
          effect = 'inherit'
        } else {
          height = Math.min(Math.max(idElement[0].scrollHeight, idElement['outerHeight' in $.fn ? 'outerHeight' : 'height']()), this.options.maxHeight)
          effect = 'auto'
        }

        idElement.css({
          position: 'fixed',
          top: (this.window.height() - height) / 2 + 'px',
          left: (this.window.width() - width) / 2 + 'px',
          height: height + 'px',
          width: width + 'px',
          zIndex: this.options.zindex + 1,
          'overflow-y': effect
        })
      },

      show: function() {
        var $el = this.el
        var id = $('#' + $el.data('id'))
        id.removeClass('hide')
        this.setOverlay(1)
        this.resizeHandler(1)
        this.adjustPosition()
        this.originalHeight = id['outerHeight' in $.fn ? 'outerHeight' : 'height']()
      },

      hide: function() {
        var $el = this.el
        var id = $('#' + $el.data('id'))
        id.addClass('hide').css({
          height: this.originalHeight + 'px'
        })
        this.setOverlay(0)
        this.fullHeight = this.fullWidth =0
        
      }
    }
    //transport jQuery or Zepto plugin
    $.fn.popDialog = function(options) {
      return this.each(function() {
        var $this = $(this)
        popDialog($this, options)
      })
    }
    //transport global
  window.popDialog = popDialog

})(window.jQuery || window.Zepto)
