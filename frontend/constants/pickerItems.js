/** Constants used for picker items in general notifications settings */

export const hours = Array.from(Array(12).keys(), x => {return { label: x.toString(), value: x }});

export const minutes = Array.from(Array(60).keys(), x => {return { label: x.toString(), value: x }});

export const seatThresholds = Array.from(Array(8).keys(), x => {
    const threshold = x + 1;
    return { label: threshold.toString(), value: threshold }
});