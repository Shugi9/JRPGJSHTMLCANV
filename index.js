const canvas = document.querySelector('canvas')
const body = document.querySelector(`body`)
const fullscreenContainer = document.getElementById('fullscreenContainer')
const c = canvas.getContext(`2d`)
function clearCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const overlappingDiv = document.getElementById('overlappingDiv');
const fullscreenButton = document.getElementById('fullscreenButton');



// fullscreenButton.addEventListener('click', function() {
//     requestFullscreen(canvas);;});

canvas.width = 1024
canvas.height = 573


let map = pelletTownMap

const collisionsMap = []
for (let i = 0; i < map.collisions.length; i += map.size.width) {
    collisionsMap.push(map.collisions.slice(i, map.size.width + i))
}


const battleZonesMap = []
for (let i = 0; i < map.battleZones.length; i += map.size.width) {
    battleZonesMap.push(map.battleZones.slice(i, map.size.width + i))
}

const charactersMap = []
for (let i = 0; i < map.characters.length; i += map.size.width) {
    charactersMap.push(map.characters.slice(i, map.size.width + i))
}

const enemiesMap = []
for (let i = 0; i < map.enemies.length; i += map.size.width) {
    enemiesMap.push(map.enemies.slice(i, map.size.width + i))
}

const mapTravelsMap = []
for (let i = 0; i < map.mapTravels.length; i += map.size.width) {
    mapTravelsMap.push(map.mapTravels.slice(i, map.size.width + i))

}
console.log(mapTravelsMap)

let boundaries = []
let offset = {
    x: map.offset.x,
    y: map.offset.y
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol !== 0)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

let battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y - 10,
                    }
                })
            )
    })
})


let mapTravels = []
let characters = []
let enemies = []

const villagerImg = new Image()
villagerImg.src = './img/villager/Idle.png'

const oldMan = new Image()
oldMan.src = './img/oldman/Idle.png'

let rabbitEnemyImage = new Image();
rabbitEnemyImage.src = './img/rabbitEnemy.png';







charactersMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1026) {
            characters.push(
                new Character({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    },
                    image: villagerImg,
                    frames: {
                        max: 4,
                        hold: 80
                    },
                    scale: 3,
                    animate: true,
                    dialogue: [`...`, 'Hey mister, have you seen my Doggochu?']
                }))
        } else if (symbol === 1030) {
            characters.push(
                new Character({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    },
                    image: oldMan,
                    frames: {
                        max: 4,
                        hold: 80
                    },
                    scale: 3,
                    animate: false,
                    dialogue: [`My bones hurt`]
                })
            )
        }
        if (symbol !== 0)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )

    })
})

let enemy = new Enemy({
    position: { x: 100, y: 100 },
    velocity: { x: 1, y: 1 },
    image: rabbitEnemyImage,
    frames: { max: 2, hold: 10 },
    animate: true,
    health: 50,
    level: 1,
    attacks: [

    ]
})

enemiesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1045) {
            enemies.push(
                new Enemy({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    },
                    image: rabbitEnemyImage,
                    frames: {
                        max: 2,
                        hold: 10
                    },
                    scale: .33,
                    animate: true,
                }))
        } if (symbol !== 0)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )

    })
})



mapTravelsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol !== 0)
            mapTravels.push(
                new MapTravel({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    },
                    travelTo: pelletTownBoatTravelFunction
                })
            )
    })
})




const mapImage = new Image()
mapImage.src = map.backgroundImage

const foregroundImage = new Image()
foregroundImage.src = map.foregroundImage

let playerDownImage = new Image()
playerDownImage.src = `./img/playerDown.png`

let playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

let playerLeftImage = new Image()
playerLeftImage.src = `./img/playerLeft.png`

let playerRightImage = new Image()
playerRightImage.src = `./img/playerRight.png`

let player = new Sprite({
    position: {
        x: canvas.width / 2 - 24,
        y: canvas.height / 2 + 34
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 20
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage,
    }
})

let background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: mapImage
})

let foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage
})

let keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

let moveables = [background, ...boundaries, foreground, ...battleZones, ...characters, ...mapTravels, ...enemies]
let renderables = [background,
    ...boundaries,
    ...battleZones,
    ...characters,
    player,
    foreground,
    ...mapTravels,
    ...enemies]


const battle = {
    initiated: false
}

let moving = true

