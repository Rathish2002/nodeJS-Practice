const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const dbPath = path.join(__dirname, 'cricketTeam.db')

const app = express()

app.use(express.json())

let database = null

const initilizeDBAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => console.log('SUCCESS'))
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initilizeDBAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

//API GET method

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT 
      *
    FROM 
      cricket_team;`
  const playersArray = await database.all(getPlayersQuery)
  response.send(
    playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

//API POST method

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const postPlayerQuery = `
  INSERT INTO
      cricket_team (player_name, jersey_number, role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role}
      );`
  await database.run(postPlayerQuery)
  response.send('Player Added to Team')
})

//API GET method

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const updateCricketTeamQuery = `
  SELECT 
    *
  FROM
    cricket_team;
 WHERE 
    player_id = ${playerId};`
  const getCricketTeam = await database.get(updateCricketTeamQuery)
  response.send(convertDbObjectToResponseObject(getCricketTeam))
})

//API PUT method

app.put('/players/:playerId/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const {playerId} = request.params
  const updatePlayerQuery = `
  UPDATE 
    cricket_team;
  SET
    player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
 WHERE 
    player_id = ${playerId};`
  await database.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

//API DELETE method

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
    DELETE 
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
  await database.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
