$(document).ready(function(){
    init(this);

    $(window).resize(function(e){
        var windowWidth = $(this).width();

        if(windowWidth > 1024){
            $('#side').show();
        }else{
            $('#side').hide();
            $('#side').css('height',$(document).height());
        }

    });

    $('#header-menu').on('click',function(e){
        $('#side').toggle('fast');
    });

    $('#side').on('click',function(e){
        $('#side').toggle('fast');
    })

    $('#side-wrap').on('click',function(e){
        e.stopPropagation();
    })

    $('.menu').on('click',function(e){
        $('.menu').removeClass('menu-on');

        $(this).addClass('menu-on');
    });

});


function init(args){
    $nav = $('.menu-items[name="'+nav+'"]');

    $nav.parents(".menu").addClass("menu-on");
    $nav.addClass("menu-items-on");

    $('#side').css('height',$(args).height());
}