function animate() {
    const animationID = window.requestAnimationFrame(animate)
    renderables.forEach((renderable) => {
        renderable.draw()
    })



    player.animate = false

    if (battle.initiated) return

    //activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea =
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                ) -
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) -
                    Math.max(player.position.y, battleZone.position.y))
            if (rectangularCollision({ rectangle1: player, rectangle2: battleZone }) && overlappingArea > (player.width * player.height) / 2.3 && (Math.random() <= .01)
            ) {

                // deactivate current animation loop
                window.cancelAnimationFrame(animationID)

                audio.Map.stop()
                audio.initBattle.play()
                audio.battle.play()
                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to(`#overlappingDiv`, {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                gsap.to(`#overlappingDiv`, {
                                    opacity: 0,
                                    duration: 0.4,
                                    onComplete() {
                                        initBattle(currentMapMonsters, myEquippedMonster, 2, 3)
                                        animateBattle()
                                    }

                                })

                            }
                        })
                        //activate new animation loop 
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < mapTravels.length; i++) {
            const mapTravel = mapTravels[i]
            const overlappingArea =
                (Math.min(
                    player.position.x + player.width,
                    mapTravel.position.x + mapTravel.width
                ) -
                    Math.max(player.position.x, mapTravel.position.x)) *
                (Math.min(player.position.y + player.height,
                    mapTravel.position.y + mapTravel.height
                ) -
                    Math.max(player.position.y, mapTravel.position.y))
            if (rectangularCollision({ rectangle1: player, rectangle2: mapTravel }) && overlappingArea > (player.width * player.height) / 2.3) {
                window.cancelAnimationFrame(animationID)
                map = theBayMap
                nextMap = theBayMap
                renderables = []
                moveables = []

                let nextMapBackgroundImage = new Image()
                nextMapBackgroundImage.src = nextMap.backgroundImage

                let nextMapBackground = new Sprite({
                    position: {
                        x: nextMap.offset.x,
                        y: nextMap.offset.y
                    },
                    image: nextMapBackgroundImage
                })
                background = nextMapBackground
                renderables.push(nextMapBackground)


                let nextMapBoundaries = []
                let offset = {
                    x: nextMap.offset.x,
                    y: nextMap.offset.y
                }

                let nextMapCollisionsMap = []

                for (let i = 0; i < nextMap.collisions.length; i += nextMap.size.width) {
                    nextMapCollisionsMap.push(nextMap.collisions.slice(i, nextMap.size.width + i))
                }

                nextMapCollisionsMap.forEach((row, i) => {
                    row.forEach((symbol, j) => {
                        if (symbol !== 0)
                            nextMapBoundaries.push(
                                new Boundary({
                                    position: {
                                        x: j * Boundary.width + offset.x,
                                        y: i * Boundary.height + offset.y
                                    }
                                })
                            )
                    })
                })
                boundaries = nextMapBoundaries
                renderables.push(...nextMapBoundaries)

                let nextMapBattleZonesMap = []
                for (let i = 0; i < nextMap.battleZones.length; i += nextMap.size.width) {
                    nextMapBattleZonesMap.push(nextMap.battleZones.slice(i, nextMap.size.width + i))
                }

                let nextMapBattleZones = []
                nextMapBattleZonesMap.forEach((row, i) => {
                    row.forEach((symbol, j) => {
                        if (symbol === 1025)
                            nextMapBattleZones.push(
                                new Boundary({
                                    position: {
                                        x: j * Boundary.width + offset.x,
                                        y: i * Boundary.height + offset.y - 10,
                                    }
                                })
                            )
                    })
                })

                battleZones = nextMapBattleZones
                renderables.push(...nextMapBattleZones)


                let nextMapCharactersMap = []
                for (let i = 0; i < nextMap.characters.length; i += nextMap.size.width) {
                    nextMapCharactersMap.push(nextMap.characters.slice(i, nextMap.size.width + i))
                }

                let nextMapCharacters = []

                nextMapCharactersMap.forEach((row, i) => {
                    row.forEach((symbol, j) => {
                        if (symbol === 1026) {
                            nextMapCharacters.push(
                                new Character({
                                    position: {
                                        x: j * Boundary.width + offset.x,
                                        y: i * Boundary.height + offset.y,
                                    },
                                    image: villagerImg,
                                    frames: {
                                        max: 4,
                                        hold: 80
                                    },
                                    scale: 3,
                                    animate: true,
                                    dialogue: [`...`, 'Hey mister, have you seen my Doggochu?']
                                }))
                        } else if (symbol === 1030) {
                            nextMapCharacters.push(
                                new Character({
                                    position: {
                                        x: j * Boundary.width + offset.x,
                                        y: i * Boundary.height + offset.y,
                                    },
                                    image: oldMan,
                                    frames: {
                                        max: 4,
                                        hold: 80
                                    },
                                    scale: 3,
                                    animate: false,
                                    dialogue: [`My bones hurt`]
                                })
                            )
                        }
                        if (symbol !== 0)
                            nextMapBoundaries.push(
                                new Boundary({
                                    position: {
                                        x: j * Boundary.width + offset.x,
                                        y: i * Boundary.height + offset.y
                                    }
                                })
                            )

                    })
                })

                renderables.push(...nextMapCharacters)
                characters = nextMapCharacters

                // let player = new Sprite({
                //     position: {
                //         x: canvas.width / 2 - 24,
                //         y: canvas.height / 2 + 34
                //     },
                //     image: playerDownImage,
                //     frames: {
                //         max: 4,
                //         hold: 20
                //     },
                //     sprites: {
                //         up: playerUpImage,
                //         left: playerLeftImage,
                //         right: playerRightImage,
                //         down: playerDownImage,
                //     }
                // })

                renderables.push(player)


                let nextMapForegroundImage = new Image()
                nextMapForegroundImage.src = nextMap.foregroundImage

                let nextMapForeground = new Sprite({
                    position: {
                        x: nextMap.offset.x,
                        y: nextMap.offset.y,
                    },
                    image: nextMapForegroundImage
                })

                renderables.push(nextMapForeground)
                foreground = nextMapForeground

                let nextMapTravelsMap = []
                for (let i = 0; i < nextMap.mapTravels.length; i += nextMap.size.width) {
                    nextMapTravelsMap.push(nextMap.mapTravels.slice(i, nextMap.size.width + i))

                }

                let nextMapTravels = []

                nextMapTravelsMap.forEach((row, i) => {
                    row.forEach((symbol, j) => {
                        if (symbol !== 0)
                            nextMapTravels.push(
                                new MapTravel({
                                    position: {
                                        x: j * Boundary.width + offset.x,
                                        y: i * Boundary.height + offset.y
                                    },
                                    travelTo: pelletTownBoatTravelFunction
                                })
                            )
                    })
                })

                renderables.push(...nextMapTravels)
                mapTravels = nextMapTravels


                moveables.push(nextMapBackground, ...nextMapBoundaries, nextMapForeground, ...nextMapBattleZones, ...nextMapCharacters, ...nextMapTravels)

                clearCanvas()
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                        gsap.to('#overlappingDiv', {
                            opacity: 0
                        })

                        animate()

                    }
                })
            }
        }
    }







    if (keys.w.pressed) {
        player.animate = true
        player.image = player.sprites.up
        moving = true
        checkForCharacterCollision({ characters, player, characterOffset: { x: 0, y: 3 } })
        checkForBoundaryCollision({ boundaries, player, boundaryOffset: { x: 0, y: 3 } })

        if (moving)
            moveables.forEach((moveable) => {
                moveable.position.y += 3
            })

    } if (keys.a.pressed) {
        player.animate = true
        player.image = player.sprites.left
        moving = true

        checkForCharacterCollision({ characters, player, characterOffset: { x: 3, y: 0 } })
        checkForBoundaryCollision({ boundaries, player, boundaryOffset: { x: 3, y: 0 } })

        if (moving)
            moveables.forEach((moveable) => {
                moveable.position.x += 3
            })
    } if (keys.d.pressed) {
        player.animate = true
        player.image = player.sprites.right
        moving = true
        checkForCharacterCollision({ characters, player, characterOffset: { x: -3, y: 0 } })
        checkForBoundaryCollision({ boundaries, player, boundaryOffset: { x: -3, y: 0 } })

        if (moving)
            moveables.forEach((moveable) => {
                moveable.position.x -= 3
            })

    } if (keys.s.pressed) {
        player.animate = true
        player.image = player.sprites.down
        moving = true
        checkForCharacterCollision({ characters, player, characterOffset: { x: 0, y: -3 } })
        checkForBoundaryCollision({ boundaries, player, boundaryOffset: { x: 0, y: -3 } })
        if (moving)
            moveables.forEach((moveable) => {
                moveable.position.y -= 3
            })
    }

}





