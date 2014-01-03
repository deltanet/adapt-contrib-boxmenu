define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');
    var MenuView = require('coreViews/menuView');
    
    var BoxMenuView = MenuView.extend({

        preRender: function() {
            this.$el.css('opacity', 0);
            this.listenTo(this.model, 'change:_isReady', this.isReady);
            $('.loading').fadeIn('fast');
        },
        
        postRender: function() {
            var nthChild = 0;
            this.model.getChildren().each(function(item) {
                if(item.get('_isAvailable')) {
                    nthChild ++;
                    this.$('.menu-inner').append(new BoxMenuItemView({model:item, nthChild:nthChild}).$el);
                }
            });

        },
        
        isReady: function() {
            _.defer(_.bind(function() {
                $('.loading').hide();
                this.$el.animate({'opacity': 1}, 'fast');
                Adapt.trigger('menuView:ready');
            }, this));
        }

    }, {
        template:'boxmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        className: function() {
            return 'menu-item ' 
            + 'menu-item-' 
            + this.model.get('_id') 
            + " nth-child-" 
            + this.options.nthChild;;
        },

        events: {
            'click a':'clickItem'
        },

        clickItem: function() {
            this.model.set('_isVisited', true);
        },

        preRender: function() {
        },

        postRender: function() {
            this.$el.imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        }

    }, {
        template:'boxmenu-item'
    });
    
    Adapt.on('router:menu', function(model) {
        $('#wrapper').append(new BoxMenuView({model:model}).$el);
    });
    
    /*Adapt.on('router:menu', function(id) {
        var currentModel = Adapt.contentObjects.findWhere({_id:id});
        new BoxMenuView({model:currentModel});
    });*/
    
});