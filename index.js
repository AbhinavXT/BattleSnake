const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  let battlesnakeInfo = {
    apiversion: '1',
    author: 'Abhianv Pathak',
    color: '#85CDCA',
    head: 'shades',
    tail: 'curled',
    version: '1.1'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  let gameData = request.body

  console.log('START')
  response.status(200).send('ok')
}

const nextPos = (head, move) => {
  let newHead = Object.assign({}, head)

  if (move === 'up')
    newHead['y'] = head['y'] + 1
  else if (move === 'down')
    newHead['y'] = head['y'] - 1
  else if (move === 'left')
    newHead['x'] = head['x'] - 1
  else if (move === 'right')
    newHead['x'] = head['x'] + 1
  return newHead
}

const avoidWalls = (nextHead, board) => {
  if (nextHead['x'] < 0 || nextHead['y'] < 0 || nextHead['x'] === board['width'] || nextHead['y'] === board['height']) {
    return false
  }
  return true
}

const avoidSelf = (nextHead, body) => {
  for(let i = 0; i < body.length; i++){
    if(JSON.stringify(body[i]) === JSON.stringify(nextHead))
      return false
  }
  return true
}

const safeMove = (possibleMoves, board, selfSnake) => {
  let okMoves = []

  let head = selfSnake.head
  let body = selfSnake.body
  

  for (let i = 0; i < possibleMoves.length; i++) {
    let nextHead = nextPos(head, possibleMoves[i])
    if (avoidWalls(nextHead, board) && avoidSelf(nextHead, body)) {
      okMoves.push(possibleMoves[i])
    }
  }
  return okMoves
}

function handleMove(request, response) {
  let gameData = request.body
  let possibleMoves = ['up', 'down', 'left', 'right']

  let board = gameData['board']
  let selfSnake = gameData['you']

  let safeMoves = safeMove(possibleMoves, board, selfSnake)
  //console.log('safeMoves=', safeMoves)
  let move = safeMoves[Math.floor(Math.random() * safeMoves.length)]
  
  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
}

function handleEnd(request, response) {
  let gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}
