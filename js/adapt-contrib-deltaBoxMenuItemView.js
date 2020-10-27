define([
  'core/js/adapt',
  "core/js/views/menuItemView"
], function(Adapt, MenuItemView) {

  var DeltaBoxMenuItemView = MenuItemView.extend({

    events: {
      'click .js-btn-click' : 'onClickMenuItemButton'
    },

    preRender: function() {
      this.listenTo(Adapt, {
        "device:changed": this.resizeWidth
      });
    },

    postRender: function() {
      this.resizeWidth();
      this.$el.imageready(this.setReadyStatus.bind(this));
    },

    onClickMenuItemButton: function(event) {
      if (event && event.preventDefault) event.preventDefault();
      if (this.model.get('_isLocked')) return;
      Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
    },

    resizeWidth: function() {
      // Full width
      var deltaBoxMenu = this.model.getParent().get('_deltaBoxMenu');

      if (!deltaBoxMenu) return;
      if (deltaBoxMenu._fullwidth) {
        this.$('.menu__inner').addClass('full-width');
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

        $('.boxmenu-item').css('width', itemWidth + '%');
        $('.menu-item__inner').css({
          'margin-left': '2%',
          'margin-right': '2%'
        });
      } else {
        $('.menu-item').css('width', '100%');
        $('.menu-item__inner').css({
          'margin-left': '0%',
          'margin-right': '0%'
        });
      }
    }

  }, {
    className: 'boxmenu-item',
    template: 'deltaBoxMenuItem'
  });

  return DeltaBoxMenuItemView;

});
