const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const socketIO  = require('socket.io')(server); //hello I am new

const LISTEN_PORT = 8080; //make sure greater than 3000. Some ports are reserved/blocked by firewall ...

let position1Colour = {r:255, g:0, b:0};
let position2Colour = {r:255, g:0, b:0};
let position3Colour = {r:255, g:0, b:0};
let lockedIn = false;
let position1 = false;
let position2 = false;
let position3 = false;
let allCorrect = false;
let rounds = 0;
let numUsers = 0;
let IDs = {};
let completed = {};

app.use((express.static(__dirname + '/public'))); //set root dir to the public folder

//routes
app.get('/color', function(req,res) {
    res.sendFile(__dirname + '/public/color.html');
});

app.get('/controller', function(req,res) {
    res.sendFile(__dirname + '/public/controller.html');
});

app.get('/player', function(req,res) {
    res.sendFile(__dirname + '/public/player.html');
});

//websocket stuff
socketIO.on('connection', function(socket) {
    console.log(socket.id + ' has connected!');
    IDs[numUsers] = socket.id;
    numUsers += 1;

    socket.on('disconnect', function(data) {
        console.log(socket.id + ' has disconnected');
        for(let num in IDs)
        {
            if(IDs[num] == socket.id)
            {
                delete IDs[num];
                numUsers -= 1;
                break;
            }
        }
        
    });

    //custom events
    //socket = one client
    //socketIO.sockets = all clients
    socket.on('redp1', function(data) {
        if(!lockedIn)
        {
            position1Colour = {r:255, g:0, b:0};
        }
       
    });
    socket.on('redp2', function(data) {
        if(!lockedIn)
        {
            position2Colour = {r:255, g:0, b:0};
        }
    });
    socket.on('redp3', function(data) {
        if(!lockedIn)
        {
            positio31Colour = {r:255, g:0, b:0};
        }
    });


    socket.on('greenp1', function(data) {
        if(!lockedIn)
        {
            position1Colour = {r:0, g:255, b:0};
        }
    });
    socket.on('greenp2', function(data) {
        if(!lockedIn)
        {
            position2Colour = {r:0, g:255, b:0};
        }
    });
    socket.on('greenp3', function(data) {
        if(!lockedIn)
        {
            position3Colour = {r:0, g:255, b:0};
        }
    });

    socket.on('bluep1', function(data) {
        if(!lockedIn)
        {
            position1Colour = {r:0, g:0, b:255};
        }
    });
    socket.on('bluep2', function(data) {
        if(!lockedIn)
        {
            position2Colour = {r:0, g:0, b:255};
        }
    });
    socket.on('bluep3', function(data) {
        if(!lockedIn)
        {
            position3Colour = {r:0, g:0, b:255};
        }
    });

     socket.on('yellowp1', function(data) {
        if(!lockedIn)
        {
            position1Colour = {r:255, g:255, b:0};
        }
    });
    socket.on('yellowp2', function(data) {
        if(!lockedIn)
        {
            position2Colour = {r:255, g:255, b:0};
        }
    });
    socket.on('yellowp3', function(data) {
        if(!lockedIn)
        {
            position3Colour = {r:255, g:255, b:0};
        }
    });

    socket.on('confirm', function(data) {
       
        if(!lockedIn)
        {
            console.log('locked in colour code');
            lockedIn = true;
            let positionColours = {
                pos1Colour: position1Colour,
                pos2Colour: position2Colour,
                pos3Colour: position3Colour
                
            }
            
            let positionColoursJSON = JSON.stringify(positionColours);
            if(allCorrect)
            {
                socketIO.sockets.emit('newgame', positionColoursJSON);

            }
            else
            {
                socketIO.sockets.emit('color_change', positionColoursJSON);                

            }
        }
     
    });
    socket.on('guess', function(data) {
       
        let guessColours = JSON.parse(data);

        if(lockedIn)
        {

            if(position1Colour.r == guessColours.pos1Colour.r && position1Colour.g == guessColours.pos1Colour.g && position1Colour.b == guessColours.pos1Colour.b)
            {
              
                position1 = true;
                console.log("position 1 correct");
                socketIO.sockets.connected[socket.id].emit('position1Correct'); 
                
                //socketIO.sockets.emit('position1Correct', idJSON);
            }
            else 
            {
                position1 = false;
               // console.log(position1Colour.r);
                //console.log(guessColours.pos1Colour.r);
                console.log("position 1 NOT correct");
                socketIO.sockets.connected[socket.id].emit('position1NOTCorrect'); 

            }
            if (position2Colour.r == guessColours.pos2Colour.r && position2Colour.g == guessColours.pos2Colour.g && position2Colour.b == guessColours.pos2Colour.b)
            {
                position2 = true;
                console.log("position 2 correct");
                socketIO.sockets.connected[socket.id].emit('position2Correct');

            }
            else
            {
                position2 = false;
                console.log("position 2 NOT correct");
                socketIO.sockets.connected[socket.id].emit('position2NOTCorrect'); 

            }
            if(position3Colour.r == guessColours.pos3Colour.r && position3Colour.g == guessColours.pos3Colour.g && position3Colour.b == guessColours.pos3Colour.b)
            {
                position3 = true;
                console.log("position 3 correct");
                socketIO.sockets.connected[socket.id].emit('position3Correct'); 
                
            }
            else
            {
                position3 = false;
                console.log("position 3 NOT correct");
                socketIO.sockets.connected[socket.id].emit('position3NOTCorrect'); 

            }
            //let positionColoursJSON = JSON.stringify(positionColours);

            if(position1 && position2 && position3)
            {
                //allCorrect = true;
                console.log(socket.id + " got all correct!!!!");

                socketIO.sockets.connected[socket.id].emit('allCorrect'); 
                rounds += guessColours.numGuesses;

                //lockedIn = false;
            }

            for(let num in IDs)
            {
                socketIO.sockets.connected[IDs[num]].emit('checkstatus'); 
            
            }

            if(allCorrect)
            {
                score = rounds / numUsers;
                let DataJSON = JSON.stringify(score);

                socketIO.sockets.emit('score', DataJSON);
                //if everyone in the server completes
                //add up score and start new game
            }

            //socketIO.sockets.emit('color_change', positionColoursJSON);
        }
     
    });

    socket.on('updatestatus', function(data) {

        let isFinished = JSON.parse(data);

        if (isFinished) 
        {
            console.log("player is finished");
            
            for (let num in IDs)
            {
                if (IDs[num] == socket.id)
                {
                    completed[num] = true;

                }
                else 
                {
                    completed[num] = false;

                }
            }

            for(let num in IDs)
            {
                
                if(completed[num] == true)
                {
                    allCorrect = true;
                }
                else
                {
                    allCorrect = false;
                    break;
                }

            }
           lockedIn =  false;
        }

    });

 
});

//finally, start server
server.listen(LISTEN_PORT);
console.log('listening to port: ' + LISTEN_PORT);