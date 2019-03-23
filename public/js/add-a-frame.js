AFRAME.registerComponent("add-a-frame", {
    schema:
    {

    // hitPoints: {type: 'int', default: 5},
    // dtSinceLastHit: {type: 'float', default: 0.0}
     //isChopped: {type: 'bool', default: false}

    },

    init: function ()
    {

        console.log("starting event listener");
        document.querySelector('#red').addEventListener('click', function() {
            
            let addAFrame = document.querySelector('body');
            let scene = document.createElement('a-scene');

            console.log("working");
            scene.setAttribute('background','color: #1e3254');
            addAFrame.appendChild(scene);

            scene = document.createElement('a-scene');
        

        });



    },

    tick: function()
    {
        // //console.log( this.el.components['object-status'].data.dtSinceLastHit);
        // if(this.el.components['object-status'].data.dtSinceLastHit > 0)
        // {
        //     this.el.components['object-status'].data.dtSinceLastHit =  this.el.components['object-status'].data.dtSinceLastHit - window.DELTA_TIME;
        //     console.log(this.el.components['object-status'].data.dtSinceLastHit);
        // }

        
    }

});
