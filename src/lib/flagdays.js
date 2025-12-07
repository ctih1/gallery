let flagDays = {
    january: {
        1: true,
        6: true,
        18: true,
        19: true,
        27: true
    },
    februry: {
        5: true,
        6: true,
        14: true,
        28: true
    },
    march: {
        8: true,
        19: true,
        20: true // kevätpäiväntasaus
    },
    april: {
        4: true,
        9: true,
        27: true
    },
    may: {
        1: true,
        9: true,
        12: true
    },
    june: {
        4: true,
        20: true,
        27: true
    },
    july: {
        6: true
    },
    september: {
        23: true
    },
    october: {
        1: true,
        10: true,
        24: true
    },
    november: {
        6: true,
        20: true
    },
    december: {
        6: true,
        8: true,
        25: true,
        26: true,
        27: true,
        28: true
    }
};

class flagDay {
    // please forgive me for my sins
    constructor(day, weekDay, month) {
        console.log(day, weekDay, month);
        this.day = day;
        this.weekDay = weekDay;
        this.month = month;
    }
    is() {
        try {
            if (flagDays[this.month][this.day]) {
                return true;
            }
        } catch (error) {} // so js doesnt kill itself

        switch (this.month) {
            case "february":
                if (this.day >= 2 && this.day <= 8 && this.weekDay === "sunday") {
                    // kynttiläpäivä
                    return true;
                }
                if (this.day === 29) {
                    return true;
                }
                break;
            case "march":
                if (this.day >= 22 && this.day <= 28 && this.weekDay === "sunday") {
                    //Marian ilmestymispäivä
                    return true;
                }
                if (this.day >= 25 && this.day <= 31 && this.weekDay === "sunday") {
                    return true;
                }
                break;
            case "may":
            case "november":
                if (this.day >= 7 && this.day <= 15 && this.weekDay === "sunday") {
                    this.month === "may"
                        ? console.log("Happy mothers day")
                        : console.log("Happy fathers day");
                    return true;
                }

                if (
                    this.day >= 19 &&
                    this.day <= 25 &&
                    this.weekDay === "sunday" &&
                    this.month === "may"
                ) {
                    return true;
                }

                break;
            case "june":
                if (this.day >= 20 && this.day <= 26 && this.weekDay === "saturday") {
                    console.log("Happy midsummers day");
                    return true;
                }
                break;

            case "august":
                if (this.day >= 24 && this.day <= 31 && this.weekDay === "saturday") {
                    console.log("Happy nature's day");
                }
                break;
        }
        return false;
    }
}

let date = new Date();

const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
];

export let isFlagDay = new flagDay(
    date.getDate(),
    date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
    monthNames[date.getMonth()]
).is();
