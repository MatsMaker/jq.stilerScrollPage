;(function($){

    $.fn.lisaSliderPage = function(options){
        var lspThat = this;
        var opt = {
            speed: 7000,
            cl: {
                idSliderMenu: 'lsp-main-slider-menu',
                idContentWrap: 'main_contetnt_wrap',
                idHeader: 'lsp-header',
                mainContentWrap: 'lsp-main_contetnt_wrap',
                sliderItem: 'lsp-content_slide',
                clActive: 'active',
                nochangeHeightSlider: 'lsp-fixHeight'
            },
            speedAnim: 800,
            initialAnim: true,
            startingAnimHeight: 100,
            speedInitialAnim: 700,
            delayInitialAnim: 900,
            hangInitialAnim: 300,
            overlayInitialAnim: 40,
            initialSlider: 0,
            speedScrollSlider: 20
        };
        $.extend(opt, options);
        var api;

        var page = lspThat;  // set to the main content of the page

        var $obj;
        var model;

        var addedListeningEvent = function(){
            $(window).unbind('mousewheel').mousewheel(function(event, delta, deltaX, deltaY) {
                model.notScrolled = false;
                var curentSlider = model.getCurentSlider();

                if( curentSlider.$html.hasClass(opt.cl.nochangeHeightSlider) ){
                    scrollSlider(curentSlider, event, delta);
                }else{
                    if (delta < 0 && !model.getCurentSlider().isTheLatest()) {
                        var nextSlider = model.activeSlider + 1;
                        animaChangeSliders(nextSlider);
                    }
                    else if (delta > 0 && !model.getCurentSlider().isTheFirst()) {
                        var nextSlider = model.activeSlider - 1;
                        animaChangeSliders(nextSlider);
                    }
                }
            });
            $(window).unbind('resize')
            .bind('resize', function(){
                  initialization({
                    curentSlider: model.activeSlider
                });
            });
        };

        var scrollSlider = function(curentSlider, event, delta){
            var changeSlider = function(){
                if (delta < 0 && !model.getCurentSlider().isTheLatest()) {
                    var nextSlider = model.activeSlider + 1;
                    animaChangeSliders(nextSlider);
                }
                else if (delta > 0 && !model.getCurentSlider().isTheFirst()) {
                    var nextSlider = model.activeSlider - 1;
                    animaChangeSliders(nextSlider);
                }
            }

            var chagnePosition = function(){
                curentSlider.$html.css({
                    'top': '+='+(event.deltaY*opt.speedScrollSlider)
                });
            }

            if(delta < 0){
                if( model.heightSlider <= curentSlider.$html.position().top + curentSlider.getHeight() + event.deltaY*opt.speedScrollSlider){
                    chagnePosition();
                }else{
                    changeSlider()
                }
            }else if(delta > 0){
                if( curentSlider.$html.position().top < 0 ){
                    chagnePosition();
                }else{
                    changeSlider()
                }
            }
        };

        var animaChangeSliders =function(numberAtSlider){

            var endAnimChange = function(){
                model.animatingScrolling = false;
                model.activeSlider = numberAtSlider;

                $(model.$html.menuItems).removeClass(opt.cl.clActive);
                $(model.$html.menuItems[numberAtSlider]).addClass(opt.cl.clActive);
            }

            var animOverlay = function(speedAnim, callBack){
                model.animatingScrolling = true;
                if (speedAnim === undefined){
                    var speedAnim = opt.speedAnim;
                }

                var endRunFunction = function(){
                    endAnimChange();

                    var curentSlider = model.getCurentSlider();
                    curentSlider.$html.css({'height':model.heightContent});
                    curentSlider.$html.addClass(opt.cl.clActive);

                    if(callBack !== undefined){
                      callBack();  
                    }
                    console.log('curent slider ' +model.getCurentSlider().number);
                }

                var changeSlider = function(nexSlider){

                    var animNexSlider = function(){
                        nexSlider.$html.css({
                            'position' : 'absolute',
                            'z-index': '3',
                            'top': model.heightSlider,
                            'display': 'block'
                        });

                        var beforeNextSliders = model.getCurentSlider();
                        beforeNextSliders.$html.css({
                            'position' : 'absolute',
                            'z-index': '2',
                            'top': 0,
                            'display': 'block'
                        })   

                        nexSlider.$html.animate({
                            top: 0
                        },{
                            duration: speedAnim,
                            easing: 'linear',
                            complete: endRunFunction
                        })
                    }

                    var animBackSlider = function(){
                        var fixHeightBachSlider = function(){
                            if(nexSlider.getHeight() < beforeNextSliders.$html.position().top){
                                nexSlider.$html.css({'height': beforeNextSliders.$html.position().top});
                            }
                        };

                        var startTop = nexSlider.$html.position().top;
                        nexSlider.$html.css({
                            'position' : 'absolute',
                            'z-index': '2',
                            'top': 0,
                            'display': 'block'
                        });

                        var beforeNextSliders = model.getSlider(nexSlider.number + 1);
                        beforeNextSliders.$html.css({
                            'position' : 'absolute',
                            'z-index': '3',
                            'top': 0,
                            'display': 'block'
                        })   

                        model.getCurentSlider().$html.animate({
                            top: model.heightSlider
                        },{
                            duration: speedAnim,
                            easing: 'linear',
                            step: fixHeightBachSlider,
                            complete: endRunFunction
                        })
                    }

                    model.sliderItems.forEach(function(slider, sIndex, sArray){
                        slider.$html.css({
                            'z-index': '1',
                            'display': 'none',
                            'position' : 'absolute',
                            'top': model.heightContent
                        });
                        slider.$html.removeClass(opt.cl.clActive);
                    });

                    if(model.getCurentSlider().number < nexSlider.number){
                        animNexSlider();
                    }else{
                        animBackSlider();
                    }
                }; 
                
                if( ( model.activeSlider < numberAtSlider ) && model.activeSlider+1 < model.numberSliders){
                    var nexSlider = model.getSlider(model.activeSlider + 1);
                    changeSlider(nexSlider);
                }else{
                    /*if(model.activeSlider !== 0 && model.activeSlider+1 < model.numberSliders){*/
                        var nexSlider = model.getSlider(model.activeSlider - 1);
                        changeSlider(nexSlider);
                    /*}else if(model.activeSlider+1 === model.numberSliders){
                        console.log('scrolling last slider');
                    }else{
                        return false;
                    }*/
                }
            }

            var animCompression = function(callBack){
                model.animatingScrolling = true;

                var curentSlider = model.getCurentSlider();
                curentSlider.$html.animate({height: curentSlider.heightContent}, {
                    duration: opt.speedAnim/2,
                    easing: 'linear',
                    complete: animOverlay(opt.speedAnim/2)
                });
            }
            
            var animExpulsion = function(callBack){
                endAnimChange();
                if(callBack !== undefined){
                    callBack();  
                }
            }

            if(!model.animatingScrolling){
                if(!model.getCurentSlider().isTheFirst()){
                    animOverlay();
                }else if(model.getCurentSlider().isTheFirst()){
                    animCompression();
                }else if(model.getCurentSlider().isTheLatest()){
                    animExpulsion();
                }
            }else{
                return false
            }
        };

        var  initialization = function(startOptions){
            var startOpt = {
                startAnim: true,
                curentSlider: opt.initialSlider
            }
            $.extend(startOpt, startOptions);

            $obj = {
                main: lspThat,
                sliderMenu: lspThat.find('.'+opt.cl.idSliderMenu),
                header: lspThat.find('#'+opt.cl.idHeader),
                body: $('body'),
                menuItems: lspThat.find('.'+opt.cl.idSliderMenu+' a'),
                sliderItems: $('#'+opt.cl.idContentWrap+' '+'.'+opt.cl.sliderItem),
                mainContentWrap: lspThat.find('.'+opt.cl.mainContentWrap)
            };

            var compilingSliderItems = function($arrSliders){
                var newArrSliders = [];

                var sumHeight = function($arrEl){
                    var result = 0;
                    $arrEl.each(function(ind, el){
                        result = result + $(el).outerHeight();
                    });
                    return result;
                };

                $arrSliders.each(function(sliderIndex, slider){
                    var $slider = $(slider);
                    var Slider = function(){
                            this.$html = $slider;
                            this.number = sliderIndex,
                            this.heightContent = sumHeight($slider.children());
                            this.baseHeight = $slider.outerHeight();
                            this.getHeight = function(){
                                return this.$html.outerHeight();
                            };
                            this.isTheLatest = function(){
                                if(sliderIndex+1 === $arrSliders.length){
                                    return true;
                                }else{
                                    return false;
                                }
                            };
                            this.isTheFirst = function(){
                                if(sliderIndex === 0){
                                    return true;
                                }else{
                                    return false;
                                }
                            }
                        };
                    newArrSliders.push(new Slider);
                });

                return newArrSliders
            }

            var ModelLSP = function($obj){
                var mlsp = this;
                mlsp.notScrolled = startOpt.startAnim;
                mlsp.$html = $obj,
                mlsp.animatingScrolling = false;
                mlsp.heightPage = $obj.main.outerHeight();
                mlsp.heightHeader = $obj.header.outerHeight();
                mlsp.heightSlider = $obj.main.outerHeight() - $obj.header.outerHeight();
                mlsp.activeSlider = startOpt.curentSlider;
                mlsp.numberSliders = $obj.sliderItems.length;
                mlsp.sliderItems = compilingSliderItems($obj.sliderItems);
                mlsp.getCurentSlider = function(){
                    return mlsp.sliderItems[mlsp.activeSlider];
                };
                mlsp.getSlider = function(number){
                    return mlsp.sliderItems[number];
                }
            };
            model = new ModelLSP($obj);

            var setHeightForSliders = function(arrSliders){
                var lenghtArrSliders = arrSliders.length;
                arrSliders.each(function(indxSlider, slider){
                    if(!$(slider).hasClass(opt.cl.nochangeHeightSlider)){
                        if(indxSlider !== 0){
                            $(slider).css('height', model.heightSlider); 
                       }else{
                            if(!opt.initialAnim){
                                var elHeight = model.heightSlider;
                            }else{
                                var elHeight = model.heightSlider - opt.overlayInitialAnim;
                            }
                            $(slider).css('height', elHeight); 
                       }
                    }
                });
            }

            var initialAnim = function(el, animHeight){
                var el = $(el);
                var speedInitialAnim = opt.speedInitialAnim / 2;
                var startHeight = el.outerHeight();
                var endHeight = startHeight - animHeight;

                var feedBack = function(){
                    var animate = function(){
                        el.animate({height: "+="+animHeight},speedInitialAnim);
                    }
                    setTimeout(animate, opt.hangInitialAnim);
                }
                function startAnim() {
                    if(model.notScrolled){
                        el.animate({height: "-="+animHeight}, {
                            duration: speedInitialAnim,
                            complete: feedBack
                        });
                    } 
                }
                setTimeout(startAnim, opt.delayInitialAnim);
            };

            model.sliderItems[model.activeSlider].$html.addClass(opt.cl.clActive);
            model.$html.mainContentWrap.css({'height': model.heightSlider});
            setHeightForSliders($obj.sliderItems);

            if(opt.initialAnim && model.notScrolled){
                initialAnim($obj.sliderItems[0], opt.startingAnimHeight);
            }
            model.sliderItems.forEach(function(slider, sIndex, sArray){
                if(slider.number !== model.getCurentSlider().number){
                    slider.$html.css({
                        'z-index': '1',
                        'display': 'none',
                        'position' : 'absolute',
                        'top': model.heightContent
                    });
                    slider.$html.removeClass(opt.cl.clActive);
                };
                if(slider.number === model.getCurentSlider().number+1){
                    slider.$html.css({
                        'z-index': '1',
                        'display': 'block',
                        'position' : 'absolute',
                        'top': model.heightContent - opt.overlayInitialAnim
                    })
                };
                if(slider.number === model.getCurentSlider()){
                    slider.$html.addClass(opt.cl.clActive);
                }
            });

            addedListeningEvent();
        };

        api = {
            init: initialization,
            goSlide: animaChangeSliders,
            getModel: function(){ return model }
        }

        return api;
    }

})(jQuery);


var sliderPage;
$(document).ready(function() {
    sliderPage = $('#lsp-main_wrap').lisaSliderPage({
        // initialAnim: false
    });
    sliderPage.init();
});