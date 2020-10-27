define([
  'core/js/adapt',
  'core/js/views/menuView',
  './adapt-contrib-deltaBoxMenuItemView'
], function(Adapt, MenuView, DeltaBoxMenuItemView) {

  var DeltaBoxMenuView = MenuView.extend({

    initialize: function() {
      MenuView.prototype.initialize.apply(this);

      this.listenTo(Adapt, {
        'device:changed': this.onDeviceResize
      });
    },

    onDeviceResize: function() {
      this.setStyles();
    },

    setStyles: function() {
      this.model.set('_deltaBoxMenuConfig', Adapt.course.get('_deltaBoxMenu'));

      this.setBackgroundImage();
      this.setBackgroundStyles();
      this.processHeader();
    },

    setBackgroundImage: function() {
      var config = this.model.get('_deltaBoxMenuConfig');
      var backgroundImages = config && config._backgroundImage;

      if (!backgroundImages) return;

      var backgroundImage;

      switch (Adapt.device.screenSize) {
        case 'large':
          backgroundImage = backgroundImages._large;
          break;
        case 'medium':
          backgroundImage = backgroundImages._medium;
          break;
        default:
          backgroundImage = backgroundImages._small;
      }

      if (backgroundImage) {
        this.$el
          .addClass('has-bg-image')
          .css('background-image', 'url(' + backgroundImage + ')');
      } else {
        this.$el
          .removeClass('has-bg-image')
          .css('background-image', '');
      }
    },

    setBackgroundStyles: function() {
      var config = this.model.get('_deltaBoxMenuConfig');
      var styles = config && config._backgroundStyles;

      if (!styles) return;

      this.$el.css({
        'background-repeat': styles._backgroundRepeat,
        'background-size': styles._backgroundSize,
        'background-position': styles._backgroundPosition
      });
    },

    processHeader: function() {
      var config = this.model.get('_deltaBoxMenuConfig');
      var header = config && config._menuHeader;

      if (!header) return;

      var $header = this.$('.menu__header');

      this.setHeaderBackgroundImage(header, $header);
      this.setHeaderBackgroundStyles(header, $header);
      this.setHeaderMinimumHeight(header, $header);
    },

    setHeaderBackgroundImage: function(config, $header) {
      var backgroundImages = config._backgroundImage;

      if (!backgroundImages) return;

      var backgroundImage;

      switch (Adapt.device.screenSize) {
        case 'large':
          backgroundImage = backgroundImages._large;
          break;
        case 'medium':
          backgroundImage = backgroundImages._medium;
          break;
        default:
          backgroundImage = backgroundImages._small;
      }

      if (backgroundImage) {
        $header
          .addClass('has-bg-image')
          .css('background-image', 'url(' + backgroundImage + ')');
      } else {
        $header
          .removeClass('has-bg-image')
          .css('background-image', '');
      }
    },

    setHeaderBackgroundStyles: function(config, $header) {
      var styles = config._backgroundStyles;

      if (!styles) return;

      $header.css({
        'background-repeat': styles._backgroundRepeat,
        'background-size': styles._backgroundSize,
        'background-position': styles._backgroundPosition
      });
    },

    setHeaderMinimumHeight: function(config, $header) {
      var minimumHeights = config._minimumHeights;
      if (!minimumHeights) return;

      var minimumHeight;

      switch (Adapt.device.screenSize) {
        case 'large':
          minimumHeight = minimumHeights._large;
          break;
        case 'medium':
          minimumHeight = minimumHeights._medium;
          break;
        default:
          minimumHeight = minimumHeights._small;
      }
      if (minimumHeight) {
        $header
          .addClass('has-min-height')
          .css('min-height', minimumHeight + 'px');
      } else {
        $header
          .removeClass('has-min-height')
          .css('min-height', '');
      }
    }

  }, {
    childView: DeltaBoxMenuItemView,
    className: 'deltaboxmenu',
    template: 'deltaBoxMenu'
  });

  Adapt.on('router:menu', function(model) {
    $('#wrapper').append(new DeltaBoxMenuView({
      model: model
    }).$el);
  });

});