animate()




window.addEventListener(`keydown`, (e) => {
    if (player.isInteracting) {
        switch (e.key) {
            case ' ':
                player.interactionAsset.dialogueIndex++

                const { dialogueIndex, dialogue } = player.interactionAsset
                if (dialogueIndex <= dialogue.length - 1) {
                    document.querySelector('#characterDialogueBox').innerHTML = player.interactionAsset.dialogue[dialogueIndex]
                    return
                }

                player.isInteracting = false
                player.interactionAsset.dialogueIndex = 0
                document.querySelector('#characterDialogueBox').style.display = 'none'

                break
        }
        return
    }
    switch (e.key) {
        case ' ':
            if (!player.interactionAsset) return
            //beginning conversation
            const firstMessage = player.interactionAsset.dialogue[0]

            document.querySelector('#characterDialogueBox').innerHTML = firstMessage
            document.querySelector('#characterDialogueBox').style.display = 'flex'
            player.isInteracting = true
            break
        case `w`:
            keys.w.pressed = true
            break
        case `a`:
            keys.a.pressed = true
            break
        case `s`:
            keys.s.pressed = true
            break
        case `d`:
            keys.d.pressed = true
            break
    }
})

window.addEventListener(`keyup`, (e) => {
    switch (e.key) {

        case `w`:
            keys.w.pressed = false
            break
        case `a`:
            keys.a.pressed = false
            break
        case `s`:
            keys.s.pressed = false
            break
        case `d`:
            keys.d.pressed = false
            break
    }
})
// switch statements for movement

let fullscreen = false
let clicked = false
addEventListener('click', () => {
    if (!clicked)
        audio.Map.play()
    clicked = true
})