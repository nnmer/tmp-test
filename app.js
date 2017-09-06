function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var routePath     = [];
var cellsElements = [];
var matrix        = null;
var $draggingContainer = null;
var lastMousePos  = {
    x: 0,
    y: 0
}

window.onload = function(){
    var str = '';
    for(var i=0;i<globalConfig.frameSizeX;i++){
        str += '<div class="row" id="row-'+i+'">';
        for(j=0;j<globalConfig.frameSizeY;j++){
            var color = getRandomInt(1,globalConfig.colorsTotal);
            str += '<div class="cell-wrapper"><div data-xy="'+(i+'-'+j)+'" class="cell color-'+color+'"></div></div>';
        }

        str += '</div>';
    }
    $('#matrix').append(str);


    cellsElements = document.getElementsByClassName('cell');
    matrix        = document.getElementById('matrix');
    $draggingContainer = $('#dragging');
};


// the original idea of drag and drop was taken from http://www.webreference.com/programming/javascript/mk/column2/index.html
// but then was heavily modified.


var mouseOffset = null;
var isMouseDown = false;
var lMouseState = false;

var $curTarget  = null;
var lastTarget  = null;

Number.prototype.NaN0=function(){return isNaN(this)?0:this;}


function getPosition(e){
    var left = 0;
    var top  = 0;
    while (e.offsetParent){
        left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
        top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);
        e     = e.offsetParent;
    }


    left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
    top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);

    return {x:left, y:top};

}

function mouseCoords(ev){
    if(ev.pageX || ev.pageY){
        return {x:ev.pageX, y:ev.pageY};
    }
    return {
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:ev.clientY + document.body.scrollTop  - document.body.clientTop
    };
}


function getMouseOffset(target, ev){
    ev = ev || window.event;

    var docPos    = getPosition(target);
    var mousePos  = mouseCoords(ev);
    return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

function mouseMove(ev){
    ev         = ev || window.event;

    /*
     We are setting target to whatever item the mouse is currently on
     Firefox uses event.target here, MSIE uses event.srcElement
     */
    var target   = ev.target || ev.srcElement;
    var mousePos = mouseCoords(ev);

    mouseOffset   = getMouseOffset(target, ev);
    // console.log('event: mouse move '+ JSON.stringify(mousePos));



    // if the mouse was moved over an element that is draggable
    if (isMouseDown) {
        // if the user is just starting to drag the element
        if (isMouseDown && !lMouseState) {
            console.log(target, 'Start Dragging');

            $curTarget = $(target);

            $draggingContainer.html('').append($curTarget.clone(true)).css('opacity', 1);
            routePath.push($curTarget.data('xy'));

        }


        // If we get in here we are dragging something
        if ($curTarget !== undefined && $curTarget && $curTarget.data('xy')) {

            $draggingContainer.css('top', mousePos.y+10);
            $draggingContainer.css('left', mousePos.x+10);

            $target = $(target);
            // console.log('----------------');
            // console.log($target);
            // console.log($curTarget);
            // console.log('================');
            // $ce = $('[data-xy="'+curTarget.getAttribute('data-xy')+'"');
            if ($target.data('xy')) {
                var targetCoord = $target.data('xy').split('-');
                var curTargetCoord = $curTarget.data('xy').split('-');
                if ($target.data('xy') != $draggingContainer.first().data('xy')
                    && !(Math.abs(targetCoord[0] - curTargetCoord[0]) >= 1 && Math.abs(targetCoord[1] - curTargetCoord[1]) >= 1)
                    && (Math.abs(targetCoord[0] - curTargetCoord[0]) == 1 || Math.abs(targetCoord[1] - curTargetCoord[1]) == 1)) {

                    $tmpClasses = $curTarget.attr('class');
                    $tmpXY      = $curTarget.data('xy');
                    $tmpOpacity = $curTarget.css('opacity');
                    $curTarget.attr('class',$target.attr('class'));
                    $curTarget.attr('data-xy',$target.data('xy'));
                    $curTarget.css('opacity',$target.css('opacity'));
                    $target.attr('class',$tmpClasses);
                    $target.attr('data-xy',$tmpXY);
                    $target.css('opacity',$tmpOpacity);

                    $curTarget = $target;
                    curTarget  = target;

                    routePath.push($target.data('xy'));
                }
            }
        }
    }

    // track the current mouse state so we can compare against it next time
    lMouseState = isMouseDown;

    // mouseMove target
    lastTarget  = target;

    lastMousePos = mousePos;

    // this prevents items on the page from being highlighted while dragging
    if($curTarget ) return false;
}

function mouseUp(ev){
    console.log('event: mouse up ');
    $curTarget = null;

    isMouseDown = false;
    lMouseState = false;

    // console.log(routePath);
    $('#route-print').html(routePath.join(' => '));

    var resultCoordMatrix = {};
    for (var i=0; i<globalConfig.frameSizeY; i++) {
        row = {};
        for (var j=0; j<globalConfig.frameSizeX; j++) {
            row[j] = '';
        }
        resultCoordMatrix[i] = row;
    }


    setTimeout(function(){
        $('.cell').each(function(e){
            coord = $(this).data('xy').split('-');
            resultCoordMatrix[coord[1]+''][coord[0]+''] = $(this).css('background-color');
        })

        match3.set('piecesX',globalConfig.frameSizeX);
        match3.set('piecesY',globalConfig.frameSizeY);
        match3.setPieces(resultCoordMatrix);
        printMatches(match3.getMatches());

    },200);

    $draggingContainer.html('');
    $('.cell').css('opacity',1);
}

function mouseDown(ev){
    ev         = ev || window.event;
    var target = ev.target || ev.srcElement;

    if ($(target).closest('#matrix').length == 0){
        return true;
    }


    target.style.opacity = 0.3;

    routePath = [];
    $('#matrix-matches').html('');

    console.log('event: mouse down on element '+ JSON.stringify(target));

    isMouseDown = true;

    if(target.onmousedown){
        return false;
    }
}

function printMatches(matches){
    $.each(matches,function(index){
        $row = $('<div class="row-result"></div>');
        items = this;

        coords = [];
        $.each(items,function(idx2){
           $row.append('<div class="cell-result" style="background-color:'+this.type+'">');
            coords.push('(x: '+this.x+',y: '+this.y+')');
        });

        $('#matrix-matches')
            .append($row)
            .append(coords.join(' '))
            .append('<div class="clearfix"></div>');
    });

}

$(document).on('mousemove',mouseMove);
$(document).on('mousedown',mouseDown);
$(document).on('mouseup',mouseUp);