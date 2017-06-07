define([
    'coreJS/adapt',
    'coreViews/menuView'
], function(Adapt, MenuView) {

    var BoxMenuView = MenuView.extend({

        events: {},

        postRender: function() {

          this.listenTo(Adapt, "device:resize", this.resizeHeight);

            var nthChild = 0;
            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable')) {
                    nthChild++;
                    item.set("_nthChild", nthChild);
                    this.$('.menu-container-inner').append(new BoxMenuItemView({model: item}).$el);
                }
            });

            this.resizeHeight();
        },

        resizeHeight: function() {
          this.resizeWidth();
          if (Adapt.device.screenSize === 'large') {
            var titleHeight = 0;
            var bodyHeight = 0;
            var numItems = $(".menu-container-inner > .menu-item").length;

            var titleArray = new Array();
            var bodyArray = new Array();

            for(var i=1; i<=numItems; i++) {
              titleArray[i] = $('.nth-child-'+i).find('.menu-item-title-inner').height();
              if(titleArray[i]>titleHeight) {
                titleHeight = titleArray[i];
              }
            }

            for(var i=1; i<=numItems; i++) {
              bodyArray[i] = $('.nth-child-'+i).find('.menu-item-body-inner').height();
              if(bodyArray[i]>bodyHeight) {
                bodyHeight = bodyArray[i];
              }
            }

            $('.menu-item').find('.menu-item-title-inner').css('min-height',titleHeight);
            $('.menu-item').find('.menu-item-body-inner').css('min-height',bodyHeight);

          } else {
            $('.menu-item').find('.menu-item-title-inner').css('min-height',0);
            $('.menu-item').find('.menu-item-body-inner').css('min-height',0);
          }
        },

        resizeWidth: function() {
          if(this.model.get("_deltaBoxMenu")._inRow != undefined || this.model.get("_deltaBoxMenu")._inRow != "") {
            var numInRow = this.model.get("_deltaBoxMenu")._inRow;
          } else {
            return;
          }

          var width = Math.floor(100 / numInRow);

          if (Adapt.device.screenSize === 'large') {
            $('.menu-item').css('width',width+'%');
            $('.menu-item-inner').css({
                'margin-left': '2%',
                'margin-right': '2%'
            });
          } else {
            $('.menu-item').css('width','100%');
            $('.menu-item-inner').css({
                'margin-left': '0%',
                'margin-right': '0%'
            });
          }
        }

    }, {
        template: 'deltaboxmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        events: {
            'click button' : 'onClickMenuItemButton'
        },

        className: function() {
            var nthChild = this.model.get("_nthChild");
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_classes'),
                this.model.get('_isVisited') ? 'visited' : '',
                this.model.get('_isComplete') ? 'completed' : '',
                this.model.get('_isLocked') ? 'locked' : '',
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
            if (!this.model.get('_isVisited')) {
                this.setVisitedIfBlocksComplete();
            }
        },

        postRender: function() {
            var graphic = this.model.get('_graphic');
            if (graphic && graphic.src && graphic.src.length > 0) {
                this.$el.imageready(_.bind(function() {
                    this.setReadyStatus();
                }, this));
            } else {
                this.setReadyStatus();
            }
        },

        setVisitedIfBlocksComplete: function() {
            var completedBlock = this.model.findDescendants('components').findWhere({_isComplete: true, _isOptional: false});
            if (completedBlock != undefined) {
                this.model.set('_isVisited', true);
            }
        },

        onClickMenuItemButton: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            if(this.model.get('_isLocked')) return;
            Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
        }

    }, {
        template: 'deltaboxmenu-item'
    });

    Adapt.on('router:menu', function(model) {
        $('#wrapper').append(new BoxMenuView({model: model}).$el);
    });

    Adapt.on('menuView:postRender', function(view) {

        var config = Adapt.course.get("_start");

        if (config && Adapt.location._currentId == config._isMenuDisabled) {
            $('.navigation-back-button').addClass('display-none');
        }

    });

});
