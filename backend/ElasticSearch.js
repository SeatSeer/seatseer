// Backend URL
const url = `http://44.194.92.99:9200/seats`

// Headers to use in URL
const headers = {
    "Content-Type": "application/json",
}

/**
 * Retrieves locations from the backend sorted by proximity to the geographical coordinates specified and performs an action with the information retrieved.
 * @param {Number} latitude - Latitude to be passed into the query.
 * @param {Number} longitude - Longitude to be passed into the query.
 * @param {Function} onSuccess - Action to perform on successfully retrieving the locations from backend.
 * @param {Function} onFailure - Action to perform if retrieval from backend fails.
 */
export const geoSearch = async (latitude, longitude, from, size, onSuccess, onFailure) => {
    try {
        const body = {
            "from": from,
            "size": size,
            "sort": [ {
                "_geo_distance" : {
                    "location" : {
                        "lat" : latitude,
                        "lon" : longitude
                    },
                    "order" : "asc",
                    "unit" : "km"
                }
            }],
            "query": {
                "match_all": {}
            }
        }
    
        const otherParams = {
            headers: headers,
            body: JSON.stringify(body),
            method: "POST"
        }
    
        const response = await fetch(`${url}/_search`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

/**
 * Retrieves specified locations from the backend using location ID and performs an action with the information retrieved.
 * @param {Array} locationIds - An array of the location IDs we want to retrieve from the backend.
 * @param {Function} onSuccess - Action to perform on successfully retrieving the locations from backend.
 * @param {Function} onFailure - Action to perform if retrieval from backend fails.
 */
export const idSearch = async (locationIds, onSuccess, onFailure) => {
    try {
        const body = {
            "query": {
                "terms": {
                    "ID": locationIds
                }
            }
        }

        const otherParams = {
            headers: headers,
            body: JSON.stringify(body),
            method: "POST"
        }

        const response = await fetch(`${url}/_search`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

/**
 * Retrieves locations from the backend sorted by how similar it is to the query and filters, then
 * sorts them by seat vacancy and performs an action with the information retrieved.
 * @param {String} query - The text search query.
 * @param {Array} filters - An array of filters to be passed into the query. It is of the following format:
 * [
 *      { "range": { "rating": { "gte": "_value_" } } },    // default must be 0
 *      { "range": { "seatingSize": { "gte": "_value_" } } },   // default must be 1
 *      { "term": { "features": "_filterA_" } },
 *      { "term": { "features": "_filterB_" } },
 *      ...
 * ]
 * Currently available filters are:
 * air con
 * wifi
 * less crowded
 * less noisy
 * snacks and drinks nearby
 * power plugs
 * nature view
 * city view
 * near to mrt
 * @param {Function} onSuccess - Action to perform on successfully retrieving the locations from backend.
 * @param {Function} onFailure - Action to perform if retrieval from backend fails.
 */
export const filteredTextSearch = async (query, filters, from, size, onSuccess, onFailure) => {
    try {
        let body;
        if (query === "") {
            body = {
                "from": from,
                "size": size,
                "query": {
                    "bool": {
                        "filter": filters
                    }
                },
                "sort": {
                    "vacant": "desc"
                }
            }
        } else {
            body = {
                "from": from,
                "size": size,
                "query": {
                    "bool": {
                        "filter": filters,
                        "must": [{ "match_phrase": { "name": query } }]
                    }
                },
                "sort": {
                    "vacant": "desc"
                }
            }
        }
    
        const otherParams = {
            headers: headers,
            body: JSON.stringify(body),
            method: "POST"
        }
        
        const response = await fetch(`${url}/_search`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

export const filterLetters = {
    "aircon": "A",
    "wifi": "B",
    "lessCrowded": "C",
    "lessNoisy": "D",
    "snacksAndDrinksNearby": "E",
    "powerPlugs": "F",
    "natureView": "G",
    "cityView": "H",
    "nearToMrt": "I",
}

export const filterWords = {
    "A": "Air con",
    "B": "Wifi",
    "C": "Less Crowded",
    "D": "Less Noisy",
    "E": "Snacks and drinks nearby",
    "F": "Power plugs",
    "G": "Nature view",
    "H": "City view",
    "I": "Near To Mrt"
}

export const checkValidLocationId = (results) => {
    return results.hits.hits.length > 0;
}

export const checkValidSeatId = (results, seatId) => {
    if (results.hits.hits.length) {
        return results.hits.hits[0]._source.total >= Number(seatId);
    } else {
        return false;
    }
}

export const transformToMarkers = (results) => {
    return results.hits.hits.map((data, index) => {
        return {
            title: data._source.id,
            description: data._source.name,
            coordinates: {
                latitude: parseFloat(data._source.location.lat),
                longitude: parseFloat(data._source.location.lon)
            }
        }
    })
}

export const transformToPanels = (results) => {
    return results.hits.hits.map((data, index) => {
        return {
            id: data._source.ID,
            name: data._source.name,
            seats: data._source.vacant,
            vacancyPercentage: data._source.vacant / data._source.total,
            coordinates: {
                latitude: parseFloat(data._source.location.lat),
                longitude: parseFloat(data._source.location.lon)
            },
            rating: data._source.rating,
            ratingInfo: data._source.ratingInfo,
            comments: data._source.comments,
            filters: data._source.features,
            seatingSize: data._source.seatingSize,
        }
    })
}

export const extractComments = (results) => {
    return results.hits.hits.map(data => data._source.comments)
}

export const sendRatingToElasticSearch = async (rating, locationId, onSuccess, onFailure) => {
    try {
        const body = {
            "script": {
                "source": "int total = Integer.parseInt(ctx._source.ratingInfo[1]); total += params.increment; ctx._source.ratingInfo[1] = total; int num = Integer.parseInt(ctx._source.ratingInfo[0]); num++; ctx._source.ratingInfo[0] = num; ctx._source.rating = (total*100/num)/100.0;",
                "lang": "painless",
                "params": {
                    "increment": rating
                }
            }
        }

        const otherParams = {
            headers: headers,
            body: JSON.stringify(body),
            method: "POST"
        }

        const response = await fetch(`${url}/seat/${locationId}/_update`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

export const sendCommentToElasticSearch = async (username, rating, comment, locationId, onSuccess, onFailure) => {
    try {
        const body = {
            "script": {
                "source": "int size = ctx._source.comments.length; String[] aft = new String[size+1]; for (int i = 0; i < size; i++) { aft[i] = ctx._source.comments[i]; } aft[size] = params.comment; ctx._source.comments = aft;",
                "lang": "painless",
                "params": {
                    "comment": `${username}\`${rating}\`${comment}`
                }
            }
        }

        const otherParams = {
            headers: headers,
            body: JSON.stringify(body),
            method: "POST"
        }

        const response = await fetch(`${url}/seat/${locationId}/_update`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

export const hardcodedGeoSearch = (onSuccess, onFailure) => {
    const data = {
        hits: {
            hits: [
                {
                    _source: {
                        ID: "AA1",
                        name: "LOCATION 1",
                        vacant: "5",
                        total: "20",
                        location: {
                            lat: "1.3742895697749762",
                            lon: "103.8701888554675",
                        },
                        rating: "5",
                        ratingInfo: [1, 5],
                        commments: ["Username\`5\`This is a comment"],
                        features: ["A", "B", "C"],
                        seatingSize: "2",
                    }
                },
            ]
        }
    }
    return onSuccess(data);
}