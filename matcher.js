// taken from https://github.com/richtaur/bombada/blob/master/htdocs/js/match3.js
// removed unnecessary code and improve to count exactly match3,

match3 = (function() {

    var conf = {
        piecesX : 0,
        piecesY : 0
    };
    var pieces = [];

    /**
     * Fetches a configuration setting.
     * @param {String} key The key of the configuration setting to fetch.
     * @return {Object} The value of the configuration setting requested.
     * @method get
     */
    function get(key) {
        return conf[key];
    };

    /**
     * Sets a configuration setting.
     * @param {String} key The key of the configuration setting to set.
     * @param {Object} The value of the configuration key to set.
     * @method set
     */
    function set(key, value) {
        conf[key] = value;
    };

    /**
     * Fetches the pieces array.
     * @return {Array} The pieces array.
     * @method getPieces
     */
    function getPieces() {
        return pieces;
    };

    /**
     * Sets the pieces array.
     * @param {Array} newPieces The pieces array to set.
     * @method setPieces
     */
    function setPieces(newPieces) {
        pieces = newPieces;
    };

    /**
     * Gets the current matches.
     * @param {Boolean} justBool True to simply return true if there are matches, false if not.
     * @return {Array | Boolean} An array of the coordinates of the current matches. Or true/false if justBool is set to true.
     * @method getMatches
     */
    function getMatches(justBool) {

        var matches = [];

        for (var x = 0; x < conf.piecesX; x++) {
            for (var y = 0; y < (conf.piecesY - 2); y++) {

                var type = pieces[y][x];
                var match = [];

                for (var i = y; i < conf.piecesY; i++) {
                    if (pieces[i][x] === type) {
                        match.push({
                            type : type,
                            x : x,
                            y : i
                        });
                        if (match.length == 3) {
                            matches.push(match);
                            match = [];
                            y = i;
                        }
                    } else {
                        break;
                    }
                }

                if (match.length == 3) {
                    y = (i - 1);
                    matches.push(match);
                }

            }
        }

        return (justBool ? !!matches.length : matches);

    };

    /**
     * Indicates if the board has any matches.
     * @return {Boolean} true if there are current matches, otherwise false.
     * @method hasMatches
     */
    function hasMatches() {
        return getMatches(true);
    };

    return {
        get : get,
        set : set,
        getPieces : getPieces,
        setPieces : setPieces,
        getMatches : getMatches,
        hasMatches : hasMatches,
    };

})();