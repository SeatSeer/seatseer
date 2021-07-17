// Backend URL
const url = `http://44.194.92.99:9200/seats/_search`

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
export const geoSearch = async (latitude, longitude, onSuccess, onFailure) => {
    try {
        const body = {
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
    
        const response = await fetch(url, otherParams);
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

        const response = await fetch(url, otherParams);
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
 *      { "range": { "rating": { "gte": "_value_" } } },
 *      { "term": { "features": "_filterA_" } },
 *      { "term": { "features": "_filterB_" } },
 *      ...
 * ]
 * @param {Function} onSuccess - Action to perform on successfully retrieving the locations from backend.
 * @param {Function} onFailure - Action to perform if retrieval from backend fails.
 */
export const filteredTextSearch = async (query, filters, onSuccess, onFailure) => {
    try {
        let body;
        if (query === "") {
            body = {
                "query": {
                    "bool": {
                        "filter": filters
                    }
                },
                "sort": {
                    "vacant_seats": "desc"
                }
            }
        } else {
            body = {
                "query": {
                    "bool": {
                        "filter": filters,
                        "must": {
                            "dis_max": {
                                "queries": [
                                    { "match_phrase_prefix": { "name": query } },
                                    { "match": { "related": query } }
                                ]
                            }
                        }
                    }
                },
                "sort": {
                    "vacant_seats": "desc"
                }
            }
        }
    
        const otherParams = {
            headers: headers,
            body: JSON.stringify(body),
            method: "POST"
        }
        
        const response = await fetch(url, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

export const transformToMarkers = (results) => {
    return results.hits.hits.map((data, index) => {
        return {
            title: data._source.avatar,
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
            avatar: data._source.avatar,
            seats: data._source.vacant_seats,
            vacancyPercentage: data._source.vacant_seats / data._source.total_seats,
            coordinates: {
                latitude: parseFloat(data._source.location.lat),
                longitude: parseFloat(data._source.location.lon)
            },
            rating: data._source.rating_total / data._source.rating_number,
            comments: data._source.comments,
            filters: data._source.features,
            related: data._source.related
        }
    })
}