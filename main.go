package hockey

import (
	"net/http"
)

func init() {
	http.HandleFunc("/_api/players/", handlePlayer)
	http.HandleFunc("/_api/players", handlePlayers)
}
