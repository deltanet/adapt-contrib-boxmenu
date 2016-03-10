define([
    'coreJS/adapt',
    'coreViews/menuView'
], function(Adapt, MenuView) {

    var BoxMenuView = MenuView.extend({

        events: {},

        postRender: function() {
            var nthChild = 0;
            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable')) {
                    nthChild++;
                    item.set("_nthChild", nthChild);
                    this.$('.menu-container-inner').append(new BoxMenuItemView({model: item}).$el);
                }
            });
        }
    }, {
        template: 'boxmenu'
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
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
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

        onClickMenuItemButton: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
        }

    }, {
        template: 'boxmenu-item'
    });


    var BoxMenuAudioView = Backbone.View.extend({

        className: 'boxmenu-audio',

        initialize: function() {

            this.listenTo(Adapt, 'audio:updateAudioStatus', this.updateToggle);

            this.render();
        },

        events: {
            'click .audio-toggle': 'toggleAudio'
        },

        render: function() {
            var data = this.model.toJSON();
            var template = Handlebars.templates["boxmenu-audio"];
            if(this.model.get("_audio") && this.model.get("_audio")._isEnabled){
                this.$el.html(template(data)).appendTo('.menu-header-inner');

                this.audioChannel = this.model.get('_audio')._channel;
                this.elementId = this.model.get("_id");

                // Hide controls
                if(this.model.get('_audio')._showControls==false){
                    this.$('.audio-toggle').addClass('hidden');
                }
                try {
                    this.audioFile = this.model.get("_audio")._media.src;
                } catch(e) {
                    console.log('An error has occured loading audio');
                }
                // Hide audio icon if config.JSON audio is false
                if (Adapt.config.get("_audio") && Adapt.config.get("_audio")._isEnabled) {
                    // Do nothing
                } else {
                    this.$('.audio-inner').css('display', 'none');
                }

                // Hide icon if audio is turned off
                if(Adapt.audio.audioClip[this.audioChannel].status==0){
                    this.$('.audio-toggle').addClass('hidden');
                }

                // Set clip ID
                Adapt.audio.audioClip[this.audioChannel].newID = this.elementId;
                // Set listener for when clip ends
                $(Adapt.audio.audioClip[this.audioChannel]).on('ended', _.bind(this.onAudioEnded, this));

                // Check if audio is set to on
                if(Adapt.audio.audioClip[this.audioChannel].status==1){
                    // Check if audio is set to autoplay
                    if(this.model.get("_audio")._isEnabled && this.model.get("_audio")._autoplay){
                        Adapt.trigger('audio:playAudio', this.audioFile, this.elementId, this.audioChannel);
                    }
                }
            }
            return this;
        },

        onAudioEnded: function() {
            Adapt.trigger('audio:audioEnded', this.audioChannel);
        },

        toggleAudio: function(event) {
            if (event) event.preventDefault();
 
            if ($(event.currentTarget).hasClass('playing')) {
                Adapt.trigger('audio:pauseAudio', this.audioChannel);
            } else {
                Adapt.trigger('audio:playAudio', this.audioFile, this.elementId, this.audioChannel);
            }
        },

        updateToggle: function(){
            console.log("updateToggle");
            if(Adapt.audio.audioStatus == 1 && this.model.get('_audio')._showControls==true){
                this.$('.audio-toggle').removeClass('hidden');
            } else {
                this.$('.audio-toggle').addClass('hidden');
            }
        }

    });

    Adapt.on('router:menu', function(model) {
        $('#wrapper').append(new BoxMenuView({model: model}).$el);
    });
    
    Adapt.on('menuView:postRender', function(view) {
        
        var config = Adapt.course.get("_start");
        
        if (Adapt.location._currentId == config._menuPage) {
            $('.navigation-back-button').addClass('display-none');
        }
        
    });

    Adapt.once('router:menu', function(pageModel) {
        new BoxMenuAudioView({model:pageModel});
    });

});
