const headers = {
    "Content-Type": "application/vnd.kafka.json.v2+json"
}

const url = "http://34.226.154.172:8082/topics"

export const addToKafkaNotifications = async (userID, expoPushToken, roomID, onSuccess, onFailure) => {
    try {
        const body = {
            "records": [{ "value": { queryType: 'add', userID, expoPushToken, roomID } }]
        }

        const otherParams = {
            headers,
            body: JSON.stringify(body),
            method: 'POST'
        }

        const response = await fetch(`${url}/UserNotifications`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

export const deleteFromKafkaNotifications = async (userID, expoPushToken, roomID, onSuccess, onFailure) => {
    try {
        const body = {
            "records": [{ "value": { queryType: 'delete', userID, expoPushToken, roomID } }]
        }

        const otherParams = {
            headers,
            body: JSON.stringify(body),
            method: 'POST'
        }

        const response = await fetch(`${url}/UserNotifications`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}

export const updateKafkaNotifications = async (userID, expoPushToken, timeLimitHours, timeLimitMinutes, thresholdVacancy, groupedSeats, onSuccess, onFailure) => {
    try {
        const body = {
            "records": [{ "value": { queryType: 'change', userID, expoPushToken, timeLimitHours, timeLimitMinutes, thresholdVacancy, groupedSeats } }]
        }

        const otherParams = {
            headers,
            body: JSON.stringify(body),
            method: 'POST'
        }

        const response = await fetch(`${url}/UserNotifications`, otherParams);
        const data = await response.json();
        return onSuccess(data);
    } catch (error) {
        return onFailure(error);
    }
}