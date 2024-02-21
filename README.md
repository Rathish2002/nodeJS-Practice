# nodeJS-Practice
//app.js
const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

initilizeDBAndServer()

//API GET method
app.get('/players/', async (request, response) => {
  const getCricketTeamQuery = `
    SELECT 
      *
    FROM 
      cricket_team
    WHERE
      player_id;`
  const cricketTeamArray = await db.all(getCricketTeamQuery)
  response.send(
    cricketTeamArray.map(eachPlayer =>
      convertDbObjectToResponseObject(eachPlayer),
    ),
  )
})

//API POST method
app.post('/players/', async (request, response) => {
  const cricketTeamDetails = request.body
  const {playerName, jerseyNumber, role} = cricketTeamDetails
  const addCricketTeamQuery = `
  INSERT INTO
      cricket_team (playerName,jerseyNumber,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role},
      );`
  const dbResponse = await db.run(addCricketTeamQuery)
  const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})

//API GET method
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const cricketTeamDetails = request.body
  const {playerName, jerseyNumber, role} = cricketTeamDetails
  const updateCricketTeamQuery = `
  UPDATE 
    cricket_team;
  SET
    playerName = ${playerName},
    jerseyNumber = ${jerseyNumber},
    role = ${role}
 WHERE 
    player_id = ${playerId};`
  const getCricketTeam = await db.run(updateCricketTeamQuery)
  response.send(getCricketTeam)
})

//API PUT method
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const cricketTeamDetails = request.body
  const {playerName, jerseyNumber, role} = cricketTeamDetails
  const updateCricketTeamQuery = `
  UPDATE 
    cricket_team;
  SET
    playerName = ${playerName},
    jerseyNumber = ${jerseyNumber},
    role = ${role}
 WHERE 
    player_id = ${playerId};`
  await db.run(updateCricketTeamQuery)
  response.send('Player Details Updated')
})

//API DELETE method
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteCricketTeamQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
  await db.run(deleteCricketTeamQuery)
  response.send('Player Removed')
})

//app.http

GET http://localhost:3000/players/
Content-Type: application/json

###
POST  http://localhost:3000/players/
Content-Type: application/json

{
  "playerName": "Vishal",
  "jerseyNumber": 17,
  "role": "Bowler"
}


###
PUT  http://localhost:3000/players/:playerId/
Content-Type: application/json

###
GET http://localhost:3000/players/:playerId/
Content-Type: application/json

DELETE http://localhost:3000/players/:playerId/
Content-Type: application/json
