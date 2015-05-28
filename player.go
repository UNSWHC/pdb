package hockey

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"appengine"
	"appengine/datastore"
)

const (
	queryKey         = "q"
	playerEntityKind = "Player"
)

type PlayerWithId struct {
	Id string `json:"id"`
	Player
}

type Player struct {
	FirstName       string    `json:"firstName"`
	LastName        string    `json:"lastName"`
	Sex             string    `json:"sex"`
	RecordedYears   []int     `json:"recordedYears"`
	UnrecordedYears int       `json:"unrecordedYears"`
	DateOfBirth     time.Time `json:"dob"`
}

// /players/:playerId
func handlePlayer(w http.ResponseWriter, r *http.Request) {
	id := strings.Split(r.URL.Path, "/")[3]

	key, err := datastore.DecodeKey(id)
	if err != nil || !validatePlayerKey(key) {
		http.Error(w, "Error decoding", http.StatusBadRequest)
		return
	}

	if r.Method == "GET" {
		getPlayer(w, r, key)
	} else {
		postPlayer(w, r, key)
	}
}

// Returns JSON encoded result for player with player id :playerId
// GET /players/:playerId
func getPlayer(w http.ResponseWriter, r *http.Request, key *datastore.Key) {
	c := appengine.NewContext(r)
	var p Player
	if err := datastore.Get(c, key, &p); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(p)
}

// Updates the player with player id :playerId. The new data is in the
// HTTP request body.
// POST /players/:playerId
func postPlayer(w http.ResponseWriter, r *http.Request, key *datastore.Key) {
	c := appengine.NewContext(r)
	var p Player

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Error decoding", http.StatusBadRequest)
		return
	}

	if _, err := datastore.Put(c, key, &p); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// /players
func handlePlayers(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		getPlayers(w, r)
	} else {
		postPlayers(w, r)
	}
}

// Performs a search over all players with the query parameter provided in the
// form data for the key "q". Returns JSON encoded array of PlayerWithId
// objects.
// GET /players
func getPlayers(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	query := r.FormValue(queryKey)

	// TODO: Actually do a query here instead of returning everyone.
	if query == "" {
		c.Debugf("no query")
	} else {
		c.Debugf("query : %q", query)
	}

	q := datastore.NewQuery(playerEntityKind).Ancestor(playerDatabaseKey(c))

	var players []Player

	keys, err := q.GetAll(c, &players)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	playersWithIds := make([]PlayerWithId, len(players))
	for i, p := range players {
		playersWithIds[i] = PlayerWithId{
			keys[i].Encode(),
			p,
		}
	}
	json.NewEncoder(w).Encode(playersWithIds)
}

// Inserts a new player into the database. The data for the new player is
// provided JSON encoded in the HTTP request body. The body of the response
// is the key of the created player.
// POST /players
func postPlayers(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	incompleteKey := datastore.NewIncompleteKey(c, playerEntityKind, playerDatabaseKey(c))
	var p Player

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Error decoding", http.StatusBadRequest)
		return
	}

	key, err := datastore.Put(c, incompleteKey, &p)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write([]byte(key.Encode()))
}

func validatePlayerKey(k *datastore.Key) bool {
	return k.Kind() == playerEntityKind
}

// Helper functions
func playerDatabaseKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "PlayerDatabse", "default_player_database", 0, nil)
}

// 	q := datastore.NewQuery("Player").Ancestor(playerDatabaseKey(c)).Filter("FullNameLower >=", name).Filter("FullNameLower <", name+"\ufffd").Limit(10)
// 	var players []Player

// var players = map[string]Player{
// 	"a": {
// 		FirstName:   "Stephen",
// 		LastName:    "Broadfoot",
// 		Sex:         "Male",
// 		RecordedYears: []int{2014},
// 		UnrecordedYears: 4,
// 		DateOfBirth: time.Date(1990, time.August, 24, 0, 0, 0, 0, time.UTC),
// 	},
// 	"b": {
// 		FirstName:   "Matthew",
// 		LastName:    "Webb",
// 		Sex:         "Male",
// 		RecordedYears: []int{2013},
// 		UnrecordedYears: 8,
// 		DateOfBirth: time.Date(1988, time.March, 2, 0, 0, 0, 0, time.UTC),
// 	},
// 	"c": {
// 		FirstName:   "Corinne",
// 		LastName:    "Rochester",
// 		Sex:         "Female",
// 		RecordedYears: []int{2014, 2013},
// 		UnrecordedYears: 5,
// 		DateOfBirth: time.Date(1992, time.June, 22, 0, 0, 0, 0, time.UTC),
// 	},
// 	"d": {
// 		FirstName:   "Nicola",
// 		LastName:    "Cole",
// 		Sex:         "Female",
// 		RecordedYears: []int{2014},
// 		UnrecordedYears: 3,
// 		DateOfBirth: time.Date(1987, time.September, 12, 0, 0, 0, 0, time.UTC),
// 	},
// }
