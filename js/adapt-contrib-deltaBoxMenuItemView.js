define([
  'core/js/adapt',
  'core/js/views/menuItemView'
], function(Adapt, MenuItemView) {

  var DeltaBoxMenuItemView = MenuItemView.extend({

    events: {
      'click .js-btn-click' : 'onClickMenuItemButton'
    },

    preRender: function() {
      this.listenTo(Adapt, {
        'device:resize': this.onDeviceResize
      });
    },

    postRender: function() {
      this.onDeviceResize();
      this.$el.imageready(this.setReadyStatus.bind(this));
    },

    onClickMenuItemButton: function(event) {
      if (event && event.preventDefault) event.preventDefault();
      if (this.model.get('_isLocked')) return;
      Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
    },

    onDeviceResize: function() {
      this.resizeWidth();

      if (Adapt.device.screenSize === 'large') {
        var titleHeight = 0;
        var bodyHeight = 0;
        var $container = $('.js-children');

        $container.find('.menu-item__title-inner').each(function() {
          if ($(this).height() > titleHeight) {
            titleHeight = $(this).height();
          }
        });

        $container.find('.menu-item__body-inner').each(function() {
          if ($(this).height() > bodyHeight) {
            bodyHeight = $(this).height();
          }
        });

        $('.menu-item').find('.menu-item__title').css('min-height',titleHeight);
        $('.menu-item').find('.menu-item__body').css('min-height',bodyHeight);

      } else {
        $('.menu-item').find('.menu-item__title').css('min-height',0);
        $('.menu-item').find('.menu-item__body').css('min-height',0);
      }
    },

    resizeWidth: function() {
      // Full width
      var deltaBoxMenu = this.model.getParent().get('_deltaBoxMenu');

      if (!deltaBoxMenu) return;
      if (deltaBoxMenu._fullwidth) {
        $('.deltaboxmenu').addClass('is-full-width');
      }

      if (deltaBoxMenu._inRow != undefined || deltaBoxMenu._inRow != "") {
        var numInRow = deltaBoxMenu._inRow;
      } else {
        return;
      }

      var width = 100 / numInRow;
      // Round down to one decimal place
      var itemWidth = Math.floor(width * 10) / 10;

      if (Adapt.device.screenSize === 'large') {

        $('.menu-item').css('width', itemWidth + '%');
        $('.menu-item__inner').css({
          'margin-left': '2%',
          'margin-right': '2%'
        });
      } else {
        $('.menu-item').css('width', '100%');
        $('.menu-item__inner').css({
          'margin-left': '',
          'margin-right': ''
        });
      }
    }
  }, {
    className: 'deltaboxmenu-item',
    template: 'deltaBoxMenuItem'
  });

  return DeltaBoxMenuItemView;

});
